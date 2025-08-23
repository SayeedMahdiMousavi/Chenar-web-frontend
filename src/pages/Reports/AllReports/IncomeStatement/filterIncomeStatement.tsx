import React, { useState, useEffect } from 'react';
import {
  Checkbox,
  Row,
  Col,
  Select,
  message,
  Menu,
  Form,
  Table,
  Dropdown,
  Button,
  Input,
  Modal,
  DatePicker,
} from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};
const { Option } = Select;
interface IProps {
  sentFilterDate: (values: any) => void;
  onResetFunction: () => void;
}
const FiltersIncomeStatement: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  //   const database = useDatabase();
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);

  //   useEffect(() => {
  //     setItems(props.customers);
  //   }, [props.customers]);
  const onFinish = async (fieldsValue: any) => {
    const rangeValue = fieldsValue['range-picker'];
    //   console.log("rangeValue" , rangeValue?.[0]?.format("YYYY-MM-DD"))
    const values = {
      startDate: rangeValue?.[0]?.format('YYYY-MM-DD'),
      endDate: rangeValue?.[1]?.format('YYYY-MM-DD'),
    };
    props?.sentFilterDate(values);
    // const values = {
    //   ...fieldsValue,
    //   "range-picker": [
    //     rangeValue[0].format("YYYY-MM-DD"),
    //     rangeValue[1].format("YYYY-MM-DD"),
    //   ],
    // };
    // await props.filter(values);
  };
  const onReset = () => {
    form.resetFields();
    props?.onResetFunction();
  };

  const handleApplyFunction = () => {};
  return (
    <Form
      {...formItemLayout}
      layout='vertical'
      onFinish={onFinish}
      form={form}
      initialValues={{
        ['date']: 'all dates',
      }}
      className='payment_table_filter'
      style={{ marginBottom: '1rem', borderRadius: '10px', border: 'none' }}
    >
      <Row gutter={[0, 11]}>
        {/* <Col span={22} offset={1}>
          <Form.Item
            name="date"
            label={t("Sales.Customers.Form.Date")}
            style={styles.margin}
          >
            <Select className="table__header1-select num" allowClear>
              <Option value="all dates">
                {t("Sales.Customers.Table.All_dates")}
              </Option>
              <Option value="last 365 days">
                {t("Expenses.Table.last_365_days")}
              </Option>
              <Option value="custom">{t("Expenses.Table.Custom")}</Option>

              <Option value="tody"> {t("Sales.Customers.Table.Tody")}</Option>
              <Option value="yesterday">
                {t("Sales.Customers.Table.Yesterday")}
              </Option>
              <Option value="this_week">
                {t("Sales.Customers.Table.This_week")}
              </Option>
              <Option value="this_month">
                {t("Sales.Customers.Table.This_month")}
              </Option>
              <Option value="this_quarter">
                {t("Sales.Customers.Table.This_quarter")}
              </Option>

              <Option value="this_year">
                {t("Sales.Customers.Table.This_year")}
              </Option>

              <Option value="last_week">
                {t("Sales.Customers.Table.Last_week")}
              </Option>
              <Option value="last month">
                {t("Sales.Customers.Table.Last_month")}
              </Option>
              <Option value="last quarter">
                {t("Sales.Customers.Table.Last_quarter")}
              </Option>
              <Option value="last year">
                {t("Sales.Customers.Table.Last_year")}
              </Option>
            </Select>
          </Form.Item>
        </Col> */}
        <Col span={22} offset={1}>
          <Form.Item
            name='range-picker'
            label={
              <Row className='num' style={{ height: '25px' }}>
                <Col span={13}>{t('Expenses.Table.Start')}</Col>
                <Col span={11}>{t('Expenses.Table.End')}</Col>
              </Row>
            }
            // style={styles.margin}
          >
            <RangePicker
              popupClassName='expenses_rangePicker'
              className='num'
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item style={styles.margin}>
            <Row
              className='num unit__cancel'
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Col
                // xl={{ span: 6, offset: 1 }}
                // md={{ span: 6, offset: 1 }}
                // sm={{ span: 8, offset: 1 }}
                // xs={{ span: 12 }}
                md={12}
              >
                <Button htmlType='reset' shape='round' onClick={onReset}>
                  {t('Form.Reset')}
                </Button>
              </Col>
              <Col
                // xl={{ span: 6, offset: 10 }}
                // md={{ span: 6, offset: 10 }}
                // sm={{ span: 8, offset: 7 }}
                // xs={{ span: 12 }}
                md={12}
                style={{
                  justifyContent: 'end',
                  display: 'flex',
                  paddingInlineEnd: '10px',
                }}
              >
                <Button type='primary' htmlType='submit' shape='round'>
                  {t('Form.Apply')}
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
const styles = {
  margin: { marginBottom: '0rem' },
};
// const mapStateToProps = (state:any) => ({
//   rtl: state.direction.rtl,
//   ltr: state.direction.ltr,
// });

// const enhancProduct = withObservables(["customers"], ({ database }) => ({
//   customers: database.collections.get("customers").query().observe(),
// }));

export default FiltersIncomeStatement;
// export default connect(mapStateToProps)(withDatabase(enhancProduct(Filters)));
