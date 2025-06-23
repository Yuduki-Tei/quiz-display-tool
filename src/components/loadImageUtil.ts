// Utility to load and resize an image file
export interface LoadImageResult {
  image: HTMLImageElement;
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
}

export function loadImageFile(file: File, maxWidth: number, maxHeight: number): Promise<LoadImageResult> {
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
        image: img,
        width: w,
        height: h,
        naturalWidth,
        naturalHeight
      });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
