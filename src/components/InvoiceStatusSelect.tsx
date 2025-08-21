import React, { useMemo } from "react";
import { Form, Select } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;

export function InvoiceStatusSelect(props: {
  style: React.CSSProperties;
  disabled?: boolean;
  labelInValue?: boolean;
}) {
  const { t } = useTranslation();

  const statusList = useMemo(
    () => [
      {
        label: t("Pending"),
        value: "pending",
      },
      {
        label: t("Accepted"),
        value: "accepted",
      },
      {
        label: t("Rejected"),
        value: "rejected",
      },
      // {
      //   label: t("Void"),
      //   value: "void",
      // },
    ],
    [t]
  );

  return (
    <Form.Item name="status" style={{ ...style, ...props?.style }}>
      <Select
        placeholder={t("Sales.Product_and_services.Status")}
        disabled={props?.disabled}
        // labelInValue={props?.labelInValue}
      >
        {statusList?.map((item) => (
          <Option value={item?.value} key={item?.value}>
            {item?.label}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
}

const style = {
  marginBottom: "8px",
};
