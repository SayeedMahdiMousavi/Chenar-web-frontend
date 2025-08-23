import React from 'react';
import {
  // Checkbox,
  Row,
  Col,
  Select,
  // message,
  // Menu,
  Form,
  // Table,
  // Dropdown,
  Button,
  // Input,
  // Modal,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { ApplyButton, ResetButton } from '../../../../components';
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    md: { span: 24 },
    xl: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    md: { span: 24 },
    xl: { span: 24 },
  },
};
const { Option } = Select;
export default function Filters(props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    // await props.filter(values);
  };
  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form
      {...formItemLayout}
      layout='vertical'
      onFinish={onFinish}
      form={form}
      initialValues={{
        ['date']: 'all_dates',
        ['type']: 'all_transactions',
      }}
      className='transaction_filter'
    >
      <Row gutter={[0, 11]}>
        <Col offset={2} span={19} style={{ padding: '0rem' }}>
          <Form.Item
            name='type'
            label={
              <p style={{ marginBottom: '0rem' }}>
                {t('Sales.Product_and_services.Type')}
              </p>
            }
            style={{ marginBottom: '0rem' }}
          >
            <Select className='table__header1-select' allowClear autoFocus>
              <Option value='all_transactions'>
                {t('Sales.Product_and_services.All')}&nbsp;
                {t('Sales.Customers.Transactions').toLowerCase()}
              </Option>
              <Option value='expenses'>{t('Expenses.1')}</Option>
              <Option value='bill payments'>
                {t('Expenses.Table.Bill_payments')}
              </Option>
              <Option value='open invoices'>{t('Expenses.Cheque')}</Option>
              <Option value='recently paid'>
                {t('Expenses.Table.Recently_paid')}
              </Option>
            </Select>
          </Form.Item>
        </Col>
        <Col offset={2} span={19}>
          <Form.Item
            name='date'
            label={t('Sales.Customers.Form.Date')}
            style={{ marginBottom: '0rem' }}
          >
            <Select className='table__header1-select' allowClear>
              <Option value='all_dates'>
                {' '}
                {t('Sales.Customers.Table.All_dates')}
              </Option>
              <Option value='tody'> {t('Sales.Customers.Table.Tody')}</Option>
              <Option value='yesterday'>
                {' '}
                {t('Sales.Customers.Table.Yesterday')}
              </Option>
              <Option value='this_week'>
                {' '}
                {t('Sales.Customers.Table.This_week')}
              </Option>
              <Option value='this_month'>
                {' '}
                {t('Sales.Customers.Table.This_month')}
              </Option>
              <Option value='this_quarter'>
                {' '}
                {t('Sales.Customers.Table.This_quarter')}
              </Option>
              <Option value='this_year'>
                {' '}
                {t('Sales.Customers.Table.This_year')}
              </Option>
              <Option value='last_week'>
                {' '}
                {t('Sales.Customers.Table.Last_week')}
              </Option>
              <Option value='last_month'>
                {' '}
                {t('Sales.Customers.Table.Last_month')}
              </Option>
              <Option value='last_quarter'>
                {' '}
                {t('Sales.Customers.Table.Last_quarter')}
              </Option>
              <Option value='last_year'>
                {' '}
                {t('Sales.Customers.Table.Last_year')}
              </Option>
            </Select>
            {/* </Col>
              </Row> */}
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item style={{ marginBottom: '0rem' }}>
            <Row style={{ width: '100%' }}>
              <Col
                xl={{ span: 4, offset: 2 }}
                md={{ span: 6, offset: 2 }}
                xs={{ span: 4, offset: 2 }}
              >
                <ResetButton onClick={onReset} />
              </Col>
              <Col
                xl={{ span: 4, offset: 10 }}
                md={{ span: 6, offset: 7 }}
                xs={{ span: 4, offset: 8 }}
              >
                <ApplyButton />
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
