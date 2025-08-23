import React from 'react';

import { GetOneChildOfChartAccount } from './GetOneChildOfChartAccount';
interface IProps {
  form: any;
  place?: string;
}

const baseUrl = '/chart_of_account/WTC-302/child/';
const searchKey = '/chart/withdraw/search/';
export const WithdrawProperties: React.FC<IProps> = (props) => {
  const onChangeAccountName = (value: string) => {
    props.form.setFieldsValue({ withdrawId: value });
  };

  const onChangeAccountId = (value: { value: string; label: string }) => {
    if (value?.value) {
      props.form.setFieldsValue({ withdrawName: value });
    } else {
      props.form.setFieldsValue({ withdrawName: undefined });
    }
  };
  return (
    <GetOneChildOfChartAccount
      place={props.place}
      searchIn='widthdraw'
      baseUrl={baseUrl}
      searchKey={searchKey}
      fieldId='withdrawId'
      fieldName='withdrawName'
      onChangeAccountName={onChangeAccountName}
      onChangeAccountId={onChangeAccountId}
    />
  );
};
