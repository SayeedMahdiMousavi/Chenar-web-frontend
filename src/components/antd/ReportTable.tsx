import React, {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  useMemo,
  useState,
} from 'react';
import { Col, Row, Table, Space, Typography, Dropdown, Button } from 'antd';
import { SearchInput } from '../../pages/SelfComponents/SearchInput';
import { useTranslation } from 'react-i18next';
//@ts-ignore
import { useQuery, useQueryClient, QueryFunction } from 'react-query';
import { Key, TablePaginationConfig } from 'antd/lib/table/interface';
import { SearchOutlined, SettingOutlined } from '@ant-design/icons';
import ReloadButton from '../buttons/ReloadButton';
import PrintButton from '../../pages/SelfComponents/PrintButton';
import TableError from './TableError';
import { TableLoading } from '..';

const { Column } = Table;
const { Text } = Typography;

interface Record {
  status: string | boolean;
  id: string;
  serial: string;
}

interface IProps {
  journalBook?: string;
  title?: string;
  place?: string;
  columns: (type: string, hasSelected: boolean) => ReactNode;
  placeholder?: string | undefined;
  queryKey: string;
  rowSelection?: object;
  handleGetData: QueryFunction<any, any[]>;
  filters?: any;
  filterNode?: (
    setPage: (value: number) => void,
    setSelectedRowKeys: (value: Key[]) => void,
  ) => ReactNode;
  settingMenu?: ReactElement<any, string | JSXElementConstructor<any>>;
  summary?: (value: any) => ReactNode;
  resultDomColumns?: ReactElement<any, any>;
  selectResult?: boolean;
  resultDataSource?: {}[];
  resultLoading?: boolean;
  resultFetching?: boolean;
  filtersComponent: ReactNode;
  setSelectResult?: (value: boolean) => void;
  search?: number | string;
  setSearch?: (value: number | string) => void;
  isSearch?: boolean;
  queryConf?: any;
  paginationPosition?: string[] | undefined;
  setResultSelectedRows?: (value: any[]) => void;
  setResultSelectedRowKeys?: (value: Key[]) => void;
  rowKey?: string;
  pagination?: boolean;
}

