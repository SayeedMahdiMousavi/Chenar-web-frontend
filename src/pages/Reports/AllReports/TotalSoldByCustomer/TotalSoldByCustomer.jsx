import React from 'react';
import TotalSoldByCustomerTable from './TotalSoldByCustomerTable';
import ReportBody from '../../ReportBody';

const TotalSoldByCustomer = (props) => {
  return (
    <ReportBody
      title={props.title}
      type='warehouse'
      table={
        <TotalSoldByCustomerTable
          baseUrl={props.baseUrl}
          type={props.type}
          title={props.title}
        />
      }
    />
  );
};

export default TotalSoldByCustomer;
