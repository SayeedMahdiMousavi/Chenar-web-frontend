import React from 'react';
import WarehouseStatisticsTable from './WarehouseStatisticsTable';
import ReportBody from '../../ReportBody';

const WarehouseStatistics = (props) => {
  return (
    <ReportBody
      title={props.title}
      type='warehouse'
      table={
        <WarehouseStatisticsTable
          baseUrl={props.baseUrl}
          type={props.type}
          title={props.title}
        />
      }
    />
  );
};

export default WarehouseStatistics;
