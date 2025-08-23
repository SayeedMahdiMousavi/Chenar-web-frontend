import { DownOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Table, Typography } from 'antd';
import Column from 'antd/lib/table/Column';
import { ColumnsType, Key } from 'antd/lib/table/interface';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TableSummaryCell } from '../../../../components';
import { Statistics } from '../../../../components/antd';
import { math, print } from '../../../../Functions/math';
import axiosInstance from '../../../ApiBaseUrl';
import { Colors } from '../../../colors';
import FiltersIncomeStatement from './filterIncomeStatement';

interface DataType {
  key: React.ReactNode;
  name: string;
  age: number;
  address: string;
  children?: DataType[];
}

interface IProps {
  baseUrl: string;
  title?: string;
}

const IncomeStatementDefault = (props: IProps) => {
  const [incomeStatementDefaultState, setIncomeStatementDefaultState] =
    useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);
  const { t } = useTranslation();
  const getIncomeStatementDefaultFunction = async (
    value = { startDate: '', endDate: '' },
  ) => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get(
        props?.baseUrl +
          `?date_time_after=${value?.startDate}&date_time_before=${value?.endDate}`,
      );
      // console.log("data", data);
      const allData = Object.values(data);
      setIncomeStatementDefaultState(updateTreeData(allData));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const updateTreeData = React.useCallback(
    (list: any[]) => {
      const newList = list?.slice(1);
      // console.log(" newList" , newList)
      const myList = newList?.map((item) => {
        const nweChild = Object?.keys(item?.children)?.map((textChild) => {
          const child = item?.children?.[textChild]?.child
            ? Object.keys(item?.children?.[textChild]?.child)?.map((chi) => {
                return {
                  account: chi,
                  ...item?.children?.[textChild]?.child?.[chi],
                };
              })
            : [];
          console.log('child', child);
          return {
            ...item?.children?.[textChild],
            ...(child?.length > 0 ? { child: child } : { child: [] }),
            key: item?.children?.[textChild]?.account,
            // child:item?.children[textChild]
          };
        });

        return {
          ...item,
          child: nweChild,
          key: item?.account,
        };
      });
      console.log('myList', myList);
      return myList;

      //   return newList?.map((node) => {
      //       console.log("node " , node)
      //     if (!Array.isArray(node?.child)) {
      //       const newChild = Object.keys(node);

      //       const newItem = newChild?.map((item: any) => {

      //         if (Boolean(item?.child)) {
      //             console.log("item?.child" , item?.child)
      //           return {
      //             ...item,
      //             child: [
      //               ...item?.child,
      //               {
      //                 account: t("Sales.Customers.Form.Total"),
      //                 total: item?.total,
      //               },
      //             ],
      //           };
      //         } else {
      //           return item;
      //         }
      //       });

      //       const data = {
      //         ...node,
      //         child: [
      //           ...newItem,
      //           { account: t("Sales.Customers.Form.Total"), total: node?.total },
      //         ],
      //       };

      //       return data;
      //       // return []
      //     } else {
      //       const data = {
      //         ...node,
      //         child: [
      //           ...node?.child,
      //           { account: t("Sales.Customers.Form.Total"), total: node?.total },
      //         ],
      //       };

      //       return data;
      //     }
      //   });
    },
    [t],
  );
  useEffect(() => {
    if (!incomeStatementDefaultState) {
      getIncomeStatementDefaultFunction();
    }
  }, [incomeStatementDefaultState]);

  //expand table row
  const handleExpandedRowsChange = (expandedRowKeys: Key[]) => {
    setExpandedRowKeys(expandedRowKeys);
    // console.log("expandedRowKeys", expandedRowKeys);
  };
  //   console.log("incomeStatementDefaultState" , incomeStatementDefaultState)

  const columns: ColumnsType<DataType> = [
    {
      title: t('Banking.Form.Account_name'),
      dataIndex: 'account',
      key: 'account',
      width: '50%',
      render: (text, record: any) => {
        // console.log("record", record);
        return (
          <span>
            {text
              ? text
              : record?.account
                ? record?.account
                : Object?.keys(record?.total)?.[0]}
          </span>
        );
      },
    },
    {
      title: t('Sales.Customers.Form.Amount'),
      dataIndex: 'total',
      key: 'total',
      width: '30%',
      // render:((total:any) => {
      //   let tot = 0
      //   Object?.keys(total)?.map((item) => {
      //           tot += parseFloat(total?.[item])
      //   })
      //   return <span>
      //       {
      //           tot
      //       //     //@ts-ignore
      //       // print(math?.evaluate(`${tot}`))
      //       }

      //   </span>
      // })
      render: (total: any) => {
        return (
          <div>
            {Object?.keys(total)?.length > 0 &&
              Object?.keys(total)?.map((item) => {
                return (
                  <div
                    key={total?.[item] + item}
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span> {total?.[item].toFixed(2)}</span>
                    <span>{item} </span>
                  </div>
                );
              })}
          </div>
        );
      },
    },
    // {
    //   title: t("Sales.Product_and_services.Currency.1"),
    //   dataIndex: 'total',
    //   key: 'total',
    //   width: '20%',
    //   render:((total:any) => {
    //     // let tot = 0
    //     // Object?.keys(total)?.map((item) => {
    //     //         tot += parseFloat(total?.[item])
    //     // })
    //     return <span>
    //         {
    //             // tot
    //         //     //@ts-ignore
    //         // print(math?.evaluate(`${tot}`))
    //         }
    //         {Object?.keys(total)?.length > 0 ? t(`Reports.${Object.keys(total)?.[0]}`) : ""}
    //     </span>
    //   })
    // },
  ];
  const handleSetFilter = (value: any) => {
    console.log('values', value);
    getIncomeStatementDefaultFunction(value);
  };
  const handleResetFilter = () => {
    getIncomeStatementDefaultFunction();
  };

  return (
    <>
      {/* <Typography style={{padding:"20px 0 10px 0"}}>{props?.title}</Typography> */}
      <FiltersIncomeStatement
        sentFilterDate={handleSetFilter}
        onResetFunction={handleResetFilter}
      />
      <Table
        columns={columns}
        pagination={false}
        // rowSelection={{ ...rowSelection, checkStrictly }}
        dataSource={incomeStatementDefaultState}
        childrenColumnName='child'
        expandIcon={({ expanded, onExpand, record, expandable }) => {
          return !expandable ? null : expanded ? (
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
          );
        }}
        // summary={(pageData) => {
        //   // const total = pageData?.reduce((sum, item:any) => {

        //   // sum +=  item?.total?.[Object.keys(item?.total)?.[0]]
        //   //   return print(
        //   //     //@ts-ignore
        //   //     math?.evaluate(
        //   //       `${sum}+${item?.total?.[Object.keys(item?.total)?.[0]]}`
        //   //     )
        //   //   );
        //   // }, 0);
        //   // const total = pageData?.reduce((sum, item: any) => {
        //   //   console.log("item total sum", item);
        //   //   // return sum + Object?.keys(item?.total)?.length > 0 ? item?.total?.[Object?.keys(item?.total)?.[0]] : 0
        //   //   return (
        //   //     sum +
        //   //     (Object?.keys(item?.total)?.length > 0
        //   //       ? item?.total?.[Object?.keys(item?.total)?.[0]]
        //   //       : 0)
        //   //   );
        //   // }, 0);
        //   let allTotal: any = {};
        //   pageData?.map((item: any) => {
        //     Object.keys(item?.total)?.map((tot) => {
        //       allTotal = {
        //         ...allTotal,
        //         [tot]: allTotal?.[tot]
        //           ? allTotal?.[tot] + item?.total?.[tot]
        //           : item?.total?.[tot],
        //       };
        //     });
        //   });
        //   console.log("allTotal", allTotal);
        //   return (
        //     <>
        //       <Table.Summary.Row>
        //         <TableSummaryCell index={0} color={Colors.primaryColor}>
        //           {t("Sales.Customers.Form.Total")}
        //         </TableSummaryCell>
        //         <Table.Summary.Cell index={1}>
        //           {Object?.keys(allTotal)?.length > 0 &&
        //             Object?.keys(allTotal)?.map((item: string) => {
        //               return (
        //                 <div
        //                   key={item}
        //                   style={{
        //                     display: "flex",
        //                     justifyContent: "space-between",
        //                   }}
        //                 >
        //                   <span> {allTotal?.[item].toFixed(2)}</span>
        //                   <span>{item} </span>
        //                 </div>
        //               );
        //             })}
        //         </Table.Summary.Cell>

        //         {/* <TableSummaryCell
        //           index={1}
        //           // value={total}
        //           type="total"
        //           color={Colors.primaryColor}
        //         >
        //           {Object?.keys(allTotal)?.length > 0 &&
        //             Object?.keys(allTotal)?.map((item: string) => {
        //               return (
        //                 <div
        //                   key={item}
        //                   style={{
        //                     display: "flex",
        //                     justifyContent: "space-between",
        //                   }}
        //                 >
        //                   <span> {allTotal?.[item]}</span>
        //                   <span>{item} </span>
        //                 </div>
        //               );
        //             })}
        //         </TableSummaryCell> */}
        //       </Table.Summary.Row>
        //     </>
        //   );
        // }}
        loading={isLoading ? true : false}
      />
    </>
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
export default IncomeStatementDefault;
