import React from 'react';

import { CurrencyPartFields } from './CurrencyPartFields';
interface IProps {
  form: any;
  type: string;
  currencyValue: number;
  setCurrencyValue: (value: number) => void;
  onChangeCurrency?: (value: any) => void;
}
export const CalculatedCurrencyProperties: React.FC<IProps> = (props) => {
  return <CurrencyPartFields {...props} currency='calCurrency' />;
};
