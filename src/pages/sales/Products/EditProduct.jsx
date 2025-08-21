import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Draggable from 'react-draggable';
import { useMutation } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import { Modal, Form, Input, Row, Col, Button, Space } from 'antd';
import { useMediaQuery } from '../../MediaQurey';
// import { connect } from "react-redux";
// import { useDatabase } from "@nozbe/watermelondb/hooks";
// import withObservables from "@nozbe/with-observables";
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
import Uplod from '../Upload';
import { ModalDragTitle } from '../../SelfComponents/ModalDragTitle';
import { Styles } from '../../styles';
import { CategoryField } from '../../SelfComponents/CategoryField';
import { trimString } from '../../../Functions/TrimString';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { InfiniteScrollSelectFormItem } from '../../../components/antd';
import { manageErrors, updateMessage } from '../../../Functions';
import { CancelButton, SaveButton } from '../../../components';

const EditProduct = (props) => {
  const { t } = useTranslation();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [file, setFile] = useState();
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const isMiniComputer = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');

  const editProduct = async (value) =>
    await axiosInstance.patch(`${props.baseUrl}${props?.record?.id}/`, value, {
      timeout: 0,
    });

  const {
    mutate: mutateEditProduct,
    isLoading,
    reset,
  } = useMutation(editProduct, {
    onSuccess: (value) => {
      setIsShowModal({
        visible: false,
      });
      updateMessage(value?.data?.name);
      props.handleUpdateItems();
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const handleOk = async () => {
    form.validateFields().then(async (values) => {
      const formData = new FormData();
      if (error) {
        return;
      } else {
        if (file) {
          formData.append('photo', file, file.name);
        }
        formData.append('name', trimString(values?.name));
        if (values.category?.value) {
          formData.append('category', values?.category?.value);
        }

        formData.append(
          'category',
          values.category ? values.category?.value : ''
        );
        if (values?.supplier?.value) {
          formData.append('supplier', values?.supplier?.value);
        }

        formData.append('is_asset', values.isFixedAssets);

        formData.append('is_have_vip_price', values.isVip);
        formData.append(
          'description',
          values.description ? values?.description : ''
        );
        mutateEditProduct(formData);
      }
    });
  };

  const showModal = () => {
    props.dropVisible(false);
    setIsShowModal({
      visible: true,
    });

    setFileList(
      props?.record?.photo && [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: props?.record?.photo,
        },
      ]
    );

    form.setFieldsValue({
      name: props?.record?.name,
      category: {
        value: props?.record?.category?.id,
        label: props?.record?.category?.name,
      },
      description: props?.record?.description,
      supplier: {
        value: props.record?.supplier?.id,
        label: props.record?.supplier?.full_name,
      },
      isFixedAssets: props.record?.is_asset,
      isVip: props.record?.is_have_vip_price,
      upload: props?.record?.photo && [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: props?.record?.photo,
        },
      ],
    });
  };

  const handleCancel = (e) => {
    setIsShowModal({
      visible: false,
    });
  };

  const handelAfterClose = () => {
    form.resetFields();
    setFileList([]);
    setFile();
    reset();
  };

  //upload
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <Row className='modal'>
      <div onClick={showModal} className='num'>
        {t('Sales.Product_and_services.Edit_product')}
      </div>

      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Sales.Product_and_services.Product_information')}
          />
        }
        afterClose={handelAfterClose}
        open={isShowModal.visible}
        onOk={handleOk}
        okText='submit'
        destroyOnClose
        centered
        width={
          isMobile
            ? '100vw'
            : isMiniTablet
            ? '85vw'
            : isTablet
            ? 440
            : isMiniComputer
            ? 440
            : 440
        }
        onCancel={handleCancel}
        style={Styles.modal(isMobile)}
        bodyStyle={Styles.modalBody(isMobile, isSubBase, isMiniTablet)}
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
        footer={
          <Row justify='end'>
            <Col>
              <CancelButton onClick={handleCancel} />
              <SaveButton onClick={handleOk} loading={isLoading} />
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
          <Row gutter={20}>
            <Col xl={{ span: 17 }} md={{ span: 16 }} xs={{ span: 15 }}>
              <Form.Item
                label={
                  <span>
                    {t('Form.Name')}
                    <span className='star'>*</span>
                  </span>
                }
                name='name'
                style={styles.formItem}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: t('Form.Name_required'),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item noStyle>
                <CategoryField
                  form={form}
                  url='/product/category/'
                  label={
                    <span>
                      {t('Sales.Product_and_services.Form.Category')}
                      <span className='star'>*</span>
                    </span>
                  }
                  style={styles.formItem}
                />
              </Form.Item>
            </Col>
            <Col
              xl={{ span: 7 }}
              md={{ span: 8 }}
              xs={{ span: 9 }}
              className='upload_col'
            >
              <Form.Item
                name='upload'
                valuePropName='fileList'
                getValueFromEvent={normFile}
                className='upload'
                help={error ? t('Form.Photo_error') : undefined}
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
          </Row>
          <Row gutter={20}>
            <Col xl={{ span: 12 }} md={{ span: 12 }} xs={{ span: 24 }}>
              <InfiniteScrollSelectFormItem
                name='supplier'
                label={t('Expenses.Suppliers.Supplier')}
                style={styles.formItem}
                fields='full_name,id'
                baseUrl='/supplier_account/supplier/'
              />
            </Col>
            <Col xl={{ span: 12 }} md={{ span: 12 }} xs={{ span: 24 }}>
              <Form.Item
                style={{ marginBottom: '12px' }}
                name='description'
                label={t('Form.Description')}
              >
                <Input.TextArea
                  autoSize={{ minRows: 1, maxRows: 2 }}
                  showCount
                />
              </Form.Item>
            </Col>
            <Col xl={{ span: 12 }} md={{ span: 12 }} xs={{ span: 24 }}>
              <Form.Item
                name='isFixedAssets'
                style={styles.formItem}
                valuePropName='checked'
              >
                <Checkbox>
                  {t('Sales.Product_and_services.Form.Is_fixed_assets')}
                </Checkbox>
              </Form.Item>
            </Col>

            <Col xl={{ span: 12 }} md={{ span: 12 }} xs={{ span: 24 }}>
              <Form.Item
                name='isVip'
                style={styles.formItem}
                valuePropName='checked'
              >
                <Checkbox>
                  {t('Sales.Product_and_services.Form.Vip_price')}
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Row>
  );
};

const styles = {
  formItem: { marginBottom: '8px' },
};

// const enhancProduct = withObservables(["groups"], ({ database }) => ({
//   groups: database.collections.get("groups").query().observe(),
// }));

// export default connect(null)(withDatabase(enhancProduct(ModalApp)));
export default EditProduct;
