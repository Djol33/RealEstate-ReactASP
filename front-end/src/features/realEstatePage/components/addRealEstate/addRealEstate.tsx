import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SEO } from "../../../../shared/components/SEO/SEO";
import { useListingForm } from './useListingForm';
import { useImageUpload } from './useImageUpload';
import { ListingDetailsStep } from './ListingDetailsStep';
import { ListingImagesStep } from './ListingImagesStep';
import { ImagePreviewCarousel } from './ImagePreviewCarousel';
import { API_URL } from '../../../../config';
import './style.scss'

const TOTAL_STEPS = 2;

export function AddRealEstate() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [typeObject, setTypeObject] = useState<{ id: number; naziv: string }[]>([]);
  const [city, setCity] = useState<{ id: number; cityName: string }[]>([]);
  const [amenityIds, setAmenityIds] = useState<number[]>([]);
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useListingForm();
  const images = useImageUpload();

  useEffect(() => {
    axios.get(`${API_URL}/api/TypeOfObject`).then((response) => {
      setTypeObject(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get(`${API_URL}/api/CitiesAll`).then((x) => {
      setCity(x.data);
    });
  }, []);

  function handleNext() {
    if (form.validateStep1()) setStep(1);
  }

  function handleBack() {
    setStep(0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.validate()) {
      if (form.hasStep1Error()) setStep(0);
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      const payload = new FormData();
      payload.append('title', form.formData.title);
      payload.append('cityId', form.formData.cityId);
      payload.append('address', form.formData.address);
      payload.append('typeObjectId', form.formData.typeObjectId);
      payload.append('numberOfRooms', form.formData.numberOfRooms);
      payload.append('terrace', String(form.formData.terrace));
      payload.append('registered', String(form.formData.registered));
      payload.append('area', form.formData.area);
      payload.append('price', form.formData.price);
      payload.append('description', form.formData.description);

      images.previewImages
        .filter(img => img.enabled)
        .forEach(img => payload.append('images[]', img.file));

      amenityIds.forEach(id => payload.append('amenityIds[]', String(id)));

      await axios.post(`${API_URL}/api/RealEstateMain`, payload);

      navigate('/');
    } catch (err: any) {
      if (err.response?.status === 400) {
        setSubmitError('Please check your data and try again.');
      } else if (err.response?.status === 401) {
        setSubmitError('You must be logged in to add a listing.');
      } else {
        setSubmitError('Error adding listing. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <SEO title="Add listing" noIndex />
      <form className="estate-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <h1>Add listing</h1>

        <div className="estate-steps">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className={`step-dot ${i === step ? 'active' : i < step ? 'done' : ''}`}
            />
          ))}
        </div>

        {submitError && <div id="error"><span className="error">{submitError}</span></div>}

        {step === 0 && (
          <ListingDetailsStep
            formData={form.formData}
            errors={form.errors}
            city={city}
            typeObject={typeObject}
            onChange={form.handleChange}
            onTerraceChange={form.setTerrace}
            onRegisteredChange={form.setRegistered}
            onNext={handleNext}
          />
        )}

        {step === 1 && (
          <ListingImagesStep
            amenityIds={amenityIds}
            onAmenityChange={setAmenityIds}
            fileInputRef={fileInputRef}
            onFileChange={images.handleFileChange}
            imageError={images.imageError}
            hasVisibleImages={images.visibleImages.length > 0}
            onShowPreview={() => images.setPreviewVisible(true)}
            onBack={handleBack}
            isLoading={isLoading}
          />
        )}
      </form>

      <ImagePreviewCarousel
        isVisible={images.previewVisible}
        setVisible={images.setPreviewVisible}
        currentImage={images.currentImage}
        visibleImages={images.visibleImages}
        previewIndex={images.previewIndex}
        setPreviewIndex={images.setPreviewIndex}
        onPrev={images.prevImage}
        onNext={images.nextImage}
        onRemoveCurrent={() => images.toggleImage(images.previewIndex)}
      />
    </div>
  );
}
