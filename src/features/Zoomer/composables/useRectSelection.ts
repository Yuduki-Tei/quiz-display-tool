import { ref, type Ref } from "vue";
import type { SelectionRect } from "../types/ZoomerTypes";

export function useRectSelection(
  aspect: Ref<number>,
  context: Ref<any>,
  setRect: (rect: SelectionRect) => void
) {
  const isDragging = ref(false);
  let startX = 0;
  let startY = 0;

  // Mouse down handler
  const onMouseDown = (e: MouseEvent, canvas: HTMLCanvasElement) => {
    const bounds = canvas.getBoundingClientRect();
    if (!context.value) return;

    const scaleX = canvas.width / bounds.width; //prevention of unintended css zooming
    const scaleY = canvas.height / bounds.height;

    if (!context.value) return;
    startX = (e.clientX - bounds.left) * scaleX;
    startY = (e.clientY - bounds.top) * scaleY;
    const newSelection = {
      x: startX,
      y: startY,
      w: 0,
      h: 0,
    };
    setRect(newSelection);
    isDragging.value = true;
  };

  // Mouse move handler
  const onMouseMove = (e: MouseEvent, canvas: HTMLCanvasElement) => {
    if (!isDragging.value || !context.value) return;
    const bounds = canvas.getBoundingClientRect();
    const mx = e.clientX - bounds.left;
    const dx = mx - startX;
    const dy = dx / aspect.value;
    const newSelection = {
      x: startX,
      y: startY,
      w: dx,
      h: dy,
    };
    setRect(newSelection);
  };

  // Mouse up handler
  const onMouseUp = () => {
    isDragging.value = false;
  };

  // Draw selection rectangle on given canvas
  const drawSelection = (canvas: HTMLCanvasElement) => {
    if (!context.value) return;
    const rect = context.value.selection;
    const c2d = canvas.getContext("2d");
    if (!c2d) return;
    c2d.strokeStyle = "red";
    c2d.lineWidth = 1.5;
    c2d.strokeRect(rect.x, rect.y, rect.w, rect.h);
  };

  return {
    isDragging,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    drawSelection,
  };
}
export function randomSelection(
  displayWidth: number,
  displayHeight: number
): SelectionRect {
  const minSize = Math.min(displayWidth, displayHeight) / 10;
  const maxSize = Math.min(displayWidth, displayHeight) / 5;
  const aspectRatio = displayWidth / displayHeight;
  const w = Math.random() * (maxSize - minSize) + minSize;
  const h = w / aspectRatio;
  const x = Math.random() * (displayWidth - w);
  const y = Math.random() * (displayHeight - h);

  return {
    x: Math.max(0, Math.floor(x)),
    y: Math.max(0, Math.floor(y)),
    w: Math.min(displayWidth - Math.floor(x), Math.floor(w)),
    h: Math.min(displayHeight - Math.floor(y), Math.floor(h)),
  };
}
