import { useRef, useState, useEffect } from 'react';

export interface PreviewImage {
  file: File;
  previewUrl: string;
  enabled: boolean;
}

const MAX_IMAGES = 10;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function useImageUpload() {
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const [imageError, setImageError] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const blobUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

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

    const currentCount = previewImages.filter(img => img.enabled).length;
    const freeSlots = MAX_IMAGES - currentCount;

    let toAdd = accepted;
    if (accepted.length > freeSlots) {
      toAdd = accepted.slice(0, Math.max(freeSlots, 0));
      const overflow = accepted.slice(Math.max(freeSlots, 0));
      overflow.forEach(f => rejected.push(`${f.name} (image limit of ${MAX_IMAGES} reached)`));
    }

    if (toAdd.length > 0) {
      const newImages: PreviewImage[] = toAdd.map(file => ({
        file,
        previewUrl: URL.createObjectURL(file),
        enabled: true,
      }));
      blobUrlsRef.current.push(...newImages.map(img => img.previewUrl));
      setPreviewImages(prev => [...prev, ...newImages]);
    }

    if (rejected.length > 0) {
      setImageError(`Skipped: ${rejected.join(', ')}.`);
    }

    e.target.value = '';
  }

  function toggleImage(visibleIndex: number) {
    const visibleImages = previewImages.filter(img => img.enabled);
    const target = visibleImages[visibleIndex];
    const originalIndex = previewImages.indexOf(target);
    setPreviewImages(prev =>
      prev.map((img, i) => i === originalIndex ? { ...img, enabled: false } : img)
    );
    if (visibleImages.length - 1 === 0) {
      setPreviewVisible(false);
    } else {
      setPreviewIndex(i => (i >= visibleImages.length - 1 ? i - 1 : i));
    }
  }

  function prevImage() {
    const len = previewImages.filter(img => img.enabled).length;
    setPreviewIndex(i => (i - 1 + len) % len);
  }

  function nextImage() {
    const len = previewImages.filter(img => img.enabled).length;
    setPreviewIndex(i => (i + 1) % len);
  }

  const visibleImages = previewImages.filter(img => img.enabled);
  const currentImage = visibleImages[previewIndex];

  return {
    previewImages,
    visibleImages,
    currentImage,
    imageError,
    previewVisible,
    previewIndex,
    setPreviewVisible,
    setPreviewIndex,
    handleFileChange,
    toggleImage,
    prevImage,
    nextImage,
  };
}
