import OpenAI from "openai";
import type { QaReport, ScrapeResult, GeneratedCode } from "./store";
import { stripMarkdownFences } from "./strip-markdown-fences";

const FIX_SYSTEM_PROMPT = `You are an expert Next.js developer fixing a generated website based on QA failures.

You will receive:
1. The QA report with failing checks and details
2. The original scraped content from the client's website
3. The current generated code files

Your job: produce ONLY the files that need changes to fix the QA failures. Return valid JSON (no markdown):

{
  "files": [
    { "path": "relative/path/to/file", "content": "full updated file content" }
  ]
}

Fix strategies by failure type:
- Content Completeness fail: Add missing headings and content from scrape data to the appropriate pages
- Navigation fail: Update the nav component to include all navigation items from the original site
- Images fail: Add image elements using the original scraped image URLs
- Contact Info fail: Add missing emails, phones, and social links to the footer or contact section
- Meta Tags warn/fail: Ensure <title> and <meta name="description"> are present in the layout

Rules:
- Return COMPLETE file contents for each changed file (not diffs)
- Keep the existing design, colors, and layout intact
- Only modify files that need changes
- Use the same tech stack (Next.js 14 App Router, Tailwind CSS v3, TypeScript)
- Every .tsx file MUST use \`export default function\` syntax and start with \`import React from "react";\`
- Preserve all existing working functionality`;

export async function generateFixes(
  qaReport: QaReport,
  scrapeResult: ScrapeResult,
  generatedCode: GeneratedCode,
  clientName: string
): Promise<GeneratedCode> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }

  const client = new OpenAI({ apiKey });

  const failingChecks = qaReport.checks.filter(
    (c) => c.status === "fail" || c.status === "warn"
  );

  if (failingChecks.length === 0) {
    return generatedCode;
  }

  const currentFiles = generatedCode.files
    .map((f) => `### ${f.path}\n\`\`\`\n${f.content.slice(0, 3000)}\n\`\`\``)
    .join("\n\n");

  const scrapeContext = buildScrapeContext(scrapeResult);

  const userPrompt = `Fix the generated website for "${clientName}" based on these QA failures:

## QA Failures
${failingChecks.map((c) => `- **${c.name}** (${c.status}): ${c.details}`).join("\n")}

## Original Site Content
${scrapeContext}

## Current Generated Files
${currentFiles}

Generate the fixed files. Only include files that need changes.`;

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 16384,
    messages: [
      { role: "system", content: FIX_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error("No text response from fix generation");
  }

  const jsonStr = stripMarkdownFences(text);
  const result: { files: { path: string; content: string }[] } =
    JSON.parse(jsonStr);

  if (!result.files || !Array.isArray(result.files)) {
    throw new Error("Invalid fix generation result");
  }

  // Merge fixed files into the existing code — replace changed files, keep the rest
  const fixedPaths = new Set(result.files.map((f) => f.path));
  const mergedFiles = [
    ...generatedCode.files.filter((f) => !fixedPaths.has(f.path)),
    ...result.files,
  ];

  return {
    files: mergedFiles,
    generatedAt: new Date().toISOString(),
  };
}

function buildScrapeContext(scrape: ScrapeResult): string {
  const parts: string[] = [];

  parts.push(`Site: ${scrape.meta.title}`);
  parts.push(`Description: ${scrape.meta.description}`);

  if (scrape.navigation.length > 0) {
    parts.push(`Navigation items: ${scrape.navigation.join(", ")}`);
  }
  if (scrape.contact.emails.length > 0) {
    parts.push(`Emails: ${scrape.contact.emails.join(", ")}`);
  }
  if (scrape.contact.phones.length > 0) {
    parts.push(`Phones: ${scrape.contact.phones.join(", ")}`);
  }
  if (scrape.contact.socialLinks.length > 0) {
    parts.push(`Social links: ${scrape.contact.socialLinks.join(", ")}`);
  }

  for (const page of scrape.pages.slice(0, 6)) {
    if (page.error) continue;
    parts.push(`\n### Page: ${page.title || page.url}`);
    if (page.headings.length > 0) {
      parts.push(`Headings: ${page.headings.join(" | ")}`);
    }
    if (page.paragraphs.length > 0) {
      parts.push(`Content:\n${page.paragraphs.slice(0, 6).join("\n")}`);
    }
    if (page.images.length > 0) {
      parts.push(`Images: ${page.images.slice(0, 8).join(", ")}`);
    }
  }

  return parts.join("\n");
}
