export function arabicToIndian(value: number | undefined) {
  if (!value && value !== 0) {
    return value;
  }
  let result = value.toString();
  let englishNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    persianNumbers = ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰'];

  for (let i = 0, numbersLen = englishNumbers.length; i < numbersLen; i++) {
    result = result.replace(
      new RegExp(englishNumbers[i], 'g'),
      persianNumbers[i],
    );
  }
  return result;
}

let persianNumbers = [
    /۰/g,
    /۱/g,
    /۲/g,
    /۳/g,
    /۴/g,
    /۵/g,
    /۶/g,
    /۷/g,
    /۸/g,
    /۹/g,
  ],
  arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
export function indianToArabic(str: string) {
  if (typeof str === 'string') {
    for (var i = 0; i < 10; i++) {
      //@ts-ignore
      str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
    }
  }
  return str;
}
