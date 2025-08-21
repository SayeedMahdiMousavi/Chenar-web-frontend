import React from 'react';
import {
  EditOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  Upload,
  Typography,
  Space,
  Image,
} from 'antd';
import { CancelButton, SaveButton } from '../../../../components';
import { useTranslation } from 'react-i18next';
import CompressPhoto from '../../../CompressPhoto';
import { trimString } from '../../../../Functions/TrimString';

const { Option } = Select;
const { Text } = Typography;

export default function EditCompanyForm({
  form,
  isTablet,
  isMobile,
  file,
  setFile,
  fileList,
  setFileList,
  previewVisible,
  setPreviewVisible,
  previewImage,
  setPreviewImage,
  loading,
  setLoading,
  mutateAddCompanyInfo,
  mutateEditCompany,
  error,
  cancel,
  socialMediaList,
}) {
  const { t } = useTranslation();

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleChangeVisible = () => setPreviewVisible(false);

  const prop = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    onPreview: async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await CompressPhoto(file.originFileObj, {
          quality: 0.6,
          width: 500,
          height: 550,
        }).then((blob) => URL.createObjectURL(blob));
      }
      setPreviewImage(file.url || file.preview);
      setPreviewVisible(true);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      (async () => {
        const smallSize = await CompressPhoto(file, {
          quality: 0.6,
          width: 500,
          height: 550,
        });
        setFile(smallSize);
      })();
      return false;
    },
    fileList,
    accept: 'image/*',
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    if (file) {
      formData.append('logo', file, file.name);
    }
    formData.append('fa_name', trimString(values.name));
    formData.append('ps_name', trimString(values.name));
    formData.append('en_name', trimString(values.name));
    formData.append('email', values.email ? values.email : '');
    formData.append('type', values.type ? values.type : '');
    formData.append('website', values.website ? values.website : '');
    formData.append('slogan', values.slogan ? values.slogan : '');
    const mobileData = values?.mobiles?.map((item) => item.mobile);
    const mobile = { mobile_list: mobileData };    
    formData.append('mobile', JSON.stringify(mobile));
    const social_media = { social_media_list: values.socialMedia };
    formData.append('social_media', JSON.stringify(social_media));
    const address = JSON.stringify({ address_list: values.addresses });
    formData.append('address', address);
    formData.append('business_number', values.businessIdNo ? values.businessIdNo : '');

    if (error === 204) {
      setLoading(true);
      mutateAddCompanyInfo(formData);
    } else {
      setLoading(true);
      mutateEditCompany(formData);
    }
  };

  return (
    <Form onFinish={onFinish} form={form} name="dynamic_form_item">
      <Row className="account_setting_drawer_name">
        <Col span={24} gutter={[5, 5]}>
          <Row gutter={[5, 5]}>
            <Col lg={5} sm={6} xs={24} style={styles.title(isTablet)}>
              <Text strong={true}>{t('Company.Company_name')}</Text>
            </Col>
            <Col lg={7} sm={8} xs={isMobile ? 11 : 10}>
              <Text strong={true}>{t('Company.Company_logo')}</Text>
              <br />
              <Text type="secondary">{t('Company.Company_logo_description')}</Text>
            </Col>
            <Col lg={12} sm={10} xs={isMobile ? 13 : 14}>
              <Row justify="space-between">
                <Col style={styles.upload1}>
                  <Form.Item
                    name="upload"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    style={styles.margin}
                  >
                    <Upload name="logo" listType="picture-card" {...prop}>
                      {fileList?.length >= 1 ? null : t('Company.Logo')}
                    </Upload>
                  </Form.Item>
                </Col>
                <Col>
                  <Image
                    width={200}
                    preview={{
                      src: previewImage,
                      visible: previewVisible,
                      onVisibleChange: handleChangeVisible,
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[5, 20]} style={styles.rowEdit}>
            <Col lg={5} sm={6} xs={0}></Col>
            <Col lg={7} sm={8} xs={isMobile ? 11 : 10}>
              <Text strong={true}>{t('Company.Company_name')}</Text>
              <br />
              <Text type="secondary">{t('Company.Company_name_description')}</Text>
            </Col>
            <Col lg={7} sm={9} xs={isMobile ? 13 : 12}>
              <Form.Item
                name="name"
                style={styles.margin}
                rules={[
                  {
                    whitespace: true,
                    message: `${t('Form.Name_required')}`,
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col lg={5} sm={1} xs={isMobile ? 0 : 2}></Col>
            <Col lg={5} sm={6} xs={0}></Col>
            <Col lg={7} sm={8} xs={isMobile ? 11 : 10}>
              <Text strong={true}>{t('Expenses.Suppliers.Business_id_no')}</Text>
            </Col>
            <Col lg={7} sm={9} xs={isMobile ? 13 : 12}>
              <Form.Item name="businessIdNo" style={styles.margin}>
                <Input />
              </Form.Item>
            </Col>
            <Col lg={5} sm={1} xs={isMobile ? 0 : 2}></Col>
            <Col lg={5} sm={6} xs={0}></Col>
            <Col lg={7} sm={8} xs={isMobile ? 11 : 10}>
              <Text strong={true}>{t('Company.Company_type')}</Text>
            </Col>
            <Col lg={7} sm={9} xs={isMobile ? 13 : 12}>
              <Form.Item
                name="type"
                style={styles.margin}
                rules={[
                  {
                    message: `${t('Company.Form.Required_type')}`,
                    required: true,
                  },
                ]}
              >
                <Select>
                  <Option value="supermarket">{t('Company.Form.Supermarket')}</Option>
                  <Option value="commercial">{t('Company.Form.Commercial')}</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col lg={5} sm={1} xs={isMobile ? 0 : 2}></Col>
            <Col lg={5} sm={6} xs={0}></Col>
            <Col lg={7} sm={8} xs={isMobile ? 11 : 10}>
              <Text strong={true}>{t('Company.Company_email')}</Text>
              <br />
              <Text type="secondary">{t('Company.Company_email_description')}</Text>
            </Col>
            <Col lg={7} sm={9} xs={isMobile ? 13 : 12}>
              <Form.Item
                name="email"
                style={styles.margin}
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
            <Col lg={5} sm={1} xs={isMobile ? 0 : 2}></Col>
            <Col lg={5} sm={6} xs={0}></Col>
            <Col lg={7} sm={8} xs={isMobile ? 11 : 10}>
              <Text strong={true}>{t('Company.Company_mobile')}</Text>
              <br />
              <Text type="secondary">{t('Company.Website_description')}</Text>
            </Col>
            <Col lg={7} sm={9} xs={isMobile ? 13 : 12}>
              <Form.List
                name="mobiles"
                rules={[
                  {
                    validator: async (_, addresses) => {
                      if (!addresses || addresses.length < 1) {
                        return Promise.reject(
                          new Error(`${t('Company.Company_mobile_required')}`)
                        );
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields?.map((field) => (
                      <Form.Item
                        key={field.key}
                        required={false}
                        style={{ marginBottom: '8px' }}
                      >
                        <Form.Item
                          {...field}
                          name={[field.name, 'mobile']}
                          key={[field.key, 'mobile']}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: `${t('Company.Mobile_required')}`,
                            },
                          ]}
                          noStyle
                        >
                          <Input
                            placeholder={t('Company.Mobile')}
                            style={{ width: `calc(100% - 22px)` }}
                          />
                        </Form.Item>
                        {fields?.length > 1 ? (
                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                            style={{ paddingInlineStart: 0 }}
                          />
                        ) : null}
                      </Form.Item>
                    ))}
                    {fields?.length < 3 ? (
                      <Form.Item className="margin">
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          {t('Company.Add_mobile')}
                        </Button>
                      </Form.Item>
                    ) : null}
                    <Form.ErrorList errors={errors} />
                  </>
                )}
              </Form.List>
            </Col>
            <Col lg={5} sm={1} xs={isMobile ? 0 : 2}></Col>
            <Col lg={5} sm={6} xs={0}></Col>
            <Col lg={7} sm={8} xs={isMobile ? 11 : 10}>
              <Text strong={true}>{t('Form.Website')}</Text>
              <br />
              <Text type="secondary">{t('Company.Website_description')}</Text>
            </Col>
            <Col lg={7} sm={9} xs={isMobile ? 13 : 12}>
              <Form.Item
                name="website"
                style={styles.margin}
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
            <Col lg={5} sm={1} xs={isMobile ? 0 : 2}></Col>
            <Col lg={5} sm={6} xs={0}></Col>
            <Col lg={7} sm={8} xs={isMobile ? 11 : 10}>
              <Text strong={true}>{t('Company.Slogan')}</Text>
              <br />
              <Text type="secondary">{t('Company.Website_description')}</Text>
            </Col>
            <Col lg={7} sm={9} xs={isMobile ? 13 : 12}>
              <Form.Item name="slogan" style={styles.margin}>
                <Input />
              </Form.Item>
            </Col>
            <Col lg={5} sm={1} xs={isMobile ? 0 : 2}></Col>
            <Col lg={5} sm={6} xs={0}></Col>
            <Col lg={7} sm={8} xs={isMobile ? 11 : 10}>
              <Text strong={true}>{t('Company.Social_media')}</Text>
              <br />
              <Text type="secondary">{t('Company.Website_description')}</Text>
            </Col>
            <Col lg={7} sm={9} xs={isMobile ? 13 : 12}>
              <Form.List name="socialMedia">
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields?.map((field) => (
                      <Row key={field.key} style={{ marginBottom: 8 }} align="bottom">
                        <Col style={{ width: `calc(100% - 32px)` }}>
                          <Row gutter={10} align="bottom">
                            <Col span={12}>
                              <Form.Item
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                name={[field.name, 'social_name']}
                                key={[field.key, 'social_name']}
                                rules={[
                                  {
                                    required: true,
                                    whitespace: true,
                                    message: `${t('Form.Name_required')}`,
                                  },
                                ]}
                                className="margin1"
                              >
                                <Select
                                  placeholder={t('Company.Social_media_name')}
                                  allowClear
                                  suffixIcon={<EditOutlined />}
                                >
                                  {socialMediaList?.map((item) => (
                                    <Option value={item.value} key={item.id}>
                                      {item.value}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                name={[field.name, 'social_address']}
                                key={[field.key, 'social_address']}
                                className="margin1"
                                rules={[
                                  {
                                    required: true,
                                    whitespace: true,
                                    message: `${t('Company.Social_address_required')}`,
                                  },
                                ]}
                              >
                                <Input placeholder={t('Company.Social_media_address')} />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                        <Col>
                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                            style={{ padding: '9px' }}
                          />
                        </Col>
                      </Row>
                    ))}
                    {fields?.length < 3 ? (
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                          className="margin"
                        >
                          {t('Company.Add_social_media')}
                        </Button>
                      </Form.Item>
                    ) : null}
                  </>
                )}
              </Form.List>
            </Col>
            <Col lg={5} sm={1} xs={isMobile ? 0 : 2}></Col>
            <Col lg={5} sm={6} xs={0}></Col>
            <Col lg={7} sm={8} xs={isMobile ? 11 : 10}>
              <Text strong={true}>{t('Company.Company_address')}</Text>
              <br />
              <Text type="secondary">{t('Company.Website_description')}</Text>
            </Col>
            <Col lg={7} sm={9} xs={isMobile ? 13 : 12}>
              <Form.List
                name="addresses"
                rules={[
                  {
                    validator: async (_, addresses) => {
                      if (!addresses || addresses.length < 1) {
                        return Promise.reject(
                          new Error(`${t('Company.Company_address_required')}`)
                        );
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields?.map((field) => (
                      <Space
                        key={field.key}
                        style={{ display: 'flex', marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          name={[field.name, 'fa_name']}
                          fieldKey={[field.fieldKey, 'fa_name']}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: `${t('Form.Name_required')}`,
                            },
                          ]}
                          className="margin1"
                        >
                          <Input placeholder={t('Company.Address_name')} />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          name={[field.name, 'address_place']}
                          fieldKey={[field.fieldKey, 'address_place']}
                          className="margin1"
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: `${t('Company.Company_address_name_required')}`,
                            },
                          ]}
                        >
                          <Input placeholder={t('Company.Address_place')} />
                        </Form.Item>
                        {fields?.length > 1 ? (
                          <MinusCircleOutlined onClick={() => remove(field.name)} />
                        ) : null}
                      </Space>
                    ))}
                    {fields?.length < 3 ? (
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                          className="margin"
                        >
                          {t('Company.Add_address')}
                        </Button>
                      </Form.Item>
                    ) : null}
                    <Form.ErrorList errors={errors} />
                  </>
                )}
              </Form.List>
            </Col>
            <Col lg={12} sm={14} xs={isMobile ? 11 : 10}></Col>
            <Col lg={12} sm={10} xs={isMobile ? 13 : 14}>
              <Space>
                <CancelButton onClick={cancel} />
                <SaveButton htmlType="submit" loading={loading} />
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
}

const styles = {
  margin: { margin: '0rem' },
  cancel: { margin: '10px 10px' },
  prefix: { width: 50 },
  rowEdit: { paddingTop: '15px' },
  title: (isTablet) => ({
    textAlign: isTablet ? 'center' : '',
    padding: isTablet ? '23px 0px 23px 0px' : '',
  }),
  closeIcon: { color: `#1890ff` }, // Adjust color if Colors.primaryColor is defined elsewhere
  modal1: {
    padding: '0px',
    height: '80vh',
  },
  upload1: { width: '100px' },
};