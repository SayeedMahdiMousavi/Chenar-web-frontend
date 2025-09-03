import React, { useState, useRef } from 'react';
import {
  Modal,
  Form,
  Select,
  message,
  Tooltip,
  Row,
  Col,
  InputNumber,
  Button,
  Input,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Styles } from '../../styles';
import { useMediaQuery } from '../../MediaQurey';
import { ModalDragTitle } from '../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { ActionMessage } from '../../SelfComponents/TranslateComponents/ActionMessage';
import { CancelButton, SaveButton } from '../../../components';
import { addMessage, manageErrors, updateMessage } from '../../../Functions';

interface IProps {
  dropVisible: (value: boolean) => void;
  record: any;
  baseUrl: string;
}

const EditUnitConversion: React.FC<IProps> = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const [disabled, setDisabled] = useState<boolean>(true);
  const [form] = Form.useForm();
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');

  const handleCancel = () => {
    setVisible(false);

    form.resetFields();
  };

  const showModal = async () => {
    props.dropVisible(false);
    form.setFieldsValue({
      addUnitConversion: await props?.record?.unit_conversion?.map(
        (item: any) => {
          return {
            from_unit: {
              value: item?.from_unit?.id,
              label: item?.from_unit?.name,
            },
            to_unit: item?.to_unit?.name,
            base_multiplier: item?.ratio,
            multiplier: 1,
            id: item?.id,
          };
        },
      ),
      product: props?.record?.name,
    });
    setVisible(true);
  };

  const handleSuccessEdit = () => {
    queryClient.invalidateQueries(`${props?.baseUrl}`);
    queryClient.invalidateQueries(`${props?.baseUrl}price/`);
    queryClient.invalidateQueries(`${props?.baseUrl}invoice/`);
  };

  const addConversions = async (value: any) =>
    await axiosInstance.post(`/product/unit/conversion/bulk_create/`, value);

  const {
    mutate: mutateAddConversions,
    isLoading,
    reset,
  } = useMutation(addConversions, {
    onSuccess: () => {
      setVisible(false);
      addMessage(
        t('Sales.Product_and_services.Form.Unit_conversion').toLowerCase(),
      );
      handleSuccessEdit();
    },
    onError: (error: any) => {
      manageErrors(error);
      if (error?.response?.data?.non_field_errors?.[0]) {
        message.error(`${error?.response.data?.non_field_errors?.[0]}`);
      }
    },
  });

  const editUnitConversion = async (value: any) =>
    await axiosInstance.put(
      `/product/unit/conversion/bulk_update/${props?.record?.id}/`,
      value,
    );

  const {
    mutate: mutateEditConversions,
    isLoading: isEditLoading,
    reset: editReset,
  } = useMutation(editUnitConversion, {
    onSuccess: () => {
      setVisible(false);
      updateMessage(
        t('Sales.Product_and_services.Form.Unit_conversion').toLowerCase(),
      );
      handleSuccessEdit();
    },
    onError: (error: any) => {
      manageErrors(error);
      if (error?.response?.data?.non_field_errors?.[0]) {
        message.error(`${error?.response.data?.non_field_errors?.[0]}`);
      }
    },
  });

  const onFinish = () => {
    form.validateFields().then(async (values) => {
      const newConversions = values?.addUnitConversion?.map((item: any) => {
        return {
          ratio: item?.base_multiplier,
          from_unit: item?.from_unit?.value,
          product: props?.record?.id,
        };
      });
      if (
        values?.addUnitConversion?.every((item: any) => item.base_multiplier)
      ) {
        if (props?.record?.unit_conversion?.length > 0) {
          mutateEditConversions(newConversions);
        } else {
          mutateAddConversions(newConversions);
        }
      }
    });
  };

  const onChangeFromUnit = (value: any, itemIndex: any) => {
    const formValue = form.getFieldsValue();
    const unitLength = formValue?.addUnitConversion?.reduce(
      (sum: number, item: any) => {
        if (item?.from_unit?.label === value?.label) {
          return sum + 1;
        } else {
          return sum;
        }
      },
      0,
    );

    if (unitLength > 1) {
      Modal.warning({
        bodyStyle: {
          direction: t('Dir') as
            | 'ltr'
            | 'rtl'
            | 'inherit'
            | 'initial'
            | 'unset',
        },
        title: t('Sales.Product_and_services.Unit_conversion_exist_message'),
        onOk: () => {
          const newConversions = formValue?.addUnitConversion?.map(
            (item: any, index: number) => {
              if (index === itemIndex) {
                return { ...item, from_unit: undefined };
              } else {
                return item;
              }
            },
          );
          form.setFieldsValue({ addUnitConversion: newConversions });
        },
      });
    }
  };

  const handleAfterClose = () => {
    form.resetFields();
    editReset();
    reset();
  };

  return (
    <div>
      <div onClick={showModal} className='num'>
        {t('Sales.Product_and_services.Edit_unit_conversion')}
      </div>
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Sales.Product_and_services.Edit_unit_conversion')}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled} nodeRef={ref as React.RefObject<HTMLElement>}>
            <div ref={ref}>{modal}</div>
          </Draggable>
        )}
        destroyOnClose
        afterClose={handleAfterClose}
        open={visible}
        width={550}
        centered
        onCancel={handleCancel}
        onOk={onFinish}
        style={Styles.modal(isMobile)}
        bodyStyle={Styles.modalBody(isMobile, isSubBase, isMiniTablet)}
        footer={
          <Row justify='end'>
            <Col>
              <CancelButton onClick={handleCancel} />
              <SaveButton
                onClick={onFinish}
                loading={isEditLoading || isLoading}
              />
            </Col>
          </Row>
        }
      >
        <Form form={form} layout='vertical' hideRequiredMark>
          <Row align='middle'>
            <Col span={12}>
              {' '}
              <Form.Item
                name='product'
                style={styles.productInput}
                label={t('Sales.Product_and_services.Product')}
              >
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.List name='unitConversion'>
                {(fields, { add, remove }) => (
                  <>
                    {fields?.map((field, index) => (
                      <Row
                        align='bottom'
                        gutter={5}
                        key={field?.key}
                        style={{
                          marginBottom: 17,
                        }}
                        className='editable-row'
                      >
                        <Col span={6}>
                          <Form.Item
                            {...field}
                            validateTrigger={['onChange', 'onBlur']}
                            name={[field.name, 'base_multiplier']}
                            label={
                              index === 0 ? (
                                <span>
                                  {t(
                                    'Sales.Product_and_services.Form.Base_multiplier',
                                  )}
                                  <span className='star'>*</span>
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
                            <InputNumber
                              min={1}
                              type='number'
                              className='num'
                              inputMode='numeric'
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...field}
                            validateTrigger={['onChange', 'onBlur']}
                            name={[field.name, 'to_unit']}
                            label={
                              index === 0
                                ? t(
                                    'Sales.Product_and_services.Form.Default_unit',
                                  )
                                : ''
                            }
                            style={styles.input}
                          >
                            <Select
                              disabled
                              // labelInValue
                              showArrow={false}
                            >
                              {/* <Option Defau>{default1.label}</Option> */}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={1} style={styles.equal1}>
                          =
                        </Col>
                        <Col span={5}>
                          <Form.Item
                            {...field}
                            validateTrigger={['onChange', 'onBlur']}
                            name={[field.name, 'multiplier']}
                            label={
                              index === 0 ? (
                                <span>
                                  {t(
                                    'Sales.Product_and_services.Form.Multiplier',
                                  )}
                                  {/* <span className="star">*</span> */}
                                </span>
                              ) : (
                                ''
                              )
                            }
                            style={styles.input}
                          >
                            <InputNumber
                              min={1}
                              type='number'
                              className='num'
                              disabled
                              inputMode='numeric'
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            // name='from_unit'
                            {...field}
                            validateTrigger={['onChange', 'onBlur']}
                            name={[field.name, 'from_unit']}
                            label={
                              index === 0 ? (
                                <span>
                                  {t(
                                    'Sales.Product_and_services.Form.From_unit',
                                  )}

                                  {/* <span className='star'>*</span> */}
                                  <Tooltip
                                    title={
                                      <span>
                                        {' '}
                                        {t(
                                          'Sales.Product_and_services.Form.Change_unit_message',
                                        )}
                                      </span>
                                    }
                                  >
                                    &nbsp;&nbsp;
                                    {/* <QuestionCircleOutlined /> */}
                                  </Tooltip>
                                </span>
                              ) : (
                                ''
                              )
                            }
                            style={styles.input}
                          >
                            {/* <Select disabled labelInValue showArrow={false} /> */}
                            <Select
                              labelInValue
                              //  showArrow={false}
                            >
                              {props?.record?.product_units
                                ?.filter(
                                  (item: any) =>
                                    item?.unit?.id !==
                                    props?.record?.product_units.filter(
                                      (item: any) => item?.base_unit === true,
                                    )?.[0]?.unit?.id,
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
                        <Col>
                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                            className='deleteColor'
                            style={styles.minus}
                          />
                        </Col>
                      </Row>
                    ))}
                    {fields?.length <
                    props?.record?.product_units?.length - 1000 ? (
                      <Form.Item className='margin1'>
                        <Button
                          type='dashed'
                          onClick={() =>
                            add(
                              {
                                from_unit: undefined,
                                to_unit: props?.record?.product_units.filter(
                                  (item: any) => item?.base_unit === true,
                                )?.[0]?.unit?.name,
                                base_multiplier: undefined,
                                multiplier: 1,
                              },
                              fields.length,
                            )
                          }
                          block
                          style={{ width: 175 }}
                          icon={<PlusOutlined className='addItemIcon' />}
                          className='margin1'
                        >
                          {t('Sales.Product_and_services.Add_new_conversion')}
                        </Button>
                      </Form.Item>
                    ) : null}
                  </>
                )}
              </Form.List>
            </Col>
            <Col span={24} style={{ marginTop: '20px' }}>
              <Form.List name='addUnitConversion'>
                {(fields, { add, remove }) => (
                  <>
                    {fields?.map((field, index) => (
                      <Row
                        key={field.key}
                        align='bottom'
                        style={{
                          marginBottom: 17,
                        }}
                        className='editable-row'
                      >
                        <Col
                          style={{
                            width: `calc(100% - 23px)`,
                          }}
                        >
                          <Row align='bottom' gutter={5}>
                            <Col span={6}>
                              <Form.Item
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                name={[field.name, 'base_multiplier']}
                                label={
                                  index === 0 ? (
                                    <span>
                                      {t(
                                        'Sales.Product_and_services.Form.Base_multiplier',
                                      )}
                                      <span className='star'>*</span>
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
                                <InputNumber
                                  min={1}
                                  type='number'
                                  className='num'
                                  inputMode='numeric'
                                />
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                name={[field.name, 'to_unit']}
                                label={
                                  index === 0
                                    ? t(
                                        'Sales.Product_and_services.Form.Default_unit',
                                      )
                                    : ''
                                }
                                style={styles.input}
                              >
                                <Select
                                  disabled
                                  // labelInValue
                                  showArrow={false}
                                >
                                  {/* <Option Defau>{default1.label}</Option> */}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={1} style={styles.equal1}>
                              =
                            </Col>
                            <Col span={5}>
                              <Form.Item
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                name={[field.name, 'multiplier']}
                                label={
                                  index === 0 ? (
                                    <span>
                                      {t(
                                        'Sales.Product_and_services.Form.Multiplier',
                                      )}
                                      {/* <span className="star">*</span> */}
                                    </span>
                                  ) : (
                                    ''
                                  )
                                }
                                style={styles.input}
                              >
                                <InputNumber
                                  min={1}
                                  type='number'
                                  className='num'
                                  disabled
                                  inputMode='numeric'
                                />
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item
                                // name='from_unit'
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                name={[field.name, 'from_unit']}
                                label={
                                  index === 0 ? (
                                    <span>
                                      {t(
                                        'Sales.Product_and_services.Form.From_unit',
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
                                <Select
                                  labelInValue
                                  //  showArrow={false}

                                  onChange={(value: any) => {
                                    onChangeFromUnit(value, index);
                                  }}
                                >
                                  {props?.record?.product_units
                                    ?.filter(
                                      (item: any) =>
                                        item?.unit?.id !==
                                        props?.record?.product_units.filter(
                                          (item: any) =>
                                            item?.base_unit === true,
                                        )?.[0]?.unit?.id,
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
                        <Col>
                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                            className='deleteColor'
                            style={styles.minus}
                          />
                        </Col>
                      </Row>
                    ))}
                    {fields?.length <
                    props?.record?.product_units?.length - 1 ? (
                      <Form.Item className='margin1'>
                        <Button
                          type='dashed'
                          onClick={() =>
                            add(
                              {
                                from_unit: undefined,
                                to_unit: props?.record?.product_units.filter(
                                  (item: any) => item?.base_unit === true,
                                )?.[0]?.unit?.name,
                                base_multiplier: undefined,
                                multiplier: 1,
                              },
                              fields.length,
                            )
                          }
                          // block
                          // style={{ width: 175 }}
                          icon={<PlusOutlined className='addItemIcon' />}
                          className='margin1'
                        >
                          {t('Sales.Product_and_services.Add_new_conversion')}
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
      {/* )} */}
    </div>
  );
};
export default EditUnitConversion;
interface IProps {
  equal1: React.CSSProperties;
  input: React.CSSProperties;
  minus: React.CSSProperties;
  productInput: React.CSSProperties;
}
//@ts-ignore
const styles: IProps = {
  equal1: { paddingBottom: 6, textAlign: 'center' },
  input: { marginBottom: '0px' },
  minus: {
    paddingTop: 9,
    paddingInlineStart: 9,
    paddingBottom: 9,
  },
  productInput: {
    width: '235px',
    marginBottom: '0px',
  },
};
