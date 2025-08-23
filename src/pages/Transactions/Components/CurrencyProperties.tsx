import React from 'react';

import { CurrencyPartFields } from './CurrencyPartFields';
interface IProps {
  form: any;
  type: string;
  currencyValue: number;
  responseId?: boolean;
  setCurrencyValue: (value: number) => void;
  onChangeCurrency?: (value: any) => void;
  onChangeCurrencyRate?: (value: any) => void;
}
export const CurrencyProperties: React.FC<IProps> = (props) => {
  return <CurrencyPartFields {...props} currency='currency' />;
};
