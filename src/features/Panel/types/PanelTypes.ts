export interface PanelAmount {
  x: number;
  y: number;
}

export interface PanelContext {
  amount: PanelAmount;
  revealed: [number, number][];
  isManual: boolean; // true: manual mode, false: auto mode
  autoRevealMode: string; // pattern for auto reveal: random, topToBottom, etc.
  order?: [number, number][];
  duration?: number;
}
