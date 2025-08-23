import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SketchPicker } from 'react-color';
// import ImgCrop from "antd-img-crop";
import Print from './Estimate/Print';
import Email from './Estimate/Email';
import {
  // Layout,
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  // Avatar,
  Radio,
  // Popover,
  Checkbox,
  // message,
  Typography,
  Space,
  AutoComplete,
  Divider,
  Dropdown,
  Collapse,
} from 'antd';

import { connect } from 'react-redux';
import Design from './Estimate/Design';
import {
  BankTwoTone,
  PlusCircleOutlined,
  // UploadOutlined,
  // LoadingOutlined,
  // PlusOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
import Logos from './Estimate/Logos';
import Content from './Estimate/Content';
const { Panel } = Collapse;
const { Option } = Select;
const { Text, Paragraph } = Typography;
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

// function beforeUpload(file) {
//   const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
//   if (!isJpgOrPng) {
//     message.error("You can only upload JPG/PNG file!");
//   }
//   const isLt2M = file.size / 1024 / 1024 < 2;
//   if (!isLt2M) {
//     message.error("Image must smaller than 2MB!");
//   }
//   return isJpgOrPng && isLt2M;
// }
const Estimate = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [editLogo, setEditLogo] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [font, setFont] = useState(false);
  const [editPrintSetting, setEditPrintSetting] = useState(false);
  const [top, setTop] = useState('20');
  const [right, setRight] = useState('20');
  const [bottom, setBottom] = useState('20');
  const [left, setLeft] = useState('20');
  const [fitWindow, setFitWindow] = useState(false);
  const [size, setSize] = useState(55);
  const [fontSize, setFontSize] = useState('10px');
  const [fontFamily, setFontFamily] = useState('initialState');
  const [visible, setVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState('content');
  const [details, setDetails] = useState('full');
  const [collaps, setCollaps] = useState('1');
  const [background, setBackground] = useState('#dcd9eb');
  const [title, setTitle] = useState(false);
  const [{ titleShow, titleContent }, setTitleShow] = useState({
    titleShow: true,
    titleContent: 'Microcis',
  });
  const [{ phoneShow, phone }, setPhoneShow] = useState({
    phoneShow: true,
    phone: '+93 799773529',
  });
  const [{ emailShow, email }, setEmailShow] = useState({
    emailShow: true,
    email: 'mony@gmail.com',
  });
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);
  const [{ websiteShow, website }, setWebsiteShow] = useState({
    websiteShow: false,
    website: 'www.google.com',
  });
  const [{ companyNoShow, companyNo }, setCompanyNoShow] = useState({
    CompanyNoShow: false,
    companyNo: '',
  });
  const [{ formNames, invoice, taxInvoice }, setFormInvoice] = useState({
    formNames: true,
    invoice: '',
    taxInvoice: 'tax invoice',
  });
  const [{ formNumber, formCustomNumber }, setFormNumber] = useState({
    formNumber: true,
    formCustomNumber: false,
  });
  const [
    { custom1Show, custom2Show, custom3Show, custom1, custom2, custom3 },
    setCustom,
  ] = useState({
    custom1Show: false,
    custom2Show: false,
    custom3Show: false,
    custom1: false,
    custom2: false,
    custom3: false,
  });
  const [{ billingAddress, shipping, terms, dueDate, customerNo }, setAddress] =
    useState({
      billingAddress: true,
      shipping: false,
      terms: true,
      dueDate: true,
      customerNo: false,
    });

  const [header, setHeader] = useState(false);
  const [table, setTableEdit] = useState(false);
  //table state
  const [showInvoice, setShowInvoice] = useState(false);

  const [
    {
      date,
      productOrService,
      includeDescription,
      category,
      description,
      includeQuantityRate,
      tax,
      quantity,
      rate,
      amount,
      sku,
      showProgress,
    },
    setTable,
  ] = useState({
    date: true,
    productOrService: true,
    includeDescription: false,
    category: false,
    description: true,
    includeQuantityRate: false,
    tax: true,
    quantity: true,
    rate: true,
    amount: true,
    sku: false,
    showProgress: false,
  });
  const [footer, setFooterEdit] = useState(false);
  const [
    {
      discount,
      deposit,
      taxSummary,
      estimateSummary,
      customerMessage,
      paymentDetails,
      footerText,
    },
    setFooter,
  ] = useState({
    discount: false,
    deposit: false,
    taxSummary: true,
    estimateSummary: true,
    customerMessage: 'customer message',
    paymentDetails: 'paymentDetails',
    footerText: 'footerText',
  });
  //email hooks
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
  const [fileList, setFileList] = useState([
    // {
    //   uid: "-1",
    //   name: "image.png",
    //   status: "done",
    //   url:
    //     "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    // },
  ]);
  //drag states
  const [
    {
      deltaPosition,
      titleDrag,
      phoneDrag,
      emailDrag,
      websiteDrag,
      companyDrag,
      taxDrag,
      taxDragLogo,
      billDrag,
      billDragLogo,
      shipDrag,
      shipDragLogo,
      shipDateDrag,
      shipDateDragLogo,
      taxInvoiceDrag,
      taxInvoiceDragLogo,
      custom1Drag,
      custom1DragLogo,
      custom2Drag,
      custom2DragLogo,
      custom3Drag,
      custom3DragLogo,
      table1Drag,
      table2Drag,
      totalDrag,
      estimateDrag,
      paymentDetailsDrag,
      footerDrag,
      logoDrag,
      taxSummaryDrag,
      showInvoiceDrag,
    },
    setDragData,
  ] = useState({
    deltaPosition: { x: 0, y: 6 },
    titleDrag: { x: 0, y: 0 },
    phoneDrag: { x: 0, y: 4 },
    emailDrag: { x: 0, y: 6 },
    websiteDrag: { x: 0, y: 8 },
    companyDrag: { x: 0, y: 10 },
    taxDrag: { x: 0, y: 20 },
    taxDragLogo: { x: 0, y: -20 },
    billDrag: { x: 0, y: 17 },
    billDragLogo: { x: 0, y: -17 },
    shipDrag: { x: 167, y: -100 },
    shipDragLogo: { x: 167, y: -149 },
    shipDateDrag: { x: 334, y: -218 },
    shipDateDragLogo: { x: 334, y: -267 },
    taxInvoiceDrag: { x: 501, y: -336 },
    taxInvoiceDragLogo: { x: 501, y: -386 },
    custom1Drag: { x: 0, y: -320 },
    custom1DragLogo: { x: 0, y: -382 },
    custom2Drag: { x: 167, y: -377 },
    custom2DragLogo: { x: 167, y: -438 },
    custom3Drag: { x: 335, y: -433 },
    custom3DragLogo: { x: 335, y: -494 },
    table1Drag: { x: 0, y: 2 },
    table2Drag: { x: 0, y: -26 },
    totalDrag: { x: 335, y: -20 },
    estimateDrag: { x: 335, y: -18 },
    paymentDetailsDrag: { x: 0, y: -23 },
    footerDrag: { x: 279, y: 0 },
    logoDrag: { x: 600, y: -110 },
    taxSummaryDrag: { x: 0, y: -27 },
    showInvoiceDrag: { x: 0, y: 0 },
  });

  const handleDrag = (e, ui) => {
    setDragData((prev) => {
      return {
        ...prev,
        deltaPosition: {
          x: deltaPosition.x + ui.deltaX,
          y: deltaPosition.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragTitle = (e, ui) => {
    setDragData((prev) => {
      return {
        ...prev,
        titleDrag: {
          x: titleDrag.x + ui.deltaX,
          y: titleDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragPhone = (e, ui) => {
    setDragData((prev) => {
      return {
        ...prev,
        phoneDrag: {
          x: phoneDrag.x + ui.deltaX,
          y: phoneDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragEmail = (e, ui) => {
    setDragData((prev) => {
      return {
        ...prev,
        emailDrag: {
          x: emailDrag.x + ui.deltaX,
          y: emailDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragWebsite = (e, ui) => {
    setDragData((prev) => {
      return {
        ...prev,
        websiteDrag: {
          x: websiteDrag.x + ui.deltaX,
          y: websiteDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragCompany = (e, ui) => {
    setDragData((prev) => {
      return {
        ...prev,
        companyDrag: {
          x: companyDrag.x + ui.deltaX,
          y: companyDrag.y + ui.deltaY,
        },
      };
    });
  };

  const handleDragTax = (e, ui) => {
    setDragData((prev) => {
      return {
        ...prev,
        taxDrag: {
          x: taxDrag.x + ui.deltaX,
          y: taxDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragBill = (e, ui) => {
    setDragData((prev) => {
      return {
        ...prev,
        billDrag: {
          x: billDrag.x + ui.deltaX,
          y: billDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragShip = (e, ui) => {
    setDragData((prev) => {
      return {
        ...prev,
        shipDrag: {
          x: shipDrag.x + ui.deltaX,
          y: shipDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragShipDate = (e, ui) => {
    setDragData((prev) => {
      return {
        ...prev,
        shipDateDrag: {
          x: shipDateDrag.x + ui.deltaX,
          y: shipDateDrag.y + ui.deltaY,
        },
      };
    });
  };

  const handleDragTaxInvoice = (e, ui) => {
    setDragData((prev) => {
      return {
        ...prev,
        taxInvoiceDrag: {
          x: taxInvoiceDrag.x + ui.deltaX,
          y: taxInvoiceDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragCustom1 = (e, ui) => {
    setDragData((prev) => {
      return {
        ...prev,
        custom1Drag: {
          x: custom1Drag.x + ui.deltaX,
          y: custom1Drag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragCustom2 = (e, ui) => {
    setDragData((prev) => {
      return {
        ...prev,
        custom2Drag: {
          x: custom2Drag.x + ui.deltaX,
          y: custom2Drag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragCustom3 = (e, ui) => {
    setDragData((prev) => {
      return {
        ...prev,
        custom3Drag: {
          x: custom3Drag.x + ui.deltaX,
          y: custom3Drag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragTable1 = (e, ui) => {
    setDragData((prev) => {
      return {
        ...prev,
        table1Drag: {
          x: table1Drag.x + ui.deltaX,
          y: table1Drag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragTable2 = (e, ui) => {
    setDragData((prev) => {
      return {
        ...prev,
        table1Drag: {
          x: table2Drag.x + ui.deltaX,
          y: table2Drag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragTotal = (e, ui) => {
    setDragData((prev) => {
      return {
        ...prev,
        totalDrag: {
          x: totalDrag.x + ui.deltaX,
          y: totalDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragEstimate = (e, ui) => {
    setDragData((prev) => {
      return {
        ...prev,
        estimateDrag: {
          x: estimateDrag.x + ui.deltaX,
          y: estimateDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragPaymentDetails = (e, ui) => {
    setDragData((prev) => {
      return {
        ...prev,
        paymentDetailsDrag: {
          x: paymentDetailsDrag.x + ui.deltaX,
          y: paymentDetailsDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragFooter = (e, ui) => {
    setDragData((prev) => {
      return {
        ...prev,
        footerDrag: {
          x: footerDrag.x + ui.deltaX,
          y: footerDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragLogo = (e, ui) => {
    setDragData((prev) => {
      return {
        ...prev,
        logoDrag: {
          x: logoDrag.x + ui.deltaX,
          y: logoDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragTaxSummary = (e, ui) => {
    setDragData((prev) => {
      return {
        ...prev,
        taxSummaryDrag: {
          x: taxSummaryDrag.x + ui.deltaX,
          y: taxSummaryDrag.y + ui.deltaY,
        },
      };
    });
  };
  const handleDragShowInvoice = (e, ui) => {
    setDragData((prev) => {
      return {
        ...prev,
        showInvoiceDrag: {
          x: showInvoiceDrag.x + ui.deltaX,
          y: showInvoiceDrag.y + ui.deltaY,
        },
      };
    });
  };
  const drag = {
    deltaPosition: deltaPosition,
    handleDrag: handleDrag,
    titleDrag: titleDrag,
    handleDragTitle: handleDragTitle,
    handleDragPhone: handleDragPhone,
    phoneDrag: phoneDrag,
    handleDragEmail: handleDragEmail,
    emailDrag: emailDrag,
    handleDragWebsite: handleDragWebsite,
    websiteDrag: websiteDrag,
    handleDragCompany: handleDragCompany,
    companyDrag: companyDrag,
    handleDragTax: handleDragTax,
    taxDrag: taxDrag,
    taxDragLogo: taxDragLogo,
    handleDragBill: handleDragBill,
    billDrag: billDrag,
    billDragLogo: billDragLogo,
    handleDragShip: handleDragShip,
    shipDrag: shipDrag,
    shipDragLogo: shipDragLogo,
    handleDragShipDate: handleDragShipDate,
    shipDateDrag: shipDateDrag,
    shipDateDragLogo: shipDateDragLogo,
    handleDragTaxInvoice: handleDragTaxInvoice,
    taxInvoiceDrag: taxInvoiceDrag,
    taxInvoiceDragLogo: taxInvoiceDragLogo,
    handleDragCustom1: handleDragCustom1,
    handleDragCustom2: handleDragCustom2,
    handleDragCustom3: handleDragCustom3,
    custom1Drag: custom1Drag,
    custom1DragLogo: custom1DragLogo,
    custom2Drag: custom2Drag,
    custom2DragLogo: custom2DragLogo,
    custom3Drag: custom3Drag,
    custom3DragLogo: custom3DragLogo,
    handleDragTable1: handleDragTable1,
    handleDragTable2: handleDragTable2,
    table1Drag: table1Drag,
    table2Drag: table2Drag,
    handleDragTotal: handleDragTotal,
    totalDrag: totalDrag,
    handleDragEstimate: handleDragEstimate,
    estimateDrag: estimateDrag,
    handleDragPaymentDetails: handleDragPaymentDetails,
    paymentDetailsDrag: paymentDetailsDrag,
    handleDragFooter: handleDragFooter,
    footerDrag: footerDrag,
    handleDragLogo: handleDragLogo,
    logoDrag: logoDrag,
    taxSummaryDrag,
    handleDragTaxSummary,
    showInvoiceDrag,
    handleDragShowInvoice,
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
  const onShowLogo = () => {
    setShowLogo(!showLogo);
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
  //edit print settings
  const onChangeEditPrintSetting = () => {
    setEditLogo(false);
    setFont(false);
    setEditPrintSetting(true);
  };
  const onChangeTop = (e) => {
    setTop(e.target.value);
  };
  const onChangeRight = (e) => {
    setRight(e.target.value);
  };
  const onChangeBottom = (e) => {
    setBottom(e.target.value);
  };
  const onChangeLeft = (e) => {
    setLeft(e.target.value);
  };
  const onChangeFitWindow = () => {
    setFitWindow(!fitWindow);
  };
  //Add your EFT details
  const onClickDetails = () => {
    setFont(false);
    setEditPrintSetting(false);
    setEditLogo(false);
    setCurrent('content');
  };
  //edit content
  const onClickTitle = () => {
    setFooterEdit(false);
    setTableEdit(false);
    setHeader(false);
    setTitle(true);
  };
  const onChangeTitleShow = () => {
    setTitleShow((prev) => {
      return { ...prev, titleShow: !titleShow };
    });
  };
  const onChangeTitleContent = async (e) => {
    const row = await form.validateFields();
    setTitleShow((prev) => {
      return { ...prev, titleContent: row.businessName };
    });
  };
  const onClickHeader = () => {
    setTitle(false);
    setFooterEdit(false);
    setTableEdit(false);
    setHeader(true);
  };
  const onChangePhoneShow = () => {
    setPhoneShow((prev) => {
      return { ...prev, phoneShow: !phoneShow };
    });
  };
  const onChangePhone = async () => {
    const row = await form.validateFields();
    setTitleShow((prev) => {
      return { ...prev, phone: row.phone };
    });
  };
  const onChangeEmailShow = () => {
    setEmailShow((prev) => {
      return { ...prev, emailShow: !emailShow };
    });
  };
  const onChangeEmail = async () => {
    const row = await form.validateFields();
    setEmailShow((prev) => {
      return { ...prev, email: row.email };
    });
  };
  //website
  const onWebsiteChange = (value) => {
    if (!value) {
      setAutoCompleteResult([]);
    } else {
      setAutoCompleteResult(
        ['.com', '.org', '.net']?.map((domain) => `${value}${domain}`),
      );
    }
  };
  const websiteOptions = autoCompleteResult?.map((website) => ({
    label: website,
    value: website,
  }));
  const onChangeWebsiteShow = () => {
    setWebsiteShow((prev) => {
      return { ...prev, websiteShow: !websiteShow };
    });
  };
  const onChangeWebsite = async () => {
    const row = await form.validateFields();
    setWebsiteShow((prev) => {
      return { ...prev, website: row.website };
    });
  };
  const onChangeCompanyNoShow = () => {
    setCompanyNoShow((prev) => {
      return { ...prev, companyNoShow: !companyNoShow };
    });
  };
  const onChangeCompanyNo = async () => {
    const row = await form.validateFields();
    setCompanyNoShow((prev) => {
      return { ...prev, companyNo: row.companyNo };
    });
  };

  const onChangeTaxInvoice = async () => {
    const row = await form.validateFields();
    setFormInvoice((prev) => {
      return { ...prev, taxInvoice: row.taxInvoice };
    });
  };
  const onChangeFormNames = async () => {
    setFormInvoice((prev) => {
      return { ...prev, formNames: !formNames };
    });
  };
  const onChangeFormNumber = async () => {
    setFormNumber((prev) => {
      return { ...prev, formNumber: !formNumber };
    });
  };
  const onChangeCustom1Show = () => {
    setCustom((prev) => {
      return { ...prev, custom1Show: !custom1Show };
    });
  };
  const onChangeCustom1 = async () => {
    const row = await form.validateFields();
    setCustom((prev) => {
      return { ...prev, custom1: row.custom1 };
    });
  };
  const onChangeCustom2Show = () => {
    setCustom((prev) => {
      return { ...prev, custom2Show: !custom2Show };
    });
  };
  const onChangeCustom2 = async () => {
    const row = await form.validateFields();
    setCustom((prev) => {
      return { ...prev, custom2: row.custom2 };
    });
  };
  const onChangeCustom3Show = () => {
    setCustom((prev) => {
      return { ...prev, custom3Show: !custom3Show };
    });
  };
  const onChangeCustom3 = async () => {
    const row = await form.validateFields();
    setCustom((prev) => {
      return { ...prev, custom3: row.custom3 };
    });
  };
  const onChangeShipping = () => {
    setAddress((prev) => {
      return { ...prev, shipping: !shipping };
    });
  };
  const onChangeTerms = () => {
    setAddress((prev) => {
      return { ...prev, terms: !terms };
    });
  };
  const onChangeDueDate = () => {
    setAddress((prev) => {
      return { ...prev, dueDate: !dueDate };
    });
  };
  const onChangeCustomerNo = () => {
    setAddress((prev) => {
      return { ...prev, customerNo: !customerNo };
    });
  };
  //table edit functions
  const onClickTable = () => {
    setTitle(false);
    setHeader(false);
    setFooterEdit(false);
    setTableEdit(true);
  };
  const onChangeShowInvoice = () => {
    setShowInvoice(!showInvoice);
  };
  const onChangeDate = () => {
    setTable((prev) => {
      return { ...prev, date: !date };
    });
  };
  const onChangeProductOrService = () => {
    setTable((prev) => {
      return { ...prev, productOrService: !productOrService };
    });
  };
  const onChangeIncludeDescription = () => {
    if (includeDescription) {
      setTable((prev) => {
        return { ...prev, includeDescription: !includeDescription };
      });
    } else {
      setTable((prev) => {
        return { ...prev, description: false };
      });
      setTable((prev) => {
        return { ...prev, includeDescription: !includeDescription };
      });
    }
  };
  const onChangeCategory = () => {
    setTable((prev) => {
      return { ...prev, category: !category };
    });
  };
  const onChangeDescription = () => {
    setTable((prev) => {
      return { ...prev, description: !description };
    });
  };
  const onChangeIncludeQuantityRate = () => {
    if (includeQuantityRate) {
      setTable((prev) => {
        return { ...prev, includeQuantityRate: !includeQuantityRate };
      });
    } else {
      setTable((prev) => {
        return { ...prev, quantity: false };
      });
      setTable((prev) => {
        return { ...prev, rate: false };
      });
      setTable((prev) => {
        return { ...prev, includeQuantityRate: !includeQuantityRate };
      });
    }
  };
  const onChangeTax = () => {
    setTable((prev) => {
      return { ...prev, tax: !tax };
    });
  };
  const onChangeQuantity = () => {
    setTable((prev) => {
      return { ...prev, quantity: !quantity };
    });
  };
  const onChangeRate = () => {
    setTable((prev) => {
      return { ...prev, rate: !rate };
    });
  };
  const onChangeAmount = () => {
    setTable((prev) => {
      return { ...prev, amount: !amount };
    });
  };
  const onChangeSku = () => {
    setTable((prev) => {
      return { ...prev, sku: !sku };
    });
  };
  const onChangeShowProgress = () => {
    setTable((prev) => {
      return { ...prev, showProgress: !showProgress };
    });
  };
  //edit footer of pdf
  const onClickFooter = () => {
    setTitle(false);
    setHeader(false);
    setTableEdit(false);
    setFooterEdit(true);
  };
  const onChangeDiscount = () => {
    setFooter((prev) => {
      return { ...prev, discount: !discount };
    });
  };
  const onChangeDeposit = () => {
    setFooter((prev) => {
      return { ...prev, deposit: !deposit };
    });
  };
  const onChangeTaxSummary = () => {
    setFooter((prev) => {
      return { ...prev, taxSummary: !taxSummary };
    });
  };
  const onChangeEstimateSummary = () => {
    setFooter((prev) => {
      return { ...prev, estimateSummary: !estimateSummary };
    });
  };
  const onChangeCustomerMessage = async () => {
    const row = await form.validateFields();
    setFooter((prev) => {
      return { ...prev, customerMessage: row.customerMessage };
    });
  };
  const onChangePaymentDetails = async () => {
    const row = await form.validateFields();
    setFooter((prev) => {
      return { ...prev, paymentDetails: row.paymentDetails };
    });
  };
  const onChangeFooterText = async () => {
    const row = await form.validateFields();
    setFooter((prev) => {
      return { ...prev, footerText: row.footerText };
    });
  };
  const edit = {
    onClickTitle: onClickTitle,
    titleShow: titleShow,
    titleContent: titleContent,
    onClickHeader: onClickHeader,
    phone: phone,
    phoneShow: phoneShow,
    email: email,
    emailShow: emailShow,
    website: website,
    websiteShow: websiteShow,
    companyNo: companyNo,
    companyNoShow: companyNoShow,
    taxInvoice: taxInvoice,
    formNames: formNames,
    custom1: custom1,
    custom2: custom2,
    custom3: custom3,
    custom1Show: custom1Show,
    custom2Show: custom2Show,
    custom3Show: custom3Show,
    shipping: shipping,
    onClickTable: onClickTable,
    showInvoice: showInvoice,
    date: date,
    productOrService: productOrService,
    includeDescription: includeDescription,
    category: category,
    description: description,
    includeQuantityRate: includeQuantityRate,
    tax: tax,
    quantity: quantity,
    rate: rate,
    amount: amount,
    sku: sku,
    showProgress: showProgress,
    onClickFooter: onClickFooter,
    taxSummary,
    estimateSummary,
    customerMessage,
    paymentDetails,
    footerText,
  };
  //email functions
  const onChangeStandardSubject = async () => {
    const row = await form.validateFields();
    setStandard((prev) => {
      return { ...prev, standardSubject: row.standardSubject };
    });
  };
  const onChangeStandardGreeting = async () => {
    setStandard((prev) => {
      return { ...prev, standardGreeting: !standardGreeting };
    });
  };
  const onChangeStandardCustomerMessage = async () => {
    const row = await form.validateFields();
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
    const row = await form.validateFields();
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
    const row = await form.validateFields();
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
  const emailData = {
    standardSubject,
    standardGreeting,
    standardEmailTo,
    standardCustomerGreeting,
    standardCustomerMessage,
    reminderSubject,
    reminderGreeting,
    reminderEmailTo,
    reminderCustomerGreeting,
    reminderCustomerMessage,
  };
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const handleChangeComplete = (color) => {
    setBackground(color.hex);
  };
  const onChangeCurrent = (e) => {
    setCurrent(e.target.value);
  };
  const onClickStandard = (active) => {
    setCollaps(active);
  };

  const onChangeDetails = (e) => {
    setDetails(e.target.value);
  };
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
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

  // const normFile = (e) => {
  //
  //   if (Array.isArray(e)) {
  //     return e;
  //   }
  //   return e && e.fileList;
  // };
  //
  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(
        info.file.originFileObj,
        (imageUrl) => setImageUrl(imageUrl),
        setLoading(true),
      );
    }
  };
  const data = [
    {
      content: 'BILL TO',
      description: 'BILL TO',
      show: true,
    },
    {
      content: ' Smith Co.',
      description: ' Smith Co.',
      show: true,
    },
    {
      content: '123 Main Street',
      description: '123 Main Street',
      show: true,
    },
    {
      content: 'City, CA 12345',
      description: 'City, CA 12345',
      show: true,
    },
    {
      content: 'VAT Registration No',
      description: 'VAT Registration No',
      show: customerNo,
    },
  ];
  const dataA = [
    {
      content: 'BILL TO',
      description: 'BILL TO',
      show: true,
    },
    {
      content: ' Smith Co.',
      description: ' Smith Co.',
      show: true,
    },
    {
      content: '123 Main Street',
      description: '123 Main Street',
      show: true,
    },
    {
      content: 'City, CA 12345',
      description: 'City, CA 12345',
      show: true,
    },
    {
      content: 'VAT Registration No',
      description: 'VAT Registration No',
      show: true,
    },
  ];
  const dataB = [
    {
      content: 'BILL TO',
      description: 'BILL TO',
      show: true,
    },
    {
      content: ' Smith Co.',
      description: ' Smith Co.',
      show: true,
    },
    {
      content: '123 Main Street',
      description: '123 Main Street',
      show: true,
    },
    {
      content: 'City, CA 12345',
      description: 'City, CA 12345',
      show: true,
    },
    {
      content: 'VAT Registration No',
      description: 'VAT Registration No',
      show: true,
    },
  ];
  const dataC = [
    {
      content: 'BILL TO',
      description: `${taxInvoice.toUpperCase()}`,
      show: formNumber,
    },
    {
      content: ' Smith Co.',
      description: ' DATE',
      show: true,
    },
    {
      content: '123 Main Street',
      description: 'TERMS',
      show: terms,
    },
    {
      content: '123 Main Street',
      description: 'DEU DATE',
      show: dueDate,
    },
  ];
  const data2 = [
    {
      content: 'BILL TO',
      description: 'BILL TO',
    },
    {
      content: ' Smith Co.',
      description: ' Smith Co.',
    },
    {
      content: '123 Main Street',
      description: '123 Main Street',
    },
    {
      content: 'City, CA 12345',
      description: 'City, CA 12345',
    },
  ];
  const data1 = [
    {
      content: 'AED2345.33',
      description: 'SUBTOTAL',
      show: true,
    },
    {
      content: ' AED2345.33',
      description: ' TOTAL TAX.',
      show: true,
    },
    {
      content: ' AED2345.33',
      description: 'DISCOUNT 2%',
      show: discount,
    },
    {
      content: 'AED2345.33',
      description: 'TOTAL',
      show: dueDate,
    },
    {
      content: 'AED2345.33',
      description: 'DEPOSIT',
      show: deposit,
    },
  ];
  const dataSours = [
    {
      key: '1',
      date: '02/1/1398',
      activity: 'boy',
      description: 'description of ',
      tax: 'some tax',
      qty: 'some qty',
      rate: 'some rate',
      amount: '2000',
      sku: '1234',
    },
    {
      key: '2',
      date: '02/1/1398',
      activity: 'boy',
      description: 'description of',
      tax: 'some tax',
      qty: 'some qty',
      rate: 'some rate',
      amount: '2000',
      sku: '1234',
    },
  ];
  const dataSours1 = [
    {
      key: '1',
      rate: 'some rate',
      vat: 'some vat',
      net: 'some net',
    },
    {
      key: '2',
      rate: 'some rate',
      vat: 'some vat',
      net: 'some net',
    },
  ];
  return (
    <div>
      <span onClick={showDrawer}>{t('Sales.Customers.Estimate')}</span>
      <Drawer
        maskClosable={false}
        mask={true}
        title='Create invoices that turn heads and open wallets'
        height='100vh'
        onClose={onClose}
        open={visible}
        placement='top'
        bodyStyle={{ paddingBottom: 10 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button
              onClick={onClose}
              shape='round'
              style={{ margin: '0  10px' }}
            >
              {t('Custom_form_styles.Preview_pdf')}
            </Button>
            <Button onClick={onClose} type='primary' shape='round'>
              {t('Step.Done')}
            </Button>
          </div>
        }
      >
        <Form
          layout='vertical'
          form={form}
          initialValues={{
            ['businessName']: `${titleContent}`,
            ['phone']: `${phone}`,
            ['email']: `${email}`,
            ['website']: `${website}`,
            ['companyNo']: `${companyNo}`,
            ['taxInvoice']: `${taxInvoice}`,
            ['customerMessage']: `${customerMessage}`,
            ['paymentDetails']: `${paymentDetails}`,
            ['footerText']: `${footerText}`,
            ['standardSubject']: `${standardSubject}`,
            ['standardCustomerGreeting']: `${standardCustomerGreeting}`,
            ['standardCustomerMessage']: `${standardCustomerMessage}`,
            ['standardEmailTo']: `${standardEmailTo}`,
            ['reminderSubject']: `${reminderSubject}`,
            ['reminderCustomerGreeting']: `${reminderCustomerGreeting}`,
            ['reminderCustomerMessage']: `${reminderCustomerMessage}`,
            ['reminderEmailTo']: `${reminderEmailTo}`,
          }}
        >
          <Row>
            <Col span={9}>
              <Row align='middle' gutter={[0, 40]}>
                <Col span={24}>
                  {' '}
                  <Radio.Group
                    value={current}
                    defaultValue='content'
                    onChange={onChangeCurrent}
                    style={{ margin: '0 20px 16px 20px ' }}
                    buttonStyle='solid'
                  >
                    <Radio.Button value='content'>Content</Radio.Button>
                    <Radio.Button value='design'>Design</Radio.Button>

                    <Radio.Button value='emails'>Emails</Radio.Button>
                  </Radio.Group>
                </Col>
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
                          <Logos />

                          <Row>
                            <Col span={24}>
                              <Space size='large' className='show_logo_pdf'>
                                <Button shape='circle' onClick={smallLogo}>
                                  S
                                </Button>
                                <Button shape='circle' onClick={MiddleLogo}>
                                  M
                                </Button>
                                <Button shape='circle' onClick={largeLogo}>
                                  L
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
                          <div className='show_logo_pdf'>Make logo edits</div>
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
                                label='Font Family'
                                style={styles.margin}
                              >
                                <Select onChange={onChangeFontFamily}>
                                  <Option value='Helvetica'>Helvetica</Option>
                                  <Option value='Arial'>
                                    Arial Unicode MS
                                  </Option>
                                  <Option value='courier New'>Courier</Option>
                                  <Option value='Times New Roman'>
                                    Times New Roman
                                  </Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={5}>
                              {' '}
                              <Form.Item
                                name='fontSize'
                                label='Font Size'
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
                          <div className='font_pdf'>Ff</div>{' '}
                          <div className='show_logo_pdf'>
                            {' '}
                            Select a different font
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
                          Add your EFT details{' '}
                        </div>
                      </Col>
                      {editPrintSetting ? (
                        <Col span={24}>
                          <Row gutter={20}>
                            <Col span={24}>
                              {' '}
                              <Text strong={true}>Page margins</Text>
                            </Col>
                            <Col span={5}>
                              <Form.Item
                                label='Top'
                                name='top'
                                onChange={onChangeTop}
                                style={styles.margin}
                              >
                                <Input
                                  placeholder='20'
                                  disabled={fitWindow}
                                  value={top}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={5}>
                              {' '}
                              <Form.Item
                                label='Right'
                                name='right'
                                onChange={onChangeRight}
                                style={styles.margin}
                              >
                                <Input
                                  placeholder='20'
                                  disabled={fitWindow}
                                  value={fitWindow ? '20' : ''}
                                />
                              </Form.Item>{' '}
                            </Col>
                            <Col span={5}>
                              <Form.Item
                                label='Bottom'
                                name='bottom'
                                onChange={onChangeBottom}
                                style={styles.margin}
                              >
                                <Input
                                  placeholder='20'
                                  disabled={fitWindow}
                                  value={bottom}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={5}>
                              {' '}
                              <Form.Item
                                label='Left'
                                name='left'
                                onChange={onChangeLeft}
                                style={styles.margin}
                              >
                                <Input
                                  placeholder='20'
                                  disabled={fitWindow}
                                  value={left}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={24}>
                              <Form.Item name='fitWindow' style={styles.margin}>
                                <Checkbox
                                  onChange={onChangeFitWindow}
                                  style={styles.margin}
                                >
                                  Fit to window envelope
                                </Checkbox>
                              </Form.Item>
                            </Col>{' '}
                          </Row>{' '}
                        </Col>
                      ) : (
                        <Col
                          span={24}
                          className='center_pdf cursor'
                          onClick={onChangeEditPrintSetting}
                        >
                          <Print className='edit_print_pdf' />
                          <div className='show_logo_pdf'>
                            {' '}
                            Edit print settings
                          </div>
                        </Col>
                      )}
                    </Row>
                  </Col>
                ) : current === 'content' ? (
                  <div className='num'>
                    {title ? (
                      <Row>
                        <Col span={24}>
                          {' '}
                          <Form.Item
                            name='showBusinessName'
                            style={styles.margin}
                          >
                            <Checkbox
                              onChange={onChangeTitleShow}
                              style={styles.margin}
                              checked={titleShow}
                            >
                              Business name
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={16}>
                          {' '}
                          <Form.Item
                            name='businessName'
                            style={styles.margin}
                            className='edit_fields_pdf'
                            // rules={[
                            //   {
                            //     whitespace: true,
                            // message: `${t("Form.Name_required")}`,
                            //     required: true,
                            //   },
                            // ]}
                          >
                            <Input onChange={onChangeTitleContent} />
                          </Form.Item>
                        </Col>
                      </Row>
                    ) : header ? (
                      <Row>
                        <Col span={24}>
                          {' '}
                          <Text strong={true}>Header</Text>
                        </Col>
                        <Col span={24}>
                          {' '}
                          <Form.Item name='showPhone' style={styles.margin}>
                            <Checkbox
                              onChange={onChangePhoneShow}
                              style={styles.margin}
                              checked={phoneShow}
                            >
                              Phone
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={16}>
                          {' '}
                          <Form.Item
                            name='phone'
                            style={styles.marginBottom}
                            className='edit_fields_pdf'
                          >
                            <Input onChange={onChangePhone} />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          {' '}
                          <Form.Item name='showEmail' style={styles.margin}>
                            <Checkbox
                              onChange={onChangeEmailShow}
                              style={styles.margin}
                              checked={emailShow}
                            >
                              {t('Form.Email')}
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={16}>
                          <Form.Item
                            name='email'
                            style={styles.marginBottom}
                            className='edit_fields_pdf'
                            rules={[
                              {
                                type: 'email',
                                message: `${t('Form.Email_Message')}`,
                              },
                            ]}
                          >
                            <Input onChange={onChangeEmail} />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          {' '}
                          <Form.Item name='showWebsite' style={styles.margin}>
                            <Checkbox
                              onChange={onChangeWebsiteShow}
                              style={styles.margin}
                              checked={websiteShow}
                            >
                              {t('Form.Website')}
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={16}>
                          <Form.Item
                            name='website'
                            style={styles.marginBottom}
                            className='edit_fields_pdf'
                          >
                            <AutoComplete
                              options={websiteOptions}
                              onChange={onWebsiteChange}
                            >
                              <Input onChange={onChangeWebsite} />
                            </AutoComplete>
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          {' '}
                          <Form.Item name='showCompanyNo' style={styles.margin}>
                            <Checkbox
                              onChange={onChangeCompanyNoShow}
                              style={styles.margin}
                              checked={companyNoShow}
                            >
                              Company No
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={16}>
                          {' '}
                          <Form.Item
                            name='companyNo'
                            style={styles.marginBottom}
                            className='edit_fields_pdf'
                          >
                            <Input onChange={onChangeCompanyNo} />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          {' '}
                          <Form.Item name='logo' style={styles.margin}>
                            <Checkbox
                              onChange={onShowLogo}
                              style={styles.margin}
                              checked={showLogo}
                            >
                              Logo
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          {' '}
                          <Form.Item
                            name='businessAddress'
                            style={styles.margin}
                          >
                            <Checkbox
                              // onChange={onChangeCompanyNoShow}
                              style={styles.margin}
                              // checked={companyNoShow}
                            >
                              Business address
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Divider />
                          <Text strong={true}>Form</Text>
                        </Col>
                        <Col span={24}>
                          <Form.Item name='formNames' style={styles.margin}>
                            <Checkbox
                              onChange={onChangeFormNames}
                              style={styles.margin}
                              checked={formNames}
                            >
                              Form names
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        {formNames && (
                          <Row>
                            {' '}
                            <Col span={14}>
                              {' '}
                              <Form.Item
                                name='invoice'
                                label='Invoice'
                                style={styles.margin}
                                className='edit_fields_pdf'
                              >
                                <Input />
                              </Form.Item>
                            </Col>
                            <Col span={14}>
                              {' '}
                              <Form.Item
                                name='taxInvoice'
                                label='Tax invoice'
                                style={styles.margin}
                                className='edit_fields_pdf'
                              >
                                <Input onChange={onChangeTaxInvoice} />
                              </Form.Item>
                            </Col>
                          </Row>
                        )}
                        <Col span={24}>
                          <Form.Item name='formNumber' style={styles.margin}>
                            <Checkbox
                              onChange={onChangeFormNumber}
                              style={styles.margin}
                              checked={formNumber}
                            >
                              Form numbers
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            name='formCustomNumber'
                            style={styles.marginBottom}
                          >
                            <Checkbox
                              // onChange={onChangeFormCustomNumberShow}
                              style={styles.margin}
                              checked={formCustomNumber}
                            >
                              Use custom transaction numbers
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Divider />
                          <Text strong={true}>Display</Text>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            name='billingAddress'
                            style={styles.margin}
                          >
                            <Checkbox
                              // onChange={onChangeBillingAddress}
                              style={styles.margin}
                              checked={billingAddress}
                            >
                              Billing address
                            </Checkbox>
                          </Form.Item>
                        </Col>{' '}
                        <Col span={24}>
                          <Form.Item name='shipping' style={styles.margin}>
                            <Checkbox
                              onChange={onChangeShipping}
                              style={styles.margin}
                              checked={shipping}
                            >
                              Shipping
                            </Checkbox>
                          </Form.Item>
                        </Col>{' '}
                        <Col span={24}>
                          <Form.Item name='terms' style={styles.margin}>
                            <Checkbox
                              onChange={onChangeTerms}
                              style={styles.margin}
                              checked={terms}
                            >
                              Terms
                            </Checkbox>
                          </Form.Item>
                        </Col>{' '}
                        <Col span={24}>
                          <Form.Item name='dueDate' style={styles.margin}>
                            <Checkbox
                              onChange={onChangeDueDate}
                              style={styles.margin}
                              checked={dueDate}
                            >
                              Due Date
                            </Checkbox>
                          </Form.Item>
                        </Col>{' '}
                        <Col span={24}>
                          <Form.Item name='customerNo' style={styles.custom}>
                            <Checkbox
                              onChange={onChangeCustomerNo}
                              style={styles.margin}
                              checked={customerNo}
                            >
                              Customer VAT number
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={14} style={{ display: 'flex' }}>
                          <Form.Item
                            name='ShowCustom1'
                            style={styles.custom}
                            className='custom_checkbox_pdf'
                          >
                            <Checkbox
                              onChange={onChangeCustom1Show}
                              style={styles.margin}
                              checked={custom1Show}
                            />
                          </Form.Item>
                          <Form.Item
                            name='custom1'
                            style={styles.custom}
                            className='custom_input_pdf'
                          >
                            <Input
                              placeholder='Custom-1'
                              onChange={onChangeCustom1}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={14} style={{ display: 'flex' }}>
                          <Form.Item
                            name='ShowCustom2'
                            style={styles.custom}
                            className='custom_checkbox_pdf'
                          >
                            <Checkbox
                              onChange={onChangeCustom2Show}
                              style={styles.margin}
                              checked={custom2Show}
                            />
                          </Form.Item>
                          <Form.Item
                            name='custom2'
                            style={styles.custom}
                            className='custom_input_pdf'
                          >
                            <Input
                              placeholder='Custom-2'
                              onChange={onChangeCustom2}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={14} style={{ display: 'flex' }}>
                          <Form.Item
                            name='ShowCustom3'
                            style={styles.custom}
                            className='custom_checkbox_pdf'
                          >
                            <Checkbox
                              onChange={onChangeCustom3Show}
                              style={styles.margin}
                              checked={custom3Show}
                            />
                          </Form.Item>
                          <Form.Item
                            name='custom3'
                            style={styles.custom}
                            className='custom_input_pdf'
                          >
                            <Input
                              placeholder='Custom-3'
                              onChange={onChangeCustom3}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    ) : table ? (
                      <Row>
                        <Col span={24}>
                          <Text strong={true}>Table</Text>
                          <br />
                          <br />
                          <Text>Account summary</Text>
                          <br />
                          <br />
                        </Col>
                        <Col span={24}>
                          <Form.Item name='showInvoice' style={styles.margin}>
                            <Checkbox
                              onChange={onChangeShowInvoice}
                              style={styles.marginBottom}
                              checked={showInvoice}
                            >
                              Show on invoice
                            </Checkbox>
                          </Form.Item>
                        </Col>{' '}
                        <Col span={24}>
                          {' '}
                          <Text>Activity table</Text>
                          <br />
                          <br />
                        </Col>
                        <Col span={24}>
                          {' '}
                          <Text>COLUMNS</Text>
                          <br />
                        </Col>
                        <Col span={24}>
                          <Form.Item name='date' style={styles.margin}>
                            <Checkbox
                              onChange={onChangeDate}
                              style={styles.margin}
                              checked={date}
                            >
                              Date
                            </Checkbox>
                          </Form.Item>
                        </Col>{' '}
                        <Col span={24}>
                          <Form.Item
                            name='productOrService'
                            style={styles.margin}
                          >
                            <Checkbox
                              onChange={onChangeProductOrService}
                              style={styles.margin}
                              checked={productOrService}
                            >
                              Product/Service
                            </Checkbox>
                          </Form.Item>
                        </Col>{' '}
                        <Col span={24}>
                          <Form.Item
                            name='includeDescription'
                            style={styles.margin}
                            className='edit_fields_pdf'
                          >
                            <Checkbox
                              onChange={onChangeIncludeDescription}
                              style={styles.margin}
                              checked={includeDescription}
                            >
                              Include description here
                            </Checkbox>
                          </Form.Item>
                        </Col>{' '}
                        <Col span={24}>
                          <Form.Item
                            name='category'
                            style={styles.margin}
                            className='edit_fields_pdf'
                          >
                            <Checkbox
                              onChange={onChangeCategory}
                              style={styles.margin}
                              checked={category}
                            >
                              Category
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item name='description' style={styles.margin}>
                            <Checkbox
                              onChange={onChangeDescription}
                              style={styles.margin}
                              checked={description}
                              disabled={includeDescription}
                            >
                              Description
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            name='includeQuantityRate'
                            style={styles.margin}
                            className='edit_fields_pdf'
                          >
                            <Checkbox
                              onChange={onChangeIncludeQuantityRate}
                              style={styles.margin}
                              checked={includeQuantityRate}
                              disabled={includeDescription}
                            >
                              Include Quantity and Rate
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item name='tax' style={styles.margin}>
                            <Checkbox
                              onChange={onChangeTax}
                              style={styles.margin}
                              checked={tax}
                            >
                              Tax
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item name='quantity' style={styles.margin}>
                            <Checkbox
                              onChange={onChangeQuantity}
                              style={styles.margin}
                              checked={quantity}
                              disabled={includeQuantityRate}
                            >
                              Quantity
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item name='rate' style={styles.margin}>
                            <Checkbox
                              onChange={onChangeRate}
                              style={styles.margin}
                              checked={rate}
                              disabled={includeQuantityRate}
                            >
                              Rate
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item name='amount' style={styles.margin}>
                            <Checkbox
                              onChange={onChangeAmount}
                              style={styles.margin}
                              checked={amount}
                            >
                              Amount
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item name='sku' style={styles.margin}>
                            <Checkbox
                              onChange={onChangeSku}
                              style={styles.margin}
                              checked={sku}
                            >
                              SKU
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item name='showProgress' style={styles.margin}>
                            <Checkbox
                              onChange={onChangeShowProgress}
                              style={styles.margin}
                              checked={showProgress}
                            >
                              Show progress on line items
                            </Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                    ) : footer ? (
                      <Row>
                        <Col span={24}>
                          <h4>Footer</h4>

                          <Text strong={true}>Display</Text>
                        </Col>
                        <Col span={24}>
                          <Form.Item name='discount' style={styles.margin}>
                            <Checkbox
                              onChange={onChangeDiscount}
                              style={styles.marginBottom}
                              checked={discount}
                            >
                              Discount
                            </Checkbox>
                          </Form.Item>
                        </Col>{' '}
                        <Col span={24}>
                          <Form.Item name='deposit' style={styles.margin}>
                            <Checkbox
                              onChange={onChangeDeposit}
                              style={styles.margin}
                              checked={deposit}
                            >
                              Deposit
                            </Checkbox>
                          </Form.Item>
                        </Col>{' '}
                        <Col span={24}>
                          <Form.Item name='taxSummary' style={styles.margin}>
                            <Checkbox
                              onChange={onChangeTaxSummary}
                              style={styles.margin}
                              checked={taxSummary}
                            >
                              Tax summary
                            </Checkbox>
                          </Form.Item>
                        </Col>{' '}
                        <Col span={24}>
                          <Form.Item
                            name='estimateSummary'
                            style={styles.margin}
                          >
                            <Checkbox
                              onChange={onChangeEstimateSummary}
                              style={styles.margin}
                              checked={estimateSummary}
                            >
                              Estimate summary
                            </Checkbox>
                          </Form.Item>
                        </Col>{' '}
                        <Col span={24}>
                          <Row>
                            <Col span={16}>
                              {' '}
                              <Form.Item
                                name='customerMessage'
                                label='Message to customer'
                              >
                                <Input.TextArea
                                  autoSize={{ minRows: 3, maxRows: 6 }}
                                  onChange={onChangeCustomerMessage}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={16}>
                              {' '}
                              <Form.Item
                                name='paymentDetails'
                                label='Your payment details'
                              >
                                <Input.TextArea
                                  autoSize={{ minRows: 5, maxRows: 7 }}
                                  onChange={onChangePaymentDetails}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={16}>
                              {' '}
                              <Form.Item
                                name='footerText'
                                label='Add footer text'
                              >
                                <Input.TextArea
                                  autoSize={{ minRows: 5, maxRows: 7 }}
                                  onChange={onChangeFooterText}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    ) : (
                      <div>
                        Click the pencils on each section to edit each section.
                      </div>
                    )}
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
                                  checked={standardGreeting}
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
                                  checked={reminderGreeting}
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
            <Col span={14} offset={1}>
              {current === 'design' ? (
                <Design
                  edit={edit}
                  drag={drag}
                  background={background}
                  showLogo={showLogo}
                  size={size}
                  fontSize={fontSize}
                  fontFamily={fontFamily}
                  top={top}
                  right={right}
                  bottom={bottom}
                  left={left}
                  fitWindow={fitWindow}
                  dataSours={dataSours}
                  dataSours1={dataSours1}
                  data={data}
                  dataA={dataA}
                  dataB={dataB}
                  dataC={dataC}
                  data1={data1}
                  data2={data2}
                />
              ) : current === 'content' ? (
                <Content
                  edit={edit}
                  drag={drag}
                  background={background}
                  showLogo={showLogo}
                  size={size}
                  fontSize={fontSize}
                  fontFamily={fontFamily}
                  top={top}
                  right={right}
                  bottom={bottom}
                  left={left}
                  fitWindow={fitWindow}
                  dataSours={dataSours}
                  dataSours1={dataSours1}
                  data={data}
                  dataA={dataA}
                  dataB={dataB}
                  dataC={dataC}
                  data1={data1}
                  data2={data2}
                />
              ) : current === 'emails' ? (
                <Email
                  details={details}
                  active={collaps}
                  emailData={emailData}
                  edit={edit}
                />
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
const mapStateToProps = (state) => {
  return {
    rtl: state.direction.rtl,
    ltr: state.direction.ltr,
  };
};
const styles = {
  content: (background) => ({ background: `${background}` }),
  color: (background) => ({
    background: `${background}`,
    // margin: "0px 15px",
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
export default connect(mapStateToProps)(Estimate);
