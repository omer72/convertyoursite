import Anthropic from "@anthropic-ai/sdk";
import type { ScrapeResult, DesignSpec, GeneratedCode } from "./store";

const CODE_GEN_SYSTEM_PROMPT = `You are an expert Next.js developer. Given a design spec and scraped website content, generate a complete static Next.js site.

Return ONLY valid JSON with this structure (no markdown, no explanation):

{
  "files": [
    { "path": "relative/path/to/file", "content": "full file content" }
  ]
}

Requirements:
- Use Next.js App Router (app/ directory)
- Use Tailwind CSS v4 for styling (no tailwind.config — uses CSS-based config)
- Include: package.json, tsconfig.json, next.config.ts, postcss.config.mjs, src/app/globals.css, src/app/layout.tsx, src/app/page.tsx, and additional page files
- Use the design spec colors, fonts, and layout exactly
- Populate pages with REAL content from the scrape data — headings, paragraphs, images
- Include responsive navigation with mobile hamburger menu
- Include proper SEO meta tags from the scrape data
- Make it production-ready and visually polished
- Use Inter as fallback font via next/font/google
- Include a simple footer with contact info from scrape data
- All image src attributes should use the original scraped URLs
- Do NOT use any external component libraries — just Tailwind CSS
- The site should work with \`next build && next start\` or \`output: "export"\` for static hosting
- Use TypeScript for all files`;

export async function generateCode(
  design: DesignSpec,
  scrapeResult: ScrapeResult,
  clientName: string
): Promise<GeneratedCode> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }

  const client = new Anthropic({ apiKey });

  const contentSummary = buildContentSummary(scrapeResult);

  const userPrompt = `Generate a complete Next.js static site for "${clientName}".

## Design Spec
${JSON.stringify(design, null, 2)}

## Scraped Content
${contentSummary}

Generate all files needed for a complete, working Next.js site. Use real content from the scrape — do not use placeholders like "Lorem ipsum".`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 16384,
    messages: [{ role: "user", content: userPrompt }],
    system: CODE_GEN_SYSTEM_PROMPT,
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from code generation");
  }

  const jsonStr = textBlock.text.trim();
  const result: { files: { path: string; content: string }[] } = JSON.parse(jsonStr);

  if (!result.files || !Array.isArray(result.files) || result.files.length === 0) {
    throw new Error("Invalid code generation result: no files generated");
  }

  return {
    files: result.files,
    generatedAt: new Date().toISOString(),
  };
}

function buildContentSummary(scrape: ScrapeResult): string {
  const parts: string[] = [];

  parts.push(`Site: ${scrape.meta.title}`);
  parts.push(`Description: ${scrape.meta.description}`);

  if (scrape.contact.emails.length > 0) {
    parts.push(`Emails: ${scrape.contact.emails.join(", ")}`);
  }
  if (scrape.contact.phones.length > 0) {
    parts.push(`Phones: ${scrape.contact.phones.join(", ")}`);
  }
  if (scrape.contact.socialLinks.length > 0) {
    parts.push(`Social: ${scrape.contact.socialLinks.join(", ")}`);
  }

  // Include content from pages
  for (const page of scrape.pages.slice(0, 6)) {
    if (page.error) continue;
    parts.push(`\n### Page: ${page.title || page.url}`);
    parts.push(`URL: ${page.url}`);
    if (page.headings.length > 0) {
      parts.push(`Headings: ${page.headings.slice(0, 8).join(" | ")}`);
    }
    if (page.paragraphs.length > 0) {
      parts.push(`Content:\n${page.paragraphs.slice(0, 6).join("\n")}`);
    }
    if (page.images.length > 0) {
      parts.push(`Images: ${page.images.slice(0, 5).join(", ")}`);
    }
  }

  return parts.join("\n");
}
