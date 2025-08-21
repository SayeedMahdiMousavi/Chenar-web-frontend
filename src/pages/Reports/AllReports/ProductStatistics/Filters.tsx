import React from "react";
import { Row, Col, Form, Button, Select } from "antd";
import { useTranslation } from "react-i18next";
import { CategoryField } from "../../../SelfComponents/CategoryField";
import { InfiniteScrollSelectFormItem } from "../../../../components/antd";

interface IProps {
  setPage: (value: number) => void;
  setFilters: (value: any) => void;
  type: string;
  setSelectedRowKeys: (value: any) => void;
}

export default function Filters(props: IProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    const newFilters = {
      warehouse: values?.warehouse,
      category: values?.category,
      product: values?.product,
      supplier: values?.supplier,
      priceMethod: values?.priceMethod,
      // availableMin: values?.minMax?.[0],
      // availableMax: values?.minMax?.[1],
    };
    props.setFilters((prev: any) => {
      if (
        prev?.category?.value !== newFilters?.category?.value ||
        prev?.product?.value !== newFilters?.product?.value ||
        prev?.supplier?.value !== newFilters?.supplier?.value ||
        prev?.priceMethod?.value !== newFilters?.priceMethod?.value ||
        prev?.warehouse?.value !== newFilters?.warehouse?.value
      ) {
        props.setSelectedRowKeys([]);
        return newFilters;
      } else {
        return newFilters;
      }
    });
    props.setPage(1);
  };

  return (
    <Form
      layout="horizontal"
      onFinish={onFinish}
      form={form}
      colon={false}
      hideRequiredMark
      initialValues={{
        date: "allDates",
        minMax: [0, 3000],
        priceMethod: { value: "average", label: t("Reports.Average_price") },
      }}
    >
      <Row gutter={[10, 0]}>
        <Col xxl={5} xl={6} lg={6}>
          {props.type === "purchasePrice" || props.type === "salesPrice" ? (
            <Form.Item name="priceMethod" style={styles.formItem}>
              <Select labelInValue>
                <Select.Option value="default">
                  {t("Reports.Default_price")}
                </Select.Option>
                {/* <Select.Option value="fifo ">First </Select.Option> */}
                <Select.Option value="average">
                  {t("Reports.Average_price")}
                </Select.Option>
                <Select.Option value="last">
                  {t("Reports.Last_price")}
                </Select.Option>
              </Select>
            </Form.Item>
          ) : (
            <InfiniteScrollSelectFormItem
              name="warehouse"
              style={styles.formItem}
              fields="name,id"
              placeholder={t("Warehouse.1")}
              baseUrl="/inventory/warehouse/"
              allowClear={true}
            />
          )}
        </Col>
        <Col xxl={5} xl={6} lg={6}>
          <InfiniteScrollSelectFormItem
            name="product"
            style={styles.formItem}
            fields="name,id"
            placeholder={t("Sales.Product_and_services.Product")}
            baseUrl="/product/items/"
            allowClear={true}
          />
        </Col>
        <Col xxl={3} xl={5} lg={6}>
          {/* <Form.Item
            name="minMax"
            //  label={t("Reports.Available_range")}
          >
            <Slider
              range
              max={3000}
              tooltipVisible={showTooltip}
              // style={{ width: `calc(100% - 100px)` }}
              //@ts-ignore
              onFocus={handelFocus}
              onBlur={handelBlur}
            ></Slider>
          </Form.Item> */}
        </Col>
        <Col xxl={8} xl={6} lg={5}></Col>
        <Col xxl={5} xl={6} lg={6}>
          <CategoryField
            form={form}
            place="filter"
            label=""
            style={styles.formItem}
            placeholder={t("Sales.Product_and_services.Form.Category")}
            url="/product/category/"
          />
        </Col>

        <Col xxl={5} xl={6} lg={6}>
          <InfiniteScrollSelectFormItem
            name="supplier"
            placeholder={t("Expenses.Suppliers.Supplier")}
            style={styles.formItem}
            fields="full_name,id"
            baseUrl="/supplier_account/supplier/"
            allowClear={true}
          />
        </Col>
        <Col span={7}>
          <Form.Item className="margin" style={styles.formItem}>
            <Button type="primary" size="small" htmlType="submit" shape="round">
              {t("Form.Search")}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

const styles = {
  form: {
    width: "250px",
  },
  formItem: { marginBottom: 10 },
};
