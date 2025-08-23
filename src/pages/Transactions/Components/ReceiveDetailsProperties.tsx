import React from 'react';
import { Col, Row, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { DatePickerFormItem } from '../../SelfComponents/JalaliAntdComponents/DatePickerFormItem';

interface IProps {
  type: string;
  disableDate?: boolean;
}
export const ReceiveDetailsProperties: React.FC<IProps> = (props) => {
  const { t } = useTranslation();

  return (
    <Row gutter={10}>
      <Col span={props.type === 'openAccount' ? 12 : 7}>
        <DatePickerFormItem
          placeholder={t('Sales.Customers.Form.Date')}
          name='date'
          label=''
          showTime={true}
          format='YYYY-MM-DD HH:mm'
          rules={[{ type: 'object' }]}
          style={styles.formItem}
          disabled={props?.disableDate}
        />
      </Col>
      <Col span={props.type === 'openAccount' ? 12 : 10}>
        <Form.Item name='description' className='margin1'>
          <Input.TextArea placeholder={t('Form.Description')} className='num' />
        </Form.Item>
      </Col>
    </Row>
  );
};
const styles = {
  formItem: { margin: '0px' },
};
