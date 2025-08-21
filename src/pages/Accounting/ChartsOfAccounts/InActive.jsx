import React, { useState } from "react";
import PropTypes from "prop-types";

import { useTranslation } from "react-i18next";
// import { useDatabase } from "@nozbe/watermelondb/hooks";
import {
  //   Checkbox,
  //   Row,
  //   Col,
  //   Select,
  message,
  Menu,
  Dropdown,
  //   Table,
  //   Button,
  //   Input,
  //   Modal,
  //   Popconfirm,
} from "antd";

import { CaretDownOutlined } from "@ant-design/icons";
import { connect } from "react-redux";

function InActive(props) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  // const database = useDatabase();

  const active = async () => {
    // const customers = database.collections.get("customers");

    // await database.action(async () => {
    //   const customer = await customers.find(props.record.id);
    //   // product.observe();

    //   await customer.update((customer) => {
    //     customer.status = "active";
    //   });
    // });
    props.active(props.record.id);
    message.info(`${t("Message.Active")} ${props.record.name}`);
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
InActive.propTypes = {
  deleteProducts: PropTypes.func.isRequired,
};
export default connect(null)(InActive);
