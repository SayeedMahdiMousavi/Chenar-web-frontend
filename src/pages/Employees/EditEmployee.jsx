import React, { useState } from 'react';
import { Modal, Col, Row, Button } from 'antd';
import { useMediaQuery } from '../MediaQurey';
import UploadFile from '../sales/UploadFile';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../ApiBaseUrl';
import moment from 'moment';
import { Form, Input, Select, Tooltip, InputNumber, Tabs, message } from 'antd';
import Uplod from '../sales/Upload';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Styles } from '../styles';
import { ModalDragTitle } from '../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { CategoryField } from '../SelfComponents/CategoryField';
import { DatePickerFormItem } from '../SelfComponents/JalaliAntdComponents/DatePickerFormItem';
import { trimString } from '../../Functions/TrimString';
import {
  changeGToJ,
  changeJToG,
  handlePrepareDateForDateField,
  handlePrepareDateForServer,
  utcDate,
} from '../../Functions/utcDate';
import dayjs from 'dayjs';
import useGetCalender from '../../Hooks/useGetCalender';
import { CancelButton, EditMenuItem, SaveButton } from '../../components';
import { EMPLOYEE_M } from '../../constants/permissions';
import { manageErrors, updateMessage } from '../../Functions';

const { Option } = Select;
const { TabPane } = Tabs;
const dateFormat = 'YYYY-MM-DD';

