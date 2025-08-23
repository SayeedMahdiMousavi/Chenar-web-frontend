import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import axiosInstance from '../../../ApiBaseUrl';
import { Drawer, Form, Col, Row, Input, Space } from 'antd';
import { useMediaQuery } from '../../../MediaQurey';
import { trimString } from '../../../../Functions/TrimString';
import {
  CancelButton,
  PageNewButton,
  SaveButton,
} from '../../../../components';
import { PRODUCT_UNIT_M } from '../../../../constants/permissions';
import { addMessage, manageErrors } from '../../../../Functions';

const AddUnit = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const isTablet = useMediaQuery('(max-width:768px)');
  const isMobile = useMediaQuery('(max-width:425px)');

  const showDrawer = () => {
    setVisible(true);
  };

  const handleAddUnit = async (value) => {
    await axiosInstance.post(props.baseUrl, value);
  };

  const {
    mutate: mutateAddUnit,
    isLoading,
    reset,
  } = useMutation(handleAddUnit, {
    onSuccess: (values) => {
      setVisible(false);
      addMessage(values?.data?.name);
      props.handleUpdateItems();
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const onFinish = () => {
    form.validateFields().then(async (values) => {
      mutateAddUnit({
        name: trimString(values?.name),
        symbol: trimString(values?.symbol),
      });
    });
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleAfterVisibleChange = (value) => {
    if (value === false) {
      form.resetFields();
      reset();
    }
  };

  return (
    <div>
      <PageNewButton onClick={showDrawer} model={PRODUCT_UNIT_M} />
      <Drawer
        maskClosable={false}
        title={t('Sales.Product_and_services.Units.Unit_information')}
        width={isMobile ? '80%' : isTablet ? 360 : 370}
        onClose={handleClose}
        open={visible}
        placement={t('Dir') === 'ltr' ? 'right' : 'left'}
        afterVisibleChange={handleAfterVisibleChange}
        footer={
          <div className='textAlign__end'>
            <Space>
              <CancelButton onClick={handleClose} />
              <SaveButton onClick={onFinish} loading={isLoading} />
            </Space>
          </div>
        }
      >
        <Form layout='vertical' hideRequiredMark form={form}>
          <Row>
            <Col span={24}>
              <Form.Item
                name='name'
                label={
                  <span>
                    {t('Form.Name')} <span className='star'>*</span>
                  </span>
                }
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
            </Col>
            <Col span={24}>
              <Form.Item
                name='symbol'
                label={
                  <span>
                    {t('Form.Symbol')} <span className='star'>*</span>
                  </span>
                }
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: t(
                      'Sales.Product_and_services.Units.Required_symbol',
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default AddUnit;
