import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { SEO } from "../../../../shared/components/SEO/SEO";
import { useEditListingForm } from './useEditListingForm';
import { useEditImageUpload } from './useEditImageUpload';
import { EditListingFormFields } from './EditListingFormFields';
import { EditImageGrid } from './EditImageGrid';
import { API_URL } from '../../../../config';
import { NotFound } from '../../../NotFound/NotFound';
import '../addRealEstate/style.scss';
import './editImages.scss';

export function EditRealEstate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [typeObject, setTypeObject] = useState<{ id: number; naziv: string }[]>([]);
  const [city, setCity] = useState<{ id: number; cityName: string }[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitError, setSubmitError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [amenityIds, setAmenityIds] = useState<number[]>([]);

  const form = useEditListingForm();
  const images = useEditImageUpload();

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/api/TypeOfObject`),
      axios.get(`${API_URL}/api/CitiesAll`),
      axios.get(`${API_URL}/api/RealEstateMain/${id}`),
    ]).then(([typesRes, citiesRes, estateRes]) => {
      setTypeObject(typesRes.data);
      setCity(citiesRes.data);

      const e = estateRes.data;

      if (e.canEdit === false) {
        setNotFound(true);
        setPageLoading(false);
        return;
      }

      form.loadFromServer(e);

      if (e.images?.length > 0) {
        images.loadExistingImages(e.images);
      }

      if (e.amenities?.length > 0) {
        setAmenityIds(e.amenities.map((a: { id: number }) => a.id));
      }

      setPageLoading(false);
    }).catch((err) => {
      if (err?.response?.status === 404 || err?.response?.status === 403) {
        setNotFound(true);
      } else {
        setSubmitError('Error loading data.');
      }
      setPageLoading(false);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.validate()) return;

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
      payload.append('showMap', String(form.formData.showMap));
      payload.append('area', form.formData.area);
      payload.append('price', form.formData.price);
      payload.append('description', form.formData.description);
      payload.append('status', form.formData.status);

      images.images
        .filter(img => !img.isNew && !img.removed && (img as any).serverId !== undefined)
        .forEach(img => payload.append('existingImageIds[]', String((img as any).serverId)));

      images.images
        .filter(img => img.isNew && !img.removed)
        .forEach(img => payload.append('images[]', (img as any).file));

      amenityIds.forEach(amenityId => payload.append('amenityIds[]', String(amenityId)));

      await axios.put(`${API_URL}/api/RealEstateMain/${id}`, payload);
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

  if (notFound) return <NotFound />;
  if (pageLoading) return <div style={{ textAlign: 'center', marginTop: '40px' }}>Loading...</div>;

  return (
    <div>
      <SEO title={form.formData.title ? `Edit: ${form.formData.title}` : 'Edit listing'} noIndex />
      <form className="estate-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <h1>Edit listing</h1>

        {submitError && <div id="error"><span className="error">{submitError}</span></div>}

        <EditListingFormFields
          formData={form.formData}
          errors={form.errors}
          city={city}
          typeObject={typeObject}
          amenityIds={amenityIds}
          onAmenityChange={setAmenityIds}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          onTerraceChange={form.setTerrace}
          onRegisteredChange={form.setRegistered}
          onShowMapChange={form.setShowMap}
        />

        <label>Images</label>
        <EditImageGrid images={images.images} visibleImages={images.visibleImages} onRemove={images.removeImage} />

        <input type="file" multiple id="images" accept="image/jpeg, image/png, image/jpg"
          ref={fileInputRef} onChange={images.handleFileChange} />
        <label htmlFor="images" id="file">Add images</label>

        {images.imageError && <span className="error">{images.imageError}</span>}

        <input id="predaj" type="submit"
          value={isLoading ? 'Saving...' : 'Save changes'}
          disabled={isLoading} />
      </form>
    </div>
  );
}
