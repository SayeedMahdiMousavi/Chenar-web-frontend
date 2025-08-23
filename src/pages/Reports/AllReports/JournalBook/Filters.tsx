import React, { memo } from 'react';
import { Row, Col, Form, Button, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import CashAndBankProperties from '../../../Transactions/Components/CashAndBankProperties';
import { handlePrepareDateForServer } from '../../../../Functions/utcDate';
import ReportDateFormItem from '../../Components/DateFormItem';
import { InfiniteScrollSelectFormItem } from '../../../../components/antd';
import { useDefaultReportDateFormItem } from '../../../../Hooks';

interface IProps {
  setPage: (value: number) => void;
  setFilters: (value: any) => void;
  setSelectResult: (value: boolean) => void;
  setSelectedRowKeys: (value: string[]) => void;
}
const { Option } = Select;

function Filters(props: IProps) {
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
      currencyData:
        values?.currency?.value === 'all'
          ? { value: '', label: '' }
          : values?.currency,
      bank:
        values?.bankName?.value === 'all'
          ? { value: '', label: '' }
          : values?.bankName,
      accountType: values?.accountType,
      startDate: startDate,
      endDate: endDate,
    };

    props.setFilters((prev: any) => {
      if (
        prev?.currencyData?.value !== newFilters?.currencyData?.value ||
        prev?.bank?.value !== newFilters?.bank?.value ||
        prev?.accountType?.value !== newFilters?.accountType?.value ||
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

  const onChangeBankName = (value: string) => {
    form.setFieldsValue({ bankId: value });
  };

  const onChangeBankId = (value: { value: string; label: string }) => {
    form.setFieldsValue({ bankName: value });
  };

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
      <Row gutter={[10, 10]} style={{ marginBottom: '20px' }}>
        <ReportDateFormItem form={form} style={styles.formItem} />
        <Col xxl={14} xl={11} lg={11}></Col>
        <Col xxl={4} xl={5} lg={6}>
          <CashAndBankProperties
            onChangBankName={onChangeBankName}
            onChangBankId={onChangeBankId}
            form={form}
            fieldId='bankId'
            fieldName='bankName'
            place='report'
          />
        </Col>
        <Col xxl={4} xl={5} lg={6}>
          <Form.Item name='accountType' style={styles.formItem}>
            <Select
              className='num'
              placeholder={t('Account_type')}
              allowClear
              labelInValue
            >
              <Option value='bank'>{t('Banking.Bank')}</Option>
              <Option value='cash'>{t('Banking.Cash_box.Cash')}</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xxl={14} xl={11} lg={11}></Col>
        <Col xxl={4} xl={5} lg={6}>
          <InfiniteScrollSelectFormItem
            name='currency'
            placeholder={t('Sales.Product_and_services.Inventory.Currency')}
            style={styles.formItem}
            fields='name,id,symbol'
            baseUrl='/currency/active_currency_rate/'
            allowClear={true}
          />
        </Col>{' '}
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

//@ts-ignore
// eslint-disable-next-line no-func-assign
Filters = memo(Filters);

const styles = {
  form: {
    width: '250px',
  },
  formItem: { marginBottom: 0 },
};

export default Filters;
