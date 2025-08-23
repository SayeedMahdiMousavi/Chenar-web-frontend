import React, { useState } from 'react';
import { Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { changeGToJ, utcDate } from '../../../Functions/utcDate';
import DateFormItem from '../../SelfComponents/DateFormItem';
import { RangePickerFormItem } from '../../SelfComponents/JalaliAntdComponents/RangePickerFormItem';
import dayjs from 'dayjs';
import moment from 'moment';
import useGetRunningPeriod from '../../../Hooks/useGetRunningPeriod';
import useGetCalender from '../../../Hooks/useGetCalender';
import { indianToArabic } from '../../../Functions/arabicToIndian';

const jalaliType: { jalali: boolean } = {
  //@ts-ignore
  jalali: true,
};

const ReportDateFormItem = React.memo(
  (props: { form: any; style: React.CSSProperties; type?: string }) => {
    const { t } = useTranslation();
    const [dateType, setDateType] = useState('dasdfasd');
    const dateFormat =
      props.type === 'expiredProducts' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm';

    //get running period
    const runningPeriod = useGetRunningPeriod();
    const curStartDate = runningPeriod?.data?.start_date;
    //get current calender
    const userCalender = useGetCalender();
    const calenderCode = userCalender?.data?.user_calender?.code;

    const defaultDate = React.useMemo(
      () => [utcDate(), moment(utcDate().add(1, 'month'), dateFormat)],
      [dateFormat],
    );
    const defaultJalaliDate = React.useMemo(
      () => [
        dayjs(
          changeGToJ(utcDate().format(dateFormat), dateFormat),
          //@ts-ignore
          jalaliType,
        ),

        dayjs(
          changeGToJ(utcDate().add(1, 'month').format(dateFormat), dateFormat),
          //@ts-ignore
          jalaliType,
        ),
      ],
      [dateFormat],
    );

    const onChangeDateTime = (value: string) => {
      setDateType(value);
      if (calenderCode === 'gregory') {
        if (value === 'custom' || value === 'allDates') {
          props.form.setFieldsValue({
            dateTime:
              props.type === 'expiredProducts'
                ? defaultDate
                : [moment(curStartDate, dateFormat), utcDate()],
          });
        } else {
          const date = value?.split('_');
          props.form.setFieldsValue({
            dateTime: [
              moment(indianToArabic(date?.[0]), dateFormat),
              moment(indianToArabic(date?.[1]), dateFormat),
            ],
          });
        }
      } else {
        if (value === 'custom' || value === 'allDates') {
          props.form.setFieldsValue({
            dateTime:
              props.type === 'expiredProducts'
                ? defaultJalaliDate
                : [
                    //@ts-ignore
                    dayjs(changeGToJ(curStartDate, dateFormat), jalaliType),

                    dayjs(
                      changeGToJ(utcDate().format(dateFormat), dateFormat),
                      //@ts-ignore
                      jalaliType,
                    ),
                  ],
          });
        } else {
          const date = value?.split('_');
          props.form.setFieldsValue({
            dateTime: [
              //@ts-ignore
              dayjs(date?.[0], jalaliType),
              //@ts-ignore
              dayjs(date?.[1], jalaliType),
            ],
          });
        }
      }
    };

    return (
      <React.Fragment>
        <Col xxl={4} xl={5} lg={5}>
          <DateFormItem
            style={props.style}
            label=''
            onChange={onChangeDateTime}
          />{' '}
        </Col>

        <Col xxl={6} xl={8} lg={8}>
          <RangePickerFormItem
            showTime={props.type === 'expiredProducts' ? false : true}
            placeholder={[t('Expenses.Table.Start'), t('Expenses.Table.End')]}
            format={dateFormat}
            rules={[]}
            name='dateTime'
            label=''
            style={props.style}
            disabled={dateType === 'custom' ? false : true}
          />
        </Col>
      </React.Fragment>
    );
  },
);

export default ReportDateFormItem;
