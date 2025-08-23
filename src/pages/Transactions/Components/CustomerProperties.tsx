import React from 'react';
import { GetOneChildOfChartAccount } from './GetOneChildOfChartAccount';
interface IProps {
  form: any;
  place?: string;
  placeholder?: string;
}

const baseUrl = '/chart_of_account/ACU-103/child/';
const searchKey = '/chart/customer/search/';
export const CustomerProperties: React.FC<IProps> = (props) => {
  const onChangeAccountName = (value: string) => {
    props.form.setFieldsValue({ customerId: value });
  };

  const onChangeAccountId = (value: { value: string; label: string }) => {
    if (value?.value) {
      props.form.setFieldsValue({ customerName: value });
    } else {
      props.form.setFieldsValue({ customerName: undefined });
    }
  };

  return (
    <GetOneChildOfChartAccount
      searchIn='customer'
      baseUrl={baseUrl}
      searchKey={searchKey}
      fieldId='customerId'
      fieldName='customerName'
      place={props.place}
      onChangeAccountName={onChangeAccountName}
      onChangeAccountId={onChangeAccountId}
      placeholder={props?.placeholder}
    />
  );
};
