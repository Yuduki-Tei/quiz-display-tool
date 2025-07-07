/**
 * @module zoomOutUtil
 * @description Provides zoom-out animation functionality for a canvas.
 *
 * @warning This module is designed as a singleton and uses a global animation
 * controller (`currentController`). It does NOT support running multiple
 * zoom animations simultaneously from different component instances.
 * Calling `startZoomOut` will always stop any previously running animation.
 */

import type { ImageData } from "@/@types/types";
import type { ZoomerContext } from "../types/ZoomerTypes";
import { useZoomerStore } from "../stores/zoomerStore";

// Utility for zoom-out animation on canvas
export type ZoomOutParams = ZoomerContext &
  ImageData & {
    onStart?: () => void;
    onFinish?: () => void;
  };

let currentController: ReturnType<typeof startZoomOut> | null = null;

export function startZoomOut(params: ZoomOutParams) {
  const imageStore = useZoomerStore();
  imageStore.setZooming(true);
  imageStore.setPaused(false);
  let paused = false;
  let finished = false;
  let animationFrameId: number | null = null;
  let start = performance.now();
  let pauseTime = 0;

  const {
    onStart,
    canvas,
    renderable,
    naturalWidth,
    naturalHeight,
    displayWidth,
    displayHeight,
    selection,
    duration = 10000,
    onFinish,
  } = params;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  if (onStart) onStart();
  // Normalize selection rectangle (always left-top origin)
  const sx = selection.w >= 0 ? selection.x : selection.x + selection.w;
  const sy = selection.h >= 0 ? selection.y : selection.y + selection.h;
  const sw = Math.abs(selection.w);
  const sh = Math.abs(selection.h);
  // Animation start (selection) and end (full canvas) centers and sizes
  const center0 = { x: sx + sw / 2, y: sy + sh / 2 };
  const size0 = { w: sw, h: sh };
  const center1 = { x: displayWidth / 2, y: displayHeight / 2 };
  const size1 = { w: displayWidth, h: displayHeight };
  // Scale for converting canvas coordinates to original image coordinates
  const scaleX = naturalWidth / displayWidth;
  const scaleY = naturalHeight / displayHeight;
  function animate(ts: number) {
    if (paused || finished) return;
    let progress = Math.min((ts - start) / duration, 1);
    // Ease in-out cubic for smooth animation
    progress =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    // Interpolate center and size
    const cx = center0.x + (center1.x - center0.x) * progress;
    const cy = center0.y + (center1.y - center0.y) * progress;
    const w = size0.w + (size1.w - size0.w) * progress;
    const h = size0.h + (size1.h - size0.h) * progress;
    // Convert canvas coordinates to original image coordinates
    let sx2 = (cx - w / 2) * scaleX;
    let sy2 = (cy - h / 2) * scaleY;
    let sw2 = w * scaleX;
    let sh2 = h * scaleY;
    // Clamp to image bounds
    if (sx2 < 0) {
      sw2 += sx2;
      sx2 = 0;
    }
    if (sy2 < 0) {
      sh2 += sy2;
      sy2 = 0;
    }
    if (sx2 + sw2 > naturalWidth) sw2 = naturalWidth - sx2;
    if (sy2 + sh2 > naturalHeight) sh2 = naturalHeight - sy2;
    ctx!.clearRect(0, 0, displayWidth, displayHeight);
    ctx!.drawImage(
      renderable,
      sx2,
      sy2,
      sw2,
      sh2,
      0,
      0,
      displayWidth,
      displayHeight
    );
    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      finished = true;
      ctx!.clearRect(0, 0, displayWidth, displayHeight);
      ctx!.drawImage(
        renderable,
        0,
        0,
        naturalWidth,
        naturalHeight,
        0,
        0,
        displayWidth,
        displayHeight
      );
      imageStore.setZooming(false);
      if (onFinish) onFinish();
    }
  }

  animationFrameId = requestAnimationFrame(animate);

  const controller = {
    pause() {
      if (!paused && !finished) {
        paused = true;
        pauseTime = performance.now();
        imageStore.setPaused(true);
      }
    },
    resume() {
      if (paused && !finished) {
        paused = false;
        start += performance.now() - pauseTime;
        animationFrameId = requestAnimationFrame(animate);
        imageStore.setPaused(false);
      }
    },
    stop() {
      finished = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      imageStore.setZooming(false);
      imageStore.setPaused(false);
    },
  };
  currentController = controller;
  return controller;
}

export function stopZoomOut() {
  if (currentController) {
    currentController.stop();
    currentController = null;
  }
}

export function generateRandomSelection(
  displayWidth: number,
  displayHeight: number
) {
  const minSize = 50; // 最小選取區域大小
  const x = Math.random() * (displayWidth - minSize);
  const y = Math.random() * (displayHeight - minSize);
  const w = minSize + Math.random() * (displayWidth - x - minSize);
  const h = minSize + Math.random() * (displayHeight - y - minSize);

  return {
    x: Math.max(0, Math.floor(x)),
    y: Math.max(0, Math.floor(y)),
    w: Math.min(displayWidth - Math.floor(x), Math.floor(w)),
    h: Math.min(displayHeight - Math.floor(y), Math.floor(h)),
  };
}

export function showFullImage(params: ZoomOutParams) {
  stopZoomOut();
  const {
    renderable,
    canvas,
    naturalWidth,
    naturalHeight,
    displayWidth,
    displayHeight,
  } = params;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, displayWidth, displayHeight);
  ctx.drawImage(
    renderable,
    0,
    0,
    naturalWidth,
    naturalHeight,
    0,
    0,
    displayWidth,
    displayHeight
  );
}
