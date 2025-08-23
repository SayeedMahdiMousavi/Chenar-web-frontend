import React, { memo } from 'react';
import { Row, Col, Form, Button, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { handlePrepareDateForServer } from '../../../../Functions/utcDate';
import ReportDateFormItem from '../../Components/DateFormItem';
import { EmployeeAndCustomerAndSupplierChart } from '../../../Transactions/Components/EmployeeAndCustomerAndSupplierChart';
import { InfiniteScrollSelectFormItem } from '../../../../components/antd';
import { useDefaultReportDateFormItem } from '../../../../Hooks';

interface IProps {
  setPage: (value: number) => void;
  setFilters: (value: any) => void;
  // currency: { label: string; value: number };
  setSelectResult: (value: boolean) => void;
  setSelectedRowKeys: (value: string[]) => void;
}

function DebitAndCreditFilters(props: IProps) {
  const { t } = useTranslation();
  const { form, defaultDate, calendarCode } = useDefaultReportDateFormItem();

  const onFinish = async (values: any) => {
    const startDate = handlePrepareDateForServer({
      date: values?.dateTime?.[0],
      calendarCode,
    });
    const endDate = handlePrepareDateForServer({
      date: values?.dateTime?.[1],
      calendarCode,
    });
    const newFilters = {
      transactionType:
        values?.transType === 'debitAndCredit'
          ? { value: '', label: values?.transType?.label }
          : values?.transType,
      currency: values?.currency,
      customer: values?.accountName,
      startDate: startDate,
      endDate: endDate,
    };

    props.setFilters((prev: any) => {
      if (
        prev?.currency?.value !== newFilters?.currency?.value ||
        prev?.customer?.value !== newFilters?.customer?.value ||
        prev?.transactionType?.value !== newFilters?.transactionType?.value ||
        prev?.startDate !== newFilters?.startDate ||
        prev?.endDate !== newFilters?.endDate
      ) {
        props.setSelectedRowKeys([]);

        props.setSelectResult(false);
        return newFilters;
      } else {
        return newFilters;
      }
    });

    props.setPage(1);
  };

  // const idCurrency = props?.currency?.value;
  // useEffect(() => {
  //   if (idCurrency) {
  //     form.setFieldsValue({ currency: props.currency });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [form, idCurrency]);

  return (
    <Form
      onFinish={onFinish}
      form={form}
      hideRequiredMark
      initialValues={{
        date: 'allDates',
        dateTime: defaultDate,
      }}
    >
      <Row gutter={[10, 10]} style={styles.form}>
        <ReportDateFormItem form={form} style={styles.formItem} />
        <Col xxl={14} xl={10} lg={11}></Col>
        <Col xxl={4} xl={5} lg={5}>
          <Form.Item name='transType' style={styles.formItem}>
            <Select
              className='num'
              allowClear
              labelInValue
              placeholder={t('Reports.Debit_or_credit')}
            >
              <Select.Option value='receivement'>{t('Debit')}</Select.Option>
              <Select.Option value='payment'>{t('Credit')}</Select.Option>

              {/* <Select.Option value="debitAndCredit">
                {t("Reports.Debit_and_credit")}
              </Select.Option> */}
            </Select>
          </Form.Item>
        </Col>
        <Col xxl={5} xl={6} lg={6}>
          <EmployeeAndCustomerAndSupplierChart
            form={form}
            style={styles.formItem}
          />
        </Col>

        <Col xxl={14} xl={10} lg={11}></Col>
        <Col xxl={4} xl={5} lg={6}>
          <InfiniteScrollSelectFormItem
            name='currency'
            placeholder={t('Sales.Product_and_services.Inventory.Currency')}
            style={styles.formItem}
            fields='name,id,symbol'
            baseUrl='/currency/active_currency_rate/'
            allowClear
            // rules={[
            //   {
            //     required: true,
            //     message: t(
            //       "Sales.Product_and_services.Currency.Currency_required"
            //     ),
            //   },
            // ]}
          />
        </Col>

        <Col xxl={8} xl={10} lg={10}>
          <Form.Item className='margin' style={styles.formItem}>
            <Button type='primary' size='small' htmlType='submit' shape='round'>
              {t('Form.Search')}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

const styles = {
  form: {
    marginBottom: '20px',
  },
  formItem: { marginBottom: 0 },
};

//@ts-ignore
// eslint-disable-next-line no-func-assign
DebitAndCreditFilters = memo(
  DebitAndCreditFilters,
  (prevProps: any, nextProps: any) => {
    if (
      prevProps.setPage !== nextProps.setPage ||
      prevProps.setFilters !== nextProps.setFilters ||
      prevProps.setSelectResult !== nextProps.setSelectResult ||
      prevProps.setSelectedRowKeys !== nextProps.setSelectedRowKeys ||
      prevProps.currency?.value !== nextProps.currency?.value
    ) {
      return false;
    }
    return true;
  },
);

export default DebitAndCreditFilters;
