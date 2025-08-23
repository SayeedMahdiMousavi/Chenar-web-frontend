import { create, all } from 'mathjs';
const config = {
  // Default type of number
  // Available options: 'number' (default), 'BigNumber', or 'Fraction'
  number: 'BigNumber',
  // number:"Fraction",

  // Number of significant digits for BigNumbers
  precision: 60,
};
//@ts-ignore
export const math = create(all, config);
export function print(value: any) {
  //@ts-ignore
  const newValue = math.format(value);
  return newValue ? newValue : 0;
}

export const fixedNumber = (value: number | string, fixed?: number) => {
  //@ts-ignore
  const newValue = parseFloat(parseFloat(value).toFixed(fixed ? fixed : 4));
  return newValue ? newValue : 0;
};
