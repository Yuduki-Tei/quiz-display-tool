export interface PanelAmount{
    x: number;
    y: number;
}

export interface PanelContext {
    amount: PanelAmount;
    duration: number;
    revealType: string;
}