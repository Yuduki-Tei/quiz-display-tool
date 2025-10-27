import type { TextData } from "@/@types/types";

/**
 * Load a text file and return an array of TextData (one per line)
 * @param file - The text file to load
 * @returns Promise<TextData[]> - Array of text data, one for each non-empty line
 */
export async function loadTextFile(file: File): Promise<TextData[]> {
  const baseId = await getSha256(file);
  const content = await file.text();

  // Split by newlines and filter out empty lines
  const lines = content.split('\n').filter(line => line.trim() !== '');

  // If file is empty or has no valid lines, return empty array
  if (lines.length === 0) {
    return [];
  }

  // Create a TextData for each line
  return lines.map((line, index) => {
    const trimmedContent = line.trim();
    return {
      id: `${baseId}-${index}`,
      name: lines.length > 1 ? `${file.name} (${index + 1})` : file.name,
      content: trimmedContent,
      thumbnailSrc: getTextPreview(trimmedContent),
    };
  });
}

/**
 * Generate SHA-256 hash from file for unique ID
 * @param file - The file to hash
 * @returns Promise<string> - The hash as hex string
 */
async function getSha256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

/**
 * Generate a preview text for display (5 chars for CJK, or first 2 words for English)
 * @param content - The full text content
 * @returns string - The preview text with "..." suffix
 */
export function getTextPreview(content: string): string {
  if (!content) return "";

  // Remove leading/trailing whitespace and newlines
  const trimmed = content.trim().replace(/\s+/g, " ");

  // Check if it's primarily CJK characters (Chinese, Japanese, Korean)
  const cjkPattern = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/;
  const isCJK = cjkPattern.test(trimmed.charAt(0));

  if (isCJK) {
    // For CJK: take first 5 characters
    return trimmed.length > 5 ? trimmed.slice(0, 5) + "..." : trimmed;
  } else {
    // For English: take first 2 words
    const words = trimmed.split(" ");
    if (words.length <= 2) {
      return trimmed;
    }
    return words.slice(0, 2).join(" ") + "...";
  }
}
