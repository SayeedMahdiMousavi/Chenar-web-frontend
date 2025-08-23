import React, { useRef, useState } from 'react';
import { Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';
import { ReactNode } from 'react';
import PrintInvoices from '../../../PrintComponents/Invoices';
import { useTranslation } from 'react-i18next';

export const pageStyle = `
 @page {
  margin: 4mm 7mm;
};
`;

type FilterData = { value: string; label: string; name?: string }[];

interface IProps {
  isPrinted?: boolean;
  disabled: boolean;
  type: string;
  title?: string;
  dataSource?: any[];
  filters?: any;
  footer?: ReactNode;
  summary?: [FilterData, FilterData];
  form?: any;
  id?: number;
  cashPayment?: any[];
  printText?: string;
}

function PrintInvoiceButton(props: IProps) {
  const printRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterData>([]);
  const [cashPayment, setCashPayment] = useState([]);
  const [data, setData] = useState([]);

  const handleOnBeforeGetContent = React.useCallback(() => {
    setLoading(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        setLoading(false);
        //@ts-ignore
        resolve();
      }, 2000);
    });
  }, [setLoading]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    pageStyle: pageStyle,
    onAfterPrint: () => {
      setFilters([]);
      setCashPayment([]);
    },
  });

  const handleClickPrint = () => {
    if (props.filters) {
    } else {
      const row = props.form.getFieldsValue();
      const filterData = [
        {
          label: t('Sales.All_sales.Invoice.Invoice_number'),
          value: props?.id,
          name: 'id',
        },
        {
          label:
            props?.type === 'purchase' || props?.type === 'purchase_rej'
              ? t('Expenses.Suppliers.Supplier')
              : t('Sales.Customers.Customer'),
          name: 'account',
          value: row?.account?.label,
        },
        // {
        //   label: t("Warehouse.1"),
        //   value: row?.warehouseName?.label,
        // },
        {
          label: t('Sales.Product_and_services.Status'),
          value: row?.status,
        },
        {
          label: t('Sales.Product_and_services.Inventory.Currency'),
          value: row?.currency?.label,
        },
        {
          label: t('Sales.Product_and_services.Currency.Currency_rate'),
          value: parseFloat(row?.currencyRate),
        },
        {
          label: t('Sales.Customers.Form.Date'),
          name: 'date',
          value: row?.date.locale('fa').format('YYYY-MM-DD HH:mm'),
        },
      ];

      const cashList = props.form.getFieldValue('cashList');
      setCashPayment(cashList || []);

      setFilters(
        //@ts-ignore
        props?.type === 'productTransfer'
          ? filterData?.filter(
              (item) => item?.name === 'date' || item?.name === 'id',
            )
          : props?.type === 'warehouseAdjustment'
            ? [
                ...filterData?.filter(
                  (item) => item?.name === 'date' || item?.name === 'id',
                ),
                {
                  label: t('Invoice_type'),
                  name: 'type',
                  value:
                    row?.type === 'waste'
                      ? t('Reports.Waste')
                      : t('Reports.Reward'),
                },
              ]
            : props?.type === 'warehouseRemittance'
              ? filterData?.filter(
                  (item) => item?.name === 'date' || item?.name === 'account',
                )
              : filterData,
      );
      // if (
      //   props?.type !== "productTransfer" &&
      //   props?.type !== "warehouseAdjustment"
      // ) {
      const newData = props?.dataSource?.reduce((items, item) => {
        if (Boolean(item?.product?.value)) {
          return [
            ...items,
            {
              ...item,
              warehouse: item?.warehouse?.value
                ? item?.warehouse
                : row?.warehouseName,
            },
          ];
        } else {
          return items;
        }
      }, []);
      setData(newData);
      // }
    }

    setTimeout(() => {
      handlePrint!();
    }, 500);
  };

  return (
    <React.Fragment>
      <Button
        disabled={props.disabled}
        icon={<PrinterOutlined disabled={props.disabled} />}
        onClick={handleClickPrint}
        type='primary'
        ghost
        loading={loading}
      >
        {props?.printText ? props?.printText : t('Form.Print')}
      </Button>
      <div className='hide-print-component' ref={printRef}>
        <PrintInvoices
          //@ts-ignore
          printRef={printRef}
          type={props.type}
          title={props.title}
          dataSource={Boolean(props?.filters) ? props.dataSource : data}
          summary={props?.summary}
          {...{
            cashPayment: props?.cashPayment ?? cashPayment,
            filters: props?.filters ?? filters,
            isPrinted: props?.isPrinted,
          }}
        />
      </div>
    </React.Fragment>
  );
}
//@ts-ignore
// eslint-disable-next-line no-func-assign
PrintInvoiceButton = React.memo(PrintInvoiceButton);

export default PrintInvoiceButton;
