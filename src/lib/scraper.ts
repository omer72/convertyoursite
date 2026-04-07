import * as cheerio from "cheerio";
import type { ScrapeResult, ScrapePageResult } from "./store";

const PAGE_TIMEOUT_MS = 60_000;
const MAX_PAGES = 10;

async function fetchPage(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PAGE_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SiteStarterBot/1.0; +https://starter.example.com)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function extractColors(html: string): string[] {
  const colors = new Set<string>();
  // Match hex colors in inline styles and style blocks
  const hexPattern = /#(?:[0-9a-fA-F]{3,4}){1,2}\b/g;
  for (const match of html.matchAll(hexPattern)) {
    const c = match[0].toLowerCase();
    // Skip pure black/white/grey
    if (c !== "#000" && c !== "#fff" && c !== "#000000" && c !== "#ffffff") {
      colors.add(c);
    }
  }
  return Array.from(colors).slice(0, 20);
}

function extractFonts(html: string): string[] {
  const fonts = new Set<string>();
  const fontPattern = /font-family\s*:\s*([^;}"]+)/gi;
  for (const match of html.matchAll(fontPattern)) {
    const families = match[1].split(",").map((f) => f.trim().replace(/['"]/g, ""));
    for (const f of families) {
      if (f && !["inherit", "initial", "unset", "sans-serif", "serif", "monospace", "cursive", "fantasy", "system-ui"].includes(f.toLowerCase())) {
        fonts.add(f);
      }
    }
  }
  return Array.from(fonts).slice(0, 10);
}

function resolveUrl(base: string, href: string): string | null {
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

function scrapePage(url: string, html: string): ScrapePageResult {
  const $ = cheerio.load(html);

  const title = $("title").first().text().trim();

  const headings: string[] = [];
  $("h1, h2, h3").each((_, el) => {
    const text = $(el).text().trim();
    if (text) headings.push(text);
  });

  const paragraphs: string[] = [];
  $("p").each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 20) paragraphs.push(text);
  });

  const images: string[] = [];
  $("img[src]").each((_, el) => {
    const src = $(el).attr("src");
    if (src) {
      const resolved = resolveUrl(url, src);
      if (resolved) images.push(resolved);
    }
  });

  const links: string[] = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (href) {
      const resolved = resolveUrl(url, href);
      if (resolved) links.push(resolved);
    }
  });

  return {
    url,
    title,
    headings: headings.slice(0, 50),
    paragraphs: paragraphs.slice(0, 50),
    images: images.slice(0, 30),
    links: links.slice(0, 100),
  };
}

function extractNavigation($: cheerio.CheerioAPI): string[] {
  const navItems: string[] = [];
  $("nav a, header a, [role='navigation'] a").each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length < 60) navItems.push(text);
  });
  return [...new Set(navItems)].slice(0, 30);
}

function extractContact($: cheerio.CheerioAPI, html: string): {
  emails: string[];
  phones: string[];
  socialLinks: string[];
} {
  const emails = new Set<string>();
  const phones = new Set<string>();
  const socialLinks = new Set<string>();

  // Emails from mailto links and text
  $('a[href^="mailto:"]').each((_, el) => {
    const href = $(el).attr("href");
    if (href) emails.add(href.replace("mailto:", "").split("?")[0]);
  });
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  for (const m of html.matchAll(emailPattern)) emails.add(m[0]);

  // Phones from tel links
  $('a[href^="tel:"]').each((_, el) => {
    const href = $(el).attr("href");
    if (href) phones.add(href.replace("tel:", ""));
  });

  // Social links
  const socialDomains = ["facebook.com", "twitter.com", "x.com", "instagram.com", "linkedin.com", "youtube.com", "tiktok.com"];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    if (socialDomains.some((d) => href.includes(d))) {
      socialLinks.add(href);
    }
  });

  return {
    emails: Array.from(emails).slice(0, 10),
    phones: Array.from(phones).slice(0, 10),
    socialLinks: Array.from(socialLinks).slice(0, 20),
  };
}

function extractMeta($: cheerio.CheerioAPI): {
  title: string;
  description: string;
  ogTags: Record<string, string>;
  favicon: string;
} {
  const title = $("title").first().text().trim();
  const description = $('meta[name="description"]').attr("content") || "";
  const favicon =
    $('link[rel="icon"]').attr("href") ||
    $('link[rel="shortcut icon"]').attr("href") ||
    "/favicon.ico";

  const ogTags: Record<string, string> = {};
  $("meta[property^='og:']").each((_, el) => {
    const prop = $(el).attr("property");
    const content = $(el).attr("content");
    if (prop && content) ogTags[prop] = content;
  });

  return { title, description, ogTags, favicon };
}

function getInternalLinks(
  baseUrl: string,
  pageResult: ScrapePageResult
): string[] {
  const origin = new URL(baseUrl).origin;
  const seen = new Set<string>();
  const internal: string[] = [];

  for (const link of pageResult.links) {
    try {
      const parsed = new URL(link);
      if (parsed.origin !== origin) continue;
      // Normalize: strip hash and trailing slash
      const normalized = parsed.origin + parsed.pathname.replace(/\/$/, "") + parsed.search;
      if (seen.has(normalized) || normalized === baseUrl.replace(/\/$/, "")) continue;
      // Skip non-HTML resources
      const ext = parsed.pathname.split(".").pop()?.toLowerCase() || "";
      if (["pdf", "jpg", "jpeg", "png", "gif", "svg", "css", "js", "zip", "mp4", "mp3"].includes(ext)) continue;
      seen.add(normalized);
      internal.push(normalized);
    } catch {
      // skip invalid URLs
    }
  }

  return internal.slice(0, MAX_PAGES - 1);
}

export async function scrapeWebsite(websiteUrl: string): Promise<ScrapeResult> {
  const pages: ScrapePageResult[] = [];
  let failedPages = 0;

  // Scrape homepage first
  const homepageHtml = await fetchPage(websiteUrl);
  const $home = cheerio.load(homepageHtml);
  const homepageResult = scrapePage(websiteUrl, homepageHtml);
  pages.push(homepageResult);

  // Extract site-wide data from homepage
  const navigation = extractNavigation($home);
  const contact = extractContact($home, homepageHtml);
  const meta = extractMeta($home);
  const colors = extractColors(homepageHtml);
  const fonts = extractFonts(homepageHtml);

  // Resolve favicon URL
  if (meta.favicon && !meta.favicon.startsWith("http")) {
    meta.favicon = resolveUrl(websiteUrl, meta.favicon) || meta.favicon;
  }

  // Crawl internal pages
  const internalLinks = getInternalLinks(websiteUrl, homepageResult);

  const crawlPromises = internalLinks.map(async (url) => {
    try {
      const html = await fetchPage(url);
      return scrapePage(url, html);
    } catch (err) {
      failedPages++;
      return {
        url,
        title: "",
        headings: [],
        paragraphs: [],
        images: [],
        links: [],
        error: err instanceof Error ? err.message : "Unknown error",
      } satisfies ScrapePageResult;
    }
  });

  const crawledPages = await Promise.all(crawlPromises);
  pages.push(...crawledPages);

  return {
    pages,
    branding: { colors, fonts },
    navigation,
    contact,
    meta,
    scrapedAt: new Date().toISOString(),
    totalPages: pages.length,
    failedPages,
  };
}
