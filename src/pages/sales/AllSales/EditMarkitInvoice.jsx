import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { print, math, fixedNumber } from "../../../Functions/math";
import { useQuery, useQueryClient, useMutation } from "react-query";
import axiosInstance from "../../ApiBaseUrl";
import { debounce } from "throttle-debounce";
import { useReactToPrint } from "react-to-print";
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  InputNumber,
  message,
  Modal,
  Spin,
  Space,
} from "antd";
import { Colors } from "../../colors";
import { MarketInvoiceTable1 } from "./MarkitInvoiceTable";
import { HotKeys } from "react-hotkeys";
import { POSHeader1 } from "./MarketInvoiceComponents/POSHeader";
import { AllProductItemsWithFilters1 } from "./MarketInvoiceComponents/AllProductItemsWithFilters";
import { ActionMessage } from "../../SelfComponents/TranslateComponents/ActionMessage";
import useGetBaseCurrency from "../../../Hooks/useGetBaseCurrency";
import PrintPosInvoice from "./MarketInvoiceComponents/PrintPosInvoice";
import { handleFindUnitConversionRate } from "../../../Functions";

const graphqlEndPoint = "http://192.168.1.250:4000";

const omitFields =
  "id,name,barcode,photo,is_pine,is_have_vip_price,product_units,unit_conversion,price,product_barcode,vip_price,product_statistic";
const baseUrl = "/product/items/";
const endUrl =
  "status=active&expand=product_units,product_units.unit,unit_conversion,unit_conversion.unit,price,price.unit,product_barcode,product_barcode.unit,vip_price";
