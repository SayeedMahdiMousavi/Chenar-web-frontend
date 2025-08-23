import React, { useEffect, useMemo, useState } from 'react';
import Filters from './Filters';
import moment from 'moment';
import { Checkbox, Table, Menu, Typography, Descriptions } from 'antd';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../ApiBaseUrl';
import { utcDate } from '../../../../Functions/utcDate';

import WarehouseCardXResultTable from './ResultTable';
import useGetRunningPeriod from '../../../../Hooks/useGetRunningPeriod';
import ShowDate from '../../../SelfComponents/JalaliAntdComponents/ShowDate';
import { ReportTable, Statistics } from '../../../../components/antd';
import { reportsDateFormat } from '../../../../Context';
import { MANI_INVOICES_VALUE } from '../../../../constants';

const { Column, ColumnGroup } = Table;
const dateFormat = reportsDateFormat;
const defaultFilter = { value: '', label: '' };
const WarehouseCardXTable = (props) => {
  const [resultSelectedRowKeys, setResultSelectedRowKeys] = useState([]);
  const [resultSelectedRows, setResultSelectedRows] = useState([]);

  const { t } = useTranslation();
  const [
    { customer, type, date, incomeProducts, outgoingProducts, warehouseIdF },
    setColumns,
  ] = useState({
    customer: true,
    type: true,
    date: true,
    incomeProducts: true,
    outgoingProducts: true,
    warehouseIdF: true,
  });

  const [filters, setFilters] = useState({
    product: defaultFilter,
    warehouse: defaultFilter,
    customerData: defaultFilter,
    invoiceType: {
      value: MANI_INVOICES_VALUE,
      label: t('All_posting_invoice'),
    },
    status: { value: 'pending', label: t('Pending') },
    startDate: '',
    endDate: utcDate().format(dateFormat),
  });

  const {
    invoiceType,
    customerData,
    status,
    startDate,
    endDate,
    product,
    warehouse,
  } = filters;

  //get running period
  const runningPeriod = useGetRunningPeriod();
  const curStartDate = runningPeriod?.data?.start_date;

  useEffect(() => {
    if (curStartDate) {
      setFilters((prev) => {
        return {
          ...prev,
          startDate: curStartDate
            ? moment(curStartDate, dateFormat).format(dateFormat)
            : '',
        };
      });
    }
  }, [curStartDate]);

  const [search, setSearch] = useState('');

  const onChangeCustomer = (e) =>
    setColumns((prev) => {
      return { ...prev, customer: e.target.checked };
    });

  const onChangeType = (e) =>
    setColumns((prev) => {
      return { ...prev, type: e.target.checked };
    });

  const onChangeDate = (e) => {
    setColumns((prev) => {
      return { ...prev, date: e.target.checked };
    });
  };

  const onChangeIncomeProducts = (e) => {
    setColumns((prev) => {
      return { ...prev, incomeProducts: e.target.checked };
    });
  };

  const onChangeOutGoingProducts = (e) => {
    setColumns((prev) => {
      return { ...prev, outgoingProducts: e.target.checked };
    });
  };

  const onChangeWarehouseIdF = (e) => {
    setColumns((prev) => {
      return { ...prev, warehouseIdF: e.target.checked };
    });
  };

  const setting = (
    <Menu style={styles.settingsMenu}>
      <Menu.Item key='1'>
        <Typography.Text strong={true}>
          {t('Sales.Product_and_services.Columns')}
        </Typography.Text>
      </Menu.Item>
      <Menu.Item key='3'>
        <Checkbox onChange={onChangeType} checked={type}>
          {t('Sales.Product_and_services.Type')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='5'>
        <Checkbox onChange={onChangeWarehouseIdF} checked={warehouseIdF}>
          {t('Warehouse.Warehouse_name')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='2'>
        <Checkbox onChange={onChangeCustomer} checked={customer}>
          {t('Banking.Form.Account_name')}
        </Checkbox>
      </Menu.Item>

      <Menu.Item key='4'>
        <Checkbox onChange={onChangeDate} checked={date}>
          {t('Sales.Customers.Form.Date')}
        </Checkbox>
      </Menu.Item>

      <Menu.Item key='6'>
        <Checkbox onChange={onChangeIncomeProducts} checked={incomeProducts}>
          {t('Reports.Incoming_products')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='7'>
        <Checkbox
          onChange={onChangeOutGoingProducts}
          checked={outgoingProducts}
        >
          {t('Reports.Outgoing_products')}
        </Checkbox>
      </Menu.Item>
    </Menu>
  );

  const productId = product?.value ?? '';
  const warehouseId = warehouse?.value ?? '';
  const customerId = customerData?.value ?? '';
  const invoiceTypeValue = invoiceType?.value ?? '';
  const statusValue = status?.value ?? '';
  const resultFilters = {
    productId,
    warehouseId,
    customerId,
    startDate,
    endDate,
    invoiceTypeValue,
    status: statusValue,
  };

  const handleGetWarehouseCardXList = React.useCallback(
    async ({ queryKey }) => {
      const {
        page,
        pageSize,
        search,
        order,
        customerData,
        startDate,
        endDate,
        product,
        warehouse,
        invoiceType,
        status,
      } = queryKey?.[1] || {};
      const productId = product?.value ?? '';
      const warehouseId = warehouse?.value ?? '';
      const customerId = customerData?.value ?? '';
      const invoiceTypeValue = invoiceType?.value ?? '';
      const statusValue = status?.value ?? '';
      // const { data } = await axiosInstance.get(
      //   `${props.baseUrl}?page=${page}&page_size=${pageSize}&search=${search}&ordering=${order}&customer=${customerId}&id=${productId}&warehouse=${warehouseId}&invoice_type_in=${invoiceTypeValue}&invoice_state=${statusValue}&date_time_after=${startDate}&date_time_before=${endDate}`
      // );
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?page=${page}&page_size=${pageSize}&search=${search}&ordering=${order}&customer=${customerId}&id=${productId}&warehouse=${warehouseId}&invoice_type_in=${invoiceTypeValue}&invoice_state=${statusValue}`,
      );
      return data;
    },
    [props.baseUrl],
  );

  const columnsFilter = {
    customer,
    incomeProducts,
    outgoingProducts,
    warehouseIdF,
  };
  // const filter = {
  //   search,
  //   customerId,
  //   startDate,
  //   endDate,
  //   productId,
  //   warehouseId,
  // };

  // const printColumns = useMemo(() => {
  //   const newColumns = [
  //     {
  //       title: t("Table.Row"),
  //       dataIndex: "serial",
  //       key: "serial",
  //       width: 40,
  //       align: "center",
  //       className: "print-table-column",
  //     },
  //     {
  //       title: t("Sales.Product_and_services.Type"),
  //       dataIndex: "invoice_type",
  //       key: "invoice_type",
  //       className: "print-table-column",
  //     },
  //     {
  //       title: t("Reports.Warehouse_Details"),
  //       className: "print-table-column",
  //       children: [
  //         {
  //           title: t("Warehouse.Warehouse_id"),
  //           dataIndex: "warehouse",
  //           key: "warehouse",
  //           align: "center",
  //           className: "print-table-column",
  //         },
  //         {
  //           title: t("Warehouse.Warehouse_name"),
  //           dataIndex: "warehouse__name",
  //           key: "warehouse__name",
  //           className: "print-table-column",
  //         },
  //       ],
  //     },
  //     {
  //       title: t("Sales.All_sales.Purchase_and_sales.Invoice_details"),
  //       className: "print-table-column",
  //       children: [
  //         {
  //           title: t("Banking.Form.Account_name"),
  //           dataIndex: "customer_name",
  //           key: "customer_name",
  //           className: "print-table-column",
  //         },
  //         {
  //           title: t("Sales.All_sales.Purchase_and_sales.Invoice_id"),
  //           dataIndex: "invoice_number",
  //           key: "invoice_number",
  //           className: "print-table-column",
  //         },
  //         {
  //           title: t("Sales.Customers.Form.Date"),
  //           dataIndex: "time",
  //           key: "time",
  //           className: "print-table-column",
  //           render: (text) => {
  //             return <ShowDate date={text} />;
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       title: t("Reports.Incoming_products"),
  //       className: "print-table-column",
  //       children: [
  //         {
  //           title: t("Reports.Base_unit_qty"),
  //           dataIndex: "in_base_unit_qty",
  //           key: "in_base_unit_qty",
  //           className: "print-table-column",
  //           render: (text) => (
  //             <div direction="ltr">{fixedNumber(text ?? 0, 4)}</div>
  //           ),
  //         },
  //         {
  //           title: t("Sales.All_sales.Invoice.Quantity"),
  //           dataIndex: "in_qty",
  //           key: "in_qty",
  //           className: "print-table-column",
  //         },
  //         {
  //           title: t("Sales.Product_and_services.Form.Base_unit"),
  //           dataIndex: "in_base_unit",
  //           key: "in_base_unit",
  //           className: "print-table-column",
  //         },
  //         {
  //           title: t("Sales.Product_and_services.Units.Unit"),
  //           dataIndex: "in_unit",
  //           key: "in_unit",
  //           className: "print-table-column",
  //         },
  //         {
  //           title: t("Sales.All_sales.Invoice.Price"),
  //           dataIndex: "in_each_price",
  //           key: "in_each_price",
  //           className: "print-table-column",
  //         },
  //         {
  //           title: t("Pagination.Total"),
  //           dataIndex: "in_total_purchase",
  //           key: "in_total_purchase",
  //           className: "print-table-column",
  //         },
  //         {
  //           title: t("Sales.Product_and_services.Inventory.Currency"),
  //           dataIndex: "in_currency",
  //           key: "in_currency",
  //           className: "print-table-column",
  //         },
  //       ],
  //     },
  //     {
  //       title: t("Reports.Outgoing_products"),
  //       className: "print-table-column",
  //       children: [
  //         {
  //           title: t("Reports.Base_unit_qty"),
  //           dataIndex: "out_base_unit_qty",
  //           key: "out_base_unit_qty",
  //           className: "print-table-column",
  //           render: (text) => (
  //             <div direction="ltr">{fixedNumber(text ?? 0, 4)}</div>
  //           ),
  //         },
  //         {
  //           title: t("Sales.All_sales.Invoice.Quantity"),
  //           dataIndex: "out_qty",
  //           key: "out_qty",
  //           className: "print-table-column",
  //         },
  //         {
  //           title: t("Sales.Product_and_services.Form.Base_unit"),
  //           dataIndex: "out_base_unit",
  //           key: "out_base_unit",
  //           className: "print-table-column",
  //         },
  //         {
  //           title: t("Sales.Product_and_services.Units.Unit"),
  //           dataIndex: "out_unit",
  //           key: "out_unit",
  //           className: "print-table-column",
  //         },
  //         {
  //           title: t("Sales.All_sales.Invoice.Price"),
  //           dataIndex: "out_each_price",
  //           key: "out_each_price",
  //           className: "print-table-column",
  //         },
  //         {
  //           title: t("Pagination.Total"),
  //           dataIndex: "out_total_purchase",
  //           key: "out_total_purchase",
  //           className: "print-table-column",
  //         },
  //         {
  //           title: t("Sales.Product_and_services.Inventory.Currency"),
  //           dataIndex: "out_currency",
  //           key: "out_currency",
  //           className: "print-table-column",
  //         },
  //       ],
  //     },
  //     {
  //       title: t("Sales.Customers.Receive_cash.Receiver"),
  //       dataIndex: "rec_by__name",
  //       key: "rec_by__name",
  //       className: "print-table-column",
  //     },
  //   ];
  //   return newColumns;
  // }, [t]);

  // const resultColumns = useMemo(() => {
  //   const newColumns = [
  //     {
  //       title: t("Table.Row"),
  //       dataIndex: "serial",
  //       key: "serial",
  //       width: 40,
  //       align: "center",
  //       className: "print-table-column",
  //       render: (_, __, index) => <span>{index + 1}</span>,
  //     },
  //     {
  //       title: t("Reports.Incoming"),
  //       className: "print-table-column",
  //       children: [
  //         {
  //           title: t("Reports.Qty_of_incoming"),
  //           dataIndex: "total_in_qty",
  //           key: "total_in_qty",
  //           align: "center",
  //           className: "print-table-column",
  //           render: (text) => (
  //             <div direction="ltr">{fixedNumber(text ?? 0, 4)}</div>
  //           ),
  //         },
  //         {
  //           title: t("Reports.Qty_of_incoming_base"),
  //           dataIndex: "total_in_base_qty",
  //           key: "total_in_base_qty",
  //           className: "print-table-column",
  //           render: (text) => (
  //             <div direction="ltr">{fixedNumber(text ?? 0, 4)}</div>
  //           ),
  //         },
  //         {
  //           title: t("Reports.Total_amount_of_incoming"),
  //           dataIndex: "total_in_price",
  //           key: "total_in_price",
  //           className: "print-table-column",
  //           render: (text) => (
  //             <div direction="ltr">{fixedNumber(text ?? 0, 4)}</div>
  //           ),
  //         },
  //       ],
  //     },
  //     {
  //       title: t("Reports.Outgoing"),
  //       className: "print-table-column",
  //       children: [
  //         {
  //           title: t("Reports.Qty_of_incoming"),
  //           dataIndex: "total_out_qty",
  //           key: "total_out_qty",
  //           align: "center",
  //           className: "print-table-column",
  //           render: (text) => (
  //             <div direction="ltr">{fixedNumber(text ?? 0, 4)}</div>
  //           ),
  //         },
  //         {
  //           title: t("Reports.Qty_of_incoming_base"),
  //           dataIndex: "total_out_price",
  //           key: "total_out_price",
  //           className: "print-table-column",
  //           render: (text) => (
  //             <div direction="ltr">{fixedNumber(text ?? 0, 4)}</div>
  //           ),
  //         },
  //         {
  //           title: t("Reports.Total_amount_of_incoming"),
  //           dataIndex: "in_qty",
  //           key: "in_qty",
  //           className: "print-table-column",
  //           render: (text) => (
  //             <div direction="ltr">{fixedNumber(text ?? 0, 4)}</div>
  //           ),
  //         },
  //       ],
  //     },
  //     {
  //       title: t("Reports.Available_quantity"),
  //       dataIndex: "remain_qty",
  //       key: "remain_qty",
  //       className: "print-table-column",
  //       render: (text) => (
  //         <div direction="ltr">{fixedNumber(text ?? 0, 4)}</div>
  //       ),
  //     },
  //     {
  //       title: t("Sales.Product_and_services.Inventory.Currency"),
  //       dataIndex: "currency_name",
  //       key: "currency_name",
  //       className: "print-table-column",
  //     },
  //   ];
  //   return newColumns;
  // }, [t]);
  const tableColumnsType = type;
  const columns = useMemo(
    (type) => {
      const sorter = type !== 'print' ? true : false;
      return (
        <React.Fragment>
          {tableColumnsType && (
            <Column
              title={t('Sales.Product_and_services.Type').toUpperCase()}
              dataIndex='invoice_type'
              key='invoice_type'
              sorter={sorter && { multiple: 20 }}
              fixed={type !== 'print' ? true : undefined}
              className='table-col'
            />
          )}
          {/* <ColumnGroup title={t("Reports.Warehouse_Details").toUpperCase()}> */}
          {/* {warehouseIdF && (
              <Column
                title={t("Warehouse.Warehouse_id").toUpperCase()}
                dataIndex="warehouse"
                key="warehouse"
                sorter={sorter && { multiple: 19 }}
                className="table-col"
                align="center"
              />
            )} */}
          {warehouseIdF && (
            <Column
              title={t('Warehouse.Warehouse_name').toUpperCase()}
              dataIndex='warehouse'
              key='warehouse'
              className='table-col'
              sorter={sorter && { multiple: 18 }}
            />
          )}
          {/* </ColumnGroup> */}

          <ColumnGroup
            title={t(
              'Sales.All_sales.Purchase_and_sales.Invoice_details',
            ).toUpperCase()}
          >
            {customer && (
              <Column
                title={t('Banking.Form.Account_name').toUpperCase()}
                dataIndex='customer_name'
                key='customer_name'
                sorter={sorter && { multiple: 17 }}
                className='table-col'
              />
            )}
            <Column
              title={t(
                'Sales.All_sales.Purchase_and_sales.Invoice_id',
              ).toUpperCase()}
              dataIndex='invoice_id'
              key='invoice_id'
              width={type !== 'print' ? 155 : undefined}
              sorter={sorter && { multiple: 16 }}
              className='table-col'
              align='center'
            />

            {date && (
              <Column
                title={t('Sales.Customers.Form.Date').toUpperCase()}
                width={type !== 'print' ? 180 : undefined}
                dataIndex='time'
                key='time'
                sorter={sorter && { multiple: 15 }}
                render={(text) => {
                  return <ShowDate date={text} />;
                }}
                className='table-col'
              />
            )}
          </ColumnGroup>
          {incomeProducts && (
            <ColumnGroup title={t('Reports.Incoming_products').toUpperCase()}>
              <Column
                title={t('Reports.Base_unit_qty').toUpperCase()}
                dataIndex='in_base_unit_qty'
                key='in_base_unit_qty'
                className='table-col'
                sorter={sorter && { multiple: 14 }}
                render={(value) => value && <Statistics value={value} />}
              />
              <Column
                title={t('Sales.All_sales.Invoice.Quantity').toUpperCase()}
                dataIndex='in_qty'
                key='in_qty'
                className='table-col'
                sorter={sorter && { multiple: 13 }}
                render={(value) => value && <Statistics value={value} />}
              />

              <Column
                title={t(
                  'Sales.Product_and_services.Form.Base_unit',
                ).toUpperCase()}
                dataIndex='in_base_unit'
                key='in_base_unit'
                sorter={sorter && { multiple: 12 }}
                className='table-col'
              />
              <Column
                title={t('Sales.Product_and_services.Units.Unit').toUpperCase()}
                dataIndex='in_unit'
                key='in_unit'
                sorter={sorter && { multiple: 11 }}
                className='table-col'
              />
              <Column
                title={t('Sales.All_sales.Invoice.Price').toUpperCase()}
                dataIndex='in_each_price'
                key='in_each_price'
                className='table-col'
                sorter={sorter && { multiple: 10 }}
                render={(value) => value && <Statistics value={value} />}
              />

              <Column
                title={t('Pagination.Total').toUpperCase()}
                dataIndex='in_total_purchase'
                key='in_total_purchase'
                className='table-col'
                sorter={sorter && { multiple: 9 }}
                render={(value) => value && <Statistics value={value} />}
              />

              <Column
                title={t(
                  'Sales.Product_and_services.Inventory.Currency',
                ).toUpperCase()}
                dataIndex='in_currency'
                key='in_currency'
                className='table-col'
                sorter={sorter && { multiple: 8 }}
              />
            </ColumnGroup>
          )}
          {outgoingProducts && (
            <ColumnGroup title={t('Reports.Outgoing_products').toUpperCase()}>
              <Column
                title={t('Reports.Base_unit_qty').toUpperCase()}
                dataIndex='out_base_unit_qty'
                key='out_base_unit_qty'
                className='table-col'
                sorter={sorter && { multiple: 7 }}
                render={(value) => value && <Statistics value={value} />}
              />
              <Column
                title={t('Sales.All_sales.Invoice.Quantity').toUpperCase()}
                dataIndex='out_qty'
                key='out_qty'
                className='table-col'
                sorter={sorter && { multiple: 6 }}
                render={(value) => value && <Statistics value={value} />}
              />
              <Column
                title={t(
                  'Sales.Product_and_services.Form.Base_unit',
                ).toUpperCase()}
                dataIndex='out_base_unit'
                key='out_base_unit'
                sorter={sorter && { multiple: 5 }}
                className='table-col'
              />
              <Column
                title={t('Sales.Product_and_services.Units.Unit').toUpperCase()}
                dataIndex='out_unit'
                key='out_unit'
                sorter={sorter && { multiple: 4 }}
                className='table-col'
              />
              <Column
                title={t('Sales.All_sales.Invoice.Price').toUpperCase()}
                dataIndex='out_each_price'
                key='out_each_price'
                className='table-col'
                sorter={sorter && { multiple: 3 }}
                render={(value) => value && <Statistics value={value} />}
              />

              <Column
                title={t('Pagination.Total').toUpperCase()}
                dataIndex='out_total_purchase'
                key='out_total_purchase'
                className='table-col'
                sorter={{ multiple: 2 }}
                render={(value) => value && <Statistics value={value} />}
              />

              <Column
                title={t(
                  'Sales.Product_and_services.Inventory.Currency',
                ).toUpperCase()}
                dataIndex='out_currency'
                key='out_currency'
                className='table-col'
                sorter={sorter && { multiple: 1 }}
              />
            </ColumnGroup>
          )}
        </React.Fragment>
      );
    },
    [
      customer,
      date,
      incomeProducts,
      outgoingProducts,
      t,
      tableColumnsType,
      warehouseIdF,
    ],
  );

  const resultColumns = useMemo(
    (type) => (
      <React.Fragment>
        <Column
          title={t('Table.Row').toUpperCase()}
          dataIndex='serial'
          key='serial'
          width={type !== 'print' ? 80 : 40}
          align='center'
          render={(_, __, index) => (
            <React.Fragment>{index + 1}</React.Fragment>
          )}
        />
        <Column
          title={t('Warehouse.Warehouse_name').toUpperCase()}
          dataIndex='warehouse'
          key='warehouse'
          className='table-col'
        />
        {incomeProducts && (
          <ColumnGroup title={t('Reports.Incoming')}>
            <Column
              title={t('Sales.All_sales.Invoice.Quantity')}
              dataIndex='total_in_qty'
              key='total_in_qty'
              className='table-col'
              render={(value) => <Statistics value={value} />}
            />
            <Column
              title={t('Reports.Base_unit_qty')}
              dataIndex='total_in_base_qty'
              key='total_in_base_qty'
              className='table-col'
              render={(value) => <Statistics value={value} />}
            />

            <Column
              title={t('Reports.Total_amount_of_incoming')}
              dataIndex='total_in_price'
              key='total_in_price'
              className='table-col'
              render={(value) => <Statistics value={value} />}
            />
          </ColumnGroup>
        )}
        {outgoingProducts && (
          <ColumnGroup title={t('Reports.Outgoing')}>
            <Column
              title={t('Sales.All_sales.Invoice.Quantity')}
              dataIndex='total_out_qty'
              key='total_out_qty'
              className='table-col'
              render={(value) => <Statistics value={value} />}
            />
            <Column
              title={t('Reports.Base_unit_qty')}
              dataIndex='total_out_base_qty'
              key='total_out_base_qty'
              className='table-col'
              render={(value) => <Statistics value={value} />}
            />

            <Column
              title={t('Reports.Total_amount_of_outgoing')}
              dataIndex='total_out_price'
              key='total_out_price'
              className='table-col'
              render={(value) => <Statistics value={value} />}
            />
          </ColumnGroup>
        )}
        {/* <Column
          title={t("Reports.Available_quantity")}
          dataIndex="remain_qty"
          key="remain_qty"
          className="table-col"
          render={(text) => (
            <div direction="ltr">{fixedNumber(text ?? 0, 4)}</div>
          )}
        /> */}
        <Column
          title={t('Sales.Product_and_services.Inventory.Currency')}
          dataIndex='currency'
          key='currency'
          className='table-col'
        />
      </React.Fragment>
    ),
    [incomeProducts, outgoingProducts, t],
  );

  const printFilters = (
    <Descriptions
      layout='horizontal'
      style={{ width: '100%', paddingTop: '40px' }}
      column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
      size='small'
    >
      <Descriptions.Item label={t('Form.From')}>
        {startDate} {t('Form.To')} : {endDate}
      </Descriptions.Item>
      {customerData?.label && (
        <Descriptions.Item label={t('Banking.Form.Account_name')}>
          {customerData?.label}
        </Descriptions.Item>
      )}
      {warehouse?.label && (
        <Descriptions.Item label={t('Warehouse.1')}>
          {warehouse?.label}
        </Descriptions.Item>
      )}
      {product?.label && (
        <Descriptions.Item label={t('Sales.Product_and_services.Product')}>
          {product?.label}
        </Descriptions.Item>
      )}
      {invoiceType?.label && (
        <Descriptions.Item label={t('Invoice_type')}>
          {invoiceType?.label}
        </Descriptions.Item>
      )}
      {status?.label && (
        <Descriptions.Item label={t('Sales.Product_and_services.Status')}>
          {status?.label}
        </Descriptions.Item>
      )}
    </Descriptions>
  );

  return (
    <>
      <ReportTable
        pagination={true}
        setSearch={setSearch}
        search={search}
        isSearch={false}
        setResultSelectedRowKeys={setResultSelectedRowKeys}
        setResultSelectedRows={setResultSelectedRows}
        title={t('Reports.Warehouse_cart_x')}
        columns={columns}
        queryKey={props.baseUrl}
        handleGetData={handleGetWarehouseCardXList}
        settingMenu={setting}
        filters={filters}
        filterNode={(setPage, setSelectedRowKeys) => (
          <Filters
            setFilters={setFilters}
            setSelectedRowKeys={setSelectedRowKeys}
            setPage={setPage}
            setResultSelectedRowKeys={setResultSelectedRowKeys}
          />
        )}
        filtersComponent={printFilters}
        selectResult={resultSelectedRowKeys?.length > 0}
        resultDataSource={resultSelectedRows}
        resultDomColumns={resultColumns('print')}
        queryConf={{
          enabled: !!productId,
          //  cacheTime: 0
        }}
        paginationPosition={t('Dir') === 'ltr' ? ['topRight'] : ['topLeft']}
      />
      <div style={{ padding: '10px' }}></div>
      <WarehouseCardXResultTable
        baseUrl={props.baseUrl}
        columnsFilter={columnsFilter}
        filter={resultFilters}
        setSelectedRows={setResultSelectedRows}
        setSelectedRowKeys={setResultSelectedRowKeys}
        selectedRowKeys={resultSelectedRowKeys}
        columns={resultColumns}
      />
    </>
  );
};

const styles = {
  card: { background: '#3498db', padding: '24px 20px' },
  settingsMenu: { width: '170px', paddingBottom: '10px' },
};

export default WarehouseCardXTable;
