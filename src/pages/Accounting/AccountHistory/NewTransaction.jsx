import React from "react";
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
} from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
// import { useDatabase } from "@nozbe/watermelondb/hooks";
//
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
// import withObservables from "@nozbe/with-observables";
// const { Option } = Select;
function NewTransaction(props) {
  // const database = useDatabase();
  const { t } = useTranslation();
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
  const onMakeInActive = async () => {
    // const products = database.collections.get("products");
    // await database.action(async () => {
    //   for (let index = 0; index < props.selectedRowKeys.length; index++) {
    //     const element = props.selectedRowKeys[index];
    //     const product = await products.find(element);
    //     await product.update((product) => {
    //       product.status = "inActive";
    //     });
    //   }
    // });
    // props.MakeInActiveMultiple();
  };
  const batch = (
    <Menu>
      <Menu.Item key="1" onClick={onMakeInActive}>
        {t("Expenses.Cheque")}
      </Menu.Item>
      <Menu.Item key="2" onClick={onDelete}>
        {t("Accounting.Bank_register.Deposit")}
      </Menu.Item>
      <Menu.Item key="3" onClick={onDelete}>
        {t("Sales.Customers.Details.Sales_recipe")}
      </Menu.Item>
      <Menu.Item key="4" onClick={onDelete}>
        {t("Accounting.Bank_register.Receive_payment")}
      </Menu.Item>
      <Menu.Item key="5" onClick={onDelete}>
        {t("Accounting.Bank_register.Bill_payment")}
      </Menu.Item>
      <Menu.Item key="6" onClick={onDelete}>
        {t("Accounting.Bank_register.Refund")}
      </Menu.Item>
      <Menu.Item key="7" onClick={onDelete}>
        {t("Expenses.Expense")}
      </Menu.Item>
      <Menu.Item key="8" onClick={onDelete}>
        {t("Accounting.Transfer.")}
      </Menu.Item>
      <Menu.Item key="9" onClick={onDelete}>
        {t("Accounting.Bank_register.Journal_entry")}
      </Menu.Item>
    </Menu>
  );
  return (
    <Row>
      <Col span={23}>
        <Dropdown overlay={batch}>
          <Button type="primary" shape="round">
            {t("Sales.Product_and_services.New")}{" "}
            {t("Sales.Customers.Details.Transaction")} <CaretDownOutlined />
          </Button>
        </Dropdown>
      </Col>
    </Row>
  );
}
// export default withDatabase(
//   withObservables(["groups"], ({ database }) => ({
//     groups: database.collections.get("groups").query().observe(),
//   }))(NewTransaction)
// );
export default NewTransaction;
