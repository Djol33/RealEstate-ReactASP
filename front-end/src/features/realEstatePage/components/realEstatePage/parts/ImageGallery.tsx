import { API_URL } from '../../../../../config';
interface ImageGalleryProps {
  images: { id: number; location: string }[] | undefined;
  onImageClick: () => void;
  statusLabel?: string;
}

export function ImageGallery({ images, onImageClick, statusLabel }: ImageGalleryProps) {
  const hasImages = !!images && images.length > 0;

  return (
    <div id="images" className={hasImages && images.length > 1 ? '' : 'single'}>
      {hasImages ? (
        images.map((img, i) => (
          <div
            onClick={onImageClick}
            key={img.id}
            style={{ backgroundImage: `url(${API_URL}/${img.location})` }}
            className={`${i > 3 ? 'd-none' : ''} ${i === 0 ? 'main' : 'sidebar' + i}`}
            image-id={i}
          >
            {i === 0 && <span className="status-badge-floating">{statusLabel}</span>}
          </div>
        ))
      ) : (
        <div
          style={{ backgroundImage: "url('https://placehold.co/800x600?text=No+Image')" }}
          className="main"
          image-id="0"
        >
          <span className="status-badge-floating">{statusLabel}</span>
        </div>
      )}
    </div>
  );
}
