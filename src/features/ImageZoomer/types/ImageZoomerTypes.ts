import type { ImageContext } from 'src/@types/types';

export interface SelectionRect {
  x: number;
  y: number;
  w: number;
  h: number;
};

export interface ImageZoomerContext extends ImageContext {
  selection: SelectionRect;
  duration?: number;
}