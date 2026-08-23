export const NAME_MIN_LENGTH = 3;
export const NAME_MAX_LENGTH = 30;

export const NAME_PATTERN = /^\p{L}+(?:[ '\-]\p{L}+)*$/u;

export function isValidPersonName(value: string): boolean {
  const name = (value ?? '').trim();
  if (!name) return false;

  return NAME_PATTERN.test(name);
}

export function validatePersonName(value: string, label: string): string | null {
  const name = (value ?? '').trim();

  if (!name) return `${label} cannot be empty.`;
  if (name.length < NAME_MIN_LENGTH) return `${label} must be at least ${NAME_MIN_LENGTH} characters.`;
  if (name.length > NAME_MAX_LENGTH) return `${label} cannot exceed ${NAME_MAX_LENGTH} characters.`;
  if (!NAME_PATTERN.test(name)) return `${label} must contain only letters.`;

  return null;
}
