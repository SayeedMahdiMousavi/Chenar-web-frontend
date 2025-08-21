import React from "react";

import { GetOneChildOfChartAccount } from "./GetOneChildOfChartAccount";
interface IProps {
  form: any;
  place?: string;
}

const baseUrl = "/chart_of_account/IEI-402/child/";
const searchKey = "/chart/income/search/";
export const IncomeProperties: React.FC<IProps> = (props) => {
  const onChangeAccountName = (value: string) => {
    props.form.setFieldsValue({ incomeId: value });
  };

  const onChangeAccountId = (value: { value: string; label: string }) => {
    if (value?.value) {
      props.form.setFieldsValue({ incomeName: value });
    } else {
      props.form.setFieldsValue({ incomeName: undefined });
    }
  };
  return (
    <GetOneChildOfChartAccount
      place={props.place}
      searchIn="incometype"
      baseUrl={baseUrl}
      searchKey={searchKey}
      fieldId="incomeId"
      fieldName="incomeName"
      onChangeAccountName={onChangeAccountName}
      onChangeAccountId={onChangeAccountId}
    />
  );
};
