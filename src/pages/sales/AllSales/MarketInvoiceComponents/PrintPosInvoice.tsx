import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useGetCompanyInfo } from '../../../../Hooks';
import useGetPosFactorSettings from '../../../../Hooks/useGetPosFactorSettings';
import axiosInstance from '../../../ApiBaseUrl';
import PrintInvoice from './PrintInvoice';

interface IProps {
  data: any[];
  discount: number;
  vipDiscount: number;
  totalPrice: number;
  response: any;
  printRef: any;
  type: string;
}

export default function PrintPosInvoice(props: IProps) {
  const { t } = useTranslation();

  //get company information
  const companyInfo = useGetCompanyInfo();

  //get pos factor settings
  const factorSettings = useGetPosFactorSettings();

  //get user id
  const userName = localStorage.getItem('user_id');
  const userInfo = useQuery(
    '/user_account/user_profile/getId/',
    async () => {
      const result = await axiosInstance.get(
        `/user_account/user_profile/${userName}/?fields=id`,
      );
      return result.data;
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const invoiceLocals = useMemo(() => {
    return {
      address: t('Form.Address'),
      Product_change_message: t(
        'Sales.All_sales.Invoice.Product_change_message',
      ),
      phone: t('Sales.All_sales.Invoice.Phone'),
      name: t('Sales.All_sales.Invoice.Product_name'),
      notes: t('Form.Notes'),
      price: t('Sales.All_sales.Invoice.Price'),
      totalPrice: t('Sales.All_sales.Invoice.Total'),
      customerName: t('Sales.All_sales.Invoice.Customer_name'),
      qty: t('Sales.All_sales.Invoice.Qty'),
      factorNumber: t('Sales.All_sales.Invoice.Factor_number'),
      customerCode: t('Sales.All_sales.Invoice.Customer_code'),
      dateAndTime: t('Sales.All_sales.Invoice.Date_and_time'),
      salesManager: t('Sales.All_sales.Invoice.Sales_manager'),
      discount: t('Sales.All_sales.Invoice.Discount'),
      payByAnarPay: t('Sales.All_sales.Invoice.Pay_by_anar_pay'),
      payCash: t('Employees.Pay_cash'),
      pureBell: t('Sales.All_sales.Invoice.Pure_bell'),
      total: t('Sales.Customers.Form.Total'),
      accounting_name: t('Sales.All_sales.Invoice.Chanar_accounting'),
      ProductOfMicrocis: t('Sales.All_sales.Invoice.Product_of_microcis'),
      edit: props?.type === 'add' ? '' : t('Sales.Customers.Table.Edit'),
    };
  }, [props, t]);

  return (
    <div className='hide-print-component'>
      <PrintInvoice
        ReactNode
        ref={props.printRef}
        data={props?.data}
        locals={invoiceLocals}
        language={t('Dir')}
        company={companyInfo?.data}
        edit={factorSettings?.data}
        discount={props?.discount}
        vipDiscount={props?.vipDiscount}
        totalPrice={props?.totalPrice}
        response={props?.response}
        userId={userInfo?.data?.id}
      />
    </div>
  );
}
