export interface ImageData {
  id: string;
  name: string;
  image: Blob | File | null;
  canvas: HTMLCanvasElement | null;
  thumbnailSrc: string | null;
  renderable: ImageBitmap | null;
  naturalWidth: number;
  naturalHeight: number;
  displayWidth: number;
  displayHeight: number;
}

export interface NotifierOptions {
  mode?: "message" | "notification" | "confirm";
  duration?: number;
  title?: string;
  [key: string]: any;
}