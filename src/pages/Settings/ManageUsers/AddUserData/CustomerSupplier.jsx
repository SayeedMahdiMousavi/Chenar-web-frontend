import React from "react";
import { Typography } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { Colors } from "../../../colors";
const { Text, Paragraph } = Typography;

const CustomerSupplier = (props) => {
  return (
    <div style={styles.accessPadding(props.isMiniTablet)}>
      <Text strong={true}>Customers and suppliers</Text> <br />
      <br />
      <Text>This user can:</Text>
      <br />
      <br />
      <Paragraph>
        <ul className="ul_line">
          <li>
            <CheckOutlined className="list_tick" />
            &nbsp;Enter estimates, invoices, sales receipts, credit notes,
            refunds, charges, and credits
          </li>
          <li>
            <CheckOutlined className="list_tick" />
            &nbsp;Create and delete statements
          </li>
          <li>
            <CheckOutlined className="list_tick" />
            &nbsp;Receive payments from customers
          </li>
          <li>
            <CheckOutlined className="list_tick" />
            &nbsp;Out time sheets for anyone
          </li>
          <li>
            <CheckOutlined className="list_tick" />
            &nbsp;Edit, and delete customers, suppliers, products, and services
          </li>
          <li>
            <CheckOutlined className="list_tick" />
            &nbsp;View customer registers
          </li>
          <li>
            <CheckOutlined className="list_tick" />
            &nbsp;View customer and A/R reports
          </li>
          <li>
            <CheckOutlined className="list_tick" />
            &nbsp;View supplier and A/P reports
          </li>
          <li>
            <CheckOutlined className="list_tick" />
            &nbsp;Enter bills from suppliers
          </li>
          <li>
            <CheckOutlined className="list_tick" />
            &nbsp;Pay bills, write and print checks, and view check reports
          </li>
          <li>
            <CheckOutlined className="list_tick" />
            &nbsp;Make bills and purchases billable to customers
          </li>
          <li>
            <CheckOutlined className="list_tick" />
            &nbsp;Enter cash and credit card purchases
          </li>
        </ul>
      </Paragraph>
      <br />
      <Text>They can’t:</Text>
      <br />
      <br />
      <Paragraph>
        <ul className="ul_line">
          <li>
            <CloseOutlined style={styles.close} /> &nbsp;Add, edit, and delete
            accounts and quantity on hand
          </li>
          <li>
            <CloseOutlined style={styles.close} /> &nbsp;View bank registers
          </li>
          <li>
            <CloseOutlined style={styles.close} /> &nbsp;See total income and
            expense amounts on Home, Supplier, and Customer pages
          </li>
        </ul>
      </Paragraph>
    </div>
  );
};
const styles = {
  close: { color: `${Colors.red}` },
  accessPadding: (isMiniTablet) => ({ paddingTop: isMiniTablet ? "15px" : "" }),
};

export default CustomerSupplier;
