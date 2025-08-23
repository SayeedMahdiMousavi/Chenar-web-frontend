import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Form,
  Modal,
  Button,
  Typography,
  Space,
  message,
  InputNumber,
  Spin,
} from 'antd';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../../ApiBaseUrl';
import { CancelButton, SaveButton } from '../../../../components';

const { Title } = Typography;
interface IProps {
  setVisible?: (value: boolean) => void;
}
export default function AddVipPercent(props: IProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [spin, setSpin] = useState(false);

  const { mutate: mutateChangeVip } = useMutation(
    async (value: any) =>
      await axiosInstance
        .post(`/product/setting/`, value)
        .then(() => {
          message.success(
            t('Sales.Product_and_services.Form.Vip_save_message'),
          );
          setVisible(false);
          setLoading(false);
          form.resetFields();
        })
        .catch((error) => {
          setLoading(false);
          if (error?.response?.data?.vip_price?.percent?.[0]) {
            message.error(`${error?.response?.data?.vip_price?.percent?.[0]}`);
          }
        }),
    {
      onSuccess: () => queryClient.invalidateQueries(`/product/setting/`),
    },
  );

  let oneRequest = false;
  const onFinish = async (values: any) => {
    setLoading(true);
    if (oneRequest) {
      return;
    }
    oneRequest = true;

    try {
      mutateChangeVip({
        vip_price: {
          percent: values.percent,
        },
      });
      oneRequest = false;
    } catch (info) {
      oneRequest = false;
    }
  };

  const showModal = async () => {
    setSpin(true);
    await axiosInstance
      .get('/product/setting/')
      .then((res) => {
        form.setFieldsValue({ percent: res?.data?.vip_price?.percent });
        setSpin(false);
      })
      .catch((error) => {
        setSpin(false);
        if (error?.response?.data?.vip_price?.percent?.[0]) {
          message.error(`${error?.response?.data?.vip_price?.percent?.[0]}`);
        }
      });

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
      <div onClick={showModal}>
        {t('Sales.Product_and_services.Form.Vip_percent')}
      </div>
      <Modal
        maskClosable={false}
        open={visible}
        onOk={onFinish}
        onCancel={handleCancel}
        footer={null}
        width={310}
        //@ts-ignore
        handelAfterClose={handelAfterClose}
      >
        <Spin spinning={spin}>
          <Form
            layout='vertical'
            onFinish={onFinish}
            hideRequiredMark={true}
            form={form}
            initialValues={{
              isVip: 'true',
            }}
          >
            <Title level={5}>
              {t('Sales.Product_and_services.Form.Vip_percent')}
            </Title>
            <Form.Item
              name='percent'
              label={
                <span>
                  {t('Sales.Customers.Discount.Percent')}
                  <span className='star'>*</span>
                </span>
              }
              rules={[
                {
                  message: `${t('Sales.Customers.Discount.Required_percent')}`,
                  required: true,
                },
              ]}
            >
              <InputNumber
                min={0}
                max={80}
                className='num'
                formatter={(value) => `${value}%`}
                parser={(value: any) => value.replace('%', '')}
              />
            </Form.Item>
            <Form.Item className='textAlign__end' style={styles.footer}>
              <Space>
                <CancelButton onClick={handleCancel} />
                <SaveButton htmlType='submit' loading={loading} />
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
}

const styles = {
  footer: { marginBottom: '5px', paddingTops: '12px' },
};
