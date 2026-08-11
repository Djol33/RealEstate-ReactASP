import InputWithOptions from '../../../../shared/components/InputWithOptions/InputWithOptions';
import { FilterForm } from './useFilterState';

interface FilterFormFieldsProps {
  formav: FilterForm;
  setForma: React.Dispatch<React.SetStateAction<FilterForm>>;
  typeObject: { id: number; naziv: string }[];
  filterableAmenities: { id: number; name: string; icon: string | null }[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onClamp: () => void;
  onToggleAmenity: (amenityId: number) => void;
}

export function FilterFormFields({
  formav,
  setForma,
  typeObject,
  filterableAmenities,
  onChange,
  onClamp,
  onToggleAmenity,
}: FilterFormFieldsProps) {
  return (
    <>
      <div className="row">
        <label>City</label>
        <InputWithOptions name="city" id="city" setCity={setForma} selectedCity={formav} />
      </div>

      <div className="row">
        <label htmlFor="select">Type of realestate</label>
        <select name="typeObject" id="typeObject" onChange={onChange}>
          <option value="">Any</option>
          {typeObject.map((el, i) => (
            <option value={el.id} key={i}>{el.naziv}</option>
          ))}
        </select>
      </div>

      <div className="row">
        <label htmlFor="minRooms">Minimal Room Amount</label>
        <input type="number" name="minRooms" step="0.5" defaultValue="0" min="0" max="10" id="minRooms" onChange={onChange} />
      </div>

      <div className="row">
        <label htmlFor="">Price Range</label>
        <div className=" range">
          <input type="number" onBlur={onClamp} name="minPrice" id="minPrice" value={formav.minPrice} onChange={onChange} />
          <input type="number" onBlur={onClamp} name="maxPrice" id="maxPrice" value={formav.maxPrice} onChange={onChange} />
        </div>
      </div>

      <div className="row ">
        <div className="options">
          <div className="option">
            <input type="checkbox" name="registered" id="registered" value="true" onChange={onChange} />{' '}
            <label htmlFor="registered">Registered</label>
          </div>
        </div>
      </div>

      {filterableAmenities.length > 0 && (
        <div className="row">
          <label>Amenities</label>
          <div className="options">
            {filterableAmenities.map((a) => (
              <div className="option" key={a.id}>
                <input
                  type="checkbox"
                  id={`amenity-${a.id}`}
                  checked={formav.amenityIds.includes(a.id)}
                  onChange={() => onToggleAmenity(a.id)}
                />
                <label htmlFor={`amenity-${a.id}`}>{a.name}</label>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
