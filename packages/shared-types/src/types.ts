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

// Socket.IO Action Types
export type LetterAction =
  | {
      action: "charReveal";
      payload: { id: string; index: number; char: string };
    }
  | {
      action: "batchCharReveal";
      payload: { id: string; chars: Array<{ index: number; char: string }> };
    }
  | {
      action: "coverAll";
      payload: { id: string };
    };

export type TextAction =
  | {
      action: "textUpload";
      payload: {
        id: string;
        totalChars: number;
      };
    }
  | {
      action: "textDelete";
      payload: { id: string };
    };

export type RouteChangeAction = {
  action: "routeChange";
  payload: {
    path: string;
    query?: Record<string, string>;
  };
};

export type ActionEvent = (LetterAction | TextAction | RouteChangeAction) & {
  timestamp: number;
};
