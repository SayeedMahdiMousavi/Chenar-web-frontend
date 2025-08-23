import React from 'react';
import IncomingProductsTable from './IncomingProductsTable';
import ReportBody from '../../ReportBody';

const IncomingProducts = (props) => {
  return (
    <ReportBody
      title={props.title}
      table={
        <IncomingProductsTable baseUrl={props.baseUrl} type={props.type} />
      }
    />
  );
};

export default IncomingProducts;
