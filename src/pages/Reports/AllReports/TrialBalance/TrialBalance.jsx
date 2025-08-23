import React from 'react';
import TrialBalanceTable from './TrialBalanceTable';
import ReportBody from '../../ReportBody';

const TrialBalance = (props) => {
  return (
    <ReportBody
      title={props.title}
      type='financial'
      table={<TrialBalanceTable {...props} />}
    />
  );
};

export default TrialBalance;
