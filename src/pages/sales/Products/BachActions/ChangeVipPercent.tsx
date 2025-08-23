import React, { useState } from 'react';
import {
  Modal,
  Form,
  message,
  Row,
  Col,
  InputNumber,
  Button,
  Input,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../../ApiBaseUrl';
import { Styles } from '../../../styles';
import { useMediaQuery } from '../../../MediaQurey';
import { ModalDragTitle } from '../../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { print, math, fixedNumber } from '../../../../Functions/math';
import { debounce } from 'throttle-debounce';
import { CancelButton, SaveButton } from '../../../../components';

interface IProps {
  setSelectedRows: (value: any) => void;
  setSelectedRowKeys: (value: any) => void;
  baseUrl: string;
  selectedRows: any;
  record: any;
}

const ChangeVipPercent: React.FC<IProps> = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [updateForm, setUpdateForm] = useState(false);
  const [form] = Form.useForm();
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');

  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    form.resetFields();
  };

  const handleAfterClose = () => {
    setLoading(false);
    form.resetFields();
  };

  const { mutate: mutateAddVipPrice } = useMutation(
    async (value: any) =>
      await axiosInstance
        .post(`/product/price/vip/`, value)
        .then(() => {
          let selectedRows = props.selectedRows;
          const updateItems = value?.reduce((sum: any, item: any) => {
            const newItem = props.selectedRows?.find(
              (rowItem: any) => rowItem.id === item?.product,
            );

            selectedRows = selectedRows?.filter(
              (rowItem: any) => rowItem.id !== item?.product,
            );
            return [
              ...sum,
              {
                ...newItem,
                vip_price: { vip_percent: item?.vip_percent },
              },
            ];
          }, []);
          props.setSelectedRows([...selectedRows, ...updateItems]);
          message.success(
            t('Sales.Product_and_services.Form.Vip_save_message'),
          );
          setVisible(false);
        })
        .catch((error) => {
          setLoading(false);
          if (error?.response?.data?.vip_percent?.[0]) {
            message.error(`${error?.response?.data?.vip_percent?.[0]}`);
          } else if (error?.response?.data?.product?.[0]) {
            message.error(`${error?.response?.data?.product?.[0]}`);
          }
        }),
    {
      onSuccess: () => queryClient.invalidateQueries(`${props.baseUrl}`),
    },
  );
  const { mutate: mutateEditVipPrice } = useMutation(
    async (value: any) =>
      await axiosInstance
        .put(`/product/price/vip/${props?.record?.id}/`, value)
        .then(() => {
          message.success(
            t('Sales.Product_and_services.Form.Vip_save_message'),
          );
          setVisible(false);
        })
        .catch((error) => {
          setLoading(false);
          if (error?.response?.data?.vip_percent?.[0]) {
            message.error(`${error?.response?.data?.vip_percent?.[0]}`);
          } else if (error?.response?.data?.product?.[0]) {
            message.error(`${error?.response?.data?.product?.[0]}`);
          }
        }),
    {
      onSuccess: () => queryClient.invalidateQueries(`${props.baseUrl}`),
    },
  );

  let oneRequest = false;

  const onFinish = async (values: any) => {
    form
      .validateFields()
      .then(async (values) => {
        if (values?.addVipPercent === 0) {
          setVisible(false);
          message.success(
            t('Sales.Product_and_services.Form.Vip_save_message'),
          );
        } else {
          setLoading(true);
          if (oneRequest) {
            return;
          }
          oneRequest = true;

          try {
            // if (props?.record?.vip_price?.vip_percent) {
            //   mutateEditVipPrice({
            //     vip_percent: fixedNumber(vipPercent, 20),
            //     product: props?.record?.id,
            //   });
            // } else {
            const vipPrice = values?.addVipPercent?.map((item: any) => {
              return {
                vip_percent: fixedNumber(item?.vipPercent, 20),
                product: item.id,
              };
            });

            mutateAddVipPrice(vipPrice);
            // }

            oneRequest = false;
          } catch (info) {
            oneRequest = false;
          }
        }
      })
      .catch((info) => {});
  };

  const checkVipPrice = (vipPercent: any, sales: number, purchase: number) => {
    const vipPrice =
      sales && purchase
        ? print(
            //@ts-ignore
            math.evaluate(`(${sales}-${purchase})*${vipPercent}/100`),
          )
        : 0;
    //@ts-ignore
    // return math.floor(vipPrice);
    return Math.round(vipPrice);
  };
  const checkVipPercent = (value: any, baseUnit: any, itemIndex: number) => {
    const vipPrice =
      baseUnit?.sales_rate && baseUnit?.perches_rate
        ? print(
            //@ts-ignore
            math.evaluate(
              `(${value}*100)/(${baseUnit?.sales_rate}-${baseUnit?.perches_rate})`,
            ),
          )
        : 0;
    //@ts-ignore
    return { percent: parseInt(vipPrice), vipPercent: parseFloat(vipPrice) };
  };

  const showModal = async () => {
    const productItems = props?.selectedRows?.filter(
      (item: any) =>
        item?.is_have_vip_price === true &&
        item?.vip_price === null &&
        item?.price?.find((item: any) =>
          item?.unit_pro_relation?.includes('base_unit'),
        ),
    );
    const ok = props?.selectedRows?.some(
      (item: any) =>
        !item?.price?.find((item: any) =>
          item?.unit_pro_relation?.includes('base_unit'),
        ),
    );
    if (productItems.length > 0) {
      if (ok) {
        message.error(
          t('Sales.Product_and_services.Form.Vip_base_unit_price_bulk_message'),
        );
      }
      form.setFieldsValue({
        addVipPercent: productItems?.map((item: any) => {
          const baseUnit = item?.price?.find((item: any) =>
            item?.unit_pro_relation?.includes('base_unit'),
          );
          const vipPrice = checkVipPrice(
            //@ts-ignore
            80,
            baseUnit?.sales_rate,
            baseUnit?.perches_rate,
          );

          const benefit =
            baseUnit?.sales_rate && baseUnit?.perches_rate
              ? print(
                  //@ts-ignore
                  math.evaluate(`${baseUnit?.sales_rate}-${vipPrice}`),
                )
              : 0;
          const profit =
            parseFloat(baseUnit?.sales_rate) -
            parseFloat(baseUnit?.perches_rate);
          if (item?.vip_price?.vip_percent) {
            const vipPrice = checkVipPrice(
              parseFloat(item?.vip_price?.vip_percent),
              baseUnit?.sales_rate,
              baseUnit?.perches_rate,
            );

            return {
              product: item?.name,
              percent: parseInt(item?.vip_price?.vip_percent),
              price: parseFloat(baseUnit?.sales_rate) - vipPrice,
              id: item?.id,
              baseUnit: baseUnit,
              benefit: benefit,
              vipPercent: parseFloat(item?.vip_price?.vip_percent),
              profit: profit ? Math.floor(profit) : 0,
            };
          } else {
            return {
              product: item?.name,
              percent: undefined,
              price: baseUnit?.sales_rate,
              id: item?.id,
              baseUnit: baseUnit,
              benefit: benefit,
              vipPercent: 0,
              profit: profit ? Math.floor(profit) : 0,
            };
          }
        }),
      });

      setVisible(true);

      setTimeout(() => {
        setUpdateForm((prev) => !prev);
      }, 1000);
    } else {
      message.error(
        t('Sales.Product_and_services.Form.Vip_percent_bulk_message'),
      );
    }
  };

  const getItem = React.useCallback(
    (itemIndex: number): any => {
      const formValue = form.getFieldsValue();
      const item = formValue?.addVipPercent?.find(
        (item: any, index: number) => index === itemIndex,
      );

      return item;
    },
    [updateForm],
  );

  const handelChangePercent = (
    value: string | number | null | undefined,
    itemIndex: number,
  ) => {
    debounceFunHandelChangePercent(value, itemIndex);
  };

  const debounceFunHandelChangePercent = debounce(
    500,
    async (value: string | number | null | undefined, itemIndex: number) => {
      const formValue = form.getFieldsValue();

      const baseUnit: any = formValue?.addVipPercent?.find(
        (item: any, index: number) => index === itemIndex,
      )?.baseUnit;

      //@ts-ignore
      if (value && parseInt(value)) {
        //@ts-ignore
        const vipPrice = checkVipPrice(
          //@ts-ignore
          parseFloat(value),
          baseUnit?.sales_rate,
          baseUnit?.perches_rate,
        );
        form.setFieldsValue({
          addVipPercent: formValue?.addVipPercent?.map(
            (item: any, index: number) => {
              if (index === itemIndex) {
                return {
                  ...item,
                  price: parseFloat(baseUnit?.sales_rate) - vipPrice,
                  //@ts-ignore
                  vipPercent: parseFloat(value),
                };
              } else {
                return item;
              }
            },
          ),
        });
      } else {
        form.setFieldsValue({
          addVipPercent: formValue?.addVipPercent?.map(
            (item: any, index: number) => {
              if (index === itemIndex) {
                return {
                  ...item,
                  price: parseFloat(baseUnit?.sales_rate),
                  //@ts-ignore
                  vipPercent: parseFloat(value),
                };
              } else {
                return item;
              }
            },
          ),
        });
      }
    },
  );

  const handelChangePrice = (
    value: string | number | null | undefined,
    itemIndex: any,
  ) => {
    debounceFunHandelChangePrice(value, itemIndex);
  };

  const debounceFunHandelChangePrice = debounce(
    500,
    async (value: string | number | null | undefined, itemIndex: number) => {
      const formValue = form.getFieldsValue();
      if (value) {
        const productItem: any = formValue?.addVipPercent?.find(
          (item: any, index: number) => index === itemIndex,
        );
        const baseUnit: any = productItem?.baseUnit;
        const benefit: any = productItem?.benefit;
        //@ts-ignore
        const newValue = parseFloat(value) < benefit ? benefit : value;
        const vipValue =
          //@ts-ignore
          parseFloat(baseUnit?.sales_rate) - parseFloat(newValue);

        //@ts-ignore
        const vipPercent = checkVipPercent(vipValue, baseUnit, itemIndex);

        form.setFieldsValue({
          addVipPercent: formValue?.addVipPercent?.map(
            (item: any, index: number) => {
              if (index === itemIndex) {
                return {
                  ...item,
                  percent: vipPercent?.percent,
                  price: newValue,
                  vipPercent: vipPercent?.vipPercent,
                  // price: parseFloat(baseUnit?.sales_rate),
                  // //@ts-ignore
                  // vipPercent: parseFloat(value),
                };
              } else {
                return item;
              }
            },
          ),
        });
      } else {
        form.setFieldsValue({
          addVipPercent: formValue?.addVipPercent?.map(
            (item: any, index: number) => {
              if (index === itemIndex) {
                return {
                  ...item,
                  percent: 0,
                };
              } else {
                return item;
              }
            },
          ),
        });
      }
    },
  );

  const numberInputReg = /^0/;

  const percent = (value1: any) => {
    const value = value1.replace('%', '');
    return value > 80
      ? 80
      : value < 0
        ? 0
        : numberInputReg.test(value)
          ? 0
          : value;
  };

  //   ,
  //   [form]
  // );
  const regex = /^[1-9]d*$/;
  const price = (value: any, ItemIndex: number) => {
    return value > parseFloat(getItem(ItemIndex)?.base_unit?.sales_rate)
      ? parseFloat(getItem(ItemIndex)?.base_unit?.sales_rate)
      : numberInputReg.test(value)
        ? getItem(ItemIndex)?.benefit
        : !regex.test(value) && value
          ? parseInt(value)
          : value;
  };

  const inputNumberFocus = (e: any) => {
    e.target.select();
  };

  return (
    <div>
      <div onClick={showModal} className='num'>
        {t('Sales.Product_and_services.Form.Vip_percent')}
      </div>
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Sales.Product_and_services.Form.Vip_percent')}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
        destroyOnClose
        afterClose={handleAfterClose}
        open={visible}
        width={600}
        okButtonProps={{ loading: loading }}
        centered
        onCancel={handleCancel}
        onOk={onFinish}
        style={Styles.modal(isMobile)}
        bodyStyle={Styles.modalBody(isMobile, isSubBase, isMiniTablet)}
        footer={
          <Row justify='end'>
            <Col>
              <CancelButton onClick={handleCancel} />
              <SaveButton onClick={onFinish} loading={loading} />
            </Col>
          </Row>
        }
      >
        <Form form={form} layout='vertical' hideRequiredMark>
          <Row align='middle'>
            <Col span={24}>
              <Form.List name='addVipPercent'>
                {(fields, { add, remove }) => (
                  <>
                    {fields?.map((field, index) => {
                      const productItem = getItem(index);

                      return (
                        <Row
                          key={field.key}
                          align='bottom'
                          style={{
                            marginBottom: 17,
                          }}
                          className='editable-row'
                        >
                          <Col span={24}>
                            <Row align='bottom' gutter={10}>
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
                              <Col span={5}>
                                <Form.Item
                                  {...field}
                                  validateTrigger={['onChange', 'onBlur']}
                                  name={[field.name, 'profit']}
                                  label={
                                    index === 0 ? (
                                      <span>{t('Reports.Profit')} </span>
                                    ) : (
                                      ''
                                    )
                                  }
                                  style={styles.input}
                                >
                                  <InputNumber className='num' readOnly />
                                </Form.Item>
                              </Col>
                              <Col span={5}>
                                <Form.Item
                                  {...field}
                                  validateTrigger={['onChange', 'onBlur']}
                                  name={[field.name, 'percent']}
                                  label={
                                    index === 0 ? (
                                      <span>
                                        {t('Sales.Customers.Discount.Percent')}{' '}
                                        <span className='star'>*</span>
                                      </span>
                                    ) : (
                                      ''
                                    )
                                  }
                                  rules={[
                                    {
                                      message: `${t(
                                        'Sales.Customers.Discount.Required_percent',
                                      )}`,
                                      required: true,
                                    },
                                  ]}
                                  style={styles.input}
                                >
                                  <InputNumber
                                    min={0}
                                    max={80}
                                    className='num'
                                    onChange={(value: any) =>
                                      handelChangePercent(value, index)
                                    }
                                    formatter={(value) => `${value}%`}
                                    onFocus={inputNumberFocus}
                                    parser={percent}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={5}>
                                <Form.Item
                                  {...field}
                                  validateTrigger={['onChange', 'onBlur']}
                                  name={[field.name, 'price']}
                                  label={
                                    index === 0 ? (
                                      <span>
                                        {t(
                                          'Sales.Product_and_services.Form.Price',
                                        )}
                                      </span>
                                    ) : (
                                      ''
                                    )
                                  }
                                  style={styles.input}
                                >
                                  <InputNumber
                                    max={
                                      getItem(index)?.baseUnit
                                        ? parseFloat(
                                            productItem?.baseUnit?.sales_rate,
                                          )
                                        : undefined
                                    }
                                    min={
                                      productItem?.benefit &&
                                      parseFloat(productItem?.benefit)
                                    }
                                    className='num'
                                    onChange={(value: any) =>
                                      handelChangePrice(value, index)
                                    }
                                    onFocus={inputNumberFocus}
                                    parser={(value: any) => price(value, index)}
                                    formatter={(value: any) =>
                                      price(value, index)
                                    }
                                  />
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
        </Form>
      </Modal>
    </div>
  );
};
export default ChangeVipPercent;

interface IStyles {
  equal1: React.CSSProperties;
  input: React.CSSProperties;
  minus: React.CSSProperties;
}

const styles: IStyles = {
  equal1: { paddingBottom: 6, textAlign: 'center' },
  input: { marginBottom: '0px' },
  minus: {
    paddingTop: 9,
    paddingInlineStart: 9,
    paddingBottom: 9,
  },
};
