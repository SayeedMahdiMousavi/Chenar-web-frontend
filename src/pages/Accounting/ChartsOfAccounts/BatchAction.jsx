import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Menu,
  Dropdown,
  Button,
  // message,
  // Tooltip,
  Row,
  Col,
  // Divider,
  // Select,
  // Popconfirm,
} from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
// import { useDatabase } from "@nozbe/watermelondb/hooks";
//
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
// import withObservables from "@nozbe/with-observables";
// const { Option } = Select;
function BatchAction(props) {
  const { t } = useTranslation();
  // const database = useDatabase();
  const [visible, setVisible] = useState(false);

  const onDelete = async () => {
    // const products = database.collections.get("products");
    // await database.action(async () => {
    //   for (let index = 0; index < props.selectedRowKeys.length; index++) {
    //     const element = props.selectedRowKeys[index];
    //     const product = await products.find(element);
    //     await product.destroyPermanently(); // permanent
    //   }
    // });
    // props.delete();
  };
  // const onMakeInActive = async () => {
  //   const customers = database.collections.get("customers");
  //   await database.action(async () => {
  //     for (let index = 0; index < props.selectedRowKeys.length; index++) {
  //       const element = props.selectedRowKeys[index];
  //       const customer = await customers.find(element);
  //       await customer.update((customer) => {
  //         customer.status = "inActive";
  //       });
  //     }
  //   });
  //   props.MakeInActiveMultiple();
  //   message.info(`${t("Message.Inactive")} `);
  // };
  // const cancel = () => {
  //   message.error("inactive Canceled");
  // };
  const batch = (
    <Menu>
      {/* <Menu.Item key='1'>
        <Popconfirm
          placement='topLeft'
          title='Are your sure to inactive this customers?'
          onConfirm={onMakeInActive}
          okText='Yes'
          cancelText='No'
          onCancel={cancel}
        >
          {t("Sales.Customers.Table.inactive")}
        </Popconfirm>
      </Menu.Item> */}

      {/* <Menu.Item key='2' onClick={onMakeInActive}>
        {t("Sales.Customers.Table.Create_statements")}
      </Menu.Item> */}
      <Menu.Item key="3" onClick={onDelete}>
        Set default tax code
      </Menu.Item>
    </Menu>
  );
  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };
  return (
    <Row className="table__batch">
      <Col span={23}>
        <Dropdown
          overlay={batch}
          trigger={["click"]}
          onOpenChange={handleVisibleChange}
          open={visible}
        >
          <Button
            className="num table-col"
            style={{ fontSize: ".9rem" }}
            // type='primary'
            shape="round"
            // ghost
          >
            {t("Sales.Customers.Table.Batch_action")}
            <CaretDownOutlined />
          </Button>
        </Dropdown>
      </Col>
    </Row>
  );
}
// export default withDatabase(
//   withObservables(["groups"], ({ database }) => ({
//     groups: database.collections.get("groups").query().observe(),
//   }))(BatchAction)
// );
export default BatchAction;
