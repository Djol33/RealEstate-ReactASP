import { useState } from 'react';

export interface FormFields {
  title: string;
  cityId: string;
  address: string;
  typeObjectId: string;
  numberOfRooms: string;
  terrace: boolean;
  registered: boolean;
  area: string;
  price: string;
  description: string;
}

export type FormErrors = Partial<Record<keyof FormFields, string>>;

const emptyForm: FormFields = {
  title: '', cityId: '', address: '', typeObjectId: '',
  numberOfRooms: '', terrace: false, registered: false, area: '', price: '', description: '',
};

export function useEditListingForm() {
  const [formData, setFormData] = useState<FormFields>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormFields]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }

  function setTerrace(value: boolean) {
    setFormData(prev => ({ ...prev, terrace: value }));
  }

  function setRegistered(value: boolean) {
    setFormData(prev => ({ ...prev, registered: value }));
  }

  function loadFromServer(e: any) {
    setFormData({
      title: e.title ?? '',
      cityId: String(e.cityId ?? ''),
      address: e.adress ?? '',
      typeObjectId: String(e.typeObject ?? ''),
      numberOfRooms: String(e.numberOfRooms ?? ''),
      terrace: !!e.terrace,
      registered: !!e.registered,
      area: String(e.area ?? ''),
      price: String(e.price ?? ''),
      description: e.description ?? '',
    });
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!formData.title.trim() || formData.title.trim().length < 3)
      newErrors.title = 'Title must be at least 3 characters.';
    else if (formData.title.trim().length > 200)
      newErrors.title = 'Title cannot exceed 200 characters.';
    if (!formData.description.trim() || formData.description.trim().length < 20)
      newErrors.description = 'Description must be at least 20 characters.';
    if (!formData.cityId) newErrors.cityId = 'Select a city.';
    if (!formData.address.trim()) newErrors.address = 'Address is required.';
    if (!formData.typeObjectId) newErrors.typeObjectId = 'Select a building type.';

    if (!formData.numberOfRooms.trim()) {
      newErrors.numberOfRooms = 'Number of rooms is required.';
    } else {
      const rooms = parseFloat(formData.numberOfRooms);
      if (isNaN(rooms) || rooms < 0.5 || rooms > 10)
        newErrors.numberOfRooms = 'Rooms must be between 0.5 and 10.';
    }

    if (!formData.area.trim()) {
      newErrors.area = 'Area is required.';
    } else {
      const area = parseFloat(formData.area);
      if (isNaN(area) || area <= 0)
        newErrors.area = 'Area must be a positive number.';
      else if (area > 10000)
        newErrors.area = 'Area cannot exceed 10,000 m².';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required.';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0)
        newErrors.price = 'Price must be a positive number.';
      else if (price > 100000000)
        newErrors.price = 'Price cannot exceed 100,000,000.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  return {
    formData,
    setFormData,
    errors,
    handleChange,
    setTerrace,
    setRegistered,
    loadFromServer,
    validate,
  };
}
