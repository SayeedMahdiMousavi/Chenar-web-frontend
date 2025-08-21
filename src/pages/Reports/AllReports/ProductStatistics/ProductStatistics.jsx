import React from "react";
import ProductStatisticsTable from "./ProductStatisticsTable";
import ReportBody from "../../ReportBody";

const ProductStatistics = (props) => {
  return (
    <ReportBody
      title={props.title}
      type="warehouse"
      table={<ProductStatisticsTable {...props} />}
    />
  );
};

export default ProductStatistics;
