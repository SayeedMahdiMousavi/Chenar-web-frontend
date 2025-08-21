import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Descriptions, Space, Row } from 'antd';
import { DraggableModal, TrueFalseIcon } from '../../../components';
import Photo from './Photo';
import ShowDate from '../../SelfComponents/JalaliAntdComponents/ShowDate';
import { AntdTag, Statistics } from '../../../components/antd';
import { Colors } from '../../colors';

interface IProps {
  record: any;
  setDropDownVisible: (value: boolean) => void;
}
const ProductView: React.FC<IProps> = ({ record, setDropDownVisible }) => {
  const { t } = useTranslation();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });

  const showModal = () => {
    setDropDownVisible(false);
    setIsShowModal({
      visible: true,
    });
  };
  const handleCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };
  const unitPrice = record?.price?.find((item: any) =>
    item?.unit_pro_relation?.includes('base_unit')
  )?.sales_rate;
  return (
    <div>
      <div onClick={showModal}>{t('Form.View')}</div>

      <DraggableModal
        title={t('Sales.Product_and_services.Product_information')}
        open={isShowModal.visible}
        width={500}
        onCancel={handleCancel}
        footer={false}
        bodyStyle={styles.modalBody}
      >
        <Space size='large' direction='vertical'>
          <Row justify='center'>
            <Col>
              <Photo
                photo={record?.photo}
                type='product'
                size={70}
                content={t('Form.Photo')}
              />
            </Col>
          </Row>

          <Descriptions
            bordered
            size='small'
            column={1}
            labelStyle={styles.descriptionLabel}
          >
            <Descriptions.Item
              label={t('Sales.Product_and_services.Categories.Name')}
            >
              {record?.name}
            </Descriptions.Item>
            <Descriptions.Item
              label={t('Sales.Product_and_services.Product_id')}
            >
              {record?.id}
            </Descriptions.Item>
            <Descriptions.Item label={t('Sales.Product_and_services.Barcode')}>
              {record?.product_barcode?.map((item: { barcode: string }) => (
                <AntdTag key={record?.barcode} color={Colors.primaryColor}>
                  {item?.barcode}
                </AntdTag>
              ))}
            </Descriptions.Item>
            <Descriptions.Item
              label={t(
                'Sales.Product_and_services.Price_recording.Sales_price'
              )}
            >
              {unitPrice && <Statistics value={unitPrice} />}
            </Descriptions.Item>
            <Descriptions.Item
              label={t('Sales.Product_and_services.Form.Vip_price')}
            >
              <TrueFalseIcon value={record?.is_have_vip_price} />
            </Descriptions.Item>
            <Descriptions.Item
              label={t('Sales.Product_and_services.Form.Units')}
            >
              {record?.product_units?.map(
                (item: { unit: { name: string } }) => {
                  return (
                    <AntdTag key={item?.unit?.name} color={Colors.primaryColor}>
                      {item?.unit?.name}
                    </AntdTag>
                  );
                }
              )}
            </Descriptions.Item>
            <Descriptions.Item label={t('Sales.Product_and_services.Category')}>
              {record?.category?.get_fomrated_path}
            </Descriptions.Item>
            <Descriptions.Item
              label={t('Sales.Product_and_services.Form.Created_by')}
            >
              {record?.created_by?.username}
            </Descriptions.Item>
            <Descriptions.Item
              label={t('Sales.Product_and_services.Form.Modified_by')}
            >
              {record?.modified_by?.username}
            </Descriptions.Item>
            <Descriptions.Item
              label={t('Sales.Product_and_services.Form.Created_date')}
            >
              <ShowDate date={record?.created} />
            </Descriptions.Item>
            <Descriptions.Item
              label={t('Sales.Product_and_services.Form.Modified_date')}
            >
              <ShowDate date={record?.modified} />
            </Descriptions.Item>
            <Descriptions.Item label={t('Form.Description')}>
              {record?.description}
            </Descriptions.Item>
          </Descriptions>
        </Space>
      </DraggableModal>
    </div>
  );
};

const styles = {
  descriptionLabel: { width: '150px' },
  modalBody: { paddingBottom: '20px' },
};

export default ProductView;
