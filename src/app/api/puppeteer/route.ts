import { NextResponse, NextRequest } from "next/server";
import puppeteer from "puppeteer";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json({ error: "Query parameter is missing" }, { status: 400 });
    }

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0");

        // Recherche sur DuckDuckGo
        await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&t=h_&ia=web`, {
            waitUntil: "domcontentloaded",
        });

        // Extraction des résultats
        const results = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("a.result__a")).map(el => ({
                title: el.textContent,
                link: (el as HTMLAnchorElement).href
            }));
        });

        await browser.close();
        return NextResponse.json({ results });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

