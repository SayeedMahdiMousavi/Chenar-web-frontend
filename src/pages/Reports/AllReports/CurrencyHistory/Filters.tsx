import React, { memo } from "react";
import { Row, Col, Form, Button } from "antd";
import { useTranslation } from "react-i18next";
import { handlePrepareDateForServer } from "../../../../Functions/utcDate";
import ReportDateFormItem from "../../Components/DateFormItem";
import { InfiniteScrollSelectFormItem } from "../../../../components/antd";
import { useDefaultReportDateFormItem } from "../../../../Hooks";

interface Item {
  startDate: string;
  endDate: string;
  currency: { value: string; label: string };
}

interface IProps {
  setFilters: (value: Item) => void;
  setSelectedRowKeys: (value: string[]) => void;
  setPage: (value: number) => void;
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
    const newFilters = {
      currency: values?.currency ?? { value: "", label: "" },
      startDate: startDate ?? "",
      endDate: endDate ?? "",
    };
    //@ts-ignore
    props.setFilters((prev: any) => {
      if (
        prev?.currency?.value !== newFilters?.currency?.value ||
        prev?.startDate !== newFilters?.startDate ||
        prev?.endDate !== newFilters?.endDate
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
      layout="vertical"
      onFinish={onFinish}
      form={form}
      initialValues={{
        date: "allDates",
        dateTime: defaultDate,
      }}
    >
      <Row gutter={[10, 10]}>
        <ReportDateFormItem form={form} style={styles.margin} />
        <Col xxl={14} xl={10} lg={11}></Col>
        {/* <Col span={24}>
          <RangePickerFormItem
            showTime={true}
            placeholder={["", ""]}
            format="YYYY-MM-DD HH:mm"
            rules={[]}
            name="dateTime"
            label={
              <Row className="num" style={{ height: "20px" }}>
                <Col span={13}>{t("Expenses.Table.Start")}</Col>
                <Col span={11}>{t("Expenses.Table.End")}</Col>
              </Row>
            }
            style={styles.margin}
          />
        </Col> */}
        <Col xxl={4} xl={5} lg={5}>
          <InfiniteScrollSelectFormItem
            name="currency"
            placeholder={t("Sales.Product_and_services.Currency.1")}
            style={styles.margin}
            fields="name,id,symbol,is_active&ordering=-is_active"
            baseUrl="/currency/"
            place="currencyHistory"
            allowClear={true}
          />
        </Col>

        <Col xxl={8} xl={10} lg={10}>
          <Form.Item className="margin" style={styles.margin}>
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
  margin: { marginBottom: "4px" },
  spin: { margin: "20px" },
};

//@ts-ignore
// eslint-disable-next-line no-func-assign
Filters = memo(Filters);

export default Filters;
