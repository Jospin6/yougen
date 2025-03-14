import puppeteer from "puppeteer";

export const searchGoogleSponsors = async (query: string) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`);

  const results = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("h3")).map(el => ({
      title: el.textContent,
      link: el.parentElement?.getAttribute("href")
    })).filter(result => result.link);
  });

  await browser.close();
  return results;
};

// Utilisation
const googleResults = await searchGoogleSponsors("brands that sponsor YouTube channels");
console.log(googleResults);
