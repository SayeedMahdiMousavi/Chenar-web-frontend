import { Form } from 'antd';
import { useEffect, useMemo } from 'react';
import { useGetCalender, useGetRunningPeriod } from '.';
import moment from 'moment';
import dayjs from 'dayjs';
import { changeGToJ, utcDate } from '../Functions/utcDate';
import { defaultStartPeriodDate } from '../constants';

const dateFormat = 'YYYY-MM-DD HH:mm';
const jalaliType: { jalali: boolean } = {
  //@ts-ignore
  jalali: true,
};

export default function useDefaultReportDateFormItem() {
  const [form] = Form.useForm();

  //get running period
  const runningPeriod = useGetRunningPeriod();
  const curStartDate = runningPeriod?.data?.start_date;
  const failureCount: number = runningPeriod?.failureCount;

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  useEffect(() => {
    if (curStartDate) {
      if (calendarCode === 'gregory') {
        form.setFieldsValue({
          dateTime: [moment(curStartDate, dateFormat), utcDate()],
        });
      } else {
        form.setFieldsValue({
          dateTime: [
            //@ts-ignore
            dayjs(changeGToJ(curStartDate, dateFormat), jalaliType),

            dayjs(
              changeGToJ(utcDate().format(dateFormat), dateFormat),
              //@ts-ignore
              jalaliType,
            ),
          ],
        });
      }
    } else if (failureCount > 0) {
      if (calendarCode === 'gregory') {
        form.setFieldsValue({
          dateTime: [moment(defaultStartPeriodDate, dateFormat), utcDate()],
        });
      } else {
        form.setFieldsValue({
          dateTime: [
            //@ts-ignore
            dayjs(changeGToJ(defaultStartPeriodDate, dateFormat), jalaliType),

            dayjs(
              changeGToJ(utcDate().format(dateFormat), dateFormat),
              //@ts-ignore
              jalaliType,
            ),
          ],
        });
      }
    }

    return () => {
      // form.setFieldsValue({
      //   dateTime: [undefined, undefined],
      // });
    };
  }, [calendarCode, curStartDate, failureCount, form]);

  const defaultDate = useMemo(
    () =>
      calendarCode === 'gregory'
        ? curStartDate && [moment(curStartDate, dateFormat), utcDate()]
        : curStartDate && [
            //@ts-ignore
            dayjs(changeGToJ(curStartDate, dateFormat), jalaliType),

            dayjs(
              changeGToJ(utcDate().format(dateFormat), dateFormat),
              //@ts-ignore
              jalaliType,
            ),
          ],
    [calendarCode, curStartDate],
  );

  return { defaultDate, form, dateFormat, calendarCode };
}
