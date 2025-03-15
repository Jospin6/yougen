import axios from "axios";
import * as cheerio from "cheerio";

export const scrapeSponsorsFromArticle = async (url: string) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // On extrait les entreprises listées dans les balises <li> ou <p>
    const sponsors: string[] = [];
    $("li, p").each((_, el) => {
      const text = $(el).text();
      if (text.match(/[A-Z][a-z]+/)) {
        sponsors.push(text.trim());
      }
    });

    return sponsors;
  } catch (error) {
    console.error("Erreur scraping article :", error);
    return [];
  }
};

export const scrapeMultipleArticles = async (urls: string[]) => {
    try {
      const allSponsors = await Promise.all(urls.map(url => scrapeSponsorsFromArticle(url)));
  
      // Fusionner toutes les listes et supprimer les doublons
      const uniqueSponsors = Array.from(new Set(allSponsors.flat()));
  
      return uniqueSponsors;
    } catch (error) {
      console.error("Erreur scraping multiple articles :", error);
      return [];
    }
  };

// Utilisation
const sponsorsList = await scrapeSponsorsFromArticle("https://exemple.com/article1");
console.log(sponsorsList);
