import { useEffect, useState } from 'react';
import axios from 'axios';
import './AmenityCheckboxList.scss';

interface Amenity {
  id: number;
  name: string;
}

interface AmenityCheckboxListProps {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export function AmenityCheckboxList({ selectedIds, onChange }: AmenityCheckboxListProps) {
  const [amenities, setAmenities] = useState<Amenity[]>([]);

  useEffect(() => {
    axios.get('https://localhost:7154/api/amenities').then((res) => setAmenities(res.data));
  }, []);

  function toggle(id: number) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  if (amenities.length === 0) return null;

  return (
    <div className="amenity-checkbox-list">
      {amenities.map((a) => (
        <label key={a.id} className="amenity-checkbox">
          <input
            type="checkbox"
            checked={selectedIds.includes(a.id)}
            onChange={() => toggle(a.id)}
          />
          {a.name}
        </label>
      ))}
    </div>
  );
}
