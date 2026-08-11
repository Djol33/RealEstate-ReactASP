import { API_URL } from '../../../../../config';
interface ImageGalleryProps {
  images: { id: number; location: string }[] | undefined;
  onImageClick: () => void;
}

export function ImageGallery({ images, onImageClick }: ImageGalleryProps) {
  return (
    <div id="images">
      {images && images.length > 0 ? (
        images.map((img, i) => (
          <div
            onClick={onImageClick}
            key={img.id}
            style={{ backgroundImage: `url(${API_URL}/${img.location})` }}
            className={`${i > 3 ? 'd-none' : ''} ${i === 0 ? 'main' : 'sidebar' + i}`}
            image-id={i}
          ></div>
        ))
      ) : (
        <div
          style={{ backgroundImage: "url('https://placehold.co/800x600?text=No+Image')" }}
          className="main"
          image-id="0"
        ></div>
      )}
    </div>
  );
}
