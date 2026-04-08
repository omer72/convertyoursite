import OpenAI from "openai";
import type { ScrapeResult, DesignSpec, GeneratedCode } from "./store";
import { stripMarkdownFences } from "./strip-markdown-fences";

const CODE_GEN_SYSTEM_PROMPT = `You are an expert Next.js developer. Given a design spec and scraped website content, generate a complete static Next.js site.

Return ONLY valid JSON with this structure (no markdown, no explanation):

{
  "files": [
    { "path": "relative/path/to/file", "content": "full file content" }
  ]
}

Requirements:
- Use Next.js 14 App Router (app/ directory) — pin "next": "14.2.29" in package.json
- Use Tailwind CSS v3 for styling (include tailwind.config.js with content paths)
- The package.json MUST include these devDependencies: typescript, @types/react, @types/node, @types/react-dom
- Include: package.json, tsconfig.json, next.config.mjs, postcss.config.js, tailwind.config.js, src/app/globals.css, src/app/layout.tsx, src/app/page.tsx, and additional page files
- Use the design spec colors, fonts, and layout exactly
- Populate pages with REAL content from the scrape data — headings, paragraphs, images
- Include responsive navigation with mobile hamburger menu
- Include proper SEO meta tags from the scrape data
- Make it production-ready and visually polished
- Use Inter as fallback font via next/font/google
- Include a simple footer with contact info from scrape data
- All image src attributes should use the original scraped URLs
- Do NOT use any external component libraries — just Tailwind CSS
- The next.config.mjs MUST use this exact format (no defineConfig, no imports from 'next'):
  \`\`\`
  /** @type {import('next').NextConfig} */
  const nextConfig = { output: "export", images: { unoptimized: true } };
  export default nextConfig;
  \`\`\`
- The postcss.config.js MUST use this exact format (CommonJS, NOT .mjs):
  \`\`\`
  module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
  \`\`\`
- The tailwind.config.js MUST use this exact format:
  \`\`\`
  /** @type {import('tailwindcss').Config} */
  module.exports = { content: ["./src/**/*.{js,ts,jsx,tsx}"], theme: { extend: {} }, plugins: [] };
  \`\`\`
- Do NOT use \`next/image\` — use plain \`<img>\` tags instead (next/image requires a server and is incompatible with static export)
- Use TypeScript for all .tsx/.ts files but config files (next.config.mjs, postcss.config.js, tailwind.config.js) must be plain JavaScript`;

export async function generateCode(
  design: DesignSpec,
  scrapeResult: ScrapeResult,
  clientName: string
): Promise<GeneratedCode> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }

  const client = new OpenAI({ apiKey });

  const contentSummary = buildContentSummary(scrapeResult);

  const userPrompt = `Generate a complete Next.js static site for "${clientName}".

## Design Spec
${JSON.stringify(design, null, 2)}

## Scraped Content
${contentSummary}

Generate all files needed for a complete, working Next.js site. Use real content from the scrape — do not use placeholders like "Lorem ipsum".`;

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 16384,
    messages: [
      { role: "system", content: CODE_GEN_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error("No text response from code generation");
  }

  const jsonStr = stripMarkdownFences(text);
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
