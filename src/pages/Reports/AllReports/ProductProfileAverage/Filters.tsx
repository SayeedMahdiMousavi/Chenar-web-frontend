import React, { memo } from 'react';
import { Row, Col, Form, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import ReportDateFormItem from '../../Components/DateFormItem';
import { handlePrepareDateForServer } from '../../../../Functions/utcDate';
import { CategoryField } from '../../../SelfComponents/CategoryField';
import { InfiniteScrollSelectFormItem } from '../../../../components/antd';
import { useDefaultReportDateFormItem } from '../../../../Hooks';

interface IProps {
  setPage: (value: number) => void;
  setFilters: (value: any) => void;
  setSelectedRowKeys: (value: string[]) => void;
  setSelectResult: (value: boolean) => void;
}

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

    const category = values?.category ?? { value: '', label: '' };
    const product = values?.product ?? { value: '', label: '' };

    const newFilters = {
      category: category,
      product: product,
      // supplier: values?.supplier?.value ? values?.supplier?.value : "",
      // availableMin: values?.minMax?.[0],
      // availableMax: values?.minMax?.[1],
      startDate: startDate,
      endDate: endDate,
    };

    props.setFilters((prev: any) => {
      if (
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
      }}
      // className="table__header1-filter-drop"
      //   style={styles.form}
    >
      <Row gutter={[10, 10]} style={{ marginBottom: '20px' }}>
        <ReportDateFormItem form={form} style={styles.formItem} />
        <Col xxl={14} xl={10} lg={11}></Col>
        <Col xxl={4} xl={5} lg={5}>
          <InfiniteScrollSelectFormItem
            name='product'
            style={styles.formItem}
            fields='name,id'
            placeholder={t('Sales.Product_and_services.Product')}
            baseUrl='/product/items/'
            allowClear={true}
          />
        </Col>
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
Filters = memo(Filters);

export default Filters;
