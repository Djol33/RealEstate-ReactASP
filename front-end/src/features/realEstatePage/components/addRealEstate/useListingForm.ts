import { useState } from 'react';
import {
  FormFields,
  FormErrors,
  TouchedFields,
  computeRealEstateErrors,
} from '../../validation/realEstateRules';

export type { FormFields, FormErrors, TouchedFields };

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
  showMap: true,
  area: '',
  price: '',
  description: '',
};

export function useListingForm(initial: FormFields = emptyForm) {
  const [formData, setFormData] = useState<FormFields>(initial);
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

  function markAllTouched(fields: (keyof FormFields)[]) {
    setTouched(prev => ({
      ...prev,
      ...Object.fromEntries(fields.map(f => [f, true])),
    }));
  }

  function validate(): boolean {
    const newErrors = computeRealEstateErrors(formData);
    setErrors(newErrors);
    markAllTouched(Object.keys(emptyForm) as (keyof FormFields)[]);
    return Object.keys(newErrors).length === 0;
  }

  function validateStep1(): boolean {
    const allErrors = computeRealEstateErrors(formData);
    const step1Errors: FormErrors = {};
    step1Fields.forEach((field) => {
      if (allErrors[field]) step1Errors[field] = allErrors[field];
    });
    setErrors((prev) => ({
      ...prev,
      ...step1Errors,
      ...Object.fromEntries(step1Fields.filter(f => !step1Errors[f]).map(f => [f, undefined])),
    }));
    markAllTouched(step1Fields);
    return Object.keys(step1Errors).length === 0;
  }

  function hasStep1Error(): boolean {
    const allErrors = computeRealEstateErrors(formData);
    return step1Fields.some((f) => allErrors[f]);
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
    validate,
    validateStep1,
    hasStep1Error,
  };
}
