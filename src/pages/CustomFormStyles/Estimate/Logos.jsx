import React, { useState } from 'react';
import { Modal, Col, Row, Button } from 'antd';
import { useMediaQuery } from '../../MediaQurey';
import { connect } from 'react-redux';
import ImgCrop from 'antd-img-crop';

import {
  Form,
  // Input,
  // Select,
  //   Dropdown,
  //   Menu,
  //   Checkbox,
  //   Upload,
  Avatar,
  //   AutoComplete,
  Upload,
  // Tabs,
  message,
  // DatePicker,
} from 'antd';

// import { QuestionCircleOutlined } from "@ant-design/icons";

// import { useDatabase } from "@nozbe/watermelondb/hooks";
import withObservables from '@nozbe/with-observables';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { useTranslation } from 'react-i18next';
import { SaveButton } from '../../../components';
// const { Option } = Select;
// const { TabPane } = Tabs;
// const AutoCompleteOption = AutoComplete.Option;
const formItemLayout = {
  labelCol: {
    span: 24,
  },
};
// const tailFormItemLayout = {
//   wrapperCol: {
//     xl: {
//       span: 24,
//       offset: 0,
//     },
//   },
// };

const AddEmployee = (props) => {
  // const isTabletBase = useMediaQuery("(max-width:768px)");
  const { t } = useTranslation();
  const [form] = Form.useForm();
  // const database = useDatabase();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  // const [visible, setVisible] = useState(false);
  // const [imageUrl, setImageUrl] = useState("");
  const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ]);

  const isBgTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  // const isTablet1 = useMediaQuery("(max-width: 765px)");
  const isMobile = useMediaQuery('(max-width: 425px)');
  // const isSubBase = useMediaQuery("(max-width: 375px)");
  const showModal = () => {
    setIsShowModal({
      visible: true,
    });
  };

  //   const normFile = (e) => {
  //
  //     if (Array.isArray(e)) {
  //       return e;
  //     }
  //     return e && e.fileList;
  //   };
  const onCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };
  const handleOk = () => {
    //
    form
      .validateFields()
      .then(async (values) => {
        // let customers = database.collections.get("customers");
        // await database.action(async () => {
        //   await customers.create((customer) => {
        //     customer.name = values.name;
        //     customer.last_name = values.last_name;
        //     customer.icon = values.upload;
        //     customer.display_name = values.display_name;

        //     customer.email = values.email;
        //     customer.phone = values?.phone
        //       ? `${values.prefi}${values?.phone}`
        //       : "";
        //     customer.mobile = values?.mobile
        //       ? `${values.prefix}${values?.mobile}`
        //       : "";
        //     customer.fax = values.fax;
        //     customer.website = values.website;
        //     customer.parent_customer = values.parent_customer;
        //     customer.bill_with = values.bill_with;
        //     customer.status = "active";
        //     customer.addresses = [
        //       {
        //         type: "billing",
        //         street: values.bill_address.street,
        //         country: values.bill_address.country,
        //         city: values.bill_address.city,
        //         province: values.bill_address.province,

        //         postal_code: values.bill_address.postal_code,
        //       },
        //       {
        //         type: "shipping",
        //         street: values.ship_address.street,
        //         country: values.ship_address.country,
        //         city: values.ship_address.city,
        //         province: values.ship_address.province,
        //         postal_code: values.ship_address.postal_code,
        //       },
        //     ];
        //     customer.notes = values.notes;
        //     customer.open_balance = values.openBalance;
        //   });
        // });
        // setIsShowModal({
        //   visible: false,
        // });
        form.resetFields();
        message.info(`${t('Message.Add')} ${values.name}`);
      })
      .catch((info) => {
        message.error(info);
      });
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
  // const fileList1 = [fileList[0]];
  return (
    // <Row className='modal'>
    //   <Col span={24}>
    <div>
      <Avatar
        shape='square'
        alt={`${t('Company.Logo')}`}
        size={55}
        className='cursor'
        onClick={showModal}
        src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
      >
        {t('Company.Logo')}
      </Avatar>
      <Modal
        maskClosable={false}
        title='Logos'
        centered
        style={styles.model(isMobile)}
        open={isShowModal.visible}
        onCancel={onCancel}
        width={
          isMobile ? '100%' : isTablet ? '80%' : isBgTablet ? '60%' : '35%'
        }
        //   bodyStyle={styles.bodyStyle(isMobile, isSubBase, isTablet, isTablet1)}
        footer={
          <Row justify='end' align='middle'>
            <Col>
              <SaveButton onClick={handleOk} />
            </Col>
          </Row>
        }
      >
        <Form
          {...formItemLayout}
          // onFinish={handleOk}
          form={form}
          hideRequiredMark={true}
          scrollToFirstError={true}
        >
          <Form.Item
            name='logo'
            valuePropName='fileList'
            // getValueFromEvent={normFile}
            style={styles.margin}
          >
            <ImgCrop rotate>
              <Upload
                action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                listType='picture-card'
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
                multiple={true}
              >
                {fileList.length < 3 && '+ Upload'}
              </Upload>
            </ImgCrop>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
const styles = {
  model: (isMobile) => ({ top: isMobile ? 0 : 20 }),
  bodyStyle: (isMobile, isSubBase, isTablit, isTablit1) => ({
    height: isMobile ? '75vh' : isTablit ? '66vh' : '27rem',
    overflowY: isTablit1 ? 'scroll' : '',
    padding: isSubBase ? '20px' : '24px',
    paddingTop: '10px',
  }),
  name: { marginBottom: '.0rem' },
  address: { marginBottom: '.5rem' },

  drop: { height: '100%' },

  tab: (isMobile) => ({
    marginBottom: '0rem',
    marginTop: isMobile ? '1rem' : '2rem',
  }),
  marginBottom: { marginBottom: '.3rem' },
  firstRow: (isMobile, isTablitBase) => ({
    height: isMobile ? '13.7rem' : isTablitBase ? '12.2rem' : '10.2rem',
  }),
};
const enhancProduct = withObservables(['groups'], ({ database }) => ({
  groups: database.collections.get('groups').query().observe(),
}));
export default connect(null)(withDatabase(enhancProduct(AddEmployee)));

// export default NewCustomer;
