import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal, Typography, Space, message, Select } from 'antd';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../../ApiBaseUrl';
import { CancelButton, SaveButton } from '../../../../components';

const { Title } = Typography;

interface IProps {
  baseUrl: string;
  selectedRowKeys: number[];
  setSelectedRows?: (value: any) => void;
  setSelectedRowKeys?: (value: any) => void;
}
export default function ChangeOriginalBarcode(props: IProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const { mutate: mutateChangeOriganBarcode } = useMutation(
    async (value: { products: number[]; original_barcode: boolean }) =>
      await axiosInstance
        .put(`${props.baseUrl}bulk/update/original_barcode/`, value)
        .then(() => {
          message.success(
            t('Sales.Product_and_services.Form.Original_barcode_save_message'),
          );
          setVisible(false);
          setLoading(false);
          form.resetFields();
          if (props.setSelectedRows) {
            props.setSelectedRows([]);
          }
          if (props.setSelectedRowKeys) {
            props.setSelectedRowKeys([]);
          }
        })
        .catch((error) => {
          setLoading(false);

          message.error(`${error?.response?.data?.data?.message}`);
        }),
    {
      onSuccess: () => queryClient.invalidateQueries(`${props.baseUrl}`),
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
      mutateChangeOriganBarcode({
        original_barcode: values?.isOriginBarcode === 'true' ? true : false,
        products: props?.selectedRowKeys,
      });
      oneRequest = false;
    } catch (info) {
      oneRequest = false;
    }
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    form.resetFields();
  };

  const handelAfterClose = () => {
    form.resetFields();
    setLoading(false);
  };

  return (
    <div>
      <div onClick={showModal}>
        {t('Sales.Product_and_services.Form.Is_origin_barcode')}
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
        <Form
          layout='vertical'
          onFinish={onFinish}
          hideRequiredMark={true}
          form={form}
          initialValues={{
            isOriginBarcode: 'true',
          }}
        >
          <Title level={5}>
            {t('Sales.Product_and_services.Form.Is_origin_barcode')}
          </Title>
          <Form.Item name='isOriginBarcode' style={{ marginTop: '22px' }}>
            <Select className='num'>
              <Select.Option value={'true'}>
                {t('Sales.Product_and_services.Form.Origin_barcode')}
              </Select.Option>
              <Select.Option value={'false'}>
                {t('Sales.Product_and_services.Form.Not_origin_barcode')}
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item className='margin textAlign__end'>
            <Space>
              <CancelButton onClick={handleCancel} />
              <SaveButton htmlType='submit' loading={loading} />
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
