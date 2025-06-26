import type { ImageContext } from 'src/@types/types';

export async function loadImageFile(
  file: File,
  maxWidth = 1280,
  maxHeight = 720
): Promise<ImageContext> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      const naturalWidth = w;
      const naturalHeight = h;
      const scale = Math.min(maxWidth / w, maxHeight / h, 1);
      w = Math.round(w * scale);
      h = Math.round(h * scale);
      resolve({
        canvas: null,
        image: img,
        naturalWidth,
        naturalHeight,
        displayWidth: w,
        displayHeight: h,
      });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
