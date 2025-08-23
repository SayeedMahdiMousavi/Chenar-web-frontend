import React, { useEffect, useState } from 'react';
//@ts-ignore
import { Detector } from 'react-detect-offline';
import {
  Typography,
  Row,
  Col,
  message,
  Table,
  InputNumber,
  Form,
  Popconfirm,
  Select,
} from 'antd';
import axiosInstance from '../../ApiBaseUrl';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { connect } from 'react-redux';
import FiltersWarehouse from './FilterWarehouse';
import { useTranslation } from 'react-i18next';
import { Title } from '../../SelfComponents/Title';
import { SearchInput } from '../../SelfComponents/SearchInput';
import { usePaginationNumber } from '../../usePaginationNumber';
import { ActionMessage } from '../../SelfComponents/TranslateComponents/ActionMessage';
import useGetDefaultWarehouse from '../../../Hooks/useGetDefaultWarehouse';
import { WAREHOUSE_M } from '../../../constants/permissions';
import { PageBackIcon } from '../../../components';
import { WAREHOUSE } from '../../../constants/routes';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  save,
  ...restProps
}: any) => {
  const { t } = useTranslation();

  return (
    <td {...restProps}>
      {editing ? (
        dataIndex === 'unit' ? (
          <Form.Item name={dataIndex} className='margin1'>
            <Select>
              {record?.product_units?.map((item: any) => (
                <Select.Option value={item?.unit?.id}>
                  {item?.unit?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          <Form.Item
            name={dataIndex}
            className='margin1'
            rules={[
              {
                required: true,
                message: `${
                  dataIndex === 'amount_min'
                    ? t('Warehouse.Notification.Min_required')
                    : t('Warehouse.Notification.Max_required')
                }`,
              },
            ]}
          >
            <InputNumber
              min={dataIndex === 'amount_min' ? 0 : 1}
              type='number'
              onPressEnter={() => save(record)}
              className='num'
              inputMode='numeric'
            />
          </Form.Item>
        )
      ) : (
        children
      )}
    </td>
  );
};

interface IProps {
  rtl: string;
}

const baseUrl = '/product/items/';
const Notification: React.FC<IProps> = ({ rtl }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [order, setOrder] = useState<string>('-id');
  const [page, setPage] = React.useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [search, setSearch] = useState<string | number>('');
  const [warehouseData, setWarehouseData] = useState<any>(undefined);
  const [form] = Form.useForm();

  const [editingKey, setEditingKey] = useState('');

  //get default warehouse
  const defaultWarehouse = useGetDefaultWarehouse();

  useEffect(() => {
    if (warehouseData === undefined) {
      setWarehouseData({
        label: defaultWarehouse?.name,
        value: defaultWarehouse?.id,
      });
    }
  }, [defaultWarehouse, warehouseData]);

  const warehouse = warehouseData?.value;

  const isEditing = (record: any) => record.id === editingKey;

  const edit = (record: any) => {
    form.setFieldsValue({
      amount_min:
        record?.min_max?.filter?.(
          (item: any) => item?.warehouse === warehouse,
        )?.[0]?.amount_min &&
        parseFloat(
          record?.min_max?.filter?.(
            (item: any) => item?.warehouse === warehouse,
          )?.[0]?.amount_min,
        ),
      amount_max:
        record?.min_max?.filter?.(
          (item: any) => item?.warehouse === warehouse,
        )?.[0]?.amount_max &&
        parseFloat(
          record?.min_max?.filter?.(
            (item: any) => item?.warehouse === warehouse,
          )?.[0]?.amount_max,
        ),
      unit: record?.min_max?.filter?.(
        (item: any) => item?.warehouse === warehouse,
      )?.[0]
        ? record?.min_max?.filter?.(
            (item: any) => item?.warehouse === warehouse,
          )?.[0]?.unit?.id
        : record?.product_units.filter(
            (item: any) => item?.base_unit === true,
          )?.[0]?.unit?.id,
      // ...record,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const editProductMinMax = async ({ value, id, product }: any) => {
    await axiosInstance
      .put(`/product/min_max/${id}/`, value)
      .then((res) => {
        message.success(
          <ActionMessage
            name={product}
            message={'Warehouse.Notification.Max_min_save_message'}
          />,
        );
        setEditingKey('');
      })
      .catch((error) => {
        if (error?.response?.data?.amount_min?.[0]) {
          message.error(`${error?.response?.data?.amount_min?.[0]}`);
        } else if (error?.response?.data?.amount_max?.[0]) {
          message.error(`${error?.response.data?.amount_max?.[0]}`);
        }
      });
  };

  const { mutate: mutateEditMinMax } = useMutation(editProductMinMax, {
    onSuccess: () => queryClient.invalidateQueries(`${baseUrl}min_max/`),
  });
  const addPriceRecording = async ({ value, product }: any) => {
    await axiosInstance
      .post(`/product/min_max/`, value)
      .then((res) => {
        message.success(
          <ActionMessage
            name={product}
            message={'Warehouse.Notification.Max_min_save_message'}
          />,
        );
        setEditingKey('');
      })
      .catch((error) => {
        if (error?.response?.data?.amount_min?.[0]) {
          message.error(`${error?.response?.data?.amount_min?.[0]}`);
        } else if (error?.response?.data?.amount_max?.[0]) {
          message.error(`${error?.response.data?.amount_max?.[0]}`);
        }
      });
  };

  const { mutate: mutateAddMinMax } = useMutation(addPriceRecording, {
    onSuccess: () => queryClient.invalidateQueries(`${baseUrl}min_max/`),
  });

  const save = async (record: any) => {
    try {
      const row = await form.validateFields();

      const allData = {
        amount_min: row?.amount_min,
        amount_max: row?.amount_max,
        product: record?.id,
        unit: record?.product_units.filter(
          (item: any) => item?.base_unit === true,
        )?.[0]?.unit?.id,
        warehouse: warehouse,
      };

      const productMinMax = record?.min_max?.filter?.(
        (item: any) => item?.warehouse === warehouse,
      );

      if (row?.amount_min >= row?.amount_max) {
        message.error(
          `${t('Warehouse.Notification.Max_min_Match_message')}`,
          2.5,
        );
        return;
      } else {
        if (productMinMax?.length === 0) {
          mutateAddMinMax({ value: allData, product: record?.name });
        } else {
          mutateEditMinMax({
            value: allData,
            id: productMinMax?.[0]?.id,
            product: record?.name,
          });
        }

        if (productMinMax?.length === 0) {
          mutateAddMinMax({ value: allData, product: record?.name });
        } else {
          mutateEditMinMax({
            value: allData,
            id: productMinMax?.[0]?.id,
            product: record?.name,
          });
        }
      }
    } catch (errInfo) {}
  };

  const columns = [
    {
      title: `${t('Table.Row').toUpperCase()}`,
      dataIndex: 'serial',
      key: 'serial',
      width: 80,
      fixed: true,
      className: 'table-col',
      align: 'center',
    },
    {
      title: `${t('Warehouse.Notification.Product_name').toUpperCase()}`,
      dataIndex: 'name',
      sorter: true,
      key: 'name',
      fixed: true,
    },
    {
      title: t('Sales.Product_and_services.Units.Unit').toUpperCase(),
      dataIndex: 'unit',
      key: 'unit',
      render: (text: any, record: any) => (
        <>
          {record?.min_max?.filter?.(
            (item: any) => item?.warehouse === warehouse,
          )?.[0]
            ? record?.min_max?.filter?.(
                (item: any) => item?.warehouse === warehouse,
              )?.[0]?.unit?.name
            : record?.product_units.filter(
                (item: any) => item?.base_unit === true,
              )?.[0]?.unit?.name}
        </>
      ),
    },

    {
      title: `${t(
        'Warehouse.Notification.Minimum_product_notification',
      ).toUpperCase()}`,
      dataIndex: 'amount_min',
      editable: true,
      sorter: true,
      key: 'amount_min',
      render: (text: any, record: any) => (
        <a>
          {record?.min_max?.filter?.(
            (item: any) => item?.warehouse === warehouse,
          )?.[0] &&
            parseFloat(
              record?.min_max?.filter?.(
                (item: any) => item?.warehouse === warehouse,
              )?.[0]?.amount_min,
            )}
        </a>
      ),
    },
    {
      title: `${t(
        'Warehouse.Notification.Maximum_product_notification',
      ).toUpperCase()}`,
      dataIndex: 'amount_max',
      editable: true,
      sorter: true,
      key: 'amount_max',
      render: (text: any, record: any) => (
        <a>
          {record?.min_max?.filter?.(
            (item: any) => item?.warehouse === warehouse,
          )?.[0] &&
            parseFloat(
              record?.min_max?.filter?.(
                (item: any) => item?.warehouse === warehouse,
              )?.[0]?.amount_max,
            )}
        </a>
      ),
    },

    {
      title: `${t('Table.Action')}`,
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      fixed: 'right',
      width: 70,
      render: (text: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              // href='#'
              onClick={() => save(record)}
            >
              {t('Form.Save')}
            </a>
            <br />
            <Popconfirm
              title={t('Sales.Product_and_services.Categories.Edit_Message')}
              onConfirm={cancel}
              okText={t('Form.Ok')}
              cancelText={t('Form.Cancel')}
            >
              <Typography.Text type='secondary'>
                {t('Form.Cancel')}
              </Typography.Text>
            </Popconfirm>
          </span>
        ) : (
          <div className='category__action'>
            <a
              //@ts-ignore
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
            >
              {t('Sales.Customers.Table.Edit')}
            </a>
          </div>
        );
      },
    },
  ];
  const mergedColumns = columns?.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: col.dataIndex === 'name' ? 'text' : 'number',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        save: save,
      }),
    };
  });

  const handleGetWarehouseNotifications = async ({ queryKey }: any) => {
    const { page, pageSize, search, order } = queryKey?.[1];
    const { data } = await axiosInstance.get(
      `${baseUrl}?page=${page}&page_size=${pageSize}&ordering=${order}&status=active&search=${search}&expand=min_max,min_max.unit,product_units,product_units.unit&omit=product_statistic,is_pine,cht_account_id,barcode,category,created,description,is_asset,is_have_vip_price,modified,modified_by,original_barcode,photo,status,supplier,created_by`,
    );

    return data;
  };
  const { isLoading, isFetching, data } = useQuery(
    [`${baseUrl}min_max/`, { page, pageSize, search, order }],
    handleGetWarehouseNotifications,
  );
  const hasMore = Boolean(data?.nextPageNumber);
  React.useEffect(() => {
    if (hasMore) {
      queryClient.prefetchQuery(
        [baseUrl, { page: page + 1, pageSize, search, order }],
        handleGetWarehouseNotifications,
      );
    }
  }, [order, data, page, pageSize, search, queryClient, hasMore]);
  //

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
    showTotal: (total: any) =>
      `${t('Pagination.Total')} ${total} ${t('Pagination.Item')}`,
    // size: isMobile ? "small" : "default",
    showQuickJumper: true,
    showSizeChanger: true,
    responsive: true,
    showLessItems: true,
  };

  // if (status === "loading") {
  //   return (
  //     <Row justify='space-around'>
  //       <Col span={23} className='product_table_skeleton banner'>
  //         <Skeleton
  //           loading={true}
  //           paragraph={{ rows: 8 }}
  //           title={false}
  //           active
  //         ></Skeleton>
  //       </Col>
  //     </Row>
  //   );
  // } else

  const allData = usePaginationNumber(data, page, pageSize);

  return (
    <Detector
      render={({ online }: any) => (
        <div
          className={
            online ? 'table-col page-body' : 'table-col page-body-offline'
          }
        >
          <Row justify='space-around'>
            <Col xl={23} md={23} xs={23} className='banner'>
              <Row className='categore-header' align='middle' justify='start'>
                <Col
                  md={{ span: 10 }}
                  sm={{ span: 11 }}
                  xs={{ span: 14 }}
                  className='Sales__content-3-body'
                >
                  <Row>
                    <Col span={24}>
                      <Title
                        value={t('Warehouse.Notification.1')}
                        model={WAREHOUSE_M}
                      />
                    </Col>
                    <Col
                      xl={{ span: 12, offset: 0 }}
                      lg={{ span: 17, offset: 0 }}
                      md={{ span: 18, offset: 0 }}
                      xs={{ span: 17, offset: 0 }}
                    >
                      <PageBackIcon
                        previousPageName={t('Warehouse.1')}
                        url={WAREHOUSE}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col
                  xl={{ span: 5, offset: 9 }}
                  lg={{ span: 6, offset: 8 }}
                  md={{ span: 7, offset: 7 }}
                  sm={{ span: 8, offset: 5 }}
                  xs={{ span: 9, offset: 1 }}
                >
                  <FiltersWarehouse
                    setWarehouse={warehouseData}
                    editingKey={editingKey}
                    warehouse={warehouseData}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row justify='space-around'>
            <Col xl={23} md={23} xs={23} className='banner table__padding'>
              <Form form={form} component={false}>
                <Table
                  components={{
                    body: {
                      cell: EditableCell,
                    },
                  }}
                  loading={isLoading || isFetching ? true : false}
                  size='middle'
                  scroll={{ x: 'max-content', scrollToFirstRowOnChange: true }}
                  onChange={onChangeTable}
                  //@ts-ignore
                  pagination={pagination}
                  rowKey={(record) => record.id}
                  dataSource={allData}
                  bordered
                  onRow={(record, rowIndex) => {
                    return {
                      onDoubleClick: () => edit(record), // double click row
                    };
                  }}
                  //@ts-ignore
                  columns={mergedColumns}
                  rowClassName='editable-row'
                  title={() => {
                    return (
                      <Row style={{ width: '100%' }}>
                        <Col
                          xl={{ span: 7 }}
                          lg={{ span: 9 }}
                          md={{ span: 10 }}
                          sm={{ span: 11 }}
                          className='table__header1'
                        >
                          <Row>
                            <Col md={18} sm={{ span: 17 }}>
                              {' '}
                              <SearchInput
                                setPage={setPage}
                                placeholder={t('Employees.Filter_by_name')}
                                // value={search}
                                setSearch={setSearch}
                              />
                            </Col>
                            <Col
                              md={{ span: 3, offset: 2 }}
                              sm={{ span: 4, offset: 2 }}
                            ></Col>
                          </Row>
                        </Col>

                        <Col
                          xl={{ span: 2, offset: 15 }}
                          lg={{ span: 3, offset: 12 }}
                          md={{ span: 3, offset: 11 }}
                          sm={{ span: 4, offset: 9 }}
                          xs={{ span: 6, offset: 4 }}
                          className='table__header2'
                        >
                          <Row>
                            {/* <Col span={8}>
                            <PrinterOutlined className='table__header2-icon' />
                          </Col>
                          <Col span={8}>
                            <ExportOutlined className='table__header2-icon' />
                          </Col>
                          <Col span={8}>
                            <Dropdown
                              overlay={setting}
                              trigger={["click"]}
                              onOpenChange={handleVisibleChange}
                              open={visible}
                            >
                              <a className='ant-dropdown-link' href='#'>
                                <SettingOutlined className='table__header2-icon' />
                              </a>
                            </Dropdown>
                          </Col> */}
                          </Row>
                        </Col>
                      </Row>
                    );
                  }}
                />
              </Form>
            </Col>
          </Row>
        </div>
      )}
    />
  );
};

const mapStateToProps = (state: any) => ({
  rtl: state.direction.rtl,
  ltr: state.direction.ltr,
});

export default connect(mapStateToProps)(Notification);
