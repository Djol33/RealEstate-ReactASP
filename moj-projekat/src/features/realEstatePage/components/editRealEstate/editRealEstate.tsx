import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import '../addRealEstate/style.scss';
import './editImages.scss';

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

type ImageItem =
  | { previewUrl: string; removed: boolean; serverId: number; isNew: false }
  | { previewUrl: string; removed: boolean; file: File; isNew: true };

export function EditRealEstate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const blobUrlsRef = useRef<string[]>([]);

  const [typeObject, setTypeObject] = useState<{ id: number; naziv: string }[]>([]);
  const [city, setCity] = useState<{ id: number; cityName: string }[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  const [formData, setFormData] = useState<FormFields>({
    title: '', cityId: '', address: '', typeObjectId: '',
    numberOfRooms: '', terrace: false, area: '', price: '', description: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);

  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    Promise.all([
      axios.get("https://localhost:7154/api/TypeOfObject"),
      axios.get("https://localhost:7154/api/CitiesAll"),
      axios.get(`https://localhost:7154/api/RealEstateMain/${id}`),
    ]).then(([typesRes, citiesRes, estateRes]) => {
      setTypeObject(typesRes.data);
      setCity(citiesRes.data);

      const e = estateRes.data;
      setFormData({
        title: e.title ?? '',
        cityId: String(e.cityId ?? ''),
        address: e.adress ?? '',
        typeObjectId: String(e.typeObject ?? ''),
        numberOfRooms: String(e.numberOfRooms ?? ''),
        terrace: !!e.terrace,
        area: String(e.area ?? ''),
        price: String(e.price ?? ''),
        description: e.description ?? '',
      });

      if (e.images?.length > 0) {
        setImages(e.images.map((img: { id: number; location: string }) => ({
          previewUrl: `https://localhost:7154/${img.location}`,
          removed: false,
          serverId: img.id,
          isNew: false,
        })));
      }

      setPageLoading(false);
    }).catch(() => {
      setSubmitError('Error loading data.');
      setPageLoading(false);
    });
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormFields]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: ImageItem[] = Array.from(files).map(file => {
      const url = URL.createObjectURL(file);
      blobUrlsRef.current.push(url);
      return { previewUrl: url, removed: false, file, isNew: true };
    });

    setImages(prev => [...prev, ...newItems]);
    // reset input so same files can be re-added if needed
    e.target.value = '';
  }

  function removeImage(index: number) {
    setImages(prev => prev.map((img, i) => i === index ? { ...img, removed: true } : img));
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!formData.title.trim() || formData.title.trim().length < 3)
      newErrors.title = 'Title must be at least 3 characters.';
    if (!formData.cityId) newErrors.cityId = 'Select a city.';
    if (!formData.address.trim()) newErrors.address = 'Address is required.';
    if (!formData.typeObjectId) newErrors.typeObjectId = 'Select a building type.';
    const rooms = parseFloat(formData.numberOfRooms);
    if (!formData.numberOfRooms || isNaN(rooms) || rooms < 0.5 || rooms > 10)
      newErrors.numberOfRooms = 'Rooms must be between 0.5 and 10.';
    const area = parseFloat(formData.area);
    if (!formData.area || isNaN(area) || area <= 0)
      newErrors.area = 'Area must be a positive number.';
    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price < 0)
      newErrors.price = 'Price must be a positive number.';
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

      images
        .filter(img => !img.isNew && !img.removed && (img as any).serverId !== undefined)
        .forEach(img => payload.append('existingImageIds[]', String((img as any).serverId)));

      images
        .filter(img => img.isNew && !img.removed)
        .forEach(img => payload.append('images[]', (img as any).file));

      await axios.put(`https://localhost:7154/api/RealEstateEdit/${id}`, payload);
      navigate(`/realestate/${id}`);
    } catch (err: any) {
      if (err.response?.status === 400) {
        setSubmitError('Please check your inputs and try again.');
      } else if (err.response?.status === 401) {
        setSubmitError('You are not authorized to edit this listing.');
      } else {
        setSubmitError('Error saving changes. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  const visibleImages = images.filter(img => !img.removed);

  if (pageLoading) return <div style={{ textAlign: 'center', marginTop: '40px' }}>Loading...</div>;

  return (
    <div>
      <form className="estate-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <h1>Edit listing</h1>

        {submitError && <div id="error"><span className="error">{submitError}</span></div>}

        <label htmlFor="title1">Title</label>
        <input type="text" id="title1" name="title" placeholder="Title"
          value={formData.title} onChange={handleChange} />
        {errors.title && <span className="error">{errors.title}</span>}

        <label htmlFor="city">Select city</label>
        <select name="cityId" id="city" value={formData.cityId} onChange={handleChange}>
        
          {city.map(a => <option key={a.id} value={String(a.id)}>{a.cityName}</option>)}
        </select>
        {errors.cityId && <span className="error">{errors.cityId}</span>}

        <label htmlFor="adresa">Address</label>
        <input type="text" id="adresa" name="address" placeholder="e.g. Main Street 12"
          value={formData.address} onChange={handleChange} />
        {errors.address && <span className="error">{errors.address}</span>}

        <label htmlFor="tipObjekta">Type Of Building</label>
        <select name="typeObjectId" id="tipObjekta" value={formData.typeObjectId} onChange={handleChange}>
        
          {typeObject.map(el => <option key={el.id} value={String(el.id)}>{el.naziv}</option>)}
        </select>
        {errors.typeObjectId && <span className="error">{errors.typeObjectId}</span>}

        <label htmlFor="numberrooms">Number of rooms</label>
        <input type="number" id="numberrooms" name="numberOfRooms"
          min="0.5" step="0.5" max="10" value={formData.numberOfRooms} onChange={handleChange} />
        {errors.numberOfRooms && <span className="error">{errors.numberOfRooms}</span>}

        <label>Does it have a terrace/balcony</label>
        <div id="terasa">
          <div>
            <input type="radio" name="terrace" id="prvi" value="true"
              checked={formData.terrace === true}
              onChange={() => setFormData(prev => ({ ...prev, terrace: true }))} />
            <label htmlFor="prvi">Yes</label>
          </div>
          <div>
            <input type="radio" name="terrace" id="drugi" value="false"
              checked={formData.terrace === false}
              onChange={() => setFormData(prev => ({ ...prev, terrace: false }))} />
            <label htmlFor="drugi">No</label>
          </div>
        </div>

        <label htmlFor="kvadratura">Area (m²)</label>
        <input type="number" id="kvadratura" name="area" min="1"
          value={formData.area} onChange={handleChange} />
        {errors.area && <span className="error">{errors.area}</span>}

        <label htmlFor="cena">Total price (€)</label>
        <input type="number" id="cena" name="price" min="0" step="500"
          value={formData.price} onChange={handleChange} />
        {errors.price && <span className="error">{errors.price}</span>}

        <label htmlFor="dodatniopis">Description</label>
        <input type="text" id="dodatniopis" name="description"
          value={formData.description} onChange={handleChange} />

        {/* Image grid */}
        <label>Images</label>

        {visibleImages.length > 0 && (
          <div className="edit-image-grid">
            {visibleImages.map((img, i) => (
              <div key={i} className={`edit-thumb ${img.isNew ? 'is-new' : ''}`}>
                <img src={img.previewUrl} alt="" />
                <button type="button" className="thumb-remove" onClick={() => removeImage(images.indexOf(img))}>
                  <i className="fa-solid fa-xmark" />
                </button>
                {img.isNew && <span className="new-badge">New</span>}
              </div>
            ))}
          </div>
        )}

        <input type="file" multiple id="images" accept="image/jpeg, image/png, image/jpg"
          ref={fileInputRef} onChange={handleFileChange} />
        <label htmlFor="images" id="file">Add images</label>

        <input id="predaj" type="submit"
          value={isLoading ? 'Saving...' : 'Save changes'}
          disabled={isLoading} />
      </form>
    </div>
  );
}
