import React from 'react';
import { Row, Col, Select, Form, Button, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
// import { useQuery } from "react-query";
// import axiosInstance from "../../ApiBaseUrl";
import { CategoryField } from '../../SelfComponents/CategoryField';
import { ApplyButton, ResetButton } from '../../../components';

const { Option } = Select;
export default function Filters(props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  // const getType = async (key) => {
  //   const { data } = await axiosInstance.get(
  //     `/customer_account/discount/type/?page=1&page_size=100`
  //   );
  //   return data;
  // };
  // const discountType = useQuery("/customer_account/discount/type/", getType);
  // const getDiscountCard = async (key) => {
  //   const { data } = await axiosInstance.get(
  //     `/customer_account/discount/card/?page=1&page_size=100`
  //   );
  //   return data;
  // };
  // const discountCards = useQuery(
  //   "/customer_account/discount/card/",
  //   getDiscountCard
  // );

  const onFinish = async (values) => {
    props.setFilters((prev) => ({
      ...prev,
      state: values.status,
      category: values.category?.label ?? '',
    }));
    props.setPage(1);
    props.setVisible(false);
  };

  const onReset = () => {
    form.resetFields();
    props.setVisible(false);
    props.setFilters((prev) => ({
      ...prev,
      state: 'active',
      category: '',
    }));
    props.setPage(1);
  };

  return (
    <Form
      layout='vertical'
      onFinish={onFinish}
      form={form}
      initialValues={{
        status: 'active',
      }}
      className='customer_filter'
    >
      <Row className='expenses_filter_row' gutter={[15, 15]} align='bottom'>
        <Col span={24}>
          <Form.Item
            name='status'
            label={<span>{t('Sales.Product_and_services.Status')}</span>}
            style={styles.margin}
          >
            <Select
              className='table__header1-select'
              autoFocus
              placeholder={
                <span>{t('Sales.Product_and_services.Status')}</span>
              }
            >
              <Option value='active'>
                {t('Sales.Product_and_services.Active')}
              </Option>
              <Option value='deactivate'>
                {t('Sales.Product_and_services.Inactive')}
              </Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={24}>
          <CategoryField
            form={form}
            place='filter'
            url='/customer_account/customer_category/'
            label={<span>{t('Sales.Product_and_services.Form.Category')}</span>}
            style={styles.margin}
          />
        </Col>
        {/* <Col span={24} style={{ paddingBottom: "0px" }}>
          <Divider
            style={styles.margin}
            // className="invoice_divider"
          />
        </Col>
        <Col md={11} xs={22}>
          <Form.Item
            name="isCardExist"
            // label={<span>{t("Sales.Customers.Discount.Is_card_exist")}</span>}
            label={t("Sales.Customers.Form.Discount_properties")}
            style={styles.margin}
          >
            <Select
              placeholder={
                <span>{t("Sales.Customers.Discount.Is_card_exist")}</span>
              }
              className="table__header1-select"
              allowClear
            >
              <Option value={false}>{t("Manage_users.Yes")}</Option>
              <Option value={true}>{t("Manage_users.No")}</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col md={13} xs={24}>
          <Form.Item
            name="discountCard"
            // label={
            //   <span>{t("Sales.Customers.Discount.Customers_discount")}</span>
            // }
            style={styles.margin}
          >
            <Select
              showSearch
              showArrow
              allowClear
              placeholder={
                <span>{t("Sales.Customers.Discount.Customers_discount")}</span>
              }
              // optionLabelProp="label"
              optionFilterProp="label"
              // popupClassName="z_index"
              dropdownRender={(menu) => <div>{menu}</div>}
            >
              {discountCards?.data?.results?.map((item) => (
                <Select.Option
                  value={item?.name}
                  key={item?.id}
                  label={item?.name}
                >
                  {item?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={11} xs={22}>
          <Form.Item
            name="isCardExpire"
            // label={<span>{t("Sales.Customers.Discount.Is_card_expire")}</span>}
            style={styles.margin}
          >
            <Select
              placeholder={
                <span>{t("Sales.Customers.Discount.Is_card_expire")}</span>
              }
              className="table__header1-select"
              allowClear
            >
              <Option value={true}>{t("Manage_users.Yes")}</Option>
              <Option value={false}>{t("Manage_users.No")}</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col md={13} xs={24}>
          <Form.Item
            name="discountCardType"
       
            style={styles.margin}
          >
            <Select
              showSearch
              showArrow
              allowClear
              placeholder={
                <span>
                  {t("Sales.Customers.Discount.Discount_card_type")}
               
                </span>
              }
              // optionLabelProp="label"
              optionFilterProp="label"
              // popupClassName="z_index"
              dropdownRender={(menu) => <div>{menu}</div>}
            >
              {discountType?.data?.results?.map((item) => (
                <Select.Option
                  value={item?.name}
                  key={item?.id}
                  label={item?.name}
                >
                  {item?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col> */}
        <Col span={24} style={{ paddingBottom: '10px' }}>
          <Divider
            style={styles.margin}
            // className="invoice_divider"
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item style={styles.margin}>
            <Row className='num' justify='space-between'>
              <Col>
                <ResetButton onClick={onReset} />
              </Col>
              <Col>
                <ApplyButton />
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
const styles = {
  margin: { margin: '0px' },
};
