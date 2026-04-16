import { useState, useCallback } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../infrastructure/firebase/config';

function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.width;
      let h = img.height;
      if (w > maxWidth) {
        h = (h * maxWidth) / w;
        w = maxWidth;
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not supported')); return; }
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        blob => blob ? resolve(blob) : reject(new Error('Compression failed')),
        'image/jpeg',
        quality,
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

export function usePhotoUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = useCallback(async (file: File, userId: string): Promise<string> => {
    setUploading(true);
    setProgress(0);
    try {
      const compressed = await compressImage(file);
      setProgress(30);
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`;
      const storageRef = ref(storage, `price-photos/${userId}/${fileName}`);
      setProgress(50);
      await uploadBytes(storageRef, compressed, { contentType: 'image/jpeg' });
      setProgress(80);
      const url = await getDownloadURL(storageRef);
      setProgress(100);
      return url;
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, uploading, progress };
}