const EditMarketInvoice = (props) => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const componentRef = useRef();
  const nameSearch = useRef(null);
  const barcodeSearch = useRef(null);
  const posHotKey = useRef(null);
  const saveRef = useRef(null);
  const responseRef = useRef(false);
  const withDrawRef = useRef(null);
  const barcodeButtonRef = useRef(null);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [productCategoryLoading, setProductCategoryLoading] = useState(false);
  const [editSpin, setEditSpin] = useState(false);
  const [search, setSearch] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentSummery, setPaymentSummery] = useState({});
  const [cash, setCash] = useState("");
  const [discount, setDiscount] = useState(0);
  const [vipDiscount, setVipDiscount] = useState(0);
  const [prevTotal, setPrevTotal] = useState(0);
  const [count, setCount] = useState(1);
  const [customer, setCustomer] = useState({});
  const [response, setResponse] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [prevStatistic, setPrevStatistic] = useState([]);
  const [customerCardValue, setCustomerCardValue] = useState(0);

  const responseId = Boolean(response?.id);

  const vipPercent = useQuery("/product/setting/", async () => {
    const { data } = await axiosInstance.get(`/product/setting/`);
    return data;
  });

  const customerCardId = customer?.cardId;
  const globalVipPercent = vipPercent?.data?.vip_price?.percent;

  const getVipPrice = useCallback(
    (product, isVip, price, unit, qty) => {
      if (isVip && customerCardId) {
        const priceUnit = price?.find(
          (priceItem) => priceItem?.unit?.id === unit
        );
        const productVipPercent =
          product?.vip_price !== null
            ? product?.vip_price?.vip_percent
            : globalVipPercent;
        const vipPrice =
          priceUnit?.sales_rate && priceUnit?.perches_rate && productVipPercent
            ? print(
                math.evaluate(
                  `${Math.round(
                    print(
                      math.evaluate(`((${priceUnit?.sales_rate} - ${priceUnit?.perches_rate}) *
                    ${productVipPercent}) /
                    100`)
                    )
                  )}*${qty}`
                )
              )
            : 0;
        // 
        return vipPrice < 0 ? 0 : vipPrice;
      } else {
        return 0;
      }
    },
    [customerCardId, globalVipPercent]
  );

  const totalWrapperCol = {
    xxl: i18n.language === "en" ? { span: 13 } : { span: 16 },
    xl: i18n.language === "en" ? { span: 13 } : { span: 16 },
    lg: i18n.language === "en" ? { span: 13 } : { span: 16 },
  };
  const totalLabelCol = {
    xxl: i18n.language === "en" ? { span: 11 } : { span: 8 },
    xl: i18n.language === "en" ? { span: 11 } : { span: 8 },
    lg: i18n.language === "en" ? { span: 11 } : { span: 8 },
  };

  const handleErrorPressEnter = (close) => {
    close();
    barcodeButtonRef.current.focus();
  };

  const getPrice = useCallback((record, unitId) => {
    const rate = record?.price?.find((item) => item?.unit?.id === unitId);
    if (rate) {
      const price = parseFloat(rate?.sales_rate)?.toFixed(3);
      const sales = rate?.sales_rate ? fixedNumber(rate?.sales_rate, 3) : 0;
      const purchase = rate?.perches_rate
        ? fixedNumber(rate?.perches_rate, 3)
        : 0;
      if (sales < purchase) {
        Modal.warning({
          // title: "Price  problem",
          title: (
            <ActionMessage
              name={record?.name}
              message={
                "Sales.All_sales.Invoice.error_message_when_sales_is_less_than_purchase"
              }
            />
          ),
          onOk: handleErrorPressEnter,
        });
      }
      return price;
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

  //get base currency
  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyId = baseCurrency?.data?.id;

  const showDrawer = async () => {
    setEditSpin(true);
    props.setVisible(false);
    setVisible(true);
    posHotKey.current.focus();
  };

  const onClose = () => {
    setVisible(false);
  };

  const onSearch = (e) => {
    debounceFunc(e.target.value);
  };

  const debounceFunc = debounce(800, async (value) => {
    setSearch(value);
    queryClient.invalidateQueries(`product/pos/search/`);
  });

  const onChangeTreeSestet = useCallback(async (value) => {
    setCategory(value?.label);
    setProductCategoryLoading(true);
    await axiosInstance
      .get(
        `${baseUrl}?category=${value?.label}&page=1&page_size=16${endUrl}&fields=${omitFields}`
      )
      .then((res) => {
        setCategories(res?.data?.results);
        setProductCategoryLoading(false);
      });
  }, []);

  const onSearchCategories = (value) => {
    debounceCategoryFunc(value);
  };

  const debounceCategoryFunc = debounce(500, async (value) => {
    setSearchCategory(value);
  });

  const findProductStatistics = useCallback(
    (item, type, unitId, qty) => {
      // const newPrevStatistic = prevStatistic?.find(
      //   (prevItem) => prevItem?.id === item?.id
      // )?.statistic;
      // // 
      // const warehouseStatistic = item?.product_statistic?.find(
      //   (item) => item?.warehouse === 106001
      // )?.available;
      // // 
      // const cashNumber = newPrevStatistic
      //   ? warehouseStatistic + newPrevStatistic
      //   : warehouseStatistic;

      const baseUnit = item?.product_units?.find(
        (item) => item?.base_unit === true
      );

      if (baseUnit?.unit?.id === unitId) {
        // 
        // const warehouseCount = qty + 1;
        // if (cashNumber < warehouseCount) {
        //   Modal.warning({
        //     title: t("Sales.All_sales.Invoice.Invoice_no_quantity_message"),
        //     onOk: handleErrorPressEnter,
        //   });

        //   return true;
        // } else {
        //   return true;
        // }
        return true;
      } else {
        const unitConversion = handleFindUnitConversionRate(
          item?.unit_conversion,
          unitId,
          item?.product_units
        );
        // console.log("unitConversion" , unitConversion)
        if (unitConversion) {
          // const warehouseCount = (qty + 1) * unitConversion;

          // if (cashNumber < warehouseCount) {
          //   Modal.warning({
          //     title: t("Sales.All_sales.Invoice.Invoice_no_quantity_message"),
          //     onOk: handleErrorPressEnter,
          //   });
          //   return true;
          // } else {
          //   return true;
          // }
          return true;
        } else {
          Modal.warning({
            bodyStyle: { direction: t("Dir") },
            title: t("Sales.All_sales.Invoice.Invoice_no_Conversion_message"),
            onOk: handleErrorPressEnter,
          });
          return false;
        }
        // }
      }
    },
    [t]
  );

  const onClickProduct = useCallback(
    async (value, type) => {
      // 
      posHotKey.current.focus();
      const allData = data?.find((item) => item?.id === value?.id);

      if (allData) {
        let isExistItem = false;
        const purUnit = allData?.product_units?.find(
          (item) => item?.default_sal === true
        );
        setData((prev) => {
          const newData = prev?.map((item, index) => {
            if (
              item?.id === value?.id &&
              item?.unit?.value === purUnit?.unit?.id
            ) {
              isExistItem = true;
              // const ok = findProductStatistics(
              //   item,
              //   "edit",
              //   item?.unit?.value,
              //   parseFloat(item?.qty)
              // );
              // if (ok) {
              const newQty = item?.qty + 1;
              const vipPrice = getVipPrice(
                item,
                item?.is_have_vip_price,
                item?.price,
                item?.unit?.value,
                newQty
              );
              // 
              const newData = {
                ...item,
                vipPrice: item?.each_price
                  ? parseInt(item?.each_price * (item?.qty + 1) - vipPrice)
                  : 0,
                qty: parseFloat(item?.qty) + 1,
                total_price:
                  item?.each_price &&
                  item?.each_price * (parseFloat(item?.qty) + 1),
              };
              const element = document?.getElementById("posInvoiceTable");
              element &&
                element.children[index].scrollIntoView({ behavior: "smooth" });
              const rowKey = [item?.key];
              // 
              setSelectedRowKeys(rowKey);
              // const newData = {
              //   ...item,
              //   qty: item?.qty + 1,
              //   total_price:
              //     item?.each_price && item?.each_price * (item.qty + 1),
              // };
              return newData;
              // } else {
              //   return item;
              // }
            } else {
              const newData = item;
              return newData;
            }
          });
          return newData;
        });
        if (!isExistItem) {
          setData((prev) => {
            const newPrice = getPrice(allData, purUnit?.unit?.id);
            const ok = findProductStatistics(
              allData,
              "add",
              purUnit?.unit?.id,
              0
            );
            if (ok) {
              const vipPrice = getVipPrice(
                allData,
                allData?.is_have_vip_price,
                allData?.price,
                purUnit?.unit?.id,
                1
              );
              const newItem = {
                ...allData,
                unit: {
                  value: purUnit?.unit?.id,
                  label: purUnit?.unit?.name,
                },
                key: count,
                row: `${count}`,
                qty: 1,
                vipPrice: newPrice ? parseInt(newPrice - vipPrice) : 0,
                each_price: newPrice ? parseFloat(newPrice) : 0,
                total_price: newPrice ? 1 * parseFloat(newPrice) : 0,
              };
              const newData = [...prev, newItem];
              // 
              const newCount = count + 1;
              setCount(newCount);
              setTimeout(() => {
                const element = document?.getElementById("posInvoiceTable");

                element &&
                  element?.lastElementChild &&
                  element.lastElementChild.scrollIntoView({
                    behavior: "smooth",
                  });
                const rowKey = [count];
                setSelectedRowKeys(rowKey);
              }, 50);
              return newData;
            } else {
              const newCount = count + 1;
              setCount(newCount);
              return prev;
            }
          });
        } else {
          isExistItem = false;
        }
        return;
      } else {
        if (type === "search") {
          try {
            setTableLoading(true);
            setSearchLoading(true);
            await axiosInstance
              .get(`${baseUrl}${value?.id}?${endUrl}&fields=${omitFields}`, {
                timeout: 6000,
              })
              .then((res) => {
                if (res?.data) {
                  // 
                  //  
                  const product = res?.data;
                  const purUnit = product?.product_units?.find(
                    (item) => item?.default_sal === true
                  );
                  const newPrice = getPrice(product, purUnit?.unit?.id);
                  const salesUnitId = product?.product_units?.find(
                    (item) => item?.default_sal === true
                  )?.unit?.id;
                  const ok = findProductStatistics(
                    product,
                    "add",
                    salesUnitId,
                    0
                  );
                  // 
                  setData((prev) => {
                    if (ok) {
                      const vipPrice = getVipPrice(
                        product,
                        product?.is_have_vip_price,
                        product?.price,
                        purUnit?.unit?.id,
                        1
                      );
                      const newData = {
                        ...product,
                        key: count,
                        row: `${count}`,
                        id: product?.id,
                        product: product?.name,
                        qty: 1,
                        unit: {
                          value: purUnit?.unit?.id,
                          label: purUnit?.unit?.name,
                        },
                        vipPrice: newPrice ? parseInt(newPrice - vipPrice) : 0,
                        each_price: newPrice ? parseFloat(newPrice) : 0,
                        total_price: newPrice ? 1 * parseFloat(newPrice) : 0,
                      };
                      const newCount = count + 1;
                      setCount(newCount);

                      // setSearch("");
                      barcodeSearch.current.blur();
                      setTimeout(() => {
                        const element =
                          document?.getElementById("posInvoiceTable");

                        element &&
                          element?.lastElementChild &&
                          element.lastElementChild.scrollIntoView({
                            behavior: "smooth",
                          });
                        const rowKey = [count];
                        setSelectedRowKeys(rowKey);
                        setTableLoading(false);
                        setSearchLoading(false);
                      }, 50);
                      const allData = [...prev, newData];
                      return allData;
                    } else {
                      // setSearch("");
                      setTableLoading(false);
                      setSearchLoading(false);
                      return prev;
                    }
                  });

                  // const element = document?.getElementsByClassName(
                  //   "ant-table-body"
                  // );
                  // element[0] &&
                  //   element[0].lastElementChild.lastElementChild.lastElementChild.scrollIntoView(
                  //     { behavior: "smooth" }
                  //   );

                  // 
                  // 
                } else {
                  message.error(
                    `${t("Sales.All_sales.Invoice.Product_not_found")}`
                  );
                  setTableLoading(false);
                  setSearchLoading(false);
                  // setSearch("");
                  return;
                }
                return res?.data;
                // }
              })
              .catch((error) => {
                const newCount = count + 1;
                setCount(newCount);
                setTableLoading(false);
                setSearchLoading(false);
                // 
                // if (error?.response?.data?.barcode?.[0]) {
                //   message.error(`${error?.response?.data?.barcode?.[0]}`);
                //   return error;
                // }
                return error;
              });
          } catch (error) {
            message.error(`${t("Sales.All_sales.Invoice.Product_not_found")}`);
            setTableLoading(false);
            setSearchLoading(false);
            // 
          }
        } else {
          setData((prev) => {
            const salesUnitId = value?.product_units?.find(
              (item) => item?.default_sal === true
            )?.unit?.id;
            const ok = findProductStatistics(value, "add", salesUnitId, 0);
            if (ok) {
              const purUnit = value?.product_units?.find(
                (item) => item?.default_sal === true
              );
              const newPrice = getPrice(value, purUnit?.unit?.id);

              const vipPrice = getVipPrice(
                value,
                value?.is_have_vip_price,
                value?.price,
                purUnit?.unit?.id,
                1
              );
              const newItem = {
                ...value,
                key: count,
                row: `${count}`,
                product: value?.name,
                qty: 1,
                unit: {
                  value: purUnit?.unit?.id,
                  label: purUnit?.unit?.name,
                },
                vipPrice: newPrice ? parseInt(newPrice - vipPrice) : 0,
                each_price: newPrice ? parseFloat(newPrice) : 0,
                total_price: newPrice ? 1 * parseFloat(newPrice) : 0,
              };
              const newCount = count + 1;
              setCount(newCount);
              setTimeout(() => {
                const element = document?.getElementById("posInvoiceTable");
                element &&
                  element?.lastElementChild &&
                  element.lastElementChild.scrollIntoView({
                    behavior: "smooth",
                  });
                const rowKey = [count];

                // 
                setSelectedRowKeys(rowKey);
              }, 100);
              const allData = [...prev, newItem];
              return allData;
            } else {
              return prev;
            }
          });
        }
      }
    },

    [data, getVipPrice, getPrice, findProductStatistics, count, t]
  );

  // const { mutate: mutatePine,isLoading} = useMutation(
  //   async (value) =>
  //     await axiosInstance
  //       .patch(`${baseUrl}${value.name}/`, value.value)
  //       .then((res) => {})
  //       .catch((error) => {
  //         // 
  //       }),
  //   {
  //     onMutate: (value) => {
  //       if (value.type === "category") {
  //         return;
  //       } else {
  //         queryClient.cancelQueries(
  //           value.type === "search"
  //             ? [`product/pos/search/`, search]
  //             : value.type === "best"
  //             ? `${baseUrl}best_selling/`
  //             : `${baseUrl}pin/`
  //         );
  //         const previousValue = queryClient.getQueryData(
  //           value.type === "search"
  //             ? [`product/pos/search/`, search]
  //             : value.type === "best"
  //             ? `${baseUrl}best_selling/`
  //             : `${baseUrl}pin/`
  //         );

  //         const newPin =
  //           value.type === "pin"
  //             ? previousValue?.results?.filter(
  //                 (item) => item?.name !== value?.name
  //               )
  //             : previousValue?.results?.map((item) => {
  //                 if (item?.name === value.name) {
  //                   return { ...item, is_pine: item?.is_pine ? false : true };
  //                 } else {
  //                   return item;
  //                 }
  //               });
  //         const prevData = { ...previousValue, results: newPin };
  //         queryClient.setQueryData(
  //           value.type === "search"
  //             ? [`product/pos/search/`, search]
  //             : value.type === "best"
  //             ? `${baseUrl}best_selling/`
  //             : `${baseUrl}pin/`,
  //           prevData
  //         );
  //         return previousValue;
  //       }
  //     },

  //     onSuccess: (previousValue) => {
  //       queryClient.invalidateQueries(`${baseUrl}pin/`);
  //       // queryClient.invalidateQueries(`product/pos/search/`);
  //       queryClient.invalidateQueries(`${baseUrl}best_selling/`);
  //     },
  //     onSettled: () => {
  //       queryClient.refetchQueries(`${baseUrl}pin/`);
  //       // queryClient.refetchQueries(`product/pos/search/`);
  //       queryClient.refetchQueries(`${baseUrl}best_selling/`);
  //     },
  //   }
  // );

  // let Inactive = false;
  // const changePinProduct = (data, id, type) => {
  //   if (type === "pin" || type === "best") {
  //     const newPin = data?.map((item) => {
  //       return item?.map((item1) => {
  //         if (item1?.id === id) {
  //           // const data = { ...item1, is_pine: false };
  //           return { ...item1, is_pine: item1?.is_pine ? false : true };
  //         } else {
  //           return item1;
  //         }
  //       });
  //     });
  //     return newPin;
  //   } else {
  //     const newPin = data?.map((item) => {
  //       if (item?.id === id) {
  //         // const data = { ...item, is_pine: false };
  //         return { ...item, is_pine: item?.is_pine ? false : true };
  //       } else {
  //         return item;
  //       }
  //     });
  //     return newPin;
  //   }
  // };

  // const onChangePin = async (id, name, is_pine, type) => {
  //   if (type === "category") {
  //     setCategories((prev) => {
  //       const newPin = changePinProduct(prev, id, type);
  //       return newPin;
  //     });
  //   } else {
  //     // queryClient.invalidateQueries(`/product/items/pos/search/`);
  //   }

  //   if (Inactive) {
  //     return;
  //   }
  //   Inactive = true;

  //   try {
  //     mutatePine({
  //       value: { is_pine: is_pine ? false : true },
  //       name: name,
  //       type,
  //     });

  //     Inactive = false;
  //   } catch (info) {
  //     // 
  //     Inactive = false;
  //   }
  // };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    removeAfterPrint: true,
    bodyClass: "market_invoice",
    // fonts: [
    //   { family: "Regular", source: "../../../fonts/IRANSansLightRegular.ttf" },
    // ],
    // print: () => window.print(),
  });

  const addSalesInvoice = async ({ value, usedCardBalance }) => {
    await axiosInstance
      .put(
        `/invoice/sales_invoice/${props?.record?.id}/?expand=coupon_ticket`,
        value,
        {
          timeout: 0,
        }
      )
      .then((res) => {
        setResponse(res?.data);
        responseRef.current = true;
        // const saveProducts = data.sort((a, b) => {
        //   return b.total_price - a.total_price;
        // });
        const total = data?.reduce(
          (sum, item) => {
            if (
              customer?.cardId &&
              item?.is_have_vip_price &&
              vipPercent?.data?.vip_price?.percent &&
              vipPercent?.data?.vip_price?.percent > 0
            ) {
              return {
                vipDiscount: print(
                  math.evaluate(
                    `${sum?.vipDiscount}+(${item?.total_price}-${item?.vipPrice})`
                  )
                ),
                total: print(
                  math.evaluate(`${sum?.total}+${item?.total_price}`)
                ),
              };
            } else {
              return {
                vipDiscount: sum?.vipDiscount,
                total: print(
                  math.evaluate(`${sum?.total}+${item?.total_price}`)
                ),
              };
            }
          },
          { vipDiscount: 0, total: 0 }
        );
        setVipDiscount(total?.vipDiscount);
        setTotalPrice(total?.total);
        setSavedProducts(data);
        setLoading(false);
        message.success(`${t("Sales.All_sales.Invoice.Save_message")}`);
        // saveRef.current.blur();
        posHotKey.current.focus();
        handlePrint();
      })
      .catch((error) => {
        setLoading(false);
        const res = error?.response?.data;

        if (res?.customer?.[0]) {
          message.error(res?.customer?.[0]);
        } else if (res?.warehouse?.[0]) {
          message.error(res?.warehouse?.[0]);
        } else if (res?.currency?.[0]) {
          message.error(res?.currency?.[0]);
        } else if (res?.currency_rate?.[0]) {
          message.error(res?.currency_rate?.[0]);
        } else if (res?.description?.[0]) {
          message.error(res?.description?.[0]);
        } else if (res?.payment_summery) {
          const payment = res?.payment_summery;
          if (payment?.discount?.[0]) {
            message.error(payment?.discount?.[0]);
          } else if (payment?.expense?.[0]) {
            message.error(payment?.expense?.[0]);
          } else if (payment?.net_amount?.[0]) {
            message.error(payment?.net_amount?.[0]);
          } else if (payment?.remain?.[0]) {
            message.error(payment?.remain?.[0]);
          }
        } else if (res?.payment_cash) {
          const cash = res?.payment_cash;
          if (cash?.pay_by?.[0]) {
            message.error(cash?.pay_by?.[0]);
          } else if (cash?.rec_by?.[0]) {
            message.error(cash?.rec_by?.[0]);
          } else if (cash?.date_time?.[0]) {
            message.error(cash?.date_time?.[0]);
          } else if (cash?.amount?.[0]) {
            message.error(cash?.amount?.[0]);
          } else if (cash?.amount_calc?.[0]) {
            message.error(cash?.amount_calc?.[0]);
          } else if (cash?.currency?.[0]) {
            message.error(cash?.currency?.[0]);
          } else if (cash?.currency_calc?.[0]) {
            message.error(cash?.currency_calc?.[0]);
          } else if (cash?.currency_rate?.[0]) {
            message.error(cash?.currency_rate?.[0]);
          } else if (cash?.currency_rate_calc?.[0]) {
            message.error(cash?.currency_rate_calc?.[0]);
          }
        } else if (res?.invoice_item) {
          const item = res?.invoice_item;
          if (item?.[0]?.product?.[0]) {
            message.error(item?.[0]?.product?.[0]);
          } else if (item?.[0]?.qty?.[0]) {
            message.error(item?.[0]?.qty?.[0]);
          } else if (item?.unit?.[0]) {
            message.error(item?.[0]?.unit?.[0]);
          } else if (item?.[0]?.unit_conversion_rate?.[0]) {
            message.error(item?.[0]?.unit_conversion_rate?.[0]);
          } else if (item?.[0]?.each_price?.[0]) {
            message.error(item?.[0]?.each_price?.[0]);
          } else if (item?.[0]?.total_price?.[0]) {
            message.error(item?.[0]?.total_price?.[0]);
          } else if (item?.[0]?.warehouse?.[0]) {
            message.error(item?.[0]?.warehouse?.[0]);
          } else if (item?.[0]?.expire_date?.[0]) {
            message.error(item?.[0]?.expire_date?.[0]);
          } else if (item?.[0]?.description?.[0]) {
            message.error(item?.[0]?.description?.[0]);
          }
        }
      });
  };
  const { mutate: mutateAddSalesInvoice } = useMutation(addSalesInvoice, {
    // onSuccess: () => queryClient.invalidateQueries(`/invoice/sales_invoice/`),
  });

  // 

  let isSendOrder = false;
  const handleSendOrder = () => {
    posHotKey.current.focus();
    form
      .validateFields()
      .then(async (values) => {
        console.log("values" , values)
        setLoading(true);
        if (data?.length < 1) {
          Modal.warning({
            bodyStyle: { direction: t("Dir") },
            title: t("Sales.All_sales.Invoice.Invoice_no_data_message"),
          });
          setLoading(false);
        } else {
          // 
          // 
          if (parseFloat(values?.total) < parseFloat(values?.usedCardBalance)) {
            Modal.warning({
              bodyStyle: { direction: t("Dir") },
              title: t(
                "Sales.All_sales.Invoice.Pos_invoice_less_coupon_amount_message"
              ),
            });
            setLoading(false);
          } else {
            const items = data?.map((item) => {
              // let vip = 0;
              // if (
              //   customer?.cardId &&
              //   item?.is_have_vip_price &&
              //   vipPercent?.data?.vip_price?.percent &&
              //   vipPercent?.data?.vip_price?.percent > 0
              // ) {
              //   const vipPrice = getVipPrice(
              //     item?.is_have_vip_price,
              //     item?.price,
              //     item?.unit?.value,
              //     item?.qty
              //   );
              //   // 
              //   vip = vipPrice;
              // }
              return {
                currency: baseCurrencyId,
                currency_rate: 1,
                unit: item?.unit?.value,
                unit_conversion_rate: handleFindUnitConversionRate(
                  item?.unit_conversion,
                  item?.unit.value,
                  item?.product_units
                ),
                product: item?.id,
                qty: item?.qty ? fixedNumber(item?.qty, 3) : 0,
                // each_price: item?.each_price
                //   ? fixedNumber(item?.each_price, 3)
                //   : 0,
                // total_price: item?.total_price
                //   ? fixedNumber(item?.total_price, 4)
                //   : 0,
                // each_price: item?.each_price
                //   ? fixedNumber(item?.each_price - vip / item?.qty, 3)
                //   : 0,
                // total_price: item?.total_price
                //   ? fixedNumber(item?.total_price - vip, 4)
                //   : 0,
                each_price: item?.each_price
                  ? fixedNumber(item?.vipPrice / item?.qty, 3)
                  : 0,
                total_price: item?.vipPrice
                  ? fixedNumber(item?.vipPrice, 4)
                  : 0,
                description: "",
                warehouse: 106001,
                discount: 0,
                expense: 0,
                discount_type: "simple",
                invoice: props?.record?.id,
                id: item?.itemId ? item?.itemId : 34,
              };
            });

            const receiveCash = {
              // id: paymentSummery?.cash_fin?.id,
              fiscal_year: paymentSummery?.cash_fin?.fiscal_year,
              pay_by: `CUS-${103001}`,
              rec_by: cash !== "" && cash,
              date_time: paymentSummery?.cash_fin?.date_time,
              description: "",
              amount: fixedNumber(values?.total, 10),
              currency: baseCurrencyId,
              currency_rate: 1,
              amount_calc: fixedNumber(values?.total, 10),
              currency_calc: baseCurrencyId,
              currency_rate_calc: 1,
              transaction_type: "invoice",
              related_to: "customer",
            };

            const expenseOfDiscount = {
              // id: paymentSummery?.expense_of_discount?.id,
              fiscal_year: paymentSummery?.expense_of_discount?.fiscal_year,
              pay_by: cash !== "" && cash,
              rec_by: `CUS-103002`,
              date_time: paymentSummery?.expense_of_discount?.date_time,
              description: "",
              amount: values?.usedCardBalance,
              currency: baseCurrencyId,
              currency_rate: 1,
              amount_calc: values?.usedCardBalance,
              currency_calc: baseCurrencyId,
              currency_rate_calc: 1,
              transaction_type: "normal",
              related_to: "customer",
            };

            const allData = {
              vip_customer_card: customer?.cardId && customer?.cardId,
              sales_source: "pos",
              fiscal_year: props?.record?.fiscal_year,
              currency: baseCurrencyId,
              currency_rate: 1,
              date_time: props?.record?.date_time,
              description: "",
              warehouse: 106001,
              customer: `CUS-${103001}`,
              payment_summery: {
                id: paymentSummery?.id,
                discount: 0,
                expense: 0,
                net_amount: parseFloat(values?.total),
                remain: 0,
                invoice_type: "sales",
                coupon_amount: values?.usedCardBalance
                  ? values?.usedCardBalance
                  : 0,
              },
              invoice_item: items,
              payment_cash: receiveCash,
              expense_of_discount:
                values?.usedCardBalance > 0 ? expenseOfDiscount : null,
            };

            if (isSendOrder) {
              return;
            }
            isSendOrder = true;

            try {
              mutateAddSalesInvoice({
                value: allData,
                usedCardBalance: values?.usedCardBalance,
              });

              isSendOrder = false;
            } catch (info) {
              // 
              isSendOrder = false;
            }
          }
        }
      })
      .catch((info) => {
        
      });
  };

  const onCancel = () => {
    setVisible(false);
  };

  const recordId = props?.record?.id;

  const handleAfterVisibleChange = useCallback(
    async (visible) => {
      // 
      if (visible === false) {
        setSearch("");
        setLoading(false);
        setCategory("");
        form.resetFields();
        setCount(1);
        setData([]);
        setSavedProducts([]);
        setResponse({});
        setCustomer({});
        setCustomerCardValue(0);
        setDiscount(0);
        setTotalPrice(0);
        responseRef.current = false;
        setSelectedRowKeys([]);
        setProductCategoryLoading(false);
        setEditingKey("");
        setPaymentSummery({});
        setEditSpin(false);
        setCash("");
        setPrevStatistic([]);
        setPrevTotal(0);
        setVipDiscount(0);
        queryClient.invalidateQueries(`/invoice/sales_invoice/`);
        queryClient.invalidateQueries(`/pay_receive_cash/report/journal/`);
        queryClient.invalidateQueries(
          `/pay_receive_cash/report/journal/journal_result/`
        );
      } else {
        const { data } = await axiosInstance
          .get(
            `/invoice/sales_invoice/${recordId}/?expand=*,invoice_item.product.vip_price,invoice_item.product.product_barcode,invoice_item.product.product_barcode.unit,invoice_item.product.barcode,payment_summery.cash_fin.rec_by,payment_summery.expense_of_discount,invoice_item.product,invoice_item.unit,invoice_item.product.product_units,invoice_item.product.product_units.unit,invoice_item.product.price,invoice_item.product.unit_conversion,invoice_item.product.unit_conversion.unit,invoice_item.product.price.unit`,
            { timeout: 0 }
          )
          .catch((error) => {
            // 
            setEditSpin(false);
            return error;
          });
        // 
        if (data?.vip_customer_card) {
          setCustomer({ cardId: data?.vip_customer_card });
        }

        const newData = data?.invoice_item?.map((item, index) => {
          // const prevStatistic =
          //   item?.product?.product_units?.find((item) => item?.base_unit === true)
          //     ?.unit?.id === item?.unit?.id
          //     ? 1
          //     : findUnitConversion(
          //         item?.product?.unit_conversion,
          //         item?.unit?.id
          //       );
          // setPrevStatistic((prev) => {
          //   const newItem = [
          //     ...prev,
          //     { id: item?.product?.id, statistic: prevStatistic * item?.qty },
          //   ];
          //   return newItem;
          // });
          // const vipPrice = getVipPrice(
          //   item?.is_have_vip_price,
          //   item?.price,
          //   item?.unit?.id,
          //   1
          // );
          // 
          let each_price = item?.each_price;
          let total_price = item?.total_price;
          // && item?.is_have_vip_price
          if (data?.vip_customer_card && item?.product?.is_have_vip_price) {
            const vipPrice = item?.product?.price?.find(
              (priceItem) => priceItem?.unit?.id === item?.unit?.id
            );
            //
            each_price = vipPrice?.sales_rate;
            total_price = vipPrice?.sales_rate * item?.qty;
          }
          const newItem = {
            ...item?.product,
            product: item?.product?.name,
            currency: item.currency,
            key: index + 1,
            currency_rate: item?.currency_rate,
            unit: { value: item?.unit?.id, label: item?.unit?.name },
            qty: parseFloat(item?.qty),
            each_price: parseFloat(each_price),
            total_price: parseFloat(total_price),
            vipPrice: parseFloat(item?.total_price),
            // each_price: item?.each_price,
            // total_price: item?.total_price,
            warehouse: item?.warehouse,
            itemId: item?.id,
            invoice: item?.invoice,
          };

          return newItem;
        });
        setCount(data?.invoice_item?.length + 1);
        // const remainValues = { fiscal_year: data?.fiscal_year };
        setPrevTotal(
          data?.payment_summery?.net_amount
            ? data?.payment_summery?.net_amount
            : 0
        );
        setDiscount(
          data?.payment_summery?.expense_of_discount?.amount
            ? data?.payment_summery?.expense_of_discount?.amount
            : 0
        );
        // 
        form.setFieldsValue({
          usedCardBalance: data?.payment_summery?.expense_of_discount?.amount
            ? data?.payment_summery?.expense_of_discount?.amount
            : 0,
        });
        setPaymentSummery(data?.payment_summery);
        setCash(data?.payment_summery?.cash_fin?.rec_by?.id);
        setData(newData);
        setEditSpin(false);
      }
    },
    [form, recordId, queryClient]
  );

  useEffect(() => {
    const row = form.getFieldsValue();
    const total = data?.reduce(
      (sum, item) => print(math.evaluate(`${sum}+${item?.vipPrice}`)),
      0
    );
    const totalDataValue = total ?? 0;
    // if (totalDataValue <= row.usedCardBalance) {
    //   // 
    //   form.setFieldsValue({
    //     usedCardBalance: totalDataValue,
    //     total: totalDataValue,
    //     remainAmount: print(
    //       math.evaluate(`${totalDataValue}-${paymentSummery?.net_amount}`)
    //     ),
    //   });
    //   setTotalPrice(totalDataValue);
    // } else {
    const newTotal = totalDataValue ?? 0;
    const discount = row?.usedCardBalance ?? 0;
    const remainAmount = totalDataValue
      ? print(math.evaluate(`${newTotal}-(${parseFloat(prevTotal)})`))
      : 0;
    // 
    // 
    form.setFieldsValue({ total: newTotal, remainAmount: remainAmount });
    setTotalPrice(newTotal);
    // }
    // 
  }, [prevTotal, form, data]);

  const handleClearCustomer = useCallback(
    (e) => {
      e.stopPropagation();
      const total = data?.reduce(
        (sum, item) => print(math.evaluate(`${sum}+${item?.vipPrice}`)),
        0
      );
      const newTotal = total ?? 0;
      // setCustomerData({});
      setCustomer({});
      setCustomerCardValue(0);
      form.setFieldsValue({
        cardBalance: 0,
        usedCardBalance: 0,
        total: newTotal ?? 0,
        remainAmount: newTotal ?? 0,
      });
    },
    [data, form]
  );

  const onClickBody = () => {
    posHotKey.current.focus();
  };

  const keyMap = {
    MARKET_INVOICE_PRINT: "shift+p",
    MARKET_INVOICE_NAME_SEARCH: "f1",
    MARKET_INVOICE_BARCODE_SEARCH: "f2",
    MARKET_INVOICE_SAVE_ORDER: "shift+s",
    MARKET_INVOICE_RESET_ORDER: "shift+R",
    MARKET_INVOICE_SELECT_WITHDRAW: "f3",
  };
  // 
  const handlers = {
    MARKET_INVOICE_PRINT: (event) => {
      event.preventDefault();
      event.stopPropagation();
      // 
      if (responseRef.current === true) {
        handlePrint();
      } else {
        message.warning(t("Sales.All_sales.Invoice.Print_error_message"));
      }
    },
    MARKET_INVOICE_NAME_SEARCH: (event) => {
      event.preventDefault();
      event.stopPropagation();
      nameSearch.current.focus();
    },
    MARKET_INVOICE_BARCODE_SEARCH: (event) => {
      event.preventDefault();
      event.stopPropagation();
      nameSearch.current.blur();
      barcodeSearch.current.focus();
    },
    MARKET_INVOICE_RESET_ORDER: (event) => {
      event.preventDefault();
      event.stopPropagation();
      // handleReset();
    },
    MARKET_INVOICE_SAVE_ORDER: (event) => {
      event.preventDefault();
      event.stopPropagation();
      // saveRef.current.focus();

      if (responseRef.current === false) {
        handleSendOrder();
      } else {
        // message.warning(t("Sales.All_sales.Invoice.Print_error_message"));
      }
    },
    MARKET_INVOICE_SELECT_WITHDRAW: (event) => {
      event.preventDefault();
      event.stopPropagation();
      withDrawRef.current.focus({ cursor: "all" });
    },
  };

  return (
    <HotKeys keyMap={keyMap} handlers={handlers} innerRef={posHotKey}>
      <div onClick={onClickBody}>
        <div onClick={showDrawer}>
          {t("Sales.All_sales.Invoice.Edit_POS_invoice")}
        </div>
        <Drawer
          maskClosable={false}
          closable={false}
          height="100%"
          afterVisibleChange={handleAfterVisibleChange}
          onClose={onClose}
          open={visible}
          placement="top"
          destroyOnClose
          bodyStyle={{ padding: "0px", overflowY: "hidden" }}
          footer={false}
          title={
            <POSHeader1
              graphqlEndPoint={graphqlEndPoint}
              onChangeTreeSestet={onChangeTreeSestet}
              searchCategory={searchCategory}
              onSearchCategories={onSearchCategories}
              onSearch={onSearch}
              setSearchCategory={setSearchCategory}
              nameSearch={nameSearch}
              type="editPOS"
            />
          }
          headerStyle={styles.drawerHeader}
        >
          <Form
            hideRequiredMark
            form={form}
            initialValues={{
              total: 0,

              cardBalance: 0,
              usedCardBalance: 0,
            }}
            colon={false}
          >
            <Row>
              <Col span={13} className="height">
                <Spin spinning={editSpin}>
                  <Row gutter={[0, 10]} className="height">
                    <Col span={22} offset={1} className="height">
                      <MarketInvoiceTable1
                        data={data}
                        responseId={responseId}
                        setData={setData}
                        setCount={setCount}
                        count={count}
                        setVisible={setVisible}
                        setSelectedRowKeys={setSelectedRowKeys}
                        selectedRowKeys={selectedRowKeys}
                        setCategory={setCategory}
                        setSearch={setSearch}
                        getPrice={getPrice}
                        baseUrl={baseUrl}
                        endUrl={endUrl}
                        setCustomer={setCustomer}
                        customer={customer}
                        handleClearCustomer={handleClearCustomer}
                        setCustomerCardValue={setCustomerCardValue}
                        form={form}
                        barcodeSearch={barcodeSearch}
                        currency={baseCurrency?.data}
                        setEditingKey={setEditingKey}
                        editingKey={editingKey}
                        posHotKey={posHotKey}
                        type="edit"
                        findProductStatistics={findProductStatistics}
                        barcodeButtonRef={barcodeButtonRef}
                        loading={tableLoading}
                        setLoading={setTableLoading}
                        omitFields={omitFields}
                        getVipPrice={getVipPrice}
                      />
                    </Col>
                    <Col span={22} offset={1}>
                      <Row>
                        <Col style={styles.footer}>
                          <Row gutter={15}>
                            <Col span={12}>
                              <Form.Item
                                name="total"
                                label={t("Sales.Customers.Form.Total")}
                                labelCol={totalLabelCol}
                                wrapperCol={totalWrapperCol}
                                labelAlign="right"
                                style={styles.margin}
                              >
                                <InputNumber
                                  type="number"
                                  className="num"
                                  inputMode="numeric"
                                  disabled
                                  style={styles.input}
                                  // size="small"
                                />
                              </Form.Item>
                              <Form.Item
                                name="remainAmount"
                                label={t(
                                  "Sales.All_sales.Invoice.Remain_amount"
                                )}
                                style={styles.margin}
                                labelCol={totalLabelCol}
                                wrapperCol={totalWrapperCol}
                              >
                                <InputNumber
                                  disabled
                                  style={styles.input}
                                  type="number"
                                  className="num"
                                  inputMode="numeric"
                                  // size="small"
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                name="usedCardBalance"
                                label={t("Sales.All_sales.Invoice.With_draw")}
                                style={styles.margin}
                                labelCol={totalLabelCol}
                                wrapperCol={totalWrapperCol}
                              >
                                <InputNumber
                                  min={0}
                                  type="number"
                                  disabled
                                  style={styles.input}
                                  inputMode="numeric"
                                  className="num"
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Space size={33} style={{ marginTop: "10px" }}>
                            <Button
                              onClick={handlePrint}
                              style={styles.button}
                              disabled={!response?.id}
                            >
                              {t("Sales.All_sales.Invoice.Print_order")}
                              <div
                                style={{
                                  display: "none",
                                  overflow: "hidden",
                                  height: "0",
                                }}
                              >
                                <PrintPosInvoice
                                  printRef={componentRef}
                                  data={savedProducts}
                                  type="edit"
                                  discount={discount}
                                  vipDiscount={vipDiscount}
                                  totalPrice={totalPrice}
                                  response={response}
                                />
                              </div>
                            </Button>

                            <Form.Item style={{ marginBottom: "0px" }}>
                              <Button
                                // shape="round"
                                disabled={response?.id || editingKey !== ""}
                                ref={saveRef}
                                type="primary"
                                onClick={handleSendOrder}
                                // htmlType="submit"
                                loading={loading}
                                style={styles.button}
                              >
                                {t("Sales.All_sales.Invoice.Send_order")}
                              </Button>
                            </Form.Item>
                            <Button
                              onClick={onCancel}
                              style={styles.button}
                              // disabled={response?.id}
                            >
                              {t("Form.Close")}
                            </Button>
                          </Space>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Spin>
              </Col>
              <Col
                span={11}
                className="market_invoice_product num"
                id="posProductList"
                style={{
                  height: `calc(100vh - 60px)`,
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                <AllProductItemsWithFilters1
                  search={search}
                  categories={categories}
                  category={category}
                  open={visible}
                  productCategoryLoading={productCategoryLoading}
                  setCategories={setCategories}
                  onClickProduct={onClickProduct}
                  searchLoading={searchLoading}
                />
              </Col>
            </Row>
          </Form>
        </Drawer>
      </div>
    </HotKeys>
  );
};
const styles = {
  drawerHeader: {
    background: `${Colors.primaryColor}`,
    padding: "0px 24px 0px 24px",
    height: "60px",
    borderBottom: "none",
  },
  margin: { marginBottom: "10px" },
  cardBody: {
    padding: "10px 5px",
    height: "50px",
    background: "#fafafa",
    lineHeight: "20px",
  },
  cardTitle: {
    margin: 0,
    fontSize: 13,
    textAlign: "center",
  },
  cardImage: {
    height: "85px",
    width: "100%",
  },
  productItem: { paddingInlineEnd: "10px" },
  cardCover: {
    height: "84px",
  },
  spin: { margin: "50px" },
  button: { height: "37px", borderRadius: "4px" },
  input: { borderRadius: "4px" },
  footer: { width: "475px" },
};
// const mapStateToProps = (state) => {
//   return {
//     rtl: state.direction.rtl,
//     ltr: state.direction.ltr,
//   };
// };

export default EditMarketInvoice;
// export default connect(mapStateToProps)(MarketInvoice);
