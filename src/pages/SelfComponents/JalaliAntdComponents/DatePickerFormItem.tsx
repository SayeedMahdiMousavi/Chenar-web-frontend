import React, { ReactNode } from 'react';
import { DatePicker, Form } from 'antd';
import { DatePicker as DatePickerJalali } from 'antd-jalali';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import fa from 'antd/es/date-picker/locale/fa_IR';
import en from 'antd/es/date-picker/locale/en_US';
import ps from 'antd/es/date-picker/locale/pt_PT';
import useGetCalender from '../../../Hooks/useGetCalender';
import useGetRunningPeriod from '../../../Hooks/useGetRunningPeriod';
interface IProps {
  name: string | [number, string];
  label: string | ReactNode;
  showTime: boolean;
  format: string;
  placeholder?: string;
  disabledDate?: any;
  rules?: any;
  style?: React.CSSProperties;
  disabled?: boolean;
  onChange?: (value: any) => void;
  allowClear?: boolean;
  validateTrigger?: string[];
  fieldKey?: [number, string];
}

export const DatePickerFormItem: React.FC<IProps> = (props) => {
  const { i18n } = useTranslation();

  //get current calender
  const userCalender = useGetCalender();

  const handelStopePropagation = (e: any) => {
    e.stopPropagation();
  };

  //get running period
  const runningPeriod = useGetRunningPeriod();
  const curStartDate = runningPeriod?.data?.start_date;

  function disabledDate(current: any) {
    return (
      current && current < moment(curStartDate, props.format).startOf('day')
    );
  }
  const locales = {
    locale: 'en_US',
    placeholder: 'Select date',
    rangePlaceholder: ['Start date', 'End date'],
    today: 'Todaydd',
    now: 'Nowddf',
    backToToday: 'Back to today',
    ok: 'OK',
    clear: 'Clear',
    month: 'Month',
    year: 'Year',
    timeSelect: 'Select time',
    dateSelect: 'Select date',
    monthSelect: 'Choose a month',
    yearSelect: 'Choose a year',
    decadeSelect: 'Choose a decade',
    yearFormat: 'YYYY',
    dateFormat: 'M/D/YYYY',
    dayFormat: 'D',
    dateTimeFormat: 'M/D/YYYY HH:mm:ss',
    monthFormat: 'MMMM',
    monthBeforeYear: true,
    previousMonth: 'Previous month (PageUp)',
    nextMonth: 'Next month (PageDown)',
    previousYear: 'Last year (Control + left)',
    nextYear: 'Next year (Control + right)',
    previousDecade: 'Last decade',
    nextDecade: 'Next decade',
    previousCentury: 'Last century',
    nextCentury: 'Next century',
  };
  return (
    <Form.Item
      name={props.name}
      label={props.label}
      rules={props?.rules}
      style={props.style}
      //@ts-ignore
      onClick={handelStopePropagation}
      onDoubleClick={handelStopePropagation}
      validateTrigger={props?.validateTrigger}
      fieldKey={props?.fieldKey}
    >
      {userCalender?.data?.user_calender?.code === 'gregory' ? (
        <DatePicker
          showTime={props.showTime}
          className='num'
          placeholder={props.placeholder}
          format={props.format}
          disabledDate={
            props?.name === 'birthDate' && props.disabledDate
              ? props.disabledDate
              : disabledDate
          }
          disabled={props.disabled}
          onChange={props.onChange}
          allowClear={props?.allowClear}
        />
      ) : (
        <DatePickerJalali
          locale={i18n.language === 'en' ? en : fa}
          direction='rtl'
          disabledDate={
            props.disabledDate !== undefined ? props.disabledDate : disabledDate
          }
          disabled={props.disabled}
          onChange={props.onChange}
          //@ts-ignore
          // defaultValue={dayjs("1399-10-03", { jalali: false })}
          // defaultValue={moment('1367/04/11', 'YYYY/MM/DD')}
          showTime={props.showTime}
          className='num'
          placeholder={props.placeholder}
          format={props.format}
          allowClear={props?.allowClear}
        />
      )}
    </Form.Item>
  );
};
