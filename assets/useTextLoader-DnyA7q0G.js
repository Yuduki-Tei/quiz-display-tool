async function getSha256(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
function getTextName(content) {
  if (!content) return "";
  const trimmed = content.trim().replace(/\s+/g, " ");
  const firstChar = trimmed.charAt(0);
  const isEnglishLetter = /[a-zA-Z]/.test(firstChar);
  if (isEnglishLetter) {
    const words = trimmed.split(" ");
    if (words.length <= 2) {
      return trimmed;
    }
    return words.slice(0, 2).join(" ") + "...";
  } else {
    return trimmed.length > 5 ? trimmed.slice(0, 5) + "..." : trimmed;
  }
}
function getTextPreview(content) {
  if (!content) return "";
  const trimmed = content.trim().replace(/\s+/g, " ");
  return trimmed.charAt(0);
}
async function loadTextFile(file) {
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
      thumbnailSrc: getTextPreview(trimmedContent)
    };
  });
}
export {
  getTextName,
  getTextPreview,
  loadTextFile
};
//# sourceMappingURL=useTextLoader-DnyA7q0G.js.map
