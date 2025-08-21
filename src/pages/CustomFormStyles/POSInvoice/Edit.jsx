import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import Content1 from './Content';
import { useGetCompanyInfo } from '../../../Hooks';

import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Checkbox,
  message,
  Divider,
  InputNumber,
  TreeSelect,
  Space,
} from 'antd';
import { ActionMessage } from '../../SelfComponents/TranslateComponents/ActionMessage';
import { CancelButton, SaveButton } from '../../../components';
import { manageErrors, updateMessage } from '../../../Functions';

const EditPOSDesignInvoice = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [showLogo, setShowLogo] = useState(false);
  const [logoSize, setLogoSize] = useState(80);
  const [visible, setVisible] = useState(false);
  const [titleShow, setTitleShow] = useState(true);
  const [titleLevel, setTitleLevel] = useState(4);
  const [phone, setPhone] = useState([0]);
  const [address, setAddress] = useState([0]);
  const [slogan, setSlogan] = useState({
    slogan: true,
  });
  const [{ showQr, qrMessage, qrValue }, setQrcode] = useState({
    showQr: true,
    qrMessage: '',
    qrValue: '',
  });
  const [{ notes, notesMessage }, setNotes] = useState({
    notes: true,
    notesMessage: '',
  });
  const [{ ticket, ticketMessage }, setTicket] = useState({
    ticket: true,
    ticketMessage: '',
  });
  const [googlePlay, setGooglePlay] = useState(true);
  const [appStore, setAppStore] = useState(true);

  const { data } = useGetCompanyInfo();

  const showDrawer = () => {
    props.setVisible(false);
    setVisible(true);
    const record = props?.record;
    form.setFieldsValue({
      defaultSetting: record?.default_setting,
      name: record?.template_name_fa,
      showLogo: record?.logo?.logo_show,
      logoSize: record?.logo?.size,
      showBusinessName: record?.invoice_title?.title_show,
      titleLevel: record?.invoice_title?.title_level,
      slogan: record?.slogan?.slogan_show,
      address: record?.address?.address_list,
      phone: record?.mobile?.mobile_list,
      showQr: record?.qr_code?.qr_show,
      qrValue: record?.qr_code?.qr_data,
      qrMessage: record?.qr_code?.qr_message,
      appStore: record?.qr_code?.appstore_show,
      googlePlay: record?.qr_code?.playstore_show,
      notes: record?.note?.note_show,
      notesMessage: record?.note?.note_data,
      ticket: record?.ticket_qr_code?.qr_show,
      ticketMessage: record?.ticket_note?.note_data,
    });
    setShowLogo(record?.logo?.logo_show);
    setLogoSize(record?.logo?.size);
    setSlogan(record?.slogan?.slogan_show);
    setTitleShow(record?.invoice_title?.title_show);
    setQrcode({
      showQr: record?.qr_code?.qr_show,
      qrMessage: record?.qr_code?.qr_message,
      qrValue: record?.qr_code?.qr_data,
    });
    setAppStore(record?.qr_code?.appstore_show);
    setGooglePlay(record?.qr_code?.playstore_show);
    setNotes({
      notes: record?.note?.note_show,
      notesMessage: record?.note?.note_data,
    });
    setTicket({
      ticket: record?.ticket_qr_code?.qr_show,
      ticketMessage: record?.ticket_note?.note_data,
    });
    setTitleLevel(record?.invoice_title?.title_level);
    setAddress(record?.address?.address_list);
    setPhone(record?.mobile?.mobile_list);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleEditPosDesignInvoice = async (value) =>
    await axiosInstance.put(`${props?.baseUrl}${props?.record?.id}/`, value);

  const {
    mutate: mutateEditDesignInvoice,
    isLoading,
    reset,
  } = useMutation(handleEditPosDesignInvoice, {
    onSuccess: (values) => {
      setVisible(false);
      updateMessage(values?.data?.template_name_fa);
      queryClient.invalidateQueries(props?.baseUrl);
      // queryClient.invalidateQueries(`${props?.baseUrl}user_setting/`);
      queryClient.invalidateQueries(`${props?.baseUrl}get_default_setting/`);
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const onFinish = (values) => {
    //
    form
      .validateFields()
      .then(async (values) => {
        const allData = {
          invoice_type: props?.record?.invoice_type,
          default_setting: values?.defaultSetting,
          template_name_fa: values?.name,
          qr_code: {
            font: {
              font_size: 10,
              font_color: '#4bc6b3',
              font_family: 'B Nazanin',
              font_weight: 'Bold',
            },
            qr_data: values.qrValue,
            qr_show: values.showQr,
            position: {
              x_pos: 12,
              y_pos: 14,
            },
            qr_message: values.qrMessage,
            appstore_show: values.appStore,
            playstore_show: values.googlePlay,
          },
          note: {
            font: {
              font_size: 10,
              font_color: '#4bc6b2',
              font_family: 'B Nazanin',
              font_weight: 'Bold',
            },
            position: {
              x_pos: 12,
              y_pos: 14,
            },
            note_data: values.notesMessage,
            note_show: values.notes,
          },
          address: {
            font: {
              font_size: 10,
              font_color: '#4bc6b2',
              font_family: 'B Nazanin',
              font_weight: 'Bold',
            },
            position: {
              x_pos: 12,
              y_pos: 14,
            },
            address_list: values.address,
          },
          slogan: {
            font: {
              font_size: 10,
              font_color: '#4bc6b2',
              font_family: 'B Nazanin',
              font_weight: 'Bold',
            },
            position: {
              x_pos: 12,
              y_pos: 14,
            },
            slogan_show: values.slogan,
          },
          logo: {
            size: values.logoSize,
            position: {
              x_pos: 5,
              y_pos: 6,
            },
            logo_show: values.showLogo,
          },
          mobile: {
            font: {
              font_size: 10,
              font_color: '#4bc6b2',
              font_family: 'B Nazanin',
              font_weight: 'Bold',
            },
            position: {
              x_pos: 12,
              y_pos: 14,
            },
            mobile_list: values.phone,
          },
          invoice_title: {
            font: {
              font_size: 10,
              font_color: '#4bc6b2',
              font_family: 'B Nazanin',
              font_weight: 'Bold',
            },
            fa_name: 'فاکتور فروش',
            position: {
              x_pos: 12,
              y_pos: 14,
            },
            title_show: values.showBusinessName,
            title_level: values.titleLevel,
          },
          company_name: {
            font: {
              font_size: 10,
              font_color: '#4bc6b2',
              font_family: 'B Nazanin',
              font_weight: 'Bold',
            },
            position: {
              x_pos: 12,
              y_pos: 14,
            },
            size_level: values.titleLevel,
            company_show: values.showBusinessName,
          },
          ticket_qr_code: {
            font: {
              font_size: 10,
              font_color: '#4bc6b3',
              font_family: 'B Nazanin',
              font_weight: 'Bold',
            },
            qr_show: values.ticket,
            position: {
              x_pos: 12,
              y_pos: 14,
            },
          },
          ticket_note: {
            font: {
              font_size: 10,
              font_color: '#4bc6b2',
              font_family: 'B Nazanin',
              font_weight: 'Bold',
            },
            position: {
              x_pos: 12,
              y_pos: 14,
            },
            note_data: values.ticketMessage,
            note_show: true,
          },
        };

        mutateEditDesignInvoice(allData);
      })
      .catch((info) => {});
  };

  const onChangeShowLogo = () => {
    setShowLogo(!showLogo);
  };
  const onLogoSizeChange = (value) => {
    setLogoSize(value);
  };

  const onChangeTitleShow = () => {
    setTitleShow(!titleShow);
  };
  const onChangeTitleLevel = async () => {
    const row = await form.getFieldsValue();
    setTitleLevel(row.titleLevel);
  };

  const onChangePhone = async () => {
    const row = await form.getFieldsValue();
    setPhone(row.phone);
  };

  const onChangeSlogan = () => {
    setSlogan(!slogan);
  };

  const onChangeQrData = async () => {
    const row = await form.getFieldsValue();
    setQrcode((prev) => {
      return { ...prev, qrValue: row.qrValue };
    });
  };

  const onChangeQrcode = () => {
    setQrcode((prev) => {
      return { ...prev, showQr: !showQr };
    });
  };

  const onChangeQrMessage = async () => {
    const row = await form.getFieldsValue();
    setQrcode((prev) => {
      return { ...prev, qrMessage: row.qrMessage };
    });
  };

  const onChangeNotes = () => {
    setNotes((prev) => {
      return { ...prev, notes: !notes };
    });
  };

  const onChangeNotesMessage = async () => {
    const row = await form.getFieldsValue();
    setNotes((prev) => {
      return { ...prev, notesMessage: row.notesMessage };
    });
  };
  const onChangeTicket = () => {
    setTicket((prev) => {
      return { ...prev, ticket: !ticket };
    });
  };

  const onChangeTicketMessage = async () => {
    const row = await form.getFieldsValue();
    setTicket((prev) => {
      return { ...prev, ticketMessage: row.ticketMessage };
    });
  };

  const onChangeGooglePlay = () => {
    setGooglePlay(!googlePlay);
  };
  const onChangeAppStore = () => {
    setAppStore(!appStore);
  };

  const onChangeAddress = async (value) => {
    const row = await form.getFieldsValue();
    setAddress(row.address);
  };

  const edit = {
    showLogo,
    logoSize,
    titleShow,
    titleLevel,
    phone,
    slogan,
    qrMessage,
    showQr,
    qrValue,
    notesMessage,
    notes,
    ticket,
    ticketMessage,
    googlePlay,
    appStore,
    address,
  };

  const treeData = data?.address?.address_list?.map((item, index) => {
    const data = {
      value: index + 1,
      title: item?.fa_name,
      // title:
      //   i18n.language === "en"
      //     ? item?.en_name
      //     : i18n.language === "fa"
      //     ? item?.fa_name
      //     : item?.ps_name,
    };
    return data;
  });

  const phoneData = data?.mobile?.mobile_list?.map((item, index) => {
    const data = { value: index + 1, title: item };
    return data;
  });

  const handleAfterClose = (visible) => {
    if (!visible) {
      form.resetFields();
      reset();
    }
  };

  return (
    <div>
      <div onClick={showDrawer}>{t('Sales.Customers.Table.Edit')}</div>
      <Drawer
        maskClosable={false}
        mask={true}
        title={t('Custom_form_styles.Edit_design')}
        height='100vh'
        onClose={onClose}
        open={visible}
        afterOpenChange={handleAfterClose}
        placement='top'
        styles={{ paddingBottom: 10 }}
        footer={
          <div className='textAlign__end'>
            <Space>
              <CancelButton onClick={onClose} />
              <SaveButton onClick={onFinish} loading={isLoading} />
            </Space>
          </div>
        }
      >
        <Form
          layout='vertical'
          hideRequiredMark
          form={form}
          // onFinish={onFinish}
          initialValues={{ logoSize: 80 }}
        >
          <Row>
            <Col span={12}>
              <Row>
                <Col span={15}>
                  <Form.Item
                    name='name'
                    style={styles.marginBottom}
                    label={
                      <span>
                        {t('Form.Name')}
                        <span className='star'>*</span>
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: `${t('Form.Name_required')}`,
                      },
                    ]}
                  >
                    <Input className='num' />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name='defaultSetting'
                    style={styles.margin}
                    valuePropName='checked'
                  >
                    <Checkbox style={styles.margin}>
                      {t('Company.Default_template_for_pos')}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  {' '}
                  <Form.Item
                    name='showLogo'
                    style={styles.margin}
                    valuePropName='checked'
                  >
                    <Checkbox
                      onChange={onChangeShowLogo}
                      style={styles.margin}
                      // checked={showLogo}
                    >
                      {t('Company.Logo')}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col span={15}>
                  <Form.Item
                    name='logoSize'
                    style={styles.marginBottom}
                    // className="edit_fields_pdf"
                    label={t('Custom_form_styles.Logo_size')}
                  >
                    <InputNumber
                      onChange={onLogoSizeChange}
                      className='num'
                      min={30}
                      max={170}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  {' '}
                  <Form.Item
                    name='showBusinessName'
                    style={styles.margin}
                    valuePropName='checked'
                  >
                    <Checkbox
                      onChange={onChangeTitleShow}
                      style={styles.margin}
                      // checked={titleShow}
                    >
                      {t('Custom_form_styles.Business_name')}
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Col span={15}>
                  <Form.Item
                    name='titleLevel'
                    style={styles.marginBottom}
                    // className="edit_fields_pdf"
                    label={t('Custom_form_styles.Business_name_font_size')}
                  >
                    <InputNumber
                      onChange={onChangeTitleLevel}
                      className='num'
                      min={1}
                      max={5}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  {' '}
                  <Form.Item
                    name='slogan'
                    style={styles.margin}
                    valuePropName='checked'
                  >
                    <Checkbox
                      onChange={onChangeSlogan}
                      style={styles.margin}
                      // checked={emailShow}
                    >
                      {t('Company.Slogan')}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col span={15}>
                  <Form.Item
                    name='address'
                    style={styles.marginBottom}
                    // className="edit_fields_pdf"
                    label={t('Form.Address')}
                  >
                    <TreeSelect
                      treeData={treeData}
                      treeCheckable
                      onChange={onChangeAddress}
                      className='num'
                      showArrow
                    />
                  </Form.Item>
                </Col>
                <Col span={15}>
                  <Form.Item
                    name='phone'
                    style={styles.marginBottom}
                    // className="edit_fields_pdf"
                    label={t('Form.Phone')}
                  >
                    <TreeSelect
                      treeData={phoneData}
                      treeCheckable
                      onChange={onChangePhone}
                      className='num'
                      showArrow
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    name='showQr'
                    style={styles.margin}
                    valuePropName='checked'
                  >
                    <Checkbox
                      onChange={onChangeQrcode}
                      style={styles.margin}
                      // checked={showQr}
                    >
                      {t('Custom_form_styles.Qrcode_data')}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    name='qrValue'
                    style={styles.marginBottom}
                    className='edit_fields_pdf'
                  >
                    <Input onChange={onChangeQrData} />
                  </Form.Item>
                </Col>

                <Col span={16}>
                  {' '}
                  <Form.Item
                    name='qrMessage'
                    label={t('Custom_form_styles.Qrcode_message')}
                    className='edit_fields_pdf'
                  >
                    <Input.TextArea
                      autoSize={{ minRows: 3, maxRows: 6 }}
                      onChange={onChangeQrMessage}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name='googlePlay'
                    style={styles.margin}
                    valuePropName='checked'
                  >
                    <Checkbox
                      onChange={onChangeGooglePlay}
                      style={styles.margin}
                      // checked={googlePlay}
                    >
                      {t('Custom_form_styles.Google_play')}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name='appStore'
                    style={styles.margin}
                    valuePropName='checked'
                  >
                    <Checkbox
                      onChange={onChangeAppStore}
                      style={styles.margin}
                      // checked={appStore}
                    >
                      {t('Custom_form_styles.App_store')}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name='notes'
                    style={styles.margin}
                    valuePropName='checked'
                  >
                    <Checkbox
                      onChange={onChangeNotes}
                      style={styles.margin}
                      // checked={notes}
                    >
                      {t('Form.Notes')}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col span={16}>
                  {' '}
                  <Form.Item name='notesMessage' className='edit_fields_pdf'>
                    <Input.TextArea
                      autoSize={{ minRows: 3, maxRows: 6 }}
                      onChange={onChangeNotesMessage}
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    name='ticket'
                    style={styles.margin}
                    valuePropName='checked'
                  >
                    <Checkbox
                      onChange={onChangeTicket}
                      style={styles.margin}
                      // checked={notes}
                    >
                      {t('Custom_form_styles.Ticket')}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col span={16}>
                  {' '}
                  <Form.Item
                    name='ticketMessage'
                    className='edit_fields_pdf'
                    extra={t('Custom_form_styles.Ticket_message')}
                  >
                    <Input.TextArea
                      autoSize={{ minRows: 3, maxRows: 6 }}
                      onChange={onChangeTicketMessage}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Divider />
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Content1 edit={edit} data={data} />
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};
const styles = {
  content: (background) => ({ background: `${background}` }),
  color: (background) => ({
    background: `${background}`,
    width: '55px',
    cursor: 'pointer',
  }),
  margin: { marginBottom: '0px' },
  marginBottom: { marginBottom: '3px' },
  custom: { marginBottom: '10px' },
  radioStyle: {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  },
};

export default EditPOSDesignInvoice;
