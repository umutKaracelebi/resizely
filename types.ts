export interface ImageSettings {
  width: number;
  height: number;
  keepAspectRatio: boolean;
  quality: number; // 0 to 1
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  fillColor: string;
  maintainTransparency: boolean;
}

export interface ImageState {
  originalFile: File | null;
  originalUrl: string | null;
  originalDimensions: { width: number; height: number };
  processedBlob: Blob | null;
  processedUrl: string | null;
  processedSize: number;
  isProcessing: boolean;
}