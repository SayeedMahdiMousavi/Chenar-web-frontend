import React, { useState, useRef } from 'react';
import { Modal, Col, Row, Button } from 'antd';
import { useMediaQuery } from '../../MediaQurey';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import { Form, Input, Tooltip, Tabs, message, InputNumber } from 'antd';
import Uplod from '../Upload';
import UploadFile from '../UploadFile';
import { QuestionCircleOutlined } from '@ant-design/icons';
// import { useDatabase } from "@nozbe/watermelondb/hooks";
// import withObservables from "@nozbe/with-observables";
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
import { useTranslation } from 'react-i18next';
import { Styles } from '../../styles';
import { ModalDragTitle } from '../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { CategoryField } from '../../SelfComponents/CategoryField';
import { ActionMessage } from '../../SelfComponents/TranslateComponents/ActionMessage';
import { trimString } from '../../../Functions/TrimString';
import { CancelButton, EditMenuItem, SaveButton } from '../../../components';
import { CUSTOMER_M } from '../../../constants/permissions';
const { TabPane } = Tabs;

const EditCustomer = ({
  record,
  baseUrl,
  type,
  attachment: attachmentName,
  handleClickEdit,
  setVisible,
  ...rest
}) => {
  const queryClient = useQueryClient();
  const isTablitBase = useMediaQuery('(max-width:768px)');
  const { t } = useTranslation();
  const ref = useRef(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [file, setFile] = useState({});
  const [attachment, setAttachment] = useState();
  const [attachments, setAttachments] = useState([]);
  // const database = useDatabase();
  const [error, setError] = useState(false);
  const [attachmentError, setAttachmentError] = useState(false);
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const isBgTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');
  const [activeKey, setActiveKey] = useState('1');
  const [seeTabs, setSeeTabs] = useState(['']);

  const showModal = () => {
    setIsShowModal({
      visible: true,
    });

    setFileList(
      record?.photo && [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: record?.photo,
          thumbUrl: record?.photo,
        },
      ],
    );

    setAttachments(
      record?.attachment && [
        {
          uid: '-1',
          name: attachmentName,
          status: 'done',
          url: record?.attachment,
          thumbUrl: record?.attachment,
        },
      ],
    );

    form.setFieldsValue({
      name: record?.first_name,
      lastName: record?.last_name,
      nickName: record?.nike_name,
      category: {
        value: record?.category?.id,
        label: record?.category?.name,
      },
      company: record?.company_name,
      creditLimit: record?.credit_limit,
      discountSerial: record?.discount_serial,
      email: record?.email,
      phone: record?.phone_number,
      mobile: record?.mobile_number,
      fax: record?.fax_number,
      nationalIdNumber: record?.national_id_number,
      notes: record?.notes,
      website: record?.website,
      bill_address: {
        street: record?.street,
        province: record?.province,
        plate_number: record?.plate_number,
        country: record?.country,
        city: record?.city,
      },
      ship_address: {
        street: record?.s_street,
        province: record?.s_province,
        plate_number: record?.s_plate_number,
        country: record?.s_country,
        city: record?.s_city,
      },
      upload: record?.photo && [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: record?.photo,
          thumbUrl: record?.photo,
        },
      ],

      attachment: record?.attachment && [
        {
          uid: '-1',
          name: attachmentName,
          status: 'done',
          url: record?.attachment,
          thumbUrl: record?.attachment,
        },
      ],
    });

    if (type === 'table') {
      setVisible(false);
      handleClickEdit();
    }
  };

  const onTabClick = (key) => {
    setActiveKey(key);
    setSeeTabs((prev) => [...prev, key]);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const normFile1 = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const editCustomer = async (value) => {
    await axiosInstance
      .put(`${baseUrl}${record?.id}/`, value, {
        timeout: 0,
      })
      .then((res) => {
        setIsShowModal({
          visible: false,
        });
        message.success(
          <ActionMessage
            name={`${res.data?.first_name} ${res.data?.last_name}`}
            message='Message.Update'
          />,
        );
      })
      .catch((error) => {
        setLoading(false);
        if (error?.response?.data?.photo?.[0]) {
          message.error(`${error?.response.data?.photo?.[0]}`);
        } else if (error?.response?.data?.first_name?.[0]) {
          message.error(`${error?.response?.data?.first_name?.[0]}`);
        } else if (error?.response?.data?.last_name?.[0]) {
          message.error(`${error?.response.data?.last_name?.[0]}`);
        } else if (error?.response?.data?.category?.[0]) {
          message.error(`${error?.response.data?.category?.[0]}`);
        } else if (error?.response?.data?.company_name?.[0]) {
          message.error(`${error?.response.data?.company_name?.[0]}`);
        } else if (error?.response?.data?.national_id_number?.[0]) {
          message.error(`${error?.response.data?.national_id_number?.[0]}`);
        } else if (error?.response?.data?.credit_limit?.[0]) {
          message.error(`${error?.response.data?.credit_limit?.[0]}`);
        } else if (error?.response?.data?.discount_serial?.[0]) {
          message.error(`${error?.response.data?.discount_serial?.[0]}`);
        } else if (error?.response?.data?.email?.[0]) {
          message.error(`${error?.response.data?.email?.[0]}`);
        } else if (error?.response?.data?.phone_number?.[0]) {
          message.error(`${error?.response.data?.phone_number?.[0]}`);
        } else if (error?.response?.data?.mobile_number?.[0]) {
          message.error(`${error?.response.data?.mobile_number?.[0]}`);
        } else if (error?.response?.data?.fax_number?.[0]) {
          message.error(`${error?.response.data?.fax_number?.[0]}`);
        } else if (error?.response?.data?.website?.[0]) {
          message.error(`${error?.response.data?.website?.[0]}`);
        } else if (error?.response?.data?.attachment?.[0]) {
          message.error(`${error?.response.data?.attachment?.[0]}`);
        } else if (error?.response?.data?.notes?.[0]) {
          message.error(`${error?.response.data?.notes?.[0]}`);
        } else if (error?.response?.data?.street?.[0]) {
          message.error(`${error?.response.data?.street?.[0]}`);
        } else if (error?.response?.data?.country?.[0]) {
          message.error(`${error?.response.data?.country?.[0]}`);
        } else if (error?.response?.data?.b_city?.[0]) {
          message.error(`${error?.response.data?.b_city?.[0]}`);
        } else if (error?.response?.data?.province?.[0]) {
          message.error(`${error?.response.data?.province?.[0]}`);
        } else if (error?.response?.data?.plate_number?.[0]) {
          message.error(`${error?.response.data?.plate_number?.[0]}`);
        } else if (error?.response?.data?.s_street?.[0]) {
          message.error(`${error?.response.data?.s_street?.[0]}`);
        } else if (error?.response?.data?.s_country?.[0]) {
          message.error(`${error?.response.data?.s_country?.[0]}`);
        } else if (error?.response?.data?.s_city?.[0]) {
          message.error(`${error?.response.data?.s_city?.[0]}`);
        } else if (error?.response?.data?.s_province?.[0]) {
          message.error(`${error?.response.data?.s_province?.[0]}`);
        } else if (error?.response?.data?.s_plate_number?.[0]) {
          message.error(`${error?.response.data?.s_plate_number?.[0]}`);
        } else if (error?.response?.data?.non_field_errors?.[0]) {
          if (
            error?.response?.data?.non_field_errors?.[0] ===
            'this person  is already exist'
          ) {
            message.error(
              `${error?.response?.data?.non_field_errors?.[0]}. ${t(
                'Sales.Customers.Form.First_and_last_name_error',
              )}`,
            );
          } else {
            message.error(`${error?.response.data?.non_field_errors?.[0]}`);
          }
        }
      });
  };

  const { mutate: mutateEditCustomer } = useMutation(editCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries(`${baseUrl}`);
      queryClient.invalidateQueries(`/customer_account/customer`);
      queryClient.invalidateQueries(`/customer_account/customer1/`);
      if (record?.id === 103001) {
        queryClient.invalidateQueries(`/customer_account/customer/default`);
      }
    },
  });

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        if (error || attachmentError) {
          message.error(
            `${t('Sales.Product_and_services.Form.Units_error_message')}`,
          );
          return;
        } else {
          setLoading(true);

          const formData = new FormData();
          if (file?.name) {
            formData.append('photo', file, file?.name);
          }
          if (attachment?.name) {
            formData.append('attachment', attachment);
          }
          if (fileList?.length === 0) {
            formData.append('is_delete_photo', true);
          }
          if (attachments?.length === 0) {
            formData.append('is_delete_attach', true);
          }
          formData.append('first_name', trimString(values?.name));
          formData.append('last_name', trimString(values?.lastName));
          formData.append(
            'nike_name',
            values?.nickName ? trimString(values?.nickName) : '',
          );
          if (values?.category?.value) {
            formData.append('category', values?.category?.value);
          }
          formData.append(
            'company_name',
            values?.company ? trimString(values?.company) : '',
          );
          formData.append('email', values?.email ? values?.email : '');
          formData.append(
            'phone_number',
            values?.phone ? trimString(values?.phone) : '',
          );
          formData.append(
            'mobile_number',
            values?.mobile ? values?.mobile : '',
          );
          formData.append('fax_number', values?.fax ? values?.fax : '');
          formData.append(
            'website',
            values?.website ? trimString(values?.website) : '',
          );
          formData.append(
            'credit_limit',
            values?.creditLimit ? values?.creditLimit : '',
          );
          formData.append(
            'national_id_number',
            values?.nationalIdNumber ? values?.nationalIdNumber : '',
          );
          if (seeTabs.includes('2')) {
            formData.append('notes', values?.notes ? values?.notes : '');
          }

          formData.append(
            'street',
            values?.bill_address?.street ? values?.bill_address?.street : '',
          );
          formData.append(
            'country',
            values?.bill_address?.country ? values?.bill_address?.country : '',
          );
          formData.append(
            'city',
            values?.bill_address?.city ? values?.bill_address?.city : '',
          );
          formData.append(
            'province',
            values?.bill_address?.province
              ? values?.bill_address?.province
              : '',
          );
          formData.append(
            'plate_number',
            values?.bill_address?.plate_number
              ? values?.bill_address?.plate_number
              : '',
          );
          formData.append(
            's_street',
            values?.ship_address?.street ? values?.ship_address?.street : '',
          );
          formData.append(
            's_country',
            values?.ship_address?.country ? values?.ship_address?.country : '',
          );
          formData.append(
            's_city',
            values?.ship_address?.city ? values?.ship_address?.city : '',
          );
          formData.append(
            's_province',
            values?.ship_address?.province
              ? values?.ship_address?.province
              : '',
          );
          formData.append(
            's_plate_number',
            values?.ship_address?.plate_number
              ? values?.ship_address?.plate_number
              : '',
          );
          formData.append(
            'discount_serial',
            values?.discountSerial ? values?.discountSerial : '',
          );
          mutateEditCustomer(formData, {
            onSuccess: () => {},
          });
        }
      })
      .catch((info) => {});
  };

  const handleCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };
  const handelAfterClose = () => {
    form.resetFields();
    setFileList([]);
    setFile();
    setActiveKey('1');
    setAttachments([]);
    setAttachment();
    setError(false);
    setSeeTabs(['']);
    setLoading(false);
    setAttachmentError(false);
  };

  //sipping address
  const onChangeStreet = async () => {
    const row = await form.getFieldsValue();

    form.setFieldsValue({ ship_address: { street: row.bill_address.street } });
  };
  const onChangeCountry = async () => {
    const row = await form.getFieldsValue();

    form.setFieldsValue({
      ship_address: { country: row.bill_address.country },
    });
  };
  const onChangeProvince = async () => {
    const row = await form.getFieldsValue();

    form.setFieldsValue({
      ship_address: { province: row.bill_address.province },
    });
  };
  const onChangeCity = async () => {
    const row = await form.getFieldsValue();

    form.setFieldsValue({ ship_address: { city: row.bill_address.city } });
  };
  const onChangePostalCoude = async () => {
    const row = await form.getFieldsValue();

    form.setFieldsValue({
      ship_address: { plate_number: row.bill_address.plate_number },
    });
  };

  //upload
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onChangeDrag = ({ fileList: newFileList }) => {
    setAttachments(newFileList);
  };
  return (
    <Row className='modal'>
      <Col span={24}>
        {type === 'table' ? (
          <EditMenuItem {...rest} onClick={showModal} permission={CUSTOMER_M} />
        ) : (
          <Button className='num' onClick={showModal} shape='round'>
            {t('Sales.Customers.Table.Edit')}
          </Button>
        )}

        <Modal
          maskClosable={false}
          title={
            <Modal
              maskClosable={false}
              DragTitle
              disabled={disabled}
              setDisabled={setDisabled}
              title={t('Sales.Customers.Customer_information')}
            />
          }
          modalRender={(modal) => (
            <Draggable disabled={disabled} nodeRef={ref}>
              <div ref={ref}>{modal}</div>
            </Draggable>
          )}
          centered
          open={isShowModal.visible}
          onCancel={handleCancel}
          afterClose={handelAfterClose}
          destroyOnClose
          width={
            isMobile ? '100%' : isTablet ? '100%' : isBgTablet ? 1050 : 1050
          }
          style={Styles.modal(isMobile)}
          bodyStyle={Styles.modalBody(isMobile, isSubBase, isMiniTablet)}
          footer={
            <Row justify='end' align='middle'>
              <Col>
                <CancelButton onClick={handleCancel} />
                <SaveButton onClick={handleOk} loading={loading} />
              </Col>
            </Row>
          }
        >
          <Form
            form={form}
            hideRequiredMark={true}
            scrollToFirstError={true}
            layout='vertical'
          >
            <Row>
              <Col md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                <Row gutter={[10]} align='bottom'>
                  <Col
                    style={styles.firstRow(isMobile, isTablitBase)}
                    xl={{ span: 6 }}
                    md={{ span: 7 }}
                    sm={5}
                    xs={10}
                  >
                    <Form.Item
                      name='upload'
                      valuePropName='fileList'
                      getValueFromEvent={normFile}
                      className='upload'
                      style={styles.name}
                      help={error ? `${t('Form.Photo_error')}` : undefined}
                      validateStatus={error === true ? 'error' : undefined}
                    >
                      <Uplod
                        setFile={setFile}
                        name={t('Form.Photo')}
                        setFileList={setFileList}
                        fileList={fileList}
                        onChange={onChange}
                        setError={setError}
                      />
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 17 }}>
                    <Row gutter={10}>
                      <Col xl={{ span: 8 }}>
                        <Form.Item
                          label={
                            <span>
                              {t('Form.Name1')}
                              <span className='star'>*</span>
                            </span>
                          }
                          name='name'
                          style={styles.marginBottom}
                          rules={[
                            {
                              whitespace: true,
                              message: `${t('Form.Name_required')}`,
                              required: true,
                            },
                          ]}
                        >
                          <Input autoFocus />
                        </Form.Item>
                      </Col>

                      <Col xl={{ span: 8 }}>
                        <Form.Item
                          label={
                            <span>
                              {t('Form.Last_Name')}
                              <span className='star'>*</span>
                            </span>
                          }
                          rules={[
                            {
                              message: `${t('Form.Required_last_name')}`,
                              required: true,
                              whitespace: true,
                            },
                          ]}
                          name='lastName'
                          style={styles.marginBottom}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xl={{ span: 8 }}>
                        <Form.Item
                          label={<span>{t('Form.Nick_name')}</span>}
                          name='nickName'
                          style={styles.marginBottom}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xl={{ span: 12 }}>
                        {' '}
                        <Form.Item noStyle>
                          <CategoryField
                            form={form}
                            url='/customer_account/customer_category/'
                            label={
                              <span>
                                {t('Sales.Product_and_services.Form.Category')}
                                <span className='star'>*</span>
                              </span>
                            }
                            style={styles.marginBottom}
                          />
                        </Form.Item>
                      </Col>
                      <Col xl={{ span: 12 }}>
                        <Form.Item
                          label={
                            <p style={styles.name}> {t('Form.Company')}</p>
                          }
                          name='company'
                          style={styles.name}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={{ span: 12 }} xs={24}>
                    <Form.Item
                      name='nationalIdNumber'
                      label={t('Sales.Customers.Form.National_id_number')}
                      className='margin'
                    >
                      <InputNumber
                        min={1}
                        type='number'
                        className='num'
                        inputMode='numeric'
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }} xs={24}>
                    <Form.Item
                      name='creditLimit'
                      label={t('Sales.Customers.Form.Credit_limit')}
                      className='margin'
                    >
                      <InputNumber
                        min={0}
                        type='number'
                        className='num'
                        inputMode='numeric'
                      />
                    </Form.Item>
                  </Col>
                  {/* <Col span={7}>
                    <Form.Item
                      name="discountSerial"
                      label={t("Form.Discount_serial_number")}
                      style={styles.name}
                    >
                      <Input />
                    </Form.Item>
                  </Col> */}
                </Row>
              </Col>
              <Col md={12} sm={24} xs={24}>
                <Row gutter={[10]}>
                  <Col md={{ span: 23, offset: 1 }} sm={24} xs={24}>
                    {' '}
                    <Form.Item
                      name='email'
                      label={t('Form.Email')}
                      style={styles.marginBottom}
                      rules={[
                        {
                          type: 'email',
                          message: `${t('Form.Email_Message')}`,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={{ span: 11, offset: 1 }} sm={12} xs={24}>
                    {' '}
                    <Form.Item
                      name='phone'
                      onChange={(e) => {}}
                      label={
                        <span>
                          {t('Form.Phone')}&nbsp;
                          <Tooltip
                            title={
                              <span>{t('Form.Phone_sample')} 799773529</span>
                            }
                          >
                            <QuestionCircleOutlined />
                          </Tooltip>
                        </span>
                      }
                      style={styles.marginBottom}
                      rules={[]}
                    >
                      <Input style={styles.row} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }} xs={24}>
                    <Form.Item
                      name='mobile'
                      label={
                        <span>
                          {t('Form.Mobile')}&nbsp;
                          <Tooltip
                            title={`${t('Form.Mobile_sample')} 0799773529 `}
                          >
                            <QuestionCircleOutlined />
                          </Tooltip>
                        </span>
                      }
                      style={styles.marginBottom}
                    >
                      <Input style={styles.row} />
                    </Form.Item>
                  </Col>
                  <Col md={{ span: 11, offset: 1 }} sm={12} xs={24}>
                    <Form.Item
                      name='fax'
                      label={
                        <span>
                          {t('Form.Fax')}
                          &nbsp;
                          <Tooltip
                            title={`${t(
                              'Form.Fax_sample',
                            )} 93799773529@efaxsend.com `}
                          >
                            <QuestionCircleOutlined />
                          </Tooltip>
                        </span>
                      }
                      style={styles.marginBottom}
                    >
                      <Input style={styles.row} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }} xs={24}>
                    <Form.Item
                      name='website'
                      label={t('Form.Website')}
                      style={styles.marginBottom}
                      rules={[
                        {
                          type: 'url',
                          message: t('Form.Required_website'),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Tabs
                  type='card'
                  // animated={true}
                  size='small'
                  activeKey={activeKey}
                  onTabClick={onTabClick}
                  tabBarStyle={styles.tab(isMobile)}
                >
                  <TabPane tab={t('Form.Address')} key='1'>
                    <Row>
                      <Col md={12} sm={24} xs={24}>
                        <Row>
                          <Col md={23} sm={24} xs={24}>
                            <Form.Item
                              label={
                                <p style={styles.name}>
                                  {t('Form.Billing_address')}
                                </p>
                              }
                              name={['bill_address', 'street']}
                              style={styles.address}
                            >
                              <Input
                                onChange={onChangeStreet}
                                placeholder={t('Form.Street')}
                              />
                            </Form.Item>
                          </Col>
                          <Col md={{ span: 11 }} sm={12} xs={24}>
                            <Form.Item
                              name={['bill_address', 'country']}
                              style={styles.address}
                            >
                              <Input
                                onChange={onChangeCountry}
                                placeholder={t('Form.Country')}
                              />
                            </Form.Item>
                            <Form.Item
                              name={['bill_address', 'city']}
                              style={styles.address}
                            >
                              <Input
                                onChange={onChangeCity}
                                placeholder={t('Form.City/Town')}
                              />
                            </Form.Item>
                          </Col>
                          <Col sm={{ span: 11, offset: 1 }} xs={24}>
                            <Form.Item
                              name={['bill_address', 'province']}
                              style={styles.address}
                            >
                              <Input
                                onChange={onChangeProvince}
                                placeholder={t('Form.State/Province')}
                              />
                            </Form.Item>
                            <Form.Item
                              name={['bill_address', 'plate_number']}
                              style={styles.address}
                            >
                              <Input
                                onChange={onChangePostalCoude}
                                placeholder={t('Form.Postal_code')}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                      <Col md={12} sm={24} xs={24}>
                        <Row>
                          <Col md={{ span: 23, offset: 1 }} sm={24} xs={24}>
                            <Form.Item
                              label={
                                <p style={styles.name}>
                                  {t('Form.Shipping_address')}{' '}
                                </p>
                              }
                              name={['ship_address', 'street']}
                              style={styles.address}
                            >
                              <Input placeholder={t('Form.Street')} />
                            </Form.Item>
                          </Col>
                          <Col
                            md={{ span: 11, offset: 1 }}
                            sm={12}
                            xs={{ span: 24 }}
                          >
                            <Form.Item
                              name={['ship_address', 'country']}
                              style={styles.address}
                            >
                              <Input placeholder={t('Form.Country')} />
                            </Form.Item>
                            <Form.Item
                              name={['ship_address', 'city']}
                              style={styles.marginBottom}
                            >
                              <Input placeholder={t('Form.City/Town')} />
                            </Form.Item>
                          </Col>
                          <Col sm={{ span: 11, offset: 1 }} xs={{ span: 24 }}>
                            <Form.Item
                              name={['ship_address', 'province']}
                              style={styles.address}
                            >
                              <Input placeholder={t('Form.State/Province')} />
                            </Form.Item>
                            <Form.Item
                              name={['ship_address', 'plate_number']}
                              style={styles.marginBottom}
                            >
                              <Input placeholder={t('Form.Postal_code')} />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane
                    style={{ marginBottom: '0rem' }}
                    tab={t('Form.Notes')}
                    key='2'
                  >
                    <Row>
                      <Col span={24}>
                        <Form.Item
                          name='notes'
                          label={t('Form.Notes')}
                          className='margin1'
                        >
                          <Input.TextArea
                            autoSize={{ minRows: 4, maxRows: 4 }}
                            showCount
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab={t('Form.Attachments')} key='3'>
                    <Row>
                      <Col md={8} sm={14} xs={20}>
                        <Form.Item
                          label={
                            <span>
                              {t('Form.Attachments')} &nbsp;
                              <Tooltip
                                title={t('Form.Attachments_tooltip')}
                                placement='left'
                              >
                                <QuestionCircleOutlined />
                              </Tooltip>
                            </span>
                          }
                          validateStatus={
                            attachmentError === true ? 'error' : undefined
                          }
                          help={
                            attachmentError === true
                              ? t('Form.Attachments_tooltip')
                              : undefined
                          }
                        >
                          <Form.Item
                            name='attachment'
                            valuePropName='fileList'
                            getValueFromEvent={normFile1}
                            noStyle
                          >
                            <UploadFile
                              setFile={setAttachment}
                              name={t('Form.Drag_Drop')}
                              setFileList={setAttachments}
                              fileList={attachments}
                              onChange={onChangeDrag}
                              setError={setAttachmentError}
                            />
                          </Form.Item>
                        </Form.Item>
                      </Col>
                    </Row>
                  </TabPane>
                </Tabs>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Col>
    </Row>
  );
};

const styles = {
  modle: (isMobile) => ({ top: isMobile ? 0 : 20 }),
  bodyStyle: (isMobile, isSubBase, isTablit, isTablit1) => ({
    maxHeight: `calc(100vh - 152px)`,
    overflowY: 'auto',
    padding: isSubBase ? '20px' : '24px',
    paddingTop: '10px',
  }),
  name: { marginBottom: '.0rem' },
  address: { marginBottom: '.5rem' },

  drop: { height: '100%' },

  tab: (isMobile) => ({
    marginBottom: '8px',
    marginTop: isMobile ? '1rem' : '5px',
  }),
  marginBottom: { marginBottom: '8px' },
  firstRow: (isMobile, isTablitBase) => ({}),
};
// const enhancProduct = withObservables(["groups"], ({ database }) => ({
//   groups: database.collections.get("groups").query().observe(),
// }));
// export default connect(null, { addProducts })(
//   withDatabase(enhancProduct(NewCustomer))
// );

export default EditCustomer;
