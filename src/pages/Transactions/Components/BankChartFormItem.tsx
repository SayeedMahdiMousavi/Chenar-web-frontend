import React from 'react';
import { GetOneChildOfChartAccount } from './GetOneChildOfChartAccount';
interface IProps {
  form: any;
}

const baseUrl = '/chart_of_account/ABN-102/child/';
const searchKey = '/chart/bank/search/';
export const BankChartFormItem: React.FC<IProps> = (props) => {
  const onChangeAccountName = (value: string) => {
    props.form.setFieldsValue({ bankId: value });
  };

  const onChangeAccountId = (value: { value: string; label: string }) => {
    props.form.setFieldsValue({ bankName: value });
  };
  return (
    <GetOneChildOfChartAccount
      searchIn='cash'
      baseUrl={baseUrl}
      searchKey={searchKey}
      fieldId='bankId'
      fieldName='bankName'
      onChangeAccountName={onChangeAccountName}
      onChangeAccountId={onChangeAccountId}
    />
  );
};
