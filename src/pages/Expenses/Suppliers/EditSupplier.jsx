import React, { Fragment, useState, useRef } from 'react';
import { Modal, Col, Row, Button } from 'antd';
import { useMediaQuery } from '../../MediaQurey';
import UploadFile from '../../sales/UploadFile';
import axiosInstance from '../../ApiBaseUrl';
import { useMutation, useQueryClient } from 'react-query';
import { Form, Input, Tooltip, InputNumber, Tabs, message } from 'antd';
import Uplod from '../../sales/Upload';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Styles } from '../../styles';
import { ModalDragTitle } from '../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { CategoryField } from '../../SelfComponents/CategoryField';
import { trimString } from '../../../Functions/TrimString';
import { CancelButton, EditMenuItem, SaveButton } from '../../../components';
import { SUPPLIER_M } from '../../../constants/permissions';
import { manageErrors, updateMessage } from '../../../Functions';

const { TabPane } = Tabs;

const EditSupplier = ({
  record,
  setVisible,
  attachment: attachmentName,
  type,
  handleClickEdit,
  ...rest
}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [fileList, setFileList] = useState([]);
  const [file, setFile] = useState({});
  const [error, setError] = useState(false);
  const [attachment, setAttachment] = useState();
  const [attachments, setAttachments] = useState([]);
  const [attachmentError, setAttachmentError] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [activeKey, setActiveKey] = useState('1');
  const [seeTabs, setSeeTabs] = useState(['']);
  const isBgTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');
  const ref = useRef(null);

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
      email: record?.email,
      phone: record?.phone_number,
      mobile: record?.mobile_number,
      fax: record?.fax_number,
      nationalIdNumber: record?.national_id_number,
      notes: record?.notes,
      website: record?.website,
      businessIdNo: record?.business_id,
      bill_address: {
        street: record?.street,
        province: record?.province,
        plate_number: record?.plate_number,
        country: record?.country,
        city: record?.city,
      },

      upload: record?.photo && [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: record?.photo,
        },
      ],
      attachment: record?.attachment && [
        {
          uid: '-1',
          name: attachmentName,
          status: 'done',
          url: record?.attachment,
        },
      ],
    });
    if (type === 'table') {
      setVisible(false);
      handleClickEdit();
    }
  };

  const editSupplier = async (value) =>
    await axiosInstance.put(
      `/supplier_account/supplier/${record?.id}/`,
      value,
      {
        timeout: 0,
      },
    );

  const {
    mutate: mutateEditSupplier,
    isLoading,
    reset,
  } = useMutation(editSupplier, {
    onSuccess: (values) => {
      setIsShowModal({
        visible: false,
      });
      updateMessage(`${values?.data?.first_name} ${values?.data?.last_name}`);
      queryClient.invalidateQueries(`/supplier_account/supplier/`);
      queryClient.invalidateQueries(`/supplier_account/supplier`);
      queryClient.invalidateQueries(`/supplier_account/supplier1/`);
      if (record?.id === '201001') {
        queryClient.invalidateQueries(`/supplier_account/supplier/default/`);
      }
    },
    onError: (error) => {
      manageErrors(error);
      if (error?.response?.data?.non_field_errors?.[0]) {
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
    },
  });

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      if (error || attachmentError) {
        message.error(
          `${t('Sales.Product_and_services.Form.Units_error_message')}`,
        );
        return;
      } else {
        const formData = new FormData();
        if (file?.name) {
          formData.append('photo', file, file.name);
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
        formData.append('first_name', trimString(values.name));
        formData.append('last_name', trimString(values.lastName));
        formData.append(
          'nike_name',
          values.nickName ? trimString(values.nickName) : '',
        );
        if (values.category?.value) {
          formData.append('category', values?.category?.value);
        }
        formData.append(
          'company_name',
          values.company ? trimString(values.company) : '',
        );
        formData.append('email', values.email ? values.email : '');
        formData.append('phone_number', values.phone ? values?.phone : '');
        formData.append('mobile_number', values.mobile ? values?.mobile : '');
        formData.append('fax_number', values.fax ? values.fax : '');
        formData.append('website', values.website ? values.website : '');
        formData.append(
          'credit_limit',
          values.creditLimit ? values.creditLimit : '',
        );
        formData.append(
          'national_id_number',
          values.nationalIdNumber ? values.nationalIdNumber : '',
        );

        formData.append(
          'business_id',
          values.businessIdNo ? values.businessIdNo : '',
        );
        if (seeTabs.includes('3')) {
          formData.append('notes', values.notes ? values.notes : '');
        }
        if (seeTabs.includes('2')) {
          formData.append(
            'street',
            values?.bill_address?.street ? values.bill_address.street : '',
          );
          formData.append(
            'country',
            values?.bill_address?.country ? values.bill_address.country : '',
          );
          formData.append(
            'city',
            values?.bill_address?.city ? values.bill_address.city : '',
          );
          formData.append(
            'province',
            values?.bill_address?.province ? values.bill_address.province : '',
          );
          formData.append(
            'plate_number',
            values?.bill_address?.plate_number
              ? values.bill_address.plate_number
              : '',
          );
        }

        mutateEditSupplier(formData);
      }
    });
  };

  const handleCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };

  const handelAfterClose = () => {
    form.resetFields();
    reset();
    setError(false);
    setAttachmentError(false);
    setFileList([]);
    setFile();
    setSeeTabs(['']);
    setActiveKey('1');
    setAttachments([]);
    setAttachment();
  };

  //upload
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onChangeDrag = ({ fileList: newFileList }) => {
    setAttachments(newFileList);
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

  const onTabClick = (key) => {
    setActiveKey(key);
    setSeeTabs((prev) => [...prev, key]);
  };

  return (
    <Row className='modal'>
      <Col span={24}>
        {type === 'table' ? (
          <EditMenuItem {...rest} onClick={showModal} permission={SUPPLIER_M} />
        ) : (
          <Button className='num' onClick={showModal} shape='round'>
            {t('Sales.Customers.Table.Edit')}
          </Button>
        )}
        <Modal
          maskClosable={false}
          title={
            <ModalDragTitle
              disabled={disabled}
              setDisabled={setDisabled}
              title={t('Expenses.Suppliers.Supplier_information')}
            />
          }
          modalRender={(modal) => (
            <Draggable disabled={disabled} nodeRef={ref}>
              <div ref={ref}>{modal}</div>
            </Draggable>
          )}
          centered
          afterClose={handelAfterClose}
          destroyOnClose={true}
          open={isShowModal.visible}
          onCancel={handleCancel}
          width={isMobile ? '100%' : isTablet ? '80%' : isBgTablet ? 600 : 600}
          style={Styles.modal(isMobile)}
          bodyStyle={Styles.modalBody(isMobile, isSubBase, isMiniTablet)}
          footer={
            <Fragment>
              <CancelButton onClick={handleCancel} />
              <SaveButton onClick={handleOk} loading={isLoading} />
            </Fragment>
          }
        >
          <Form
            form={form}
            hideRequiredMark={true}
            scrollToFirstError={true}
            layout='vertical'
          >
            <Row gutter={[10]} align='bottom'>
              <Col xl={{ span: 6 }} md={{ span: 7 }} sm={5} xs={10}>
                <Form.Item
                  name='upload'
                  valuePropName='fileList'
                  getValueFromEvent={normFile}
                  help={error ? `${t('Form.Photo_error')}` : undefined}
                  validateStatus={error === true ? 'error' : undefined}
                  className='upload margin1'
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
              <Col span={18}>
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
                    {' '}
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
                    <Form.Item
                      name='nationalIdNumber'
                      label={t('Sales.Customers.Form.National_id_number')}
                      className='margin'
                    >
                      <InputNumber
                        type='number'
                        className='num'
                        inputMode='numeric'
                      />
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 12 }}>
                    <Form.Item noStyle>
                      <CategoryField
                        form={form}
                        url='/supplier_account/supplier_category/'
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
                </Row>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={8}>
                <Form.Item
                  label={<span> {t('Form.Company')}</span>}
                  name='company'
                  style={styles.name}
                  className='num'
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name='businessIdNo'
                  label={t('Expenses.Suppliers.Business_id_no')}
                  style={styles.name}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name='creditLimit'
                  label={t('Sales.Customers.Form.Credit_limit')}
                >
                  <InputNumber
                    min={1}
                    type='number'
                    className='num'
                    inputMode='numeric'
                  />
                </Form.Item>
              </Col>
            </Row>

            <Tabs
              type='card'
              //   animated={true}
              size='small'
              tabBarStyle={styles.tab(isMobile)}
              activeKey={activeKey}
              onTabClick={onTabClick}
            >
              <TabPane tab={t('Employees.Contact')} key='1'>
                <Row gutter={[10]}>
                  <Col span={24}>
                    {' '}
                    <Form.Item
                      name='email'
                      label={t('Employees.Contact')}
                      style={styles.address}
                      rules={[
                        {
                          type: 'email',
                          message: `${t('Form.Email_Message')}`,
                        },
                      ]}
                    >
                      <Input placeholder={t('Form.Email')} />
                    </Form.Item>
                  </Col>
                  <Col sm={12} xs={24}>
                    {' '}
                    <Form.Item name='phone' style={styles.address} rules={[]}>
                      <Input style={styles.row} placeholder={t('Form.Phone')} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }} xs={24}>
                    <Form.Item name='mobile' style={styles.address}>
                      <Input placeholder={t('Form.Mobile')} />
                    </Form.Item>
                  </Col>

                  <Col md={{ span: 12 }} sm={12} xs={24}>
                    <Form.Item name='fax' className='margin1'>
                      <Input style={styles.row} placeholder={t('Form.Fax')} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }} xs={24}>
                    <Form.Item
                      name='website'
                      className='margin1'
                      rules={[
                        {
                          type: 'url',
                          message: t('Form.Required_website'),
                        },
                      ]}
                    >
                      <Input placeholder={t('Form.Website')} />
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab={t('Form.Address')} key='2'>
                <Row gutter={[10]}>
                  <Col md={24} sm={24} xs={24}>
                    <Form.Item
                      label={<p style={styles.name}>{t('Form.Address')}</p>}
                      name={['bill_address', 'street']}
                      style={styles.address}
                    >
                      <Input placeholder={t('Form.Street')} />
                    </Form.Item>
                  </Col>
                  <Col md={{ span: 12 }} sm={12} xs={24}>
                    <Form.Item
                      name={['bill_address', 'country']}
                      style={styles.address}
                    >
                      <Input placeholder={t('Form.Country')} />
                    </Form.Item>
                    <Form.Item
                      name={['bill_address', 'city']}
                      className='margin1'
                    >
                      <Input placeholder={t('Form.City/Town')} />
                    </Form.Item>
                  </Col>
                  <Col
                    sm={12}
                    // md={{ span: 13 }}
                    xs={24}
                  >
                    <Form.Item
                      name={['bill_address', 'province']}
                      style={styles.address}
                    >
                      <Input placeholder={t('Form.State/Province')} />
                    </Form.Item>
                    <Form.Item
                      name={['bill_address', 'plate_number']}
                      className='margin1'
                    >
                      <Input placeholder={t('Form.Postal_code')} />
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab={t('Form.Notes')} key='3'>
                <Row gutter={10}>
                  <Col span={12}>
                    <Form.Item
                      name='notes'
                      label={t('Form.Notes')}
                      className='margin1'
                    >
                      <Input.TextArea autoSize={{ minRows: 3, maxRows: 3 }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      className='margin1'
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
          </Form>
        </Modal>
      </Col>
    </Row>
  );
};

const styles = {
  model: (isMobile) => ({ top: isMobile ? 0 : 20 }),
  bodyStyle: (isMobile, isSubBase, isTablit, isTablit1) => ({
    maxHeight: isMobile ? '75vh' : `calc(85vh - 87px)`,
    overflowY: 'auto',
    padding: isSubBase ? '20px' : '24px',
    paddingTop: '10px',
  }),
  name: { marginBottom: '.0rem' },
  address: { marginBottom: '.5rem' },

  drop: { height: '100%' },
  save: { width: '137%' },
  tab: (isMobile) => ({
    marginBottom: '8px',
  }),
  marginBottom: { marginBottom: '8px' },
  firstRow: (isMobile, isTablitBase) => ({
    height: isMobile ? '13.7rem' : isTablitBase ? '12.2rem' : '10.2rem',
  }),
  prefix: { width: 60 },
};

export default EditSupplier;
