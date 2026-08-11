import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../config';
import './InputWithOptions.scss';

interface City {
  id: number;
  cityName: string;
}

interface InputWithOptionsProps {
  name: string;
  id: string;
  setCity: (updater: (prev: any) => any) => void;
  selectedCity: { city: City[] };
}

export default function InputWithOptions({ name, id, setCity, selectedCity }: InputWithOptionsProps) {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      const ignore = selectedCity.city.length ? selectedCity.city.map((x) => x.id).join(',') : '';
      axios
        .get(`${API_URL}/api/City?CityName=${encodeURIComponent(inputValue)}&CitiesToIgnore=${ignore}`)
        .then((res) => setOptions(res.data))
        .finally(() => setLoading(false));
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, selectedCity]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectCity(item: City) {
    setCity((prev) => ({
      ...prev,
      city: [...prev.city, item],
    }));
    setInputValue('');
  }

  function removeCity(item: City) {
    setCity((prev) => ({
      ...prev,
      city: prev.city.filter((c: City) => c.id !== item.id),
    }));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setIsOpen(false);
      (e.target as HTMLElement).blur();
    }
  }

  return (
    <div className="city-picker" ref={wrapperRef}>
      <div className="city-picker-input-wrap">
        <i className="fa-solid fa-magnifying-glass city-picker-icon" />
        <input
          type="text"
          name={name}
          id={id}
          placeholder="Search for a city..."
          value={inputValue}
          style={{ paddingLeft: 30 }}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        {isOpen && (
          <div className="city-picker-dropdown">
            {loading ? (
              <div className="city-picker-status">Searching...</div>
            ) : options.length === 0 ? (
              <div className="city-picker-status">No cities found.</div>
            ) : (
              options.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className="city-picker-option"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectCity(item);
                  }}
                >
                  <i className="fa-solid fa-location-dot" />
                  {item.cityName}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {selectedCity.city.length > 0 && (
        <div className="city-picker-chips">
          {selectedCity.city.map((item) => (
            <span className="city-chip" key={item.id}>
              {item.cityName}
              <button
                type="button"
                className="city-chip-remove"
                aria-label={`Remove ${item.cityName}`}
                onClick={() => removeCity(item)}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
