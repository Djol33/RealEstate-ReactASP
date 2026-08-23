export const PIB_LENGTH = 9;

export function isValidPib(value: string): boolean {
  const pib = (value ?? '').trim();
  if (pib.length !== PIB_LENGTH || !/^\d+$/.test(pib)) return false;

  let product = 10;
  for (let i = 0; i < PIB_LENGTH - 1; i++) {
    let sum = (product + Number(pib[i])) % 10;
    if (sum === 0) sum = 10;
    product = (sum * 2) % 11;
  }

  return Number(pib[PIB_LENGTH - 1]) === (11 - product) % 10;
}
