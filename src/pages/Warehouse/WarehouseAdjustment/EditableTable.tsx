import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Table,
  Input,
  Button,
  Form,
  message,
  Col,
  Row,
  Typography,
  Modal,
  Popconfirm,
  Space,
  Tooltip,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { HotKeys } from 'react-hotkeys';
import axiosInstance from '../../ApiBaseUrl';
import WarehouseAdjustmentEditableCell from './EditableCell';
import { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionMessage } from '../../SelfComponents/TranslateComponents/ActionMessage';
import { Key } from 'antd/lib/table/interface';
import useGetDefaultWarehouse from '../../../Hooks/useGetDefaultWarehouse';
import {
  DeleteButton,
  EditButton,
  TableSummaryCell,
} from '../../../components';
import { BarcodeIcon } from '../../../icons';
import { Statistics } from '../../../components/antd';
import { PRODUCT_LIST } from '../../../constants/routes';
import { fixedNumber, math, print } from '../../../Functions/math';
import ShowDate from '../../SelfComponents/JalaliAntdComponents/ShowDate';

const { Search } = Input;
export const plColumns = [];
const fields =
  'id,name,product_units,price.unit,price.sales_rate,price.perches_rate,product_barcode.unit,product_barcode.barcode,expiration_date,product_statistic.available,product_statistic,average_price';
const endUrl =
  'status=active&expand=product_units,product_units.unit,price,price.unit,product_barcode,product_barcode.unit,expiration_date';

const dateFormat = 'YYYY-MM-DD';
const datePFormat = 'jYYYY/jM/jD';

