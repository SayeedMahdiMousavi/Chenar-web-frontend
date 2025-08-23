import React, {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Actions } from './MarketInvoiceComponents/Action';
import { HotKeys } from 'react-hotkeys';
import axiosInstance from '../../ApiBaseUrl';
import {
  Table,
  Input,
  Button,
  Form,
  Modal,
  message,
  Col,
  Row,
  Descriptions,
  Typography,
  Switch,
  Collapse,
  Popover,
  Space,
  Tooltip,
} from 'antd';
import {
  UserOutlined,
  PlusOutlined,
  MinusOutlined,
  ShoppingFilled,
  CloseOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { EditPosInvoiceColumns } from './MarketInvoiceComponents/EditPosInvoiceColumns';
import { gql } from 'graphql-request';
import { graphqlApiBase } from '../../graphqlApiBase';
import { print, math, fixedNumber } from '../../../Functions/math';
import CustomerCardPin from './MarketInvoiceComponents/CustomerCardPin';
import { ActionMessage } from '../../SelfComponents/TranslateComponents/ActionMessage';
import { Colors } from '../../colors';
import { Statistics } from '../../../components/antd';
import { BarcodeIcon } from '../../../icons';

const { Search } = Input;
const { Text } = Typography;

const GET_CUSTOMER = gql`
  query ($cardUniqueCode: String!) {
    account(cardUniqueCode: $cardUniqueCode) {
      __typename
      ... on Account {
        user {
          id
          firstName
          userName
          lastName
          about
          city
          phoneNumber
        }
        balance
        card {
          pinCode
        }
      }
      ... on AccountNotExists {
        message {
          text
          language
        }
      }
    }
  }
`;
const MarketInvoiceTable = (props) => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [search, setSearch] = useState('');
  const [customer, setCustomer] = useState(false);
  const [customerHeight, setCustomerHeight] = useState(0);
  const [activeKey, setActiveKey] = useState([]);
  const [customerCardPin, setCustomerCardPin] = useState(``);
  const [saveDisabled, setSaveDisabled] = useState(false);
  const { t, i18n } = useTranslation();
  const collapseValue = useRef();
  const hotkey = useRef(null);

  const customerId = props?.customer?.cardId;
  const firstActiveKey = activeKey[0];

  useLayoutEffect(() => {
    (() => {
      setTimeout(() => {
        const height = document?.getElementById(
          'customerInformation',
        )?.clientHeight;
        setCustomerHeight(height);
      }, 300);
    })();
  }, [customerId, firstActiveKey]);

  const setData = props?.setData;
  const setSelectedRowKeys = props.setSelectedRowKeys;
  const getVipPrice = props.getVipPrice;
  const setEditingKey = props.setEditingKey;
  const vipPercent = props?.vipPercent?.data?.vip_price?.percent;

  const handelOkPin = useCallback(
    (close) => {
      setSaveDisabled((prev) => {
        if (prev === true) {
          //
          close();
          setData((prev) => {
            const newData = prev?.map((item) => {
              let vip = 0;
              if (item?.is_have_vip_price) {
                const priceUnit = item?.price?.find(
                  (priceItem) => priceItem?.unit?.id === item?.unit?.value,
                );
                const productVipPercent =
                  item?.vip_price !== null
                    ? item?.vip_price?.vip_percent
                    : vipPercent;
                const vipPrice =
                  priceUnit?.sales_rate &&
                  priceUnit?.perches_rate &&
                  productVipPercent > 0
                    ? print(
                        math.evaluate(
                          `${Math.round(
                            print(
                              math.evaluate(`((${priceUnit?.sales_rate} - ${priceUnit?.perches_rate}) *
                            ${productVipPercent}) /
                            100`),
                            ),
                          )}*${item?.qty}`,
                        ),
                      )
                    : 0;

                vip = parseInt(vipPrice) < 0 ? 0 : vipPrice;
              }

              return {
                ...item,
                vipPrice: item?.total_price
                  ? parseInt(item?.total_price - vip)
                  : 0,
              };
            });
            return newData;
          });
        } else {
          return prev;
        }
        return prev;
      });
      setTimeout(() => {
        props.posHotKey.current.focus();
      }, 100);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setData, vipPercent],
  );

  const onCancelPin = () => {
    props.setCustomer({});
    setCustomerCardPin('');
    props.form.setFieldsValue({
      cardBalance: 0,
    });
    props.setCustomerCardValue(0);
  };

  const onChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const afterClose = () => {
    form1.resetFields();
    setTimeout(() => {
      props.barcodeSearch.current.focus();
    }, 100);
  };

  const pin = (
    <CustomerCardPin
      form1={form1}
      customerCardPin={customerCardPin}
      setSaveDisabled={setSaveDisabled}
      setCustomerCardPin={setCustomerCardPin}
    />
  );

  let isGetCard = false;
  let handleSearchProduct = async (value) => {
    if (value === '') {
      return;
    } else {
      if (customer) {
        if (isGetCard) {
          return;
        }
        isGetCard = true;

        try {
          await graphqlApiBase(GET_CUSTOMER, { cardUniqueCode: value })
            .then((res) => {
              if (res?.account?.__typename === 'Account') {
                const newCustomer = {
                  ...res?.account,
                  cardId: value,
                  pinCode: res?.account?.card?.pinCode,
                };

                props.setCustomer(newCustomer);
                props.form.setFieldsValue({
                  cardBalance: parseInt(res?.account?.balance),
                });

                setCustomerCardPin(`${res?.account?.card?.pinCode}`);
                props.setCustomerCardValue(parseInt(res?.account?.balance));

                setSearch('');
                Modal.confirm({
                  bodyStyle: { direction: t('Dir') },
                  title: t('Sales.All_sales.Invoice.Pin_code'),
                  icon: '',
                  content: pin,
                  okText: t('Form.Ok'),
                  cancelText: t('Form.Cancel'),
                  width: 288,
                  onOk: handelOkPin,
                  onCancel: onCancelPin,

                  autoFocusButton: null,
                  afterClose: afterClose,
                });
              } else if (res?.account?.__typename === 'AccountNotExists') {
                props.setCustomer({});
                setCustomerCardPin('');
                let newTotal = 0;
                props.setData((prev) => {
                  if (!prev || !Array.isArray(prev)) {
                    return [];
                  }
                  const { newData, total } = prev.reduce(
                    (sum, item) => {
                      if (!item || !item.total_price) {
                        return sum;
                      }
                      const newItem = { ...item, vipPrice: item.total_price };
                      return {
                        newData: [...sum.newData, newItem],
                        total: print(
                          math.evaluate(`${sum.total}+${item.total_price}`),
                        ),
                      };
                    },
                    { newData: [], total: 0 },
                  );
                  newTotal = total;
                  return newData;
                });
                props.form.setFieldsValue({
                  cardBalance: 0,
                  usedCardBalance: 0,
                  total: newTotal ? newTotal : 0,
                  remainAmount: newTotal ? newTotal : 0,
                });
                props.setCustomerCardValue(0);
                setSearch('');

                props.handleClearCustomer1();
                if (i18n?.language === 'en') {
                  const error = res?.account?.message?.find(
                    (item) => item?.language === 'ENGLISH',
                  );
                  message.error(
                    error ? error?.text : res?.account?.message?.[0]?.text,
                  );
                } else if (i18n?.language === 'ps') {
                  const error = res?.account?.message?.find(
                    (item) => item?.language === 'PASHTO',
                  );
                  message.error(
                    error ? error?.text : res?.account?.message?.[0]?.text,
                  );
                } else {
                  const error = res?.account?.message?.find(
                    (item) => item?.language === 'PERSIAN',
                  );
                  message.error(
                    error ? error?.text : res?.account?.message?.[0]?.text,
                  );
                }

                return undefined;
              }
            })
            .catch(() => {
              setSearch('');
            });
          isGetCard = false;
        } catch (info) {
          isGetCard = false;
        }

        return;
      } else {
        props.setLoading(true);

        const allData = props?.data?.find((item) => {
          const isBarcodeExist = item?.product_barcode?.find(
            (barcodeItem) =>
              barcodeItem?.barcode === search &&
              barcodeItem?.unit?.id === item?.unit?.value,
          );
          if (isBarcodeExist) {
            return true;
          } else {
            return false;
          }
        });

        if (allData) {
          props.setData((prev) => {
            const newData = prev?.map((item, index) => {
              const isBarcodeExist = item?.product_barcode?.find(
                (barcodeItem) =>
                  barcodeItem?.barcode === search &&
                  barcodeItem?.unit?.id === item?.unit?.value,
              );
              if (isBarcodeExist) {
                const element = document?.getElementById('posInvoiceTable');
                element &&
                  element.children[index].scrollIntoView({
                    behavior: 'smooth',
                  });
                const rowKey = [item?.key];
                props.setSelectedRowKeys(rowKey);
                const vipPrice = props?.getVipPrice(
                  item,
                  item?.is_have_vip_price,
                  item?.price,
                  item?.unit?.value,
                  item?.qty + 1,
                );
                const newItem = {
                  ...item,
                  vipPrice: item?.each_price
                    ? parseInt(item?.each_price * (item?.qty + 1) - vipPrice)
                    : 0,
                  qty: parseFloat(item.qty) + 1,
                  total_price:
                    item?.each_price &&
                    item?.each_price * (parseFloat(item.qty) + 1),
                };

                return newItem;
              } else {
                return item;
              }
            });
            return newData;
          });
          props.setLoading(false);
          setSearch('');
          return;
        } else {
          let productBarcodeItem = {};
          const product = props?.data?.find((item) => {
            const isBarcodeExist = item?.product_barcode?.find(
              (barcodeItem) => barcodeItem?.barcode === search,
            );
            if (isBarcodeExist) {
              productBarcodeItem = isBarcodeExist;
              return true;
            } else {
              return false;
            }
          });

          if (product) {
            props.setData((prev) => {
              const unit = {
                value: productBarcodeItem?.unit?.id,
                label: productBarcodeItem?.unit?.name,
              };

              const newPrice = props.getPrice(product, unit);

              const ok = props.findProductStatistics(product, 'add', unit, 0);
              if (ok && Boolean(newPrice)) {
                const vipPrice = props.getVipPrice(
                  product,
                  product?.is_have_vip_price,
                  product?.price,
                  productBarcodeItem?.unit?.id,
                  1,
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
                  vipPrice: newPrice ? parseInt(newPrice - vipPrice) : 0,
                  product: product?.name,
                  each_price: newPrice ? parseFloat(newPrice) : 0,
                  total_price: newPrice ? 1 * parseFloat(newPrice) : 0,
                };
                const newData = [...prev, newItem];
                const newCount = props.count + 1;
                props.setCount(newCount);
                props.setLoading(false);
                setSearch('');
                // props.barcodeSearch.current.blur();
                // edit(newItem);
                setTimeout(() => {
                  const element = document?.getElementById('posInvoiceTable');

                  element &&
                    element?.lastElementChild &&
                    element.lastElementChild.scrollIntoView({
                      behavior: 'smooth',
                    });
                  const rowKey = [props.count];
                  props.setSelectedRowKeys(rowKey);
                }, 50);
                return newData;
              } else {
                const newCount = props.count + 1;
                props.setCount(newCount);
                props.setLoading(false);
                setSearch('');
                return prev;
              }
            });
          } else {
            try {
              await axiosInstance
                .get(
                  `${props.baseUrl}?page=1&page_size=10&product_barcode__barcode=${search}&${props.endUrl}&fields=${props.omitFields}`,
                  { timeout: 6000 },
                )
                .then((res) => {
                  if (res?.data?.results?.length !== 0) {
                    const product = res?.data?.results?.[0];
                    const purUnit = product?.product_barcode?.find(
                      (item) => item?.barcode === search,
                    );
                    const unit = {
                      value: purUnit?.unit?.id,
                      label: purUnit?.unit?.name,
                    };
                    const newPrice = props.getPrice(product, unit);
                    const ok = props.findProductStatistics(
                      product,
                      'add',
                      unit,
                      0,
                    );
                    props.setData((prev) => {
                      if (ok && Boolean(newPrice)) {
                        const vipPrice = props.getVipPrice(
                          product,
                          product?.is_have_vip_price,
                          product?.price,
                          purUnit?.unit?.id,
                          1,
                        );
                        const newData = {
                          ...product,
                          key: props?.count,
                          row: `${props?.count}`,
                          id: product?.id,
                          vipPrice: newPrice
                            ? parseInt(newPrice - vipPrice)
                            : 0,
                          product: product?.name,
                          qty: 1,
                          unit: {
                            value: purUnit?.unit?.id,
                            label: purUnit?.unit?.name,
                          },
                          each_price: newPrice ? parseFloat(newPrice) : 0,
                          total_price: newPrice ? 1 * parseFloat(newPrice) : 0,
                        };
                        const newCount = props.count + 1;
                        props.setCount(newCount);
                        props.setLoading(false);
                        setSearch('');
                        // props.barcodeSearch.current.blur();
                        // edit(newData);
                        setTimeout(() => {
                          const element =
                            document?.getElementById('posInvoiceTable');

                          element &&
                            element?.lastElementChild &&
                            element.lastElementChild.scrollIntoView({
                              behavior: 'smooth',
                            });
                          const rowKey = [props.count];
                          props.setSelectedRowKeys(rowKey);
                        }, 50);
                        const allData = [...prev, newData];
                        return allData;
                      } else {
                        setSearch('');
                        props.setLoading(false);
                        return prev;
                      }
                    });
                  } else {
                    message.error(
                      `${t('Sales.All_sales.Invoice.Product_not_found')}`,
                    );
                    props.setLoading(false);
                    setSearch('');
                    return;
                  }
                  return res?.data;
                  // }
                })
                .catch((error) => {
                  const newCount = props.count + 1;
                  props.setCount(newCount);
                  props.setLoading(false);
                  if (error?.response?.data?.barcode?.[0]) {
                    message.error(`${error?.response?.data?.barcode?.[0]}`);
                    return error;
                  }
                  return error;
                });
            } catch (error) {
              message.error(
                `${t('Sales.All_sales.Invoice.Product_not_found')}`,
              );
              props.setLoading(false);
            }
            const newCount = props.count + 1;
            props.setCount(newCount);
          }
        }
      }
    }
  };

  const addNumber = useCallback(
    (key) => {
      hotkey.current.focus();
      setData((prev) => {
        const newData = prev?.map((item, index) => {
          if (item?.key === key) {
            // const ok = props.findProductStatistics(
            //   item,
            //   "edit",
            //   item?.unit?.value,
            //   parseFloat(item.qty)
            // );
            const vipPrice = getVipPrice(
              item,
              item?.is_have_vip_price,
              item?.price,
              item?.unit?.value,
              item?.qty + 1,
            );
            return {
              ...item,
              vipPrice: item?.each_price
                ? parseInt(item?.each_price * (item?.qty + 1) - vipPrice)
                : 0,
              qty: parseFloat(item.qty) + 1,
              total_price:
                item?.each_price &&
                item?.each_price * (parseFloat(item.qty) + 1),
            };
          } else {
            return item;
          }
        });
        return newData;
      });
      hotkey.current.focus();
    },
    [getVipPrice, setData],
  );

  const minusNumber = useCallback(
    (key) => {
      setData((prev) => {
        const newData = prev?.map((item, index) => {
          if (item?.key === key) {
            if (item.qty < 2) {
              return item;
            } else {
              const vipPrice = getVipPrice(
                item,
                item?.is_have_vip_price,
                item?.price,
                item?.unit?.value,
                item?.qty - 1,
              );
              return {
                ...item,
                vipPrice: item?.each_price
                  ? parseInt(item?.each_price * (item?.qty - 1) - vipPrice)
                  : 0,
                qty: item?.qty - 1,
                total_price:
                  item?.each_price && item?.each_price * (item.qty - 1),
              };
            }
          } else {
            return item;
          }
        });
        return newData;
      });
      hotkey.current.focus();
    },
    [getVipPrice, setData],
  );

  const isEditing = (record) => record?.key === props?.editingKey;

  const edit = useCallback(
    (record) => {
      form.setFieldsValue({
        unit: record?.unit,
        qty: record?.qty,
        each_price: record?.each_price,
        // ...record,
      });
      setEditingKey(record?.key);
    },
    [form, setEditingKey],
  );

  const save = useCallback(
    async (record) => {
      try {
        const row = await form.validateFields();

        const qty = fixedNumber(row?.qty < 0 ? 0 : row?.qty, 3);
        const each_price = fixedNumber(
          record?.each_price < 0 || !record?.each_price
            ? 0
            : record?.each_price,
          0,
        );
        const vipPrice = getVipPrice(
          record,
          record?.is_have_vip_price,
          record?.price,
          row?.unit?.value,
          row?.qty,
        );
        const value = {
          ...record,
          unit: row?.unit,
          vipPrice: each_price ? parseInt(qty * each_price - vipPrice) : 0,
          qty: qty,
          each_price: each_price,
          total_price: each_price ? qty * each_price : qty * 0,
        };

        setData((prev) => {
          const newData = prev?.map((item) => {
            if (item?.key === record?.key) {
              return { ...item, ...value };
            } else {
              return item;
            }
          });
          return newData;
        });
        setEditingKey('');

        if (hotkey.current.value !== null) {
          hotkey.current.focus();
        }
        props.barcodeSearch.current.focus();
      } catch (errInfo) {
        console.log('Validate Failed:', errInfo);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form, getVipPrice, setData, setEditingKey],
  );

  const onClickButton = (e) => {
    e.stopPropagation();
  };
  const responseId = props?.responseId;
  const handleDelete = useCallback(
    (key) => {
      if (responseId) {
        return;
      }
      setData((item1) => {
        const data1 = item1.filter((item) => item?.key !== key);
        setSelectedRowKeys((prev) => {
          const index = item1?.findIndex((item) => prev?.[0] === item.key);
          const nextItem = item1?.find(
            (item, ItemIndex) => ItemIndex === index - 1,
          );

          if (nextItem) {
            const element = document?.getElementById('posInvoiceTable');
            element &&
              element.children[index - 1].scrollIntoView({
                behavior: 'smooth',
              });
            return [nextItem?.key];
          } else {
            return [];
          }
        });

        return data1;
      });
    },
    [setData, setSelectedRowKeys, responseId],
  );

  const currencySymbol = props?.currency?.symbol;

  const columns = useMemo(
    () => [
      {
        title: `${t('Sales.Product_and_services.Product').toUpperCase()}`,
        dataIndex: 'product',
        className: 'pos_table_column',
      },
      {
        title: t('Sales.All_sales.Invoice.Quantity').toUpperCase(),
        dataIndex: 'qty',
        editable: true,
        width: 120,
        className: 'pos_table_column',
        render: (text, record) => {
          const available = record?.product_statistic?.reduce(
            (sum, item) => item?.available + sum,
            0,
          );
          return (
            <Row justify='space-around'>
              <Col onClick={onClickButton} onDoubleClick={onClickButton}>
                <Button
                  shape='circle'
                  size='small'
                  onClick={(e) => {
                    minusNumber(record?.key);
                  }}
                  disabled={responseId}
                  style={styles.minMaxButton}
                  icon={<MinusOutlined style={styles.minMaxIcon} />}
                  // onClick={handleAdd}
                />
              </Col>
              <Col>
                <Tooltip
                  title={
                    <Statistics
                      value={available}
                      valueStyle={{ color: 'white' }}
                    />
                  }
                >
                  <Text strong={true}>
                    <Statistics value={text} />
                  </Text>
                </Tooltip>
              </Col>
              <Col onClick={onClickButton} onDoubleClick={onClickButton}>
                <Button
                  shape='circle'
                  size='small'
                  onClick={(e) => {
                    addNumber(record?.key);
                  }}
                  disabled={responseId}
                  style={styles.minMaxButton}
                  icon={<PlusOutlined style={styles.minMaxIcon} />}
                />
              </Col>
            </Row>
          );
        },
        align: 'center',
        // editable: true,
      },
      {
        title: `${t('Sales.All_sales.Invoice.Unit').toUpperCase()}`,
        dataIndex: 'unit',
        editable: true,
        width: 100,
        className: 'pos_table_column',
        render: (text, record) => (
          <Row justify='space-between' gutter={5}>
            <Col>{text?.label} &nbsp;</Col>
            <Col>
              {record?.unit_conversion?.length > 0 && (
                <Popover
                  arrowPointAtCenter
                  title={t('Sales.Product_and_services.Form.Unit_conversions')}
                  trigger='hover'
                  content={
                    <Descriptions
                      size='small'
                      style={styles.popover}
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
                              (item) => item?.base_unit === true,
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
        title: t('Sales.Product_and_services.Form.Price').toUpperCase(),
        dataIndex: 'each_price',
        width: 90,
        className: 'pos_table_column',
        render: (text, record) => (
          <Row justify='space-between' gutter={5}>
            <Col>
              <Statistics value={text} precision={0} />
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
                      style={styles.popover}
                      column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                    >
                      {record?.price?.map((item) => (
                        <Descriptions.Item
                          key={item?.id}
                          label={`1 ${item?.unit?.name}`}
                        >
                          {parseFloat(item?.sales_rate)} {currencySymbol}
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
        // editable: true,
      },
      {
        title: t('Sales.Customers.Form.Total').toUpperCase(),
        dataIndex: 'total_price',
        width: 80,
        className: 'pos_table_column',
        render: (text) => <Statistics value={text} precision={1} />,
      },
      {
        title: t('Table.Action').toUpperCase(),
        dataIndex: 'action',
        width: 70,

        className: 'pos_table_column',
        align: 'center',
        render: (_, record) => {
          return (
            <div onClick={onClickButton} onDoubleClick={onClickButton}>
              <Actions
                editingKey={props.editingKey}
                handleDelete={handleDelete}
                recordKey={record?.key}
                name={record?.name}
                responseId={responseId}
              />
            </div>
          );
        },
      },
    ],

    [
      addNumber,
      currencySymbol,
      handleDelete,
      minusNumber,
      props.editingKey,
      t,
      responseId,
    ],
  );

  // const BodyTable = React.memo((props) => {
  //   return <tbody {...props} id="posInvoiceTable" />;
  // });
  const BodyTable = (props) => {
    return <tbody {...props} id='posInvoiceTable' />;
  };

  const components = {
    body: {
      wrapper: BodyTable,
      cell: EditPosInvoiceColumns,
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
          inputType: col.dataIndex === 'default_unit' ? 'select' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
          save: save,
          getPrice: props.getPrice,
          form,
          findProductStatistics: props.findProductStatistics,
          barcodeButtonRef: props.barcodeButtonRef,
        };
      },
    };
  });

  const rowSelection = {
    selectedRowKeys: props.selectedRowKeys,
    type: 'radio',
    columnWidth: '1px',
    renderCell: () => <div style={{ width: '0px' }}></div>,
    hideSelectAll: true,
    getCheckboxProps: (record) => ({ value: record.key }),
  };

  const onClickAdd = useCallback(() => {
    setData((prevData) => {
      setSelectedRowKeys((prev) => {
        const index = prevData?.findIndex((item) => prev?.[0] === item.key);
        const nextItem = prevData?.find(
          (item, ItemIndex) => ItemIndex === index + 1,
        );

        if (nextItem) {
          const newKey = nextItem?.key;
          const element = document?.getElementById('posInvoiceTable');
          element.children[index + 1] &&
            element.children[index + 1].scrollIntoView({
              behavior: 'smooth',
            });
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
          (item, ItemIndex) => ItemIndex === index - 1,
        );

        if (nextItem) {
          const newKey = nextItem?.key;
          const element = document?.getElementById('posInvoiceTable');
          element.children[index - 1] &&
            element.children[index - 1].scrollIntoView({
              behavior: 'smooth',
            });
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

      props.barcodeButtonRef.current.focus();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleDelete, setSelectedRowKeys],
  );

  const handelCancelDelete = (close) => {
    close();
    props.barcodeButtonRef.current.focus();
  };

  const keyMap = {
    INVOICE_TABLE_MOVE_UP: 'up',
    INVOICE_TABLE_MOVE_DOWN: 'down',
    INVOICE_TABLE_MOVE_RIGHT: 'right',
    INVOICE_TABLE_MOVE_LEFT: 'left',
    INVOICE_TABLE_Equal: ['=', 'plus'],
    INVOICE_TABLE_MOVE_MINUS: ['-'],
    INVOICE_TABLE_MOVE_Delete: 'del',
  };

  const handlers = {
    INVOICE_TABLE_MOVE_UP: (event) => {
      if (props.selectedRowKeys?.length > 0) {
        event.preventDefault();
        event.stopPropagation();
        hotkey.current.focus();
        onClickUp();
      }
    },
    INVOICE_TABLE_MOVE_DOWN: (event) => {
      if (props.selectedRowKeys.legth > 0) {
        event.preventDefault();
        event.stopPropagation();
        hotkey.current.focus();
        onClickAdd();
      }
    },

    INVOICE_TABLE_MOVE_RIGHT: (event) => {
      event.preventDefault();
      props.setSelectedRowKeys((prev) => {
        const record = props?.data?.find((item) => item?.key === prev?.[0]);
        hotkey.current.focus();
        if (record) {
          edit(record);
        }

        return prev;
      });
    },
    INVOICE_TABLE_MOVE_LEFT: (event) => {
      event.preventDefault();
      event.stopPropagation();
      //
      // if (editingKey !== "") {
      props.setEditingKey('');
      // }
    },
    INVOICE_TABLE_MOVE_MINUS: (event) => {
      event.preventDefault();
      event.stopPropagation();
      props.setSelectedRowKeys((prev) => {
        minusNumber(prev?.[0]);
        return prev;
      });
    },
    INVOICE_TABLE_Equal: (event) => {
      event.preventDefault();
      event.stopPropagation();
      props.setSelectedRowKeys((prev) => {
        addNumber(prev?.[0]);
        return prev;
      });
    },

    INVOICE_TABLE_MOVE_Delete: (event) => {
      event.preventDefault();
      event.stopPropagation();
      props.setSelectedRowKeys((prev) => {
        const item = props?.data?.find((item) => item?.key === prev?.[0]);
        Modal.confirm({
          bodyStyle: { direction: t('Dir') },
          title: (
            <Typography.Text>
              {' '}
              <ActionMessage
                name={item?.name}
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
  };

  const onChangeSwitch = (checked) => {
    setCustomer(checked);
  };

  const onChangeCollapse = (key) => {
    setActiveKey(key);
  };

  const genExtra = () => (
    <Button
      shape='circle'
      size='small'
      type='primary'
      icon={<CloseOutlined />}
      onClick={props.handleClearCustomer}
      danger
    />
  );

  return (
    <React.Fragment>
      <HotKeys keyMap={keyMap} handlers={handlers} innerRef={hotkey}>
        <Row
          justify='space-between'
          align={customerId ? '' : 'middle'}
          style={styles.bodyTable}
        >
          <Col>
            <Row align='middle'>
              <Col>
                {' '}
                <Search
                  value={search}
                  style={styles.search}
                  ref={props.barcodeSearch}
                  onChange={onChangeSearch}
                  onSearch={handleSearchProduct}
                  readOnly={props.responseId}
                  enterButton={
                    <Button
                      icon={<BarcodeIcon style={styles.barcodeIcon} />}
                      style={styles.barcodeButton}
                      ref={props.barcodeButtonRef}
                    />
                  }
                  placeholder={
                    customer
                      ? t(
                          'Sales.All_sales.Invoice.Filter_by_customer_serial_No',
                        )
                      : t('Sales.All_sales.Invoice.Filter_by_product_barcode')
                  }
                />
              </Col>
              <Col>
                {props?.type === 'add' && (
                  <Switch
                    checkedChildren={<UserOutlined />}
                    unCheckedChildren={<ShoppingFilled />}
                    style={styles.switch}
                    checked={customer}
                    onChange={onChangeSwitch}
                  />
                )}
              </Col>
            </Row>
          </Col>
          <Col>
            {customerId ? (
              <div></div>
            ) : (
              <Text strong={true}>
                <a href='#' onClick={(e) => e.preventDefault()}>
                  {t('Sales.All_sales.Invoice.Pos_invoice_table_title')}
                </a>
              </Text>
            )}
          </Col>
          <Col
          //  className='invoice_market_table_header'
          ></Col>
        </Row>
        {customerId && props.type === 'add' && (
          <Row
            style={styles.collapse}
            ref={collapseValue}
            id='customerInformation'
          >
            <Col span={24}>
              <Collapse size='small' onChange={onChangeCollapse}>
                <Collapse.Panel
                  key='1'
                  header={t('Sales.Customers.Customer_information')}
                  style={{ padding: '0px' }}
                  extra={genExtra()}
                >
                  <Descriptions
                    column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                    layout='vertical'
                    size='small'
                    bordered
                  >
                    <Descriptions.Item label={t('Form.Name')}>
                      {props?.customer?.user?.firstName}{' '}
                      {props?.customer?.user?.lastName}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('Form.Phone')}>
                      {props?.customer?.user?.phoneNumber?.replace('+93', 0)}
                    </Descriptions.Item>

                    <Descriptions.Item
                      label={t('Sales.Customers.Discount.Customers_discount')}
                    ></Descriptions.Item>
                  </Descriptions>
                </Collapse.Panel>
              </Collapse>
            </Col>
          </Row>
        )}

        <Form form={form} component={false} className='market_table'>
          <div>
            {activeKey?.[0] && props?.customer?.caurdId ? null : (
              <Table
                components={components}
                rowClassName='editable-row'
                scroll={{
                  y:
                    activeKey?.[0] && props.customer?.cardId
                      ? `calc(100vh - ${customerHeight + 315}px)`
                      : props?.customer?.cardId
                        ? `calc(100vh - 370px)`
                        : `calc(100vh - 315px)`,
                  scrollToFirstRowOnChange: false,
                }}
                loading={props.loading}
                rowSelection={rowSelection}
                style={styles.table}
                rowKey={(record) => record.key}
                dataSource={props?.data}
                columns={mergedColumns}
                pagination={false}
                size='small'
                bordered
                onRow={(record) => {
                  return {
                    onClick: () => {
                      if (record?.key !== props?.selectedRowKeys?.[0]) {
                        const key = [record?.key];
                        props.setSelectedRowKeys(key);
                      }
                    }, // click row

                    onContextMenu: (event) => {
                      if (
                        record?.key !== props?.editingKey &&
                        !props?.responseId
                      ) {
                        event.preventDefault();
                        edit(record);
                        hotkey.current.focus();
                      }
                    }, // right button click row
                  };
                }}
                summary={(pageData) => {
                  const qty = pageData.reduce((sum, { qty }) => {
                    return print(math.evaluate(`${qty ? qty : 1}+${sum}`));
                  }, 0);
                  const total_price = pageData.reduce(
                    (sum, { total_price }) => {
                      return print(math.evaluate(`${total_price}+${sum}`));
                    },
                    0,
                  );
                  const vip = pageData.reduce(
                    (sum, { vipPrice, total_price }) => {
                      return print(
                        math.evaluate(`(${total_price}-${vipPrice})+${sum}`),
                      );
                    },
                    0,
                  );
                  return (
                    <>
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                          <Typography.Text>
                            {t('Sales.Customers.Form.Total')}
                          </Typography.Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell
                          className='pos-qty-summary-column'
                          index={2}
                        >
                          <Typography.Text type='danger'>{qty}</Typography.Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={3}>
                          <Typography.Text type='danger'></Typography.Text>
                        </Table.Summary.Cell>

                        <Table.Summary.Cell index={4}>
                          <Typography.Text type='danger'>
                            <Space size={4}>
                              <span>VIP</span> <span>{parseInt(vip)}</span>
                            </Space>
                          </Typography.Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={5}>
                          <Typography.Text type='danger'>
                            {total_price && fixedNumber(total_price)}
                          </Typography.Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={6}></Table.Summary.Cell>
                      </Table.Summary.Row>
                    </>
                  );
                }}
              />
            )}
          </div>
        </Form>
      </HotKeys>
    </React.Fragment>
  );
};

const styles = {
  margin: { marginBottom: 0 },
  table: { margin: '0px 0px 5px 0px' },
  search: { width: '210px' },
  minMaxButton: {
    background: '#F2F1F6',
    color: `${Colors.primaryColor}`,
    border: '1px',
  },
  minMaxIcon: { fontSize: '12px' },
  popover: { width: '150px' },
  switch: { marginInlineStart: '20px' },
  bodyTable: {
    // height: customerData.id ? "200px" : "50px",
    padding: '10px 0px',
  },
  collapse: { paddingBottom: '10px' },
  input: {
    width: '50px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  barcodeIcon: { fontSize: '22px' },
  barcodeButton: {
    borderStartStartRadius: '0px',
    borderEndStartRadius: '0px',
    borderStartEndRadius: '5px',
    borderEndEndRadius: '5px',
    paddingTop: '4px',
  },
};
export const MarketInvoiceTable1 = MarketInvoiceTable;

// React.memo(
//   MarketInvoiceTable,
//   (prevProps, nextProps) => {
//     if (
//       prevProps.data !== nextProps.data ||
//       prevProps.count !== nextProps.count ||
//       prevProps.selectedRowKeys !== nextProps.selectedRowKeys ||
//       prevProps.customer.cardId !== nextProps.customer.cardId ||
//       prevProps.editingKey !== nextProps.editingKey ||
//       prevProps.barcodeSearch !== nextProps.barcodeSearch
//     ) {
//       return false;
//     }
//     return true;
//   }
// );
