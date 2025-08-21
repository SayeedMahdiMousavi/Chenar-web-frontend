import React, { memo } from "react";
import { Row, Col, Form, Button } from "antd";
import { useTranslation } from "react-i18next";
import ReportDateFormItem from "../../Components/DateFormItem";
import { handlePrepareDateForServer } from "../../../../Functions/utcDate";
import { CustomerProperties } from "../../../Transactions/Components/CustomerProperties";
import { ExpenseProperties } from "../../../Transactions/Components/ExpenseProperties";
import { IncomeProperties } from "../../../Transactions/Components/IncomeProperties";
import { useDefaultReportDateFormItem } from "../../../../Hooks";
import { EmployeeProperties } from "../../../Transactions/Components/EmployeeProperties";
import { InvoiceStatusSelect } from "../../../../components";

interface IProps {
  setPage: (value: number) => void;
  setFilters: (value: any) => void;
  type: string;
  setResultSelectedRowKeys?: (value: string[]) => void;
  setSelectedRowKeys?: (value: string[]) => void;
}

function Filters(props: IProps) {
  const { t } = useTranslation();
  const { form, defaultDate, calendarCode } = useDefaultReportDateFormItem();

  const statusDefaultValue = { value: "pending", label: t("Pending") };

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
      representative: values?.employeeName,
      status: values?.status,
      account:
        props.type === "expense"
          ? values?.expenseName
          : props.type === "income"
          ? values?.incomeName
          : values?.customerName,
      startDate: startDate,
      endDate: endDate,
    };

    props.setFilters((prev: any) => {
      if (
        prev?.account?.value !== newFilters?.account?.value ||
        prev?.startDate !== newFilters?.startDate ||
        prev?.endDate !== newFilters?.endDate
      ) {
        if (props.setSelectedRowKeys) {
          props.setSelectedRowKeys([]);
        }
        if (props.setResultSelectedRowKeys) {
          props.setResultSelectedRowKeys([]);
        }

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
        date: "allDates",
        dateTime: defaultDate,
        status: statusDefaultValue,
      }}
    >
      <Row gutter={[10, 10]} style={{ marginBottom: "20px" }}>
        <ReportDateFormItem form={form} style={styles.formItem} />
        <Col xxl={14} xl={10} lg={11}></Col>
        <Col xxl={4} xl={5} lg={6}>
          {props.type === "expense" ? (
            <ExpenseProperties place="report" form={form} />
          ) : props.type === "income" ? (
            <IncomeProperties form={form} place="report" />
          ) : (
            <CustomerProperties
              place="report"
              form={form}
              placeholder={t("Sales.All_sales.Invoice.Customer_name")}
            />
          )}
        </Col>
        {props?.type !== "income" && props.type !== "expense" && (
          <React.Fragment>
            <Col xxl={4} xl={5} lg={6}>
              <EmployeeProperties
                form={form}
                place="report"
                placeholder={t("Representative")}
              />
            </Col>
            <Col xxl={16} xl={10} lg={11}></Col>
            <Col xxl={4} xl={5} lg={6}>
              <InvoiceStatusSelect
                style={styles.formItem}
                labelInValue={true}
              />
            </Col>
          </React.Fragment>
        )}

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
