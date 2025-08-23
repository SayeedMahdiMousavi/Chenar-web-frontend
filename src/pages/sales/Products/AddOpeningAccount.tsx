import React, { useState } from 'react';
import {
  Modal,
  Form,
  message,
  Row,
  Col,
  Button,
  InputNumber,
  Input,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Styles } from '../../styles';
import { useMediaQuery } from '../../MediaQurey';
import { ModalDragTitle } from '../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { DatePickerFormItem } from '../../SelfComponents/JalaliAntdComponents/DatePickerFormItem';
import { InfiniteScrollSelectFormItem } from '../../../components/antd';
import { changeGToJ, utcDate } from '../../../Functions/utcDate';
import dayjs from 'dayjs';
import { CancelButton, SaveButton } from '../../../components';
import { useGetBaseCurrency } from '../../../Hooks';

interface IProps {
  form: any;
  productInventory: any[];
  baseUrl: string;
  setProductInventory: (value: any[]) => void;
  baseUnit: string;
  dateFormat: string;
  expireDateFormat: string;
  calendarCode: string;
}

let AddOpeningAccount: React.FC<IProps> = ({
  productInventory,
  setProductInventory,
  baseUnit,
  form: addProductForm,
  expireDateFormat,
  dateFormat,
  calendarCode,
}) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);

  const [form] = Form.useForm();
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');

  //get base currency
  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyName = baseCurrency?.data?.name;

  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
  };

  const handleAfterClose = () => {
    setLoading(false);
    form.resetFields();
  };

  const showModal = async () => {
    setVisible(true);
    form.setFieldsValue({
      productInventoryList: productInventory,
      registerDate:
        productInventory?.length > 0
          ? productInventory?.[0]?.registerDate
          : calendarCode === 'gregory'
            ? utcDate()
            : dayjs(changeGToJ(utcDate().format(dateFormat), dateFormat), {
                //@ts-ignore
                jalali: true,
              }),
    });
  };

  const onFinish = () => {
    form
      .validateFields()
      .then(async (values) => {
        const productInventoryList = values?.productInventoryList?.reduce(
          (sum: any, item: any) => {
            if (Boolean(item?.warehouse)) {
              return [...sum, { ...item, registerDate: values?.registerDate }];
            }
          },
          [],
        );
        message.success(t('Message.Save'));
        setProductInventory(productInventoryList);
        setVisible(false);
      })
      .catch((info) => {
        //
      });
  };

  const onChangeWarehouse = (value: any, itemIndex: any) => {
    const formValue = form.getFieldsValue();
    const warehouseLength = formValue?.productInventoryList?.reduce(
      (sum: number, item: any) => {
        if (item?.warehouse?.value === value?.value) {
          return sum + 1;
        } else {
          return sum;
        }
      },
      0,
    );

    if (warehouseLength > 1) {
      Modal.warning({
        bodyStyle: {
          direction: t('Dir') as
            | 'ltr'
            | 'rtl'
            | 'inherit'
            | 'initial'
            | 'unset',
        },
        title: t('Warehouse.Warehouse_exist_message'),
        onOk: () => {
          const newProductInventoryList = formValue?.productInventoryList?.map(
            (item: any, index: number) => {
              if (index === itemIndex) {
                return { ...item, warehouse: undefined };
              } else {
                return item;
              }
            },
          );
          form.setFieldsValue({
            productInventoryList: newProductInventoryList,
          });
        },
      });
    }
  };

  return (
    <div>
      <Button onClick={showModal} disabled={!Boolean(baseUnit)}>
        {t('Product_on_hand')}
      </Button>

      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Sales.Product_and_services.Inventory.Product_inventory')}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
        destroyOnClose
        afterClose={handleAfterClose}
        open={visible}
        width={740}
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
            <Col span={7} style={{ paddingInlineEnd: '10px' }}>
              <DatePickerFormItem
                name='registerDate'
                placeholder=''
                label={
                  <span>
                    {t('Register_date')}
                    <span className='star'>*</span>
                  </span>
                }
                showTime={true}
                format={dateFormat}
                rules={[
                  { type: 'object' },
                  {
                    required: true,
                    message: t('Register_date_required'),
                  },
                ]}
              />
            </Col>
            <Col span={24}>
              <Form.List name='productInventoryList'>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
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
                            width: `calc(100% - 24px)`,
                          }}
                        >
                          <Row align='bottom' gutter={5}>
                            <Col span={6}>
                              <InfiniteScrollSelectFormItem
                                validateTrigger={['onChange', 'onBlur']}
                                name={[field.name, 'warehouse']}
                                rules={[
                                  {
                                    message: `${t(
                                      'Warehouse.Warehouse_name_required',
                                    )}`,
                                    required: true,
                                  },
                                ]}
                                label={
                                  index === 0 ? (
                                    <span>
                                      {t('Warehouse.1')}
                                      <span className='star'>*</span>
                                    </span>
                                  ) : (
                                    ''
                                  )
                                }
                                style={styles.formItem}
                                fields='name,id'
                                onChange={(value: any) => {
                                  onChangeWarehouse(value, index);
                                }}
                                baseUrl='/inventory/warehouse/'
                              />
                            </Col>
                            <Col span={3}>
                              <Form.Item
                                validateTrigger={['onChange', 'onBlur']}
                                name={[field.name, 'qty']}
                                label={
                                  index === 0 ? (
                                    <span>
                                      {t('Sales.All_sales.Invoice.Quantity')}
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
                                style={styles.formItem}
                              >
                                <InputNumber
                                  min={0}
                                  type='number'
                                  className='num'
                                  inputMode='numeric'
                                />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              {/* <Form.Item
                                validateTrigger={["onChange", "onBlur"]}
                                name={[field.name, "unit"]}
                                fieldKey={[field.fieldKey, "unit"]}
                                label={
                                  index === 0
                                    ? t(
                                        "Sales.Product_and_services.Form.Base_unit"
                                      )
                                    : ""
                                }
                                style={styles.formItem}
                                
                              > */}
                              <div className='ant-col ant-form-item-label'>
                                {index === 0
                                  ? t(
                                      'Sales.Product_and_services.Form.Base_unit',
                                    )
                                  : ''}
                              </div>
                              <Input readOnly={true} value={baseUnit} />
                              {/* </Form.Item> */}
                            </Col>
                            <Col span={3}>
                              <Form.Item
                                validateTrigger={['onChange', 'onBlur']}
                                name={[field.name, 'price']}
                                label={
                                  index === 0 ? (
                                    <span>
                                      {t('Taxes.Tax_rates.Purchases')}
                                      <span className='star'>*</span>
                                    </span>
                                  ) : (
                                    ''
                                  )
                                }
                                rules={[
                                  {
                                    message: t('Form.Required'),
                                    required: true,
                                  },
                                ]}
                                style={styles.formItem}
                              >
                                <InputNumber
                                  min={0.01}
                                  type='number'
                                  className='num'
                                  inputMode='numeric'
                                />
                              </Form.Item>
                            </Col>
                            <Col span={3}>
                              <div className='ant-col ant-form-item-label'>
                                {index === 0
                                  ? t('Sales.Product_and_services.Currency.1')
                                  : ''}
                              </div>
                              <Input readOnly={true} value={baseCurrencyName} />
                            </Col>
                            <Col span={5}>
                              <DatePickerFormItem
                                validateTrigger={['onChange', 'onBlur']}
                                name={[field.name, 'expirationDate']}
                                placeholder=''
                                label={
                                  index === 0 ? (
                                    <span>
                                      {t(
                                        'Sales.Product_and_services.Inventory.Expiration_date',
                                      )}
                                    </span>
                                  ) : (
                                    ''
                                  )
                                }
                                showTime={false}
                                format='YYYY-MM-DD'
                                rules={[{ type: 'object' }]}
                                style={styles.formItem}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col>
                          <Button
                            shape='circle'
                            size='small'
                            type='text'
                            danger
                            style={styles.minus}
                            icon={
                              <MinusCircleOutlined
                                onClick={() => {
                                  remove(field.name);
                                }}
                              />
                            }
                          />
                        </Col>
                      </Row>
                    ))}

                    <Form.Item className='margin1'>
                      <Button
                        type='dashed'
                        onClick={() => {
                          const purchasePrice =
                            addProductForm?.getFieldValue('perches_rate');
                          add(
                            {
                              warehouse: undefined,
                              price: Boolean(purchasePrice)
                                ? parseFloat(purchasePrice)
                                : undefined,
                              qty: 1,
                              // unit: baseUnit,
                              expirationDate: undefined,
                            },
                            fields.length,
                          );
                        }}
                        block
                        style={{ width: 192 }}
                        icon={<PlusOutlined className='addItemIcon' />}
                        className='margin1'
                      >
                        {t('Sales.Product_and_services.Form.Add_new_item')}
                      </Button>
                    </Form.Item>
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

// eslint-disable-next-line no-const-assign
AddOpeningAccount = React.memo(AddOpeningAccount);

export default AddOpeningAccount;
interface IStyles {
  equal1: React.CSSProperties;
  input: React.CSSProperties;
  minus: React.CSSProperties;
  formItem: React.CSSProperties;
}

const styles: IStyles = {
  equal1: { paddingBottom: 6, textAlign: 'center' },
  input: { marginBottom: '0px' },
  formItem: { marginBottom: '0px' },
  minus: {
    paddingInlineStart: 9,
    marginBottom: 4,
  },
};
