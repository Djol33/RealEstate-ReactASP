import { useRef, useEffect, useState } from 'react';
import { API_URL } from '../../../../config';

export type ImageItem =
  | { previewUrl: string; removed: boolean; serverId: number; isNew: false }
  | { previewUrl: string; removed: boolean; file: File; isNew: true };

const MAX_IMAGES = 10;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function useEditImageUpload() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [imageError, setImageError] = useState('');
  const blobUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  function loadExistingImages(serverImages: { id: number; location: string }[]) {
    setImages(serverImages.map((img) => ({
      previewUrl: `${API_URL}/${img.location}`,
      removed: false,
      serverId: img.id,
      isNew: false,
    })));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    setImageError('');
    if (!files || files.length === 0) return;

    const selected = Array.from(files);
    const rejected: string[] = [];
    const accepted: File[] = [];

    for (const file of selected) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        rejected.push(`${file.name} (invalid format)`);
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        rejected.push(`${file.name} (larger than ${MAX_IMAGE_SIZE_MB} MB)`);
        continue;
      }
      accepted.push(file);
    }

    const currentCount = images.filter(img => !img.removed).length;
    const freeSlots = MAX_IMAGES - currentCount;

    let toAdd = accepted;
    if (accepted.length > freeSlots) {
      toAdd = accepted.slice(0, Math.max(freeSlots, 0));
      const overflow = accepted.slice(Math.max(freeSlots, 0));
      overflow.forEach(f => rejected.push(`${f.name} (image limit of ${MAX_IMAGES} reached)`));
    }

    if (toAdd.length > 0) {
      const newItems: ImageItem[] = toAdd.map(file => {
        const url = URL.createObjectURL(file);
        blobUrlsRef.current.push(url);
        return { previewUrl: url, removed: false, file, isNew: true };
      });
      setImages(prev => [...prev, ...newItems]);
    }

    if (rejected.length > 0) {
      setImageError(`Skipped: ${rejected.join(', ')}.`);
    }

    e.target.value = '';
  }

  function removeImage(index: number) {
    setImages(prev => prev.map((img, i) => i === index ? { ...img, removed: true } : img));
  }

  const visibleImages = images.filter(img => !img.removed);

  return {
    images,
    visibleImages,
    imageError,
    loadExistingImages,
    handleFileChange,
    removeImage,
  };
}
