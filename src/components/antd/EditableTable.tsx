import React, {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  useState,
} from 'react';
//@ts-ignore
import { useQuery, useQueryClient, QueryFunction } from 'react-query';
import {
  Row,
  Col,
  Table,
  Dropdown,
  Space,
  Select,
  Popover,
  Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { SearchInput } from '../../pages/SelfComponents/SearchInput';
import {
  FilterOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import useGetBaseCurrency from '../../Hooks/useGetBaseCurrency';
import { useCallback } from 'react';
import { useMemo } from 'react';
import PrintButton from '../../pages/SelfComponents/PrintButton';
import ReloadButton from '../buttons/ReloadButton';
import { CustomizeComponent } from 'rc-table/lib/interface';
import TableError from './TableError';
import { TableLoading } from '..';
import { checkPermissions } from '../../Functions';

const { Option } = Select;
const { Text } = Typography;

interface IProps {
  title?: string;
  type?: string;
  columns: (type: string, hasSelected: boolean) => any[];
  editingKey: string;
  model: string;
  save: (record: any) => void;
  edit: (record: any) => void;
  editableCell: CustomizeComponent | undefined;
  placeholder?: string | undefined;
  queryKey: string;
  rowSelection?: object;
  rowSelectable?: boolean;
  handleGetData: QueryFunction<any, any[]>;
  summary?: (value: any) => any;
  resultLoading?: boolean;
  editLoading?: boolean;
  filters?: any;
  filterNode?: (
    setPage: (value: number) => void,
    setVisible: (value: boolean) => void,
  ) => ReactNode;
  settingMenu?: ReactElement<any, string | JSXElementConstructor<any>>;
  batchAction?: (
    selectedRowKeys: Key[],
    setSelectedRowKeys: (value: Key[]) => void,
    selectedRows: any[],
  ) => ReactNode;
  setSearch?: (value: string | number) => void;
  search?: string | number;
}

const EditableTable: React.FC<IProps> = (props) => {
  const queryClient = useQueryClient();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const { t } = useTranslation();
  const [allData, setAllData] = useState([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(
    props?.type === 'currencyRate' ? 10 : 5,
  );
  const [search1, setSearch1] = useState<string | number>('');
  const [order, setOrder] = useState<string>('-id');
  const [visibleFilter, setFilterVisible] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);

  const editingKey = props?.editingKey;
  const search = props?.search ? props?.search : search1;
  const setSearch = props?.setSearch ? props?.setSearch : setSearch1;

  const isEditing = useCallback(
    (record: any) => record.id === editingKey || record?.symbol === editingKey,
    [editingKey],
  );

  const hasSelected = selectedRowKeys?.length > 0;

  //table columns
  const tableColumns = props?.columns;
  const columns = useMemo(
    () => (type: string) => {
      const allColumns = [
        {
          title: t('Table.Row').toUpperCase(),
          dataIndex: 'serial',
          key: 'serial',
          width: type !== 'print' ? 80 : 40,
          fixed: type !== 'print' ? 'left' : undefined,
          className: 'table-col',
          align: 'center',
          render: (text: number, __: any, index: number) => (
            <React.Fragment>
              {type !== 'print'
                ? //@ts-ignore
                  (page - 1) * pageSize + index + 1
                : index + 1}
            </React.Fragment>
          ),
        },
        ...tableColumns(type, hasSelected),
      ];

      return checkPermissions([
        `delete_${props?.model}`,
        `change_${props?.model}`,
      ])
        ? allColumns
        : allColumns?.filter((item) => item?.dataIndex !== 'action');
    },
    [t, tableColumns, hasSelected, props, page, pageSize],
  );

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

  const queryConf =
    props?.type === 'approveCenter'
      ? {
          refetchInterval: 5000,
        }
      : {};

  const { data, isFetching, isLoading, status, error, refetch } = useQuery(
    [props.queryKey, { page, pageSize, search, order, ...props.filters }],
    props.handleGetData,
    //@ts-ignore
    queryConf,
  );

  const hasMore = Boolean(data?.nextPageNumber);
  React.useEffect(() => {
    if (hasMore && !isFetching) {
      queryClient.prefetchQuery(
        [
          props.queryKey,
          { page: page + 1, pageSize, search, order, ...props.filters },
        ],
        props.handleGetData,
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

  //pagination
  const paginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };
  //   const onPageSizeChange = (current: number, size: number) => {
  //     setPageSize(size);
  //     setPage(current);
  //   };

  const onChangeTable = (pagination: any, filters: any, sorter: any) => {
    if (sorter?.[0]) {
      const order = sorter?.reduce((sum: any, item: any, index: number) => {
        if (item.order === 'ascend') {
          return `${sum}${index !== 0 ? ',' : ''}${item.field}`;
        } else if (item.order === 'descend') {
          return `${sum}${index !== 0 ? ',' : ''}-${item.field}`;
        } else {
          return sum;
        }
      }, '');
      setOrder(order);
    } else {
      if (sorter.order === 'ascend') {
        setOrder(sorter.field);
      } else if (sorter.order === 'descend') {
        setOrder(`-${sorter.field}`);
      } else {
        setOrder(`-id`);
      }
    }
  };

  const count: number = data?.count;

  const pagination = {
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
    size: 'small',
    showQuickJumper: true,
    showSizeChanger: false,
    responsive: true,
    showLessItems: true,
    hideOnSinglePage: true,
  };

  //get base currency
  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyId = baseCurrency?.data?.id;
  const baseCurrencyName = baseCurrency?.data?.name;

  React.useEffect(() => {
    const allData =
      data &&
      data?.results &&
      data?.results?.map((item: any, index: number) => {
        return {
          ...item,
          // currency: { name: baseCurrencyName, id: baseCurrencyId },
        };
      });
    setAllData(allData);
  }, [data, baseCurrencyName, baseCurrencyId]);

  const components = {
    body: {
      cell: props.editableCell,
    },
  };

  const mergedColumns = columns('originalTable')?.map((col: any) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: any) => {
        const save = () => {
          props?.save(record);
        };
        return {
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
          save: save,
        };
      },
    };
  });

  //row selection
  const onSelectChange = (selectedRowKeys: Key[], selectedRows: any[]) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
    getCheckboxProps: () => ({
      disabled: editingKey !== '', // Column configuration not to be checked
    }),
    ...props?.rowSelection,
  };

  const onReload = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  //settings
  const handleChangeSettingVisible = (flag: boolean) => {
    setSettingVisible(flag);
  };

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
    status !== 'error' ? undefined : (
      <TableError error={error} handleRetry={handleRetry} />
    );

  const tableLoading = isLoading || props?.editLoading;

  // console.log("allData" , allData)
  return (
    <Space direction='vertical' size={10}>
      <Text>
        {t('Pagination.Total')} :{' '}
        {props?.type === 'currencyRate' ? count - 1 : (count ?? 0)}{' '}
        {t('Pagination.Item')}
      </Text>
      <Table
        loading={tableLoading}
        size='middle'
        // sticky
        // bordered
        locale={{ emptyText: emptyText }}
        tableLayout='auto'
        rowKey={(record: any) => record.id || record?.symbol}
        //@ts-ignore
        pagination={pagination}
        //@ts-ignore
        rowSelection={props?.rowSelectable === false ? undefined : rowSelection}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true }}
        onChange={onChangeTable}
        dataSource={
          props?.type === 'currencyRate'
            ? allData?.filter(
                (item: { name: string }) => item?.name !== baseCurrencyName,
              )
            : allData
        }
        rowClassName='editable-row'
        //@ts-ignore
        columns={mergedColumns}
        components={components}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              //
              const isEditable =
                props?.type === 'units'
                  ? record?.id !== editingKey &&
                    record?.symbol !== editingKey &&
                    record?.status === 'active' &&
                    !hasSelected &&
                    checkPermissions(`change_${props?.model}`)
                  : props?.type === 'approveCenter'
                    ? record?.id !== editingKey &&
                      record?.symbol !== editingKey &&
                      record?.approve_state !== 'approved' &&
                      !hasSelected &&
                      checkPermissions(`change_${props?.model}`)
                    : record?.id !== editingKey &&
                      record?.symbol !== editingKey &&
                      !hasSelected &&
                      checkPermissions(`change_${props?.model}`);
              if (isEditable) {
                props.edit(record);
              }
            }, // double click row
          };
        }}
        summary={props?.summary}
        title={() => {
          return (
            <Row align='middle'>
              <Col
                // xxl={12} xl={15} lg={16} md={15} sm={16}
                sm={21}
              >
                <Space align='center' size={13}>
                  <SearchInput
                    setPage={setPage}
                    placeholder={
                      Boolean(props?.placeholder)
                        ? props?.placeholder
                        : t('Form.Search')
                    }
                    setSearch={setSearch}
                    suffix={
                      Boolean(props?.filterNode) ? (
                        <Popover
                          content={menu}
                          trigger='click'
                          placement='bottom'
                          onOpenChange={handleVisibleChangFilter}
                          open={visibleFilter}
                        >
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          {/* <a
                            className="ant-dropdown-link"
                            onClick={(e) => e.preventDefault()}
                            href="#"
                          > */}
                          <FilterOutlined />
                          {/* </a> */}
                        </Popover>
                      ) : (
                        <SearchOutlined className='search_icon_color' />
                      )
                    }
                  />
                  {count > 5 && <div>{t('Table.Items_per_page')}</div>}

                  {count > 5 && (
                    <Select value={pageSize} onChange={handleChangePageSize}>
                      <Option value={5}>5 /{t('Table.Page')} </Option>
                      <Option value={10}>10 /{t('Table.Page')} </Option>
                      <Option value={20}>20 /{t('Table.Page')} </Option>
                      <Option value={50}>50 /{t('Table.Page')} </Option>
                    </Select>
                  )}
                  {selectedRowKeys?.length > 0 && (
                    <ReloadButton
                      onReload={onReload}
                      length={selectedRowKeys?.length}
                    />
                  )}
                </Space>
              </Col>
              {/* {hasSelected && Boolean(props?.batchAction) ? (
                  <Col
                    xxl={12}
                    xl={9}
                    lg={8}
                    md={12}
                    sm={13}
                    xs={24}
                    className="textAlign__end"
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
                ) : ( */}
              <Col
                // xxl={12}
                // xl={9}
                // lg={8}
                // md={10}
                sm={3}
                // xs={6}
                className='textAlign__end'
              >
                {props?.batchAction ? (
                  props?.batchAction &&
                  props?.batchAction(
                    selectedRowKeys,
                    setSelectedRowKeys,
                    selectedRows,
                  )
                ) : (
                  <Space size={5} align='center'>
                    {props?.rowSelectable === false ? null : (
                      <PrintButton
                        disabled={selectedRowKeys?.length === 0}
                        columns={columns('print')?.filter(
                          (item: any) => item?.key !== 'action',
                        )}
                        title={props.title}
                        dataSource={selectedRows}
                      />
                    )}
                    {Boolean(props?.settingMenu) && (
                      <Dropdown
                        //@ts-ignore
                        menu={props?.settingMenu}
                        trigger={['click']}
                        onOpenChange={handleChangeSettingVisible}
                        open={settingVisible}
                      >
                        <a className='ant-dropdown-link' href='#'>
                          <SettingOutlined className='table__header2-icon' />
                        </a>
                      </Dropdown>
                    )}
                  </Space>
                )}
              </Col>
              {/* )} */}
            </Row>
          );
        }}
      />
      {((isFetching && !tableLoading) || props?.resultLoading) && (
        <TableLoading pagination={count > pageSize} />
      )}
    </Space>
  );
};

export default function TableRender({ model, ...rest }: IProps) {
  return checkPermissions(`view_${model}`) ? (
    <EditableTable {...rest} model={model} />
  ) : null;
}
