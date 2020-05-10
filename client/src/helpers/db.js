import { db } from "../services/firebase";
import moment from "moment";

export const getAllKeywords = async () => {
  console.log("called");
  try {
    const keywordsRef = db.collection("keywords");
    const KeywordsDoc = await keywordsRef.get();
    return KeywordsDoc.docs.map((keywordDoc) => keywordDoc.id);
  } catch (error) {
    console.error(error);
  }
};

export const getKeywordForMonthRange = async (keyword, monthRange) => {
  const fromDate = moment().subtract(monthRange, "month").toDate();
  const keywordHistorySnapshot = await db
    .collection("keywords")
    .doc(keyword)
    .collection("history")
    .where("date", ">", fromDate)
    .get();
  return keywordHistorySnapshot.docs.map((doc) => doc.data());
};

export const getMultipleKeywordsMonthsRange = async (keywords, monthsRange) => {
  const allKeyData = await Promise.all(
    keywords.map((keyword) => getKeywordForMonthRange(keyword, monthsRange))
  );

  const keyDataObject = {};
  keywords.forEach((key, i) => (keyDataObject[key] = allKeyData[i]));

  return keyDataObject;
};

export const getDailySummaryForMonthRange = async (monthRange) => {
  const fromDate = moment().subtract(monthRange, "month").toDate();
  const dailySummary = await db
    .collection("dailySummary")
    .where("date", ">", fromDate)
    .get();
  return { dailySummary: dailySummary.docs.map((day) => day.data()) };
};