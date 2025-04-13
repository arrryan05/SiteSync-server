// src/services/route-extractor.service.ts

import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

// Enable stealth mode to bypass bot detection
puppeteer.use(StealthPlugin());

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
  Accept: "application/xml,text/html;q=0.9",
};

export async function extractAllRoutes(domain: string): Promise<string[]> {
  const robotsUrl = `${domain}/robots.txt`;
  const sitemapUrl = `${domain}/sitemap.xml`;
  let routes: string[] = [];

  try {
    const robotsTxt = await axios
      .get(robotsUrl, { headers: HEADERS })
      .then((res) => res.data);
    console.log("-------------------------------", robotsTxt);
    if (canFetchSitemap(robotsTxt)) {
      console.log("Able to fetch sitemap");
      routes = await extractFromSitemap(sitemapUrl);
      console.log("Extracted routes from sitemap.");
    }
  } catch (err) {
    console.warn("robots.txt or sitemap fetch failed:", err);
  }

  // If sitemap didn't work or returned no routes, fallback to crawling
  if (!routes || routes.length === 0) {
    routes = await crawlWithPuppeteer(domain);
    console.log("Extracted routes from crawling.");
  }
  // Return the routes (should be limited to 5 by our crawl functions)
  return routes;
}

function canFetchSitemap(robotsTxt: string): boolean {
  return !robotsTxt.includes("Disallow: /sitemap.xml");
}

async function extractFromSitemap(sitemapUrl: string): Promise<string[]> {
  const xml = await axios.get(sitemapUrl).then((res) => res.data);
  const parser = new XMLParser({
    ignoreAttributes: false,
    ignoreDeclaration: true,
    removeNSPrefix: true,
    parseTagValue: true,
    isArray: (name, jpath) => ["urlset.url"].includes(jpath),
  });
  const parsed = parser.parse(xml);
//   console.log(parsed);

  if (parsed.urlset && parsed.urlset.url) {
    console.log("==================================");
    return parsed.urlset.url.map((u: any) => u.loc).slice(0, 5);
  }

  if (parsed.sitemapindex && parsed.sitemapindex.sitemap) {
    const nestedSitemaps = parsed.sitemapindex.sitemap.map((s: any) => s.loc);
    const allRoutes: string[] = [];
    for (const nestedUrl of nestedSitemaps) {
      const nestedRoutes = await extractFromSitemap(nestedUrl);
      allRoutes.push(...nestedRoutes);
      if (allRoutes.length >= 5) break;
    }
    return allRoutes.slice(0, 5);
  }

  return [];
}

// async function crawlWithCheerio(baseUrl: string): Promise<string[]> {
//   const visited = new Set<string>();
//   const toVisit = [baseUrl];

//   while (toVisit.length && visited.size < 5) {
//     const url = toVisit.pop();
//     if (!url || visited.has(url)) continue;

//     try {
//       const html = await axios.get(url, { headers: HEADERS }).then(res => res.data);
//       const $ = cheerio.load(html);

//       const links = $("a")
//         .map((_, el) => $(el).attr("href"))
//         .get()
//         .filter(href => href && href.startsWith("/"))
//         .map(path => new URL(path, baseUrl).href);

//       links.forEach(link => {
//         if (!visited.has(link) && visited.size < 5) {
//           toVisit.push(link);
//         }
//       });

//       visited.add(url);
//     } catch (err) {
//       console.warn('Error crawling:', url, err);
//     }
//   }

//   return Array.from(visited);
// }

async function crawlWithPuppeteer(baseUrl: string): Promise<string[]> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent(HEADERS["User-Agent"]);

  const visited = new Set<string>();
  const toVisit = [baseUrl];

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  while (toVisit.length && visited.size < 2) {
    const currentUrl = toVisit.pop();
    if (!currentUrl || visited.has(currentUrl)) continue;

    try {
      console.log(`Visiting: ${currentUrl}`);
      await page.goto(currentUrl, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      await delay(1000);

      const links: string[] = await page.$$eval(
        "a",
        (as, base) =>
          as
            .map((a) => a.href)
            .filter((h) => {
              try {
                const url = new URL(h);
                return url.hostname === new URL(base).hostname;
              } catch (e) {
                return false;
              }
            }),
        baseUrl
      );

      links.forEach((link) => {
        if (
          !visited.has(link) &&
          !toVisit.includes(link) &&
          visited.size < 5 &&
          !link.endsWith("/sitemap.xml")
        ) {
          toVisit.push(link);
        }
      });

      visited.add(currentUrl);
    } catch (err) {
      console.warn(`Puppeteer error at: ${currentUrl}:`, err);
    }
  }

  await browser.close();
  return Array.from(visited);
}
