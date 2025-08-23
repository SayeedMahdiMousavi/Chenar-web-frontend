import React, { useCallback } from 'react';
import { Row, Col, Form, Divider, Input } from 'antd';
import { InfiniteListNameAndIdFormItem } from './InfiniteListNameAndIdFormItem';
import { useTranslation } from 'react-i18next';
import { InfiniteScrollSelectFormItem } from '../../../../../components/antd';
import { CurrencyProperties } from '../../../../Transactions/Components/CurrencyProperties';
import { DatePickerFormItem } from '../../../../SelfComponents/JalaliAntdComponents/DatePickerFormItem';
import { InvoiceStatusSelect } from '../../../../../components';

interface IProps {
  type: string;
  responseId: boolean | undefined;
  form: any;
  currencyValue: number;
  setCurrencyValue: (value: number) => void;
  setWarehouseId: (value: number) => void;
  onChangeCurrency: (value: {
    name: string;
    base_amount: number;
    equal_amount: number;
    symbol: string;
  }) => void;
  onChangeCurrencyRate: (value: number) => void;
}

function InvoiceHeader({
  type,
  responseId,
  form,
  setCurrencyValue,
  currencyValue,
  onChangeCurrency,
  onChangeCurrencyRate,
  setWarehouseId,
}: IProps) {
  const { t } = useTranslation();

  const onChangeAccount = useCallback(
    (value: any) => {
      form.setFieldsValue({
        phone:
          value?.phone_number +
          `${value?.phone_number && value?.mobile_number && ','}` +
          value?.mobile_number,
        fax: value?.fax_number,
        creditLimit: value?.credit_limit,
        address: value?.full_billing_address,
      });
    },
    [form],
  );

  const handleChangeWarehouse = ({
    value,
  }: {
    value: number;
    label: string;
  }) => {
    setWarehouseId(value);
  };

  return (
    <Row justify='space-between'>
      <Col span={11}>
        <Row gutter={10} align='bottom'>
          <Col span={12}>
            {type === 'sales' ||
            type === 'sales_rej' ||
            type === 'quotation' ? (
              <InfiniteListNameAndIdFormItem
                // label={t("Sales.All_sales.Invoice.Customer_name")}
                placeholder={t('Sales.All_sales.Invoice.Customer_name')}
                queryKey='/customer_account/customer/invoice/'
                baseUrl='/customer_account/customer/'
                fields='id,full_name,mobile_number,phone_number,fax_number,credit_limit,full_billing_address&status=active'
                style={styles.formItem}
                rules={[
                  {
                    required: true,
                    message: t(
                      'Sales.All_sales.Invoice.Customer_name_required',
                    ),
                  },
                ]}
                disabled={responseId}
                onChangeName={onChangeAccount}
              />
            ) : (
              <InfiniteListNameAndIdFormItem
                // label={t("Expenses.Suppliers.Supplier_name")}
                placeholder={t('Expenses.Suppliers.Supplier_name')}
                baseUrl='/supplier_account/supplier/'
                queryKey='/supplier_account/supplier/invoice/'
                fields='id,full_name,mobile_number,phone_number,fax_number,credit_limit,full_billing_address&status=active'
                style={styles.formItem}
                rules={[
                  {
                    required: true,
                    message: t('Expenses.Suppliers.Supplier_name_required'),
                  },
                ]}
                onChangeName={onChangeAccount}
                disabled={responseId}
              />
            )}
          </Col>
          <Col span={12}>
            <InfiniteScrollSelectFormItem
              name='warehouseName'
              placeholder={t('Warehouse.Warehouse_name')}
              baseUrl='/inventory/warehouse/'
              fields='id,name'
              style={styles.formItem}
              onChange={handleChangeWarehouse}
              rules={[
                {
                  required: true,
                  message: t('Warehouse.Warehouse_name_required'),
                },
              ]}
              disabled={responseId}
            />
          </Col>

          {type === 'sales' && (
            <Col span={12}>
              <InfiniteScrollSelectFormItem
                disabled={responseId}
                name='employee'
                placeholder={t('Representative')}
                style={styles.formItem}
                fields='full_name,id'
                baseUrl='/staff_account/staff/'
                rules={[
                  {
                    required: true,
                    message: t('Representative_required'),
                  },
                ]}
              />
            </Col>
          )}
          <Col span={12}>
            <InvoiceStatusSelect
              style={styles.formItem}
              disabled={responseId}
            />
          </Col>
        </Row>
      </Col>

      <Divider type='vertical' style={{ height: '100px' }} />
      <Col span={11}>
        <Row gutter={10}>
          <Col span={24} style={{ marginBottom: '10px' }}>
            <CurrencyProperties
              currencyValue={currencyValue}
              setCurrencyValue={setCurrencyValue}
              form={form}
              type='openAccount'
              onChangeCurrency={onChangeCurrency}
              onChangeCurrencyRate={onChangeCurrencyRate}
              responseId={responseId}
            />
          </Col>

          <Col span={12}>
            <DatePickerFormItem
              placeholder={t('Sales.Customers.Form.Date')}
              name='date'
              label=''
              showTime={true}
              format='YYYY-MM-DD HH:mm'
              rules={[{ type: 'object' }]}
              style={styles.formItem}
              // disabled={true}
            />
          </Col>

          <Col span={12}>
            <Form.Item name='description'>
              <Input.TextArea
                autoSize={{ minRows: 2, maxRows: 3 }}
                placeholder={t('Form.Description')}
                showCount
                allowClear
                readOnly={responseId}
              />
            </Form.Item>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

//@ts-ignore
// eslint-disable-next-line no-func-assign
InvoiceHeader = React.memo(InvoiceHeader);
export default InvoiceHeader;
const styles = {
  formItem: { marginBottom: '12px' },
};
