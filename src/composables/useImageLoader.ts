import type { ImageData } from "@/@types/types";

export async function loadImageFile(
  file: File,
  maxWidth = 1280,
  maxHeight = 720
): Promise<ImageData> {
  const key = await getSha256(file);
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
      createImageBitmap(img).then((bitmap) => {
        resolve({
          id: key,
          image: file,
          canvas: null,
          renderable: bitmap,
          naturalWidth,
          naturalHeight,
          displayWidth: w,
          displayHeight: h,
        });
      });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

async function getSha256(file: File) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
