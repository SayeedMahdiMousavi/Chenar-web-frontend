import React from 'react';
import TotalSoledProductsTable from './TotalSoledProductsTable';
import ReportBody from '../../ReportBody';

const TotalSoledProducts = (props) => {
  return (
    <ReportBody
      title={props.title}
      type='warehouse'
      table={
        <TotalSoledProductsTable
          baseUrl={props.baseUrl}
          type={props.type}
          title={props.title}
        />
      }
    />
  );
};

export default TotalSoledProducts;
