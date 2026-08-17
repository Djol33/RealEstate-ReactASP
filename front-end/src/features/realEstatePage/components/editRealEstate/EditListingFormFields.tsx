import { AmenityCheckboxList } from '../../../../shared/components/AmenityCheckboxList/AmenityCheckboxList';
import { FormFields, FormErrors } from './useEditListingForm';

interface EditListingFormFieldsProps {
  formData: FormFields;
  errors: FormErrors;
  city: { id: number; cityName: string }[];
  typeObject: { id: number; naziv: string }[];
  amenityIds: number[];
  onAmenityChange: (ids: number[]) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onTerraceChange: (value: boolean) => void;
  onRegisteredChange: (value: boolean) => void;
}

export function EditListingFormFields({
  formData,
  errors,
  city,
  typeObject,
  amenityIds,
  onAmenityChange,
  onChange,
  onTerraceChange,
  onRegisteredChange,
}: EditListingFormFieldsProps) {
  return (
    <>
      <label htmlFor="title1">Title</label>
      <input type="text" id="title1" name="title" placeholder="Title"
        value={formData.title} onChange={onChange}
        className={errors.title ? 'input-error' : ''} />
      {errors.title && <span className="error">{errors.title}</span>}

      <label htmlFor="city">Select city</label>
      <select name="cityId" id="city" value={formData.cityId} onChange={onChange}>

        {city.map(a => <option key={a.id} value={String(a.id)}>{a.cityName}</option>)}
      </select>
      {errors.cityId && <span className="error">{errors.cityId}</span>}

      <label htmlFor="adresa">Address</label>
      <input type="text" id="adresa" name="address" placeholder="e.g. Main Street 12"
        value={formData.address} onChange={onChange}
        className={errors.address ? 'input-error' : ''} />
      {errors.address && <span className="error">{errors.address}</span>}

      <label htmlFor="tipObjekta">Type Of Building</label>
      <select name="typeObjectId" id="tipObjekta" value={formData.typeObjectId} onChange={onChange}>

        {typeObject.map(el => <option key={el.id} value={String(el.id)}>{el.naziv}</option>)}
      </select>
      {errors.typeObjectId && <span className="error">{errors.typeObjectId}</span>}

      <label htmlFor="status">Listing status</label>
      <select name="status" id="status" value={formData.status} onChange={onChange}>
        <option value="0">Available</option>
        <option value="1">Reserved</option>
        <option value="2">Sold</option>
      </select>

      <label htmlFor="numberrooms">Number of rooms</label>
      <input type="number" id="numberrooms" name="numberOfRooms"
        min="0.5" step="0.5" max="10" value={formData.numberOfRooms} onChange={onChange}
        className={errors.numberOfRooms ? 'input-error' : ''} />
      {errors.numberOfRooms && <span className="error">{errors.numberOfRooms}</span>}

      <label htmlFor="prvi">Does it have a terrace/balcony</label>
      <div className="toggle-group">
        <label htmlFor="prvi" className={formData.terrace === true ? 'active' : ''}>
          <input type="radio" name="terrace" id="prvi" value="true"
            checked={formData.terrace === true}
            onChange={() => onTerraceChange(true)} />
          Yes
        </label>
        <label htmlFor="drugi" className={formData.terrace === false ? 'active' : ''}>
          <input type="radio" name="terrace" id="drugi" value="false"
            checked={formData.terrace === false}
            onChange={() => onTerraceChange(false)} />
          No
        </label>
      </div>

      <label htmlFor="registrovanoDa">Is the property legally registered?</label>
      <div className="toggle-group">
        <label htmlFor="registrovanoDa" className={formData.registered === true ? 'active' : ''}>
          <input type="radio" name="registered" id="registrovanoDa" value="true"
            checked={formData.registered === true}
            onChange={() => onRegisteredChange(true)} />
          Yes
        </label>
        <label htmlFor="registrovanoNe" className={formData.registered === false ? 'active' : ''}>
          <input type="radio" name="registered" id="registrovanoNe" value="false"
            checked={formData.registered === false}
            onChange={() => onRegisteredChange(false)} />
          No
        </label>
      </div>

      <label>Amenities</label>
      <AmenityCheckboxList selectedIds={amenityIds} onChange={onAmenityChange} />

      <label htmlFor="kvadratura">Area (m²)</label>
      <input type="number" id="kvadratura" name="area" min="1" max="10000"
        value={formData.area} onChange={onChange}
        className={errors.area ? 'input-error' : ''} />
      {errors.area && <span className="error">{errors.area}</span>}

      <label htmlFor="cena">Total price (€)</label>
      <input type="number" id="cena" name="price" min="0" max="100000000" step="500"
        value={formData.price} onChange={onChange}
        className={errors.price ? 'input-error' : ''} />
      {errors.price && <span className="error">{errors.price}</span>}

      <label htmlFor="dodatniopis">Description</label>
      <input type="text" id="dodatniopis" name="description"
        value={formData.description} onChange={onChange} />
      {errors.description && <span className="error">{errors.description}</span>}
    </>
  );
}
