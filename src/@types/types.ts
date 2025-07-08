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
