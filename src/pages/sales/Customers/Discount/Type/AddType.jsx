import React, { useState } from 'react';
import {
  Modal,
  Button,
  Form,
  Typography,
  Input,
  // TreeSelect,
  message,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../../../ApiBaseUrl';
import { AddItem } from '../../../../SelfComponents/AddItem';
import { ActionMessage } from '../../../../SelfComponents/TranslateComponents/ActionMessage';
import { trimString } from '../../../../../Functions/TrimString';
const { Title } = Typography;

const AddType = (props) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const addType = async (value) => {
    await axiosInstance
      .post(`/customer_account/discount/type/`, value)
      .then((res) => {
        // setLoading(false);
        setVisible(false);
        //
        props.form.setFieldsValue({
          type: res?.data?.id,
        });
        // form.resetFields();
        message.success(
          <ActionMessage name={res?.data?.name} message='Message.Add' />,
        );
      })
      .catch((error) => {
        setLoading(false);
        if (error?.response?.data?.name?.[0]) {
          message.error(`${error?.response?.data?.name?.[0]}`);
        }
      });
  };
  const { mutate: mutateAddType } = useMutation(addType, {
    onSuccess: () =>
      queryClient.invalidateQueries(`/customer_account/discount/type/`),
  });

  const onFinish = async (value) => {
    //
    setLoading(true);
    const allData = {
      name: trimString(value?.name),
    };
    mutateAddType(allData, {
      onSuccess: () => {},
    });
  };
  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handelAfterClose = () => {
    form.resetFields();
    setLoading(false);
  };
  return (
    <div>
      <AddItem showModal={showModal} />
      <Modal
        maskClosable={false}
        open={visible}
        onOk={onFinish}
        onCancel={handleCancel}
        footer={null}
        width={360}
        handelAfterClose={handelAfterClose}
      >
        {/* [
            <Button key="back" onClick={handleCancel}>
              Return
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
              Submit
            </Button>,
          ] */}
        <Form
          layout='vertical'
          onFinish={onFinish}
          hideRequiredMark={true}
          form={form}
        >
          <Title level={5}>{t('Sales.Customers.Discount.Add_card_type')}</Title>
          <Form.Item
            name='name'
            label={
              <span>
                {t('Form.Name')} <span className='star'>*</span>
              </span>
            }
            rules={[{ required: true, message: `${t('Form.Name_required')}` }]}
          >
            <Input autoFocus />
          </Form.Item>

          <Form.Item className='margin'>
            <div className='import__footer'>
              <div>
                <Button shape='round' onClick={handleCancel}>
                  {t('Form.Cancel')}
                </Button>
              </div>
              <div>
                <Button
                  type='primary'
                  shape='round'
                  htmlType='submit'
                  loading={loading}
                >
                  {t('Form.Save')}
                </Button>
              </div>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
// const styles = {};
export default AddType;
