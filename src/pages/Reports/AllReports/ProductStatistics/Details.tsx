import React from 'react';
import { useQuery } from 'react-query';
import axiosInstance from '../../../ApiBaseUrl';
import { Modal, Descriptions, Spin } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ViewButton } from '../../../../components';
import { Statistics } from '../../../../components/antd';

interface IProps {
  id: string;
  available: string;
  unit: string;
}

export const ProductStatisticsDetails = (props: IProps) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productId, setProductId] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
    setProductId(props?.id);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAfterClose = () => {
    setProductId('');
  };

  const { data, isLoading } = useQuery(
    ['/product/item/statisticsDetails/', { id: productId }],
    async ({ queryKey }: any) => {
      const { id } = queryKey?.[1];
      const result = await axiosInstance.get(
        `/product/items/${id}/?expand=unit_conversion&fields=unit_conversion`,
      );
      return result.data;
    },
    { enabled: !!productId },
  );

  return (
    <>
      <ViewButton onClick={showModal} />
      <Modal
        maskClosable={false}
        title={t('Reports.Details')}
        open={isModalVisible}
        footer={false}
        width={300}
        onCancel={handleCancel}
        afterClose={handleAfterClose}
      >
        <Spin spinning={isLoading}>
          <Descriptions
            bordered
            column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
            size='small'
          >
            <Descriptions.Item
              label={t('Sales.Product_and_services.Units.Unit')}
            >
              {t('Reports.Available_quantity')}
            </Descriptions.Item>
            <Descriptions.Item key='40' label={props?.unit}>
              <Statistics value={props?.available} />
            </Descriptions.Item>
            {data?.unit_conversion?.map((item: any) => (
              <Descriptions.Item key={item?.id} label={item?.from_unit?.name}>
                <Statistics
                  value={parseFloat(props?.available) / parseFloat(item?.ratio)}
                />
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Spin>
      </Modal>
    </>
  );
};
