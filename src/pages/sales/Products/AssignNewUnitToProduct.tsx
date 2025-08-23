import React, { useState } from 'react';
import {
  Modal,
  Form,
  Select,
  message,
  Row,
  Col,
  Button,
  Avatar,
  Input,
  InputNumber,
  Divider,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import { ModalDragTitle } from '../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import AddUnit from './AddUnit';
import { ActionMessage } from '../../SelfComponents/TranslateComponents/ActionMessage';
import { debounce } from 'throttle-debounce';
import { CancelButton, SaveButton } from '../../../components';
const getUnits = async () => {
  const { data } = await axiosInstance.get(
    `/product/unit/?page_size=1000&status=active&ordering=-id`,
  );
  return data;
};

interface IProps {
  record: any;
  setVisible: (value: boolean) => void;
  baseUrl: string;
}
export default function AssignNewUnitToProduct(props: IProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [units, setUnits] = useState([]);
  const [disabledUnits, setDisabledUnits] = useState([]);
  const [form] = Form.useForm();

  const handleCancel = () => {
    setVisible(false);
  };

  const handleAfterClose = () => {
    form.resetFields();
    setLoading(false);
  };

  const unitsData = useQuery('/product/unit/', getUnits);

  const onChangeUnits = (value: any) => {
    //@ts-ignore
    setUnits([value]);
  };
  const showModal = () => {
    const baseUnit = props?.record?.price?.find((item: any) =>
      item?.unit_pro_relation?.includes('base_unit'),
    );
    if (!baseUnit) {
      message.error(
        t('Sales.Product_and_services.Form.Vip_base_unit_price_message'),
      );
    } else {
      props.setVisible(false);
      setUnits(
        props?.record?.product_units?.map((item: any) => ({
          label: item?.unit?.name,
          value: item?.unit.id,
        })),
      );
      setDisabledUnits(
        props?.record?.product_units?.map((item: any) => item?.unit?.name),
      );

      const baseUnit = props?.record?.product_units.find(
        (item: any) => item?.base_unit === true,
      );
      form.setFieldsValue({
        product: props?.record?.name,
        multiplier: 1,
        to_unit: { value: baseUnit?.unit?.id, label: baseUnit?.unit?.name },
      });
      setVisible(true);
    }
  };
  const editUnit = async (value: any) => {
    await axiosInstance
      .put(`${props.baseUrl}${props?.record?.id}/update_unit/`, value)
      .then((res) => {
        setVisible(false);

        message.success(
          <ActionMessage
            name={t('Sales.Product_and_services.Form.Units').toLowerCase()}
            message='Message.Update'
          />,
        );
      })
      .catch((error) => {
        setLoading(false);
        if (error?.response?.data?.default_sal?.[0]) {
          message.error(`${error?.response.data?.default_sal?.[0]}`);
        } else if (error?.response?.data?.default_pur?.[0]) {
          message.error(`${error?.response.data?.default_pur?.[0]}`);
        }
      });
  };
  const { mutate: mutateEditUnit, isLoading } = useMutation(editUnit, {
    onSuccess: () => queryClient.invalidateQueries(`${props.baseUrl}`),
  });
  const onFinish = () => {
    form
      .validateFields()
      .then(async (values) => {
        //
        // setLoading(true);
        // const units = values?.units?.map((item: any) => {
        //   return {
        //     unit: item?.value,
        //     default_sal: item?.value === values.default_sal ? true : false,
        //     default_pur: item?.value === values.default_pur ? true : false,
        //     base_unit: item?.value === values.base_unit ? true : false,
        //   };
        // });
        // //
        // // const allData = {
        // //   default_sal: values.default_sal,
        // //   default_pur: values.default_pur,
        // // };
        // mutateEditUnit(units);
      })
      .catch((info) => {});
  };
  //
  const onChangBasMultiplier = (value: any) => {
    debounceFunc(value);
  };

  const debounceFunc = debounce(500, async (value: string) => {
    if (value && value !== null) {
      const baseUnit = props?.record?.price.find((item: any) =>
        item?.unit_pro_relation?.includes('base_unit'),
      );
      //
      form?.setFieldsValue({
        purchase_rate: parseFloat(baseUnit?.perches_rate) * parseFloat(value),
      });
    } else {
      form?.setFieldsValue({
        purchase_rate: undefined,
      });
    }
  });
  const handleFocusNumberInput = (e: any) => {
    e.target.select();
  };

  const orientation = t('Dir') === 'ltr' ? 'left' : 'right';
  return (
    <div>
      {/* {props.record.product_type === "product" && ( */}
      <div onClick={showModal} className='num'>
        {t('Sales.Product_and_services.Assign_new_unit')}
      </div>
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Sales.Product_and_services.Assign_new_unit')}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
        afterClose={handleAfterClose}
        destroyOnClose
        open={visible}
        width={500}
        centered
        onCancel={handleCancel}
        onOk={onFinish}
        footer={
          <Row justify='end'>
            <Col>
              <CancelButton onClick={handleCancel} />
              <SaveButton onClick={onFinish} loading={loading} />
            </Col>
          </Row>
        }
        // closable={false}
        // closeIcon={
        //   <CloseOutlined style={props?.photo ? styles.closeIcon : {}} />
        // }
        // bodyStyle={styles.modal1(props?.photo)}
      >
        <Form form={form} layout='vertical' hideRequiredMark={true}>
          <Divider orientation={orientation} style={{ marginTop: '0px' }}>
            {t('Sales.Product_and_services.Units.Select_unit')}
          </Divider>
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item
                name='product'
                style={styles.formItem}
                label={t('Sales.Product_and_services.Product')}
              >
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='units'
                style={styles.formItem}
                label={
                  <span>
                    {t('Sales.Product_and_services.Units.Unit')}{' '}
                    <span className='star'>*</span>
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: t(
                      'Sales.Product_and_services.Price_recording.Unit_required',
                    ),
                  },
                ]}
              >
                <Select
                  showSearch
                  //   mode="multiple"
                  // maxTagCount={1}
                  onChange={onChangeUnits}
                  // onDeselect={onUnitsClear}
                  labelInValue
                  showArrow
                  // allowClear
                  // virtual={false}
                  optionLabelProp='label'
                  optionFilterProp='label'
                  popupClassName='z_index'
                  dropdownRender={(menu) => (
                    <div>
                      <AddUnit form={form} units={units} setUnits={setUnits} />
                      {menu}
                    </div>
                  )}
                >
                  {unitsData?.data?.results?.map((item: any) => (
                    <Select.Option
                      value={item.id}
                      key={item.id}
                      label={item.name}
                      //@ts-ignore
                      disabled={disabledUnits?.includes(item?.name)}
                    >
                      <div>
                        <Avatar size='small' style={{ background: '#10899e' }}>
                          {item?.symbol}
                        </Avatar>{' '}
                        {item.name}
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Divider orientation={orientation}>
                {t('Sales.Product_and_services.Form.Unit_conversion')}
              </Divider>
              <Row align='bottom' gutter={5}>
                <Col span={6}>
                  <Form.Item
                    name='base_multiplier'
                    label={
                      <span>
                        {t('Sales.Product_and_services.Form.Base_multiplier')}
                        <span className='star'>*</span>
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: t('Form.Required'),
                      },
                    ]}
                    style={styles.formItem}
                  >
                    <InputNumber
                      min={1}
                      onChange={onChangBasMultiplier}
                      type='number'
                      onFocus={handleFocusNumberInput}
                      className='num'
                      inputMode='numeric'
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name='to_unit'
                    label={t('Sales.Product_and_services.Form.Default_unit')}
                    style={styles.formItem}
                  >
                    <Select disabled labelInValue showArrow={false}>
                      {props?.record?.product_units?.map((item: any) => (
                        <Select.Option
                          value={item?.unit?.id}
                          label={item?.unit?.name}
                        >
                          {item?.from_unit?.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={1} style={styles.equal1}>
                  =
                </Col>
                <Col span={5}>
                  <Form.Item
                    name='multiplier'
                    label={
                      <span>
                        {t('Sales.Product_and_services.Form.Multiplier')}
                        {/* <span className="star">*</span> */}
                      </span>
                    }
                    style={styles.formItem}
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
                    name='units'
                    label={
                      <span>
                        {t('Sales.Product_and_services.Form.From_unit')}
                      </span>
                    }
                    // rules={[
                    //   {
                    //     message: `${t("Form.Required")}`,
                    //     required: true,
                    //   },
                    // ]}
                    style={styles.formItem}
                  >
                    <Select
                      labelInValue
                      //  showarrow={false}
                      disabled
                      onChange={(value: any) => {
                        // onChangeFromUnit(value, index);
                      }}
                    >
                      {units?.map((item: any) => (
                        <Select.Option value={item?.value} label={item?.label}>
                          {item?.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Divider orientation={orientation}>
                {t('Sales.All_sales.Invoice.Unit_price')}
              </Divider>
              <Row gutter={10} align='bottom'>
                <Col span={8}>
                  <Form.Item
                    name='units'
                    label={
                      <span>{t('Sales.Product_and_services.Units.Unit')}</span>
                    }
                    style={styles.formItem}
                  >
                    <Select
                      disabled
                      labelInValue
                      //  showarrow={false}
                    >
                      {units?.map((item: any) => (
                        <Select.Option value={item?.value} label={item?.label}>
                          {item?.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name='purchase_rate'
                    label={<span>{t('Taxes.Tax_rates.Purchases')}</span>}
                    style={styles.formItem}
                  >
                    <InputNumber
                      min={0}
                      disabled
                      type='number'
                      className='num'
                      inputMode='numeric'
                      onFocus={handleFocusNumberInput}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name='sales_rate'
                    label={
                      <span>
                        {t('Sales.1')}
                        <span className='star'>*</span>
                      </span>
                    }
                    style={styles.formItem}
                    rules={[
                      {
                        required: true,
                        message: t(
                          'Sales.Product_and_services.Price_recording.Sales_required',
                        ),
                      },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      type='number'
                      className='num'
                      inputMode='numeric'
                      onFocus={handleFocusNumberInput}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Modal>
      {/* )} */}
    </div>
  );
}

interface IStyles {
  formItem: React.CSSProperties;
  equal1: React.CSSProperties;
}
const styles: IStyles = {
  formItem: { marginBottom: '10px' },
  equal1: { paddingBottom: 15, textAlign: 'center' },
};
