import React, { useEffect, useState } from 'react';
import Filters from './Filters';
import moment from 'moment';
import { useQuery, useQueryClient } from 'react-query';
import {
  PrinterOutlined,
  ExportOutlined,
  SettingOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';

import {
  Checkbox,
  Row,
  Col,
  Table,
  Dropdown,
  Button,
  Menu,
  Typography,
  Space,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../../../MediaQurey';
import { usePaginationNumber } from '../../../usePaginationNumber';
import axiosInstance from '../../../ApiBaseUrl';
import { SearchInput } from '../../../SelfComponents/SearchInput';
import { utcDate } from '../../../../Functions/utcDate';
import { fixedNumber } from '../../../../Functions/math';
import IncomingProductsResultTable from './ResultTable';
import useGetRunningPeriod from '../../../../Hooks/useGetRunningPeriod';
import { reportsDateFormat } from '../../../../Context';

const { Column } = Table;
const dateFormat = reportsDateFormat;

const IncomingProductsTable = (props) => {
  const queryClient = useQueryClient();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [{ visible }, setVisible] = useState({
    visible: false,
  });
  const isMobile = useMediaQuery('(max-width: 576px)');
  const { t } = useTranslation();
  const [visibility, setVisibility] = useState(false);
  const [
    {
      account,
      date,
      total,
      product,
      unit,
      qty,
      currency,
      purchase,
      description,
      warehouse,
    },
    setColumns,
  ] = useState({
    account: true,
    date: true,
    total: true,
    product: true,
    unit: true,
    qty: true,
    currency: true,
    purchase: true,
    warehouse: true,
    description: true,
  });

  const [{ customerName, startDate, endDate }, setFilters] = useState({
    customerName: '',
    startDate: '',
    endDate: utcDate().format(dateFormat),
  });

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
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [order, setOrder] = useState('-id');

  //setting drop
  const handleVisibleChange = (flag) => {
    setVisible({ visible: flag });
  };
  // setting  checkbox show More
  const handelVisibility = () => {
    setVisibility(!visibility);
  };
  //setting checkbox

  const onChangeAccount = (e) =>
    setColumns((prev) => {
      return { ...prev, account: e.target.checked };
    });

  const onChangeDate = (e) => {
    setColumns((prev) => {
      return { ...prev, date: e.target.checked };
    });
  };

  const onChangeTotal = (e) => {
    setColumns((prev) => {
      return { ...prev, total: e.target.checked };
    });
  };

  const onChangeProduct = (e) => {
    setColumns((prev) => {
      return { ...prev, product: e.target.checked };
    });
  };

  const onChangeUnit = (e) => {
    setColumns((prev) => {
      return { ...prev, unit: e.target.checked };
    });
  };

  const onChangeQty = (e) => {
    setColumns((prev) => {
      return { ...prev, qty: e.target.checked };
    });
  };

  const onChangeCurrency = (e) => {
    setColumns((prev) => {
      return { ...prev, currency: e.target.checked };
    });
  };
  const onChangeWarehouse = (e) => {
    setColumns((prev) => {
      return { ...prev, warehouse: e.target.checked };
    });
  };
  const onChangePurchase = (e) => {
    setColumns((prev) => {
      return { ...prev, purchase: e.target.checked };
    });
  };
  const onChangeDescription = (e) => {
    setColumns((prev) => {
      return { ...prev, description: e.target.checked };
    });
  };

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
    // this.setState({ selectedRowKeys });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
    // onSelect: (record, selected, selectedRows, nativeEvent) => {
    //
    //     `record:${record} select  ${selected}  selectedRows  ${selectedRows}  nativeEvent   ${nativeEvent}`
    //   );

    // },
    // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
    // hideDefaultSelections: true,
    getCheckboxProps: (record) => ({
      disabled: record.status === 'inActive', // Column configuration not to be checked
      name: record.name,
    }),
  };

  const setting = (
    <Menu style={styles.settingsMenu}>
      <Menu.Item key='1'>
        <Typography.Text strong={true}>
          {t('Sales.Product_and_services.Columns')}
        </Typography.Text>
      </Menu.Item>
      <Menu.Item key='2'>
        <Checkbox onChange={onChangeAccount} checked={account}>
          {t('Banking.Form.Account_name')}
        </Checkbox>
      </Menu.Item>

      <Menu.Item key='4'>
        <Checkbox onChange={onChangeDate} checked={date}>
          {t('Sales.Customers.Form.Date')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='3'>
        <Checkbox onChange={onChangeWarehouse} checked={warehouse}>
          {t('Warehouse.1')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='5'>
        <Checkbox onChange={onChangeProduct} checked={product}>
          {t('Sales.Product_and_services.Product')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='6'>
        <Checkbox onChange={onChangeUnit} checked={unit}>
          {t('Sales.Product_and_services.Units.Unit')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='7'>
        <Checkbox onChange={onChangeQty} checked={qty}>
          {t('Reports.Available_quantity')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='8'>
        <Checkbox onChange={onChangePurchase} checked={purchase}>
          {props.type === 'incoming'
            ? t('Taxes.Tax_rates.Purchases')
            : t('Sales.1')}
        </Checkbox>
      </Menu.Item>
      {visibility && (
        <React.Fragment>
          <Menu.Item key='9'>
            <Checkbox onChange={onChangeTotal} checked={total}>
              {t('Sales.Customers.Form.Total')}
            </Checkbox>
          </Menu.Item>
          <Menu.Item key='10'>
            <Checkbox onChange={onChangeCurrency} checked={currency}>
              {t('Sales.Product_and_services.Inventory.Currency')}
            </Checkbox>
          </Menu.Item>
          <Menu.Item key='11'>
            <Checkbox onChange={onChangeDescription} checked={description}>
              {t('Form.Description')}
            </Checkbox>
          </Menu.Item>
        </React.Fragment>
      )}

      <Menu.Item
        key='14'
        onClick={handelVisibility}
        className='table__header2-setting-showMore'
        style={{ textAlign: 'end' }}
      >
        {visibility ? (
          <Button
            type='link'
            icon={<UpOutlined />}
            className='table__header2-setting-showMore'
          >
            {t('Sales.Product_and_services.Show_less')}
          </Button>
        ) : (
          <Button
            type='link'
            icon={<DownOutlined />}
            className='table__header2-setting-showMore'
          >
            {t('Sales.Product_and_services.Show_More')}
          </Button>
        )}
      </Menu.Item>
    </Menu>
  );

  const getSalesReport = React.useCallback(
    async ({ queryKey }) => {
      const {
        page,
        pageSize,
        search,
        order,
        customerName,
        startDate,
        endDate,
      } = queryKey?.[1] || {};
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?page=${page}&page_size=${pageSize}&id=${search}&ordering=${order}&expand=*&fields=currency,customer.content_object,date_time,id,payment_summery&customer_name=${customerName}&date_time_after=${startDate}&date_time_before=${endDate}`,
      );
      return data;
    },
    [props.baseUrl],
  );
  const { isLoading, isFetching, data } = useQuery(
    [
      `${props.baseUrl}/report`,
      { page, pageSize, search, order, customerName, startDate, endDate },
    ],
    getSalesReport,
  );

  const hasMore = Boolean(data?.nextPageNumber);
  React.useEffect(() => {
    if (hasMore) {
      queryClient.prefetchQuery(
        [
          props.baseUrl,
          {
            page: page + 1,
            pageSize,
            search,
            order,
            customerName,
            startDate,
            endDate,
          },
        ],
        getSalesReport,
      );
    }
  }, [
    order,
    data,
    page,
    pageSize,
    search,
    props.baseUrl,
    getSalesReport,
    customerName,
    startDate,
    endDate,
    queryClient,
    hasMore,
  ]);

  //
  //pagination
  const paginationChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };
  const onPageSizeChange = (current, size) => {
    setPageSize(size);
    setPage(current);
  };

  const onChangeTable = (pagination, filters, sorter) => {
    if (sorter.order === 'ascend') {
      setOrder(sorter.field);
    } else if (sorter.order === 'descend') {
      setOrder(`-${sorter.field}`);
    } else {
      setOrder(`-id`);
    }
  };
  const pagination = {
    total: data?.count,
    pageSizeOptions: [5, 10, 20, 50],
    onShowSizeChange: onPageSizeChange,
    defaultPageSize: 5,
    current: page,
    pageSize: pageSize,
    defaultCurrent: 1,
    onChange: paginationChange,
    showTotal: (total) =>
      `${t('Pagination.Total')} ${total} ${t('Pagination.Item')}`,

    showQuickJumper: true,
    showSizeChanger: true,
    responsive: true,
    showLessItems: true,
    position: t('Dir') === 'ltr' ? ['topRight'] : ['topLeft'],
  };

  const allData = usePaginationNumber(data, page, pageSize);

  const columnsFilter = {
    warehouse,
    product,
    unit,
    qty,
    total,
    currency,
  };
  return (
    <>
      <Filters setFilters={setFilters} setPage={setPage} type={props.type} />
      <Table
        expandable
        id='allSales'
        className='table-content'
        size='small'
        loading={isLoading || isFetching ? true : false}
        rowSelection={rowSelection}
        rowKey={(record) => record.id}
        onChange={onChangeTable}
        pagination={pagination}
        dataSource={allData}
        bordered={true}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true }}
        title={() => {
          return (
            <Row style={{ width: '100%' }} align='middle'>
              <Col
                xl={{ span: 7 }}
                lg={{ span: 10 }}
                md={{ span: 12 }}
                sm={{ span: 13 }}
                xs={{ span: 24 }}
                className={isMobile ? 'table__header1' : ''}
              >
                <Row
                  // className='table__batch'
                  justify='space-around'
                  align='middle'
                >
                  <Col md={16} sm={15} xs={15}>
                    <SearchInput
                      setPage={setPage}
                      placeholder={t('Form.Search')}
                      setSearch={setSearch}
                    />
                  </Col>
                  <Col md={6} sm={7} xs={7}></Col>
                </Row>
              </Col>

              <Col
                xl={{ span: 2, offset: 15 }}
                lg={{ span: 3, offset: 11 }}
                md={{ span: 3, offset: 9 }}
                sm={{ span: 4, offset: 7 }}
                xs={{ span: 24 }}
                className='table__header2'
              >
                <Space size={12}>
                  <PrinterOutlined className='table__header2-icon' />

                  <ExportOutlined className='table__header2-icon' />

                  <Dropdown
                    overlay={setting}
                    trigger={['click']}
                    onOpenChange={handleVisibleChange}
                    open={visible}
                    placement='bottomRight'
                  >
                    <a className='ant-dropdown-link' href='#'>
                      <SettingOutlined className='table__header2-icon' />
                    </a>
                  </Dropdown>
                </Space>
              </Col>
              {/* )} */}
            </Row>
          );
        }}
      >
        <Column
          title={t('Table.Row').toUpperCase()}
          dataIndex='serial'
          key='serial'
          width={80}
          className='table-col'
          align='center'
          fixed={true}
        />
        <Column
          title={t('Sales.Product_and_services.Type').toUpperCase()}
          dataIndex='invoice_type'
          key='invoice_type'
          sorter={true}
          fixed={true}
          className='table-col'
          render={(text, record) => {
            return (
              <React.Fragment>
                {record?.payment_summery?.invoice_type}
              </React.Fragment>
            );
          }}
        />
        <Column
          title={t(
            'Sales.All_sales.Purchase_and_sales.Invoice_id',
          ).toUpperCase()}
          dataIndex='id'
          key='id'
          width={155}
          sorter={true}
          fixed={true}
          className='table-col'
          align='center'
        />

        {account && (
          <Column
            title={t('Banking.Form.Account_name').toUpperCase()}
            dataIndex='customer'
            key='customer'
            // width={150}
            sorter={true}
            className='table-col'
            render={(text, record) => {
              return (
                <React.Fragment>
                  {text?.content_object?.full_name}
                </React.Fragment>
              );
            }}
          />
        )}
        {date && (
          <Column
            title={t('Sales.Customers.Form.Date').toUpperCase()}
            dataIndex='date_time'
            key='date_time'
            sorter={true}
            render={(text) => {
              return (
                <React.Fragment>
                  {text && moment(text)?.format('YYYY-MM-DD HH:mm a')}
                </React.Fragment>
              );
            }}
            className='table-col'
          />
        )}
        {warehouse && (
          <Column
            title={t('Warehouse.1').toUpperCase()}
            dataIndex='name'
            key='name'
            className='table-col'
            sorter={true}
          />
        )}
        {product && (
          <Column
            title={t('Sales.Product_and_services.Product').toUpperCase()}
            dataIndex='name'
            key='name'
            className='table-col'
            sorter={true}
          />
        )}

        {unit && (
          <Column
            title={t('Sales.Product_and_services.Units.Unit').toUpperCase()}
            dataIndex='unit'
            key='unit'
            sorter={{ multiple: 5 }}
            className='table-col'
          />
        )}

        {qty && (
          <Column
            title={t('Reports.Available_quantity').toUpperCase()}
            dataIndex='available'
            key='available'
            className='table-col'
            sorter={{ multiple: 4 }}
            render={(text) => (
              <div direction='ltr'>{text && fixedNumber(text, 4)}</div>
            )}
          />
        )}

        {purchase &&
          (props.type === 'incoming' ? (
            <Column
              title={t('Taxes.Tax_rates.Purchases').toUpperCase()}
              dataIndex='purchase_price'
              key='purchase_price'
              className='table-col'
              sorter={{ multiple: 3 }}
              render={(text) => (
                <React.Fragment>{text && fixedNumber(text, 4)}</React.Fragment>
              )}
            />
          ) : (
            <Column
              title={t('Sales.1').toUpperCase()}
              dataIndex='sales_price'
              key='sales_price'
              className='table-col'
              sorter={{ multiple: 2 }}
              render={(text) => (
                <React.Fragment>{text && fixedNumber(text, 4)}</React.Fragment>
              )}
            />
          ))}

        {total && (
          <Column
            title={t('Sales.Customers.Form.Total').toUpperCase()}
            dataIndex='net_amount'
            key='net_amount'
            sorter={true}
            className='table-col'
            render={(text, record) => {
              return (
                <React.Fragment>
                  {record?.payment_summery?.net_amount &&
                    parseFloat(record?.payment_summery?.net_amount)}
                </React.Fragment>
              );
            }}
          />
        )}

        {currency && (
          <Column
            title={t(
              'Sales.Product_and_services.Inventory.Currency',
            ).toUpperCase()}
            dataIndex='currency'
            key='currency'
            sorter={true}
            render={(text) => {
              return <React.Fragment>{text?.name}</React.Fragment>;
            }}
            className='table-col'
          />
        )}
        {description && (
          <Column
            title={t('Form.Description').toUpperCase()}
            dataIndex='description'
            key='description'
            sorter={true}
            className='table-col'
          />
        )}
      </Table>
      <IncomingProductsResultTable
        baseUrl={props.baseUrl}
        type={props.type}
        columnsFilter={columnsFilter}
      />
    </>
  );
};
const styles = {
  card: { background: '#3498db', padding: '24px 20px' },
  settingsMenu: { width: '170px', paddingBottom: '10px' },
};

export default IncomingProductsTable;
