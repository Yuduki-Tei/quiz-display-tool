import { ref, reactive } from 'vue';
import type { SelectionRect } from './ImageZoomerTypes';

export function useRectSelection(aspect: number) {
  const isDragging = ref(false);
  const rect = reactive<SelectionRect>({ x: 0, y: 0, w: 0, h: 0 });

  // Mouse down handler
  const onMouseDown = (e: MouseEvent, canvas: HTMLCanvasElement) => {
    const bounds = canvas.getBoundingClientRect();
    rect.x = e.clientX - bounds.left;
    rect.y = e.clientY - bounds.top;
    rect.w = 0;
    rect.h = 0;
    isDragging.value = true;
  };

  // Mouse move handler
  const onMouseMove = (e: MouseEvent, canvas: HTMLCanvasElement) => {
    if (!isDragging.value) return;
    const bounds = canvas.getBoundingClientRect();
    const mx = e.clientX - bounds.left;
    const dx = mx - rect.x;
    const dy = dx / aspect;
    rect.w = dx;
    rect.h = dy;
  };

  // Mouse up handler
  const onMouseUp = () => {
    isDragging.value = false;
  };

  // Draw selection rectangle on given canvas
  const drawSelection = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    ctx.restore();
  };

  return {
    isDragging,
    rect,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    drawSelection
  };
}