const EditEmployee = ({
  record,
  setVisible,
  baseUrl,
  onClickEdit,
  attachment: attachmentName,
  type,
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

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  const showModal = () => {
    if (type === 'table') {
      setVisible(false);
      onClickEdit();
    }

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

    const birthDate =
      record?.date_of_birth &&
      handlePrepareDateForDateField({
        date: record?.date_of_birth,
        dateFormat,
        calendarCode,
      });

    const hireDate =
      record?.hire_date &&
      handlePrepareDateForDateField({
        date: record?.hire_date,
        dateFormat,
        calendarCode,
      });

    const releasedDate =
      record?.release_date &&
      handlePrepareDateForDateField({
        date: record?.release_date,
        dateFormat,
        calendarCode,
      });

    form.setFieldsValue({
      name: record?.first_name,
      lastName: record?.last_name,
      nickName: record?.nike_name,
      category: {
        value: record?.category?.id,
        label: record?.category?.name,
      },
      salary: record?.salary,
      position: record?.position,
      birthDate: birthDate,
      email: record?.email,
      phone: record?.phone_number,
      mobile: record?.mobile_number,
      nationalIdNumber: record?.national_id_number,
      notes: record?.notes,
      hireDate: hireDate,
      released: releasedDate,
      gender: record?.gender,
      employeeId: record?.Staff_UID,

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
  };

  const editEmployee = async (value) =>
    await axiosInstance.patch(`${baseUrl}${record?.id}/`, value, {
      timeout: 0,
    });

  const {
    mutate: mutateEditEmployee,
    isLoading,
    reset,
  } = useMutation(editEmployee, {
    onSuccess: (values) => {
      setIsShowModal({
        visible: false,
      });
      updateMessage(`${values.data.first_name} ${values.data.last_name}`);
      queryClient.invalidateQueries(baseUrl);
      if (record?.id === 203001) {
        queryClient.invalidateQueries(`${baseUrl}default/`);
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
    form.validateFields().then(async (value) => {
      if (error || attachmentError) {
        message.error(
          `${t('Sales.Product_and_services.Form.Units_error_message')}`,
        );
        return;
      } else {
        const birthDate =
          value['birthDate'] &&
          handlePrepareDateForServer({
            date: value?.birthDate,
            dateFormat,
            calendarCode,
          });

        const released =
          value['released'] &&
          handlePrepareDateForServer({
            date: value?.released,
            dateFormat,
            calendarCode,
          });

        const hireDate =
          value['hireDate'] &&
          handlePrepareDateForServer({
            date: value?.hireDate,
            dateFormat,
            calendarCode,
          });

        const values = {
          ...value,
          birthDate: birthDate,
          released: released,
          hireDate: hireDate,
        };
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
        if (values?.category?.value) {
          formData.append('category', values?.category?.value);
        }
        formData.append(
          'position',
          values.position ? trimString(values.position) : '',
        );

        formData.append('salary', values.salary);
        formData.append('email', values.email ? values.email : '');
        formData.append('phone_number', values.phone ? values?.phone : '');
        formData.append('mobile_number', values.mobile ? values?.mobile : '');
        formData.append(
          'date_of_birth',
          values.birthDate ? values.birthDate : '',
        );
        formData.append(
          'national_id_number',
          values.nationalIdNumber ? values.nationalIdNumber : '',
        );
        if (seeTabs.includes('4')) {
          formData.append('notes', values.notes ? values.notes : '');
        }

        const date1 = utcDate().format('YYYY-MM-DD');
        if (seeTabs.includes('3')) {
          formData.append(
            'hire_date',
            values?.hireDate ? values.hireDate : date1,
          );
          formData.append(
            'release_date',
            values?.released ? values.released : date1,
          );
          formData.append('gender', values.gender ? values.gender : 'female');
          formData.append(
            'Staff_UID',
            values.employeeId ? values.employeeId : '',
          );
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

        mutateEditEmployee(formData, {});
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
    setActiveKey('1');
    setAttachments([]);
    setAttachment();
    setSeeTabs(['']);
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
          <EditMenuItem {...rest} onClick={showModal} permission={EMPLOYEE_M} />
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
              title={t('Employees.Employee_information')}
            />
          }
          modalRender={(modal) => (
            <Draggable disabled={disabled}>{modal}</Draggable>
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
            <Row justify='end' align='middle'>
              <Col>
                <CancelButton onClick={handleCancel} />
                <SaveButton onClick={handleOk} loading={isLoading} />
              </Col>
            </Row>
          }
        >
          <Form
            layout='vertical'
            form={form}
            hideRequiredMark={true}
            scrollToFirstError={true}
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
                    <Form.Item
                      name='salary'
                      label={
                        <span>
                          {t('Employees.Salary')}
                          <span className='star'>*</span>
                        </span>
                      }
                      className='margin'
                      rules={[
                        {
                          message: `${t('Employees.Required_salary')}`,
                          required: true,
                        },
                      ]}
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
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={8}>
                <Form.Item noStyle>
                  <CategoryField
                    form={form}
                    url='/staff_account/staff_category/'
                    label={
                      <span>
                        {t('Sales.Product_and_services.Form.Category')}
                        <span className='star'>*</span>
                      </span>
                    }
                    style={styles.name}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                {' '}
                <Form.Item
                  name='position'
                  label={t('Employees.Position')}
                  className='margin'
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <DatePickerFormItem
                  name='birthDate'
                  label={t('Employees.BirthDate')}
                  showTime={false}
                  format=''
                  placeholder=''
                  rules={[{ type: 'object' }]}
                  allowClear={true}
                />
              </Col>
            </Row>

            <Tabs
              type='card'
              size='small'
              tabBarStyle={styles.tab(isMobile)}
              // animated={true}
              activeKey={activeKey}
              onTabClick={onTabClick}
            >
              <TabPane tab={t('Employees.Contact')} key='1'>
                <Row gutter={[10]}>
                  <Col sm={12} xs={24}>
                    {' '}
                    <Form.Item
                      name='phone'
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
                      className='margin'
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
                      className='margin'
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    {' '}
                    <Form.Item
                      name='email'
                      label={t('Form.Email')}
                      className='margin'
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
                  <Col sm={12} xs={24}>
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
              <TabPane tab={t('Form.Notes')} key='4'>
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
              <TabPane tab={t('Sales.Customers.Other')} key='3'>
                <Row gutter={[10]}>
                  <Col md={12} sm={12} xs={24}>
                    <DatePickerFormItem
                      name='hireDate'
                      label={t('Employees.Hire_date')}
                      showTime={false}
                      format=''
                      style={styles.marginBottom}
                      placeholder=''
                      rules={[{ type: 'object' }]}
                      allowClear={false}
                    />
                  </Col>
                  <Col md={12} sm={12} xs={24}>
                    <DatePickerFormItem
                      name='released'
                      label={t('Employees.Released')}
                      showTime={false}
                      format=''
                      style={styles.marginBottom}
                      placeholder=''
                      rules={[{ type: 'object' }]}
                      allowClear={false}
                    />
                  </Col>

                  <Col md={12} sm={12} xs={24}>
                    {' '}
                    <Form.Item
                      name='employeeId'
                      label={t('Employees.Employee_uid')}
                      className='margin'
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={12} sm={12} xs={24}>
                    {' '}
                    <Form.Item
                      name='gender'
                      label={t('Employees.Gender')}
                      className='margin'
                    >
                      <Select>
                        <Option value='male'>{t('Employees.Male')}</Option>
                        <Option value='female'>{t('Employees.Female')}</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>

            {/* </Col>
            </Row> */}
          </Form>
        </Modal>
      </Col>
    </Row>
  );
};

const styles = {
  model: (isMobile) => ({ top: isMobile ? 0 : 20 }),
  bodyStyle: (isMobile, isSubBase, isTablit, isTablit1) => ({
    maxHeight: isMobile ? '75vh' : `calc(85vh - 122px)`,
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
    marginTop: isMobile ? '10px' : '15px',
  }),
  marginBottom: { marginBottom: '8px' },
  firstRow: (isMobile, isTablitBase) => ({
    height: isMobile ? '13.7rem' : isTablitBase ? '12.2rem' : '10.2rem',
  }),
  prefix: { width: 60 },
};

export default EditEmployee;
