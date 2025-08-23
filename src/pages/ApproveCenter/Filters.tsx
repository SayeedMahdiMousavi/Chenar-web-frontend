import React, { useMemo } from 'react';
import { Row, Col, Select, Form, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  changeGToJ,
  handlePrepareDateForServer,
  utcDate,
} from '../../Functions/utcDate';
import useGetCalender from '../../Hooks/useGetCalender';
import dayjs from 'dayjs';
import { RangePickerFormItem } from '../SelfComponents/JalaliAntdComponents/RangePickerFormItem';
import { ApplyButton, ResetButton } from '../../components';

const { Option } = Select;
interface IProps {
  setFilters: (value: {
    status: string;
    startDate: string;
    endDate: string;
  }) => void;
  setPage: (value: number) => void;
  setVisible: (value: boolean) => void;
}

const dateFormat = 'YYYY-MM-DD HH:mm';
const jalaliType: { jalali: boolean } = {
  //@ts-ignore
  jalali: true,
};

export default function ApproveCenterFilters(props: IProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  const onFinish = async (values: { status: string; dateTime: any }) => {
    const startDate = handlePrepareDateForServer({
      date: values?.dateTime?.[0],
      calendarCode,
    });

    const endDate = handlePrepareDateForServer({
      date: values?.dateTime?.[1],
      calendarCode,
    });

    props.setFilters({
      status: values?.status,
      startDate: values?.dateTime?.[0] === undefined ? '' : startDate,
      endDate:
        values?.dateTime?.[1] === undefined
          ? utcDate().format(dateFormat)
          : endDate,
    });
    props.setPage(1);
    props.setVisible(false);
  };
  const onReset = () => {
    form.resetFields();
    props.setVisible(false);
    props.setFilters({
      status: 'pending',
      startDate: '',
      endDate: utcDate()?.format(dateFormat),
    });
    props.setPage(1);
  };

  const defaultDate = useMemo(
    () =>
      calendarCode === 'gregory'
        ? [utcDate().startOf('day'), utcDate().endOf('day')]
        : [
            //@ts-ignore
            dayjs(
              changeGToJ(
                utcDate().startOf('day').format(dateFormat),
                dateFormat,
              ),
              //@ts-ignore
              jalaliType,
            ),

            dayjs(
              changeGToJ(utcDate().endOf('day').format(dateFormat), dateFormat),
              //@ts-ignore
              jalaliType,
            ),
          ],
    [calendarCode],
  );

  return (
    <Form
      layout='vertical'
      onFinish={onFinish}
      form={form}
      style={styles.form}
      initialValues={{
        status: 'pending',
        dateTime: defaultDate,
      }}
    >
      <Row>
        <Col span={24}>
          <Form.Item
            name='status'
            label={<span>{t('Sales.Product_and_services.Status')}</span>}
          >
            <Select autoFocus>
              <Option value='pending'>{t('Form.Pending')}</Option>
              <Option value='approved'>{t('Form.Approved')}</Option>
              <Option value='rejected'>{t('Form.Rejected')}</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={24}>
          <RangePickerFormItem
            showTime={true}
            placeholder={['', '']}
            format='YYYY-MM-DD HH:mm'
            rules={[]}
            name='dateTime'
            label={
              <Row className='num' style={{ height: '20px' }}>
                <Col span={13}>{t('Expenses.Table.Start')}</Col>
                <Col span={11}>{t('Expenses.Table.End')}</Col>
              </Row>
            }
            style={styles.formItem}
          />
        </Col>
        <Divider />
        <Col span={24}>
          <Form.Item style={styles.formItem}>
            <Row className='num' justify='space-between'>
              <Col>
                <ResetButton htmlType='reset' onClick={onReset} />
              </Col>
              <Col>
                <ApplyButton />
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
const styles = {
  formItem: { marginBottom: '0px' },
  form: { width: '290px' },
};
