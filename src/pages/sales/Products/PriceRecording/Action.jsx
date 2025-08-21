import React, { useState } from "react";
import { Menu, Dropdown } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import EditPriceRecording from "./Edit";

function Action(props) {
  const [visible, setVisible] = useState(false);

  const action = (
    <Menu>
      <Menu.Item key="1">
        <EditPriceRecording
          record={props.record}
          baseUrl={props.baseUrl}
          setVisible={setVisible}
        />
      </Menu.Item>
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
      disabled={
        props.editingKey !== "" ||
        props?.record?.product_units?.length < 2 ||
        props.hasSelected
      }
    >
      <a
        disabled={props.editingKey !== ""}
        className="ant-dropdown-link"
        href="#"
      >
        <CaretDownOutlined />
      </a>
    </Dropdown>
  );
}

export default Action;
