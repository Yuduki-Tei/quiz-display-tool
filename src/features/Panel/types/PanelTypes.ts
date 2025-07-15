export interface PanelAmount {
  x: number;
  y: number;
}

export interface PanelContext {
  amount: PanelAmount;
  revealed: [number, number][];
  revealType: "auto" | "manual";
  revealMode: string;
  order?: [number, number][];
  duration?: number;
}
