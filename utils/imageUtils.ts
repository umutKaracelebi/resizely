import { ImageSettings } from '../types';

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const getImageDimensions = (file: File): Promise<{ width: number; height: number; src: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          src: e.target?.result as string,
        });
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const processImage = (
  imageSource: string,
  settings: ImageSettings
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = settings.width;
      canvas.height = settings.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // High quality smoothing settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Handle Background
      // If format is JPEG (no transparency) OR user explicitly disabled transparency
      if (settings.format === 'image/jpeg' || !settings.maintainTransparency) {
        ctx.fillStyle = settings.fillColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        // Clear canvas for transparent formats
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      // Draw image to canvas
      ctx.drawImage(img, 0, 0, settings.width, settings.height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas to Blob failed'));
          }
        },
        settings.format,
        settings.quality
      );
    };
    img.onerror = (err) => reject(err);
    img.src = imageSource;
  });
};