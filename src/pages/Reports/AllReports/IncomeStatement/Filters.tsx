import React, { memo } from 'react';
import { Row, Col, Form, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import ReportDateFormItem from '../../Components/DateFormItem';
import { handlePrepareDateForServer } from '../../../../Functions/utcDate';
import { useDefaultReportDateFormItem } from '../../../../Hooks';

interface IProps {
  setPage: (value: number) => void;
  setFilters: (value: any) => void;
  setSelectedRowKeys: (value: any) => void;
}

const dateFormat = 'YYYY-MM-DD';

function IncomeStatementsFilters(props: IProps) {
  const { t } = useTranslation();
  const { form, defaultDate, calendarCode } = useDefaultReportDateFormItem();

  const onFinish = async (values: any) => {
    const startDate = handlePrepareDateForServer({
      calendarCode,
      date: values?.dateTime?.[0],
      dateFormat,
    });
    const endDate = handlePrepareDateForServer({
      calendarCode,
      date: values?.dateTime?.[1],
      dateFormat,
    });

    const newFilters = {
      startDate: startDate ?? '',
      endDate: endDate ?? '',
    };

    props.setFilters((prev: any) => {
      if (
        prev?.startDate !== newFilters?.startDate ||
        prev?.endDate !== newFilters?.endDate
      ) {
        props.setSelectedRowKeys([]);

        return newFilters;
      } else {
        return newFilters;
      }
    });

    props.setFilters({
      startDate: startDate,
      endDate: endDate,
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
      }}
    >
      <Row gutter={[10, 10]} style={{ marginBottom: '20px' }}>
        <ReportDateFormItem
          form={form}
          style={styles.formItem}
          type='expiredProducts'
        />

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
  formItem: { marginBottom: 0 },
};

//@ts-ignore
// eslint-disable-next-line no-func-assign
IncomeStatementsFilters = memo(IncomeStatementsFilters);

export default IncomeStatementsFilters;
