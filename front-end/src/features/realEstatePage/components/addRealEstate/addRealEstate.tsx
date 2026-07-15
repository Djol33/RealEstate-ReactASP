import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Overlay } from "../../../../shared/components/Overlay/Overlay";
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

export function AddRealEstate() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
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
    blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    if (!files || files.length === 0) {
      blobUrlsRef.current = [];
      setPreviewImages([]);
      return;
    }
    const newImages: PreviewImage[] = Array.from(files).map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
      enabled: true,
    }));
    blobUrlsRef.current = newImages.map(img => img.previewUrl);
    setPreviewImages(newImages);
    setPreviewIndex(0);
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

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!formData.title.trim() || formData.title.trim().length < 3) {
      newErrors.title = 'Naslov mora imati najmanje 3 karaktera.';
    }
    if (!formData.cityId) {
      newErrors.cityId = 'Odaberite grad.';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Adresa je obavezna.';
    }
    if (!formData.typeObjectId) {
      newErrors.typeObjectId = 'Odaberite tip objekta.';
    }
    const rooms = parseFloat(formData.numberOfRooms);
    if (!formData.numberOfRooms || isNaN(rooms) || rooms < 0.5 || rooms > 10) {
      newErrors.numberOfRooms = 'Broj soba mora biti između 0.5 i 10.';
    }
    const area = parseFloat(formData.area);
    if (!formData.area || isNaN(area) || area <= 0) {
      newErrors.area = 'Kvadratura mora biti pozitivan broj.';
    }
    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price < 0) {
      newErrors.price = 'Cena mora biti pozitivan broj.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

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

      await axios.post('https://localhost:7154/api/RealEstateMain', payload);

      navigate('/');
    } catch (err: any) {
      if (err.response?.status === 400) {
        setSubmitError('Proverite unete podatke i pokušajte ponovo.');
      } else if (err.response?.status === 401) {
        setSubmitError('Morate biti prijavljeni da dodate oglas.');
      } else {
        setSubmitError('Greška pri dodavanju nekretnine. Pokušajte ponovo.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  const visibleImages = previewImages.filter(img => img.enabled);
  const currentImage = visibleImages[previewIndex];

  return (
    <div>
      <form className="estate-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <h1>Dodaj nekretninu</h1>

        {submitError && <div id="error"><span className="error">{submitError}</span></div>}

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

        <label htmlFor="city">Select city</label>
        <select name="cityId" id="city" value={formData.cityId} onChange={handleChange}>
          <option value="">-- Odaberite grad --</option>
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
          <option value="">-- Odaberite tip --</option>
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

        <label htmlFor="kvadratura">Area (m²)</label>
        <input
          type="number"
          id="kvadratura"
          name="area"
          min="1"
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
          step="500"
          value={formData.price}
          onChange={handleChange}
        />
        {errors.price && <span className="error">{errors.price}</span>}

        <label htmlFor="dodatniopis">Description</label>
        <input
          type="text"
          id="dodatniopis"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

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

        {visibleImages.length > 0 && (
          <div id="image-preview-info">
            <button type="button" id="preview-btn" onClick={() => setPreviewVisible(true)}>
              Preview
            </button>
          </div>
        )}

        <input
          id="predaj"
          type="submit"
          value={isLoading ? "Slanje..." : "Submit"}
          disabled={isLoading}
        />
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
