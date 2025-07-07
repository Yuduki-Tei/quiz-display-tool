export interface ImageData {
  id: string;
  name: string; // Add name property
  image: Blob | File | null;
  canvas: HTMLCanvasElement | null;
  thumbnailSrc: string | null;
  renderable: ImageBitmap | null;
  naturalWidth: number;
  naturalHeight: number;
  displayWidth: number;
  displayHeight: number;
}

export interface NotificationData {
  message: string;
  level: "info" | "success" | "warning" | "error";
  displayType: "message" | "notification";
  timestamp: number | null;
}
