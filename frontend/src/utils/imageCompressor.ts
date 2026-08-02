/**
 * compressImage
 * Resizes and re-encodes an image using the browser's native Canvas API.
 * No external libraries required.
 *
 * @param file     - The original File object from the input/drop zone
 * @param maxDim   - Maximum width or height in pixels (default: 1024)
 * @param quality  - JPEG compression quality 0–1 (default: 0.75)
 * @returns        - A new compressed File object
 */
export async function compressImage(
  file: File,
  maxDim = 1024,
  quality = 0.75
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      // Calculate the scale factor to fit within maxDim × maxDim
      const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
      const targetW = Math.round(img.width * scale);
      const targetH = Math.round(img.height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // If canvas is unavailable, return the original file untouched
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, targetW, targetH);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file); // Fallback to original if encoding fails
            return;
          }
          const compressed = new File([blob], file.name, { type: 'image/jpeg' });
          const ratio = ((1 - compressed.size / file.size) * 100).toFixed(0);
          console.log(
            `[ImageCompressor] ${file.name}: ${(file.size / 1024).toFixed(0)}KB → ${(compressed.size / 1024).toFixed(0)}KB (${ratio}% reduction)`
          );
          resolve(compressed);
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    img.src = objectUrl;
  });
}

/**
 * compressImages
 * Compresses an array of image files in parallel.
 */
export async function compressImages(files: File[]): Promise<File[]> {
  return Promise.all(files.map((f) => compressImage(f)));
}
