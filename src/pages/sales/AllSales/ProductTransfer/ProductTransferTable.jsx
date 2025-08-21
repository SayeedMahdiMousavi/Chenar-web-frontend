import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Table,
  Input,
  Button,
  Form,
  message,
  Tooltip,
  Col,
  Row,
  Popover,
  Descriptions,
  Typography,
  Modal,
  Popconfirm,
  Space,
} from "antd";
import { useTranslation } from "react-i18next";
import { HotKeys } from "react-hotkeys";
import axiosInstance from "../../../ApiBaseUrl";
import EditableCell from "./ProductTransferComponents/EditProductTransferColumns";
import { InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { ActionMessage } from "../../../SelfComponents/TranslateComponents/ActionMessage";
import { fixedNumber, math, print } from "../../../../Functions/math";
import { Statistics } from "../../../../components/antd";
import { BarcodeIcon } from "../../../../icons";
import { DeleteButton, EditButton } from "../../../../components";
import { handleFindUnitConversionRate } from "../../../../Functions";
import ShowDate from "../../../SelfComponents/JalaliAntdComponents/ShowDate";

const { Search } = Input;
export const plColumns = [];
const fields =
  "id,name,product_units,unit_conversion,price.unit,price.sales_rate,price.perches_rate,product_barcode.unit,product_barcode.barcode,expiration_date,product_statistic.available,product_statistic.warehouse";
const baseUrl = "/product/items/";
const endUrl =
  "status=active&expand=product_units,product_units.unit,unit_conversion,unit_conversion.unit,price,price.unit,product_barcode,product_barcode.unit,expiration_date";

const dateFormat = "YYYY-MM-DD";
const datePFormat = "jYYYY/jM/jD";
const ProductTransferTable = (props) => {
  const [form] = Form.useForm();
  const tableRef = useRef(null);
  const barcodeSearch = useRef(null);
  const [productItem, setProductItem] = useState({});
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchLocaleData, setSearchLocalData] = useState("");
  const [units, setUnits] = useState([]);

  const getPrice = useCallback((record, unitId) => {
    if (record?.price?.find((item) => item?.unit?.id === unitId)?.sales_rate) {
      return parseFloat(
        record?.price?.find((item) => item?.unit?.id === unitId)?.sales_rate
      )?.toFixed(3);
    } else if (
      record?.unit_conversion?.find((item) => item?.from_unit?.id === unitId)
        ?.ratio ||
      record?.product_units?.find((item) => item?.base_unit === true)?.unit
        ?.id === unitId
    ) {
      // Modal.warning({
      //   title: "Price recording problem",
      //   content: "Please first add price recording of this unit",
      // });
      return;
    } else {
      // Modal.warning({
      //   title: "Unit conversion problem",
      //   content: "Please first add unit conversion of this unit",
      // });
      return;
    }
  }, []);

  const handleCheckStatistic = useCallback(
    (available, totalAvailable, product, warehouse) => {
      if (available < totalAvailable) {
        Modal.warning({
          bodyStyle: { direction: t("Dir") },
          title: (
            <ActionMessage
              values={{ product, warehouse }}
              message={"Sales.All_sales.Invoice.Invoice_no_quantity_message"}
            />
          ),
        });

        return false;
      } else {
        return true;
      }
    },
    [t]
  );

  const findProductStatistics = useCallback(
    ({ prevItems, item, unitId, warehouse, expirationDate }) => {
      
    
      const unitConversion = handleFindUnitConversionRate(
        // item?.unit_conversion,
        item?.unit_conversion,
        unitId,
        item?.product_units
      );
      if (
        !unitConversion && Boolean(unitId)
        ) {
        Modal.warning({
          bodyStyle: { direction: t("Dir") },
          title: (
            <ActionMessage
              values={{ unit: item?.unit?.label, product: item?.name }}
              message="Sales.All_sales.Invoice.Invoice_no_Conversion_message"
            />
          ),
        });

        return false;
      } else {
      
        const productItems = prevItems?.filter(
          (filterItem) =>
            item?.id?.value === filterItem?.id?.value &&
            filterItem?.warehouse_out?.value === warehouse
        );

        const totalAvailable = productItems?.reduce((sum, item) => {
          const conversion = handleFindUnitConversionRate(
            item?.unit_conversion,
            item?.unit?.value,
            item?.product_units
          );

          return fixedNumber(
            print(
              math.evaluate(`(${conversion ?? 0} * ${item?.qty ?? 0}) + ${sum}`)
            )
          );
        }, 0);

        const availableItems = item?.product_statistic?.filter((item) => {
          if (expirationDate) {
            return (
              item?.warehouse === warehouse &&
              item?.expire_date === expirationDate
            );
          } else {
            return item?.warehouse === warehouse;
          }
        });

        const available = availableItems?.reduce((sum, item) => {
          return fixedNumber(
            print(math.evaluate(`${sum}  + ${item?.available ?? 0}`))
          );
        }, 0);

        if (props?.type === "add") {
          return handleCheckStatistic(
            available,
            totalAvailable,
            item?.product?.label,
            item?.warehouse_out?.label
          );
        } else {
          // if (Boolean(item?.product_statistic)) {

          const prevPSItems = props?.prevStatistic?.filter(
            (filterItem) =>
              item?.id?.value === filterItem?.id &&
              filterItem?.warehouse === warehouse
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
            item?.warehouse_out?.label
          );
          // } else {
          //   const result = await axiosInstance.get(
          //     `/product/items/${item?.id?.value}/?expand=product_statistic&fields=product_statistic`
          //   );

          //   const available = result?.data?.product_statistic?.find(
          //     (item) => item?.warehouse === warehouse
          //   )?.available;

          //   const prevPSItems = props?.prevStatistic?.filter(
          //     (filterItem) =>
          //       item?.id?.value === filterItem?.id &&
          //       filterItem?.warehouse === warehouse
          //   );

          //   const totalPrevAvailable = prevPSItems?.reduce((sum, item) => {
          //     return item?.statistic + sum;
          //   }, 0);
          //   const finalAvailable = available + totalPrevAvailable;
          //   return handleCheckStatistic(
          //     finalAvailable,
          //     totalAvailable,
          //     item?.product?.label,
          //     item?.warehouse_out?.label
          //   );
          // }
        }
      }
    },
    [handleCheckStatistic, props.prevStatistic, props.type, t]
  );

  const setData = props.setData;
  const setEditingKey = props.setEditingKey;
  const setSelectedRowKeys = props.setSelectedRowKeys;
  const setCount = props.setCount;

  const cancel = useCallback(() => {
    setEditingKey("");
  }, [setEditingKey]);

  const isEditing = useCallback(
    (record) => {
      return record.key === props.editingKey;
    },
    [props.editingKey]
  );

  const edit = useCallback(
    (record) => {
      const productUnits = record?.product_units?.map((item) => {
        return { id: item?.unit?.id, name: item?.unit?.name };
      });

      form.setFieldsValue({
        id: record?.id,
        product: record?.product,
        unit: record?.unit,
        qty: record?.qty,
        warehouse_out: record?.warehouse_out,
        warehouse_in: record?.warehouse_in,
        expirationDate: record.expirationDate,
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
        const value = {
          ...record,
          id: row?.id,
          product: row?.product,
          unit: row?.unit,
          qty: qty,
          warehouse_out: row?.warehouse_out,
          warehouse_in: row?.warehouse_in,
          expirationDate: row.expirationDate,
        };
        const prevData = [...props.data];
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
          warehouse: row?.warehouse_out?.value,
          expirationDate: row.expirationDate,
        });

        if (ok) {
          setData(newData);
          setEditingKey("");
          tableRef.current.focus();
          setProductItem({});
        }
      } catch (errInfo) {
        // 
      }
    },
    [findProductStatistics, form, props.data, setData, setEditingKey]
  );

  const columns = useMemo(
    () => [
      {
        title: t("Sales.Product_and_services.Product_id"),
        dataIndex: "id",
        width: 140,
        fixed: "left",
        editable: true,
        render: (text) => text?.value,
      },
      {
        title: t("Sales.All_sales.Invoice.Product_name"),
        dataIndex: "product",

        render: (text, record) => <span>{text?.label} &nbsp;</span>,
        editable: true,
        fixed: "left",
      },
      {
        title: t("Sales.All_sales.Invoice.Quantity").toUpperCase(),
        dataIndex: "qty",
        width: 125,
        editable: true,

        render: (text, record) => {
          const available =
            record?.warehouse_out?.value &&
            record?.product_statistic?.find(
              (item) => item?.warehouse === record?.warehouse_out?.value
            )?.available;
          return (
            <Row justify="space-between" gutter={5}>
              <Col>
                <Statistics value={text} />
              </Col>
              <Col>
                {record?.warehouse_out?.value && record?.product?.value && (
                  <Tooltip title={available ?? 0}>
                    <InfoCircleOutlined />
                    &nbsp;
                  </Tooltip>
                )}
              </Col>
            </Row>
          );
        },
      },
      {
        title: t("Sales.Product_and_services.Units.Unit"),
        dataIndex: "unit",
        width: 160,
        editable: true,
        render: (text, record) => (
          <Row justify="space-between" gutter={5}>
            <Col>{text?.label} &nbsp;</Col>
            <Col>
              {record?.unit_conversion?.length > 0 && (
                <Popover
                  arrowPointAtCenter
                  title={t("Sales.Product_and_services.Form.Unit_conversion")}
                  trigger="hover"
                  content={
                    <Descriptions
                      size="small"
                      style={{ width: "150px" }}
                      column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                    >
                      {record?.unit_conversion?.map((item) => (
                        <Descriptions.Item
                          key={item?.id}
                          label={item?.from_unit?.name}
                        >
                          {parseFloat(item?.ratio)}{" "}
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
        title: t("Sales.All_sales.Invoice.Source_warehouse"),
        dataIndex: "warehouse_out",
        editable: true,
        render: (text) => text?.label,
      },

      {
        title: t("Sales.All_sales.Invoice.Destination_warehouse"),
        dataIndex: "warehouse_in",
        editable: true,
        render: (text) => text?.label,
      },
      {
        title: t(
          "Sales.Product_and_services.Inventory.Expiration_date"
        ).toUpperCase(),
        dataIndex: "expirationDate",
        width: 140,
        editable: true,
        render: (value) =>
          value && (
            <ShowDate
              date={value}
              dateFormat={dateFormat}
              datePFormat={datePFormat}
            />
          ),
      },
      {
        title: t("Table.Action").toUpperCase(),
        dataIndex: "action",
        width: 90,
        align: "center",
        fixed: "right",
        render: (text, record) => {
          const editable = isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      save(productItem);
                    }}
                  >
                    {t("Form.Save")}
                  </a>
                  <br />
                  <Popconfirm
                    title={t(
                      "Sales.Product_and_services.Categories.Edit_Message"
                    )}
                    onConfirm={cancel}
                    okText={t("Form.Ok")}
                    cancelText={t("Form.Cancel")}
                  >
                    <Typography.Text
                      type="secondary"
                      style={{ cursor: "pointer" }}
                    >
                      {t("Form.Cancel")}
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
                    itemName={record?.name ? record?.name : " "}
                    onConfirm={() => handleDelete(record?.key)}
                    disabled={props.editingKey !== "" || props?.responseId}
                  />
                </Space>
              )}
            </div>
          );
        },
      },
    ],
    [
      cancel,
      edit,
      handleDelete,
      isEditing,
      productItem,
      props.editingKey,
      props.responseId,
      save,
      t,
    ]
  );

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
          // inputType: col.dataIndex === "age" ? "number" : "text",
          // inputType: checkInput(col.dataIndex),
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
          save: save,
          form,
          units,
          setUnits,
          productItem,
          setProductItem,
          getPrice,
          setLoading,
          dateFormat,
          datePFormat,
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
      // setWarningVisible(false);
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
    SALES_INVOICE_TABLE_MOVE_UP: "up",
    SALES_INVOICE_TABLE_MOVE_DOWN: "down",
    // SALES_INVOICE_ADD_PRODUCT: ["enter", "Enter"],
    SALES_INVOICE_TABLE_MOVE_RIGHT: "right",
    SALES_INVOICE_TABLE_MOVE_LEFT: "left",
    SALES_INVOICE_TABLE__Delete: "del",
    // MARKET_INVOICE_PRINT: "Control+p",
  };

  const handlers = {
    SALES_INVOICE_TABLE_MOVE_UP: (event) => {
      if (props.selectedRowKeys.length > 0) {
        event.preventDefault();
        onClickUp();
      }
    },
    SALES_INVOICE_TABLE_MOVE_DOWN: (event) => {
      if (props.selectedRowKeys.length > 0) {
        event.preventDefault();
        onClickAdd();
      }
    },
    // SALES_INVOICE_ADD_PRODUCT: (event) => {
    //   if (props.editingKey === "") {
    //     // event.preventDefault();
    //     // event.stopPropagation();
    //     // 
    //     props.handleAddProduct();
    //   }
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
      props.setEditingKey("");
      // }
    },

    SALES_INVOICE_TABLE__Delete: (event) => {
      event.preventDefault();
      event.stopPropagation();

      props.setSelectedRowKeys((prev) => {
        const item = props?.data?.find((item) => item?.key === prev?.[0]);

        if (item) {
          Modal.confirm({
            bodyStyle: { direction: t("Dir") },
            title: (
              <Typography.Text>
                <ActionMessage
                  name={item?.product?.label}
                  message="Sales.All_sales.Invoice.Remove_item_message"
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
  const onSelectChange = (selectedRowKeys) => {
    props.setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys: props.selectedRowKeys,
    type: "radio",
    onChange: onSelectChange,
    columnWidth: 60,
    // fixed: true,
    renderCell: (_, __, index) => (
      <div style={{ textAlign: "center", width: "100%" }}>{index + 1}</div>
    ),
    hideSelectAll: true,
    columnTitle: <span>{t("Table.Row")}</span>,
  };

  //barcode search
  const onChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  let onSearch = useCallback(
    async (value) => {
      if (value === "") {
        return;
      } else {
        setLoading(true);
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
            return prev?.map((item, index) => {
              const isBarcodeExist = item?.product_barcode?.find(
                (barcodeItem) =>
                  barcodeItem?.barcode === search &&
                  barcodeItem?.unit?.id === item?.unit?.value
              );
              if (isBarcodeExist) {
                // if (item?.barcode === search) {
                // const element = document?.getElementsByClassName(
                //   "ant-table-body"
                // );

                // element[0].lastElementChild.lastElementChild.children[
                //   index
                // ].scrollIntoView();
                const rowKey = [item.key];
                setSelectedRowKeys(rowKey);
                const newData = {
                  ...item,
                  qty: item?.qty + 1,
                };
                return newData;
              } else {
                return item;
              }
            });
          });

          setLoading(false);
          setSearch("");
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
            const newItem = {
              ...product,
              unit: {
                value: productBarcodeItem?.unit?.id,
                label: productBarcodeItem?.unit?.name,
              },
              key: props?.count,
              row: `${props?.count}`,
              qty: 1,
            };
            const newData = [...props.data, newItem];

            const ok = findProductStatistics({
              prevItems: newData,
              item: product,
              unitId: productBarcodeItem?.unit?.id,
            });
            // if (ok) {
            // const vipPrice = props.getVipPrice(
            //   product?.is_have_vip_price,
            //   product?.price,
            //   productBarcodeItem?.unit?.id,
            //   1
            // );

            setData((prev) => {
              // const newPrice = getPrice(product, productBarcodeItem?.unit?.id);

              // 
              const newCount = props.count + 1;
              setCount(newCount);
              setLoading(false);
              setSearch("");

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
              // } else {
              //   const newCount = props.count + 1;
              //   props.setCount(newCount);
              //   props.setLoading(false);
              //   setSearch("");
              //   return prev;
              // }
            });
          } else {
            await axiosInstance
              .get(
                `${baseUrl}?page=1&page_size=10&product_barcode__barcode=${search}&${endUrl}&fields=${fields}`
              )
              .then((res) => {
                if (res?.data?.results?.length !== 0) {
                  //  
                  //  
                  const product = res?.data?.results?.[0];
                  // const purUnit = product?.product_units?.find(
                  //   (item) => item?.default_sal === true
                  // );
                  const purUnit = product?.product_barcode?.find(
                    (item) => item?.barcode === search
                  );
                  // const newPrice = getPrice(product, purUnit?.unit?.id);
                  const newData = {
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
                    // each_price: newPrice ? parseFloat(newPrice) : 0,
                    // total_price: newPrice ? 1 * parseFloat(newPrice) : 0,
                  };

                  setData((prev) => {
                    const data = [...prev, newData];
                    barcodeSearch.current.blur();
                    edit(newData);
                    return data;
                  });
                  setCount(props.count + 1);
                  setLoading(false);
                  setSearch("");

                  setTimeout(() => {
                    const rowKey = [newData.key];
                    setSelectedRowKeys(rowKey);
                  }, 200);
                } else {
                  message.error(
                    `${t("Sales.All_sales.Invoice.Product_not_found")}`
                  );
                  setLoading(false);
                  setSearch("");
                  return;
                }
              })
              .catch((error) => {
                setLoading(false);
                setSearch("");
                if (error?.response?.data?.barcode?.[0]) {
                  message.error(`${error?.response.data?.barcode?.[0]}`);
                }
              });
          }
        }
      }
    },
    [
      edit,
      findProductStatistics,
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
              {" "}
              <Search
                value={search}
                ref={barcodeSearch}
                onChange={onChangeSearch}
                onSearch={onSearch}
                style={{ width: "300px", paddingBottom: "20px" }}
                enterButton={
                  <Button
                    icon={<BarcodeIcon style={{ fontSize: "22px" }} />}
                    style={{
                      borderStartStartRadius: "0px",
                      borderEndStartRadius: "0px",
                      borderStartEndRadius: "3px",
                      borderEndEndRadius: "3px",
                      paddingTop: "4px",
                    }}
                  />
                }
                placeholder={t(
                  "Sales.All_sales.Invoice.Filter_by_product_barcode"
                )}
                readOnly={Boolean(props?.responseId)}
              />
            </Col>
          </Row>

          <Row className="customer__table">
            <Col span={24}>
              <Table
                title={() => {
                  return (
                    <Input
                      style={{ width: "250px" }}
                      placeholder={t(
                        "Sales.All_sales.Invoice.Invoice_table_search_placeholder"
                      )}
                      prefix={<SearchOutlined className="search_icon_color" />}
                      onChange={handelSearchAllData}
                    />
                  );
                }}
                components={components}
                bordered
                loading={loading}
                dataSource={filterDataSource}
                rowSelection={rowSelection}
                style={styles.table}
                rowKey={(record) => record.key}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={false}
                scroll={{
                  x: "max-content",
                  scrollToFirstRowOnChange: true,
                }}
                size="small"
                onRow={(record) => {
                  return {
                    onClick: () => {
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
                footer={() => (
                  <Button
                    onClick={props?.handleAddProduct}
                    type="primary"
                    disabled={props?.responseId}
                  >
                    {t("Sales.All_sales.Invoice.Add_a_row")}
                  </Button>
                )}
              />
            </Col>
          </Row>
        </div>
      </Form>
    </HotKeys>
  );
};
const styles = {
  margin: { marginBottom: 0 },
  table: { margin: "0px 0px 24px 0px" },
};
export default ProductTransferTable;
