import { Overlay } from '../../../../shared/components/Overlay/Overlay';
import { PreviewImage } from './useImageUpload';

interface ImagePreviewCarouselProps {
  isVisible: boolean;
  setVisible: (visible: boolean) => void;
  currentImage: PreviewImage | undefined;
  visibleImages: PreviewImage[];
  previewIndex: number;
  setPreviewIndex: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onRemoveCurrent: () => void;
}

export function ImagePreviewCarousel({
  isVisible,
  setVisible,
  currentImage,
  visibleImages,
  previewIndex,
  setPreviewIndex,
  onPrev,
  onNext,
  onRemoveCurrent,
}: ImagePreviewCarouselProps) {
  return (
    <Overlay isVisible={isVisible} changeVisibility={setVisible}>
      {currentImage && (
        <div id="image-preview-carousel">
          <i className="fa-solid fa-angle-left arr" onClick={onPrev}></i>

          <div id="preview-img-wrap">
            <img src={currentImage.previewUrl} alt={currentImage.file.name} />
            <i
              className="fa-solid fa-trash toggle-img-btn included"
              onClick={onRemoveCurrent}
            />
          </div>

          <i className="fa-solid fa-angle-right arr" onClick={onNext}></i>

          <div id="preview-dots">
            {visibleImages.map((_, i) => (
              <span
                key={i}
                className={`dot ${i === previewIndex ? 'active' : ''}`}
                onClick={() => setPreviewIndex(i)}
              />
            ))}
          </div>
        </div>
      )}
    </Overlay>
  );
}
