import React, { ReactNode, useMemo } from "react";
import { Form, Select } from "antd";
import { useTranslation } from "react-i18next";
import { utcDate, changeGToJ } from "../../Functions/utcDate";
import moment from "moment";
import useGetCalender from "../../Hooks/useGetCalender";

const { Option } = Select;
interface IProps {
  style: any;
  label: string | ReactNode;
  onChange: (value: string) => void;
}
const dateFormat = "YYYY-MM-DD HH-mm";
export default function DateFormItem(props: IProps) {
  const { t } = useTranslation();
  const onChangeDate = (value: string) => {
    props.onChange(value);
  };

  //get current calender
  const userCalender = useGetCalender();
  const calenderCode = userCalender?.data?.user_calender?.code;

  const allDates = useMemo(() => {
    return calenderCode === "gregory"
      ? [
          {
            key: "allDates",
            value: "allDates",
            label: t("Sales.Customers.Table.All_dates"),
          },
          {
            key: "365Days",
            value: `${moment
              .utc()
              .startOf("day")
              .subtract(1, "year")
              .format(dateFormat)}_${utcDate().format(dateFormat)}`,
            label: t("Expenses.Table.last_365_days"),
          },
          {
            key: "custom",
            value: `custom`,
            label: t("Expenses.Table.Custom"),
          },
          {
            key: "day",
            value: `${moment
              .utc()
              .startOf("day")
              .format(dateFormat)}_${utcDate().format(dateFormat)}`,
            label: t("Sales.Customers.Table.Tody"),
          },
          {
            key: "yesterday",
            value: `${moment
              .utc()
              .subtract(1, "days")
              .startOf("day")
              .format(dateFormat)}_${moment
              .utc()
              .subtract(1, "days")
              .endOf("day")
              .format(dateFormat)}`,
            label: t("Sales.Customers.Table.Yesterday"),
          },
          {
            key: "week",
            value: `${moment
              .utc()
              .startOf("week")
              .format(dateFormat)}_${utcDate().format(dateFormat)}`,
            label: t("Sales.Customers.Table.This_week"),
          },
          {
            key: "month",
            value: `${moment
              .utc()
              .startOf("month")
              .format(dateFormat)}_${utcDate().format(dateFormat)}`,
            label: t("Sales.Customers.Table.This_month"),
          },
          {
            key: "quarter",
            value: `${moment
              .utc()
              .startOf("quarter")
              .format(dateFormat)}_${utcDate().format(dateFormat)}`,
            label: t("Sales.Customers.Table.This_quarter"),
          },
          {
            key: "year",
            value: `${moment
              .utc()
              .startOf("year")
              .format(dateFormat)}_${utcDate().format(dateFormat)}`,
            label: t("Sales.Customers.Table.This_year"),
          },
          {
            key: "lastWeek",
            value: `${moment
              .utc()
              .startOf("week")
              .subtract(1, "week")
              .format(dateFormat)}_${moment
              .utc()
              .subtract(1, "week")
              .endOf("week")
              .format(dateFormat)}`,
            label: t("Sales.Customers.Table.Last_week"),
          },
          {
            key: "lastMonth",
            value: `${moment
              .utc()
              .startOf("month")
              .subtract(1, "month")
              .format(dateFormat)}_${moment
              .utc()
              .subtract(1, "month")
              .endOf("month")
              .format(dateFormat)}`,
            label: t("Sales.Customers.Table.Last_month"),
          },
          {
            key: "lastQuarter",
            value: `${moment
              .utc()
              .startOf("quarter")
              .subtract(1, "quarter")
              .format(dateFormat)}_${moment
              .utc()
              .subtract(1, "quarter")
              .endOf("quarter")
              .format(dateFormat)}`,
            label: t("Sales.Customers.Table.Last_quarter"),
          },
          {
            key: "lastYear",
            value: `${moment
              .utc()
              .startOf("year")
              .subtract(1, "year")
              .format(dateFormat)}_${moment
              .utc()
              .subtract(1, "year")
              .endOf("year")
              .format(dateFormat)}`,
            label: t("Sales.Customers.Table.Last_year"),
          },
        ]
      : [
          {
            key: "allDates",
            value: "allDates",
            label: t("Sales.Customers.Table.All_dates"),
          },
          {
            key: "365Days",
            value: `${changeGToJ(
              moment
                .utc()
                .startOf("day")
                .subtract(1, "year")
                .format(dateFormat),
              dateFormat
            )}_${changeGToJ(utcDate().format(dateFormat), dateFormat)}`,
            label: t("Expenses.Table.last_365_days"),
          },
          {
            key: "custom",
            value: `custom`,
            label: t("Expenses.Table.Custom"),
          },
          {
            key: "day",
            value: `${changeGToJ(
              moment.utc().startOf("day").format(dateFormat),
              dateFormat
            )}_${changeGToJ(utcDate().format(dateFormat), dateFormat)}`,
            label: t("Sales.Customers.Table.Tody"),
          },
          {
            key: "yesterday",
            value: `${changeGToJ(
              moment
                .utc()
                .subtract(1, "days")
                .startOf("day")
                .format(dateFormat),
              dateFormat
            )}_${changeGToJ(
              moment.utc().subtract(1, "days").endOf("day").format(dateFormat),
              dateFormat
            )}`,
            label: t("Sales.Customers.Table.Yesterday"),
          },
          {
            key: "week",
            value: `${changeGToJ(
              moment.utc().startOf("week").format(dateFormat),
              dateFormat
            )}_${changeGToJ(utcDate().format(dateFormat), dateFormat)}`,
            label: t("Sales.Customers.Table.This_week"),
          },
          {
            key: "month",
            value: `${changeGToJ(
              moment.utc().startOf("month").format(dateFormat),
              dateFormat
            )}_${changeGToJ(utcDate().format(dateFormat), dateFormat)}`,
            label: t("Sales.Customers.Table.This_month"),
          },
          {
            key: "quarter",
            value: `${changeGToJ(
              moment.utc().startOf("quarter").format(dateFormat),
              dateFormat
            )}_${changeGToJ(utcDate().format(dateFormat), dateFormat)}`,
            label: t("Sales.Customers.Table.This_quarter"),
          },
          {
            key: "year",
            value: `${changeGToJ(
              moment.utc().startOf("year").format(dateFormat),
              dateFormat
            )}_${changeGToJ(utcDate().format(dateFormat), dateFormat)}`,
            label: t("Sales.Customers.Table.This_year"),
          },
          {
            key: "lastWeek",
            value: `${changeGToJ(
              moment
                .utc()
                .startOf("week")
                .subtract(1, "week")
                .format(dateFormat),
              dateFormat
            )}_${changeGToJ(
              moment.utc().subtract(1, "week").endOf("week").format(dateFormat),
              dateFormat
            )}`,
            label: t("Sales.Customers.Table.Last_week"),
          },
          {
            key: "lastMonth",
            value: `${changeGToJ(
              moment
                .utc()
                .startOf("month")
                .subtract(1, "month")
                .format(dateFormat),
              dateFormat
            )}_${changeGToJ(
              moment
                .utc()
                .subtract(1, "month")
                .endOf("month")
                .format(dateFormat),
              dateFormat
            )}`,
            label: t("Sales.Customers.Table.Last_month"),
          },
          {
            key: "lastQuarter",
            value: `${changeGToJ(
              moment
                .utc()
                .startOf("quarter")
                .subtract(1, "quarter")
                .format(dateFormat),
              dateFormat
            )}_${changeGToJ(
              moment
                .utc()
                .subtract(1, "quarter")
                .endOf("quarter")
                .format(dateFormat),
              dateFormat
            )}`,
            label: t("Sales.Customers.Table.Last_quarter"),
          },
          {
            key: "lastYear",
            value: `${changeGToJ(
              moment
                .utc()
                .startOf("year")
                .subtract(1, "year")
                .format(dateFormat),
              dateFormat
            )}_${changeGToJ(
              moment.utc().subtract(1, "year").endOf("year").format(dateFormat),
              dateFormat
            )}`,
            label: t("Sales.Customers.Table.Last_year"),
          },
        ];
  }, [calenderCode]);

  return (
    <Form.Item name="date" label={props.label} style={props.style}>
      <Select onChange={onChangeDate}>
        {allDates?.map(
          (item: { key: string; value: string; label: string }) => {
            return (
              <Option key={item?.key} value={item?.value}>
                {item?.label}
              </Option>
            );
          }
        )}
      </Select>
    </Form.Item>
  );
}
