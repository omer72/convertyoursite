import * as cheerio from "cheerio";
import type { QaCheck, QaReport, ScrapeResult } from "./store";

const FETCH_TIMEOUT_MS = 30_000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5_000;

async function fetchWithRetry(url: string): Promise<string> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      try {
        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; SiteStarterQA/1.0)",
            Accept: "text/html,application/xhtml+xml",
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.text();
      } finally {
        clearTimeout(timer);
      }
    } catch (err) {
      if (attempt === MAX_RETRIES - 1) throw err;
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
    }
  }
  throw new Error("Fetch failed after retries");
}

function checkContentCompleteness(
  originalScrape: ScrapeResult,
  $new: cheerio.CheerioAPI
): QaCheck {
  const originalHeadings = new Set<string>();
  for (const page of originalScrape.pages) {
    for (const h of page.headings) {
      originalHeadings.add(h.toLowerCase().trim());
    }
  }

  const newHeadings = new Set<string>();
  $new("h1, h2, h3").each((_, el) => {
    const text = $new(el).text().trim().toLowerCase();
    if (text) newHeadings.add(text);
  });

  // Check how many original headings have a match (exact or partial)
  let matched = 0;
  for (const orig of originalHeadings) {
    for (const newH of newHeadings) {
      if (newH.includes(orig) || orig.includes(newH)) {
        matched++;
        break;
      }
    }
  }

  const total = originalHeadings.size;
  if (total === 0) {
    return { name: "Content Completeness", status: "warn", details: "No headings found in original site to compare" };
  }

  const ratio = matched / total;
  if (ratio >= 0.6) {
    return { name: "Content Completeness", status: "pass", details: `${matched}/${total} major headings preserved` };
  } else if (ratio >= 0.3) {
    return { name: "Content Completeness", status: "warn", details: `Only ${matched}/${total} headings matched — some content may be missing` };
  }
  return { name: "Content Completeness", status: "fail", details: `Only ${matched}/${total} headings matched — significant content missing` };
}

function checkNavigation(
  originalScrape: ScrapeResult,
  $new: cheerio.CheerioAPI
): QaCheck {
  const originalNav = originalScrape.navigation.map((n) => n.toLowerCase().trim());
  if (originalNav.length === 0) {
    return { name: "Navigation", status: "warn", details: "No navigation items found in original site" };
  }

  const newNavItems: string[] = [];
  $new("nav a, header a, [role='navigation'] a").each((_, el) => {
    const text = $new(el).text().trim().toLowerCase();
    if (text && text.length < 60) newNavItems.push(text);
  });

  let matched = 0;
  for (const orig of originalNav) {
    if (newNavItems.some((n) => n.includes(orig) || orig.includes(n))) {
      matched++;
    }
  }

  const ratio = matched / originalNav.length;
  if (ratio >= 0.7) {
    return { name: "Navigation", status: "pass", details: `${matched}/${originalNav.length} nav items preserved` };
  } else if (ratio >= 0.4) {
    return { name: "Navigation", status: "warn", details: `Only ${matched}/${originalNav.length} nav items found` };
  }
  return { name: "Navigation", status: "fail", details: `Only ${matched}/${originalNav.length} nav items found — navigation incomplete` };
}

function checkImages(
  originalScrape: ScrapeResult,
  $new: cheerio.CheerioAPI
): QaCheck {
  const originalImageCount = originalScrape.pages.reduce(
    (sum, p) => sum + p.images.length,
    0
  );

  const newImageCount = $new("img[src]").length;

  if (originalImageCount === 0) {
    return { name: "Images", status: "pass", details: "Original site had no images — nothing to compare" };
  }

  // New site should have at least some images
  if (newImageCount === 0) {
    return { name: "Images", status: "fail", details: `Original had ${originalImageCount} images, new site has none` };
  }

  const ratio = newImageCount / Math.min(originalImageCount, 20);
  if (ratio >= 0.3) {
    return { name: "Images", status: "pass", details: `New site has ${newImageCount} images (original: ${originalImageCount})` };
  }
  return { name: "Images", status: "warn", details: `New site has ${newImageCount} images vs ${originalImageCount} original — may be missing some` };
}

function checkContactInfo(
  originalScrape: ScrapeResult,
  $new: cheerio.CheerioAPI
): QaCheck {
  const { emails, phones, socialLinks } = originalScrape.contact;
  const newHtml = $new.html() || "";
  const issues: string[] = [];

  // Check emails
  for (const email of emails) {
    if (!newHtml.includes(email)) {
      issues.push(`Missing email: ${email}`);
    }
  }

  // Check phones
  for (const phone of phones) {
    // Normalize phone for comparison (strip spaces/dashes)
    const normalized = phone.replace(/[\s\-()]/g, "");
    const newNormalized = newHtml.replace(/[\s\-()]/g, "");
    if (!newNormalized.includes(normalized)) {
      issues.push(`Missing phone: ${phone}`);
    }
  }

  // Check social links
  const socialDomains = ["facebook.com", "twitter.com", "x.com", "instagram.com", "linkedin.com", "youtube.com"];
  const originalSocialDomains = socialLinks
    .map((url) => { try { return new URL(url).hostname; } catch { return null; } })
    .filter(Boolean);

  for (const domain of originalSocialDomains) {
    if (!newHtml.includes(domain!)) {
      issues.push(`Missing social: ${domain}`);
    }
  }

  const totalItems = emails.length + phones.length + originalSocialDomains.length;
  if (totalItems === 0) {
    return { name: "Contact Info", status: "pass", details: "No contact info in original to compare" };
  }

  if (issues.length === 0) {
    return { name: "Contact Info", status: "pass", details: "All contact info preserved" };
  } else if (issues.length <= totalItems / 2) {
    return { name: "Contact Info", status: "warn", details: issues.join("; ") };
  }
  return { name: "Contact Info", status: "fail", details: issues.join("; ") };
}

function checkMetaTags(
  originalScrape: ScrapeResult,
  $new: cheerio.CheerioAPI
): QaCheck {
  const issues: string[] = [];

  const newTitle = $new("title").first().text().trim();
  if (!newTitle) {
    issues.push("Missing <title> tag");
  }

  const newDescription = $new('meta[name="description"]').attr("content");
  if (!newDescription) {
    issues.push("Missing meta description");
  }

  if (issues.length === 0) {
    return { name: "Meta Tags", status: "pass", details: `Title: "${newTitle.slice(0, 60)}"` };
  }
  return { name: "Meta Tags", status: "warn", details: issues.join("; ") };
}

export async function runQaComparison(
  originalScrape: ScrapeResult,
  deployedUrl: string,
  originalUrl: string
): Promise<QaReport> {
  const newHtml = await fetchWithRetry(deployedUrl);
  const $new = cheerio.load(newHtml);

  const checks: QaCheck[] = [
    checkContentCompleteness(originalScrape, $new),
    checkNavigation(originalScrape, $new),
    checkImages(originalScrape, $new),
    checkContactInfo(originalScrape, $new),
    checkMetaTags(originalScrape, $new),
  ];

  const summary = {
    pass: checks.filter((c) => c.status === "pass").length,
    fail: checks.filter((c) => c.status === "fail").length,
    warn: checks.filter((c) => c.status === "warn").length,
  };

  return {
    checks,
    summary,
    originalUrl,
    deployedUrl,
    completedAt: new Date().toISOString(),
  };
}
