import React, { Fragment, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import axiosInstance from '../../../ApiBaseUrl';
import { useQuery } from 'react-query';
import { DownOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Table, Button, Collapse } from 'antd';
import { useTranslation } from 'react-i18next';
import { utcDate } from '../../../../Functions/utcDate';
import useGetRunningPeriod from '../../../../Hooks/useGetRunningPeriod';
import { Colors } from '../../../colors';
import { Key } from 'antd/lib/table/interface';
import { reportsDateFormat } from '../../../../Context';
import { Statistics } from '../../../../components/antd';
import { fixedNumber, math, print } from '../../../../Functions/math';
import { TableSummaryCell } from '../../../../components';
import CollapsePanel from 'antd/lib/collapse/CollapsePanel';

const { Column } = Table;
interface IProps {
  baseUrl: string;
  place: string;
}
const dateFormat = reportsDateFormat;
const IncomeStatementsTable: React.FC<IProps> = ({ baseUrl, place }) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [balanceSheetResult, setBalanceSheetResult] = useState<any[]>([]);
  const [incomeStatementTotal, setIncomeStatementTotal] = useState<number>(0);
  const [mainBalanceDataState, setMainBalanceDataState] = useState<any[]>([]);

  const { t } = useTranslation();

  const [{ startDate, endDate }, setFilters] = useState({
    startDate: '',
    endDate: utcDate().format(dateFormat),
  });

  //expand table row
  const handleExpandedRowsChange = (expandedRowKeys: Key[]) => {
    setExpandedRowKeys(expandedRowKeys);
    console.log('expandedRowKeys', expandedRowKeys);
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

  const handleGetIncomeStatement = React.useCallback(
    //@ts-ignore
    async ({ queryKey }) => {
      const { startDate, endDate } = queryKey?.[1];
      const { data } = await axiosInstance.get(
        `${baseUrl}?date_time_after=${startDate}&date_time_before=${endDate}`,
      );
      return data;
    },
    [baseUrl],
  );

  const {
    isLoading,
    isFetching,
    data,
    // isPreviousData,
    // isFetching,
  } = useQuery([baseUrl, { startDate, endDate }], handleGetIncomeStatement, {
    cacheTime: 0,
  });

  const updateTreeData = React.useCallback(
    (list: any[]) => {
      const newList = list?.slice(1);
      return newList?.map((node) => {
        if (!Array.isArray(node?.child)) {
          // console.log("node " , node)
          const newChild = Object.keys(node);

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
          // return []
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
  const updateIncomeStatementData = React.useCallback(
    (list: any[]) => {
      return list?.map((node) => {
        if (!Array.isArray(node?.child)) {
          const newItem = node?.child?.map((item: any) => {
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

  const createObject = (object: any) => {
    let newChild;
    if (object) {
      newChild = Object?.keys(object)?.map((child: any) => {
        return {
          account: object[child]?.account,
          total: object[child]?.total,
          ...(object[child]?.children
            ? { children: object?.[child]?.children }
            : {}),
          ...(object[child]?.child ? { children: object?.[child]?.child } : {}),
        };
      });
    }
    return newChild;
  };
  const createTreeBalanceMain = () => {
    if (data) {
      // console.log("data" , data)
      const mainData = Object?.keys(data)?.map((item: string) => {
        let child = [];

        let createNew: any = data[item];
        while (createNew?.children) {
          if (createNew?.children) {
            // console.log("createObject" , createObject(createNew?.children))
            child.push(createObject(createNew?.children)?.[0]);
            createNew = createObject(createNew?.children);
            // }else if (createNew?.child){
            //   // console.log("no children" , createNew)
            //   child.push(createObject(createNew?.child))
            // }else{
            //   // console.log("createObject(createNew)" , createObject(createNew))
            //   child.push(createObject(createNew))
            // }
            // console.log("createNew" , createNew)
          } else {
            createNew = createNew?.child;
            child.push(createObject(createNew?.child)?.[0]);
          }
        }
        // console.log("child" , child)

        // const children = data?.[item]?.children
        // let newChild
        // if (children){
        //    newChild = Object?.keys(children).map((child:any) => {
        //    console.log("child" , children[child])
        //    return {
        //     title:children[child]?.account,
        //     total:children[child]?.total
        //    }
        //   })

        // }
        return {
          account: data?.[item]?.account,
          total: data?.[item]?.total,
          children: child,
        };
      });
      setMainBalanceDataState(mainData?.slice(1));
      // console.log("mainData" , mainData?.slice(1))
    }
  };

  useEffect(() => {
    createTreeBalanceMain();
  }, [data]);
  useEffect(() => {
    if (data) {
      if (place === 'fiscalYearIncome') {
      } else if (place === 'balanceSheet') {
        const allData = Object.values(data);
        const dataSource = updateTreeData(allData);
        setDataSource(dataSource);
      } else {
        const dataSource = updateIncomeStatementData(Object.values(data));
        const incomeStatementAmount = fixedNumber(
          print(
            //@ts-ignore
            math.evaluate(
              `(${data?.gross_profit?.total ?? 0} + ${
                data?.income?.total ?? 0
              }) - ${data?.expense?.total ?? 0}`,
            ),
          ),
        );

        setIncomeStatementTotal(incomeStatementAmount);
        setDataSource(dataSource);
      }
    }
  }, [data, place, updateTreeData, t, updateIncomeStatementData]);

  // console.log("datasurse" , dataSource)
  const columns = useMemo(
    () => (type: string) => (
      <Fragment>
        <Column
          title={
            place !== 'balanceSheet'
              ? t('Banking.Form.Account_name')
              : type === 'assets'
                ? t('Assets')
                : t('Reports.Capital_and_credit').toUpperCase()
          }
          dataIndex='name'
          key='name'
          width='50%'
          // sorter={true}
          className='table-col'
          render={(text: any, record: any, index) => {
            //  if (!record?.account){
            //   console.log( "record" , record , "dataSource" , dataSource , "index" , index)
            //  }

            return (
              <>
                {
                  text ? (
                    text
                  ) : record?.account === t('Sales.Customers.Form.Total') ? (
                    <span style={{ color: Colors.primaryColor }}>
                      {record?.account}
                    </span>
                  ) : (
                    record?.account
                  )
                  //  ? (
                  //   record?.account
                  // ) : type === "capital" ? (
                  //   index
                  // ) : (

                  //   Object?.keys(dataSource?.[0]?.total ? dataSource?.[0]?.total : {} )?.length > 0 && Object?.keys(dataSource?.[0]?.total)?.map((item, ind) => {
                  //     if (index === ind) {
                  //       // return dataSource?.[0]?.total?.[item]
                  //       return item;
                  //     } else return "";
                  //   })
                  // )
                }
              </>
            );
          }}
        />
        <Column
          title={t('Sales.Customers.Form.Amount')}
          dataIndex='total'
          key='total'
          width='50%'
          // sorter={true}
          render={(text: any, record: any) => {
            var num = parseFloat(text?.[Object.keys(text)?.[0]]);

            if (!expandedRowKeys?.includes(record?.account)) {
              console.log('text', text, 'sum', num, 'record', record);
            }

            return (
              <>
                {text ? (
                  text
                ) : record?.account === t('Sales.Customers.Form.Total') ? (
                  <Statistics value={num} color={Colors.primaryColor} />
                ) : expandedRowKeys?.includes(record?.account) ? (
                  ''
                ) : (
                  <Statistics value={num} />
                )}
              </>
            );
          }}
          className='table-col'
        />
      </Fragment>
    ),
    [expandedRowKeys, place, t],
  );

  const fiscalYearData = [data?.total_profit ?? {}];

  // console.log("dataSource ", dataSource);
  return (
    <Fragment>
      <Table
        loading={isLoading || isFetching ? true : false}
        size='small'
        tableLayout='auto'
        // rowSelection={rowSelection}
        childrenColumnName='child'
        defaultExpandAllRows={true}
        rowKey={(record: any) => {
          return record?.name || record?.account;
        }}
        //@ts-ignore
        pagination={false}
        dataSource={
          place === 'balanceSheet'
            ? //@ts-ignore
              dataSource?.[0]?.child
            : place === 'fiscalYearIncome'
              ? fiscalYearData
              : dataSource
        }
        bordered={false}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true }}
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
        summary={
          place === 'balanceSheet'
            ? undefined
            : (pageData) => {
                // console.log("pageData" , pageData)
                if (place === 'balanceSheet') {
                  return (
                    <>
                      {balanceSheetResult?.length > 0 && (
                        <Table.Summary.Row>
                          <TableSummaryCell index={0}>
                            {t('Sales.Customers.Form.Balance')}
                          </TableSummaryCell>
                          <TableSummaryCell index={1}></TableSummaryCell>
                        </Table.Summary.Row>
                      )}
                      {balanceSheetResult?.map((item, index) => (
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0}>
                            {item?.account}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1}>
                            {item?.total}
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      ))}
                    </>
                  );
                }
                return (
                  <>
                    <Table.Summary.Row>
                      <TableSummaryCell index={0}>
                        {t('Sales.Customers.Form.Total')}
                      </TableSummaryCell>

                      <TableSummaryCell
                        index={1}
                        type='total'
                        value={
                          place === 'fiscalYearIncome'
                            ? data?.total_profit?.total
                            : incomeStatementTotal
                        }
                      />
                    </Table.Summary.Row>
                  </>
                );
              }
        }
      >
        {columns('assets')}
      </Table>
      {place === 'balanceSheet' && (
        <Table
          loading={isLoading || isFetching ? true : false}
          size='small'
          tableLayout='auto'
          // rowSelection={rowSelection}
          childrenColumnName='child'
          defaultExpandAllRows={true}
          rowKey={(record: any) => record?.name || record?.account}
          //@ts-ignore
          pagination={false}
          dataSource={dataSource?.slice(
            1,
            10,
          )
          // mainBalanceDataState
          }
          bordered={false}
          scroll={{ x: 'max-content', scrollToFirstRowOnChange: true }}
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
            // if (place === "balanceSheet") {
            //   return (
            //     <>
            //       {balanceSheetResult?.length > 0 && (
            //         <Table.Summary.Row>
            //           <Table.Summary.Cell index={0}>
            //             <Typography.Text type="danger" strong={true}>
            //               {t("Sales.Customers.Form.Balance")}
            //             </Typography.Text>
            //           </Table.Summary.Cell>
            //           <Table.Summary.Cell index={1}>
            //             <Typography.Text
            //               type="danger"
            //               strong={true}
            //             ></Typography.Text>
            //           </Table.Summary.Cell>
            //         </Table.Summary.Row>
            //       )}
            //       {balanceSheetResult?.map((item, index) => (
            //         <Table.Summary.Row>
            //           <Table.Summary.Cell index={0}>
            //             <Typography.Text type="danger" strong={true}>
            //               {item?.account}
            //             </Typography.Text>
            //           </Table.Summary.Cell>
            //           <Table.Summary.Cell index={1}>
            //             <Typography.Text type="danger" strong={true}>
            //               {item?.total}
            //             </Typography.Text>
            //           </Table.Summary.Cell>
            //         </Table.Summary.Row>
            //       ))}
            //     </>
            //   );
            // }
            const total = pageData?.reduce((sum, item) => {
              return print(
                //@ts-ignore
                math?.evaluate(
                  `${sum}+${item?.total?.[Object.keys(item?.total)?.[0]]}`,
                ),
              );
              // return 10
            }, 0);

            return (
              <>
                <Table.Summary.Row>
                  <TableSummaryCell index={0} color={Colors.primaryColor}>
                    {t('Sales.Customers.Form.Total')}
                  </TableSummaryCell>
                  <TableSummaryCell
                    index={1}
                    value={total}
                    type='total'
                    color={Colors.primaryColor}
                  />
                </Table.Summary.Row>
              </>
            );
          }}
        >
          {columns('capital')}
        </Table>
      )}
      {/* <Collapse defaultActiveKey={['1']} 
      // onChange={onChange}
      >

{mainBalanceDataState?.map((item) => {
  console.log("item" ,  item)
  return(
    <CollapsePanel header={item?.title} key={item?.title} showArrow>
        <div>
          {Object.keys(item?.total)?.map((tota) => {
            return (
              <div style={{display:"grid" , gridTemplateColumns:"50% 50%" }}>

                <div>{tota}</div>
                <div>{item?.total?.[tota]}</div>
              </div>
            )
          })}
        </div>
        {
          CollapsePanel
        }
      </CollapsePanel>
  )
})}
    </Collapse> */}
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
