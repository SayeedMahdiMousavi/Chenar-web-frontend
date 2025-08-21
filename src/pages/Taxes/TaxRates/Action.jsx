import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useDatabase } from "@nozbe/watermelondb/hooks";

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
  Popconfirm,
} from "antd";

import { CaretDownOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import EditTexRates from "./EditTexRates";
// const ReachableContext = React.createContext();

function Action(props) {
  const { t } = useTranslation();
  // const [modal, contextHolder] = Modal.useModal();
  const [visible, setVisible] = useState(false);
  const database = useDatabase();
  // const config = {
  //   title: "Are you sure delete this task?",
  //   icon: <ExclamationCircleOutlined />,
  //   okText: <span>Yes</span>,
  //   okType: "danger",
  //   cancelText: "No",
  //   onOk() {
  //     props.deleteProducts(props.record.Key);
  //   },
  //   onCancel() {
  //     
  //   }
  // };
  const inActive = async () => {
    const customers = database.collections.get("customers");

    await database.action(async () => {
      const customer = await customers.find(props.record.id);
      // product.observe();

      await customer.update((customer) => {
        customer.status = "inActive";
      });
    });
    // props.inActive(props.record.id);
    // message.info(<ActionMessage
    //           name={props?.record?.name}
    //           message="Message.Inactive"
    //         />
    //       )
  };
  const confirm = async () => {
    const products = database.collections.get("products");
    await database.action(async () => {
      const product = await products.find(props.record.id);
      await product.destroyPermanently(); // permanent
    });
    props.delete(props.record.id);
    setVisible(false);
    message.info(`${t("Message.Remove")} ${props.record.name}`);
    // };
    props.delete(props.record.id);
    setVisible(false);
  };
  const cancel = () => {
    setVisible(false);
  };
  const edit = () => {
    setVisible(false);
  };
  const action = (
    <Menu>
      <Menu.Item>
        <Popconfirm
          placement="topLeft"
          title={`${t("Taxes.Tax_rates.Inactive_Message")}`}
          onConfirm={inActive}
          okText="Yes"
          cancelText="No"
          onCancel={cancel}
        >
          {t("Sales.Customers.Table.inactive")}
        </Popconfirm>
      </Menu.Item>
      <Menu.Item>
        {" "}
        <EditTexRates open={edit} />
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
    >
      <a className="ant-dropdown-link" href="#">
        {t("Sales.Customers.Table.Edit")}
        <CaretDownOutlined />
      </a>
    </Dropdown>
  );
}

export default connect(null)(Action);
