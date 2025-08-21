import React, { memo } from "react";
import { Row, Col, Form, Button } from "antd";
import { useTranslation } from "react-i18next";
import ReportDateFormItem from "../../Components/DateFormItem";
import { handlePrepareDateForServer } from "../../../../Functions/utcDate";
import { useDefaultReportDateFormItem } from "../../../../Hooks";
import {
  InvoiceStatusSelect,
  InvoiceTypeFormItem,
} from "../../../../components";
import { MANI_INVOICES_VALUE } from "../../../../constants";

interface IProps {
  setPage: (value: number) => void;
  setFilters: (value: any) => void;
  setSelectedRowKeys: (value: string[]) => void;
  setSelectResult: (value: boolean) => void;
}
function Filters(props: IProps) {
  const { t } = useTranslation();

  const statusDefaultValue = { value: "pending", label: t("Pending") };

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
      invoiceType: values?.invoiceType,
      status: values?.status,
      startDate: startDate ?? "",
      endDate: endDate ?? "",
    };

    props.setFilters((prev: any) => {
      if (
        prev?.invoiceType?.value !== newFilters?.invoiceType?.value ||
        prev?.status?.value !== newFilters?.status?.value ||
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
        date: "allDates",
        dateTime: defaultDate,
        invoiceType: {
          value: MANI_INVOICES_VALUE,
          label: t("All_posting_invoice"),
        },
        status: statusDefaultValue,
      }}
    >
      <Row gutter={[10, 10]} style={{ marginBottom: "20px" }}>
        <ReportDateFormItem form={form} style={styles.formItem} />
        <Col xxl={14} xl={10} lg={11}></Col>

        <Col xxl={4} xl={5} lg={5}>
          <InvoiceTypeFormItem style={styles.formItem} />
        </Col>

        <Col xxl={4} xl={5} lg={5}>
          <InvoiceStatusSelect style={styles.formItem} labelInValue={true} />
        </Col>
        {/* <Col xxl={14} xl={11} lg={11}></Col> */}
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
