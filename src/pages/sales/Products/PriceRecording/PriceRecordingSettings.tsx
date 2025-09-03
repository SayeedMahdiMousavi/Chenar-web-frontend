import React, { useState, useRef } from 'react';
import { Modal, Col, Row, Button, InputNumber, Select } from 'antd';
import { useMediaQuery } from '../../../MediaQurey';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../../ApiBaseUrl';
import { Form, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { ModalDragTitle } from '../../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { CancelButton, SaveButton } from '../../../../components';

interface IProps {}
const PriceRecordingSettings = (props: IProps) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [salesRateType, setSalesRateType] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const isBgTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 425px)');

  const showModal = () => {
    setIsShowModal({
      visible: true,
    });
  };

  const onCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };
  const handelAfterClose = () => {
    form.resetFields();
    setLoading(false);
  };

  const addPriceSettings = async (value: any) => {
    await axiosInstance
      .post(`/product/price/setting/`, value)
      .then((res) => {
        setIsShowModal({
          visible: false,
        });
      })
      .catch((error) => {
        setLoading(false);
        if (error?.response?.data?.sales_rate_type) {
          message.error(`${error?.response?.data?.sales_rate_type?.[0]}`);
        } else if (error?.response?.data?.product_affected) {
          message.error(`${error?.response?.data?.product_affected?.[0]}`);
        } else if (error?.response?.data?.sales_rate) {
          message.error(`${error?.response?.data?.sales_rate?.[0]}`);
        }
      });
  };

  const { mutate: mutateAddPriceSettings } = useMutation(addPriceSettings, {
    onSuccess: () => {
      queryClient.invalidateQueries(`/product/items/price/`);
      queryClient.invalidateQueries(`/product/items/`);
    },
  });

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        const data = {
          sales_rate_type: values.sales_rate_type,
          product_affected: values.product_affected,
          sales_rate: values.sales_rate,
        };
        mutateAddPriceSettings(data);
      })
      .catch((info) => {});
  };

  const onChangeSalesRateType = (value: string) => {
    setSalesRateType(value);
  };
  return (
    <div>
      <div onClick={showModal}>
        {t(
          'Sales.Product_and_services.Price_recording.Commodity_price_changes',
        )}
      </div>
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t(
              'Sales.Product_and_services.Price_recording.Commodity_price_changes',
            )}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled} nodeRef={ref as React.RefObject<HTMLElement>}>
            <div ref={ref}>{modal}</div>
          </Draggable>
        )}
        centered
        afterClose={handelAfterClose}
        open={isShowModal.visible}
        onCancel={onCancel}
        destroyOnClose
        wrapClassName='warehouse_add_modal'
        bodyStyle={styles.modalBody}
        style={styles.modal(isMobile)}
        width={
          isMobile ? '100%' : isTablet ? '70%' : isBgTablet ? '45%' : '25%'
        }
        footer={
          <Row justify='end' align='middle'>
            <Col>
              <CancelButton onClick={onCancel} />
              <SaveButton onClick={handleOk} loading={loading} />
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
          <Form.Item
            label={
              <span>
                {t(
                  'Sales.Product_and_services.Price_recording.Sales_rate_type',
                )}
                <span className='star'>*</span>
              </span>
            }
            name='sales_rate_type'
            rules={[
              {
                required: true,
                message: `${t(
                  'Sales.Product_and_services.Price_recording.Sales_rate_type_required',
                )}`,
              },
            ]}
          >
            <Select onChange={onChangeSalesRateType}>
              <Select.Option value='increase_sales_rate'>
                {t(
                  'Sales.Product_and_services.Price_recording.Increase_sales_rate',
                )}
              </Select.Option>
              <Select.Option value='decrease_sales_rate'>
                {t(
                  'Sales.Product_and_services.Price_recording.Decrease_sales_rate',
                )}
              </Select.Option>
              <Select.Option value='fixed_sales_rate'>
                {t(
                  'Sales.Product_and_services.Price_recording.Fixed_sales_rate',
                )}
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={
              <span>
                {t(
                  'Sales.Product_and_services.Price_recording.Product_affected',
                )}
                <span className='star'>*</span>
              </span>
            }
            name='product_affected'
            rules={[
              {
                required: true,
                message: `${t(
                  'Sales.Product_and_services.Price_recording.Product_affected_required',
                )}`,
              },
            ]}
          >
            <Select>
              <Select.Option value='all_products'>
                {t('Sales.Product_and_services.Price_recording.All_products')}
              </Select.Option>
              <Select.Option value='Priced products '>
                {t(
                  'Sales.Product_and_services.Price_recording.Priced_products',
                )}
              </Select.Option>
              <Select.Option value='Unpriced products'>
                {t(
                  'Sales.Product_and_services.Price_recording.Unpriced_products',
                )}
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name='sales_rate'
            label={
              <span>
                {t('Sales.Product_and_services.Price_recording.Rate_percent')}
                <span className='star'>*</span>
              </span>
            }
            className='margin'
            rules={[
              {
                message: `${t(
                  'Sales.Product_and_services.Price_recording.Rate_percent_required',
                )}`,
                required: true,
                whitespace: true,
              },
            ]}
          >
            <InputNumber
              min={salesRateType === 'decrease_sales_rate' ? -99 : 1}
              max={salesRateType === 'decrease_sales_rate' ? 0 : 1000}
              // type="number"
              className='num'
              // inputMode="numeric"
              formatter={(value) => `${value}%`}
              parser={(value: any) => value.replace('%', '')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

interface IStyles {
  margin: React.CSSProperties;
  modalBody: React.CSSProperties;
  modal: (isMobile: any) => React.CSSProperties;
}
const styles: IStyles = {
  margin: { marginBottom: '4px' },
  modalBody: { maxHeight: `calc(100vh - 152px)`, overflowY: 'auto' },
  modal: (isMobile) => ({
    top: isMobile ? 0 : 10,
    bottom: isMobile ? 0 : 10,
    right: isMobile ? 0 : undefined,
    left: isMobile ? 0 : undefined,
  }),
};

export default PriceRecordingSettings;
