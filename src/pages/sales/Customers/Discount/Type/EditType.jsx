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

import { EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../../../ApiBaseUrl';
import { ActionMessage } from '../../../../SelfComponents/TranslateComponents/ActionMessage';
import { trimString } from '../../../../../Functions/TrimString';
const { Title } = Typography;

const AddType = (props) => {
  const queryClient = useQueryClient();
  const emailInput = React.createRef();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const { t } = useTranslation();
  const [form] = Form.useForm();

  const editType = async (value) => {
    await axiosInstance
      .put(`/customer_account/discount/type/${props?.record?.id}/`, value)
      .then((res) => {
        // setLoading(false);
        setVisible(false);
        //
        // props.form.setFieldsValue({
        //   type: res?.data?.id,
        // });
        // form.resetFields();

        message.success(
          <ActionMessage name={res?.data?.name} message='Message.Update' />,
        );
      })
      .catch((error) => {
        setLoading(false);
        if (error?.response?.data?.name?.[0]) {
          message.error(`${error?.response?.data?.name?.[0]}`);
        }
      });
  };
  const { mutate: mutateEditType } = useMutation(editType, {
    onSuccess: () =>
      queryClient.invalidateQueries(`/customer_account/discount/type/`),
  });

  const onFinish = async (value) => {
    //
    setLoading(true);
    const allData = {
      name: trimString(value?.name),
    };
    mutateEditType(allData, {
      onSuccess: () => {},
    });
  };

  const showModal = () => {
    form.setFieldsValue({ name: props?.record?.name });
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handelAfterClose = () => {
    form.resetFields();
    setLoading(false);
  };
  const onClickNameInput = () => {
    emailInput.current.focus();
  };
  return (
    <div>
      <Button
        shape='circle'
        size='small'
        type='primary'
        onClick={showModal}
        icon={<EditOutlined />}
      ></Button>

      <Modal
        maskClosable={false}
        open={visible}
        onOk={onFinish}
        onCancel={handleCancel}
        afterClose={handelAfterClose}
        footer={null}
        width={360}
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
          <Title level={4}>
            {t('Sales.Customers.Discount.Edit_card_type')}
          </Title>
          <Form.Item
            name='name'
            label={
              <span>
                {t('Form.Name')} <span className='star'>*</span>
              </span>
            }
            rules={[{ required: true, message: `${t('Form.Name_required')}` }]}
          >
            <Input autoFocus onClick={onClickNameInput} ref={emailInput} />
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
