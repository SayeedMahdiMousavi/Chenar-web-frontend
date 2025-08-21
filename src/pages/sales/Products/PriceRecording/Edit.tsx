import React, { useState } from 'react';
import {
  Modal,
  Form,
  Select,
  message,
  Row,
  Col,
  InputNumber,
  Button,
  Input,
  Popover,
  Descriptions,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../../ApiBaseUrl';
import { Styles } from '../../../styles';
import { useMediaQuery } from '../../../MediaQurey';
import { ModalDragTitle } from '../../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { ActionMessage } from '../../../SelfComponents/TranslateComponents/ActionMessage';
import {
  InfoCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { CancelButton, SaveButton } from '../../../../components';

interface IProps {
  setVisible: (value: boolean) => void;
  record: any;
  // priceRecording:any
  baseUrl: string;
}

const EditPriceRecording: React.FC<IProps> = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [baseUnit, setBaseUnit] = useState<{ id: number; name: string }>();
  const [form] = Form.useForm();

  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');

  const handleCancel = () => {
    setVisible(false);
  };
  const handleAfterClose = () => {
    setLoading(false);
    form.resetFields();
    //@ts-ignore
    setBaseUnit();
  };

  const showModal = async () => {
    if (
      props?.record?.product_units?.length - 1 !==
      props?.record?.unit_conversion?.length
    ) {
      message.error(
        t(
          'Sales.Product_and_services.Price_recording.Unit_conversion_not_exist_message'
        )
      );
    } else {
      props.setVisible(false);
      const baseUnit = props?.record?.product_units?.find(
        (item: any) => item?.base_unit === true
      );

      setBaseUnit({ id: baseUnit?.unit?.id, name: baseUnit?.unit?.name });

      form.setFieldsValue({
        priceRecording: await props?.record?.price?.map((item: any) => {
          return {
            unit: { value: item?.unit?.id, label: item?.unit?.name },
            product: props?.record?.id,
            currency: props?.record?.currency?.id,
            currency_rate: 1,
            sales_rate: item?.sales_rate && parseFloat(item?.sales_rate),
          };
        }),

        name: props?.record?.name,
        purchase:
          props?.record?.price?.length !== 0
            ? parseFloat(
                props?.record?.price?.find((item: any) =>
                  item?.unit_pro_relation?.includes('base_unit')
                )?.perches_rate
              )
            : '',
      });

      setVisible(true);
    }
  };
  const addPriceRecording = async (value: any) => {
    await axiosInstance
      .post(`/product/price/bulk_create/`, value)
      .then((res) => {
        setVisible(false);

        message.success(
          <ActionMessage
            name={props?.record?.name}
            message='Sales.Product_and_services.Price_recording.Add_message'
          />
        );
      })
      .catch((error) => {
        setLoading(false);
        if (error?.response?.data?.non_field_errors?.[0]) {
          message.error(`${error?.response.data?.non_field_errors?.[0]}`);
        }
      });
  };
  const { mutate: mutateAddPriceRecording } = useMutation(addPriceRecording, {
    onSuccess: () => {
      queryClient.invalidateQueries(`${props.baseUrl}price/`);
      queryClient.invalidateQueries(`${props.baseUrl}`);
    },
  });
  const editPriceRecording = async (value: any) => {
    await axiosInstance
      .put(`/product/price/bulk_update/${props?.record?.id}/`, value)
      .then((res) => {
        setVisible(false);
        message.success(
          <ActionMessage
            name={props.record?.name}
            message='Sales.Product_and_services.Price_recording.Update_message'
          />
        );
      })
      .catch((error) => {
        setLoading(false);
        if (error?.response?.data?.non_field_errors?.[0]) {
          message.error(`${error?.response.data?.non_field_errors?.[0]}`);
        }
      });
  };
  const { mutate: mutateEditPriceRecording } = useMutation(editPriceRecording, {
    onSuccess: () => {
      queryClient.invalidateQueries(`${props.baseUrl}price/`);
      queryClient.invalidateQueries(`${props.baseUrl}`);
    },
  });

  const getPriceRecording = (unitId: number) => {
    const unit = props?.record?.unit_conversion?.find(
      (item: any) => item?.from_unit?.id === unitId
    );
    return unit?.ratio ? unit?.ratio : 0;
  };

  const onFinish = () => {
    form
      .validateFields()
      .then(async (values) => {
        const isBaseUnitExist = values?.priceRecording?.find(
          (item: any) => item?.unit?.value === baseUnit?.id
        );
        const price = isBaseUnitExist
          ? values?.priceRecording
          : [
              ...values?.priceRecording,
              {
                sales_rate: 0,
                purchase: values?.purchase,
                product: props.record?.id,
                unit: { value: baseUnit?.id, label: baseUnit?.name },
                currency: props?.record?.currency?.id,
              },
            ];
        const isSalesLessThanPurchase = price?.every((item: any) => {
          const purchase = getPriceRecording(item.unit?.value)
            ? parseFloat(getPriceRecording(item.unit?.value)) *
              parseFloat(values?.purchase)
            : parseFloat(values?.purchase);
          return parseFloat(item?.sales_rate) > purchase;
        });

        const priceRecording = price?.map((item: any) => {
          return {
            sales_rate: item?.sales_rate,
            perches_rate: getPriceRecording(item.unit?.value)
              ? parseFloat(getPriceRecording(item.unit?.value)) *
                parseFloat(values?.purchase)
              : values?.purchase,
            product: item?.product,
            unit: item.unit?.value,
            currency: item?.currency,
            currency_rate: 1,
          };
        });
        setLoading(true);
        if (props?.record?.price?.length === 0) {
          mutateAddPriceRecording(priceRecording);
        } else {
          mutateEditPriceRecording(priceRecording);
        }
        if (!isSalesLessThanPurchase) {
          Modal.warning({
            bodyStyle: { direction: t('Dir') },
            title: (
              <ActionMessage
                name={props?.record?.name}
                message={
                  'Sales.All_sales.Invoice.error_message_when_sales_is_less_than_purchase'
                }
              />
            ),

            content: (
              <img
                width='200px'
                height='200px'
                src='/gif/salesError.gif'
                alt='fklasdfsa'
              />
            ),
          });
        }
      })
      .catch((info) => {});
  };

  const onChangeUnit = (value: any, itemIndex: number) => {
    const formValue = form.getFieldsValue();

    const unitLength = formValue?.priceRecording?.reduce(
      (sum: number, item: any) => {
        if (item?.unit?.label === value?.label) {
          return sum + 1;
        } else {
          return sum;
        }
      },
      0
    );

    if (unitLength > 1) {
      Modal.warning({
        bodyStyle: { direction: t('Dir') },
        title: t(
          'Sales.Product_and_services.Price_recording.Price_exist_message'
        ),
        onOk: () => {
          const newPrice = formValue?.priceRecording?.map(
            (item: any, index: number) => {
              if (index === itemIndex) {
                return { ...item, unit: undefined };
              } else {
                return item;
              }
            }
          );
          form.setFieldsValue({ priceRecording: newPrice });
        },
      });
    }
  };

  const handleStopPropagation = (e: any) => {
    e.stopPropagation();
  };

  const handleFocus = (e: any) => {
    e.target.select();
  };
  return (
    <div onDoubleClick={handleStopPropagation}>
      <div onClick={showModal} className='num'>
        {t(
          'Sales.Product_and_services.Price_recording.Add_or_edit_price_recording'
        )}
      </div>
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t(
              'Sales.Product_and_services.Price_recording.Add_or_edit_price_recording'
            )}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
        destroyOnClose
        open={visible}
        width={500}
        okButtonProps={{ loading: loading }}
        centered
        onCancel={handleCancel}
        afterClose={handleAfterClose}
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
          <Row gutter={10}>
            <Col style={{ width: '220px' }}>
              <Form.Item
                name='name'
                style={styles.formItem}
                label={
                  <span>
                    {t('Sales.Product_and_services.Product')}{' '}
                    {props?.record?.unit_conversion?.length > 0 && (
                      <Popover
                        arrowPointAtCenter
                        title={t(
                          'Sales.Product_and_services.Form.Unit_conversion'
                        )}
                        trigger='hover'
                        content={
                          <Descriptions
                            size='small'
                            style={styles.popover}
                            column={{
                              xxl: 1,
                              xl: 1,
                              lg: 1,
                              md: 1,
                              sm: 1,
                              xs: 1,
                            }}
                          >
                            {props?.record?.unit_conversion?.map(
                              (item: any) => (
                                <Descriptions.Item
                                  key={item?.id}
                                  label={`1 ${item?.from_unit?.name}`}
                                >
                                  {parseFloat(item?.ratio)}{' '}
                                  {
                                    props?.record?.product_units?.find(
                                      (item: any) => item?.base_unit === true
                                    )?.unit?.name
                                  }
                                </Descriptions.Item>
                              )
                            )}
                          </Descriptions>
                        }
                      >
                        <InfoCircleOutlined />
                        &nbsp;
                      </Popover>
                    )}
                  </span>
                }
              >
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col style={{ width: 'calc(50% + 11px' }}>
              <Form.Item
                name='purchase'
                style={styles.formItem}
                label={
                  <span>
                    {t(
                      'Sales.Product_and_services.Price_recording.Base_unit_purchase'
                    )}
                    ({baseUnit?.name})<span className='star'>*</span>
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: t(
                      'Sales.Product_and_services.Price_recording.Purchases_required'
                    ),
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  type='number'
                  className='num'
                  inputMode='numeric'
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.List name='editPriceRecording'>
                {(fields, { add, remove }) => (
                  <>
                    {fields?.map((field, index) => (
                      <Row
                        key={field.key}
                        style={{
                          marginBottom: 17,
                        }}
                        className='editable-row'
                      >
                        <Col span={24}>
                          <Row gutter={10}>
                            <Col span={12}>
                              <Form.Item
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                fieldKey={[field.fieldKey, 'sales_rate']}
                                name={[field.name, 'sales_rate']}
                                label={
                                  index === 0 ? (
                                    <span>
                                      {t('Sales.1')}
                                      <span className='star'>*</span>
                                    </span>
                                  ) : (
                                    ''
                                  )
                                }
                                style={styles.input}
                                rules={[
                                  {
                                    required: true,
                                    message: t(
                                      'Sales.Product_and_services.Price_recording.Sales_required'
                                    ),
                                  },
                                ]}
                              >
                                <InputNumber
                                  min={0.01}
                                  type='number'
                                  className='num'
                                  inputMode='numeric'
                                />
                              </Form.Item>
                            </Col>

                            <Col span={12}>
                              <Form.Item
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                name={[field.name, 'unit']}
                                fieldKey={[field.fieldKey, 'unit']}
                                label={
                                  index === 0 ? (
                                    <span>
                                      {t(
                                        'Sales.Product_and_services.Units.Unit'
                                      )}
                                    </span>
                                  ) : (
                                    ''
                                  )
                                }
                                rules={[
                                  {
                                    message: `${t('Form.Required')}`,
                                    required: true,
                                  },
                                ]}
                                style={styles.input}
                              >
                                <Select labelInValue>
                                  {props?.record?.product_units
                                    ?.filter(
                                      (item: any) =>
                                        item?.unit?.id !==
                                        props?.record?.product_units.filter(
                                          (item: any) =>
                                            item?.base_unit === true
                                        )?.[0]?.unit?.id
                                    )
                                    ?.map((item: any) => (
                                      <Select.Option
                                        value={item?.unit?.id}
                                        label={item?.unit?.name}
                                      >
                                        {item?.unit?.name}
                                      </Select.Option>
                                    ))}
                                </Select>
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    ))}
                  </>
                )}
              </Form.List>
            </Col>
            <Col span={24}>
              <Form.List name='priceRecording'>
                {(fields, { add, remove }) => (
                  <>
                    {fields?.map((field, index) => (
                      <Row
                        key={field.key}
                        style={{
                          marginBottom: 17,
                        }}
                        align='bottom'
                        className='editable-row'
                      >
                        <Col
                          style={{
                            width: `calc(100% - 23px)`,
                          }}
                        >
                          <Row gutter={10} align='bottom'>
                            <Col span={12}>
                              <Form.Item
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                fieldKey={[field.fieldKey, 'sales_rate']}
                                name={[field.name, 'sales_rate']}
                                label={
                                  index === 0 ? (
                                    <span>
                                      {t('Sales.1')}
                                      <span className='star'>*</span>
                                    </span>
                                  ) : (
                                    ''
                                  )
                                }
                                style={styles.input}
                                rules={[
                                  {
                                    required: true,
                                    message: t(
                                      'Sales.Product_and_services.Price_recording.Sales_required'
                                    ),
                                  },
                                ]}
                              >
                                <InputNumber
                                  min={0.01}
                                  type='number'
                                  className='num'
                                  inputMode='numeric'
                                  onFocus={handleFocus}
                                />
                              </Form.Item>
                            </Col>

                            <Col span={12}>
                              <Form.Item
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                name={[field.name, 'unit']}
                                fieldKey={[field.fieldKey, 'unit']}
                                label={
                                  index === 0 ? (
                                    <span>
                                      {t(
                                        'Sales.Product_and_services.Units.Unit'
                                      )}
                                    </span>
                                  ) : (
                                    ''
                                  )
                                }
                                rules={[
                                  {
                                    message: `${t(
                                      'Sales.Product_and_services.Price_recording.Unit_required'
                                    )}`,
                                    required: true,
                                  },
                                ]}
                                style={styles.input}
                              >
                                <Select
                                  labelInValue
                                  onChange={(value: any) =>
                                    onChangeUnit(value, index)
                                  }
                                >
                                  {props?.record?.product_units?.map(
                                    (item: any) => (
                                      <Select.Option
                                        value={item?.unit?.id}
                                        label={item?.unit?.name}
                                      >
                                        {item?.unit?.name}
                                      </Select.Option>
                                    )
                                  )}
                                </Select>
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                        <Col>
                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                            className='deleteColor'
                            style={styles.minus}
                          />
                        </Col>
                      </Row>
                    ))}
                    {fields?.length < props?.record?.product_units?.length ? (
                      <Form.Item className='margin1'>
                        <Button
                          type='dashed'
                          onClick={() =>
                            add(
                              {
                                unit: undefined,
                                product: props?.record?.id,
                                currency: props?.record?.currency?.id,
                                currency_rate: 1,
                                sales_rate: undefined,
                              },
                              fields.length
                            )
                          }
                          block
                          style={{ width: 208 }}
                          icon={<PlusOutlined className='addItemIcon' />}
                          className='margin1'
                        >
                          {t(
                            'Sales.Product_and_services.Price_recording.Add_price'
                          )}
                        </Button>
                      </Form.Item>
                    ) : null}
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
export default EditPriceRecording;
interface IProps {
  equal1: React.CSSProperties;
  input: React.CSSProperties;
  minus: React.CSSProperties;
  formItem: React.CSSProperties;
  popover: React.CSSProperties;
}
//@ts-ignore
const styles: IProps = {
  popover: { width: '150px' },
  equal1: { paddingBottom: 6, textAlign: 'center' },
  input: { marginBottom: '0px' },
  minus: {
    paddingTop: 9,
    paddingInlineStart: 9,
    paddingBottom: 9,
  },
  formItem: { marginBottom: '8px' },
};
