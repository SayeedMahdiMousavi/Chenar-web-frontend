import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Dropdown,
  Menu,
  // Upload,
  // Divider,
  message,
  Checkbox,
  Descriptions,
  Typography,
  InputNumber,
  DatePicker,
} from 'antd';

import { useMediaQuery } from '../../MediaQurey';

import { connect } from 'react-redux';

// import { useDatabase } from "@nozbe/watermelondb/hooks";
// import withObservables from "@nozbe/with-observables";
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";

import {
  // PlusCircleOutlined,
  CaretDownOutlined,
  // UploadOutlined,
  // PlusOutlined,
} from '@ant-design/icons';
import { ResetButton } from '../../../components';
const { Option } = Select;
const { Paragraph } = Typography;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    md: { span: 24 },
    xl: { span: 24 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xl: {
      span: 24,
      offset: 0,
    },
  },
};
const AddAccount = (props) => {
  const { t } = useTranslation();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });

  const [form] = Form.useForm();
  // const database = useDatabase();
  const [items, setItems] = useState([]);
  // const [name, setName] = useState("");
  useEffect(() => {
    setItems(props.groups);
  }, [props.groups]);
  const isMiniComputer = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isBigMobile = useMediaQuery('(max-width: 480px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');
  // const isTabletBase = useMediaQuery("(max-width:768px)");
  const [disabled, setDisabled] = useState(true);
  // const onNameChange = (event) => {
  //   const name = event.target.value;
  //   setName(name);
  // };

  // const addItem = async () => {
  //   //
  //   // const { items, name } = this.state;
  //   if (!name) {
  //   } else {
  //     let groups = database.collections.get("groups");
  //     await database.action(async () => {
  //       await groups.create((group) => {
  //         group.name = name;
  //       });
  //     });
  //     setItems([...items, name]);
  //     message.info(`${t("Massage.Add")} ${name}`);
  //     setName("");
  //   }
  // };
  // const normFile = (e) => {
  //
  //   if (Array.isArray(e)) {
  //     return e;
  //   }
  //   return e && e.fileList;
  // };
  const handleOk = async (values) => {
    //
    // setProducts(values);
    form
      .validateFields()
      .then(async (values) => {
        // let products = database.collections.get("products");
        // await database.action(async () => {
        //   await products.create((product) => {
        //     product.name = values.name;
        //     product.barcode = values.barcode;
        //     product.icon = values.upload;
        //     product.group = values.group;
        //     product.sub_group = values.sub_group;
        //     product.description = values.description;
        //     product.status = "active";
        //   });
        // });
        setIsShowModal({
          visible: false,
        });
        form.resetFields();
        props.visible();
        message.info(`${t('Message.Add')} ${values.name}`);
      })
      .catch((info) => {
        message.error(`${info}`);
      });

    //
    // let newProduct = {
    //   name: values.name,
    //   username: values.barcode,
    //   email: values.description,
    // };
    // //
    // await props.addProducts(newProduct);

    // setProduct({ name: "", barcode: "", description: "" });
  };
  const onReset = () => {
    form.resetFields();
  };
  const menu = (
    <Menu>
      <Menu.Item key='0'>Save and New</Menu.Item>
    </Menu>
  );

  const showModal = () => {
    setIsShowModal({
      visible: true,
    });
  };
  const handleCancel = (e) => {
    //
    setIsShowModal({
      visible: false,
    });
  };
  //is sub-account
  const onChangeSubAccount = () => {
    setDisabled(!disabled);
  };
  //as of
  const config = {
    rules: [{ type: 'object' }],
  };
  return (
    <div>
      <Button
        onClick={showModal}
        className='Drawer-button'
        type='primary'
        shape='round'
      >
        {t('Sales.Product_and_services.New')}
      </Button>

      <Modal
        maskClosable={false}
        title={t('Accounting.Account')}
        open={isShowModal.visible}
        onOk={handleOk}
        okText='submit'
        centered
        width={
          isMobile
            ? '100vw'
            : isMiniTablet
              ? '100vw'
              : isTablet
                ? '85vw'
                : isMiniComputer
                  ? '65vw'
                  : '50vw'
        }
        onCancel={handleCancel}
        bodyStyle={styles.bodyStyle(isMobile, isSubBase, isBigMobile)}
        footer={
          <Row style={styles.row}>
            <Col>
              <ResetButton onClick={onReset} style={styles.reset} />
            </Col>
            <Col sm={5} xs={isMobile ? 9 : 6}>
              <Row>
                <Col span={19}>
                  {' '}
                  <Button
                    type='primary'
                    shape='round'
                    onClick={handleOk}
                    style={styles.save}
                  >
                    {t('Form.Save')}
                  </Button>
                </Col>
                <Col span={5}>
                  {' '}
                  <Dropdown overlay={menu} trigger={['click']}>
                    <Button
                      type='primary'
                      shape='round'
                      icon={<CaretDownOutlined />}
                      size='small'
                      style={styles.drop}
                    />
                  </Dropdown>
                </Col>
              </Row>
            </Col>
          </Row>
        }
      >
        <Form
          {...formItemLayout}
          form={form}
          hideRequiredMark={true}
          scrollToFirstError={true}
          layout='vertical'
        >
          <Row>
            <Col span={isBigMobile ? 24 : 12}>
              <Row>
                <Col span={isBigMobile ? 24 : 23}>
                  {' '}
                  <Form.Item
                    label={
                      <p style={styles.name}>
                        {t('Form.Name')}
                        <span className='star'>*</span>
                      </p>
                    }
                    name='name'
                    style={styles.name}
                    rules={[
                      { required: true, message: `${t('Form.Name_required')}` },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={isBigMobile ? 24 : 23}>
                  {' '}
                  <Form.Item
                    style={styles.margin}
                    {...tailFormItemLayout}
                    name='description'
                    label={t('Form.Description')}
                  >
                    <Input.TextArea showCount />
                  </Form.Item>
                </Col>
                <Col span={isBigMobile ? 24 : 23}>
                  <Form.Item
                    name='sub_account'
                    valuePropName='checked'
                    onChange={onChangeSubAccount}
                    style={styles.name}
                  >
                    <Checkbox>
                      {t('Accounting.Chart_of_accounts.is_sub-account')}{' '}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col span={isBigMobile ? 24 : 23}>
                  <Form.Item
                    name='parent_account'
                    className='customer_parent'
                    style={styles.name}
                    rules={[
                      !disabled && {
                        message: `${t(
                          'Accounting.Chart_of_accounts.Form.Parent_Message',
                        )}`,
                        required: !disabled ? true : false,
                      },
                    ]}
                  >
                    <Select
                      disabled={disabled}
                      showSearch
                      placeholder={t(
                        'Accounting.Chart_of_accounts.Form.Parent_placeholder',
                      )}
                      // listHeight={130}
                      dropdownRender={(menu) => <div>{menu}</div>}
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
                </Col>
                <Col
                  // xl={{ span: 12 }}
                  // lg={{ span: 12 }}
                  span={isBigMobile ? 24 : 23}
                >
                  <Form.Item
                    label={t(
                      'Accounting.Chart_of_accounts.Form.Default_Tax_Code',
                    )}
                    name='defaultTaxCode'
                    // className='customer_parent'
                    style={styles.name}
                  >
                    <Select
                      showSearch
                      // listHeight={130}
                      dropdownRender={(menu) => <div>{menu}</div>}
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
                </Col>
                <Col span={isBigMobile ? 24 : 23}>
                  {' '}
                  <Form.Item
                    label={t('Sales.Customers.Form.Balance')}
                    name='balance'
                    style={styles.name}
                  >
                    <InputNumber
                      type='number'
                      className='num'
                      inputMode='numeric'
                      min={0}
                    />
                  </Form.Item>
                </Col>
                <Col span={isBigMobile ? 24 : 23}>
                  {' '}
                  <Form.Item
                    label={t('Accounting.Chart_of_accounts.Form.As_of')}
                    name='asOf'
                    style={styles.name}
                    {...config}
                  >
                    <DatePicker className='num' placeholder='' />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={isBigMobile ? 24 : 12}>
              <Row>
                <Col
                  xs={
                    isBigMobile
                      ? { span: 24, offset: 0 }
                      : { span: 23, offset: 1 }
                  }
                >
                  <Form.Item
                    name='accountType'
                    label={t('Accounting.Chart_of_accounts.Form.Account_type')}
                    style={styles.name}
                  >
                    <Select>
                      <Option value='Cash and cash equivalents'>
                        {t(
                          'Accounting.Chart_of_accounts.Form.Cash_cash_equivalents',
                        )}
                      </Option>

                      <Option value='Credit card'>
                        {t('Accounting.Chart_of_accounts.Form.Credit_card ')}
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col
                  xs={
                    isBigMobile
                      ? { span: 24, offset: 0 }
                      : { span: 23, offset: 1 }
                  }
                >
                  <Form.Item
                    name='detailType'
                    label={
                      <p style={styles.name}>
                        {t('Accounting.Chart_of_accounts.Form.Detail_type')}
                        <span className='star'>*</span>
                      </p>
                    }
                    style={styles.margin}
                    rules={[
                      {
                        message: `${t(
                          'Accounting.Chart_of_accounts.Form.Required_details_type',
                        )}`,
                        required: true,
                      },
                    ]}
                  >
                    <Select>
                      <Option value='Cash and cash equivalents'>
                        {t(
                          'Accounting.Chart_of_accounts.Form.Cash_cash_equivalents',
                        )}
                      </Option>

                      <Option value='Bank'>
                        {' '}
                        {t('Accounting.Chart_of_accounts.Form.Bank')}
                      </Option>
                      <Option value='Cash on hand'>
                        {' '}
                        {t('Accounting.Chart_of_accounts.Form.Cash_on_hand')}
                      </Option>
                      <Option value='Client trust account'>
                        {t(
                          'Accounting.Chart_of_accounts.Form.Client_trust_account',
                        )}
                      </Option>
                      <Option value='Mony Market'>
                        {' '}
                        {t('Accounting.Chart_of_accounts.Form.Mony_market')}
                      </Option>
                      <Option value='Rents Held in Trust'>
                        {t(
                          'Accounting.Chart_of_accounts.Form.Rents_Held_in_Trust',
                        )}
                      </Option>
                      <Option value='Savings'>
                        {' '}
                        {t('Accounting.Chart_of_accounts.Form.Savings')}
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col
                  xs={
                    isBigMobile
                      ? { span: 24, offset: 0 }
                      : { span: 23, offset: 1 }
                  }
                >
                  {' '}
                  <Descriptions bordered layout='vertical'>
                    <Descriptions.Item
                      className='num'
                      label={t(
                        'Accounting.Chart_of_accounts.Form.Bank_account',
                      )}
                    >
                      <Paragraph>
                        {' '}
                        {t(
                          'Accounting.Chart_of_accounts.Form.Bank_account_description',
                        )}
                      </Paragraph>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
const styles = {
  bodyStyle: (isMobile, isSubBase, isBigMobile) => ({
    height: isBigMobile ? '75vh' : '',
    overflowY: isBigMobile ? 'scroll' : '',
    padding: isSubBase ? '20px' : '24px',
    paddingTop: '10px',
  }),
  name: { marginBottom: '0rem' },
  save: { width: '137%' },
  reset: { width: '100%' },
  drop: { height: '100%' },
  row: {
    width: '100%',
    paddingInlineEnd: '16px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  marginBottom: { marginBottom: '.3rem' },

  margin: { marginBottom: '12px' },
};

// const enhancProduct = withObservables(["groups"], ({ database }) => ({
//   groups: database.collections.get("groups").query().observe(),
// }));

// export default connect(null)(withDatabase(enhancProduct(AddAccount)));
export default connect(null)(AddAccount);
