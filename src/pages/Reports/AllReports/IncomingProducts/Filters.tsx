import React, { memo } from "react";
import { Row, Col, Form, Button } from "antd";
import { useTranslation } from "react-i18next";
import ReportDateFormItem from "../../Components/DateFormItem";
import { handlePrepareDateForServer } from "../../../../Functions/utcDate";
import { CategoryField } from "../../../SelfComponents/CategoryField";
import { InfiniteScrollSelectFormItem } from "../../../../components/antd";
import { ChartAccountFormItem } from "../../../Transactions/Components/ChartAccountFormItem";
import { useDefaultReportDateFormItem } from "../../../../Hooks";

const baseUrl = "/chart_of_account/ACU-103/child/";
const searchKey = "/customer/search/";

interface IProps {
  setPage: (value: number) => void;
  setFilters: (value: any) => void;
  type: string;
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

    props.setFilters({
      currencyId:
        values?.currency?.value === "all" ? "" : values?.currency?.value,
      customerName: values?.customerName?.label ?? "",
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
        date: "allDates",
        dateTime: defaultDate,
      }}
    >
      <Row gutter={[10, 10]}>
        <ReportDateFormItem form={form} style={styles.formItem} />
        <Col xxl={14} xl={10} lg={11}></Col>
        <Col xxl={4} xl={5} lg={5}>
          {props.type === "outgoing" ? (
            <ChartAccountFormItem
              placeholder={t("Sales.Customers.Receive_cash.Payer")}
              name="customerName"
              searchIn="customer"
              baseUrl={baseUrl}
              searchKey={searchKey}
              place="report"
            />
          ) : (
            <InfiniteScrollSelectFormItem
              name="supplier"
              placeholder={t("Banking.Form.Account_name")}
              style={styles.formItem}
              fields="full_name,id"
              baseUrl="/supplier_account/supplier/"
              allowClear={true}
            />
          )}
        </Col>
        <Col xxl={5} xl={8} lg={8}>
          <InfiniteScrollSelectFormItem
            name="warehouse"
            style={styles.formItem}
            fields="name,id"
            placeholder={t("Warehouse.1")}
            baseUrl="/inventory/warehouse/"
            allowClear={true}
          />
        </Col>

        <Col xxl={14} xl={11} lg={11}></Col>
        <Col xxl={4} xl={5} lg={5}>
          <InfiniteScrollSelectFormItem
            name="product"
            style={styles.formItem}
            fields="name,id"
            placeholder={t("Sales.Product_and_services.Product")}
            baseUrl="/product/items/"
            allowClear={true}
          />
        </Col>
        <Col xxl={4} xl={5} lg={5}>
          <CategoryField
            form={form}
            place="filter"
            label=""
            style={styles.formItem}
            placeholder={t("Sales.Product_and_services.Form.Category")}
            url="/product/category/"
          />
        </Col>

        <Col xxl={8} xl={10} lg={10}>
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
  formItem: { marginBottom: 0 },
};

//@ts-ignore
// eslint-disable-next-line no-func-assign
Filters = memo(Filters);

export default Filters;
