import React, {
  Fragment,
  JSX,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  useMemo,
  useState,
} from "react";
import {
  Col,
  Row,
  Table,
  Popover,
  Space,
  Select,
  Typography,
  Dropdown,
  Button,
  Alert,
} from "antd";
import { SearchInput } from "../../pages/SelfComponents/SearchInput";
import { useTranslation } from "react-i18next";
//@ts-ignore
import { useQuery, useQueryClient, QueryFunction } from "react-query";
import { Key, TablePaginationConfig } from "antd/lib/table/interface";
import {
  FilterOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import ReloadButton from "../buttons/ReloadButton";
import PrintButton from "../../pages/SelfComponents/PrintButton";

import TableError from "./TableError";
import TableLoading from "../TableLoading";
import { checkPermissions } from "../../Functions";

const { Column } = Table;
const { Option } = Select;
const { Text } = Typography;

interface Record {
  status: string | boolean;
  id: string;
  symbol: string;
}

interface IProps {
  title?: string;
  type?: string;
  model: string;
  columns: (type: string, hasSelected: boolean) => ReactNode;
  printIcon?: null | ReactNode;
  placeholder?: string | undefined;
  queryKey: string;
  rowSelection?: object;
  rowSelectable?: boolean;
  handleGetData: QueryFunction<any, any[]>;
  filters?: any;
  filterNode?: (
    setPage: (value: number) => void,
    setVisible: (value: boolean) => void
  ) => ReactNode;
  settingMenu?: ReactElement<any, string | JSXElementConstructor<any>>;
  onRow?: any;
  header?: boolean | ReactNode | undefined;
  summary?: (value: any) => ReactNode;
  resultDomColumns?: ReactElement<any, any>;
  selectResult?: boolean;
  resultDataSource?: {}[];
  resultLoading?: boolean;
  setSelectResult?: (value: boolean) => void;
  batchAction?: (
    selectedRowKeys: Key[],
    setSelectedRowKeys: (value: Key[]) => void,
    selectedRows: any[],
    setSelectedRows: (value: any[]) => void,
    columns: (type: string, hasSelected: boolean) => JSX.Element
  ) => ReactNode;
  search?: number | string;
  setSearch?: (value: number | string) => void;
}

export function PaginateTable(props: IProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [visibleFilter, setFilterVisible] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(
    props?.type === "currency" ? 10 : 5
  );
  const [search1, setSearch1] = useState<string | number>("");
  const [order, setOrder] = useState("-id");

  const search = props?.search ? props?.search : search1;
  const setSearch = props?.setSearch ? props?.setSearch : setSearch1;

  //setting
  const handleChangeSettingVisible = (flag: boolean) => {
    setSettingVisible(flag);
  };

  const {
    data,
    isFetching,
    isLoading,
    status,
    error,
    refetch,
    isRefetchError,
  } = useQuery(
    [props.queryKey, { page, pageSize, search, order, ...props.filters }],
    props.handleGetData
  );

  const hasMore = Boolean(data?.nextPageNumber);

  React.useEffect(() => {
    if (hasMore && !isFetching) {
      queryClient.prefetchQuery(
        [
          props.queryKey,
          { page: page + 1, pageSize, search, order, ...props.filters },
        ],
        props.handleGetData
      );
    }
  }, [
    page,
    pageSize,
    search,
    order,
    props.queryKey,
    props.handleGetData,
    props.filters,
    hasMore,
    queryClient,
    isFetching,
  ]);

  const onChangeTable = (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => {
    if (sorter?.[0]) {
      const order = sorter?.reduce((sum: string, item: any, index: number) => {
        if (item.order === "ascend") {
          return `${sum}${index !== 0 ? "," : ""}${item.field}`;
        } else if (item.order === "descend") {
          return `${sum}${index !== 0 ? "," : ""}-${item.field}`;
        } else {
          return sum;
        }
      }, "");
      setOrder(order);
    } else {
      if (sorter.order === "ascend") {
        setOrder(sorter.field);
      } else if (sorter.order === "descend") {
        setOrder(`-${sorter.field}`);
      } else {
        setOrder(`-id`);
      }
    }
  };

  //pagination
  const paginationChange = (page: number, pageSize: number | undefined) => {
    setPage(page);
    setPageSize(pageSize!);
  };

  const count: number = data?.count;

  const pagination: false | TablePaginationConfig | undefined = {
    total: count,
    // pageSizeOptions: ["5", "10", "20", "50"],
    onShowSizeChange: paginationChange,
    // defaultPageSize: 5,
    current: page,
    pageSize: pageSize,
    defaultCurrent: 1,
    onChange: paginationChange,
    // showTotal: (total: number) =>
    //   `${t("Pagination.Total")} ${total} ${t("Pagination.Item")}`,
    size: "small",
    showQuickJumper: true,
    showSizeChanger:true,
    responsive: true,
    showLessItems: true,
    hideOnSinglePage: true,
  };

  //select rows
  const hasSelected = selectedRowKeys.length > 0;

  const onSelectChange = (selectedRowKeys: Key[], selectedRows: object[]) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
    getCheckboxProps: (record: Record) => ({
      disabled: record.status === "deactivate" || record.status === false, // Column configuration not to be checked
    }),
    ...props?.rowSelection,
  };

  //filter
  const handleVisibleChangFilter = (flag: boolean) => {
    setFilterVisible(flag);
  };

  const setVisible = setFilterVisible;
  const menu = props.filterNode ? (
    props.filterNode(setPage, setVisible)
  ) : (
    <div></div>
  );

  //handle clean selectedKeys
  const onReload = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
    if (props.setSelectResult) {
      props.setSelectResult(false);
    }
  };


  const tableColumns = props?.columns;
  const columns = useMemo(
    () => (type: string, hasSelected: boolean) =>
      (
        <React.Fragment>
          <Column
            title={t("Table.Row").toUpperCase()}
            dataIndex="serial"
            key="serial"
            width={type !== "print" ? 80 : 40}
            className="table-col"
            align="center"
            fixed={type !== "print" ? true : false}
            render={(text, __, index) => (
              <React.Fragment>
                {type !== "print"
                  ? //@ts-ignore
                    (page - 1) * pageSize + index + 1
                  : index + 1}
              </React.Fragment>
            )}
          />

          {tableColumns && typeof tableColumns === 'function' ? tableColumns(type, hasSelected) : null}
        </React.Fragment>
      ),
    [hasSelected, page, pageSize, t, tableColumns]
  );

  //change page size
  const handleChangePageSize = (value: number) => {
    setPage((prev) => {
      const endPage = count / value;
      const result = endPage >= prev ? prev : endPage;
      return Math.ceil(result);
    });
    setPageSize(value);
  };

  const handleRetry = () => {
    refetch();
  };

  const emptyText =
    status !== "error" ? undefined : (
      <TableError error={error} handleRetry={handleRetry} />
    );

  const tableLoading = Boolean(props?.summary)
    ? isLoading || props?.resultLoading
    : isLoading;

  return (
    <Space direction="vertical" size={5}>
      <Text>
        {t("Pagination.Total")} : {count ?? 0} {t("Pagination.Item")}
      </Text>{" "}
      <Table
        onChange={onChangeTable}
        loading={tableLoading}
        size="middle"
        rowSelection={props?.rowSelectable === false ? undefined : rowSelection}
        rowKey={(record: Record) =>
          props?.type === "currency" ? record?.symbol : record.id
        }
        pagination={pagination}
        dataSource={data?.results}
        // bordered
        style={{ zIndex: 80 }}
        locale={{ emptyText: emptyText }}
        scroll={{ x: "max-content", scrollToFirstRowOnChange: true }}
        onRow={props?.onRow}
        summary={props?.summary}
        //@ts-ignore
        title={
          props.header === false
            ? undefined
            : props.header
            ? props.header
            : () => {
                return (
                  <Row align="middle">
                    <Col  style={{paddingBottom:10 }} xs={"auto"} 
                    md={7}
                      >
                    <SearchInput
                          setPage={setPage}
                          placeholder={
                            Boolean(props?.placeholder)
                              ? props?.placeholder
                              : t("Form.Search")
                          }
                          setSearch={setSearch}
                          suffix={
                            Boolean(props?.filterNode) ? (
                              <Popover
                                content={menu}
                                trigger="click"
                                placement="bottom"
                                onOpenChange={handleVisibleChangFilter}
                                open={visibleFilter}
                              >
                                <FilterOutlined />
                              </Popover>
                            ) : (
                              <SearchOutlined className="search_icon_color" />
                            )
                          }
                        />
                    </Col>
                    {(selectedRowKeys?.length > 0 ||
                          props.selectResult) && (
                            <Col style={{paddingLeft:"10px"}}
                             md={7} 
                            //  md={6}
                             >
                          <ReloadButton
                            onReload={onReload}
                            length={
                              props?.resultDataSource && props?.selectResult
                                ? selectedRowKeys?.length +
                                  props?.resultDataSource?.length
                                : selectedRowKeys?.length
                            }
                            />
                            </Col>
                        )}
                        
                        {hasSelected && Boolean(props?.batchAction) ? (
                      <Col
                        className="textAlign__end"
                       xs={24}
                      //  md={10}
                      >
                        {props?.batchAction &&
                          props?.batchAction(
                            selectedRowKeys,
                            setSelectedRowKeys,
                            selectedRows,
                            setSelectedRows,
                            columns
                          )}
                      </Col>
                    ) : (
                      <Col
                        className="textAlign__end"
                        md={selectedRowKeys?.length === 0 ? 16 : 9}
                      //  md={selectedRowKeys?.length === 0 ? 16  : 10 }
                      style={{  marginRight:"12px" , display:"flex" , justifyContent:"end"}}
                      >
                        <Space size={1} align="end">
                          {props?.rowSelectable === false ||
                          props.printIcon === null ? null : (
                            
                            <PrintButton
                              disabled={
                                selectedRowKeys?.length === 0 &&
                                (!props?.selectResult ||
                                  props?.selectResult === undefined)
                              }
                              domColumns={columns("print", hasSelected)}
                              title={props?.title}
                              dataSource={selectedRows}
                              selectResult={props?.selectResult}
                              resultDataSource={props.resultDataSource}
                              resultDomColumns={props.resultDomColumns}
                            />
                          )}
                          {Boolean(props?.settingMenu) && (
                            <Dropdown
                              //@ts-ignore
                              menu={props?.settingMenu}
                              trigger={["click"]}
                              onOpenChange={handleChangeSettingVisible}
                              open={settingVisible}
                            >
                              <Button
                                icon={<SettingOutlined />}
                                type="link"
                                shape="circle"
                                style={styles.settingButton}
                              />
                            </Dropdown>
                          )}
                        </Space>
                      </Col>
                    )}
                    

                
                  </Row>
                );
              }
        }
      >
        {columns("originalTable", hasSelected)}
      </Table>
      {isFetching && !tableLoading && (
        <TableLoading pagination={count > pageSize} />
      )}
      {/* {isRefetchError && (
        <Alert
          message={
            //@ts-ignore
            error?.message
          }
          type="error"
          banner
        />
      )} */}
    </Space>
  );
}

const styles = { settingButton: { width: "26px", minWidth: "25px" } };

export default function TableRender({ model, ...rest }: IProps) {
  return checkPermissions(`view_${model}`) ? (
    <PaginateTable {...rest} model={model} />
  ) : null;
}
