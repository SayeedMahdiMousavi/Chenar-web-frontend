import React from 'react';
import { GetOneChildOfChartAccount } from './GetOneChildOfChartAccount';
interface IProps {
  form: any;
  place?: string;
  placeholder?: string;
}

const baseUrl = '/chart_of_account/LST-203/child/';
const searchKey = '/chart/employee/search/';
export const EmployeeProperties: React.FC<IProps> = (props) => {
  const onChangeAccountName = (item: string) => {
    props.form.setFieldsValue({ employeeId: item });
  };

  const onChangeAccountId = (item: { value: string; label: string }) => {
    props.form.setFieldsValue({ employeeName: item });
  };
  return (
    <GetOneChildOfChartAccount
      searchIn='staff'
      baseUrl={baseUrl}
      searchKey={searchKey}
      fieldId='employeeId'
      fieldName='employeeName'
      onChangeAccountName={onChangeAccountName}
      onChangeAccountId={onChangeAccountId}
      place={props?.place}
      placeholder={props?.placeholder}
    />
  );
};
