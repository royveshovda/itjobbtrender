const db = require("./db");

exports.finn = async () => {
  const {
    fetchPage,
    getYesterdaysAdPages,
    getKeywords,
    getYesterdaysAdsUrls,
    getTotalDayKeywordCount,
    getLastAdOnPageWasYesterday,
  } = require("./utils/finnUtils");

  const SITE_URL =
    "https://www.finn.no/job/fulltime/search.html?hideConsentBox=&occupation=0.23";

  const $ = await fetchPage(SITE_URL);
  let yesterdaysAdsUrls = getYesterdaysAdsUrls($);
  let lastAdOnPageWasYesterday = getLastAdOnPageWasYesterday($);

  if (lastAdOnPageWasYesterday) {
    while (lastAdOnPageWasYesterday) {
      let nextPage = 2;
      const nextPageURL = `https://www.finn.no/job/fulltime/search.html?hideConsentBox=&occupation=0.23&page=${nextPage}`;
      // eslint-disable-next-line no-await-in-loop
      const $nextPage = await fetchPage(nextPageURL);
      yesterdaysAdsUrls = yesterdaysAdsUrls.concat(
        getYesterdaysAdsUrls($nextPage)
      );
      lastAdOnPageWasYesterday = getLastAdOnPageWasYesterday($nextPage);
    }
  }

  const yesterdaysAdPages = await getYesterdaysAdPages(yesterdaysAdsUrls);

  const keywords = getKeywords();

  const totalDayKeywordCount = getTotalDayKeywordCount(
    yesterdaysAdPages,
    keywords
  );

  await db.saveDailySummary(yesterdaysAdsUrls.length);
  await db.saveKeywords(totalDayKeywordCount);
  console.log("Finn.no scraper complete");
};
