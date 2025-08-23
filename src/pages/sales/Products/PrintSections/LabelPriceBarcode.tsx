import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Form,
  Modal,
  Button,
  Typography,
  Space,
  message,
  Select,
  Avatar,
  Checkbox,
  Row,
  Col,
  Input,
} from 'antd';
import { useReactToPrint } from 'react-to-print';
import PriceLabel from '../../../PrintComponents/PriceLabel';
import axiosInstance from '../../../ApiBaseUrl';
import { useQuery } from 'react-query';
import { arabicToIndian } from '../../../../Functions/arabicToIndian';
import { math, print } from '../../../../Functions/math';
import { CancelButton } from '../../../../components';
const { Title } = Typography;

interface IProps {
  selectedRows?: any;
  setSelectedRows?: (value: any) => void;
  setSelectedRowKeys?: (value: any) => void;
}

export default function LabelPriceBarcode(props: IProps) {
  const printRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [products, setProducts] = useState<any>([]);
  const [isSetForm, setIsSetForm] = useState(false);

  const vipPercent = useQuery('/product/setting/', async () => {
    const { data } = await axiosInstance.get(`/product/setting/`);
    return data;
  });

  const findDefaultBarcode = (barcodeList: any, baseUnit: any) => {
    const barcode = barcodeList?.find(
      (item: any) =>
        item?.default === true && item?.unit?.id === baseUnit?.unit?.id,
    )?.barcode;
    if (barcode) {
      return barcode;
    } else {
      const barcode = barcodeList?.find(
        (item: any) => item?.default === true,
      )?.barcode;
      if (barcode) {
        return barcode;
      } else {
        const barcode = barcodeList?.find(
          (item: any) => item?.unit?.id === baseUnit?.unit?.id,
        )?.barcode;
        return barcode ? barcode : barcodeList?.[0]?.barcode;
      }
    }
  };

  const makeProductsList = (labelList: any) => {
    const newProductsItems = labelList?.map((item: any) => {
      const unit = item?.product_barcode?.find(
        (unitItem: any) => unitItem?.barcode === item?.barcode,
      )?.unit;
      const priceUnit = item?.price?.find(
        (item: any) => item?.unit === unit?.id,
      );
      //

      const price = arabicToIndian(parseInt(priceUnit?.sales_rate));
      if (item?.is_have_vip_price) {
        const sales: string = priceUnit?.sales_rate ?? '';
        const purchase: string = priceUnit?.perches_rate ?? '';
        const vip: string = vipPercent?.data?.vip_price?.percent ?? '';
        const productVip: string = item?.vip_price?.vip_percent ?? '';
        const productVipPercent =
          item?.vip_price !== null ? parseFloat(productVip) : parseFloat(vip);
        const vipPrice = parseFloat(
          //@ts-ignore
          print(
            //@ts-ignore
            math.evaluate(`(${sales}-${purchase})*${productVipPercent}/100`),
          ),
        );
        //
        const finalPrice = priceUnit?.sales_rate
          ? arabicToIndian(
              //@ts-ignore
              print(math.evaluate(`(${sales}-${Math.round(vipPrice)})`)),
            )
          : arabicToIndian(0);
        const newItem = {
          id: item?.id,
          name: item?.concat
            ? `${item?.product} (${unit?.name})`
            : item?.product,
          barcode: item?.barcode,
          price: price,
          vipPrice: finalPrice,
          is_have_vip_price: item?.is_have_vip_price,
        };
        return newItem;
      } else {
        const newItem = {
          id: item?.id,
          name: item?.concat
            ? `${item?.product} (${unit?.name})`
            : item?.product,
          barcode: item?.barcode,
          price: price,
          vipPrice: 0,
          is_have_vip_price: item?.is_have_vip_price,
        };
        return newItem;
      }
    });

    return newProductsItems;
  };

  const onAfterPrint = () => {
    setLoading(false);
    setProducts([]);
  };
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    bodyClass: 'barcode-print-body',
    onAfterPrint: onAfterPrint,
  });

  const onFinish = async (value: any) => {
    setLoading(true);
    if (value?.labelList?.length > 0) {
      return new Promise(async (resolve, reject) => {
        const newProducts = await makeProductsList(value?.labelList);

        setProducts(newProducts);
        setTimeout(() => {
          //@ts-ignore
          handlePrint();
          setLoading(false);
          //@ts-ignore
          resolve();
        }, 1000);
      });
    } else {
      setLoading(false);
    }
  };

  const showModal = () => {
    const productItems = props?.selectedRows?.filter(
      (item: any) => item?.product_barcode?.length !== 0,
    );
    const ok = props?.selectedRows?.some(
      (item: any) => item?.product_barcode?.length === 0,
    );

    form.setFieldsValue({
      labelList: productItems?.map((item: any) => {
        const baseUnit = item?.product_units?.find(
          (item: any) => item?.base_unit === true,
        );
        return {
          ...item,
          concat: false,
          barcode: findDefaultBarcode(item?.product_barcode, baseUnit),
          product: item?.name,
        };
      }),
    });

    setTimeout(() => {
      setIsSetForm(true);
    }, 1000);

    if (ok) {
      message.error(
        t('Sales.Product_and_services.Form.Barcode_remove_message'),
      );
    }

    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handelAfterClose = () => {
    form.resetFields();
    setLoading(false);
    setProducts([]);
    setIsSetForm(false);
  };

  const getItem = React.useCallback(
    (itemIndex: number): any => {
      const formValue = form.getFieldsValue();
      if (formValue?.labelList?.length > 0) {
        const item = formValue?.labelList?.find(
          (item: any, index: number) => index === itemIndex,
        );
        return item;
      }
    },
    [form],
  );

  return (
    <div>
      <div onClick={showModal}>
        {t('Sales.Product_and_services.Print_price_label')}
      </div>
      <Modal
        maskClosable={false}
        open={visible}
        onOk={onFinish}
        onCancel={handleCancel}
        footer={null}
        centered
        width={600}
        afterClose={handelAfterClose}
        style={{ paddingTop: '20px', paddingBottom: '15px' }}
        bodyStyle={{ paddingBottom: '10px', paddingInlineEnd: '0px' }}
      >
        <Form
          layout='vertical'
          onFinish={onFinish}
          hideRequiredMark={true}
          form={form}
          initialValues={{
            concat: false,
          }}
        >
          <Title level={5}>
            {t('Sales.Product_and_services.Print_price_label')}
          </Title>
          <Row className='num'>
            <Col
              span={24}
              style={{
                maxHeight: `calc(100vh - 177px)`,
                overflowY: 'auto',
                marginBottom: '10px',
                paddingBottom: '7px',
                marginTop: '10px',
              }}
            >
              <Form.List name='labelList'>
                {(fields, { add, remove }) => (
                  <>
                    {fields?.map((field, index) => {
                      const productItem = getItem(index);

                      return (
                        <Row
                          key={field.key}
                          align='bottom'
                          style={{
                            marginBottom: 20,
                          }}
                          className='editable-row'
                        >
                          <Col span={24}>
                            <Row
                              align='bottom'
                              gutter={10}
                              style={{ width: '100%' }}
                            >
                              <Col span={9}>
                                <Form.Item
                                  {...field}
                                  validateTrigger={['onChange', 'onBlur']}
                                  name={[field.name, 'product']}
                                  label={
                                    index === 0 ? (
                                      <span>
                                        {t(
                                          'Sales.Product_and_services.Product',
                                        )}
                                      </span>
                                    ) : (
                                      ''
                                    )
                                  }
                                  style={styles.input}
                                >
                                  <Input readOnly />
                                </Form.Item>
                              </Col>
                              <Col span={7}>
                                <Form.Item
                                  {...field}
                                  validateTrigger={['onChange', 'onBlur']}
                                  name={[field.name, 'barcode']}
                                  label={
                                    index === 0 ? (
                                      <span>
                                        {t(
                                          'Sales.Product_and_services.Form.Barcode',
                                        )}
                                        <span className='star'>*</span>
                                      </span>
                                    ) : (
                                      ''
                                    )
                                  }
                                  rules={[
                                    {
                                      message: `${t(
                                        'Sales.Product_and_services.Form.Barcode_required',
                                      )}`,
                                      required: true,
                                    },
                                  ]}
                                  style={styles.input}
                                >
                                  <Select optionLabelProp='label'>
                                    {productItem?.product_barcode?.map(
                                      (item: any, index: number) => (
                                        <Select.Option
                                          key={item?.barcode}
                                          value={item?.barcode}
                                          label={item?.barcode}
                                        >
                                          <div>
                                            <Avatar
                                              size='small'
                                              style={{
                                                background: '#10899e',
                                              }}
                                            >
                                              {item?.unit?.name}
                                            </Avatar>{' '}
                                            {item?.barcode}
                                          </div>
                                        </Select.Option>
                                      ),
                                    )}
                                  </Select>
                                </Form.Item>
                              </Col>

                              <Col span={8}>
                                <Form.Item
                                  {...field}
                                  validateTrigger={['onChange', 'onBlur']}
                                  name={[field.name, 'concat']}
                                  style={styles.input}
                                  valuePropName='checked'
                                >
                                  <Checkbox>
                                    {t(
                                      'Sales.Product_and_services.Form.Concat_unit_with_name',
                                    )}
                                  </Checkbox>
                                </Form.Item>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      );
                    })}
                  </>
                )}
              </Form.List>
            </Col>
          </Row>
          <div
            style={{
              display: 'none',
              overflow: 'hidden',
              height: '0',
              textAlign: 'center',
            }}
            ref={printRef}
          >
            <PriceLabel
              products={products}
              vipPercent={vipPercent?.data?.vip_price?.percent}
            />
          </div>
          <Form.Item
            className='margin'
            style={{
              textAlign: 'end',
              paddingInlineEnd: '20px',
              margin: '2px 0px',
            }}
          >
            <Space>
              <CancelButton onClick={handleCancel} />

              <Button type='primary' htmlType='submit' loading={loading}>
                {t('Form.Print')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

const styles = {
  formItem: { marginBottom: '7px' },
  input: { marginBottom: '0px' },
};
