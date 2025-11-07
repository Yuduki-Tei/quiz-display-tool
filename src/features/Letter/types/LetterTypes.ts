export interface LetterContext {
  totalChars: number;
  charsPerRow: number;
  revealed: number[];
  isManual: boolean;
  autoRevealMode: string;
  order?: number[];
  charsPerSecond?: number;
}

export interface LetterCombinedContext extends LetterContext {
  id: string;
  name: string;
  content: string;
  thumbnailSrc: string | null;
}