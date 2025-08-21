import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { message, Menu, Dropdown } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";

function InActive(props) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const database = useDatabase();

  const active = async () => {
    const customers = database.collections.get("customers");

    await database.action(async () => {
      const customer = await customers.find(props.record.id);

      await customer.update((customer) => {
        customer.status = "active";
      });
    });
    props.active(props.record.id);
    message.success(`${t("Message.Active")} ${props.record.name}`);
  };
  const action = (
    <Menu>
      <Menu.Item onClick={active}>
        {t("Sales.Customers.Table.Active")}
      </Menu.Item>
      <Menu.Item>{t("Employees.Run_report")}</Menu.Item>
    </Menu>
  );
  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };
  return (
    <Dropdown
      overlay={action}
      trigger={["click"]}
      onOpenChange={handleVisibleChange}
      open={visible}
    >
      <a className="ant-dropdown-link" href="#">
        {t("Sales.Customers.Table.Edit")} <CaretDownOutlined />
      </a>
    </Dropdown>
  );
}

export default InActive;
