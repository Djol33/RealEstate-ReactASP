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

const step1Fields: (keyof FormFields)[] = [
  'title', 'description', 'cityId', 'address', 'typeObjectId', 'numberOfRooms', 'area', 'price',
];

const emptyForm: FormFields = {
  title: '',
  cityId: '',
  address: '',
  typeObjectId: '',
  numberOfRooms: '',
  terrace: false,
  registered: false,
  area: '',
  price: '',
  description: '',
};

function computeErrors(formData: FormFields): FormErrors {
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
  if (!formData.numberOfRooms.trim()) {
    newErrors.numberOfRooms = 'Number of rooms is required.';
  } else {
    const rooms = parseFloat(formData.numberOfRooms);
    if (isNaN(rooms) || rooms < 0.5 || rooms > 10) {
      newErrors.numberOfRooms = 'Number of rooms must be between 0.5 and 10.';
    }
  }

  if (!formData.area.trim()) {
    newErrors.area = 'Area is required.';
  } else {
    const area = parseFloat(formData.area);
    if (isNaN(area) || area <= 0) {
      newErrors.area = 'Area must be a positive number.';
    } else if (area > 10000) {
      newErrors.area = 'Area cannot exceed 10,000 m².';
    }
  }

  if (!formData.price.trim()) {
    newErrors.price = 'Price is required.';
  } else {
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      newErrors.price = 'Price must be a positive number.';
    } else if (price > 100000000) {
      newErrors.price = 'Price cannot exceed 100,000,000.';
    }
  }

  return newErrors;
}

export function useListingForm(initial: FormFields = emptyForm) {
  const [formData, setFormData] = useState<FormFields>(initial);
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

  function validate(): boolean {
    const newErrors = computeErrors(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validateStep1(): boolean {
    const allErrors = computeErrors(formData);
    const step1Errors: FormErrors = {};
    step1Fields.forEach((field) => {
      if (allErrors[field]) step1Errors[field] = allErrors[field];
    });
    setErrors((prev) => ({
      ...prev,
      ...step1Errors,
      ...Object.fromEntries(step1Fields.filter(f => !step1Errors[f]).map(f => [f, undefined])),
    }));
    return Object.keys(step1Errors).length === 0;
  }

  function hasStep1Error(): boolean {
    const allErrors = computeErrors(formData);
    return step1Fields.some((f) => allErrors[f]);
  }

  return {
    formData,
    setFormData,
    errors,
    handleChange,
    setTerrace,
    setRegistered,
    validate,
    validateStep1,
    hasStep1Error,
  };
}
