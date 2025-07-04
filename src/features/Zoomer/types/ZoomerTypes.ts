export interface SelectionRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ZoomerContext {
  selection: SelectionRect;
  duration?: number;
}
