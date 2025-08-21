import React from "react";
import { Typography } from "antd";
import { CheckOutlined } from "@ant-design/icons";
const { Text, Paragraph } = Typography;
const All = (props) => {
  return (
    <div style={styles.accessPadding(props.isMiniTablet)}>
      <Text strong={true}>All access</Text> <br />
      <br />
      <Text>This user can see and do everything with:</Text>
      <br />
      <Paragraph>
        <ul className="ul_line">
          <li>
            {" "}
            <CheckOutlined className="list_tick" />
            &nbsp;Customers and Sales
          </li>
          <li>
            {" "}
            <CheckOutlined className="list_tick" />
            &nbsp;Suppliers and Purchases
          </li>
        </ul>
      </Paragraph>{" "}
      <br />
      <Text>They can also:</Text>
      <br />
      <br />
      <Paragraph>
        <ul className="ul_line">
          <li>
            {" "}
            <CheckOutlined className="list_tick" />
            &nbsp;Add, edit, and delete employees
          </li>
          <li>
            {" "}
            <CheckOutlined className="list_tick" />
            &nbsp;Change preferences
          </li>
          <li>
            {" "}
            <CheckOutlined className="list_tick" />
            &nbsp;View activity log
          </li>
          <li>
            {" "}
            <CheckOutlined className="list_tick" />
            &nbsp;Create, edit, and delete budgets
          </li>
          <li>
            {" "}
            <CheckOutlined className="list_tick" />
            &nbsp;Add, edit, and delete accounts
          </li>
          <li>
            {" "}
            <CheckOutlined className="list_tick" />
            &nbsp;Make deposits and transfer funds
          </li>
          <li>
            <CheckOutlined className="list_tick" />
            &nbsp;Reconcile accounts and make journal entries
          </li>
          <li>
            <CheckOutlined className="list_tick" />
            &nbsp;View all reports
          </li>
          <li>
            {" "}
            <CheckOutlined className="list_tick" />
            &nbsp;Turn on tax for the company, make tax adjustments, file tax
            returns, or change the setup for existing tax info
          </li>
          <li>
            {" "}
            <CheckOutlined className="list_tick" />
            &nbsp;Set up multiCurrency
          </li>
          <li>
            {" "}
            <CheckOutlined className="list_tick" />
            &nbsp;Perform home currency adjustments
          </li>
        </ul>
      </Paragraph>{" "}
    </div>
  );
};
const styles = {
  accessPadding: (isMiniTablet) => ({ paddingTop: isMiniTablet ? "15px" : "" }),
};
export default All;
