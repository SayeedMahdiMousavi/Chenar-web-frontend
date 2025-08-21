import React, { useState } from "react";
import PropTypes from "prop-types";
import { deleteProducts } from "../../../actions/products/actionProducts";
import { useTranslation } from "react-i18next";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { message, Menu, Dropdown } from "antd";

import { CaretDownOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { ActionMessage } from "../../SelfComponents/TranslateComponents/ActionMessage";

function InActive(props) {
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
    message.success(
      <ActionMessage name={props?.record?.name} message="Message.Inactive" />
    );
  };

  const action = (
    <Menu>
      <Menu.Item onClick={active}>Make active</Menu.Item>
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
        Edit <CaretDownOutlined />
      </a>
    </Dropdown>
  );
}
InActive.propTypes = {
  deleteProducts: PropTypes.func.isRequired,
};
export default connect(null, { deleteProducts })(InActive);
