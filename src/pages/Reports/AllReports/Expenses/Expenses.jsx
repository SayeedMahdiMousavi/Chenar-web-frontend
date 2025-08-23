import React from 'react';
import ExpensesTable from './ExpensesTable';
import ReportBody from '../../ReportBody';

const ExpensesReport = (props) => {
  return (
    <ReportBody
      title={props.title}
      type='financial'
      table={
        <ExpensesTable
          baseUrl={props.baseUrl}
          place={props.place}
          title={props?.title}
        />
      }
    />
  );
};

export default ExpensesReport;
