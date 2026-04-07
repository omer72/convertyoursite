/**
 * Strip markdown code fences from an AI response so JSON.parse succeeds.
 * Handles ```json ... ```, ``` ... ```, and bare JSON.
 */
export function stripMarkdownFences(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?\s*```$/);
  if (fenceMatch) {
    return fenceMatch[1].trim();
  }
  return trimmed;
}
