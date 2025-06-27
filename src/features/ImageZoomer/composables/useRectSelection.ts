import { ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useImageZoomerStore } from '../stores/imageZoomerStore';

export function useRectSelection(aspect: Ref<number>) {
  const imageStore = useImageZoomerStore();
  const { context } = storeToRefs(imageStore);
  const isDragging = ref(false);

  // Mouse down handler
  const onMouseDown = (e: MouseEvent, canvas: HTMLCanvasElement) => {
    const bounds = canvas.getBoundingClientRect();
    if (!context.value) return;
    context.value.selection = {
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
      w: 0,
      h: 0
    };
    isDragging.value = true;
  };

  // Mouse move handler
  const onMouseMove = (e: MouseEvent, canvas: HTMLCanvasElement) => {
    if (!isDragging.value || !context.value) return;
    const bounds = canvas.getBoundingClientRect();
    const mx = e.clientX - bounds.left;
    const dx = mx - context.value.selection.x;
    const dy = dx / aspect.value;
    context.value.selection.w = dx;
    context.value.selection.h = dy;
  };

  // Mouse up handler
  const onMouseUp = () => {
    isDragging.value = false;
  };

  // Draw selection rectangle on given canvas
  const drawSelection = (canvas: HTMLCanvasElement) => {
    if (!context.value) return;
    const rect = context.value.selection;
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
    onMouseDown,
    onMouseMove,
    onMouseUp,
    drawSelection
  };
}
