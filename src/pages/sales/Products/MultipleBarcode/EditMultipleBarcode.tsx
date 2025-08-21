import React, { useState } from 'react';
import {
  Modal,
  Form,
  Select,
  message,
  Row,
  Col,
  Button,
  Input,
  Checkbox,
  Radio,
  Space,
  Popconfirm,
  Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../../ApiBaseUrl';
import {
  MinusCircleOutlined,
  PlusOutlined,
  SaveTwoTone,
} from '@ant-design/icons';
import { Styles } from '../../../styles';
import { useMediaQuery } from '../../../MediaQurey';
import { ModalDragTitle } from '../../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { ActionMessage } from '../../../SelfComponents/TranslateComponents/ActionMessage';
import { Colors } from '../../../colors';
import { CancelButton, TrueFalseIcon } from '../../../../components';
import { manageErrors } from '../../../../Functions';

interface IProps {
  record: any;
  baseUrl: string;
  setVisible: (value: boolean) => void;
}

const EditMultipleBarcode: React.FC<IProps> = (props) => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [barcode, setBarcode] = useState<string>('');
  const [defaultBarcode, setDefaultBarcode] = useState<number>(0);
  const [form] = Form.useForm();
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');
  const [isSaveError, setIsSaveError] = useState(true);

  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    form.resetFields();
  };

  const showModal = async () => {
    props.setVisible(false);
    setVisible(true);
    if (props?.record?.product_barcode?.length > 0) {
      const newBarcodeList = props?.record?.product_barcode?.map(
        (item: any, index: number) => {
          if (item?.default === true) {
            setDefaultBarcode(index);
          }

          return {
            barcode: item?.barcode,
            unit: { value: item?.unit?.id, label: item?.unit?.name },
            original: item?.original,
            default: item?.default,
            id: item?.id,
          };
        }
      );
      form.setFieldsValue({
        barcodeList: newBarcodeList,
        product: props.record?.name,
      });
    } else {
      form.setFieldsValue({ product: props.record?.name });
      setDefaultBarcode(0);
    }
  };

  const handleClickBarcode = async (itemIndex: number) => {
    const formValue = form.getFieldsValue();
    await axiosInstance
      .get(`${props.baseUrl}generate_unique_barcode/`)
      .then((res) => {
        const barcode = res?.data?.[0];
        const newBarcodeList = formValue?.barcodeList?.map(
          (item: any, index: number) => {
            if (index === itemIndex) {
              return {
                ...item,
                barcode: barcode,
                original: false,
              };
            } else {
              return item;
            }
          }
        );
        form.setFieldsValue({ barcodeList: newBarcodeList });
      })
      .catch((error) => {
        message.error(error?.response?.data?.data?.message);
      });
  };

  // const addConversions = async (value: any) => {
  //   await axiosInstance
  //     .post(`/product/unit/conversion/bulk_create/`, value)
  //     .then((res) => {

  //       setVisible(false);

  //       message.success(
  //         <ActionMessage
  //           name={t(
  //             "Sales.Product_and_services.Form.Unit_conversion"
  //           ).toLowerCase()}
  //           message="Message.Add"
  //         />
  //       );
  //       // form.resetFields();
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       if (error?.response?.data?.non_field_errors?.[0]) {
  //         message.error(`${error?.response.data?.non_field_errors?.[0]}`);
  //       }

  //     });
  // };
  //   const { mutate: mutateAddConversions,isLoading} = useMutation(addConversions, {
  //     onSuccess: () => queryClient.invalidateQueries(`${props?.baseUrl}`),
  //   });
  //   const editUnitConversion = async (value: any) => {
  //     await axiosInstance
  //       .put(`/product/unit/conversion/bulk_update/${props?.record?.id}/`, value)
  //       .then((res) => {
  //         // setLoading(false);
  //         setVisible(false);
  //         message.success(
  //           <ActionMessage
  //             name={t(
  //               "Sales.Product_and_services.Form.Unit_conversion"
  //             ).toLowerCase()}
  //             message="Message.Update"
  //           />
  //         );
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         if (error?.response?.data?.non_field_errors?.[0]) {
  //           message.error(`${error?.response.data?.non_field_errors?.[0]}`);
  //         }
  //       });
  //   };
  //   const { mutate: mutateEditConversions,isLoading} = useMutation(editUnitConversion, {
  //     onSuccess: () => queryClient.invalidateQueries(`${props?.baseUrl}`),
  //   });
  const onFinish = () => {
    form
      .validateFields()
      .then(async (values) => {
        //
        const newBarcodeList = values?.barcodeList?.map(
          (item: any, index: number) => {
            return {
              barcode: item?.barcode,
              unit: item?.unit,
              default: defaultBarcode === index ? true : false,
              original: item?.original,
            };
          }
        );

        // props.setBarcodeList(newBarcodeList);
        setVisible(false);
        // if (newBarcodeList?.length > 0) {
        //   props.form.setFieldsValue({
        //     barcode: undefined,
        //     isOriginBarcode: false,
        //   });
        // }
      })
      .catch((info) => {});
  };

  const onChangeFromUnit = (value: any, itemIndex: any) => {
    // const isExistUnit = units?.includes(value?.label);
    // const formValue = form.getFieldsValue();
    // const unitLength = formValue?.addUnitConversion?.reduce(
    //   (sum: number, item: any) => {
    //     if (item?.from_unit?.label === value?.label) {
    //       return sum + 1;
    //     } else {
    //       return sum;
    //     }
    //   },
    //   0
    // );
    // if (unitLength > 1) {
    //   Modal.warning({
    //     // title: "Price  problem",
    //     title: (
    //       <span dir={i18n?.language === "en" ? "ltr" : "rtl"}>
    //         {t("Sales.Product_and_services.Unit_conversion_exist_message")}
    //       </span>
    //     ),
    //     onOk: () => {
    //       const newConversions = formValue?.addUnitConversion?.map(
    //         (item: any, index: number) => {
    //           if (index === itemIndex) {
    //             return { ...item, from_unit: undefined };
    //           } else {
    //             return item;
    //           }
    //         }
    //       );
    //       form.setFieldsValue({ addUnitConversion: newConversions });
    //     },
    //   });
    // }
  };

  const handleChangeDefaultBarcode = (e: any) => {
    setDefaultBarcode(e.target.value);
  };

  const handleSuccessEdit = () => {
    queryClient.invalidateQueries(props.baseUrl);
  };

  const messageKey = 'editBarcode';
  const { mutate: mutateEditBarcode } = useMutation(
    async ({ value, id }: any) =>
      await axiosInstance
        .put(`${props.baseUrl}barcode/${id}/`, value)
        .then((res) => {
          //   setActiveLoading(false);
          //   message.success(
          //     <ActionMessage name={props.record?.name} message="Message.Active" />
          //   );
          //   setVisible(false);
          message.destroy(messageKey);
          setIsSaveError(true);
          message.success({
            content: (
              <ActionMessage name={value?.barcode} message='Message.Update' />
            ),
            // messageKey,
            duration: 3,
          });
        })
        .catch((error) => {
          setIsSaveError(false);
          if (error?.response?.data?.barcode?.[0]) {
            message.error(`${error?.response.data?.barcode?.[0]}`);
          } else if (error?.response?.data?.original?.[0]) {
            message.error(`${error?.response?.data?.original?.[0]}`);
          } else if (error?.response?.data?.default?.[0]) {
            message.error(`${error?.response?.data?.default?.[0]}`);
          } else if (error?.response?.data?.product?.[0]) {
            message.error(`${error?.response.data?.product?.[0]}`);
          }
        })
  );

  const { mutate: mutateAddBarcode, isLoading: saveLoading } = useMutation(
    async ({ value }: any) =>
      await axiosInstance.post(`${props.baseUrl}barcode/`, value),
    {
      onSuccess: (values, { formValue, itemIndex, value }) => {
        const newBarcodeList = formValue?.barcodeList?.map(
          (item: any, index: number) => {
            if (index === itemIndex) {
              return { ...item, id: values?.data?.id };
            } else {
              return item;
            }
          }
        );

        form.setFieldsValue({ barcodeList: newBarcodeList });
        message.destroy(messageKey);
        message.success({
          content: (
            <ActionMessage name={value?.barcode} message='Message.Add' />
          ),
          // messageKey,
          duration: 3,
        });
      },
      onError: (error) => {
        manageErrors(error);
      },
    }
  );

  let editBarcode = false;
  const handleSaveBarcode = async (itemIndex: number) => {
    form
      .validateFields()
      .then(async (values) => {
        const formValue = form.getFieldsValue();
        const row = formValue?.barcodeList?.find(
          (item: any, index: number) => index === itemIndex
        );
        if (row?.id) {
          if (editBarcode) {
            return;
          }
          editBarcode = true;
          // setActiveLoading(true);
          try {
            message.loading({
              content: t('Message.Loading'),
              key: messageKey,
            });
            mutateEditBarcode({
              value: {
                barcode: row?.barcode,
                unit: row?.unit?.value,
                default: row?.default,
                // default: defaultBarcode === itemIndex ? true : false,
                original: row?.original,
                product: props?.record?.id,
              },
              id: row?.id,
            });
            editBarcode = false;
          } catch (info) {
            editBarcode = false;
          }
        } else {
          if (editBarcode) {
            return;
          }
          editBarcode = true;
          // setActiveLoading(true);
          try {
            message.loading({
              content: t('Message.Loading'),
              key: messageKey,
            });
            setIsSaveError(true);
            mutateAddBarcode({
              value: {
                barcode: row?.barcode,
                unit: row?.unit?.value,
                default: row?.default,
                // default: defaultBarcode === itemIndex ? true : false,
                original: row?.original,
                product: props?.record?.id,
              },
              formValue: formValue,
              itemIndex: itemIndex,
            });
            editBarcode = false;
          } catch (info) {
            editBarcode = false;
          }
        }
      })
      .catch((info) => {
        //
        setIsSaveError(false);
      });
  };

  const { mutate: mutateDeleteBarcode } = useMutation(
    async ({ value, formValue, itemIndex }: any) =>
      await axiosInstance
        .delete(`${props.baseUrl}barcode/${value?.id}/`)
        .then((res) => {
          const newBarcodeList = formValue?.barcodeList?.filter(
            (item: any, index: number) => item?.id !== value?.id
          );

          form.setFieldsValue({ barcodeList: newBarcodeList });
          message.destroy(messageKey);
          message.success({
            content: (
              <ActionMessage name={value?.barcode} message='Message.Remove' />
            ),
            // messageKey,
            duration: 3,
          });
        })
        .catch((error) => {
          message.destroy(messageKey);
          //
          message.error(`${error?.response?.data?.data?.message}`);
        })
  );
  let oneRequest = false;

  const handelRemoveBarcode = async (itemIndex: number) => {
    //
    const formValue = form.getFieldsValue();
    const row = formValue?.barcodeList?.find(
      (item: any, index: number) => index === itemIndex
    );
    if (!row?.id) {
      const newBarcodeList = formValue?.barcodeList?.filter(
        (item: any, index: number) => index !== itemIndex
      );

      form.setFieldsValue({ barcodeList: newBarcodeList });
      message.success({
        content: <ActionMessage name={row?.barcode} message='Message.Remove' />,
        // messageKey,
        duration: 3,
      });
    } else {
      if (oneRequest) {
        return;
      }
      oneRequest = true;

      try {
        message.loading({
          content: t('Message.Loading'),
          key: messageKey,
        });
        mutateDeleteBarcode({
          value: row,
          formValue: formValue,
          itemIndex: itemIndex,
        });

        oneRequest = false;
      } catch (info) {
        oneRequest = false;
      }
    }

    // props.delete(props.record.name, e);
    // setVisible(false);
  };

  const handelGetBarcode = (itemIndex: number) => {
    const formValue = form.getFieldsValue();
    formValue.barcodeList.forEach((item: any, index: number) => {
      if (itemIndex === index) {
        setBarcode(item?.barcode);
      }
    });
  };

  const handleAfterClose = () => {
    handleSuccessEdit();
    setLoading(false);
    form.resetFields();
    setDisabled(true);
    setDefaultBarcode(0);
  };
  return (
    <div>
      <div onClick={showModal}>
        {t('Sales.Product_and_services.Form.Edit_barcode')}
      </div>
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Sales.Product_and_services.Form.Edit_barcode')}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
        destroyOnClose
        afterClose={handleAfterClose}
        open={visible}
        width={i18n.language === 'en' ? 720 : 680}
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

              {/* <Button
                type="primary"
                shape="round"
                onClick={onFinish}
                loading={loading}
              >
                {t("Form.Save")}
              </Button> */}
            </Col>
          </Row>
        }
      >
        <Form form={form} layout='vertical' hideRequiredMark>
          <Row align='middle'>
            <Col span={12}>
              <Form.Item
                name='product'
                style={styles.input}
                label={t('Sales.Product_and_services.Product')}
              >
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col span={24} style={{ marginTop: '20px' }}>
              <Form.List name='barcodeList'>
                {(fields, { add, remove }) => (
                  <Radio.Group
                    style={{ width: '100%' }}
                    onChange={handleChangeDefaultBarcode}
                    value={defaultBarcode}
                  >
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
                            width: `calc(100% - 52px)`,
                          }}
                        >
                          <Row align='bottom' gutter={5}>
                            <Col span={7}>
                              <Form.Item
                                {...field}
                                label={
                                  index === 0 ? (
                                    <span>
                                      {t(
                                        'Sales.Product_and_services.Form.Barcode'
                                      )}
                                      <span className='star'>*</span>
                                    </span>
                                  ) : (
                                    ''
                                  )
                                }
                                style={styles.input}
                              >
                                <Input.Group compact>
                                  <Form.Item
                                    validateTrigger={['onChange', 'onBlur']}
                                    name={[field.name, 'barcode']}
                                    fieldKey={[field.fieldKey, 'barcode']}
                                    rules={[
                                      {
                                        message: `${t(
                                          'Sales.Product_and_services.Form.Barcode_required'
                                        )}`,
                                        required: true,
                                      },
                                    ]}
                                    noStyle
                                  >
                                    <Input
                                      className='num'
                                      style={{ width: `calc(100% - 40px)` }}
                                    />
                                  </Form.Item>
                                  <Button
                                    type='primary'
                                    onClick={() => handleClickBarcode(index)}
                                    style={{ width: '40px' }}
                                    icon={<PlusOutlined />}
                                  ></Button>
                                </Input.Group>
                              </Form.Item>
                            </Col>
                            <Col span={5}>
                              <Form.Item
                                validateTrigger={['onChange', 'onBlur']}
                                name={[field.name, 'original']}
                                fieldKey={[field.fieldKey, 'original']}
                                style={{
                                  marginTop: '0px',
                                  marginBottom: '0px',
                                }}
                                valuePropName='checked'
                              >
                                <Checkbox>
                                  {t(
                                    'Sales.Product_and_services.Form.Is_origin_barcode'
                                  )}
                                </Checkbox>
                              </Form.Item>
                            </Col>
                            <Col span={i18n.language === 'en' ? 6 : 6}>
                              <Form.Item
                                validateTrigger={['onChange', 'onBlur']}
                                name={[field.name, 'default']}
                                fieldKey={[field.fieldKey, 'default']}
                                style={{
                                  marginTop: '0px',
                                  marginBottom: '0px',
                                }}
                                valuePropName='checked'
                              >
                                <Checkbox>
                                  {t(
                                    'Sales.Product_and_services.Form.Default_barcode'
                                  )}
                                </Checkbox>
                              </Form.Item>
                            </Col>
                            <Col span={i18n.language === 'en' ? 5 : 6}>
                              <Form.Item
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                name={[field.name, 'unit']}
                                fieldKey={[field.fieldKey, 'unit']}
                                label={
                                  index === 0 ? (
                                    <span>
                                      {t(
                                        'Sales.Product_and_services.Form.Unit'
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
                                  onChange={(value: any) => {
                                    onChangeFromUnit(value, index);
                                  }}
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
                          <Space size={1} style={styles.minus}>
                            <Popconfirm
                              placement='topRight'
                              title={
                                <ActionMessage
                                  name={barcode}
                                  message='Message.Remove_item_message'
                                />
                              }
                              onConfirm={() => handelRemoveBarcode(index)}
                              okText={t('Manage_users.Yes')}
                              cancelText={t('Manage_users.No')}
                            >
                              <Button
                                shape='circle'
                                size='small'
                                type='text'
                                danger
                                icon={
                                  <MinusCircleOutlined
                                    onClick={() => handelGetBarcode(index)}
                                  />
                                }
                              />
                            </Popconfirm>

                            {/* <Tooltip title={t("Form.Save")}> */}
                            <Button
                              shape='circle'
                              size='small'
                              type='link'
                              icon={
                                <Typography.Paragraph
                                  copyable={{
                                    icon: [
                                      <SaveTwoTone
                                        onClick={() => handleSaveBarcode(index)}
                                        twoToneColor={Colors.primaryColor}
                                      />,
                                      saveLoading ? (
                                        <SaveTwoTone
                                          twoToneColor={Colors.primaryColor}
                                        />
                                      ) : (
                                        <TrueFalseIcon value={isSaveError} />
                                      ),
                                    ],
                                    tooltips: [t('Form.Save'), ''],
                                  }}
                                />
                                // <SaveTwoTone
                                //   onClick={() => handleSaveBarcode(index)}
                                //   twoToneColor={Colors.primaryColor}
                                // />
                              }
                            />
                            {/* </Tooltip> */}
                          </Space>
                        </Col>
                      </Row>
                    ))}

                    <Form.Item className='margin1'>
                      <Button
                        type='dashed'
                        onClick={() =>
                          add(
                            {
                              unit: undefined,
                              barcode: undefined,
                              original: true,
                              default: false,
                            },
                            fields.length
                          )
                        }
                        block
                        style={{ width: i18n.language === 'en' ? 203 : 192 }}
                        icon={<PlusOutlined className='addItemIcon' />}
                        className='margin1'
                      >
                        {t('Sales.Product_and_services.Form.Add_new_item')}
                      </Button>
                    </Form.Item>
                  </Radio.Group>
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
export default EditMultipleBarcode;
interface IStyles {
  equal1: React.CSSProperties;
  input: React.CSSProperties;
  minus: React.CSSProperties;
}

const styles: IStyles = {
  equal1: { paddingBottom: '6px', textAlign: 'center' },
  input: { marginBottom: '0px' },
  minus: {
    paddingBottom: '4px',
    paddingInlineStart: '3px',
  },
};
