import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  Checkbox,
  message,
  InputNumber,
  Divider,
  Typography,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useMediaQuery } from '../../MediaQurey';
import { connect } from 'react-redux';
import { useDatabase } from '@nozbe/watermelondb/hooks';

import withObservables from '@nozbe/with-observables';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import AddAccount from './AddAccount';
import i18n from '../../../i18n';
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;
const RecordPayment = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const isTablet = useMediaQuery('(max-width:768px)');
  const isMobile = useMediaQuery('(max-width:425px)');
  const database = useDatabase();
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  useEffect(() => {
    setItems(props.groups);
  }, [props.groups]);
  const onNameChange = (event) => {
    const name = event.target.value;
    setName(name);
  };

  const addItem = async () => {
    //
    // const { items, name } = this.state;
    if (!name) {
      message.error('Please enter a name');
      return;
    } else {
      let groups = database.collections.get('groups');
      await database.action(async () => {
        await groups.create((group) => {
          group.name = name;
        });
      });
      setItems([...items, name]);
      setName('');
    }
  };
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onFinish = () => {
    form
      .validateFields()
      .then(async (values) => {
        let units = database.collections.get('units');
        database.action(async () => {
          await units.create((unit) => {
            unit.name = values.name;
            unit.symbol = values.symbol;
          });
        });
        setVisible(false);
        form.resetFields();
        message.info(`${t('Message.Add')} ${values.name}`);
      })
      .catch((info) => {
        message.error(`${info}`);
      });
    //
  };
  //payment date
  const config = {
    rules: [{ type: 'object' }],
  };
  //payment amount
  const onChangePaymentAmount = (value) => {
    setPaymentAmount(value);
  };
  return (
    <div>
      <Button
        shape='round'
        onClick={showDrawer}
        className='payment_table_header'
      >
        {t('Taxes.Record_payment')}
      </Button>
      <Drawer
        maskClosable={false}
        title={t('Taxes.Record_Tax_rate_Agency_payment')}
        width={isMobile ? '100%' : 415}
        height='100vh'
        onClose={onClose}
        open={visible}
        placement={i18n.language === 'en' ? 'right' : 'left'}
        footer={
          <div style={styles.footer}>
            <Button onClick={onClose} shape='round' style={styles.cancel}>
              {t('Form.Cancel')}
            </Button>
            <Button
              onClick={onFinish}
              htmlType='submit'
              shape='round'
              type='primary'
            >
              {t('Form.Save')}
            </Button>
          </div>
        }
      >
        <Form layout='vertical' hideRequiredMark form={form}>
          <Row>
            <Col span={24}>
              <Form.Item>
                <Form.Item name='account' noStyle>
                  <Select
                    style={{ width: isMobile ? '100%' : '60%' }}
                    showSearch
                    popupClassName='z_index'
                    // placeholder='Enter text'
                    dropdownRender={(menu) => (
                      <div>
                        <div>
                          {menu}
                          <Divider style={styles.divider} />
                          <div style={styles.addItem} className='add_item'>
                            <AddAccount />
                          </div>
                        </div>
                        {/* )} */}
                      </div>
                    )}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {items?.map((item) => (
                      <Option value={item.name} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <span className='ant-form-text'>
                  {' '}
                  &nbsp;&nbsp;{t('Sales.Customers.Form.Balance')}{' '}
                  {t('Taxes.Aed')}
                  -123.00
                </span>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Row>
                {/* <Col span={24} style={{ textAlign: "end" }}>
                  {" "}
                </Col> */}
                <Col span={24}>
                  <span> {t('Taxes.Form.Payment_amount').toUpperCase()}</span>

                  <Title level={3}>
                    {t('Taxes.Aed')}
                    {paymentAmount} .00{' '}
                  </Title>
                </Col>
              </Row>{' '}
            </Col>
            <Col span={24}>
              <Text strong={true}>{t('Taxes.Tax rate Agency period')} </Text>
              <br /> <Text>{t('Taxes.Upcoming_filing')} </Text> <br />
              <br />
              <Text strong={true}>{t('Taxes.Total_Tax_rate_Agency_due')} </Text>
              <br />
              <Text>{t('Taxes.Aed')}-123.00</Text>
              <br />
              <br />
            </Col>
            <Col span={24}>
              <Form.Item
                name='paymentDate'
                label={t('Taxes.Form.Payment_date')}
                {...config}
                style={styles.margin}
              >
                <DatePicker placeholder='' className='num' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t('Taxes.Form.Payment_amount')}
                name='paymentAmount'
                style={styles.margin}
              >
                <InputNumber
                  onChange={onChangePaymentAmount}
                  type='number'
                  className='num'
                  inputMode='numeric'
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name={t('Sales.Customers.Form.Memo')}
                label={<p>{t('Sales.Customers.Form.Memo')}</p>}
                style={styles.margin}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};
const styles = {
  margin: { marginBottom: '12px' },
  cancel: { margin: ' 0 8px' },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: { margin: '0 0 4px 0' },
  addItem: {
    display: 'flex',
    flexWrap: 'nowrap',
    padding: '3px 8px',
    width: '100%',
  },
  add: {
    flex: 'none',
    padding: '4px',
    display: 'block',
    cursor: 'pointer',
    width: '100%',
  },
};
const mapStateToProps = (state) => ({
  products: state.products.products,
  rtl: state.direction.rtl,
});

const enhancProduct = withObservables(['groups'], ({ database }) => ({
  groups: database.collections.get('groups').query().observe(),
}));

export default connect(mapStateToProps)(
  withDatabase(enhancProduct(RecordPayment))
);
