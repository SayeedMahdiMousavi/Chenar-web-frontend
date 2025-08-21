import React, { useEffect, memo } from "react";
import { Row, Col, Form, Button } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import useGetCalender from "../../../../Hooks/useGetCalender";
import useGetRunningPeriod from "../../../../Hooks/useGetRunningPeriod";
import { useTranslation } from "react-i18next";
import ReportDateFormItem from "../../Components/DateFormItem";
import {
  changeGToJ,
  handlePrepareDateForServer,
  utcDate,
} from "../../../../Functions/utcDate";
import { indianToArabic } from "../../../../Functions/arabicToIndian";
import { RangePickerFormItem } from "../../../SelfComponents/JalaliAntdComponents/RangePickerFormItem";
import { useMemo } from "react";
import { InfiniteScrollSelectFormItem } from "../../../../components/antd";
import { defaultStartPeriodDate } from "../../../../constants";
import { CategoryField } from "../../../SelfComponents/CategoryField";

interface IProps {
  setPage: (value: number) => void;
  setFilters: (value: any) => void;
  setSelectedRowKeys: (value: any) => void;
  setSelectResult?: (value: boolean) => void;
  type: string;
}

const jalaliType: { jalali: boolean } = {
  //@ts-ignore
  jalali: true,
};

function Filters(props: IProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const dateFormat = useMemo(
    () =>
      props.type === "expiredProducts" ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm",
    [props.type]
  );
  //get running period
  const runningPeriod = useGetRunningPeriod();
  const curStartDate = runningPeriod?.data?.start_date;
  const failureCount: number = runningPeriod?.failureCount;
  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  const onFinish = async (values: any) => {
    const startDate = handlePrepareDateForServer({
      date: values?.dateTime?.[0],
      calendarCode,
      dateFormat,
    });
    const endDate = handlePrepareDateForServer({
      date: values?.dateTime?.[1],
      calendarCode,
      dateFormat,
    });

    const newFilters = {
      product: values?.product ?? { value: "", label: "" },
      warehouse: values?.warehouse ?? { value: "", label: "" },
      category: values?.category ?? { value: "", label: "" },
      startDate: startDate && indianToArabic(startDate),
      endDate: endDate && indianToArabic(endDate),
    };

    props.setFilters((prev: any) => {
      if (
        prev?.product?.value !== newFilters?.product?.value ||
        prev?.warehouse?.value !== newFilters?.warehouse?.value ||
        prev?.category?.value !== newFilters?.category?.value ||
        prev?.startDate !== newFilters?.startDate ||
        prev?.endDate !== newFilters?.endDate
      ) {
        props.setSelectedRowKeys([]);
        if (props.setSelectResult) {
          props.setSelectResult(false);
        }

        return newFilters;
      } else {
        return newFilters;
      }
    });

    props.setPage(1);
  };

  const defaultDate = React.useMemo(
    () => [utcDate(), moment(utcDate().add(1, "month"), dateFormat)],
    [dateFormat]
  );
  const defaultJalaliDate = React.useMemo(
    () => [
      dayjs(
        changeGToJ(utcDate().format(dateFormat), dateFormat),
        //@ts-ignore
        jalaliType
      ),

      dayjs(
        changeGToJ(utcDate().add(1, "month").format(dateFormat), dateFormat),
        //@ts-ignore
        jalaliType
      ),
    ],
    [dateFormat]
  );

  useEffect(() => {
    if (props.type === "expiredProducts") {
      if (calendarCode === "gregory") {
        form.setFieldsValue({
          dateTime: defaultDate,
        });
      } else {
        form.setFieldsValue({
          dateTime: defaultJalaliDate,
        });
      }
    } else {
      if (curStartDate) {
        if (calendarCode === "gregory") {
          form.setFieldsValue({
            dateTime: [moment(curStartDate, dateFormat), utcDate()],
          });
        } else {
          form.setFieldsValue({
            dateTime: [
              //@ts-ignore
              dayjs(changeGToJ(curStartDate, dateFormat), jalaliType),

              dayjs(
                changeGToJ(utcDate().format(dateFormat), dateFormat),
                //@ts-ignore
                jalaliType
              ),
            ],
          });
        }
      } else if (failureCount > 0) {
        if (calendarCode === "gregory") {
          form.setFieldsValue({
            dateTime: [moment(defaultStartPeriodDate, dateFormat), utcDate()],
          });
        } else {
          form.setFieldsValue({
            dateTime: [
              //@ts-ignore
              dayjs(changeGToJ(defaultStartPeriodDate, dateFormat), jalaliType),

              dayjs(
                changeGToJ(utcDate().format(dateFormat), dateFormat),
                //@ts-ignore
                jalaliType
              ),
            ],
          });
        }
      }
    }

    return () => {
      form.setFieldsValue({
        // dateTime: [undefined, undefined],
      });
    };
  }, [
    calendarCode,
    form,
    defaultDate,
    defaultJalaliDate,
    props.type,
    curStartDate,
    failureCount,
    dateFormat,
  ]);

  return (
    <Form
      onFinish={onFinish}
      form={form}
      hideRequiredMark
      initialValues={{
        date: "allDates",
        dateTime:
          calendarCode === "gregory"
            ? curStartDate && defaultDate
            : curStartDate && defaultJalaliDate,
      }}
    >
      <Row gutter={[10, 10]} style={{ marginBottom: "20px" }}>
        {props?.type === "expiredProducts" ? (
          <Col xxl={5} xl={6} lg={7}>
            <RangePickerFormItem
              showTime={false}
              placeholder={[t("Expenses.Table.Start"), t("Expenses.Table.End")]}
              format={dateFormat}
              rules={[]}
              name="dateTime"
              label=""
              style={styles.formItem}
            />
          </Col>
        ) : (
          <ReportDateFormItem
            form={form}
            style={styles.formItem}
            type={props.type}
          />
        )}

        {props?.type !== "expiredProducts" && (
          <Col xxl={14} xl={11} lg={11}></Col>
        )}
        <Col xxl={4} xl={5} lg={5}>
          <InfiniteScrollSelectFormItem
            name="warehouse"
            style={styles.formItem}
            fields="name,id"
            placeholder={t("Warehouse.1")}
            baseUrl="/inventory/warehouse/"
            allowClear={true}
          />
        </Col>
        {props?.type === "expiredProducts" && (
          <Col xxl={14} xl={11} lg={11}></Col>
        )}
        <Col xxl={5} xl={6} lg={7}>
          <InfiniteScrollSelectFormItem
            name="product"
            style={styles.formItem}
            fields="name,id"
            placeholder={t("Sales.Product_and_services.Product")}
            baseUrl="/product/items/"
            allowClear={true}
          />
        </Col>
        {props?.type !== "expiredProducts" && (
          <>
            <Col xxl={12} xl={10} lg={5}></Col>
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
          </>
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
