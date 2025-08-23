import React, { Fragment, useEffect, useState } from 'react';
//@ts-ignore
import moment from 'moment';
// import { connect } from "react-redux";
import axiosInstance from '../../../ApiBaseUrl';
import { useQuery } from 'react-query';
// import withObservables from "@nozbe/with-observables";
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
// import { Q } from "@nozbe/watermelondb";

// import Filters from "../sales/Products/Units/Filters";
import { DownOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';

import { Table, Menu, Typography, Checkbox, Button } from 'antd';
// import Table from "rc-table";
import { useTranslation } from 'react-i18next';
import { utcDate } from '../../../../Functions/utcDate';
import useGetRunningPeriod from '../../../../Hooks/useGetRunningPeriod';
import { Colors } from '../../../colors';
import { Key } from 'antd/lib/table/interface';
import { reportsDateFormat } from '../../../../Context';

const { Column } = Table;
// const { Search } = Input;
interface IProps {
  baseUrl: string;
  place: string;
}
const dateFormat = reportsDateFormat;
const IncomeStatementsTable: React.FC<IProps> = (props) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [balanceSheetResult, setBalanceSheetResult] = useState<any[]>([]);
  const { t } = useTranslation();

  const [{ currency, calCurrency, details }, setColumns] = useState({
    currency: true,
    calCurrency: false,
    details: true,
  });
  const [page, setPage] = React.useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [search, setSearch] = useState<string>('');

  const [order, setOrder] = useState('-id');

  const [{ startDate, endDate }, setFilters] = useState({
    startDate: '',
    endDate: utcDate().format(dateFormat),
  });

  //expand table row
  const handleExpandedRowsChange = (expandedRowKeys: Key[]) => {
    setExpandedRowKeys(expandedRowKeys);
  };

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

  //setting drop
  // const handleVisibleChange = (flag: boolean) => {
  //   setVisible((prev) => {
  //     return { ...prev, visible: flag };
  //   });
  // };

  //filters
  // const menu = <Filters setStatus1={setStatus1} setVisible={setVisible} />;

  // const handleVisibleChangFilter = (flag:boolean) => {
  //   setVisible((prev)=>{
  //       return {...prev, visibleFilter: flag }
  //   });

  // };

  //setting checkbox
  const onChangeCurrency = () =>
    setColumns((prev) => {
      return { ...prev, currency: !currency };
    });

  const onChangeDetails = () => {
    setColumns((prev) => {
      return { ...prev, details: !details };
    });
  };

  const onChangeCalCurrency = () => {
    setColumns((prev) => {
      return { ...prev, calCurrency: !calCurrency };
    });
  };

  const setting = (
    <Menu style={styles.settingsMenu}>
      <Menu.Item key='1'>
        <Typography.Text strong={true}>
          {t('Sales.Product_and_services.Columns')}
        </Typography.Text>
      </Menu.Item>
      <Menu.Item key='1'>
        <Checkbox defaultChecked onChange={onChangeCurrency}>
          {t('Sales.Customers.Receive_cash.Paid_currency')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='2'>
        <Checkbox defaultChecked onChange={onChangeDetails}>
          {t('Sales.Customers.Receive_cash.Receive_details')}
        </Checkbox>
      </Menu.Item>
      {(props.place === 'recordSalaries' ||
        props.place === 'customerPayAndRecCash' ||
        props.place === 'employeePayAndRecCash' ||
        props.place === 'supplierPayAndRecCash') && (
        <Menu.Item key='3'>
          <Checkbox onChange={onChangeCalCurrency}>
            {t('Sales.Customers.Receive_cash.Calculate_currency')}
          </Checkbox>
        </Menu.Item>
      )}
    </Menu>
  );

  const handleGetIncomeStatement = React.useCallback(
    // @ts-ignore
    async ({ queryKey }) => {
      const { search, startDate, endDate } = queryKey?.[1];
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?search=${search}&date_time_after=${startDate}&date_time_before=${endDate}`,
      );
      return data;
    },
    [props.baseUrl],
  );

  const {
    isLoading,
    isFetching,
    data,
    // isPreviousData,
    // isFetching,
  } = useQuery(
    [props.baseUrl, { search, startDate, endDate }],
    handleGetIncomeStatement,
    { cacheTime: 0 },
  );

  //pagination
  const paginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };
  const onPageSizeChange = (current: number, size: number) => {
    setPageSize(size);
    setPage(current);
  };

  const onChangeTable = (pagination: any, filters: any, sorter: any) => {
    //
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
    showTotal: (total: number) =>
      `${t('Pagination.Total')} ${total} ${t('Pagination.Item')}`,
    // size: isMobile ? "small" : "default",
    showQuickJumper: true,
    showSizeChanger: true,
    responsive: true,
    showLessItems: true,
  };

  //row selection
  const onSelectChange = (selectedRowKeys: any) => {
    setSelectedRowKeys(selectedRowKeys);
    // this.setState({ selectedRowKeys });
  };

  let active = false;
  const onSelectRow = async (record: any, selected: boolean) => {
    //
    if (active) {
      return;
    }
    active = true;

    try {
      // mutateActive(
      //   {value :{is_active: selected},symbol:record.symbol }
      // );

      active = false;
    } catch (info) {
      //
      active = false;
    }
  };
  const rowSelection = {
    selectedRowKeys,
    // columnWidth:80,
    onChange: onSelectChange,
    onSelect: onSelectRow,
    getCheckboxProps: (record: any) => ({
      disabled: record.is_base === true, // Column configuration not to be checked
      name: record.name,
    }),
  };

  const updateTreeData = React.useCallback(
    (list: any[]) => {
      return list?.map((node) => {
        if (!Array.isArray(node?.child)) {
          const newChild = Object.values(node?.child);
          const newItem = newChild?.map((item: any) => {
            if (Boolean(item?.child)) {
              return {
                ...item,
                child: [
                  ...item?.child,
                  {
                    account: t('Sales.Customers.Form.Total'),
                    total: item?.total,
                  },
                ],
              };
            } else {
              return item;
            }
          });

          const data = {
            ...node,
            child: [
              ...newItem,
              { account: t('Sales.Customers.Form.Total'), total: node?.total },
            ],
          };

          return data;
        } else {
          const data = {
            ...node,
            child: [
              ...node?.child,
              { account: t('Sales.Customers.Form.Total'), total: node?.total },
            ],
          };

          return data;
        }
      });
    },
    [t],
  );

  useEffect(() => {
    if (data) {
      if (props.place === 'balanceSheet') {
        const allData = Object.values(data);
        const dataSource = updateTreeData(allData);
        const total = allData?.reduce((sum: number, item: any) => {
          return sum + parseFloat(item?.total);
        }, 0);
        setDataSource(dataSource);
        setBalanceSheetResult([
          {
            account: data?.assets?.account,
            total: t('Reports.Capital_and_credit'),
          },
          {
            account: data?.assets?.total,
            total: total - parseFloat(data?.assets?.total),
          },
        ]);
      } else {
        const dataSource = updateTreeData(data?.child);
        // const expandedRowKeys = data?.child?.map(
        //   (node: { name: string }) => node?.name
        // );
        // setExpandedRowKeys(expandedRowKeys);
        setDataSource(dataSource);
      }
    }
  }, [data, props.place, updateTreeData]);
  // const balanceSheetData = [
  //   {
  //     name: "assets",
  //     total: 1000,
  //     child: [
  //       {
  //         name: "Fixed Asset",
  //         total: 400,
  //         child: [
  //           {
  //             account: "Book",
  //             total: 150,
  //             cur: "افغانی",
  //           },
  //           {
  //             account: "Apple",
  //             total: 250,
  //             cur: "افغانی",
  //           },
  //         ],
  //       },
  //       {
  //         name: "Current Assets",
  //         total: 600,
  //         child: [
  //           {
  //             account: "cash",
  //             total: 300,
  //             cur: "افغانی",
  //           },
  //           {
  //             account: "bank",
  //             total: 300,
  //             cur: "افغانی",
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     name: "capital",
  //     total: 700,
  //     child: [
  //       {
  //         name: "Initial Capital",
  //         total: 300,
  //       },
  //       {
  //         name: "second Capital",
  //         total: 300,
  //       },
  //     ],
  //   },
  //   {
  //     name: "liabilities",
  //     total: 200,
  //     child: [],
  //   },
  //   {
  //     name: "Income Statement",
  //     total: 100,
  //     child: [
  //       {
  //         name: "Current Profit ",
  //         total: 100,
  //       },
  //     ],
  //   },
  // ];

  return (
    <Fragment>
      <Table
        loading={isLoading || isFetching ? true : false}
        onChange={onChangeTable}
        size='middle'
        tableLayout='auto'
        // rowSelection={rowSelection}
        childrenColumnName='child'
        defaultExpandAllRows={true}
        rowKey={(record: any) => record?.name || record?.account}
        //@ts-ignore
        pagination={false}
        dataSource={dataSource}
        bordered={false}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true }}
        // title={() => {
        //   return (
        //     <Row className="num">
        //       <Col
        //         xl={{ span: 7 }}
        //         lg={{ span: 9 }}
        //         md={{ span: 10 }}
        //         sm={{ span: 11 }}
        //         xs={{ span: 14 }}
        //         className="table__header1"
        //       >
        //         <Row>
        //           <Col md={18} sm={{ span: 17 }} xs={{ span: 17 }}>
        //             <SearchInput
        //               setPage={setPage}
        //               placeholder={t("Form.Search")}
        //               setSearch={setSearch}
        //             />
        //           </Col>
        //           <Col
        //             md={{ span: 3, offset: 2 }}
        //             sm={{ span: 4, offset: 2 }}
        //             xs={{ span: 4, offset: 2 }}
        //           ></Col>
        //         </Row>
        //       </Col>

        //       <Col
        //         xl={{ span: 2, offset: 15 }}
        //         lg={{ span: 3, offset: 12 }}
        //         md={{ span: 3, offset: 11 }}
        //         sm={{ span: 4, offset: 19 }}
        //         xs={{ span: 6, offset: 4 }}
        //         className="table__header2"
        //       >
        //         <Space size={12}>
        //           {/* <PrinterOutlined className="table__header2-icon" />

        //           <Dropdown
        //             overlay={setting}
        //             trigger={["click"]}
        //             onOpenChange={handleVisibleChange}
        //             open={visible}
        //           >
        //             <a className="ant-dropdown-link" href="#">
        //               <SettingOutlined className="table__header2-icon" />
        //             </a>
        //           </Dropdown> */}
        //         </Space>
        //       </Col>
        //     </Row>
        //   );
        // }}

        expandedRowKeys={expandedRowKeys}
        onExpandedRowsChange={handleExpandedRowsChange}
        expandIcon={({ expanded, onExpand, record, expandable }) =>
          !expandable ? null : expanded ? (
            <Button
              icon={<DownOutlined />}
              size='small'
              type='primary'
              className='treeTable__expandIcon'
              onClick={(e) => onExpand(record, e)}
              style={styles.expandButtonDown}
            />
          ) : (
            <Button
              icon={t('Dir') === 'ltr' ? <RightOutlined /> : <LeftOutlined />}
              size='small'
              type='primary'
              className='treeTable__expandIcon'
              onClick={(e) => onExpand(record, e)}
              style={styles.expandButton}
            />
          )
        }
        summary={(pageData) => {
          if (props.place === 'balanceSheet') {
            return (
              <>
                {balanceSheetResult?.length > 0 && (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>
                      <Typography.Text type='danger' strong={true}>
                        {t('Sales.Customers.Form.Balance')}
                      </Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Typography.Text
                        type='danger'
                        strong={true}
                      ></Typography.Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                )}
                {balanceSheetResult?.map((item, index) => (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>
                      <Typography.Text type='danger' strong={true}>
                        {item?.account}
                      </Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Typography.Text type='danger' strong={true}>
                        {item?.total}
                      </Typography.Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                ))}
              </>
            );
          }
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>
                  <Typography.Text type='danger' strong={true}>
                    {data?.name}
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Typography.Text type='danger' strong={true}>
                    {data?.total_profit}
                  </Typography.Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      >
        {/* <Column
              title={t("Table.Row").toUpperCase()}
              dataIndex="serial"
              key="serial"
              width={80}
              className="table-col"
              fixed="left"
              align="center"
            /> */}

        <Column
          title={`${t('Form.Name').toUpperCase()}`}
          dataIndex='name'
          key='name'
          // sorter={true}
          className='table-col'
          render={(text: any, record: any) => {
            return (
              <>
                {text ? (
                  text
                ) : record?.account === t('Sales.Customers.Form.Total') ? (
                  <span style={{ color: Colors.primaryColor }}>
                    {record?.account}
                  </span>
                ) : (
                  record?.account
                )}
              </>
            );
          }}
        />
        {/* <Column
              title={`${t("Form.Description").toUpperCase()}`}
              dataIndex="description"
              key="description"
              sorter={true}
              className="table-col"
            /> */}

        <Column
          title={t('Sales.Customers.Form.Amount').toUpperCase()}
          dataIndex='total'
          key='total'
          // sorter={true}
          render={(text: any, record: any) => {
            var num = parseFloat(text);
            return (
              <>
                {
                  // "name" in record ? (
                  //   expandedRowKeys?.includes(record?.name) ? (
                  //     ""
                  //   ) : (
                  //     num
                  //   )
                  // ) :
                  record?.account === t('Sales.Customers.Form.Total') ? (
                    <span style={{ color: Colors.primaryColor }}>{num}</span>
                  ) : expandedRowKeys?.includes(
                      record?.account || record?.name,
                    ) ? (
                    ''
                  ) : (
                    num
                  )
                }
              </>
            );
          }}
          className='table-col'
        />

        {/* <Column
              title={t(
                "Sales.Product_and_services.Inventory.Currency"
              ).toUpperCase()}
              dataIndex="cur"
              key="cur"
              sorter={true}
              className="table-col"
            /> */}
      </Table>
    </Fragment>
  );
};
const styles = {
  settingsMenu: { minWidth: '130px', paddingBottom: '10px' },
  firstRow: { paddingInlineStart: '1rem' },
  firstRow1: (level: string) => ({
    paddingInlineStart:
      level === 'A' ? '1.5rem' : level === 'B' ? '2.5rem' : '3.5rem',
    margin: '0px',
  }),
  expandButton: {
    borderEndEndRadius: '30px',
    borderStartEndRadius: '30px',
  },
  expandButtonDown: {
    borderEndEndRadius: '30px',
    borderEndStartRadius: '30px',
  },
};

export default IncomeStatementsTable;
