import React, { useCallback, useMemo, useState } from 'react';
import { Row, Col, message, Table, Form, Select, Spin } from 'antd';
import axiosInstance from '../ApiBaseUrl';
import { useTranslation } from 'react-i18next';
import { ActionMessage } from '../SelfComponents/TranslateComponents/ActionMessage';
import ApproveCenterBatchAction from './BatchAction';
import ApproveCenterFilters from './Filters';
import ShowDate from '../SelfComponents/JalaliAntdComponents/ShowDate';
import { useQuery } from 'react-query';
import { utcDate } from '../../Functions/utcDate';
import { invoicesBaseUrl } from '../Reports/AllReports/Invoices/Invoices';
import { AntdTag, EditableTable, Statistics } from '../../components/antd';
import { useMutation, useQueryClient } from 'react-query';
import { Colors } from '../colors';
import { SALES_INVOICE_M } from '../../constants/permissions';
import {
  EditableTableActionColumnRender,
  TableSummaryCell,
} from '../../components';
import { manageErrors } from '../../Functions';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  record,
  index,
  children,
  save,
  ...restProps
}: any) => {
  const { t } = useTranslation();

  const handleOnDoubleClick = (e: any) => {
    e.stopPropagation();
  };
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          className='margin1'
          //@ts-ignore
          onDoubleClick={handleOnDoubleClick}
        >
          <Select onChange={() => save(record)}>
            <Select.Option value='pending'>{t('Form.Pending')}</Select.Option>
            <Select.Option value='accepted'>{t('Form.accepted')}</Select.Option>
            <Select.Option value='rejected'>{t('Form.Rejected')}</Select.Option>
          </Select>
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

interface IProps {
  baseUrl: string;
}
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const ApproveCenterTable: React.FC<IProps> = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    status: 'pending',
    startDate: utcDate().startOf('day').format(dateFormat),
    endDate: utcDate().endOf('day').format(dateFormat),
  });

  const [search, setSearch] = useState<string | number>('');
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  const { status, startDate, endDate } = filters;

  const edit = useCallback(
    (record: any) => {
      form.setFieldsValue({
        invoice_state: record?.invoice_state,
        // ...record,
      });
      setEditingKey(record.id);
    },
    [form]
  );

  const cancel = () => {
    setEditingKey('');
  };

  const handleEditStatus = async ({ value, id }: any) => {
    return await axiosInstance.put(`${props.baseUrl}${id}/`, { ...value });
  };

  const { mutate: mutateEditStatus, isLoading } = useMutation(
    handleEditStatus,
    {
      onSuccess: (_, { product }) => {
        message.success(
          <ActionMessage
            name={product}
            message={'Sales.All_sales.Success_status_message'}
          />
        );
        setEditingKey('');
        queryClient.invalidateQueries(`${props.baseUrl}`);
      },
      onError: (error) => {
        manageErrors(error);
      },
    }
  );

  const save = useCallback(
    async (record: any) => {
      try {
        const row = await form.validateFields();

        const allData = {
          invoice_state: row?.invoice_state,
          invoice_order_finish:
            row?.invoice_state === 'accepted' ? true : false,
          currency: record?.currency?.id,
          currency_rate: record?.currency_rate,
          customer: record?.customer?.content_object?.cht_account_id,
        };

        mutateEditStatus({
          value: allData,
          id: record?.id,
          // product: record?.name,
        });

        // if (record?.approve_state === row?.approve_state) {
        //   message.error(
        //     `${t("Warehouse.Notification.Max_min_Match_message")}`,
        //     2.5
        //   );

        //   return;
        // } else {

        // }
      } catch (errInfo) {}
    },
    [form, mutateEditStatus]
  );

  const columns = useMemo(
    () => (type: string, hasSelected: boolean) =>
      [
        {
          title: `${t(
            'Sales.All_sales.Purchase_and_sales.Invoice_details'
          ).toUpperCase()}`,
          children: [
            {
              title: t(
                'Sales.All_sales.Purchase_and_sales.Invoice_id'
              ).toUpperCase(),
              dataIndex: 'id',
              key: 'id',
              width: 155,
              sorter: { multiple: 7 },
              className: 'table-col',
              align: 'center',
            },
            {
              title: t('Sales.Customers.Customer').toUpperCase(),
              dataIndex: 'customer',
              key: 'customer',
              sorter: { multiple: 6 },
              className: 'table-col',
              render: (text: any) => (
                <React.Fragment>
                  {text?.content_object?.full_name}
                </React.Fragment>
              ),
            },
            {
              title: t('Form.Created_by').toUpperCase(),
              dataIndex: 'created_by',
              key: 'created_by',
              sorter: { multiple: 5 },
              width: 140,
              className: 'table-col',
              render: (text: any) => (
                <React.Fragment>{text?.username}</React.Fragment>
              ),
            },
            {
              title: t('Form.Created_at').toUpperCase(),
              dataIndex: 'created',
              key: 'created',
              sorter: { multiple: 4 },
              width: 160,
              className: 'table-col',
              render: (text: string) => {
                return <ShowDate date={text} />;
              },
            },
          ],
        },
        {
          title: `${t(
            'Sales.All_sales.Purchase_and_sales.Cash'
          ).toUpperCase()}`,
          children: [
            {
              title: t('Sales.Customers.Form.Amount').toUpperCase(),
              dataIndex: 'remain',
              key: 'remain',

              sorter: { multiple: 3 },
              className: 'table-col',
              render: (_: any, record: any) => {
                return <Statistics value={record?.cash_payment?.[0]?.amount} />;
              },
            },
            {
              title: t(
                'Sales.Product_and_services.Inventory.Currency'
              ).toUpperCase(),
              dataIndex: 'currency',
              key: 'currency',
              sorter: { multiple: 2 },
              className: 'table-col',
              render: (currency: any, record: any) => {
                // console.log("currency record" , record)
                return <div>{t(`Reports.${currency?.symbol}`)}</div>;
              },
            },
          ],
        },
        {
          title: t('Sales.Product_and_services.Modified').toUpperCase(),
          dataIndex: 'modified',
          editable: false,
          sorter: { multiple: 1 },
          key: 'modified',
          render: (text: string) => {
            return <ShowDate date={text} />;
          },
        },
        {
          title: t('Sales.Product_and_services.Status').toUpperCase(),
          dataIndex: 'invoice_state',
          editable: true,
          sorter: { multiple: 1 },
          key: 'invoice_state',
          width: 140,
          render: (text: string) => (
            <AntdTag
              color={
                text === 'pending'
                  ? 'orange'
                  : text === 'accepted'
                  ? Colors.primaryColor
                  : 'red'
              }
            >
              {text === 'pending'
                ? t('Form.Pending')
                : text === 'accepted'
                ? t('Form.accepted')
                : t('Form.Rejected')}
            </AntdTag>
          ),
        },

        {
          title: `${t('Table.Action')}`,
          dataIndex: 'action',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 70,

          render: (_: any, record: any) => {
            return (
              <EditableTableActionColumnRender
                {...{
                  record,
                  save,
                  edit,
                  editingKey,
                  onCancel: cancel,
                  model: SALES_INVOICE_M,
                  disabled:
                    editingKey !== '' || record.invoice_state === 'accepted',
                }}
              >
                {null}
              </EditableTableActionColumnRender>
            );
          },
        },
      ],
    [edit, editingKey, save, t]
  );

  const handleGetSalesInvoice = React.useCallback(
    async ({ queryKey }: { queryKey: [string, { page: number; pageSize: number; search: string; order: string; status: string; startDate: string; endDate: string }] }) => {
      const { page, pageSize, search, order, status, startDate, endDate } =
        queryKey?.[1];

      const { data } = await axiosInstance.get(
        `${
          props.baseUrl
        }?page=${page}&page_size=${pageSize}&search=${search}&ordering=${order}&invoice_state=${
          status ? status : 'pending'
        }&invoice_state=rejected&expand=*`
      );
      // &date_time_after=${startDate}&date_time_before=${endDate}&approve_state=${status}
      // ,payment_summery.cash_fin,payment_summery.cash_fin.currency,customer&fields=id,currency,currency_rate,date_time,description,payment_summery,warehouse,customer,fiscal_year,sales_source,created_by,created,approve_state
      // console.log("apro center ", data);
      return data;
    },    [props.baseUrl]
  );

  const getSalesResult = React.useCallback(async ({ queryKey }: { queryKey: [string, { search: string; startDate: string; endDate: string; status: string,  }] }) => {
    const { search, startDate, endDate, status } = queryKey?.[1];
    const { data } = await axiosInstance.get(
      `${invoicesBaseUrl}result?search=${search}&date_time_after=${startDate}&date_time_before=${endDate}&approve_state=${status}&invoice_type=sales`
    );
    return data;
  }, []);
  const salesResult = useQuery(
    [
      `${invoicesBaseUrl}/result/`,
      {
        search,
        startDate,
        endDate,
        status,
      },
    ],
    getSalesResult as any,
    {
      refetchInterval: 5000,
    }
  );
  // console.log("handleGetSalesInvoice" , handleGetSalesInvoice)
  let userTye: string = '';

  return (
    <Form form={form} component={false}>
      <EditableTable
        columns={columns}
        model={SALES_INVOICE_M}
        setSearch={setSearch}
        search={search}
        queryKey={props.baseUrl}
        handleGetData={handleGetSalesInvoice as any}
        save={save}
        edit={edit}
        editLoading={isLoading}
        editableCell={EditableCell}
        editingKey={editingKey}
        filters={filters}
        filterNode={(setPage, setVisible) => (
          <ApproveCenterFilters
            setFilters={setFilters}
            setVisible={setVisible}
            setPage={setPage}
          />
        )}
        batchAction={(selectedRowKeys, setSelectedRowKeys, selectedRows) =>
          userTye === 'admin' && status === 'rejected' ? (
            <ApproveCenterBatchAction
              selectedRows={selectedRows}
              selectedRowKeys={selectedRowKeys}
              setSelectedRowKeys={setSelectedRowKeys}
              baseUrl={props.baseUrl}
            />
          ) : null
        }
        type='approveCenter'
        rowSelection={{
          getCheckboxProps: (record: any) => ({
            disabled:
              record?.invoice_state === 'accepted' ||
              record?.invoice_state === 'pending' ||
              editingKey !== '', // Column configuration not to be checked
          }),
          onDoubleClick: (e: any) => {
            e.stopPropagation();
          },
        }}
        resultLoading={salesResult?.isFetching}
        summary={() => {
          return (
            <>
            {/* @ts-ignore */}
              {salesResult?.data?.results?.length > 0 && (
                <Table.Summary.Row>
                  <TableSummaryCell index={0} color={'inherit'} />
                  <TableSummaryCell index={1} color={'inherit'}>
                    {t('Expenses.1')}
                  </TableSummaryCell>
                  <TableSummaryCell index={2} color={'inherit'}>
                    {t('Sales.Customers.Discount.1')}
                  </TableSummaryCell>
                  <TableSummaryCell index={3} color={'inherit'}>
                    {t('Sales.Customers.Form.Total')}
                  </TableSummaryCell>
                  <TableSummaryCell index={4} color={'inherit'}>
                    {t('Sales.All_sales.Invoice.Remain_amount')}
                  </TableSummaryCell>
                  <TableSummaryCell index={5} color={'inherit'}>
                    {t('Sales.Product_and_services.Inventory.Currency')}
                  </TableSummaryCell>
                  <TableSummaryCell index={6} color={'inherit'}>
                    {t('Sales.All_sales.Invoice.Cash_amount')}
                  </TableSummaryCell>
                  <TableSummaryCell index={7} colSpan={3} color={'inherit'}>
                    {t('Sales.All_sales.Purchase_and_sales.Cash_currency')}
                  </TableSummaryCell>
                </Table.Summary.Row>
              )}
              {salesResult?.isLoading && (
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td style={{ height: '50px' }}>
                    <Row
                      justify='center'
                      align='middle'
                      style={{ height: '100%' }}
                    >
                      <Col>
                        <Spin size='small' />
                      </Col>
                    </Row>
                  </td>
                  <td></td>
                </tr>
              )}
              {/* @ts-ignore */}
              {salesResult?.data?.results?.map((item: any) => {
                return (
                  <Table.Summary.Row>
                    <TableSummaryCell index={0} />
                    <TableSummaryCell
                      index={1}
                      value={item?.total_expense}
                      type='total'
                    />
                    <TableSummaryCell
                      index={2}
                      value={item?.total_discount}
                      type='total'
                    />
                    <TableSummaryCell
                      index={3}
                      type='total'
                      value={item?.total_net_amount}
                    />
                    <TableSummaryCell
                      index={4}
                      type='total'
                      value={item?.total_remain}
                    />
                    <TableSummaryCell index={5}>
                      {item?.invoice__currency__name}
                    </TableSummaryCell>
                    <TableSummaryCell
                      index={6}
                      type='total'
                      value={item?.total_cash_pay}
                    />
                    <TableSummaryCell index={7} colSpan={3}>
                      {item?.cash_currency_name}
                    </TableSummaryCell>
                  </Table.Summary.Row>
                );
              })}
            </>
          );
        }}
        />
    </Form>
  );
};

export default ApproveCenterTable;
