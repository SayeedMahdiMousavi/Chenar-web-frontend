import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../ApiBaseUrl';
import { SketchPicker } from 'react-color';
import Content1 from './POSInvoice/Content';
import Design from './POSInvoice/Design';
import Email from './POSInvoice/Email';
import { useQuery } from 'react-query';
import {
  BankTwoTone,
  PlusCircleOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  Radio,
  Checkbox,
  Typography,
  Space,
  Divider,
  Dropdown,
  Collapse,
  InputNumber,
  TreeSelect,
} from 'antd';
import { useGetCompanyInfo } from '../../Hooks';
import { CancelButton, SaveButton } from '../../components';
import { addMessage, manageErrors } from '../../Functions';
// import { useDatabase } from "@nozbe/watermelondb/hooks";

const { Panel } = Collapse;
const { Option } = Select;
const { Paragraph } = Typography;
const POSInvoice = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [editLogo, setEditLogo] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [logoSize, setLogoSize] = useState(80);
  const [font, setFont] = useState(false);
  const [editPrintSetting, setEditPrintSetting] = useState(false);

  const [size, setSize] = useState(55);
  const [fontSize, setFontSize] = useState('10px');
  const [fontFamily, setFontFamily] = useState('initialState');
  const [visible, setVisible] = useState(false);

  const [current, setCurrent] = useState('content');
  const [details, setDetails] = useState('full');
  const [collaps, setCollaps] = useState('1');

  const [background, setBackground] = useState('#dcd9eb');

  // const isTablet = useMediaQuery("(max-width:768px)");
  // const isMobile = useMediaQuery("(max-width:425px)");

  const { data } = useGetCompanyInfo();
  //
  const posSettings = useQuery(props?.baseUrl, async ({ queryKey }) => {
    const { data } = await axiosInstance.get(`${queryKey?.[0]}?page_size=20`);

    return data;
  });

  const [
    {
      standardSubject,
      standardGreeting,
      standardEmailTo,
      standardCustomerGreeting,
      standardCustomerMessage,
    },
    setStandard,
  ] = useState({
    standardSubject: 'ewerertyut',
    standardGreeting: true,
    standardEmailTo: 'Dear',
    standardCustomerGreeting: 'first name last name',
    standardCustomerMessage:
      "Here's your invoice! We appreciate your prompt payment. Thanks for your business! ",
  });
  const [
    {
      reminderSubject,
      reminderGreeting,
      reminderEmailTo,
      reminderCustomerGreeting,
      reminderCustomerMessage,
    },
    setReminder,
  ] = useState({
    reminderSubject: 'ewerertyut',
    reminderGreeting: true,
    reminderEmailTo: 'Dear',
    reminderCustomerGreeting: 'first name last name',
    reminderCustomerMessage:
      "Here's your invoice! We appreciate your prompt payment. Thanks for your business! book ",
  });
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

  const onClearInvoiceType = () => {
    form.resetFields();
    setShowLogo(false);
    setLogoSize(80);
    setSlogan({
      slogan: true,
    });
    setTitleShow(true);
    setQrcode({
      showQr: true,
      qrMessage: '',
      qrValue: '',
    });
    setAppStore(true);
    setGooglePlay(true);
    setNotes({
      notes: true,
      notesMessage: '',
    });
    setTicket({
      ticket: true,
      ticketMessage: '',
    });
    setTitleLevel(4);
    setAddress([0]);
    setPhone([0]);
  };

  const onChangeInvoiceType = (value) => {
    const invoice = posSettings?.data?.results?.find(
      (item) => item.id === value,
    );

    if (invoice) {
      form.setFieldsValue({
        defaultSetting: invoice?.default_setting,
        showLogo: invoice?.logo?.logo_show,
        logoSize: invoice?.logo?.size,
        showBusinessName: invoice?.invoice_title?.title_show,
        titleLevel: invoice?.invoice_title?.title_level,
        slogan: invoice?.slogan?.slogan_show,
        address: invoice?.address?.address_list,
        phone: invoice?.mobile?.mobile_list,
        showQr: invoice?.qr_code?.qr_show,
        qrValue: invoice?.qr_code?.qr_data,
        qrMessage: invoice?.qr_code?.qr_message,
        appStore: invoice?.qr_code?.appstore_show,
        googlePlay: invoice?.qr_code?.playstore_show,
        notes: invoice?.note?.note_show,
        notesMessage: invoice?.note?.note_data,
        ticket: invoice?.ticket_qr_code?.qr_show,
        ticketMessage: invoice?.ticket_note?.note_data,
      });
      setShowLogo(invoice?.logo?.logo_show);
      setLogoSize(invoice?.logo?.size);
      setSlogan(invoice?.slogan?.slogan_show);
      setTitleShow(invoice?.invoice_title?.title_show);
      setQrcode((prev) => {
        return {
          showQr: invoice?.qr_code?.qr_show,
          qrMessage: invoice?.qr_code?.qr_message,
          qrValue: invoice?.qr_code?.qr_data,
        };
      });
      setAppStore(invoice?.qr_code?.appstore_show);
      setGooglePlay(invoice?.qr_code?.playstore_show);
      setNotes((prev) => {
        return {
          notes: invoice?.note?.note_show,
          notesMessage: invoice?.note?.note_data,
        };
      });
      setTicket((prev) => {
        return {
          ticket: invoice?.ticket_qr_code?.qr_show,
          ticketMessage: invoice?.ticket_note?.note_data,
        };
      });
      setTitleLevel(invoice?.invoice_title?.title_level);
      setAddress(invoice?.address?.address_list);
      setPhone(invoice?.mobile?.mobile_list);
    }
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
    // form.resetFields();
  };

  const handleAddInvoiceSettings = async (value) =>
    await axiosInstance.post(`${props?.baseUrl}`, value);

  const {
    mutate: mutateAddInvoiceSettings,
    isLoading,
    reset,
  } = useMutation(handleAddInvoiceSettings, {
    onSuccess: (values) => {
      setVisible(false);
      addMessage(values?.data?.template_name_fa);
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
    form.validateFields().then(async (values) => {
      //

      const allData = {
        invoice_type: 'sales_pos',
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
          fa_name: 'بل فروش',
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

      mutateAddInvoiceSettings(allData);
    });
  };

  const handleAfterClose = (visible) => {
    if (!visible) {
      form.resetFields();
      reset();
      setShowLogo(false);
      setLogoSize(80);
      setSlogan({
        slogan: true,
      });
      setTitleShow(true);
      setQrcode({
        showQr: true,
        qrMessage: '',
        qrValue: '',
      });
      setAppStore(true);
      setGooglePlay(true);
      setNotes({
        notes: true,
        notesMessage: '',
      });
      setTicket({
        ticket: true,
        ticketMessage: '',
      });
      setTitleLevel(4);
      setAddress([0]);
      setPhone([0]);
    } else {
      setEditPrintSetting(true);
    }
  };

  //font
  const onFontChange = () => {
    setEditPrintSetting(false);
    setEditLogo(false);
    setFont(true);
  };
  const onChangeFontSize = (value) => {
    setFontSize(value);
  };
  const onChangeFontFamily = (value) => {
    setFontFamily(value);
  };
  //logo
  const onEditLogoClick = () => {
    setFont(false);
    setEditPrintSetting(false);
    setEditLogo(true);
  };
  const onChangeShowLogo = () => {
    setShowLogo(!showLogo);
  };
  const onLogoSizeChange = (value) => {
    setLogoSize(value);
  };
  const largeLogo = () => {
    setSize(65);
  };
  const MiddleLogo = () => {
    setSize(55);
  };
  const smallLogo = () => {
    setSize(45);
  };

  const onClickDetails = () => {
    setFont(false);
    setEditPrintSetting(false);
    setEditLogo(false);
    setCurrent('content');
  };
  // //edit content

  const onChangeTitleShow = () => {
    setTitleShow(!titleShow);
  };
  const onChangeTitleLevel = async () => {
    const row = await form.getFieldsValue();
    setTitleLevel(row.titleLevel);
  };

  // const onClickHeader = () => {
  //   setTitle(false);
  //   setFooterEdit(false);
  //   setTableEdit(false);
  //   setHeader(true);
  // };

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
  const onChangeStandardSubject = async () => {
    const row = await form.getFieldsValue();
    setStandard((prev) => {
      return { ...prev, standardSubject: row.standardSubject };
    });
  };
  const onChangeStandardGreeting = async () => {
    // setStandard((prev) => {
    //   return { ...prev, standardGreeting: !standardGreeting };
    // });
  };
  const onChangeStandardCustomerMessage = async () => {
    const row = await form.getFieldsValue();
    setStandard((prev) => {
      return { ...prev, standardCustomerMessage: row.standardCustomerMessage };
    });
  };
  const onChangeStandardEmailTo = async (value) => {
    setStandard((prev) => {
      return { ...prev, standardEmailTo: value };
    });
  };
  const onChangeStandardCustomerGreeting = async (value) => {
    setStandard((prev) => {
      return { ...prev, standardCustomerGreeting: value };
    });
  };

  const onChangeReminderSubject = async () => {
    const row = await form.getFieldsValue();
    setReminder((prev) => {
      return { ...prev, reminderSubject: row.reminderSubject };
    });
  };
  const onChangeReminderGreeting = async () => {
    setReminder((prev) => {
      return { ...prev, reminderGreeting: !reminderGreeting };
    });
  };
  const onChangeReminderCustomerMessage = async () => {
    const row = await form.getFieldsValue();
    setReminder((prev) => {
      return { ...prev, reminderCustomerMessage: row.reminderCustomerMessage };
    });
  };
  const onChangeReminderEmailTo = async (value) => {
    setReminder((prev) => {
      return { ...prev, reminderEmailTo: value };
    });
  };
  const onChangeReminderCustomerGreeting = async (value) => {
    setReminder((prev) => {
      return { ...prev, reminderCustomerGreeting: value };
    });
  };

  const handleChangeComplete = (color) => {
    setBackground(color.hex);
  };
  // const onChangeCurrent = (e) => {
  //   setCurrent(e.target.value);
  // };
  const onClickStandard = (active) => {
    setCollaps(active);
  };

  const onChangeDetails = (e) => {
    setDetails(e.target.value);
  };

  const content = (
    <SketchPicker
      color={background}
      onChangeComplete={handleChangeComplete}
      presetColors={[
        '#D9E3F0',
        '#F47373',
        '#697689',
        '#37D67A',
        '#2CCCE4',
        '#555555',
        '#dce775',
        '#ff8a65',
        '#ba68c8',
      ]}
      triangle='hide'
    />
  );

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

  return (
    <div>
      <div onClick={showDrawer}>{t('Sales.All_sales.Invoice.POS_invoice')}</div>
      <Drawer
        maskClosable={false}
        mask={true}
        title={t('Custom_form_styles.Invoice_header')}
        height='100vh'
        onClose={onClose}
        open={visible}
        afterVisibleChange={handleAfterClose}
        placement='top'
        bodyStyle={{ paddingBottom: 10 }}
        footer={
          <Row justify='end' align='middle'>
            <Col>
              <Space>
                {/* <Button
              onClick={onClose}
              shape="round"
              style={{ margin: "0  10px" }}
            >
              {t("Custom_form_styles.Preview_pdf")}
            </Button> */}
                <CancelButton onClick={onClose} />
                <SaveButton onClick={onFinish} loading={isLoading} />
              </Space>
            </Col>
          </Row>
        }
      >
        <Form
          layout='vertical'
          hideRequiredMark
          form={form}
          // onFinish={onFinish}
          initialValues={{
            logoSize: 80,
            appStore: true,
            googlePlay: true,
            titleLevel: 4,
            ticket: true,
            slogan: true,
            showQr: true,
            notes: true,
            showBusinessName: true,
          }}
        >
          <Row>
            <Col span={12}>
              <Row align='middle' gutter={[0, 40]}>
                <Col span={24}> </Col>
                {current === 'design' ? (
                  <Col span={24}>
                    {' '}
                    <Row gutter={[0, 40]}>
                      {' '}
                      <Col span={14}>
                        {' '}
                        <Form.Item
                          name='name'
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
                      {editLogo && <Col span={10}></Col>}
                      {editLogo ? (
                        <Col span={24} className='center_pdf'>
                          {/* <Logos /> */}

                          <Row>
                            <Col span={24}>
                              <Space size='large' className='show_logo_pdf'>
                                <Button shape='circle' onClick={smallLogo}>
                                  {t('Custom_form_styles.S')}
                                </Button>
                                <Button shape='circle' onClick={MiddleLogo}>
                                  {t('Custom_form_styles.M')}
                                </Button>
                                <Button shape='circle' onClick={largeLogo}>
                                  {t('Custom_form_styles.L')}
                                </Button>
                              </Space>
                            </Col>
                          </Row>
                        </Col>
                      ) : (
                        <Col
                          span={24}
                          className='center_pdf'
                          onClick={onEditLogoClick}
                        >
                          <a href='#'>
                            <PlusCircleOutlined
                              className='plus_pdf'
                              rotate={90}
                            />
                          </a>{' '}
                          <div className='show_logo_pdf'>
                            {t('Custom_form_styles.Logo_edit')}
                          </div>
                        </Col>
                      )}
                      <Col span={24}>
                        <Dropdown overlay={content}>
                          <Input
                            style={styles.color(background)}
                            size='small'
                            className='colorPicker_input'
                          />
                        </Dropdown>
                        <span className='show_logo_pdf'> {background}</span>
                      </Col>
                      {font ? (
                        <Col span={24}>
                          <Row gutter={20}>
                            <Col span={9}>
                              {' '}
                              <Form.Item
                                name='fontFamily'
                                label={t('Custom_form_styles.Font_family')}
                                style={styles.margin}
                              >
                                <Select onChange={onChangeFontFamily}>
                                  <Option value='Helvetica'>
                                    {' '}
                                    {t('Custom_form_styles.Helvetica')}
                                  </Option>
                                  <Option value='Arial'>
                                    {t('Custom_form_styles.Arial')}
                                  </Option>
                                  <Option value='courier New'>
                                    {' '}
                                    {t('Custom_form_styles.Courier')}
                                  </Option>
                                  <Option value='Times New Roman'>
                                    {t('Custom_form_styles.Times_new_roman')}
                                  </Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={5}>
                              {' '}
                              <Form.Item
                                name='fontSize'
                                label={t('Custom_form_styles.Font_size')}
                                style={styles.margin}
                              >
                                <Select onChange={onChangeFontSize}>
                                  <Option value='9px'>9px</Option>
                                  <Option value='10px'>10px</Option>
                                  <Option value='12px'>11px</Option>
                                </Select>
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                      ) : (
                        <Col
                          span={24}
                          className='center_pdf'
                          onClick={onFontChange}
                        >
                          <div className='font_pdf'>
                            {' '}
                            {t('Custom_form_styles.Ff')}
                          </div>{' '}
                          <div className='show_logo_pdf'>
                            {' '}
                            {t('Custom_form_styles.Select_font')}
                          </div>
                        </Col>
                      )}
                      <Col
                        span={24}
                        className='center_pdf'
                        onClick={onClickDetails}
                      >
                        <BankTwoTone className='bank_pdf' />
                        <div className='show_logo_pdf'>
                          {' '}
                          {t('Custom_form_styles.Eft_details')}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                ) : current === 'content' ? (
                  <div className='num'>
                    <Row>
                      <Col span={24}></Col>
                      <Col span={15}>
                        <Form.Item
                          name='invoiceType'
                          label={t('Custom_form_styles.Invoice_template')}
                          style={styles.margin}
                        >
                          <Select
                            showSearch
                            showArrow
                            allowClear
                            // optionLabelProp="label"
                            onChange={onChangeInvoiceType}
                            onClear={onClearInvoiceType}
                            optionFilterProp='label'
                            // popupClassName="z_index"
                            dropdownRender={(menu) => <div>{menu}</div>}
                          >
                            {posSettings?.data?.results?.map((item) => (
                              <Select.Option
                                value={item?.id}
                                key={item?.id}
                                label={
                                  item?.template_name_fa
                                  // i18n.language === "en"
                                  //   ? item?.template_name_en
                                  //   : i18n.language === "fa"
                                  //   ? item?.template_name_fa
                                  //   : item?.template_name_ps
                                }
                              >
                                {item?.template_name_fa}
                                {/* {i18n.language === "en"
                                  ? item?.template_name_en
                                  : i18n.language === "fa"
                                  ? item?.template_name_fa
                                  : item?.template_name_ps} */}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
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
                          <Checkbox
                            style={styles.margin}
                            // checked={showLogo}
                          >
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
                          label={t(
                            'Custom_form_styles.Business_name_font_size',
                          )}
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

                      {/* {consoleLog(defaultPosSettings?.data)} */}
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
                        <Form.Item
                          name='notesMessage'
                          className='edit_fields_pdf'
                        >
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
                  </div>
                ) : current === 'emails' ? (
                  <Row className='num'>
                    <Col span={23}>
                      <Collapse
                        ghost={true}
                        bordered={false}
                        // accordion={true}
                        // defaultActiveKey={["1"]}
                        activeKey={['1']}
                        expandIcon={({ isActive }) => (
                          <CaretRightOutlined rotate={isActive ? 90 : 0} />
                        )}
                      >
                        <Panel
                          header='How your invoice appears in emails'
                          key='1'
                        >
                          <Radio.Group
                            value={details}
                            defaultValue='content'
                            onChange={onChangeDetails}
                            buttonStyle='solid'
                          >
                            <Radio value='full' style={styles.radioStyle}>
                              Full details
                            </Radio>
                            <Radio value='summary' style={styles.radioStyle}>
                              Summarized details
                            </Radio>
                          </Radio.Group>
                          <Form.Item name='attachPdf' style={styles.margin}>
                            <Checkbox
                              // onChange={onChangeAttachPdf}
                              style={styles.margin}
                              // checked={attachPdf}
                            >
                              PDF Attached
                            </Checkbox>
                          </Form.Item>
                        </Panel>
                      </Collapse>
                      <Collapse
                        ghost={true}
                        bordered={false}
                        accordion={true}
                        defaultActiveKey={['1']}
                        onChange={onClickStandard}
                        expandIcon={({ isActive }) => (
                          <CaretRightOutlined rotate={isActive ? 90 : 0} />
                        )}
                      >
                        <Panel header='Standard email' key='1'>
                          <Paragraph>
                            Edit the email your customers get with every invoice
                          </Paragraph>
                          <Row gutter={10}>
                            <Col span={24}>
                              {' '}
                              <Form.Item name='standardSubject' label='Subject'>
                                <Input onChange={onChangeStandardSubject} />
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              {' '}
                              <Form.Item
                                name='standardGreeting'
                                style={styles.margin}
                              >
                                <Checkbox
                                  onChange={onChangeStandardGreeting}
                                  style={styles.margin}
                                  // checked={standardGreeting}
                                >
                                  Use greeting
                                </Checkbox>
                              </Form.Item>
                            </Col>
                            <Col span={7}>
                              <Form.Item
                                name='standardEmailTo'
                                style={styles.margin}
                              >
                                <Select onChange={onChangeStandardEmailTo}>
                                  <Option value=''>&#60;Blank&#62;</Option>
                                  <Option value='To'>To</Option>
                                  <Option value='Dear'>Dear</Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={9}>
                              <Form.Item
                                name='standardCustomerGreeting'
                                style={styles.marginBottom}
                              >
                                <Select
                                  onChange={onChangeStandardCustomerGreeting}
                                >
                                  <Option value='first name last name'>
                                    &#91; first,last&#93;
                                  </Option>
                                  <Option value='first name'>
                                    &#91;first&#93;
                                  </Option>
                                  <Option value='Company name'>
                                    &#91; CompanyName&#93;
                                  </Option>
                                  <Option value='Display name'>
                                    &#91; DisplayName&#93;
                                  </Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={24}>
                              {' '}
                              <Form.Item
                                name='standardCustomerMessage'
                                label='Message to customer'
                              >
                                <Input.TextArea
                                  autoSize={{ minRows: 5, maxRows: 6 }}
                                  onChange={onChangeStandardCustomerMessage}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Panel>
                        <Panel header='Reminder email' key='2'>
                          <Paragraph>
                            Edit the reminder email your customers receive for
                            invoices
                          </Paragraph>
                          <Row gutter={10}>
                            <Col span={24}>
                              {' '}
                              <Form.Item name='reminderSubject' label='Subject'>
                                <Input onChange={onChangeReminderSubject} />
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              {' '}
                              <Form.Item
                                name='reminderGreeting'
                                style={styles.margin}
                              >
                                <Checkbox
                                  onChange={onChangeReminderGreeting}
                                  style={styles.margin}
                                  // checked={reminderGreeting}
                                >
                                  Use greeting
                                </Checkbox>
                              </Form.Item>
                            </Col>
                            <Col span={7}>
                              <Form.Item
                                name='reminderEmailTo'
                                style={styles.margin}
                              >
                                <Select onChange={onChangeReminderEmailTo}>
                                  <Option value=''>&#60;Blank&#62;</Option>
                                  <Option value='To'>To</Option>
                                  <Option value='Dear'>Dear</Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={9}>
                              <Form.Item
                                name='reminderCustomerGreeting'
                                style={styles.marginBottom}
                              >
                                <Select
                                  onChange={onChangeReminderCustomerGreeting}
                                >
                                  <Option value='first name last name'>
                                    &#91; first,last&#93;
                                  </Option>
                                  <Option value='first name'>
                                    &#91;first&#93;
                                  </Option>
                                  <Option value='Company name'>
                                    &#91; CompanyName&#93;
                                  </Option>
                                  <Option value='Display name'>
                                    &#91; DisplayName&#93;
                                  </Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={24}>
                              {' '}
                              <Form.Item
                                name='reminderCustomerMessage'
                                label='Message to customer'
                              >
                                <Input.TextArea
                                  autoSize={{ minRows: 5, maxRows: 6 }}
                                  onChange={onChangeReminderCustomerMessage}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Panel>
                      </Collapse>
                    </Col>
                  </Row>
                ) : (
                  <div></div>
                )}
              </Row>
            </Col>
            <Col span={12}>
              {current === 'design' ? (
                <Design />
              ) : current === 'content' ? (
                <Content1 edit={edit} data={data} />
              ) : current === 'emails' ? (
                <Email />
              ) : (
                <div></div>
              )}
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
  margin: { marginBottom: '8px' },
  marginBottom: { marginBottom: '8px' },
  custom: { marginBottom: '10px' },
  radioStyle: {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  },
};

export default POSInvoice;
