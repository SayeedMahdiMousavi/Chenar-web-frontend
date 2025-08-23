import React, { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Form,
  Modal,
  InputNumber,
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
import ProductLabelPrint from '../../../PrintComponents/ProductLabelPrint';
import chunk from 'lodash/chunk';
import { debounce } from 'throttle-debounce';
import { BARCODE_LABEL_TYPE } from '../../../LocalStorageVariables';

const { Title } = Typography;
interface IProps {
  record?: any;
  selectedRows?: any;
  type: string;
  setVisible?: (value: boolean) => void;
  setSelectedRows?: (value: any) => void;
  setSelectedRowKeys?: (value: any) => void;
}
export default function PrintBarcode(props: IProps) {
  const printRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [products, setProducts] = useState<any>([]);
  const [isGeItems, setIsGeItems] = useState(false);
  const [type] = useState(() => localStorage.getItem(BARCODE_LABEL_TYPE));

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

  const makeProductList = (
    qty: number,
    barcode: string,
    concat: boolean,
    unit: string,
  ) => {
    let newProducts = [];
    for (let i = 1; i <= qty; i++) {
      const element = {
        id: i,
        name: concat ? `${props?.record?.name} (${unit})` : props?.record?.name,
        barcode: barcode,
        price: parseInt(
          props?.record?.price?.find((item: any) =>
            item?.unit_pro_relation?.includes('base_unit'),
          )?.sales_rate,
        ),
      };
      newProducts.push(element);
    }
    const chankedItems = chunk(
      newProducts,
      type === '10' ? 10 : type === '8' ? 8 : 10,
    );
    return chankedItems;
  };
  const makeProductsList = (labelList: any) => {
    let id = 1;
    const newProductsItems = labelList?.reduce((prev: any, item: any) => {
      let newProducts: any = [];
      const unit = item?.product_barcode?.find(
        (unitItem: any) => unitItem?.barcode === item?.barcode,
      )?.unit?.name;
      for (let i = 1; i <= parseInt(item?.qty); i++) {
        const element = {
          id: id,
          name: item?.concat ? `${item?.product} (${unit})` : item?.product,
          barcode: item?.barcode,
        };
        newProducts.push(element);
        id = id + 1;
      }
      return [...prev, ...newProducts];
    }, []);
    const chankedItem = chunk(
      newProductsItems,
      type === '10' ? 10 : type === '8' ? 8 : 10,
    );
    return chankedItem;
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

    return new Promise(async (resolve, reject) => {
      if (props.type === 'batch') {
        const newProducts = await makeProductsList(value?.labelList);

        if (newProducts?.length > 0) {
          setProducts(newProducts);
          setTimeout(() => {
            //@ts-ignore
            handlePrint();
            setLoading(false);
            //@ts-ignore
            resolve();
          }, 1000);
        } else {
          setLoading(false);
        }
      } else {
        const qty = parseFloat(value?.qty) > 400 ? 400 : value?.qty;
        const unit = props?.record?.product_barcode?.find(
          (item: any) => item?.barcode === value?.barcode,
        )?.unit?.name;
        setProducts(makeProductList(qty, value?.barcode, value?.concat, unit));
        setTimeout(() => {
          //@ts-ignore
          handlePrint();
          setLoading(false);
          //@ts-ignore
          resolve();
        }, 1000);
      }
    });
  };
  const showModal = () => {
    if (props.setVisible) {
      props.setVisible(false);
    }

    if (props.type !== 'batch') {
      const baseUnit = props?.record?.product_units?.find(
        (item: any) => item?.base_unit === true,
      );

      form.setFieldsValue({
        barcode: findDefaultBarcode(props?.record?.product_barcode, baseUnit),
      });
      setVisible(true);
    } else {
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
        setIsGeItems(true);
      }, 1000);
      if (props.type === 'batch' && productItems?.length === 0) {
      } else {
        setVisible(true);
      }

      if (ok) {
        message.error(
          t('Sales.Product_and_services.Form.Barcode_remove_message'),
        );
      }
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handelAfterClose = () => {
    form.resetFields();
    setLoading(false);
    setProducts([]);
    setIsGeItems(false);
  };

  const getItem = useCallback(
    (itemIndex: number): any => {
      const formValue = form.getFieldsValue();
      const item = formValue?.labelList?.find(
        (item: any, index: number) => index === itemIndex,
      );

      return item;
    },
    [isGeItems],
  );

  const onChangeQty = (value: any) => {
    const newValue = value ?? 0;
    if (props.type === 'batch') {
      debounceFunc(newValue);
    }
  };
  const debounceFunc = debounce(700, async (value: string) => {
    const formValue = form.getFieldsValue();
    form.setFieldsValue({
      labelList: formValue?.labelList?.map((item: any) => {
        return {
          ...item,
          qty: value,
        };
      }),
    });
  });

  const inputNumberFocus = (e: any) => {
    e.target.select();
  };

  return (
    <div>
      <div onClick={showModal}>
        {t('Sales.Product_and_services.Print_label')}
      </div>
      <Modal
        maskClosable={false}
        open={visible}
        onOk={onFinish}
        onCancel={handleCancel}
        footer={null}
        centered
        width={props?.type === 'batch' ? 720 : 360}
        afterClose={handelAfterClose}
        style={{ paddingTop: '20px', paddingBottom: '15px' }}
        bodyStyle={{ padding: '24px 24px 15px 24px' }}
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
          <div
            style={{
              display: 'none',
              overflow: 'hidden',
              height: '0',
              textAlign: 'center',
            }}
            ref={printRef}
          >
            <ProductLabelPrint
              products={products}
              //@ts-ignore
              type={type}
            />
          </div>
          <Title level={5}>{t('Sales.Product_and_services.Print_label')}</Title>
          <Row className='num'>
            <Col
              span={24}
              style={{
                maxHeight: `calc(100vh - 177px)`,
                overflowY: 'auto',
                marginBottom: '20px',
                paddingBottom: '7px',
              }}
            >
              <Row gutter={props.type === 'batch' ? 10 : 0} className='num'>
                <Col span={props.type === 'batch' ? 7 : 24}>
                  {' '}
                  <Form.Item
                    name='qty'
                    label={
                      <span>
                        {t('Sales.All_sales.Invoice.Quantity')}{' '}
                        <span className='star'>*</span>
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: `${t(
                          'Sales.All_sales.Invoice.Quantity_required',
                        )}`,
                      },
                    ]}
                    style={styles.formItem}
                  >
                    <InputNumber
                      onFocus={inputNumberFocus}
                      autoFocus
                      min={1}
                      max={props.type === 'batch' ? 100 : 200}
                      className='num'
                      onChange={onChangeQty}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {props.type === 'batch' ? null : (
                <Form.Item
                  name='barcode'
                  label={
                    <span>
                      {t('Sales.Product_and_services.Form.Barcode')}
                      <span className='star'>*</span>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: `${t(
                        'Sales.Product_and_services.Form.Barcode_required',
                      )}`,
                    },
                  ]}
                  style={styles.formItem}
                >
                  <Select optionLabelProp='label'>
                    {props?.record?.product_barcode?.map(
                      (item: any, index: number) => (
                        <Select.Option
                          key={item?.barcode}
                          value={item?.barcode}
                          label={item?.barcode}
                        >
                          <div>
                            <Avatar
                              size='small'
                              style={{ background: '#10899e' }}
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
              )}
              {props.type === 'batch' ? null : (
                <Form.Item
                  name='concat'
                  style={{ marginTop: '0px', marginBottom: '10px' }}
                  valuePropName='checked'
                >
                  <Checkbox>
                    {t('Sales.Product_and_services.Form.Concat_unit_with_name')}
                  </Checkbox>
                </Form.Item>
              )}
              {props?.type === 'batch' ? (
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
                                <Col span={7}>
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
                                <Col span={6}>
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
                                <Col span={4}>
                                  <Form.Item
                                    {...field}
                                    validateTrigger={['onChange', 'onBlur']}
                                    name={[field.name, 'qty']}
                                    label={
                                      index === 0 ? (
                                        <span>
                                          {t(
                                            'Sales.All_sales.Invoice.Quantity',
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
                                          'Sales.All_sales.Invoice.Quantity_required',
                                        )}`,
                                        required: true,
                                      },
                                    ]}
                                    style={styles.input}
                                  >
                                    <InputNumber
                                      onFocus={inputNumberFocus}
                                      min={1}
                                      max={100}
                                      className='num'
                                      style={{ width: '100%' }}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col span={7}>
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
              ) : null}
            </Col>
          </Row>

          <Form.Item
            className='margin'
            style={{
              textAlign: 'end',
              marginBottom: '2px',
              // paddingInlineEnd: "24px",
            }}
          >
            <Space>
              <Button shape='round' onClick={handleCancel}>
                {t('Form.Cancel')}
              </Button>

              <Button
                type='primary'
                shape='round'
                htmlType='submit'
                loading={loading}
              >
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