interface IProps {
  responseId: boolean;
  editingKey: string;
  setEditingKey: (value: string) => void;
  setCount: (value: number) => void;
  count: number;
  setData: (value: any) => void;
  data: any;
  setSelectedRowKeys: (value: Key[]) => void;
  selectedRowKeys: Key[];
  type: string;
}
const WarehouseAdjustmentEditableTable = (props: IProps) => {
  const [form] = Form.useForm();
  const tableRef = useRef<HTMLElement | null>(null);
  const barcodeSearch = useRef<any>(null);
  const [productItem, setProductItem] = useState({});
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLocaleData, setSearchLocalData] = useState('');

  const setData = props.setData;
  const setEditingKey = props.setEditingKey;
  const setSelectedRowKeys = props.setSelectedRowKeys;
  const setCount: any = props.setCount;
  const count: number = props?.count;

  const cancel = useCallback(() => {
    setEditingKey('');
  }, [setEditingKey]);

  const isEditing = useCallback(
    (record: any) => {
      return record.key === props.editingKey;
    },
    [props.editingKey],
  );

  //get default warehouse
  const defaultWarehouse = useGetDefaultWarehouse();

  const warehouseName = defaultWarehouse?.name;
  const warehouseId = defaultWarehouse?.id;

  const edit = useCallback(
    (record: any) => {
      form.setFieldsValue({
        product: record?.product,
        qty: record?.qty ? record?.qty : 1,
        type: record?.type ? record?.type : { value: 'add', label: t('Add') },
        warehouse: record?.warehouse?.value
          ? record?.warehouse
          : { value: warehouseId, label: warehouseName },
        each_price: record?.each_price,
        expirationDate: record?.expirationDate,
        productStatistic: record?.product_statistic,
      });

      setEditingKey(record.key);
    },
    [form, setEditingKey, t, warehouseId, warehouseName],
  );

  const handleDelete = useCallback(
    (key: any) => {
      setData((prevData: any) => {
        const data1 = prevData.filter((item: any) => item?.key !== key);
        //@ts-ignore
        setSelectedRowKeys((prev: Key[]) => {
          const index = prevData?.findIndex(
            (item: any) => prev?.[0] === item.key,
          );
          const nextItem = prevData?.find(
            (item: any, ItemIndex: any) => ItemIndex === index - 1,
          );
          if (nextItem) {
            return [nextItem.key];
          } else {
            return [];
          }
        });
        return data1;
      });
    },
    [setData, setSelectedRowKeys],
  );

  const save = useCallback(
    async (record: any) => {
      try {
        const row = await form.validateFields();
        const baseUnit = record?.product_units?.find(
          (item: any) => item?.base_unit === true,
        )?.unit;
        const qty = row?.qty < 0 ? 0 : fixedNumber(row.qty);
        const each_price = row?.each_price > 0 ? row.each_price : 0.01;
        const totalPrice = each_price ? qty * each_price : qty * 0;
        const value = {
          ...record,
          warehouse: row?.warehouse,
          product: row?.product,
          type: row?.type,
          unit: { value: baseUnit?.id, label: baseUnit?.name },
          total_price: totalPrice,
          qty: qty,
          each_price: each_price,
          expirationDate: row?.expirationDate,
        };

        const prevData = [...props?.data];
        const newData = prevData?.map((item) => {
          if (item?.key === record?.key) {
            return { ...item, ...value };
          } else {
            return item;
          }
        });

        setData(newData);
        setEditingKey('');
        //   tableRef.current.focus();
        setProductItem({});
      } catch (errInfo) {
        //
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form, props.data, setData, setEditingKey],
  );

  const columns = useMemo(
    () => [
      {
        title: t('Sales.All_sales.Invoice.Product_name'),
        dataIndex: 'product',
        render: (text: { label: string }) => text?.label,
        editable: true,
      },
      {
        title: t('Sales.Product_and_services.Units.Unit'),
        dataIndex: 'unit',
        render: (text: any, record: any) => {
          const baseUnit = record?.product_units?.find(
            (item: any) => item?.base_unit === true,
          )?.unit;
          return baseUnit?.name;
        },
      },
      {
        title: t('Sales.All_sales.Invoice.Quantity').toUpperCase(),
        dataIndex: 'qty',
        width: 150,
        render: (value: number, record: any) => {
          const available =
            record?.warehouse?.value &&
            record?.product_statistic?.find(
              (item: { warehouse: number }) =>
                item?.warehouse === record?.warehouse?.value,
            )?.available;
          return (
            <Row justify='space-between' gutter={5}>
              <Col>
                <Statistics value={value} />
              </Col>

              <Col>
                {record?.product?.value && (
                  <Tooltip
                    title={<Statistics value={available} color='white' />}
                  >
                    <InfoCircleOutlined />
                    &nbsp;
                  </Tooltip>
                )}
              </Col>
            </Row>
          );
        },

        editable: true,
      },
      {
        title: t('Sales.Product_and_services.Form.Price').toUpperCase(),
        dataIndex: 'each_price',
        sorter: (a: any, b: any) => a.each_price - b.each_price,
        width: 125,
        render: (value: number) => {
          return value && <Statistics value={value} />;
        },
        editable: true,
      },
      {
        title: t('Sales.Customers.Form.Total').toUpperCase(),
        dataIndex: 'total_price',
        sorter: (a: any, b: any) => a.total_price - b.total_price,
        width: 125,
        render: (value: any) => {
          return value && <Statistics value={value} />;
        },
      },
      {
        title: t(
          'Sales.Product_and_services.Inventory.Expiration_date',
        ).toUpperCase(),
        dataIndex: 'expirationDate',
        width: 140,
        editable: true,
        render: (value: string) =>
          value && (
            <ShowDate
              date={value}
              dateFormat={dateFormat}
              datePFormat={datePFormat}
            />
          ),
      },
      {
        title: t('Warehouse.1'),
        dataIndex: 'warehouse',
        editable: true,
        render: (text: { label: string }) => text?.label,
      },
      // {
      //   title: t("Sales.Product_and_services.Type").toUpperCase(),
      //   dataIndex: "type",

      //   editable: true,
      //   render: (value: any) => value?.label,
      // },
      {
        title: t('Table.Action').toUpperCase(),
        dataIndex: 'action',
        width: 90,
        align: 'center',
        fixed: 'right',
        render: (text: any, record: any) => {
          const editable = isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <a
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      save(record);
                    }}
                  >
                    {t('Form.Save')}
                  </a>
                  <br />
                  <Popconfirm
                    title={t(
                      'Sales.Product_and_services.Categories.Edit_Message',
                    )}
                    onConfirm={cancel}
                    okText={t('Form.Ok')}
                    cancelText={t('Form.Cancel')}
                  >
                    <Typography.Text
                      type='secondary'
                      style={{ cursor: 'pointer' }}
                    >
                      {t('Form.Cancel')}
                    </Typography.Text>
                  </Popconfirm>
                </span>
              ) : (
                <Space>
                  <EditButton
                    disabled={props?.responseId}
                    onClick={() => edit(record)}
                  />
                  <DeleteButton
                    itemName={record?.name ? record?.name : ' '}
                    onConfirm={() => handleDelete(record?.key)}
                    disabled={props.editingKey !== '' || props?.responseId}
                  />
                </Space>
              )}
            </div>
          );
        },
      },
    ],
    [cancel, edit, handleDelete, isEditing, props, save, t],
  );

  const components = {
    body: {
      cell: WarehouseAdjustmentEditableCell,
    },
  };

  const mergedColumns = columns?.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => {
        return {
          editing: isEditing(record),
          dataIndex: col.dataIndex,
          record,
          save: save,
          form,
          setProductItem,
          productItem,
          setLoading,
          setData,
          fields,
          endUrl,
          datePFormat,
          dateFormat,
        };
      },
    };
  });

  const onClickAdd = useCallback(() => {
    setData((prevData: any) => {
      //@ts-ignore
      setSelectedRowKeys((prev) => {
        const index = prevData?.findIndex(
          (item: any) => prev?.[0] === item.key,
        );
        const nextItem = prevData?.find(
          (item: any, ItemIndex: number) => ItemIndex === index + 1,
        );
        if (nextItem) {
          const newKey = nextItem?.key;
          return [newKey];
        } else {
          return prev;
        }
      });
      return prevData;
    });
  }, [setData, setSelectedRowKeys]);

  const onClickUp = useCallback(() => {
    setData((prevData: any) => {
      //@ts-ignore
      setSelectedRowKeys((prev) => {
        const index = prevData?.findIndex(
          (item: any) => prev?.[0] === item.key,
        );
        const nextItem = prevData?.find(
          (item: any, ItemIndex: number) => ItemIndex === index - 1,
        );
        if (nextItem) {
          const newKey = nextItem?.key;
          return [newKey];
        } else {
          return prev;
        }
      });
      return prevData;
    });
  }, [setData, setSelectedRowKeys]);

  const handleErrorPressEnter = useCallback(
    (close: any) => {
      //@ts-ignore
      setSelectedRowKeys((prev) => {
        handleDelete(prev?.[0]);
        return prev;
      });
      close();
      //@ts-ignore
      tableRef.current.focus();
    },
    [handleDelete, setSelectedRowKeys],
  );

  const handelCancelDelete = (close: any) => {
    close();
    //@ts-ignore
    tableRef.current.focus();
  };

  const keyMap = {
    SALES_INVOICE_TABLE_MOVE_UP: 'up',
    SALES_INVOICE_TABLE_MOVE_DOWN: 'down',
    SALES_INVOICE_ADD_PRODUCT: ['enter', 'Enter'],
    SALES_INVOICE_TABLE_MOVE_RIGHT: 'right',
    SALES_INVOICE_TABLE_MOVE_LEFT: 'left',
    SALES_INVOICE_TABLE__Delete: 'del',
    // MARKET_INVOICE_PRINT: "Control+p",
  };

  const handlers = {
    SALES_INVOICE_TABLE_MOVE_UP: (event: any) => {
      if ((props.selectedRowKeys?.length ?? 0) > 0) {
        event.preventDefault();
        onClickUp();
      }
    },
    SALES_INVOICE_TABLE_MOVE_DOWN: (event: any) => {
      if ((props.selectedRowKeys?.length ?? 0) > 0) {
        event.preventDefault();
        onClickAdd();
      }
    },
    SALES_INVOICE_ADD_PRODUCT: () => {
      if (props.editingKey === '') {
        // event.preventDefault();
        // event.stopPropagation();
        //
        // props.handleAddProduct();
      }
    },
    SALES_INVOICE_TABLE_MOVE_RIGHT: (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      //@ts-ignore
      props.setSelectedRowKeys((prev) => {
        const record = props?.data?.find(
          (item: any) => item?.key === prev?.[0],
        );
        if (record) {
          edit(record);
        }
        return prev;
      });
    },
    SALES_INVOICE_TABLE_MOVE_LEFT: (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      // if (editingKey !== "") {
      props.setEditingKey('');
      // }
    },
    SALES_INVOICE_TABLE__Delete: (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      //@ts-ignore
      props.setSelectedRowKeys((prev) => {
        const item = props?.data?.find((item: any) => item?.key === prev?.[0]);
        if (item) {
          Modal.confirm({
            bodyStyle: {
              direction: t('Dir') as
                | 'ltr'
                | 'rtl'
                | 'inherit'
                | 'initial'
                | 'unset',
            },
            title: (
              <Typography.Text>
                {' '}
                <ActionMessage
                  name={item?.name ? item?.name : ''}
                  message='Sales.All_sales.Invoice.Remove_item_message'
                />
              </Typography.Text>
            ),
            onOk: handleErrorPressEnter,
            onCancel: handelCancelDelete,
          });
        }
        return prev;
      });
    },
    // MARKET_INVOICE_PRINT: (event) => {
    //   event.preventDefault();
    //   handlePrint();
    //   // event.stopPropagation();
    //   //
    // },
  };

  //row selection
  const onSelectChange = (selectedRowKeys: Key[]) => {
    props.setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys: props.selectedRowKeys,
    type: 'radio',
    onChange: onSelectChange,
    columnWidth: 60,
    renderCell: (_: boolean, __: any, index: number) => (
      <div style={{ textAlign: 'center', width: '100%' }}>{index + 1}</div>
    ),
    hideSelectAll: true,
    columnTitle: <span>{t('Table.Row')}</span>,
  };

  //barcode search
  const onChangeSearch = (e: any) => {
    setSearch(e.target.value);
  };

  let onSearch = useCallback(
    async (value: any) => {
      if (value === '') {
        return;
      } else {
        setLoading(true);

        const data = [...props.data];
        const product = data?.find((item) => {
          const isBarcodeExist = item?.product_barcode?.find(
            (barcodeItem: any) => barcodeItem?.barcode === search,
          );
          return Boolean(isBarcodeExist) ? true : false;
        });

        if (Boolean(product)) {
          message.warning(
            <ActionMessage
              name={product?.product?.label}
              message={'Warehouse_adjustment_product_exist_already'}
            />,
          );
          setLoading(false);
          setSearch('');
        } else {
          await axiosInstance
            .get(
              `${PRODUCT_LIST}?page=1&page_size=10&product_barcode__barcode=${search}&${endUrl}&fields=${fields}`,
            )
            .then((res) => {
              if (res?.data?.results?.length !== 0) {
                const product = res?.data?.results?.[0];
                const baseUnit = product?.product_units?.find(
                  (item: any) => item?.base_unit === true,
                );

                const price = res?.data?.price?.find(
                  (item: any) => item?.unit?.id === baseUnit?.id,
                )?.sales_rate;

                const newPrice = Boolean(product?.average_price)
                  ? product?.average_price
                  : price;

                const newData = {
                  ...product,
                  key: props.count,
                  row: `${props.count}`,
                  product: { label: product?.name, value: product?.id },
                  unit: {
                    value: baseUnit?.unit?.id,
                    label: baseUnit?.unit?.name,
                  },
                  each_price: Boolean(product?.average_price)
                    ? product?.average_price
                    : newPrice,
                  total_price: newPrice ? 1 * parseFloat(newPrice) : 0,
                };
                //
                setData((prev: any) => {
                  const data = [...prev, newData];
                  //@ts-ignore
                  barcodeSearch?.current.blur();
                  edit(newData);
                  return data;
                });
                setCount(props.count + 1);
                setLoading(false);
                setSearch('');

                setTimeout(() => {
                  const rowKey = [newData.key];
                  setSelectedRowKeys(rowKey);
                }, 200);
              } else {
                message.error(
                  `${t('Sales.All_sales.Invoice.Product_not_found')}`,
                );
                setLoading(false);
                setSearch('');
                return;
              }
            })
            .catch((error) => {
              setLoading(false);
              setSearch('');
              if (error?.response?.data?.barcode?.[0]) {
                message.error(`${error?.response.data?.barcode?.[0]}`);
              }
            });
        }
      }
    },
    [
      barcodeSearch,
      edit,
      props.count,
      props.data,
      search,
      setCount,
      setData,
      setSelectedRowKeys,
      t,
    ],
  );

  const handelSearchAllData = (e: any) => {
    setSearchLocalData(e.target.value);
  };

  const filterDataSource = props?.data?.filter((item: any) => {
    const matchName = item?.product?.label
      ?.toLowerCase()
      ?.includes(searchLocaleData?.toLowerCase());
    const matchId = `${item?.id?.value}`?.includes(
      searchLocaleData?.toLowerCase(),
    );
    const matchUnit = item?.unit?.label
      ?.toLowerCase()
      ?.includes(searchLocaleData?.toLowerCase());

    return matchName || matchUnit || matchId;
  });

  const handleAddProduct = useCallback(async () => {
    const newData = {
      key: count,
      row: `${count}`,
      qty: 1,
    };
    setData((prev: any) => [...prev, newData]);
    setCount((prev: number) => prev + 1);
  }, [count, setCount, setData]);

  return (
    <HotKeys
      keyMap={keyMap}
      handlers={handlers}
      innerRef={tableRef as React.RefObject<HTMLElement>}
    >
      <Form form={form} component={false}>
        <div style={styles.table}>
          <Row>
            <Col>
              <Search
                value={search}
                //@ts-ignore
                ref={barcodeSearch}
                onChange={onChangeSearch}
                onSearch={onSearch}
                style={styles.barcodeSearch}
                enterButton={
                  <Button
                    icon={<BarcodeIcon style={styles.barcodeIcon} />}
                    style={styles.barcodeButton}
                  />
                }
                placeholder={t(
                  'Sales.All_sales.Invoice.Filter_by_product_barcode',
                )}
                readOnly={props?.responseId}
              />
            </Col>
          </Row>

          <Row className='customer__table'>
            <Col span={24}>
              <Table
                components={components}
                bordered
                loading={loading}
                dataSource={filterDataSource}
                //@ts-ignore
                rowSelection={rowSelection}
                style={styles.table}
                rowKey={(record) => record.key}
                //@ts-ignore
                columns={mergedColumns}
                rowClassName='editable-row'
                pagination={false}
                scroll={{
                  x: 'max-content',
                  scrollToFirstRowOnChange: true,
                }}
                title={() => {
                  return (
                    <Input
                      style={styles.search}
                      placeholder={t(
                        'Sales.All_sales.Invoice.Invoice_table_search_placeholder',
                      )}
                      prefix={<SearchOutlined className='search_icon_color' />}
                      onChange={handelSearchAllData}
                    />
                  );
                }}
                footer={() => (
                  <Button
                    onClick={handleAddProduct}
                    type='primary'
                    disabled={props?.responseId}
                  >
                    {t('Sales.All_sales.Invoice.Add_a_row')}
                  </Button>
                )}
                size='small'
                onRow={(record) => {
                  return {
                    onClick: () => {
                      const key = [record.key];
                      props.setSelectedRowKeys(key);
                    }, // click row
                    onDoubleClick: () => {
                      if (props?.responseId) {
                      } else if (record?.key !== props.editingKey) {
                        edit(record);
                      }
                    }, // double click row
                  };
                }}
                summary={(pageData) => {
                  const qty = pageData.reduce((sum, { qty }) => {
                    return print(
                      //@ts-ignore
                      math.evaluate(`${qty ?? 0}+${sum}`),
                    );
                  }, 0);
                  const total_price = pageData.reduce(
                    (sum, { total_price }) => {
                      return print(
                        //@ts-ignore
                        math.evaluate(`${total_price ?? 0}+${sum}`),
                      );
                    },
                    0,
                  );

                  return (
                    <>
                      <Table.Summary.Row>
                        <TableSummaryCell index={0}>
                          {t('Sales.Customers.Form.Total')}
                        </TableSummaryCell>
                        <TableSummaryCell index={1} />
                        <TableSummaryCell index={2} />
                        <TableSummaryCell
                          index={3}
                          value={qty ?? 0}
                          type='total'
                        />
                        <TableSummaryCell index={4} />
                        <TableSummaryCell
                          index={5}
                          value={fixedNumber(total_price ?? 0)}
                          type='total'
                        />
                        <TableSummaryCell index={6} />
                        <TableSummaryCell index={7} />
                      </Table.Summary.Row>
                    </>
                  );
                }}
              />
            </Col>
          </Row>
        </div>
      </Form>
    </HotKeys>
  );
};

const styles = {
  table: { margin: '0px 0px 24px 0px' },
  barcodeIcon: { fontSize: '22px' },
  barcodeButton: {
    borderStartStartRadius: '0px',
    borderEndStartRadius: '0px',
    borderStartEndRadius: '3px',
    borderEndEndRadius: '3px',
    paddingTop: '4px',
  },
  search: { width: '250px' },
  barcodeSearch: { width: '300px', paddingBottom: '20px' },
};

export default WarehouseAdjustmentEditableTable;
