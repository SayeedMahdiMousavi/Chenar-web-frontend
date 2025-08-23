import React from 'react';
import moment from 'moment';
import { changeGToJ } from '../../../Functions/utcDate';
import useGetCalender from '../../../Hooks/useGetCalender';

const dateFormat = 'YYYY-MM-DD HH:mm';
const datePFormat = 'jYYYY/jM/jD HH:mm';
const ShowDate = React.memo(
  ({
    date,
    dateFormat: gregoryFormat,
    datePFormat: JalaliFormat,
  }: {
    date: string;
    dateFormat?: string;
    datePFormat?: string;
  }) => {
    //get current calender
    const userCalender = useGetCalender();
    const calenderCode = userCalender?.data?.user_calender?.code;
    const gf = Boolean(gregoryFormat) ? gregoryFormat : dateFormat;
    const jf = Boolean(JalaliFormat) ? JalaliFormat : datePFormat;
    const finalDate =
      date &&
      (calenderCode === 'gregory'
        ? moment(date)?.format(gf)
        : changeGToJ(moment(date)?.format(gf), gf, jf, 'show'));
    return <React.Fragment>{finalDate}</React.Fragment>;
  },
);

export default ShowDate;
