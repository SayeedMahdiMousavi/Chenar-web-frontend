import React from 'react';

import { GetOneChildOfChartAccount } from './GetOneChildOfChartAccount';
interface IProps {
  form: any;
  place?: string;
}

const baseUrl = '/chart_of_account/IEI-502/child/';
const searchKey = '/chart_of_account/expense/search/';
export const ExpenseProperties: React.FC<IProps> = (props) => {
  const onChangeAccountName = (value: string) => {
    props.form.setFieldsValue({ expenseId: value });
  };

  const onChangeAccountId = (value: { value: string; label: string }) => {
    if (value?.value) {
      props.form.setFieldsValue({ expenseName: value });
    } else {
      props.form.setFieldsValue({ expenseName: undefined });
    }
  };
  return (
    <GetOneChildOfChartAccount
      searchIn='expensetype'
      baseUrl={baseUrl}
      searchKey={searchKey}
      fieldId='expenseId'
      fieldName='expenseName'
      onChangeAccountName={onChangeAccountName}
      onChangeAccountId={onChangeAccountId}
      place={props.place}
    />
  );
};
