import React from 'react';
import { GetOneChildOfChartAccount } from './GetOneChildOfChartAccount';
interface IProps {
  form: any;
}

const baseUrl = '/chart_of_account/ACB-101/child/';
const searchKey = '/chart/cashbox/search/';
export const CashBoxProperties: React.FC<IProps> = (props) => {
  const onChangeAccountName = (value: string) => {
    props.form.setFieldsValue({ cashBoxId: value });
  };

  const onChangeAccountId = (value: { value: string; label: string }) => {
    props.form.setFieldsValue({ cashBoxName: value });
  };
  return (
    <GetOneChildOfChartAccount
      searchIn='cash'
      baseUrl={baseUrl}
      searchKey={searchKey}
      fieldId='cashBoxId'
      fieldName='cashBoxName'
      onChangeAccountName={onChangeAccountName}
      onChangeAccountId={onChangeAccountId}
    />
  );
};
