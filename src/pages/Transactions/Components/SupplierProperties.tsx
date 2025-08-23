import React from 'react';

import { GetOneChildOfChartAccount } from './GetOneChildOfChartAccount';
interface IProps {
  form: any;
}

const baseUrl = '/chart_of_account/LSU-201/child/';
const searchKey = '/chart/supplier/search/';
export const SupplierProperties: React.FC<IProps> = (props) => {
  const onChangeAccountName = (value: string) => {
    props.form.setFieldsValue({ supplierId: value });
  };

  const onChangeAccountId = (value: { value: string; label: string }) => {
    //
    props.form.setFieldsValue({ supplierName: value });
  };
  return (
    <GetOneChildOfChartAccount
      searchIn='supplier'
      baseUrl={baseUrl}
      searchKey={searchKey}
      fieldId='supplierId'
      fieldName='supplierName'
      onChangeAccountName={onChangeAccountName}
      onChangeAccountId={onChangeAccountId}
    />
  );
};
