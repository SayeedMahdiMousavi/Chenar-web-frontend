import React from "react";
import { Typography } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { Colors } from "../../../colors";
const { Text, Paragraph } = Typography;

const Customer = (props) => {
  return (
    <div style={styles.accessPadding(props.isMiniTablet)}>
      <Text strong={true}>Customers and sales</Text> <br />
      <br />
      <Text>This user can:</Text>
      <br />
      <br />
      <Paragraph>
        <ul className="ul_line">
          <li>
            <CheckOutlined className="list_tick" /> &nbsp; Enter estimates,
            invoices, sales receipts, credit notes, and refunds
          </li>
          <li>
            <CheckOutlined className="list_tick" />
            &nbsp; Enter charges and credits
          </li>
          <li>
            {" "}
            <CheckOutlined className="list_tick" />
            &nbsp; Create and delete statements
          </li>
          <li>
            {" "}
            <CheckOutlined className="list_tick" />
            &nbsp; Receive payments from customers
          </li>
          <li>
            {" "}
            <CheckOutlined className="list_tick" />
            &nbsp; Add, edit, and delete customers, products, and services
          </li>
          <li>
            {" "}
            <CheckOutlined className="list_tick" />
            &nbsp; View customer registers and A/R reports
          </li>
          <li>
            {" "}
            <CheckOutlined className="list_tick" />
            &nbsp; View tax rates and agency settings
          </li>
          <li>
            <CheckOutlined className="list_tick" />
            &nbsp; Use and adjust tax in sales transactions and general journal
            entries, including manually overriding calculated tax amounts
          </li>
          <li>
            {" "}
            <CheckOutlined className="list_tick" />
            &nbsp; Add, edit, and delete currencies
          </li>
          <li>
            {" "}
            <CheckOutlined className="list_tick" />
            &nbsp; Edit exchange rates
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
          <li>
            <CloseOutlined style={styles.close} /> &nbsp;Run tax reports or view
            tax history
          </li>
          <li>
            <CloseOutlined style={styles.close} /> &nbsp;Prepare a tax return,
            record a tax payment or refund, or file taxes
          </li>
          <li>
            <CloseOutlined style={styles.close} /> &nbsp;Set up new or change
            existing tax agencies or settings
          </li>
          <li>
            <CloseOutlined style={styles.close} /> &nbsp;Set up multiCurrency
          </li>
          <li>
            <CloseOutlined style={styles.close} /> &nbsp;Perform home currency
            adjustments
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
export default Customer;
