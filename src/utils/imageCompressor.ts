/**
 * Safe Image Compressor and Optimizer for Device Uploads
 * Prevents mobile and desktop high-resolution photos from exhausting
 * localStorage quotas or causing memory black-screen crashes.
 */
export async function optimizeUploadImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 600,
  quality = 0.82
): Promise<string> {
  // If it's a GIF and reasonably sized (< 2.5MB), retain raw animation data
  if (file.type === 'image/gif' && file.size < 2.5 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Use JPEG for standard photos to ensure compact ~80-150KB payload
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        resolve(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Safe localStorage write wrapper that prevents QuotaExceededError from crashing the app
 */
export function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err: any) {
    console.warn(`[Storage Warning] Failed to write key "${key}" to localStorage:`, err?.message);
    // If quota exceeded, attempt to clear old cache items and retry once
    try {
      localStorage.removeItem('ussf_tutorial_seen');
      localStorage.removeItem('ussf_audio_muted');
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }
}
