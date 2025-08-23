import React, { memo } from 'react';
import { Row, Col, Form, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import ReportDateFormItem from '../../Components/DateFormItem';
import { handlePrepareDateForServer } from '../../../../Functions/utcDate';
import CashAndBankProperties from '../../../Transactions/Components/CashAndBankProperties';
import { useDefaultReportDateFormItem } from '../../../../Hooks';

interface IProps {
  setPage: (value: number) => void;
  setFilters: (value: any) => void;
  setResultSelectedRowKeys: (value: any) => void;
  setSelectedRowKeys: (value: any) => void;
}

function MoneyTransferFilters(props: IProps) {
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
      payBy: values?.payBankName,
      recBy: values?.recBankName,
      startDate: startDate,
      endDate: endDate,
    };

    props.setFilters((prev: any) => {
      if (
        prev?.payBy?.value !== newFilters?.payBy?.value ||
        prev?.recBy?.value !== newFilters?.recBy?.value ||
        prev?.startDate !== newFilters?.startDate ||
        prev?.endDate !== newFilters?.endDate
      ) {
        props.setSelectedRowKeys([]);
        props.setResultSelectedRowKeys([]);

        return newFilters;
      } else {
        return newFilters;
      }
    });

    props.setPage(1);
  };

  const onChangePayBankName = (value: string) => {
    form.setFieldsValue({ payBankId: value });
  };
  const onChangePayBankId = (value: { value: string; label: string }) => {
    if (value.value) {
      form.setFieldsValue({ payBankName: value });
    } else {
      form.setFieldsValue({ payBankName: undefined });
    }
  };

  const onChangeRecBankName = (value: string) => {
    form.setFieldsValue({ recBankId: value });
  };
  const onChangeRecBankId = (value: { value: string; label: string }) => {
    if (value.value) {
      form.setFieldsValue({ recBankName: value });
    } else {
      form.setFieldsValue({ recBankName: undefined });
    }
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
        <Col xxl={14} xl={10} lg={11}></Col>
        <Col xxl={4} xl={5} lg={5}>
          <CashAndBankProperties
            onChangBankName={onChangePayBankName}
            onChangBankId={onChangePayBankId}
            form={form}
            fieldId='payBankId'
            fieldName='payBankName'
            place='report'
            namePlaceholder={t('Reports.Payer_name')}
            idPlaceholder={t('Reports.Payer_id')}
          />
        </Col>
        <Col xxl={4} xl={5} lg={5}>
          <CashAndBankProperties
            onChangBankName={onChangeRecBankName}
            onChangBankId={onChangeRecBankId}
            form={form}
            fieldId='recBankId'
            fieldName='recBankName'
            place='report'
            namePlaceholder={t('Reports.Receiver_name')}
            idPlaceholder={t('Reports.Receiver_id')}
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
MoneyTransferFilters = memo(MoneyTransferFilters);

export default MoneyTransferFilters;
