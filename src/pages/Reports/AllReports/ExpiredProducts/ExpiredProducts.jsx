import React from "react";
import ExpiredProductsTable from "./ExpiredProductsTable";
import ReportBody from "../../ReportBody";

const ExpiredProducts = (props) => {
  return (
    <ReportBody
      title={props.title}
      type="warehouse"
      table={<ExpiredProductsTable baseUrl={props.baseUrl} type={props.type} />}
    />
  );
};

export default ExpiredProducts;
