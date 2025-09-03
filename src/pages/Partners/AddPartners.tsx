import { Col, Form, Input, Modal, Row } from 'antd';
import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { PageNewButton, ResetButton, SaveAndNewButton } from '../../components';
import { PARTNERS } from '../../constants/routes';
import { useMediaQuery } from '../MediaQurey';
import { Styles } from '../styles';
import Uplod from '../sales/Upload';
import { useTranslation } from 'react-i18next';
const AddPartners = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const [file, setFile] = useState({});
  const [fileList, setFileList] = useState([]);
  const [error, setError] = useState(false);

  const isBgTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');

  const showModal = () => {
    setIsShowModal(!isShowModal);
  };

  const handelAfterClose = () => {
    form.resetFields();
    // reset();
    // setError(false);
    // setAttachmentError(false);
    // setFileList([]);
    // setFile();
    // setActiveKey("1");
    // setAttachments([]);
    // setAttachment();
  };
  const handleOk = (e: any) => {
    const type = e?.key;
  };
  //upload
  const onChange = (data: any) => {
    console.log('upload data ', data);
    setFileList(data?.file);
  };
  return (
    <Row className='modal' gutter={12}>
      <Col span={24}>
        <PageNewButton onClick={showModal} model={'partners'} />

        <Modal
          maskClosable={false}
          title={
            t('Partners.Add_partners')

            // <ModalDragTitle
            //   disabled={disabled}
            //   setDisabled={setDisabled}
            //   title={t("Employees.Employee_information")}
            // />
          }
          modalRender={(modal) => (
            <Draggable disabled={disabled} nodeRef={ref as React.RefObject<HTMLElement>}>
              <div ref={ref}>{modal}</div>
            </Draggable>
          )}
          centered
          destroyOnClose={true}
          afterClose={handelAfterClose}
          open={isShowModal}
          onCancel={showModal}
          width={isMobile ? '100%' : isTablet ? '80%' : isBgTablet ? 600 : 600}
          style={Styles.modal(isMobile)}
          bodyStyle={Styles.modalBody(isMobile, isSubBase, isMiniTablet)}
          footer={
            <Row justify='space-between' align='middle'>
              <Col>
                <ResetButton onClick={handelAfterClose} />
              </Col>
              <Col className='text_align_center'>
                {/* <a href="#">{t("Form.Privacy")}</a> */}
              </Col>

              <Col>
                <SaveAndNewButton
                  onSubmit={handleOk}
                  //   loading={isLoading}
                  visible={visible}
                  setVisible={setVisible}
                />
              </Col>
            </Row>
          }
        >
          <Form
            form={form}
            hideRequiredMark={true}
            scrollToFirstError={true}
            layout='vertical'
            // initialValues={{
            //   category: { label: defaultCategory?.name, value: 1 },
            //   bill_address: {
            //     country: t("Sales.Customers.Form.Afghanistan"),
            //   },
            //   prefix: "0093",
            //   prefi: "0093",
            //   gender: "male",
            //   date:
            //     calendarCode === "gregory"
            //       ? utcDate()
            //       : dayjs(
            //           changeGToJ(utcDate().format(dateFormat), dateFormat),
            //           {
            //             //@ts-ignore
            //             jalali: true,
            //           }
            //         ),
            //   currency: {
            //     value: baseCurrencyId,
            //     label: baseCurrencyName,
            //   },
            //   currencyRate: 1,
            //   transactionType: "credit",
            // }}
          >
            <Row gutter={[16, 16]}>
              <Col
                xl={{ span: 24 }}
                style={{ display: 'grid', justifyContent: 'center' }}
              >
                <Form.Item
                  name='upload'
                  valuePropName='fileList'
                  // getValueFromEvent={normFile}
                  // help={error ? `${t("Form.Photo_error")}` : undefined}
                  // validateStatus={error === true ? "error" : undefined}
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
              <Col span={12}>
                <Form.Item
                  label={
                    <span>
                      {t('Form.Name')}
                      <span className='star'>*</span>
                    </span>
                  }
                  // hasFeedback
                  name='name'
                  style={styles.formItem}
                  rules={[
                    {
                      whitespace: true,
                      message: `${t('Form.Name_required')}`,
                      required: true,
                    },
                  ]}
                >
                  <Input
                    autoFocus
                    autoComplete='off'
                    // onChange={handleChangeName}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <span>
                      {t('Form.Last_Name')}
                      <span className='star'>*</span>
                    </span>
                  }
                  // hasFeedback
                  name='name'
                  style={styles.formItem}
                  rules={[
                    {
                      whitespace: true,
                      message: `${t('Form.Name_required')}`,
                      required: true,
                    },
                  ]}
                >
                  <Input
                    autoFocus
                    autoComplete='off'
                    // onChange={handleChangeName}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <span>
                      {t('Form.Phone')}
                      <span className='star'>*</span>
                    </span>
                  }
                  // hasFeedback
                  name='name'
                  style={styles.formItem}
                  rules={[
                    {
                      whitespace: true,
                      message: `${t('Form.Name_required')}`,
                      required: true,
                    },
                  ]}
                >
                  <Input
                    autoFocus
                    autoComplete='off'
                    // onChange={handleChangeName}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <span>
                      {t('Form.Capital_amount')}
                      <span className='star'>*</span>
                    </span>
                  }
                  // hasFeedback
                  name='name'
                  style={styles.formItem}
                  rules={[
                    {
                      whitespace: true,
                      message: `${t('Form.Name_required')}`,
                      required: true,
                    },
                  ]}
                >
                  <Input
                    autoFocus
                    autoComplete='off'
                    // onChange={handleChangeName}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <span>
                      {t('Form.Address')}
                      <span className='star'>*</span>
                    </span>
                  }
                  // hasFeedback
                  name='name'
                  style={styles.formItem}
                  rules={[
                    {
                      whitespace: true,
                      message: `${t('Form.Name_required')}`,
                      required: true,
                    },
                  ]}
                >
                  <Input
                    autoFocus
                    autoComplete='off'
                    // onChange={handleChangeName}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Col>
    </Row>
  );
};

const styles = {
  email: { marginBottom: '.0rem' },
  address: { marginBottom: '.5rem' },
  tab: () => ({
    marginBottom: '8px',
  }),
  formItem: { marginBottom: '10px' },
};

export default AddPartners;
