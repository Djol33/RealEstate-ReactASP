import { ImageItem } from './useEditImageUpload';

interface EditImageGridProps {
  images: ImageItem[];
  visibleImages: ImageItem[];
  onRemove: (index: number) => void;
}

export function EditImageGrid({ images, visibleImages, onRemove }: EditImageGridProps) {
  if (visibleImages.length === 0) return null;

  return (
    <div className="edit-image-grid">
      {visibleImages.map((img, i) => (
        <div key={i} className={`edit-thumb ${img.isNew ? 'is-new' : ''}`}>
          <img src={img.previewUrl} alt="" />
          <button type="button" className="thumb-remove" onClick={() => onRemove(images.indexOf(img))}>
            <i className="fa-solid fa-xmark" />
          </button>
          {img.isNew && <span className="new-badge">New</span>}
        </div>
      ))}
    </div>
  );
}
