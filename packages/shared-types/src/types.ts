export interface BaseData {
  id: string;
  name: string;
  thumbnailSrc: string | null;
}

export interface ImageData extends BaseData {
  image: Blob | File | null;
  canvas: HTMLCanvasElement | null;
  renderable: ImageBitmap | null;
  naturalWidth: number;
  naturalHeight: number;
  displayWidth: number;
  displayHeight: number;
}

export interface TextData extends BaseData {
  content: string;
}

export interface NotifierOptions {
  mode?: "message" | "notification" | "confirm";
  duration?: number;
  title?: string;
  [key: string]: any;
}

export type Nullable<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: T[P] | null;
};
