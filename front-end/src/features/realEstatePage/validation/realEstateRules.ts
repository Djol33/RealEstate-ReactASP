export interface FormFields {
  title: string;
  cityId: string;
  address: string;
  typeObjectId: string;
  numberOfRooms: string;
  terrace: boolean;
  registered: boolean;
  showMap: boolean;
  area: string;
  price: string;
  description: string;
  status?: string;
}

export type FormErrors = Partial<Record<keyof FormFields, string>>;
export type TouchedFields = Partial<Record<keyof FormFields, boolean>>;

export const TITLE_MIN = 3;
export const TITLE_MAX = 200;
export const DESCRIPTION_MIN = 20;
export const ROOMS_MIN = 0.5;
export const ROOMS_MAX = 10;
export const AREA_MAX = 10000;
export const PRICE_MIN = 1000;
export const PRICE_STEP = 100;
export const PRICE_MAX = 100000000;

export function computeRealEstateErrors(formData: FormFields): FormErrors {
  const newErrors: FormErrors = {};

  if (!formData.title.trim() || formData.title.trim().length < TITLE_MIN) {
    newErrors.title = `Title must be at least ${TITLE_MIN} characters.`;
  } else if (formData.title.trim().length > TITLE_MAX) {
    newErrors.title = `Title cannot exceed ${TITLE_MAX} characters.`;
  }

  if (!formData.description.trim() || formData.description.trim().length < DESCRIPTION_MIN) {
    newErrors.description = `Description must be at least ${DESCRIPTION_MIN} characters.`;
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
    if (isNaN(rooms) || rooms < ROOMS_MIN || rooms > ROOMS_MAX) {
      newErrors.numberOfRooms = `Number of rooms must be between ${ROOMS_MIN} and ${ROOMS_MAX}.`;
    }
  }

  if (!formData.area.trim()) {
    newErrors.area = 'Area is required.';
  } else {
    const area = parseFloat(formData.area);
    if (isNaN(area) || area <= 0) {
      newErrors.area = 'Area must be a positive number.';
    } else if (area > AREA_MAX) {
      newErrors.area = `Area cannot exceed ${AREA_MAX.toLocaleString('en-US')} m².`;
    }
  }

  if (!formData.price.trim()) {
    newErrors.price = 'Price is required.';
  } else {
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      newErrors.price = 'Price must be a positive number.';
    } else if (price < PRICE_MIN) {
      newErrors.price = `Price must be at least ${PRICE_MIN.toLocaleString('en-US')}.`;
    } else if (price % PRICE_STEP !== 0) {
      newErrors.price = `Price must be rounded to the nearest ${PRICE_STEP}.`;
    } else if (price > PRICE_MAX) {
      newErrors.price = `Price cannot exceed ${PRICE_MAX.toLocaleString('en-US')}.`;
    }
  }

  return newErrors;
}
