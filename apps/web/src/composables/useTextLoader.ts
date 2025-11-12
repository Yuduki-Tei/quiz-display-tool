import type { TextData } from "@shared-types/types";

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
 * Generate a name for text data (first 2 words if starts with English letter, otherwise first 5 characters)
 * @param content - The full text content
 * @returns string - The name text with "..." suffix if truncated
 */
export function getTextName(content: string): string {
  if (!content) return "";

  // Remove leading/trailing whitespace and newlines
  const trimmed = content.trim().replace(/\s+/g, " ");

  // Check if first character is an English letter (a-z, A-Z)
  const firstChar = trimmed.charAt(0);
  const isEnglishLetter = /[a-zA-Z]/.test(firstChar);

  if (isEnglishLetter) {
    // For English: take first 2 words
    const words = trimmed.split(" ");
    if (words.length <= 2) {
      return trimmed;
    }
    return words.slice(0, 2).join(" ") + "...";
  } else {
    // For everything else (CJK, numbers, symbols, etc.): take first 5 characters
    return trimmed.length > 5 ? trimmed.slice(0, 5) + "..." : trimmed;
  }
}

/**
 * Generate a preview text for thumbnail display (always 1 character)
 * @param content - The full text content
 * @returns string - The first character of the content
 */
export function getTextPreview(content: string): string {
  if (!content) return "";
  const trimmed = content.trim().replace(/\s+/g, " ");
  return trimmed.charAt(0);
}

/**
 * Load a text file and return an array of TextData (one per line)
 * @param file - The text file to load
 * @returns Promise<TextData[]> - Array of text data, one for each non-empty line
 */
export async function loadTextFile(file: File): Promise<TextData[]> {
  // Quick validation before any heavy operations
  const maxSize = 1 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("File too large");
  }

  if (file.size === 0) {
    throw new Error("Empty file");
  }

  const baseId = await getSha256(file);
  const content = await file.text();

  const lines = content.split("\n").filter((line) => line.trim() !== "");
  if (lines.length === 0) {
    throw new Error("No content");
  }

  // Limit number of lines to prevent UI freeze
  const maxLines = 100;
  if (lines.length > maxLines) {
    throw new Error("Too many lines");
  }

  return lines.map((line, index) => {
    const trimmedContent = line.trim();
    return {
      id: `${baseId}-${index}`,
      name: getTextName(trimmedContent),
      content: trimmedContent,
      thumbnailSrc: getTextPreview(trimmedContent),
    };
  });
}
