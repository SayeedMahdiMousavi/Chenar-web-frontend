import React, { memo } from 'react';
import { Row, Col, Form, Button, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import ReportDateFormItem from '../../Components/DateFormItem';
import { handlePrepareDateForServer } from '../../../../Functions/utcDate';
import { CategoryField } from '../../../SelfComponents/CategoryField';
import { EmployeeAndCustomerAndSupplierChart } from '../../../Transactions/Components/EmployeeAndCustomerAndSupplierChart';
import { InfiniteScrollSelectFormItem } from '../../../../components/antd';
import { useDefaultReportDateFormItem } from '../../../../Hooks';

interface IProps {
  setPage: (value: number) => void;
  setFilters: (value: any) => void;
  setSelectedRowKeys: (value: string[]) => void;
  setSelectResult: (value: boolean) => void;
}

function TotalSoledFilters(props: IProps) {
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
      customer: values?.accountName ?? { value: '', label: '' },
      invoiceType: values?.invoiceType ?? { value: '', label: 'sales' },
      category: values?.category ?? { value: '', label: '' },
      product: values?.product ?? { value: '', label: '' },
      startDate: startDate,
      endDate: endDate,
    };

    props.setFilters((prev: any) => {
      if (
        prev?.invoiceType?.value !== newFilters?.invoiceType?.value ||
        prev?.customer?.value !== newFilters?.customer?.value ||
        prev?.category?.value !== newFilters?.category?.value ||
        prev?.product?.value !== newFilters?.product?.value ||
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

  return (
    <Form
      onFinish={onFinish}
      form={form}
      hideRequiredMark
      initialValues={{
        date: 'allDates',
        dateTime: defaultDate,
        invoiceType: {
          value: 'sales',
          label: t('Sales.1'),
        },
      }}
    >
      <Row gutter={[10, 10]} style={{ marginBottom: '20px' }}>
        <ReportDateFormItem form={form} style={styles.formItem} />
        <Col xxl={14} xl={11} lg={11}></Col>
        <Col xxl={4} xl={5} lg={5}>
          <Form.Item name='invoiceType' style={styles.formItem}>
            <Select
              className='num'
              // allowClear
              labelInValue
              placeholder={t('Sales.Product_and_services.Type')}
            >
              <Select.Option value='sales'>{t('Sales.1')}</Select.Option>
              {/* <Select.Option value="sales_rej">
                {t("Sales.All_sales.Invoice.Reject_sales_invoice")}
              </Select.Option> */}

              <Select.Option value='purchase'>{t('Purchase')}</Select.Option>

              {/* <Select.Option value="purchase_rej">
                {t("Sales.All_sales.Invoice.Reject_purchase_invoice")}
              </Select.Option> */}
            </Select>
          </Form.Item>
        </Col>
        <Col xxl={5} xl={6} lg={7}>
          <EmployeeAndCustomerAndSupplierChart
            form={form}
            style={styles.formItem}
          />
        </Col>
        <Col xxl={13} xl={13} lg={12}></Col>
        <Col xxl={4} xl={5} lg={5}>
          <CategoryField
            form={form}
            place='filter'
            label=''
            style={styles.formItem}
            placeholder={t('Sales.Product_and_services.Form.Category')}
            url='/product/category/'
          />
        </Col>
        <Col xxl={4} xl={6} lg={7}>
          <InfiniteScrollSelectFormItem
            name='product'
            style={styles.formItem}
            fields='name,id'
            placeholder={t('Sales.Product_and_services.Product')}
            baseUrl='/product/items/'
            allowClear={true}
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
    width: '250px',
  },
  formItem: { marginBottom: 0 },
};

//@ts-ignore
// eslint-disable-next-line no-func-assign
TotalSoledFilters = memo(TotalSoledFilters);

export default TotalSoledFilters;