export default function ReportTable(props: IProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [search1, setSearch1] = useState<string | number>('');
  const [settingVisible, setSettingVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [order, setOrder] = useState(
    props?.rowKey ? `-${props?.rowKey}` : '-id',
  );

  const search = props?.search ? props?.search : search1;
  const setSearch = props?.setSearch ? props?.setSearch : setSearch1;

  //setting
  const handleChangeSettingVisible = (flag: boolean) => {
    setSettingVisible(flag);
  };

  const { data, isFetching, isLoading, status, error, refetch } = useQuery(
    [props.queryKey, { page, pageSize, search, order, ...props.filters }],
    props.handleGetData,
    {
      //  suspense: true,
      ...props?.queryConf,
    },
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
    hasMore,
    props.filters,
    queryClient,
    isFetching,
  ]);

  const onChangeTable = (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any,
  ) => {
    if (sorter?.[0]) {
      const order = sorter?.reduce((sum: string, item: any, index: number) => {
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
        setOrder(props?.rowKey ? `-${props?.rowKey}` : '-id');
      }
    }
  };

  //pagination
  const paginationChange = (page: number, pageSize: number | undefined) => {
    setPage(page);
    setPageSize(pageSize!);
  };

  const count: number = data?.count;
  const position: string | undefined = props?.paginationPosition?.[0];

  const pagination: false | TablePaginationConfig | undefined = {
    total: count,
    pageSizeOptions: ['5', '10', '20', '50'],
    onShowSizeChange: paginationChange,
    defaultPageSize: pageSize,
    current: page,
    pageSize: pageSize,
    defaultCurrent: 1,
    onChange: paginationChange,
    showTotal:
      position === 'topRight' || position === 'topLeft'
        ? (total: number) =>
            `${t('Pagination.Total')} ${total} ${t('Pagination.Item')}`
        : undefined,
    size: 'small',
    showQuickJumper: true,
    showSizeChanger: true,
    responsive: true,
    showLessItems: true,
    // hideOnSinglePage: true,
    //@ts-ignore
    position: props?.paginationPosition,
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
    ...props?.rowSelection,
  };

  //handle clean selectedKeys
  const onReload = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
    if (props.setSelectResult) {
      props.setSelectResult(false);
    }
    if (props.setResultSelectedRows) {
      props.setResultSelectedRows([]);
    }
    if (props.setResultSelectedRowKeys) {
      props.setResultSelectedRowKeys([]);
    }
  };

  //table columns
  const tableColumns = props?.columns;
  const columns = useMemo(
    () => (type: string) => (
      <React.Fragment>
        <Column
          title={t('Table.Row').toUpperCase()}
          dataIndex='serial'
          key='serial'
          width={type !== 'print' ? 80 : 40}
          className='table-col'
          align='center'
          fixed={type !== 'print' ? true : false}
          render={(text, __, index) => (
            <React.Fragment>
              {type !== 'print'
                ? //@ts-ignore
                  (page - 1) * pageSize + index + 1
                : index + 1}
            </React.Fragment>
          )}
        />

        {tableColumns(type, hasSelected)}
      </React.Fragment>
    ),
    [hasSelected, page, pageSize, t, tableColumns],
  );

  //   //change page size
  //   const handleChangePageSize = (value: number) => {
  //     setPage((prev) => {
  //       const endPage = count / value;
  //       const result = endPage >= prev ? prev : endPage;
  //       return Math.ceil(result);
  //     });
  //     setPageSize(value);
  //   };

  const handleRetry = () => {
    refetch();
  };

  const emptyText =
    status !== 'error' ? undefined : (
      <TableError error={error} handleRetry={handleRetry} />
    );

  const tableLoading = Boolean(props?.summary)
    ? isLoading || props?.resultLoading
    : isLoading;

  // const allData = usePaginationNumber(data, page, pageSize);
  // console.log(data);

  // return (<div>{props.filterNode && props.filterNode(setPage, setSelectedRowKeys)} dkfj</div>)
  return (
    <Space direction='vertical' size={5}>
      {props.filterNode && props.filterNode(setPage, setSelectedRowKeys)}
      {position !== 'topRight' && position !== 'topLeft' && (
        <Text>
          {t('Pagination.Total')} : {count ?? 0} {t('Pagination.Item')}
        </Text>
      )}
      {/* {console.log(allData)} */}
      <Table
        onChange={onChangeTable}
        loading={tableLoading}
        size='small'
        rowSelection={rowSelection}
        rowKey={(record: any) =>
          props?.place === 'detailedBalance'
            ? `${record?.account_id} ${record?.amount_currency}`
            : props?.rowKey
              ? record[props?.rowKey]
              : record.id
        }
        pagination={props?.pagination ? pagination : false}
        // pagination={false}
        dataSource={data?.results}
        bordered
        locale={{ emptyText: emptyText }}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true }}
        summary={props?.summary}
        title={() => {
          return (
            <Row align='middle'>
              <Col
                // xxl={12} xl={15} lg={16} md={15} sm={16}
                sm={22}
              >
                <Space align='center' size={13}>
                  {props?.isSearch === false ? null : (
                    <SearchInput
                      setPage={setPage}
                      placeholder={
                        Boolean(props?.placeholder)
                          ? props?.placeholder
                          : t('Form.Search')
                      }
                      setSearch={setSearch}
                      suffix={<SearchOutlined className='search_icon_color' />}
                    />
                  )}
                  {/* <div>{t("Table.Items_per_page")}</div> */}

                  {/* <Select
                          value={pageSize}
                          onChange={handleChangePageSize}
                        >
                          <Option value={5}>5 /{t("Table.Page")} </Option>
                          <Option value={10}>10 /{t("Table.Page")} </Option>
                          <Option value={20}>20 /{t("Table.Page")} </Option>
                          <Option value={50}>50 /{t("Table.Page")} </Option>
                        </Select> */}
                  {(selectedRowKeys?.length > 0 || props.selectResult) && (
                    <ReloadButton
                      onReload={onReload}
                      length={
                        Boolean(props?.resultDataSource) && props?.selectResult
                          ? selectedRowKeys?.length +
                            props?.resultDataSource?.length!
                          : selectedRowKeys?.length
                      }
                    />
                  )}
                </Space>
              </Col>

              <Col
                // xxl={12}
                // xl={9}
                // lg={8}
                // md={10}
                sm={2}
                // xs={6}
                className='textAlign__end'
              >
                <Space size={1} align='center'>
                  <PrintButton
                    disabled={
                      selectedRowKeys?.length === 0 &&
                      (!props?.selectResult ||
                        props?.selectResult === undefined)
                    }
                    domColumns={columns('print')}
                    title={props?.title}
                    dataSource={selectedRows}
                    selectResult={props?.selectResult}
                    resultDataSource={props.resultDataSource}
                    resultDomColumns={props.resultDomColumns}
                    filters={props?.filtersComponent}
                  />

                  {Boolean(props?.settingMenu) && (
                    <Dropdown
                      //@ts-ignore
                      menu={props?.settingMenu}
                      trigger={['click']}
                      onOpenChange={handleChangeSettingVisible}
                      open={settingVisible}
                    >
                      <Button
                        icon={<SettingOutlined />}
                        type='link'
                        shape='circle'
                        style={styles.settingButton}
                      />
                    </Dropdown>
                  )}
                </Space>
              </Col>
            </Row>
          );
        }}
      >
        {columns('originalTable')}
      </Table>
      {(isFetching || props?.resultFetching) && !tableLoading && (
        <TableLoading
          pagination={
            count > pageSize &&
            position !== 'topRight' &&
            position !== 'topLeft'
          }
        />
      )}
    </Space>
  );
}

const styles = { settingButton: { width: '26px', minWidth: '25px' } };
