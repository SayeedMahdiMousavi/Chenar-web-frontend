import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  message,
  Tooltip,
  Col,
  Row,
  Popover,
  Descriptions,
  Typography,
  Popconfirm,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { HotKeys } from 'react-hotkeys';
import axiosInstance from '../../../ApiBaseUrl';
import EditableCell from './SalesInvoiceComponents/EditSalesColumns';
import { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { fixedNumber, math, print } from '../../../../Functions/math';
import { ActionMessage } from '../../../SelfComponents/TranslateComponents/ActionMessage';
import { Statistics } from '../../../../components/antd';
import {
  DeleteButton,
  EditButton,
  TableSummaryCell,
} from '../../../../components';
import { BarcodeIcon } from '../../../../icons';
import { handleFindUnitConversionRate } from '../../../../Functions';
import ShowDate from '../../../SelfComponents/JalaliAntdComponents/ShowDate';
// import { Colors } from "../../../colors";

const { Search } = Input;
const dateFormat = 'YYYY-MM-DD';
const datePFormat = 'jYYYY/jM/jD';
export const plColumns = [];
const fields =
  'id,name,product_units,unit_conversion,price.unit,price.sales_rate,price.perches_rate,product_barcode.unit,product_barcode.barcode,expiration_date,product_statistic.available,product_statistic.warehouse';
const baseUrl = '/product/items/';
const endUrl =
  'status=active&expand=product_units,product_units.unit,unit_conversion,unit_conversion.unit,price,price.unit,product_barcode,product_barcode.unit,expiration_date';
let InvoiceTable = (props) => {
  const [form] = Form.useForm();
  const tableRef = useRef(null);
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState([]);
  const [searchLocaleData, setSearchLocalData] = useState('');
  const [productItem, setProductItem] = useState({});

  const handleGetProductPrice = useCallback(
    (record, unitId) => {
      const productPrice = record?.price?.find(
        (item) => item?.unit?.id === unitId
      );
      const sales = fixedNumber(productPrice?.sales_rate ?? 0, 3);
      const purchase = fixedNumber(productPrice?.perches_rate ?? 0, 3);

      if (productPrice) {
        const price =
          props.type === 'sales' ||
          props.type === 'sales_rej' ||
          props.type === 'quotation'
            ? sales
            : purchase;
        const currencyRate = props?.form?.getFieldValue('currencyRate');
        const finalPrice = print(math.evaluate(`${price}/${currencyRate}`));
        if (
          (props.type === 'sales' ||
            props.type === 'sales_rej' ||
            props.type === 'quotation') &&
          sales < purchase
        ) {
          Modal.warning({
            bodyStyle: { direction: t('Dir') },
            title: (
              <ActionMessage
                name={record?.name}
                message={
                  'Sales.All_sales.Invoice.error_message_when_sales_is_less_than_purchase'
                }
              />
            ),
          });
        }
        return fixedNumber(finalPrice);
      } else {
        return;
      }
    },
    [props.form, props.type, t]
  );

  const handleCheckStatistic = useCallback(
    (available, totalAvailable, product, warehouse) => {
      if (available < totalAvailable) {
        Modal.warning({
          bodyStyle: { direction: t('Dir') },
          title: (
            <ActionMessage
              values={{
                product,
                warehouse,
              }}
              message={'Sales.All_sales.Invoice.Invoice_no_quantity_message'}
            />
          ),
        });

        return true;
      } else {
        return true;
      }
    },
    [t]
  );

  const findProductStatistics = useCallback(
    ({ prevItems, item, unitId, expirationDate }) => {
      const warehouse = props?.form?.getFieldValue('warehouseName');

      const warehouseId = item?.warehouse?.value
        ? item?.warehouse?.value
        : warehouse?.value;

      const warehouseName = item?.warehouse?.label
        ? item?.warehouse?.label
        : warehouse?.label;

      if (props?.type !== 'sales') {
        return true;
      } else {
        const unitConversion = handleFindUnitConversionRate(
          item?.unit_conversion,
          unitId,
          item?.product_units
        );
        // console.log("unitConversion" , unitConversion)
        if (unitConversion && Boolean(unitId)) {
          Modal.warning({
            bodyStyle: { direction: t('Dir') },
            title: (
              <ActionMessage
                values={{ unit: item?.unit?.label, product: item?.name }}
                message='Sales.All_sales.Invoice.Invoice_no_Conversion_message'
              />
            ),
          });

          return false;
        } else {
          const productItems = prevItems?.filter((filterItem) => {
            const itemWarehouse = filterItem?.warehouse?.value
              ? filterItem?.warehouse?.value
              : warehouse?.value;
            return (
              item?.id?.value === filterItem?.id?.value &&
              itemWarehouse === warehouseId
            );
          });

          const totalAvailable = productItems?.reduce((sum, item) => {
            const conversion = handleFindUnitConversionRate(
              item?.unit_conversion,
              item?.unit?.value,
              item?.product_units
            );

            return fixedNumber(
              print(
                math.evaluate(
                  `(${conversion ?? 0} * ${item?.qty ?? 0}) + ${sum}`
                )
              )
            );
          }, 0);

          // const availableItems = item?.product_statistic?.filter((item) => {
          //   if (expirationDate) {
          //     return (
          //       item?.warehouse === warehouse &&
          //       item?.expire_date === expirationDate
          //     );
          //   } else {
          //     return item?.warehouse === warehouse;
          //   }
          // });
          const availableItems = item?.product_statistic;

          const available = availableItems?.reduce((sum, item) => {
            return fixedNumber(
              print(math.evaluate(`${sum}  + ${item?.available ?? 0}`))
            );
          }, 0);

          if (props?.place === 'add') {
            return handleCheckStatistic(
              available,
              totalAvailable,
              item?.product?.label,
              warehouseName
            );
          } else {
            const prevPSItems = props?.prevStatistic?.filter(
              (filterItem) =>
                item?.id === filterItem?.id &&
                filterItem?.warehouse === warehouseId
            );

            const totalPrevAvailable = prevPSItems?.reduce((sum, item) => {
              return fixedNumber(
                print(math.evaluate(`${item?.statistic ?? 0} + ${sum}`))
              );
            }, 0);

            const finalAvailable = fixedNumber(
              print(math.evaluate(`${available} + ${totalPrevAvailable}`))
            );

            return handleCheckStatistic(
              finalAvailable,
              totalAvailable,
              item?.product?.label,
              warehouseName
            );
            // } else {
            //   const result = await axiosInstance.get(
            //     `/product/items/${item?.id?.value}/?expand=product_statistic&fields=product_statistic`
            //   );
            //   //
            //   const available = result?.data?.product_statistic?.find(
            //     (item) => item?.warehouse === warehouseId
            //   )?.available;

            //   const prevPSItems = props?.prevStatistic?.filter(
            //     (filterItem) =>
            //       item?.id === filterItem?.id &&
            //       filterItem?.warehouse === warehouseId
            //   );

            //   const totalPrevAvailable = prevPSItems?.reduce((sum, item) => {
            //     return item?.statistic + sum;
            //   }, 0);

            //   const finalAvailable = available + totalPrevAvailable;
            //   return handleCheckStatistic(
            //     finalAvailable,
            //     totalAvailable,
            //     item?.product?.label,
            //     warehouseName
            //   );
            // }
          }

          // const baseUnit = item?.product_units?.find(
          //   (item) => item?.base_unit === true
          // );
          // if (baseUnit?.unit?.id === unitId) {
          //   if (available < qty) {
          //     Modal.warning({
          //       title: t("Sales.All_sales.Invoice.Invoice_no_quantity_message"),
          //     });

          //     return true;
          //   } else {
          //     return true;
          //   }
          // } else {
          //   const unitConversion = handleFindUnitConversionRate(
          //     item?.unit_conversion,
          //     unitId
          //   );
          //   //
          //   if (unitConversion) {
          //     const warehouseCount = qty * unitConversion;

          // } else {
          //   Modal.warning({
          //     title: t("Sales.All_sales.Invoice.Invoice_no_Conversion_message"),
          //   });

          //   return false;
          // }
          // }
        }
      }
    },

    [
      handleCheckStatistic,
      props.form,
      props.place,
      props.prevStatistic,
      props.type,
      t,
    ]
  );

  const isEditing = useCallback(
    (record) => {
      return record.key === props.editingKey;
    },
    [props.editingKey]
  );

  const setData = props?.setData;
  const setEditingKey = props?.setEditingKey;
  const setSelectedRowKeys = props?.setSelectedRowKeys;
  const setCount = props?.setCount;

  const edit = useCallback(
    (record) => {
      setUnits('record', record);
      const productUnits = record?.product_units?.map((item) => {
        return { id: item?.unit?.id, name: item?.unit?.name };
      });
      form.setFieldsValue({
        id: record?.id,
        product: record?.product,
        unit: record?.unit,
        qty: record?.qty,
        each_price: record?.each_price,
        description: record?.description,
        expirationDate: record?.expirationDate && record?.expirationDate,
        warehouse: record?.warehouse,
        discountPercent: record?.discountPercent,
        productStatistic: record?.product_statistic,
        // ...record,
      });

      setUnits(productUnits);
      setEditingKey(record.key);
    },
    [form, setEditingKey]
  );

  const handleDelete = useCallback(
    (key) => {
      setData((prevData) => {
        const data1 = prevData.filter((item) => item?.key !== key);
        setSelectedRowKeys((prev) => {
          const index = prevData?.findIndex((item) => prev?.[0] === item.key);
          const nextItem = prevData?.find(
            (item, ItemIndex) => ItemIndex === index - 1
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
    [setData, setSelectedRowKeys]
  );

  const save = useCallback(
    async (record) => {
      try {
        const row = await form.validateFields();
        // const default_unit = units.find((item) => item?.id === row.default_unit);
        const qty = row?.qty < 0 ? 0 : fixedNumber(row.qty, 3);

        const each_price = row?.each_price > 0 ? row.each_price : 0.01;
        const totalPrice = each_price ? qty * each_price : qty * 0;

        const value = {
          ...record,
          id: row?.id,
          product: row?.product,
          unit: row?.unit,
          qty: qty,
          each_price: each_price,
          description: row?.description,
          total_price: totalPrice,
          expirationDate: row?.expirationDate,
          warehouse: row?.warehouse,
          serial: record?.serial,
          discountPercent: row?.discountPercent ?? 0,
          discount: fixedNumber(
            print(
              math.evaluate(
                `(${totalPrice ?? 0} * ${row?.discountPercent ?? 0}) / 100`
              )
            )
          ),
        };

        let prevData = [...props?.data ?? []];
        const newData = prevData?.map((item) => {
          if (item?.key === record?.key) {
            return { ...item, ...value };
          } else {
            return item;
          }
        });

        const ok = findProductStatistics({
          prevItems: newData,
          item: value,
          unitId: value?.unit?.value,
          expirationDate: row?.expirationDate,
        });

        if (ok) {
          setData(newData);
          setEditingKey('');
          tableRef.current.focus();
          setProductItem({});
        }
      } catch (errInfo) {
        //
      }
    },
    [findProductStatistics, form, props.data, setData, setEditingKey]
  );

  const cancel = useCallback(() => {
    setEditingKey('');
  }, [setEditingKey]);

  const currencySymbol = props?.currency?.symbol;

  const columns = useMemo(() => {
    const data = [
      {
        title: t('Sales.Product_and_services.Product_id').toUpperCase(),
        dataIndex: 'id',
        width: 140,
        editable: true,
        fixed: 'left',
        sorter: (a, b) => a.id?.value - b.id?.value,
        render: (value) => value?.value,
      },
      {
        title: t('Sales.All_sales.Invoice.Product_name'),
        dataIndex: 'product',
        fixed: 'left',
        editable: true,
        sorter: (a, b) => a.product?.label - b.product?.label,
        render: (value) => value?.label,
      },
      {
        title: t('Sales.All_sales.Invoice.Quantity').toUpperCase(),
        dataIndex: 'qty',
        width: 125,
        editable: true,
        sorter: (a, b) => a.qty - b.qty,
        render: (value, record) => {
          if (props?.type === 'sales') {
            const warehouse = props?.form?.getFieldValue('warehouseName');
            const warehouseId = record?.warehouse?.value
              ? record?.warehouse?.value
              : warehouse?.value;
            const available = record?.product_statistic?.find(
              (item) => item?.warehouse === warehouseId
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
          } else {
            return <Statistics value={value} />;
          }
        },
        // align: "center",
      },

      {
        title: t('Sales.Product_and_services.Units.Unit').toUpperCase(),
        dataIndex: 'unit',
        // width: "10%",
        editable: true,
        sorter: (a, b) => a?.unit?.label - b?.unit?.label,
        render: (text, record) => (
          <Row justify='space-between' gutter={5}>
            <Col>{text?.label} &nbsp;</Col>
            <Col>
              {record?.unit_conversion?.length > 0 && (
                <Popover
                  arrowPointAtCenter
                  title={t('Sales.Product_and_services.Form.Unit_conversion')}
                  trigger='hover'
                  content={
                    <Descriptions
                      size='small'
                      style={styles.description}
                      column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                    >
                      {record?.unit_conversion?.map((item) => (
                        <Descriptions.Item
                          key={item?.id}
                          label={`1 ${item?.from_unit?.name}`}
                        >
                          {parseFloat(item?.ratio)}{' '}
                          {
                            record?.product_units?.find(
                              (item) => item?.base_unit === true
                            )?.unit?.name
                          }
                        </Descriptions.Item>
                      ))}
                    </Descriptions>
                  }
                >
                  <InfoCircleOutlined />
                  &nbsp;
                </Popover>
              )}
            </Col>
          </Row>
        ),
      },
      {
        title: t('Warehouse.1').toUpperCase(),
        dataIndex: 'warehouse',
        width: 130,
        editable: true,
        sorter: (a, b) => a?.warehouse?.label - b?.warehouse?.label,
        render: (text) => <React.Fragment>{text?.label}</React.Fragment>,
      },
      {
        title: t('Sales.Product_and_services.Form.Price').toUpperCase(),
        dataIndex: 'each_price',
        sorter: (a, b) => a.each_price - b.each_price,
        width: 125,
        // align: "center",
        render: (text, record) => {
          // const newPrice = text && `${parseFloat(text)}`?.split(".");
          return (
            <Row justify='space-between'>
              <Col style={styles.priceColumn}>
                <Typography.Text ellipsis={true} style={styles.priceColumn}>
                  {text && <Statistics value={text} />}
                  {/* {newPrice?.[1]?.length > 4 && "..."} */}
                </Typography.Text>{' '}
              </Col>
              <Col onClick={(e) => e.stopPropagation()}>
                {record?.price?.length > 0 && (
                  <Popover
                    arrowPointAtCenter
                    title={t('Sales.All_sales.Invoice.Units_price')}
                    trigger='hover'
                    content={
                      <Descriptions
                        size='small'
                        style={styles.description}
                        column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                      >
                        {record?.price?.map((item) => (
                          <Descriptions.Item
                            key={item?.unit?.id}
                            label={`1 ${item?.unit?.name}`}
                          >
                            {parseFloat(
                              props.type === 'sales' ||
                                props.type === 'sales_rej' ||
                                props.type === 'quotation'
                                ? item?.sales_rate
                                : item?.perches_rate
                            )}{' '}
                            {currencySymbol}
                          </Descriptions.Item>
                        ))}
                      </Descriptions>
                    }
                  >
                    <InfoCircleOutlined />
                    &nbsp;
                  </Popover>
                )}
              </Col>
            </Row>
          );
        },
        editable: true,
      },
      {
        title: t('Sales.Customers.Form.Total').toUpperCase(),
        dataIndex: 'total_price',
        sorter: (a, b) => a.total_price - b.total_price,
        width: 125,
        render: (text) => {
          return (
            <Typography.Text ellipsis={true} style={{ width: '125px' }}>
              {text && <Statistics value={text} />}
            </Typography.Text>
          );
        },
      },

      {
        title: t('Discount_percent').toUpperCase(),
        dataIndex: 'discountPercent',
        sorter: (a, b) => a.discountPercent - b.discountPercent,
        editable: !props?.productDiscount,
        render: (value) => {
          return value && <Statistics value={value} />;
        },
      },
      {
        title: t('Sales.Customers.Discount.1').toUpperCase(),
        dataIndex: 'discount',
        sorter: (a, b) => a.discount - b.discount,
        width: 125,
        render: (value) => {
          return value && <Statistics value={value} />;
        },
      },

      {
        title: t(
          'Sales.Product_and_services.Inventory.Expiration_date'
        ).toUpperCase(),
        dataIndex: 'expirationDate',
        width: 140,
        editable: true,
        render: (value) => {
          const date =
            value && props?.type !== 'sales' ? value?.format(dateFormat) : '';

          return date ? (
            date
          ) : (
            <ShowDate
              date={value}
              dateFormat={dateFormat}
              datePFormat={datePFormat}
            />
          );
        },
      },
      {
        title: t('Form.Description').toUpperCase(),
        dataIndex: 'description',
        // width: "15%",
        editable: true,
      },
      {
        title: t('Table.Action').toUpperCase(),
        dataIndex: 'action',
        width: 80,
        align: 'center',
        fixed: 'right',
        render: (text, record) => {
          //
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
                  {editable}
                  <br />
                  <Popconfirm
                    title={t(
                      'Sales.Product_and_services.Categories.Edit_Message'
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
                <Row justify='space-around'>
                  <Col>
                    <EditButton
                      disabled={props?.responseId}
                      onClick={() => edit(record)}
                    />
                  </Col>
                  <Col>
                    <DeleteButton
                      itemName={record?.name ? record?.name : ' '}
                      onConfirm={() => handleDelete(record?.key)}
                      disabled={props.editingKey !== '' || props?.responseId}
                    />
                  </Col>
                </Row>
              )}
            </div>
          );
        },
      },
    ];
    return props.type === 'quotation'
      ? data?.filter((item) => item?.dataIndex !== 'expirationDate')
      : data;
  }, [
    t,
    props.productDiscount,
    props.type,
    props.form,
    props.responseId,
    props.editingKey,
    currencySymbol,
    isEditing,
    cancel,
    save,
    edit,
    handleDelete,
  ]);

  // const BodyTable = (props) => {
  //   return <tbody {...props} id="salesInvoiceTable" />;
  // };
  const components = {
    body: {
      // row: EditableRow,
      // wrapper: BodyTable,
      cell: EditableCell,
    },
  };
  const mergedColumns = columns?.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => {
        return {
          record,
          inputType: col.dataIndex,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
          save: save,
          form,
          globalForm: props?.form,
          units,
          setUnits,
          handleGetProductPrice,
          invoiceType: props.type,
          setLoading,
          setProductItem,
          productItem,
          warehouse: props?.warehouseId,
          datePFormat,
          dateFormat,
        };
      },
    };
  });

  const onClickAdd = useCallback(() => {
    setData((prevData) => {
      setSelectedRowKeys((prev) => {
        const index = prevData?.findIndex((item) => prev?.[0] === item.key);
        const nextItem = prevData?.find(
          (item, ItemIndex) => ItemIndex === index + 1
        );
        if (nextItem) {
          const newKey = nextItem?.key;
          // const element = document?.getElementById("posInvoiceTable");
          // element.children[index + 1] &&
          //   element.children[index + 1].scrollIntoView({
          //     behavior: "smooth",
          //   });
          return [newKey];
        } else {
          return prev;
        }
      });
      return prevData;
    });
  }, [setData, setSelectedRowKeys]);

  const onClickUp = useCallback(() => {
    setData((prevData) => {
      setSelectedRowKeys((prev) => {
        const index = prevData?.findIndex((item) => prev?.[0] === item.key);
        const nextItem = prevData?.find(
          (item, ItemIndex) => ItemIndex === index - 1
        );
        if (nextItem) {
          const newKey = nextItem?.key;
          // const element = document?.getElementById("posInvoiceTable");
          // element.children[index - 1] &&
          //   element.children[index - 1].scrollIntoView({
          //     behavior: "smooth",
          //   });
          return [newKey];
        } else {
          return prev;
        }
      });
      return prevData;
    });
  }, [setData, setSelectedRowKeys]);

  const handleErrorPressEnter = useCallback(
    (close) => {
      setSelectedRowKeys((prev) => {
        handleDelete(prev?.[0]);
        return prev;
      });
      close();
      tableRef.current.focus();
    },
    [handleDelete, setSelectedRowKeys]
  );

  const handelCancelDelete = (close) => {
    close();
    tableRef.current.focus();
  };

  const keyMap = {
    SALES_INVOICE_TABLE_MOVE_UP: 'up',
    SALES_INVOICE_TABLE_MOVE_DOWN: 'down',
    SALES_INVOICE_TABLE_MOVE_RIGHT: 'right',
    SALES_INVOICE_TABLE_MOVE_LEFT: 'left',
    // SALES_INVOICE_ADD_PRODUCT: ["enter", "Enter"],
    // INVOICE_TABLE_MOVE_LEFT: "left",
    SALES_INVOICE_TABLE__Delete: 'del',
    // MARKET_INVOICE_PRINT: "Control+p",
  };

  const handlers = {
    SALES_INVOICE_TABLE_MOVE_UP: (event) => {
      if (props.selectedRowKeys?.length > 0) {
        event.preventDefault();
        onClickUp();
      }
    },    SALES_INVOICE_TABLE_MOVE_DOWN: (event) => {
      if (props.selectedRowKeys?.length > 0) {
        event.preventDefault();
        onClickAdd();
      }
    },    // SALES_INVOICE_ADD_PRODUCT: (event) => {
    //   event.preventDefault();
    //   // event.stopPropagation();

    //   props.handleAddProduct();
    //   //
    //   tableRef.current.focus();
    //   // if (props.editingKey === "") {
    //   // }
    // },
    SALES_INVOICE_TABLE_MOVE_RIGHT: (event) => {
      event.preventDefault();
      event.stopPropagation();
      props.setSelectedRowKeys((prev) => {
        const record = props?.data?.find((item) => item?.key === prev?.[0]);
        if (record) {
          edit(record);
        }
        return prev;
      });
    },
    SALES_INVOICE_TABLE_MOVE_LEFT: (event) => {
      event.preventDefault();
      event.stopPropagation();
      // if (editingKey !== "") {
      props.setEditingKey('');
      // }
    },

    SALES_INVOICE_TABLE__Delete: (event) => {
      event.preventDefault();
      event.stopPropagation();

      // props.setSelectedRowKeys((prev) => {
      //   handleDelete(prev?.[0]);
      //   return prev;
      // });
      props.setSelectedRowKeys((prev) => {
        const item = props?.data?.find((item) => item?.key === prev?.[0]);

        Modal.confirm({
          bodyStyle: { direction: t('Dir') },
          title: (
            <Typography.Text>
              <ActionMessage
                name={item?.product?.label}
                message='Sales.All_sales.Invoice.Remove_item_message'
              />
            </Typography.Text>
          ),
          onOk: handleErrorPressEnter,
          onCancel: handelCancelDelete,
        });
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
  const onSelectChange = (selectedRowKeys) => {
    props.setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys: props.selectedRowKeys,
    type: 'radio',
    onChange: onSelectChange,
    columnWidth: 60,
    // fixed: true,
    renderCell: (_, __, index) => (
      <div style={{ textAlign: 'center', width: '100%' }}>{index + 1}</div>
    ),
    hideSelectAll: true,
    columnTitle: <span>{t('Table.Row')}</span>,
  };

  //barcode search
  const onChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  let onSearch = useCallback(
    async (value) => {
      if (value === '') {
        return;
      } else {
        setLoading(true);
        // const allData = props.data.find((item) => item?.barcode === search);
        const allData = props?.data?.find((item) => {
          const isBarcodeExist = item?.product_barcode?.find(
            (barcodeItem) =>
              barcodeItem?.barcode === search &&
              barcodeItem?.unit?.id === item?.unit?.value
          );
          if (isBarcodeExist) {
            return true;
          } else {
            return false;
          }
        });
        if (allData) {
          setData((prev) => {
            const newItem = prev?.find((item) => {
              const isBarcodeExist = item?.product_barcode?.find(
                (barcodeItem) =>
                  barcodeItem?.barcode === search &&
                  barcodeItem?.unit?.id === item?.unit?.value
              );
              return isBarcodeExist ? true : false;
            });

            const newData = prev?.map((item, index) => {
              if (item?.key === newItem?.key) {
                // const element = document?.getElementsByClassName(
                //   "ant-table-body"
                // );

                // element[0].lastElementChild.lastElementChild.children[
                //   index
                // ].scrollIntoView();

                const rowKey = [item.key];
                setSelectedRowKeys(rowKey);
                const newItem = {
                  ...item,
                  qty: item?.qty + 1,
                  total_price: (item?.qty + 1) * item?.each_price,
                };
                return newItem;
              } else {
                return item;
              }
            });
            // const ok = findProductStatistics({
            //   prevItems: newData,
            //   item: newItem,
            //   unitId: newItem?.unit?.value,
            // });
            return newData;
          });

          setLoading(false);
          setSearch('');
          return;
        } else {
          let productBarcodeItem = {};
          const product = props?.data?.find((item) => {
            const isBarcodeExist = item?.product_barcode?.find(
              (barcodeItem) => barcodeItem?.barcode === search
            );
            if (isBarcodeExist) {
              productBarcodeItem = isBarcodeExist;
              return true;
            } else {
              return false;
            }
          });

          if (product) {
            const newPrice = handleGetProductPrice(
              product,
              productBarcodeItem?.unit?.id
            );

            const newItem = {
              ...product,
              unit: {
                value: productBarcodeItem?.unit?.id,
                label: productBarcodeItem?.unit?.name,
              },
              key: props?.count,
              row: `${props?.count}`,
              qty: 1,
              each_price: newPrice ? parseFloat(newPrice) : 0,
              total_price: newPrice ? 1 * parseFloat(newPrice) : 0,
            };
            const newData = [...props.data , newItem];
            const newCount = props.count + 1;
            setCount(newCount);
            setLoading(false);
            setSearch('');
            const ok = findProductStatistics({
              prevItems: newData,
              item: product,
              unitId: productBarcodeItem?.unit?.id,
            });

            setData((prev) => {
              setTimeout(() => {
                // const element = document?.getElementById("posInvoiceTable");

                // element &&
                //   element?.lastElementChild &&
                //   element.lastElementChild.scrollIntoView({
                //     behavior: "smooth",
                //   });
                const rowKey = [newItem.key];
                setSelectedRowKeys(rowKey);
              }, 50);

              return ok ? newData : prev;
            });
          } else {
            await axiosInstance
              .get(
                `${baseUrl}?page=1&page_size=10&product_barcode__barcode=${search}&${endUrl}&fields=${fields}`
              )
              .then(async (res) => {
                if (res?.data?.results?.length !== 0) {
                  const product = res?.data?.results?.[0];
                  const purUnit = product?.product_barcode?.find(
                    (item) => item?.barcode === search
                  );
                  const newPrice = handleGetProductPrice(
                    product,
                    purUnit?.unit?.id
                  );
                  const newItem = {
                    ...product,
                    key: props.count,
                    row: `${props.count}`,
                    id: { label: product?.id, value: product?.id },
                    product: { label: product?.name, value: product?.id },
                    qty: 1,
                    unit: {
                      value: purUnit?.unit?.id,
                      label: purUnit?.unit?.name,
                    },
                    each_price: newPrice ? parseFloat(newPrice) : 0,
                    total_price: newPrice ? 1 * parseFloat(newPrice) : 0,
                  };
                  const newData = [...props.data, newItem];
                  const ok = findProductStatistics({
                    prevItems: newData,
                    item: newItem,
                    unitId: purUnit?.unit?.id,
                  });
                  setData((prev) => {
                    return ok ? newData : prev;
                  });
                  setCount(props.count + 1);
                  setLoading(false);
                  setSearch('');
                  setTimeout(() => {
                    // const element = document?.getElementsByClassName(
                    //   "ant-table-body"
                    // );
                    // element[0] &&
                    //   element[0].lastElementChild.lastElementChild.lastElementChild.scrollIntoView(
                    //     { behavior: "smooth" }
                    //   );
                    const rowKey = [newItem.key];
                    setSelectedRowKeys(rowKey);
                  }, 200);
                } else {
                  message.error(
                    `${t('Sales.All_sales.Invoice.Product_not_found')}`
                  );
                  setLoading(false);
                  setSearch('');
                  return;
                }

                // }
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
      }
    },
    [
      findProductStatistics,
      handleGetProductPrice,
      props.count,
      props.data,
      search,
      setCount,
      setData,
      setSelectedRowKeys,
      t,
    ]
  );

  const handelSearchAllData = (e) => {
    setSearchLocalData(e.target.value);
  };

  const filterDataSource = props?.data?.filter((item) => {
    const matchName = item?.product?.label
      ?.toLowerCase()
      ?.includes(searchLocaleData?.toLowerCase());
    const matchId = `${item?.id?.value}`?.includes(
      searchLocaleData?.toLowerCase()
    );
    const matchUnit = item?.unit?.label
      ?.toLowerCase()
      ?.includes(searchLocaleData?.toLowerCase());

    return matchName || matchUnit || matchId;
  });

  return (
    <HotKeys keyMap={keyMap} handlers={handlers} innerRef={tableRef}>
      <Form form={form} component={false}>
        <div style={styles.table}>
          <Row>
            <Col>
              <Search
                value={search}
                onChange={onChangeSearch}
                onSearch={onSearch}
                readOnly={Boolean(props?.responseId)}
                style={styles.barcodeSearch}
                enterButton={
                  <Button
                    icon={<BarcodeIcon style={{ fontSize: '22px' }} />}
                    style={{
                      borderStartStartRadius: '0px',
                      borderEndStartRadius: '0px',
                      borderStartEndRadius: '5px',
                      borderEndEndRadius: '5px',
                      paddingTop: '4px',
                    }}
                  />
                }
                placeholder={t(
                  'Sales.All_sales.Invoice.Filter_by_product_barcode'
                )}
              />
            </Col>
            {/* <Col span={1} className="sales_invoice_show_header">
              {props.showHeader === true ? (
                <UpSquareTwoTone
                  className="font"
                  onClick={props.onHeaderCollapsed}
                  twoToneColor={Colors.primaryColor}
                />
              ) : (
                <DownSquareTwoTone
                  className="font"
                  onClick={props.onHeaderCollapsed}
                  twoToneColor={Colors.primaryColor}
                />
              )}
            </Col> */}
          </Row>

          <Row>
            <Col span={24}>
              <Table
                components={components}
                bordered
                loading={loading}
                dataSource={filterDataSource}
                rowSelection={rowSelection}
                style={styles.table}
                rowKey={(record) => record.key}
                columns={mergedColumns}
                rowClassName='editable-row'
                pagination={false}
                title={() => {
                  return (
                    <Input
                      style={{ width: '250px' }}
                      placeholder={t(
                        'Sales.All_sales.Invoice.Invoice_table_search_placeholder'
                      )}
                      // enterButton={t("Form.Search")}
                      // loading
                      prefix={<SearchOutlined className='search_icon_color' />}
                      onChange={handelSearchAllData}
                    />
                  );
                }}
                footer={() => (
                  <Button
                    onClick={props?.handleAddProduct}
                    type='primary'
                    disabled={props?.responseId}
                  >
                    {t('Sales.All_sales.Invoice.Add_a_row')}
                  </Button>
                )}
                scroll={{
                  x: 'max-content',
                  scrollToFirstRowOnChange: true,
                  // y: 100,
                }}
                size='small'
                onRow={(record, rowIndex) => {
                  return {
                    onClick: (event) => {
                      const key = [record.key];
                      props.setSelectedRowKeys(key);
                    }, // click row
                    onDoubleClick: () => {
                      if (props?.responseId) {
                        return;
                      } else if (record?.key !== props.editingKey) {
                        edit(record);
                      }
                    }, // double click row
                  };
                }}
                summary={(pageData) => {
                  const qty = pageData.reduce((sum, { qty }) => {
                    return print(math.evaluate(`${qty ?? 0}+${sum}`));
                  }, 0);
                  const total_price = pageData.reduce(
                    (sum, { total_price }) => {
                      return print(math.evaluate(`${total_price ?? 0}+${sum}`));
                    },
                    0
                  );
                  const discount = pageData.reduce((sum, { discount }) => {
                    return print(math.evaluate(`${discount ?? 0}+${sum}`));
                  }, 0);

                  return (
                    <>
                      <Table.Summary.Row>
                        <TableSummaryCell index={0}>
                          {t('Sales.Customers.Form.Total')}
                        </TableSummaryCell>
                        <TableSummaryCell index={1} />
                        <TableSummaryCell index={2} />
                        <TableSummaryCell index={3} value={qty} type='total' />
                        <TableSummaryCell index={4} />
                        <TableSummaryCell index={5} />
                        <TableSummaryCell index={6} />
                        <TableSummaryCell
                          index={7}
                          value={fixedNumber(total_price ?? 0)}
                          type='total'
                        />
                        <TableSummaryCell index={8} />
                        <TableSummaryCell
                          index={9}
                          value={discount}
                          type='total'
                        />
                        <TableSummaryCell index={10} />
                        <TableSummaryCell index={11} />
                        <TableSummaryCell index={12} />
                      </Table.Summary.Row>
                    </>
                  );
                }}
              />
            </Col>
            {/* <Col span={1} className="sales_invoice_show_footer">
              {props.showFooter === true ? (
                <DownSquareTwoTone
                  className="font"
                  onClick={props.onFooterCollapsed}
                />
              ) : (
                <UpSquareTwoTone
                  className="font"
                  onClick={props.onFooterCollapsed}
                />
              )}
            </Col> */}
          </Row>
        </div>
      </Form>
    </HotKeys>
  );
};
const styles = {
  table: { margin: '0px 0px 12px 0px' },
  description: { width: '150px' },
  priceColumn: { width: '85px' },
  barcodeSearch: { width: '250px', paddingBottom: '10px' },
};

// eslint-disable-next-line no-const-assign
InvoiceTable = React.memo(InvoiceTable);
export default InvoiceTable;
