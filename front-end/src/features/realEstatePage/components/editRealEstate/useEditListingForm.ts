import { useState } from 'react';
import {
  FormFields,
  FormErrors,
  TouchedFields,
  computeRealEstateErrors,
} from '../../validation/realEstateRules';

export type { FormFields, FormErrors, TouchedFields };

const emptyForm: FormFields = {
  title: '', cityId: '', address: '', typeObjectId: '',
  numberOfRooms: '', terrace: false, registered: false, showMap: true, area: '', price: '', description: '',
  status: '0',
};

export function useEditListingForm() {
  const [formData, setFormData] = useState<FormFields>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});

  function revalidate(name: keyof FormFields, data: FormFields) {
    const all = computeRealEstateErrors(data);
    setErrors(prev => ({ ...prev, [name]: all[name] }));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    const field = name as keyof FormFields;
    const next = { ...formData, [field]: value } as FormFields;

    setFormData(next);

    if (touched[field]) {
      revalidate(field, next);
    } else if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const field = e.target.name as keyof FormFields;
    if (!field) return;
    setTouched(prev => ({ ...prev, [field]: true }));
    revalidate(field, formData);
  }

  function setTerrace(value: boolean) {
    setFormData(prev => ({ ...prev, terrace: value }));
  }

  function setRegistered(value: boolean) {
    setFormData(prev => ({ ...prev, registered: value }));
  }

  function setShowMap(value: boolean) {
    setFormData(prev => ({ ...prev, showMap: value }));
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
      showMap: e.showMap !== false,
      area: String(e.area ?? ''),
      price: String(e.price ?? ''),
      description: e.description ?? '',
      status: String(e.status ?? 0),
    });
    setErrors({});
    setTouched({});
  }

  function validate(): boolean {
    const newErrors = computeRealEstateErrors(formData);
    setErrors(newErrors);
    setTouched(Object.fromEntries(Object.keys(emptyForm).map(k => [k, true])) as TouchedFields);
    return Object.keys(newErrors).length === 0;
  }

  return {
    formData,
    setFormData,
    errors,
    touched,
    handleChange,
    handleBlur,
    setTerrace,
    setRegistered,
    setShowMap,
    loadFromServer,
    validate,
  };
}
