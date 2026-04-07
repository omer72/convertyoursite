import OpenAI from "openai";
import type { ScrapeResult, DesignSpec } from "./store";

const DESIGN_SYSTEM_PROMPT = `You are a web design expert. Given scraped website data, generate a design specification for a modern, professional replacement website.

Return ONLY valid JSON matching this exact schema (no markdown, no explanation):

{
  "layout": {
    "pages": [{ "name": "string", "path": "string", "sections": ["string"] }],
    "navigation": { "items": [{ "label": "string", "href": "string" }] }
  },
  "colorScheme": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex",
    "surface": "#hex",
    "text": "#hex",
    "textSecondary": "#hex"
  },
  "typography": {
    "headingFont": "string",
    "bodyFont": "string",
    "baseSize": "string"
  },
  "contentMapping": {
    "sectionName": { "heading": "string", "content": ["string"], "images": ["url"] }
  },
  "components": {
    "hero": { "style": "centered|split|fullwidth", "hasImage": true, "hasSubtitle": true },
    "sections": [{ "name": "string", "type": "content|gallery|contact|cta|features|testimonials", "description": "string" }]
  }
}

Guidelines:
- Derive colors from the scraped branding. If the scraped colors are insufficient, generate a harmonious palette inspired by the existing brand.
- Use scraped fonts when available, fall back to modern web-safe alternatives.
- Map scraped content to appropriate sections (hero, about, services, gallery, contact, etc.).
- Keep navigation clean — max 6 items.
- Design should feel modern, clean, and professional.
- Use real content from the scrape, not placeholder text.`;

export async function generateDesign(
  scrapeResult: ScrapeResult,
  clientName: string,
  description: string,
  specialRequirements: string | null
): Promise<DesignSpec> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }

  const client = new OpenAI({ apiKey });

  const scrapeContext = buildScrapeContext(scrapeResult);

  const userPrompt = `Generate a design spec for a new website for "${clientName}".

Project description: ${description}
${specialRequirements ? `Special requirements: ${specialRequirements}` : ""}

Scraped website data:
${scrapeContext}`;

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 4096,
    messages: [
      { role: "system", content: DESIGN_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error("No text response from design generation");
  }

  const jsonStr = text.trim();
  const design: DesignSpec = JSON.parse(jsonStr);

  // Basic validation
  if (!design.layout || !design.colorScheme || !design.typography) {
    throw new Error("Invalid design spec: missing required fields");
  }

  return design;
}

function buildScrapeContext(scrape: ScrapeResult): string {
  const parts: string[] = [];

  parts.push(`## Site Meta\nTitle: ${scrape.meta.title}\nDescription: ${scrape.meta.description}`);

  if (scrape.branding.colors.length > 0) {
    parts.push(`## Brand Colors\n${scrape.branding.colors.join(", ")}`);
  }

  if (scrape.branding.fonts.length > 0) {
    parts.push(`## Fonts\n${scrape.branding.fonts.join(", ")}`);
  }

  if (scrape.navigation.length > 0) {
    parts.push(`## Navigation\n${scrape.navigation.join(", ")}`);
  }

  if (scrape.contact.emails.length > 0 || scrape.contact.phones.length > 0) {
    parts.push(
      `## Contact\nEmails: ${scrape.contact.emails.join(", ")}\nPhones: ${scrape.contact.phones.join(", ")}\nSocial: ${scrape.contact.socialLinks.join(", ")}`
    );
  }

  // Include content from first few pages (limit to avoid token overflow)
  const pageSummaries = scrape.pages.slice(0, 5).map((page) => {
    const headings = page.headings.slice(0, 10).join("\n  - ");
    const content = page.paragraphs.slice(0, 5).join("\n  ");
    const imgs = page.images.slice(0, 5).join("\n  ");
    return `### ${page.title || page.url}\nURL: ${page.url}\nHeadings:\n  - ${headings}\nContent:\n  ${content}\nImages:\n  ${imgs}`;
  });

  parts.push(`## Pages (${scrape.totalPages} total)\n${pageSummaries.join("\n\n")}`);

  return parts.join("\n\n");
}
