import React, { ReactNode } from 'react';
import { DatePicker, Form } from 'antd';
import { DatePicker as DatePickerJalali } from 'antd-jalali';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import fa from 'antd/es/date-picker/locale/fa_IR';
import en from 'antd/es/date-picker/locale/en_US';
import useGetRunningPeriod from '../../../Hooks/useGetRunningPeriod';
import useGetCalender from '../../../Hooks/useGetCalender';

interface IProps {
  name: string;
  label: ReactNode | string;
  showTime: boolean;
  format: string;
  placeholder?: [string, string];
  disabledDate?: any;
  rules?: any;
  style: React.CSSProperties;
  disabled?: boolean;
  onChange?: (value: any) => void;
}
const { RangePicker } = DatePicker;
export const RangePickerFormItem: React.FC<IProps> = (props) => {
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

  return (
    <Form.Item
      name={props.name}
      label={props.label}
      rules={props.rules}
      style={props.style}
      //@ts-ignore
      onClick={handelStopePropagation}
      onDoubleClick={handelStopePropagation}
    >
      {userCalender?.data?.user_calender?.code === 'gregory' ? (
        <RangePicker
          showTime={props.showTime}
          className='num'
          placeholder={props.placeholder}
          format={props.format}
          disabledDate={props.disabledDate ? props.disabledDate : disabledDate}
          disabled={props.disabled}
          allowClear={false}
          onChange={props.onChange}
          popupClassName='expenses_rangePicker'
        />
      ) : (
        <DatePickerJalali.RangePicker
          locale={i18n.language === 'en' ? en : fa}
          dir='rtl'
          disabledDate={props.disabledDate ? props.disabledDate : disabledDate}
          disabled={props.disabled}
          onChange={props.onChange}
          //@ts-ignore
          // defaultValue={dayjs("1399-10-03", { jalali: false })}
          // defaultValue={moment('1367/04/11', 'YYYY/MM/DD')}
          showTime={props.showTime}
          className='num'
          allowClear={false}
          placeholder={props.placeholder}
          format={props.format}
          popupClassName='expenses_rangePicker'
        />
      )}
    </Form.Item>
  );
};
