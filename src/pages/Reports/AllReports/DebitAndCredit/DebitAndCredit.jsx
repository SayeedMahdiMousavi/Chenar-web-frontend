import React from 'react';
import DebitAndCreditTable from './DebitAndCreditTable';
import ReportBody from '../../ReportBody';
import { DEBIT_CREDIT_LIST } from '../../../../constants/routes';
export const debitCreditUrl = DEBIT_CREDIT_LIST;
const DebitAndCreditReport = (props) => {
  return (
    <ReportBody
      title={props.title}
      type='financial'
      table={
        <DebitAndCreditTable
          baseUrl={debitCreditUrl}
          title={props.title}
          place={props.place}
        />
      }
    />
  );
};

export default DebitAndCreditReport;
