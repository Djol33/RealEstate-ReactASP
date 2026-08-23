import { FormFields, FormErrors } from './useListingForm';

interface ListingDetailsStepProps {
  formData: FormFields;
  errors: FormErrors;
  city: { id: number; cityName: string }[];
  typeObject: { id: number; naziv: string }[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onTerraceChange: (value: boolean) => void;
  onRegisteredChange: (value: boolean) => void;
  onShowMapChange: (value: boolean) => void;
  onNext: () => void;
}

export function ListingDetailsStep({
  formData,
  errors,
  city,
  typeObject,
  onChange,
  onBlur,
  onTerraceChange,
  onRegisteredChange,
  onShowMapChange,
  onNext,
}: ListingDetailsStepProps) {
  return (
    <>
      <label htmlFor="title1">Title</label>
      <input
        type="text"
        id="title1"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={onChange}
        onBlur={onBlur}
        className={errors.title ? 'input-error' : ''}
      />
      {errors.title && <span className="error">{errors.title}</span>}

      <label htmlFor="dodatniopis">Description</label>
      <input
        type="text"
        id="dodatniopis"
        name="description"
        value={formData.description}
        onChange={onChange}
        onBlur={onBlur}
        className={errors.description ? 'input-error' : ''}
      />
      {errors.description && <span className="error">{errors.description}</span>}

      <label htmlFor="city">Select city</label>
      <select name="cityId" id="city" value={formData.cityId} onChange={onChange}
        onBlur={onBlur}
        className={errors.cityId ? 'input-error' : ''}>
        <option value="">Select a city</option>
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
        onChange={onChange}
        onBlur={onBlur}
        className={errors.address ? 'input-error' : ''}
      />
      {errors.address && <span className="error">{errors.address}</span>}

      <label htmlFor="tipObjekta">Type Of Building</label>
      <select name="typeObjectId" id="tipObjekta" value={formData.typeObjectId} onChange={onChange}
        onBlur={onBlur}
        className={errors.typeObjectId ? 'input-error' : ''}>
        <option value="">Select a type</option>
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
        onChange={onChange}
        onBlur={onBlur}
        className={errors.numberOfRooms ? 'input-error' : ''}
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
        onChange={onChange}
        onBlur={onBlur}
        className={errors.area ? 'input-error' : ''}
      />
      {errors.area && <span className="error">{errors.area}</span>}

      <label htmlFor="cena">Total price (€)</label>
      <input
        type="number"
        id="cena"
        name="price"
        min="1000"
        max="100000000"
        step="100"
        value={formData.price}
        onChange={onChange}
        onBlur={onBlur}
        className={errors.price ? 'input-error' : ''}
      />
      {errors.price && <span className="error">{errors.price}</span>}

      <label htmlFor="prvi">Does it have a terrace/balcony</label>
      <div className="toggle-group">
        <label htmlFor="prvi" className={formData.terrace === true ? 'active' : ''}>
          <input
            type="radio"
            name="terrace"
            id="prvi"
            value="true"
            checked={formData.terrace === true}
            onChange={() => onTerraceChange(true)}
          />
          Yes
        </label>
        <label htmlFor="drugi" className={formData.terrace === false ? 'active' : ''}>
          <input
            type="radio"
            name="terrace"
            id="drugi"
            value="false"
            checked={formData.terrace === false}
            onChange={() => onTerraceChange(false)}
          />
          No
        </label>
      </div>

      <label htmlFor="registrovanoDa">Is the property legally registered?</label>
      <div className="toggle-group">
        <label htmlFor="registrovanoDa" className={formData.registered === true ? 'active' : ''}>
          <input
            type="radio"
            name="registered"
            id="registrovanoDa"
            value="true"
            checked={formData.registered === true}
            onChange={() => onRegisteredChange(true)}
          />
          Yes
        </label>
        <label htmlFor="registrovanoNe" className={formData.registered === false ? 'active' : ''}>
          <input
            type="radio"
            name="registered"
            id="registrovanoNe"
            value="false"
            checked={formData.registered === false}
            onChange={() => onRegisteredChange(false)}
          />
          No
        </label>
      </div>


      <label htmlFor="showMapYes">Show map on the listing?</label>
      <div className="toggle-group">
        <label htmlFor="showMapYes" className={formData.showMap === true ? 'active' : ''}>
          <input type="radio" name="showMap" id="showMapYes" value="true"
            checked={formData.showMap === true}
            onChange={() => onShowMapChange(true)} />
          Yes
        </label>
        <label htmlFor="showMapNo" className={formData.showMap === false ? 'active' : ''}>
          <input type="radio" name="showMap" id="showMapNo" value="false"
            checked={formData.showMap === false}
            onChange={() => onShowMapChange(false)} />
          No
        </label>
      </div>

      <div id="holdButtons">
        <button type="button" id="predaj" onClick={onNext}>
          Next
        </button>
      </div>
    </>
  );
}
