import React, {
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import { debounce } from 'throttle-debounce';
import { print, math, fixedNumber } from '../../../Functions/math';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import { useReactToPrint } from 'react-to-print';
import { Drawer, Form, Col, Row, message, Modal } from 'antd';
import { MarketInvoiceTable1 } from './MarkitInvoiceTable';
import { HotKeys } from 'react-hotkeys';
import { gql } from 'graphql-request';
import { graphqlApiBase } from '../../graphqlApiBase';
import { POSHeader1 } from './MarketInvoiceComponents/POSHeader';
import { AllProductItemsWithFilters1 } from './MarketInvoiceComponents/AllProductItemsWithFilters';
import axios from 'axios';
import {
  PAY_ACCESS_TOKEN,
  PAY_REFRESH_TOKEN,
} from '../../LocalStorageVariables';
import { utcDate } from '../../../Functions/utcDate';
import { ActionMessage } from '../../SelfComponents/TranslateComponents/ActionMessage';
import useGetBaseCurrency from '../../../Hooks/useGetBaseCurrency';
import PrintPosInvoice from './MarketInvoiceComponents/PrintPosInvoice';
import { Colors } from '../../colors';
import PosInvoiceFooter from './MarketInvoiceComponents/Footer';
import { handleFindUnitConversionRate, manageErrors } from '../../../Functions';
import { SALES_INVOICE_LIST } from '../../../constants/routes';
import { manageNetworkError } from '../../../Functions/manageNetworkError';

const invoiceFixedNumber = (value) => {
  const newValue = fixedNumber(value, 20);
  return newValue;
};

// const graphqlEndPoint = "https://anarback.xyz";
const graphqlEndPoint = 'http://192.168.1.250:4000';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const omitFields =
  'id,name,barcode,photo,is_pine,is_have_vip_price,product_units,unit_conversion,price,product_barcode,vip_price,product_statistic';
const baseUrl = '/product/items/';
const endUrl =
  'status=active&expand=product_units,product_units.unit,unit_conversion,unit_conversion.unit,price,price.unit,product_barcode,product_barcode.unit,vip_price';
const MarketInvoice = (props) => {
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
  const [editingKey, setEditingKey] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [productCategoryLoading, setProductCategoryLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [vipDiscount, setVipDiscount] = useState(0);
  const [count, setCount] = useState(1);
  const [isSendCardUsedValue, setIsSendCardUsedValue] = useState(false);
  const [customer, setCustomer] = useState({});
  const [response, setResponse] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [customerCardValue, setCustomerCardValue] = useState(0);
  const [invoiceHeader, setInvoiceHeader] = useState({});

  const responseId = Boolean(response?.id);

  useLayoutEffect(() => {
    (async () => {
      if (localStorage?.getItem(PAY_REFRESH_TOKEN)) {
        await axios
          .get(`${graphqlEndPoint}/renewTokens`, {
            headers: {
              'access-token': localStorage.getItem(PAY_ACCESS_TOKEN),
              'refresh-token': localStorage.getItem(PAY_REFRESH_TOKEN),
            },
          })
          .then((res) => {
            localStorage.setItem(PAY_REFRESH_TOKEN, res?.data['refresh-token']);
            localStorage.setItem(PAY_ACCESS_TOKEN, res?.data['access-token']);
            return res?.data['access-token'];
          })
          .catch((error) => {
            if (error.response?.data === 'refresh token is invalid') {
              localStorage.removeItem(PAY_REFRESH_TOKEN);
              localStorage.removeItem(PAY_ACCESS_TOKEN);
            }
          });
      }
    })();
  }, []);

  const vipPercent = useQuery('/product/setting/', async () => {
    const { data } = await axiosInstance.get(`/product/setting/`);
    return data;
  });

  const customerCardId = customer?.cardId;
  const globalVipPercent = vipPercent?.data?.vip_price?.percent;

  const getVipPrice = useCallback(
    (product, isVip, price, unit, qty) => {
      const cardId = customerCardId;
      if (isVip && cardId) {
        const priceUnit = price?.find(
          (priceItem) => priceItem?.unit?.id === unit,
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
                    100`),
                    ),
                  )}*${qty}`,
                ),
              )
            : 0;
        //
        return vipPrice < 0 ? 0 : vipPrice;
      } else {
        return 0;
      }
    },
    [customerCardId, globalVipPercent],
  );

  const handleErrorPressEnter = (close) => {
    // setWarningVisible(false);
    close();
    barcodeButtonRef.current.focus();
  };

  const getPrice = useCallback(
    (record, unit) => {
      const unitId = unit?.value;
      const rate = record?.price?.find((item) => item?.unit?.id === unitId);
      console.log('record', record);
      const sales = rate?.sales_rate ? fixedNumber(rate?.sales_rate, 3) : 0;
      const purchase = rate?.perches_rate
        ? fixedNumber(rate?.perches_rate, 3)
        : 0;

      if (rate && sales > 0) {
        const price = parseFloat(rate?.sales_rate)?.toFixed(3);

        if (sales < purchase) {
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
            onOk: handleErrorPressEnter,
          });
          return price;
        } else {
          return price;
        }
      } else if (!rate?.sales_rate || sales <= 0) {
        console.log('sales', sales);
        message.error({
          content: (
            <ActionMessage
              values={{ unit: unit?.label, product: record?.name }}
              message='Pos_invoice_price_not_exist'
            />
          ),
          duration: 10,
        });
        // Modal.warning({
        //   title: (
        //     <ActionMessage
        //       values={{ unit: record?.unit?.label, product: record?.name }}
        //       message="Pos_invoice_price_not_exist"
        //     />
        //   ),
        // });
        return;
      } else {
        // Modal.warning({
        //   title: "Unit conversion problem",
        //   content: "Please first add unit conversion of this unit",
        // });
        return;
      }
    },
    [t],
  );

  //get base currency
  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyId = baseCurrency?.data?.id;

  const showDrawer = () => {
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
    setCategory(value?.label ?? '');
    setProductCategoryLoading(true);
    await axiosInstance
      .get(
        `${baseUrl}?category=${value?.label}&page=1&page_size=16&${endUrl}&fields=${omitFields}`,
      )
      .then((res) => {
        setCategories(res?.data?.results);
        setProductCategoryLoading(false);
      });
  }, []);

  const onSearchCategories = (value) => {
    debounceCategoryFunc(value);
  };
  const debounceCategoryFunc = debounce(500, (value) => {
    setSearchCategory(value);
  });

  const findProductStatistics = useCallback(
    (item, type, unit, qty) => {
      const unitId = unit?.value;
      // const available = item?.product_statistic?.reduce(
      //   (sum, item) => item?.available + sum,
      //   0
      // );
      // const cashNumber = item?.product_statistic?.find(
      //   (item) => item?.warehouse === 106001
      // )?.available;
      //
      const baseUnit = item?.product_units?.find(
        (item) => item?.base_unit === true,
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
          item?.product_units,
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
            bodyStyle: { direction: t('Dir') },
            title: (
              <ActionMessage
                values={{ unit: unit?.label, product: item?.name }}
                message='Sales.All_sales.Invoice.Invoice_no_Conversion_message'
              />
            ),
            onOk: handleErrorPressEnter,
          });

          return false;
        }
      }
    },
    [t],
  );

  const onClickProduct = useCallback(
    async (value, type) => {
      if (responseId) {
        return;
      }
      posHotKey.current.focus();

      const allData = data?.find((item) => item?.id === value?.id);
      //
      if (allData) {
        let isExistItem = false;
        const purUnit = allData?.product_units?.find(
          (item) => item?.default_sal === true,
        );
        setData((prev) => {
          const newData = prev?.map((item, index) => {
            if (
              item?.id === value?.id &&
              item?.unit?.value === purUnit?.unit?.id
            ) {
              isExistItem = true;
              // const isOk = findProductStatistics(
              //   item,
              //   "edit",
              //   item?.unit?.value,
              //   item?.qty
              // );

              const vipPrice = getVipPrice(
                item,
                item?.is_have_vip_price,
                item?.price,
                item?.unit?.value,
                item?.qty + 1,
              );

              // if (isOk) {
              const newData = {
                ...item,
                vipPrice: item?.each_price
                  ? parseInt(item?.each_price * (item?.qty + 1) - vipPrice)
                  : 0,
                qty: item?.qty + 1,
                total_price:
                  item?.each_price &&
                  parseInt(item?.each_price * (item?.qty + 1)),
              };
              const element = document?.getElementById('posInvoiceTable');
              element &&
                element.children[index].scrollIntoView({
                  behavior: 'smooth',
                });
              const rowKey = [item?.key];
              //
              setSelectedRowKeys(rowKey);
              return newData;
            } else {
              return item;
            }
            // } else {
            //   const newData = item;
            //   return newData;
            // }
          });
          return newData;
        });
        if (!isExistItem) {
          setData((prev) => {
            const unit = {
              value: purUnit?.unit?.id,
              label: purUnit?.unit?.name,
            };
            const newPrice = getPrice(allData, unit);

            const ok = findProductStatistics(allData, 'add', unit, 0);
            if (ok && Boolean(newPrice)) {
              const vipPrice = getVipPrice(
                allData,
                allData?.is_have_vip_price,
                allData?.price,
                purUnit?.unit?.id,
                1,
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

              const newCount = count + 1;
              setCount(newCount);
              setTimeout(() => {
                const element = document?.getElementById('posInvoiceTable');

                element &&
                  element?.lastElementChild &&
                  element.lastElementChild.scrollIntoView({
                    behavior: 'smooth',
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
        if (type === 'search') {
          try {
            setTableLoading(true);
            setSearchLoading(true);
            await axiosInstance
              .get(`${baseUrl}${value?.id}?${endUrl}&fields=${omitFields}`, {
                timeout: 6000,
              })
              .then((res) => {
                if (res?.data) {
                  const product = res?.data;
                  const purUnit = product?.product_units?.find(
                    (item) => item?.default_sal === true,
                  );
                  const unit = {
                    value: purUnit?.unit?.id,
                    label: purUnit?.unit?.name,
                  };
                  const newPrice = getPrice(product, unit);

                  const ok = findProductStatistics(product, 'add', unit, 0);
                  //

                  setData((prev) => {
                    if (ok && Boolean(newPrice)) {
                      const vipPrice = getVipPrice(
                        res?.data,
                        product?.is_have_vip_price,
                        product?.price,
                        purUnit?.unit?.id,
                        1,
                      );
                      //
                      const newData = {
                        ...product,
                        key: count,
                        row: `${count}`,
                        id: product?.id,
                        vipPrice: newPrice ? parseInt(newPrice - vipPrice) : 0,
                        product: product?.name,
                        qty: 1,
                        unit: {
                          value: purUnit?.unit?.id,
                          label: purUnit?.unit?.name,
                        },
                        each_price: newPrice ? parseFloat(newPrice) : 0,
                        total_price: newPrice ? 1 * parseFloat(newPrice) : 0,
                      };
                      const newCount = count + 1;
                      setCount(newCount);

                      // setSearch("");
                      barcodeSearch.current.blur();
                      setTimeout(() => {
                        const element =
                          document?.getElementById('posInvoiceTable');

                        element &&
                          element?.lastElementChild &&
                          element.lastElementChild.scrollIntoView({
                            behavior: 'smooth',
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
                    `${t('Sales.All_sales.Invoice.Product_not_found')}`,
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
                manageErrors(error);
                manageNetworkError(error);

                //
                // if (res?.barcode?.[0]) {
                //   message.error(`${error?.response?.data?.barcode?.[0]}`);
                //   return error;
                // }
                return error;
              });
          } catch (error) {
            message.error(`${t('Sales.All_sales.Invoice.Product_not_found')}`);
            setTableLoading(false);
            setSearchLoading(false);
            //
          }
        } else {
          setData((prev) => {
            const purUnit = value?.product_units?.find(
              (item) => item?.default_sal === true,
            );

            const unit = {
              value: purUnit?.unit?.id,
              label: purUnit?.unit?.name,
            };

            const newPrice = getPrice(value, unit);

            const isOk = findProductStatistics(value, 'add', unit, 0);
            if (isOk && Boolean(newPrice)) {
              const vipPrice = getVipPrice(
                value,
                value?.is_have_vip_price,
                value?.price,
                purUnit?.unit?.id,
                1,
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
                const element = document?.getElementById('posInvoiceTable');
                element &&
                  element?.lastElementChild &&
                  element.lastElementChild.scrollIntoView({
                    behavior: 'smooth',
                  });
                const rowKey = [count];

                //
                setSelectedRowKeys(rowKey);
              }, 50);
              const allData = [...prev, newItem];
              return allData;
            } else {
              return prev;
            }
          });
        }
      }
    },

    [count, data, findProductStatistics, getPrice, getVipPrice, t, responseId],
  );

  const pageStyle = `@page{
    margin:0mm 
  }`;

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    removeAfterPrint: true,
    bodyClass: 'market_invoice',
    pageStyle: pageStyle,
  });

  const { mutate: mutateSendBalance } = useMutation(async (value) => {
    await graphqlApiBase(
      gql`
        mutation ($data: transactionMakeData!) {
          transactionMake(data: $data) {
            __typename
            ... on TransactionDone {
              done
            }
            ... on TransactionFailed {
              message {
                text
                language
              }
            }
          }
        }
      `,
      { data: value?.value },
    )
      .then((res) => {
        if (res?.transactionMake?.__typename === 'TransactionFailed') {
          if (i18n?.language === 'en') {
            const error = res?.transactionMake?.message?.find(
              (item) => item?.language === 'ENGLISH',
            );
            message.error(
              error ? error?.text : res?.transactionMake?.message?.[0]?.text,
            );
          } else if (i18n?.language === 'ps') {
            const error = res?.transactionMake?.message?.find(
              (item) => item?.language === 'PASHTO',
            );
            message.error(
              error ? error?.text : res?.transactionMake?.message?.[0]?.text,
            );
          } else {
            const error = res?.transactionMake?.message?.find(
              (item) => item?.language === 'PERSIAN',
            );
            message.error(
              error ? error?.text : res?.transactionMake?.message?.[0]?.text,
            );
          }
        } else {
          if (value?.type === 'credit') {
            message.success(
              `موفقانه ${value?.value?.amount} افغانی از حساب ${customer?.user?.firstName}
              ${customer?.user?.lastName} کم شد.`,
            );
            setIsSendCardUsedValue(true);
          } else {
            // message.success(
            //   `موفقانه ${value?.value?.amount}  به حساب مشتری اضافه شد.`
            // );
          }
        }
      })
      .catch((error) => {
        //
        // setLoading(false);
      });
  });

  const id = localStorage.getItem('user_id');

  const userData = useQuery('/user_account/user_profile/getCash/', async () => {
    const result = await axiosInstance.get(
      `/user_account/user_profile/${id}/?expand=user_staff.cash&fields=id,user_staff`,
    );
    return result.data;
  });

  const addSalesInvoice = async ({ value, usedCardBalance }) => {
    return await axiosInstance
      .post(`${SALES_INVOICE_LIST}?expand=coupon_ticket`, value, {
        timeout: 0,
      })
      .then((res) => {
        //
        responseRef.current = true;
        // const newProducts = data.sort((a, b) => {
        //   return b.total_price - a.total_price;
        // });

        // const vipDiscount = data?.reduce((sum, item) => {
        //   return sum + (item?.total_price - item?.vipPrice);
        // }, 0);
        const allData = [...data];
        const total = allData?.reduce(
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
                    `${sum?.vipDiscount}+(${item?.total_price}-${item?.vipPrice})`,
                  ),
                ),
                total: print(
                  math.evaluate(`${sum?.total}+${item?.total_price}`),
                ),
              };
            } else {
              return {
                vipDiscount: sum?.vipDiscount,
                total: print(
                  math.evaluate(`${sum?.total}+${item?.total_price}`),
                ),
              };
            }
          },
          { vipDiscount: 0, total: 0 },
        );
        setVipDiscount(total?.vipDiscount);
        setTotalPrice(total?.total);
        setSavedProducts(data);

        message.success(`${t('Sales.All_sales.Invoice.Save_message')}`);
        // saveRef.current.blur();
        posHotKey.current.focus();

        if (customer?.cardId) {
          (async () => {
            const balanceData = {
              cardUniqueCode: customer?.cardId,
              amount: res?.data?.coupon_ticket?.discount_total
                ? parseFloat(
                    res?.data?.coupon_ticket?.discount_total?.toFixed(1),
                  )
                : 0,
              exchangeType: 'CARD',
              paymentFor: 'BONUS',
              actionOnCard: 'DEBIT',
              description: 'جایزه از طرف فروشگاه انار',
              pinCode: customer?.pinCode,
            };
            mutateSendBalance({ value: balanceData, type: 'debit' }).then(
              () => {
                (async () => {
                  await axiosInstance
                    .get(
                      `/coupon_ticket/${res?.data?.coupon_ticket?.code}/make_unusable`,
                    )
                    .then((res) => {
                      //
                    })
                    .catch((error) => {
                      //
                    });
                })();
                // setCustomer({});
                // setCustomerCardValue(0);
              },
            );
          })();
        }
        setResponse(res?.data);

        setTimeout(() => {
          setLoading(false);
          handlePrint();
        }, 2000);

        // if (usedCardBalance > 0 && customer?.cardId) {
        //   (async () => {
        //     setLoading(true);
        //     const balanceData = {
        //       cardUniqueCode: customer?.cardId,
        //       amount: usedCardBalance,
        //       exchangeType: "CARD",
        //       paymentFor: "BUY",
        //       actionOnCard: "CREDIT",
        //       description: "خرید فروشگاه انار",
        //       pinCode: customer?.pinCode,
        //     };
        //     mutateSendBalance(balanceData);
        //   })();
        // }
        return res;
      })
      .catch((error) => {
        const res = error?.response?.data;
        setLoading(false);
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
        return error;
      });
  };

  const { mutate: mutateAddSalesInvoice, reset } = useMutation(
    addSalesInvoice,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`${SALES_INVOICE_LIST}`);
        queryClient.invalidateQueries(`/pay_receive_cash/report/journal/`);

        queryClient.invalidateQueries(
          `/pay_receive_cash/report/journal/journal_result/`,
        );
      },
    },
  );

  const handleSendOrder = () => {
    form.validateFields().then((values) => {
      const id = response?.id;
      if (id) {
        return;
      } else {
        if (parseFloat(values?.payCash) > parseFloat(values?.total)) {
          message.error(t('Invoice_pos_pay_cash_error_message'));
          return;
        } else {
          let newData = [];
          setData((prev) => {
            //
            newData = prev;
            return prev;
          });

          if (newData?.length < 1) {
            Modal.warning({
              bodyStyle: { direction: t('Dir') },
              title: t('Sales.All_sales.Invoice.Invoice_no_data_message'),
            });
          } else {
            const items = newData?.map((item) => {
              return {
                unit: item?.unit.value,
                unit_conversion_rate: handleFindUnitConversionRate(
                  item?.unit_conversion,
                  item?.unit.value,
                  item?.product_units,
                ),
                product: item?.id,
                qty: fixedNumber(item?.qty ?? 1),
                each_price: item?.each_price
                  ? fixedNumber(
                      parseFloat(item?.vipPrice) / parseFloat(item?.qty),
                    )
                  : 0,
                warehouse_out: 106001,
              };
            });

            let invoiceHeader = {};
            setInvoiceHeader((prev) => {
              //
              invoiceHeader = prev;
              return prev;
            });
            const amount = invoiceHeader?.customer
              ? fixedNumber(invoiceHeader?.amount)
              : invoiceFixedNumber(values?.total, 10);
            const receiveCash = {
              rec_by: `CSH-${101001}`,
              // rec_by: `CSH-${userData?.data?.user_staff?.cash?.[0]?.id}`,
              amount: amount,
              currency: baseCurrencyId,
              currency_rate: 1,
              amount_calc: amount,
              currency_calc: baseCurrencyId,
              currency_rate_calc: 1,
            };

            const allData = {
              currency: baseCurrencyId,
              currency_rate: 1,
              date_time: utcDate()?.format(dateFormat),
              description: '',
              warehouse: 106001,
              customer: invoiceHeader?.customer
                ? invoiceHeader?.customer?.value
                : `CUS-${103001}`,
              discount: 0,
              expense: 0,
              invoice_items: items,
              cash_payment:
                Boolean(invoiceHeader?.customer) && invoiceHeader?.amount <= 0
                  ? undefined
                  : [receiveCash],
            };
            setLoading(true);
            if (values?.usedCardBalance > 0 && !isSendCardUsedValue) {
              const balanceData = {
                cardUniqueCode: customer?.cardId,
                amount: values?.usedCardBalance,
                exchangeType: 'CARD',
                paymentFor: 'BUY',
                actionOnCard: 'CREDIT',
                description: 'خرید از فروشگاه انار',
                pinCode: customer?.pinCode,
              };
              mutateSendBalance({ value: balanceData, type: 'credit' });
            }

            mutateAddSalesInvoice({
              value: allData,
              usedCardBalance: values?.usedCardBalance,
            });
          }
        }
      }
    });
  };

  const handleCancel = useCallback(() => {
    setVisible(false);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSearch('');
    reset();
    setCategory('');
    form.resetFields();
    setCount(1);
    setData([]);
    setSavedProducts([]);
    setResponse({});
    setCustomer({});
    setCustomerCardValue(0);
    setDiscount(0);
    setLoading(false);
    setTotalPrice(0);
    responseRef.current = false;
    setSelectedRowKeys([]);
    setProductCategoryLoading(false);
    setEditingKey('');
    setIsSendCardUsedValue(false);
    setVipDiscount(0);
    setInvoiceHeader({});
  }, [form, reset]);

  const handleAfterVisibleChange = useCallback(
    (visible) => {
      if (visible === false) {
        handleCloseDrawer();
      }
    },
    [handleCloseDrawer],
  );

  const handleReset = useCallback(() => {
    handleCloseDrawer();
  }, [handleCloseDrawer]);

  // const debounceWithDraw = debounce(800, (value) => {
  //   const newValue = value !== "" ? value ?? 0 : 0;
  //   setDiscount(newValue);
  //   const total = data?.reduce(
  //     (sum, item) => print(math?.evaluate(`${sum}+${item?.vipPrice}`)),
  //     0
  //   );
  //   const totalDataValue = total ?? 0;
  //   if (value === null || value === "") {
  //     form.setFieldsValue({
  //       usedCardBalance: 0,
  //       total: totalDataValue,
  //       remainAmount: totalDataValue,
  //     });
  //   } else {
  //     const remainAmount = totalDataValue
  //       ? print(math.evaluate(`${totalDataValue}-${newValue}`))
  //       : 0;

  //     form.setFieldsValue({
  //       total: totalDataValue,
  //       remainAmount: remainAmount,
  //     });
  //   }
  // });

  // const onChangeWithDraw = useCallback(
  //   (value) => {
  //     debounceWithDraw(value);
  //   },
  //   [debounceWithDraw]
  // );

  const payCash = invoiceHeader?.amount;

  useEffect(() => {
    const row = form.getFieldsValue();
    const total = data?.reduce(
      (sum, item) => print(math?.evaluate(`${sum}+${item?.vipPrice}`)),
      0,
    );
    const totalDataValue = total ?? 0;
    if (parseInt(totalDataValue) <= parseInt(row?.usedCardBalance)) {
      form.setFieldsValue({
        usedCardBalance: totalDataValue,
        total: totalDataValue,
        remainAmount: 0,
      });
      setTotalPrice(totalDataValue);
    } else {
      const newTotal = totalDataValue ?? 0;
      const discount = payCash ?? 0;
      // const discount =
      //   row?.usedCardBalance !== "" ? row?.usedCardBalance ?? 0 : 0;
      const remainAmount = totalDataValue
        ? print(math.evaluate(`${totalDataValue}-${discount}`))
        : 0;
      form.setFieldsValue({ total: newTotal, remainAmount: remainAmount });
      setTotalPrice(newTotal);
    }
  }, [form, data, payCash]);

  const handleClearCustomer = useCallback(
    (e) => {
      e.stopPropagation();

      setData((prev) => {
        const newData = prev?.map((item) => {
          return { ...item, vipPrice: item?.total_price };
        });
        return newData;
      });

      setVipDiscount(0);
      setCustomer({});
      setCustomerCardValue(0);
      const newTotal = data?.reduce(
        (sum, item) => print(math?.evaluate(`${sum}+${item?.vipPrice}`)),
        0,
      );

      form.setFieldsValue({
        cardBalance: 0,
        usedCardBalance: 0,
        total: newTotal ?? 0,
        remainAmount: newTotal ?? 0,
      });
    },
    [data, form],
  );

  const handleClearCustomer1 = (e) => {
    setVipDiscount(0);
  };

  const onClickBody = () => {
    posHotKey.current.focus();
  };

  const keyMap = {
    MARKET_INVOICE_PRINT: 'shift+p',
    MARKET_INVOICE_NAME_SEARCH: 'f1',
    MARKET_INVOICE_BARCODE_SEARCH: 'f2',
    MARKET_INVOICE_SAVE_ORDER: 'shift+s',
    MARKET_INVOICE_RESET_ORDER: 'shift+R',
    MARKET_INVOICE_SELECT_WITHDRAW: 'f3',
  };
  //
  const handlers = {
    MARKET_INVOICE_PRINT: (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (responseRef.current === true) {
        handlePrint();
      } else {
        message.warning(t('Sales.All_sales.Invoice.Print_error_message'));
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
      handleReset();
    },
    MARKET_INVOICE_SAVE_ORDER: (event) => {
      event.preventDefault();
      event.stopPropagation();
      // saveRef.current.focus();
      //
      if (responseRef.current === false) {
        handleSendOrder();
      } else {
        // message.warning(t("Sales.All_sales.Invoice.Print_error_message"));
      }
    },
    MARKET_INVOICE_SELECT_WITHDRAW: (event) => {
      event.preventDefault();
      event.stopPropagation();
      withDrawRef.current.focus({ cursor: 'all' });
    },
  };

  // const handleChangeByPayCard = useCallback(
  //   (e) => {
  //     const value = e.target.checked;
  //     // setPayByCard(value);
  //     const formValue = form.getFieldsValue();
  //     if (value) {
  //       form.setFieldsValue({
  //         remainAmount: 0,
  //         usedCardBalance:
  //           parseFloat(formValue?.remainAmount) +
  //           parseFloat(formValue?.usedCardBalance),
  //       });
  //       setDiscount(
  //         parseFloat(formValue?.remainAmount) +
  //           parseFloat(formValue?.usedCardBalance)
  //       );
  //     } else {
  //       form.setFieldsValue({
  //         remainAmount:
  //           parseFloat(formValue?.remainAmount) +
  //           parseFloat(formValue?.usedCardBalance),
  //         usedCardBalance: 0,
  //       });
  //       setDiscount(0);
  //     }
  //   },
  //   [form]
  // );

  return (
    <HotKeys keyMap={keyMap} handlers={handlers} innerRef={posHotKey}>
      <div onClick={onClickBody}>
        <div onClick={showDrawer}>
          {t('Sales.All_sales.Invoice.POS_invoice')}
        </div>
        <Drawer
          maskClosable={false}
          closable={false}
          // closeIcon={
          //   <CloseOutlined style={{ color: "red", background: "red" }} />
          // }
          height='100%'
          afterVisibleChange={handleAfterVisibleChange}
          onClose={onClose}
          open={visible}
          placement='top'
          destroyOnClose
          bodyStyle={styles.drawerBody}
          footer={false}
          title={
            <POSHeader1
              type='addPOS'
              {...{
                setInvoiceHeader,
                invoiceHeader,
                responseId,
                nameSearch,
                setSearchCategory,
                onSearch,
                onSearchCategories,
                searchCategory,
                onChangeTreeSestet,
                graphqlEndPoint,
                totalPrice,
                form,
              }}
              handleCloseFunction={onClose}
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
              remainAmount: 0,
              payCash: 0,
            }}
            colon={false}
          >
            <Row>
              <Col span={13} className='height'>
                <Row gutter={[0, 10]} className='height'>
                  <Col span={22} offset={1} className='height'>
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
                      handleClearCustomer1={handleClearCustomer1}
                      setCustomerCardValue={setCustomerCardValue}
                      form={form}
                      barcodeSearch={barcodeSearch}
                      currency={baseCurrency?.data}
                      setEditingKey={setEditingKey}
                      editingKey={editingKey}
                      posHotKey={posHotKey}
                      type='add'
                      findProductStatistics={findProductStatistics}
                      barcodeButtonRef={barcodeButtonRef}
                      loading={tableLoading}
                      setLoading={setTableLoading}
                      omitFields={omitFields}
                      getVipPrice={getVipPrice}
                      vipPercent={vipPercent}
                    />
                  </Col>
                  <Col span={22} offset={1}>
                    <PosInvoiceFooter
                      // onChangeWithDraw={onChangeWithDraw}
                      // withDrawRef={withDrawRef}
                      saveRef={saveRef}
                      // totalPrice={totalPrice}
                      // customerCardValue={customerCardValue}
                      responseId={responseId}
                      // customerId={customerCardId}
                      editingKey={editingKey}
                      saveLoading={loading}
                      handlePrint={handlePrint}
                      // handleChangeByPayCard={handleChangeByPayCard}
                      handleSendOrder={handleSendOrder}
                      handleReset={handleReset}
                      handleCancel={handleCancel}
                    >
                      <PrintPosInvoice
                        type='add'
                        printRef={componentRef}
                        data={savedProducts}
                        discount={discount}
                        vipDiscount={vipDiscount}
                        totalPrice={totalPrice}
                        response={response}
                      />
                    </PosInvoiceFooter>
                  </Col>
                </Row>
              </Col>
              <Col
                span={11}
                className='market_invoice_product num'
                id='posProductList'
                style={styles.productList}
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
    background: Colors.primaryColor,
    padding: '0px 24px 0px 24px',
    height: '60px',
    borderBottom: 'none',
  },
  margin: { marginBottom: '10px' },
  button: { height: '37px', borderRadius: '4px' },
  input: { borderRadius: '4px' },
  footer: { width: '475px' },
  productList: {
    height: `calc(100vh - 60px)`,
    overflowY: 'auto',
    overflowX: 'hidden',
    textAlign: 'center',
  },
  drawerBody: { padding: '0px', overflowY: 'hidden' },
};

export default MarketInvoice;
