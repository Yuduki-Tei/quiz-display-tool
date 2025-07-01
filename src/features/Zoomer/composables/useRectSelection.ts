import { ref, type Ref } from 'vue';

export function useRectSelection(
  aspect: Ref<number>,
  context: Ref<any>,
  setContext: (ctx: any) => void
) {
  const isDragging = ref(false);
  let startX = 0;
  let startY = 0;

  // Mouse down handler
  const onMouseDown = (e: MouseEvent, canvas: HTMLCanvasElement) => {
    const bounds = canvas.getBoundingClientRect();
    if (!context.value) return;
    startX = e.clientX - bounds.left;
    startY = e.clientY - bounds.top;
    const newSelection = {
      x: startX,
      y: startY,
      w: 0,
      h: 0
    };
    setContext({ ...context.value, selection: newSelection });
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
      h: dy
    };
    setContext({ ...context.value, selection: newSelection });
  };

  // Mouse up handler
  const onMouseUp = () => {
    isDragging.value = false;
  };

  // Draw selection rectangle on given canvas
  const drawSelection = (canvas: HTMLCanvasElement) => {
    if (!context.value) return;
    const rect = context.value.selection;
    const c2d = canvas.getContext('2d');
    if (!c2d) return;
    c2d.save();
    c2d.strokeStyle = 'red';
    c2d.lineWidth = 2;
    c2d.setLineDash([6, 4]);
    c2d.strokeRect(rect.x, rect.y, rect.w, rect.h);
    c2d.restore();
  };

  return {
    isDragging,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    drawSelection
  };
}
