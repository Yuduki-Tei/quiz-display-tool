export interface ImageContext {
  id: string;
  image: Blob | File | null;
  canvas: HTMLCanvasElement | null;
  renderable: ImageBitmap | null;
  naturalWidth: number;
  naturalHeight: number;
  displayWidth: number;
  displayHeight: number;
}
