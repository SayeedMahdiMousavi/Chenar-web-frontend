import React from 'react';
import IncomeStatementsTable from './IncomeStatementsTable';
import ReportBody from '../../ReportBody';
// import IncomeStatementDefault from "./incomeStatementDefault";

const IncomeStatements = (props) => {
  return (
    <div>
      <ReportBody
        title={props.title}
        type='financial'
        baseUrl={props.baseUrl}
        table={
          <IncomeStatementsTable baseUrl={props.baseUrl} place={props.place} />
        }
      />
    </div>
  );
};

export default IncomeStatements;
