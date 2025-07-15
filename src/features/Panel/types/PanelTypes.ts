export interface PanelAmount {
  x: number;
  y: number;
}

export interface PanelContext {
  amount: PanelAmount;
  revealed: [number, number][];
  revealType: "auto" | "manual";
  order?: [number, number][];
  duration?: number;
}
