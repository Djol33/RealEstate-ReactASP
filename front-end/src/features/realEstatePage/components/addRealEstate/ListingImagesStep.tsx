import { AmenityCheckboxList } from '../../../../shared/components/AmenityCheckboxList/AmenityCheckboxList';

interface ListingImagesStepProps {
  amenityIds: number[];
  onAmenityChange: (ids: number[]) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageError: string;
  hasVisibleImages: boolean;
  onShowPreview: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function ListingImagesStep({
  amenityIds,
  onAmenityChange,
  fileInputRef,
  onFileChange,
  imageError,
  hasVisibleImages,
  onShowPreview,
  onBack,
  isLoading,
}: ListingImagesStepProps) {
  return (
    <>
      <label>Amenities</label>
      <AmenityCheckboxList selectedIds={amenityIds} onChange={onAmenityChange} />

      <input
        type="file"
        multiple
        id="images"
        name="images[]"
        accept="image/jpeg, image/png, image/jpg"
        ref={fileInputRef}
        onChange={onFileChange}
      />
      <label htmlFor="images" id="file">Add images</label>

      {imageError && <span className="error">{imageError}</span>}

      {hasVisibleImages && (
        <div id="image-preview-info">
          <button type="button" id="preview-btn" onClick={onShowPreview}>
            Preview
          </button>
        </div>
      )}

      <div id="holdButtons">
        <button type="button" className="noBorder" onClick={onBack}>
          Back
        </button>
        <input
          id="predaj"
          type="submit"
          value={isLoading ? 'Sending...' : 'Submit'}
          disabled={isLoading}
        />
      </div>
    </>
  );
}
