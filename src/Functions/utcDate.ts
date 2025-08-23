import moment from 'moment';
// import i18n from "i18next";
//@ts-ignore
import jalaliMoment from 'moment-jalaali';
import dayjs from 'dayjs';
import { indianToArabic } from './arabicToIndian';
export const utcDate = () => {
  return moment.utc().add(4.5, 'hours');
};

export const jalaaliDate = () => {
  //
  const date = dayjs();
  const jalaliDate = date.calendar('jalali');
  return jalaliDate;
};

export const changeGToJ = (
  date: string,
  dateFormat: string | undefined,
  datePFormat?: string,
  type?: string,
) => {
  // const lang = i18n.language;
  //
  // if (lang === "en") {

  //     return jalaliMoment(date, dateFormat).format("jYYYY/jM/jD HH:mm:ss");

  // } else {
  const newDate = indianToArabic(date);
  const newDate1 = jalaliMoment(newDate, dateFormat).format(
    datePFormat ? datePFormat : 'jYYYY/jM/jD HH:mm:ss',
  );

  return type === 'show' ? newDate1 : indianToArabic(newDate1);
  // }
};

export const changeJToG = (date: string, dateFormat: string) => {
  // const newDate = momentJalali.from(date, "fa", dateFormat).format(dateFormat);
  const newDate = jalaliMoment(date, 'jYYYY/jM/jD HH:mm').format(dateFormat);
  //
  return newDate;
};
export const handlePrepareDateForServer = ({
  date,
  dateFormat,
  calendarCode,
}: {
  date: any;
  dateFormat?: string;
  calendarCode: string;
}) => {
  const finalDateFormat = dateFormat ?? 'YYYY-MM-DD HH:mm:ss';
  const newDate =
    date &&
    indianToArabic(
      calendarCode === 'gregory'
        ? (date?.format(finalDateFormat) ?? '')
        : (changeJToG(
            date.locale('fa').format(finalDateFormat),
            finalDateFormat,
          ) ?? ''),
    );
  return newDate ?? null;
};

export const handlePrepareDateForDateField = ({
  date,
  dateFormat,
  calendarCode,
}: {
  date: any;
  dateFormat?: string;
  calendarCode: string;
}) => {
  const finalDateFormat = dateFormat ?? 'YYYY-MM-DD HH:mm';

  const newDate =
    date &&
    (calendarCode === 'gregory'
      ? moment(date, finalDateFormat)
      : dayjs(changeGToJ(date, finalDateFormat), {
          //@ts-ignore
          jalali: true,
        }));

  return newDate ?? '';
};
