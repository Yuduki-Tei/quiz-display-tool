export type SelectionRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export interface ImageDisplayContext {
  image: HTMLImageElement;
  naturalWidth: number;
  naturalHeight: number;
  displayWidth: number;
  displayHeight: number;
  selection: SelectionRect;
}

export interface CanvasImageContext extends ImageDisplayContext {
  canvas: HTMLCanvasElement;
}
