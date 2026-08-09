import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Overlay } from "../../../../shared/components/Overlay/Overlay";
import { SEO } from "../../../../shared/components/SEO/SEO";
import { AmenityCheckboxList } from "../../../../shared/components/AmenityCheckboxList/AmenityCheckboxList";
import './style.scss'

interface FormFields {
  title: string;
  cityId: string;
  address: string;
  typeObjectId: string;
  numberOfRooms: string;
  terrace: boolean;
  area: string;
  price: string;
  description: string;
}

type FormErrors = Partial<Record<keyof FormFields, string>>;

interface PreviewImage {
  file: File;
  previewUrl: string;
  enabled: boolean;
}

const MAX_IMAGES = 10;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const TOTAL_STEPS = 2;

const step1Fields: (keyof FormFields)[] = [
  'title', 'description', 'cityId', 'address', 'typeObjectId', 'numberOfRooms', 'area', 'price',
];

export function AddRealEstate() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);

  const [typeObject, setTypeObject] = useState<{ id: number; naziv: string }[]>([]);
  const [city, setCity] = useState<{ id: number; cityName: string }[]>([]);

  const [formData, setFormData] = useState<FormFields>({
    title: '',
    cityId: '',
    address: '',
    typeObjectId: '',
    numberOfRooms: '',
    terrace: false,
    area: '',
    price: '',
    description: '',
  });

  const [amenityIds, setAmenityIds] = useState<number[]>([]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [imageError, setImageError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    axios.get("https://localhost:7154/api/TypeOfObject").then((response) => {
      setTypeObject(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get("https://localhost:7154/api/CitiesAll").then((x) => {
      setCity(x.data);
    });
  }, []);

  const blobUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormFields]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
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

  function computeErrors(): FormErrors {
    const newErrors: FormErrors = {};

    if (!formData.title.trim() || formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters.';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters.';
    }
    if (!formData.description.trim() || formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters.';
    }
    if (!formData.cityId) {
      newErrors.cityId = 'Select a city.';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required.';
    }
    if (!formData.typeObjectId) {
      newErrors.typeObjectId = 'Select a property type.';
    }
    const rooms = parseFloat(formData.numberOfRooms);
    if (!formData.numberOfRooms || isNaN(rooms) || rooms < 0.5 || rooms > 10) {
      newErrors.numberOfRooms = 'Number of rooms must be between 0.5 and 10.';
    }
    const area = parseFloat(formData.area);
    if (!formData.area || isNaN(area) || area <= 0) {
      newErrors.area = 'Area must be a positive number.';
    } else if (area > 10000) {
      newErrors.area = 'Area cannot exceed 10,000 m².';
    }
    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      newErrors.price = 'Price must be a positive number.';
    } else if (price > 100000000) {
      newErrors.price = 'Price cannot exceed 100,000,000.';
    }

    return newErrors;
  }

  function validate(): boolean {
    const newErrors = computeErrors();
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validateStep1(): boolean {
    const allErrors = computeErrors();
    const step1Errors: FormErrors = {};
    step1Fields.forEach((field) => {
      if (allErrors[field]) step1Errors[field] = allErrors[field];
    });
    setErrors((prev) => ({ ...prev, ...step1Errors, ...Object.fromEntries(step1Fields.filter(f => !step1Errors[f]).map(f => [f, undefined])) }));
    return Object.keys(step1Errors).length === 0;
  }

  function handleNext() {
    if (validateStep1()) setStep(1);
  }

  function handleBack() {
    setStep(0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      const allErrors = computeErrors();
      const hasStep1Error = step1Fields.some((f) => allErrors[f]);
      if (hasStep1Error) setStep(0);
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('cityId', formData.cityId);
      payload.append('address', formData.address);
      payload.append('typeObjectId', formData.typeObjectId);
      payload.append('numberOfRooms', formData.numberOfRooms);
      payload.append('terrace', String(formData.terrace));
      payload.append('area', formData.area);
      payload.append('price', formData.price);
      payload.append('description', formData.description);

      previewImages
        .filter(img => img.enabled)
        .forEach(img => payload.append('images[]', img.file));

      amenityIds.forEach(id => payload.append('amenityIds[]', String(id)));

      await axios.post('https://localhost:7154/api/RealEstateMain', payload);

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

  const visibleImages = previewImages.filter(img => img.enabled);
  const currentImage = visibleImages[previewIndex];

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
          <>
            <label htmlFor="title1">Title</label>
            <input
              type="text"
              id="title1"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <span className="error">{errors.title}</span>}

            <label htmlFor="dodatniopis">Description</label>
            <input
              type="text"
              id="dodatniopis"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && <span className="error">{errors.description}</span>}

            <label htmlFor="city">Select city</label>
            <select name="cityId" id="city" value={formData.cityId} onChange={handleChange}>
              <option value="">-- Select a city --</option>
              {city.map((a) => (
                <option key={a.id} value={a.id}>{a.cityName}</option>
              ))}
            </select>
            {errors.cityId && <span className="error">{errors.cityId}</span>}

            <label htmlFor="adresa">Address</label>
            <input
              type="text"
              id="adresa"
              name="address"
              placeholder="Ruzveltova 12"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && <span className="error">{errors.address}</span>}

            <label htmlFor="tipObjekta">Type Of Building</label>
            <select name="typeObjectId" id="tipObjekta" value={formData.typeObjectId} onChange={handleChange}>
              <option value="">-- Select a type --</option>
              {typeObject.map((el) => (
                <option key={el.id} value={el.id}>{el.naziv}</option>
              ))}
            </select>
            {errors.typeObjectId && <span className="error">{errors.typeObjectId}</span>}

            <label htmlFor="numberrooms">Number of rooms</label>
            <input
              type="number"
              id="numberrooms"
              name="numberOfRooms"
              min="0.5"
              step="0.5"
              max="10"
              value={formData.numberOfRooms}
              onChange={handleChange}
            />
            {errors.numberOfRooms && <span className="error">{errors.numberOfRooms}</span>}

            <label htmlFor="kvadratura">Area (m²)</label>
            <input
              type="number"
              id="kvadratura"
              name="area"
              min="1"
              max="10000"
              value={formData.area}
              onChange={handleChange}
            />
            {errors.area && <span className="error">{errors.area}</span>}

            <label htmlFor="cena">Total price (€)</label>
            <input
              type="number"
              id="cena"
              name="price"
              min="0"
              max="100000000"
              step="500"
              value={formData.price}
              onChange={handleChange}
            />
            {errors.price && <span className="error">{errors.price}</span>}

            <label htmlFor="terasa">Does it have a terrace/balcony</label>
            <div id="terasa">
              <div>
                <input
                  type="radio"
                  name="terrace"
                  id="prvi"
                  value="true"
                  checked={formData.terrace === true}
                  onChange={() => setFormData(prev => ({ ...prev, terrace: true }))}
                />
                <label htmlFor="prvi">Yes</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="terrace"
                  id="drugi"
                  value="false"
                  checked={formData.terrace === false}
                  onChange={() => setFormData(prev => ({ ...prev, terrace: false }))}
                />
                <label htmlFor="drugi">No</label>
              </div>
            </div>

            <div id="holdButtons">
              <button type="button" id="predaj" onClick={handleNext}>
                Next
              </button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <label>Amenities</label>
            <AmenityCheckboxList selectedIds={amenityIds} onChange={setAmenityIds} />

            <input
              type="file"
              multiple
              id="images"
              name="images[]"
              accept="image/jpeg, image/png, image/jpg"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <label htmlFor="images" id="file">Add images</label>

            {imageError && <span className="error">{imageError}</span>}

            {visibleImages.length > 0 && (
              <div id="image-preview-info">
                <button type="button" id="preview-btn" onClick={() => setPreviewVisible(true)}>
                  Preview
                </button>
              </div>
            )}

            <div id="holdButtons">
              <button type="button" className="noBorder" onClick={handleBack}>
                Back
              </button>
              <input
                id="predaj"
                type="submit"
                value={isLoading ? "Sending..." : "Submit"}
                disabled={isLoading}
              />
            </div>
          </>
        )}
      </form>

      <Overlay isVisible={previewVisible} changeVisibility={setPreviewVisible}>
        {currentImage && (
          <div id="image-preview-carousel">
            <i className="fa-solid fa-angle-left arr" onClick={prevImage}></i>

            <div id="preview-img-wrap">
              <img src={currentImage.previewUrl} alt={currentImage.file.name} />
              <i
                className="fa-solid fa-trash toggle-img-btn included"
                onClick={() => toggleImage(previewIndex)}
              />
            </div>

            <i className="fa-solid fa-angle-right arr" onClick={nextImage}></i>

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
    </div>
  );
}
