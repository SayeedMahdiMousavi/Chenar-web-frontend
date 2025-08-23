import React from 'react';
import ReportBody from '../../ReportBody';
import ProductProfileAverageTable from './ProductProfileAverageTable';

const ProductProfileAverage = (props) => {
  return (
    <ReportBody
      title={props.title}
      type='warehouse'
      table={
        <ProductProfileAverageTable
          baseUrl={props.baseUrl}
          type={props.type}
          title={props.title}
        />
      }
    />
  );
};

export default ProductProfileAverage;
