import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import AddUnit from './AddUnit';
import Draggable from 'react-draggable';
import { SHOW_BASE_UNIT_MESSAGE } from '../../../localStorageVars';
import { GlobalHotKeys } from 'react-hotkeys';
import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Dropdown,
  Menu,
  message,
  Tabs,
  Tooltip,
  InputNumber,
  Checkbox,
  Typography,
} from 'antd';
import { useMediaQuery } from '../../MediaQurey';
// import { connect } from "react-redux";
// import { useDatabase } from "@nozbe/watermelondb/hooks";
// import withObservables from "@nozbe/with-observables";
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
import Uplod from '../Upload';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { AddItem } from '../../SelfComponents/AddItem';
import { ModalDragTitle } from '../../SelfComponents/ModalDragTitle';
import { Styles } from '../../styles';
import { CategoryField } from '../../SelfComponents/CategoryField';
import { trimString } from '../../../Functions/TrimString';
import { ActionMessage } from '../../SelfComponents/TranslateComponents/ActionMessage';
import AddProductMultipleBarcode from './MultipleBarcode/AddProductMultipleBarcode';
import { debounce } from 'throttle-debounce';
import useGetBaseCurrency from '../../../Hooks/useGetBaseCurrency';
import { fixedNumber, math, print } from '../../../Functions/math';
import { InfiniteScrollSelectFormItem } from '../../../components/antd';
import {
  useGetCalender,
  useGetDefaultCategory,
  useGetDefaultSupplier,
} from '../../../Hooks';
import {
  PageNewButton,
  ResetButton,
  SaveAndNewButton,
} from '../../../components';
import { PRODUCT_M } from '../../../constants/permissions';
import AddOpeningAccount from './AddOpeningAccount';
import { addMessage, manageErrors } from '../../../Functions';
import { handlePrepareDateForServer } from '../../../Functions/utcDate';

const { Option } = Select;
const { TabPane } = Tabs;
const dateFormat = 'YYYY-MM-DD HH:mm';
const expireDateFormat = 'YYYY-MM-DD';
const ReachableContext = React.createContext();
const UnreachableContext = React.createContext();
const AddProduct = (props) => {
  const { t } = useTranslation();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [visible, setVisible] = useState(false);
  const [productListVisible, setProductListVisible] = useState(true);
  const addBarcodeRef = useRef(null);
  const [file, setFile] = useState();
  const [fileList, setFileList] = useState([]);
  const [barcodeList, setBarcodeList] = useState([]);
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);
  const [showBaseUnitMessage, setShowBaseUnitMessage] = useState(false);
  const [visitedTabs, setVisitedTabs] = useState(['']);
  const [defaultUnit, setDefaultUnit] = useState([]);
  const [default1, setDefault1] = useState('');
  const [error, setError] = useState(false);
  const [searchProduct, setSearchProduct] = useState('');
  const [keyTab, setKeyTab] = useState('1');
  const [productInventory, setProductInventory] = useState([]);

  const isMiniComputer = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');
  const [modal, contextHolder] = Modal.useModal();

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  //search product from product list
  const handleSearchProductName = async ({ queryKey }) => {
    const { searchProduct } = queryKey?.[1] || {};
    const { data } = await axiosInstance.get(
      `${props.baseUrl}?fields=name,id&page_size=10&search=${searchProduct}`
    );
    return data;
  };

  const productList = useQuery(
    [`${props.baseUrl}name/`, { searchProduct }],
    handleSearchProductName,
    { enabled: !!searchProduct }
  );

  const handleSearchProduct = (e) => {
    debounceHandleSearchProduct(e.target.value);
  };

  const debounceHandleSearchProduct = debounce(400, async (value) => {
    setSearchProduct(value);
  });

  const productMenu = (
    <Menu style={styles.productList}>
      {productList?.data?.results?.map((item) => (
        <Menu.Item key={item?.id}>{item?.name}</Menu.Item>
      ))}
    </Menu>
  );

  const config = (type, name, list) => ({
    title: name,
    content: (
      <React.Fragment>
        {type === 'barcode'
          ? list?.map((item, index) => (
              <React.Fragment key={index}>
                {(item?.barcode || item?.default || item?.unit) && (
                  <React.Fragment>
                    <Typography.Text strong={true}>{`${t('Pagination.Item')} ${
                      index + 1
                    }`}</Typography.Text>
                    <ul style={styles.barcodeErrorList}>
                      {item?.barcode?.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                      {item?.default?.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                      {item?.unit?.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </React.Fragment>
                )}
              </React.Fragment>
            ))
          : list?.map((item, index) => (
              <React.Fragment key={index}>
                {(item?.from_unit || item?.ratio) && (
                  <React.Fragment>
                    <Typography.Text strong={true}>{`${t('Pagination.Item')} ${
                      index + 1
                    }`}</Typography.Text>
                    <ul style={styles.barcodeErrorList}>
                      {item?.from_unit?.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                      {item?.ratio?.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </React.Fragment>
                )}
              </React.Fragment>
            ))}
      </React.Fragment>
    ),
  });

  //get default category
  const defaultCategory = useGetDefaultCategory('/product/category/');

  //get default supplier
  const defaultSupplier = useGetDefaultSupplier();

  const onTabClick = (key) => {
    setVisitedTabs((prev) => [...prev, key]);
    if (key === '2') {
      setKeyTab(key);
      const row = form.getFieldsValue();

      if (
        row?.unitConversion?.length === 0 ||
        row?.unitConversion?.length === undefined
      ) {
        const customUnits =
          defaultUnit &&
          defaultUnit
            ?.filter((item) => item.key !== default1?.key)
            ?.map((item) => {
              return {
                multiplier: 1,
                base_multiplier: undefined,
                from_unit: item,
                to_unit: default1?.label,
              };
            });
        form.setFieldsValue({
          unitConversion: customUnits,
        });
      }
    } else if (key === '3') {
      setKeyTab(key);
      const units = form.getFieldValue('units');
      const priceRecording = units?.map((item) => {
        return {
          unit: item,
        };
      });
      form.setFieldsValue({
        priceRecording: priceRecording,
      });
    } else {
      setKeyTab(key);
    }
  };

  const onChangeUnit = (value) => {
    setDefaultUnit(value);
    form.setFieldsValue({
      unitConversion: [],
    });
  };

  const onUnitsClear = () => {
    setDefault1();
    setBarcodeList([]);
    setProductInventory([]);
    form.setFieldsValue({
      base_unit: undefined,
      default_pur: undefined,
      default_sal: undefined,
    });
  };

  const onDeselectUnit = (value) => {
    const row = form.getFieldsValue();
    if (value?.value === row?.base_unit?.value) {
      setDefault1();
      form.setFieldsValue({ base_unit: undefined });
    }
    if (value?.value === row?.default_pur?.value) {
      form.setFieldsValue({ default_pur: undefined });
    }
    if (value?.value === row?.default_sal?.value) {
      form.setFieldsValue({ default_sal: undefined });
    }

    if (barcodeList?.length > 0) {
      setBarcodeList((prev) => {
        const newItem = prev?.filter(
          (item) => item?.unit?.value !== value?.value
        );
        return newItem;
      });
    }
    if (productInventory?.length > 0) {
      setProductInventory((prev) => {
        const newItem = prev?.filter((item) => item?.unit !== value?.label);
        return newItem;
      });
    }
  };

  const onChangeShowBaseUnitMessage = (e) => {
    const isChecked = e.target.checked;
    setShowBaseUnitMessage(isChecked);
  };

  const onClickBaseUnitMessage = (e) => {
    e.stopPropagation();
  };

  const onOkBaseUnitMessage = () => {
    localStorage.setItem(SHOW_BASE_UNIT_MESSAGE, showBaseUnitMessage);
  };

  const onChangeDefault = (value) => {
    setDefault1(value);
    const isShow = JSON.parse(localStorage.getItem(SHOW_BASE_UNIT_MESSAGE));

    if (isShow) {
      return;
    } else {
      Modal.warning({
        title: t('Sales.Product_and_services.Form.Base_unit_message'),
        content: (
          <Checkbox
            onClick={onClickBaseUnitMessage}
            onChange={onChangeShowBaseUnitMessage}
          >
            {t('Sales.Product_and_services.Form.Base_unit_message_show')}
          </Checkbox>
        ),
        onOk: onOkBaseUnitMessage,
        bodyStyle: {
          maxHeight: `calc(100vh - 165px)`,
          overflowY: 'auto',
          direction: t('Dir'),
        },

        centered: true,
        style: { top: 15, bottom: 15 },
      });
    }
  };

  const messageKey = 'addProduct';

  const handleAddProduct = async ({ value }) =>
    await axiosInstance.post(props.baseUrl, value, { timeout: 0 });

  const {
    mutate: mutateAddProduct,
    isLoading,
    reset,
  } = useMutation(handleAddProduct, {
    onSuccess: (values, { type, barcode }) => {
      props.handleUpdateItems();
      if (type !== '0') {
        setIsShowModal({
          visible: false,
        });
        addMessage(values?.data?.name);
      }
      if (type === '0') {
        setVisible(false);
        form.resetFields();
        setFileList([]);
        setDefaultUnit([]);
        setDefault1('');
        setKeyTab('1');
        setFile();
        setProductInventory([]);
        setVisitedTabs(['']);
        setDisabled(true);
        setShowBaseUnitMessage(false);
        setError(false);
        message.destroy(messageKey);

        message.success({
          content: (
            <ActionMessage name={values.data?.name} message='Message.Add' />
          ),
          duration: 3,
        });
      }

      if (props.place === 'salesInvoice') {
        props.setUnits(values?.data?.units);
        props.form.setFieldsValue({
          name: values?.data?.name,
          default_unit: values?.data?.default_unit?.id,
          id: values?.data?.id,
        });
      }

      if (!parseInt(barcode) && barcode) {
        message.info(t('Sales.Product_and_services.Product_barcode_message'));
      }
    },
    onError: (error) => {
      message.destroy(messageKey);
      manageErrors(error);
      if (error?.response?.data?.unit_conversion) {
        // const data = config(
        //   "unitConversion",
        //   t("Sales.Product_and_services.Form.Unit_conversion"),
        //   error?.response?.data?.unit_conversion
        // );
        // modal.error(data);
      } else if (error?.response?.data?.product_price?.[0]?.sales_rate) {
        message.error(
          `${error?.response.data?.product_price?.[0]?.sales_rate}`
        );
      } else if (error?.response?.data?.product_price?.[0]?.perches_rate) {
        message.error(
          `${error?.response.data?.product_price?.[0]?.perches_rate}`
        );
      } else if (error?.response?.data?.product_barcode) {
        const data = config(
          'barcode',
          t('Sales.Product_and_services.Form.Multiple_barcode'),
          error?.response?.data?.product_barcode
        );
        modal.error(data);

        if (error?.response?.data?.product_barcode?.message) {
          message.error(error?.response?.data?.product_barcode?.message?.[0]);
        }
      }
    },
  });

  //get base currency
  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyId = baseCurrency?.data?.id;

  const getPriceRecording = (unitId, unitConversion) => {
    const unit = unitConversion?.find(
      (item) => item?.from_unit?.value === unitId
    );
    return unit?.base_multiplier;
  };

  const handleOk = async (e) => {
    const type = e?.key;
    form
      .validateFields()
      .then(async (values) => {
        //

        // let products = database.collections.get("products");
        // await database.action(async () => {
        //   await products.create((product) => {
        //     product.name = values.name;
        //     product.barcode = values.barcode;
        //     product.icon = values.upload;
        //     product.group = values.group;
        //     product.sub_group = values.sub_group;
        //     product.description = values.description;
        //     product.status = "active";
        //   });
        // });
        // if (imageTypeError) {
        //   message.error(
        //     `${t("Sales.Product_and_services.Form.Image_type_error_message")}`
        //   );
        //   return;
        // } else
        if (error) {
          return;
        } else if (
          values?.unitConversion?.length !== values?.units?.length - 1 &&
          values?.units?.length !== 1
        ) {
          message.error({
            content: t(
              'Sales.Product_and_services.Form.Unit_conversion_error_message'
            ),
            duration: 4,
          });
          return;
        } else {
          const formData = new FormData();
          if (file) {
            formData.append('photo', file, file.name);
          }
          formData.append('name', trimString(values?.name));

          formData.append('category', values?.category?.value);
          if (values?.supplier?.value) {
            formData.append('supplier', values?.supplier?.value);
          }
          formData.append('is_asset', values.isFixedAssets);

          formData.append('is_have_vip_price', values.isVip);
          // formData.append("product_type", "product");
          formData.append(
            'description',
            values.description ? values?.description : ''
          );
          const baseUnit =
            defaultUnit.length === 1
              ? defaultUnit[0]?.value
              : values?.base_unit?.key;

          if (barcodeList?.length > 0) {
            barcodeList.forEach((item, index) => {
              formData.append(
                `product_barcode[${index}]barcode`,
                item?.barcode
              );
              formData.append(
                `product_barcode[${index}]unit`,
                item?.unit?.value
              );
              formData.append(
                `product_barcode[${index}]default`,
                item?.default
              );
              formData.append(
                `product_barcode[${index}]original`,
                item?.original
              );
            });
          } else {
            if (values.barcode) {
              formData.append(`product_barcode[0]barcode`, values?.barcode);
              formData.append(`product_barcode[0]unit`, baseUnit);
              formData.append(`product_barcode[0]default`, true);
              formData.append(
                `product_barcode[0]original`,
                values.isOriginBarcode
              );
            } else {
              formData.append(`product_barcode[0]barcode`, '');
            }
          }

          formData.append('base_unit', baseUnit);

          const defaultSal = values?.default_sal?.key
            ? values?.default_sal?.key
            : defaultUnit.length === 1
            ? defaultUnit?.[0]?.value
            : values?.base_unit?.key;
          formData.append('default_sal', defaultSal);

          const defaultPur = values?.default_pur?.key
            ? values?.default_pur?.key
            : defaultUnit.length === 1
            ? defaultUnit?.[0]?.value
            : values?.base_unit?.key;
          formData.append('default_pur', defaultPur);
          const units = values?.units?.map((item) => {
            return {
              unit: item?.value,
              default_sal: item?.value === defaultSal ? true : false,
              default_pur: item?.value === defaultPur ? true : false,
              base_unit: item?.value === baseUnit ? true : false,
            };
          });

          // units &&
          units.forEach((item, index) => {
            formData.append(
              `product_units[${index}]default_pur`,
              item?.default_pur
            );
            formData.append(`product_units[${index}]unit`, item?.unit);
            formData.append(
              `product_units[${index}]default_sal`,
              item?.default_sal
            );
            formData.append(
              `product_units[${index}]base_unit`,
              item?.base_unit
            );
          });
          units.forEach((item, index) => {
            formData.append(
              `product_units[${index}]default_pur`,
              item?.default_pur
            );
            formData.append(`product_units[${index}]unit`, item?.unit);
            formData.append(
              `product_units[${index}]default_sal`,
              item?.default_sal
            );
            formData.append(
              `product_units[${index}]base_unit`,
              item?.base_unit
            );
          });

          if (values.unitConversion) {
            values.unitConversion.forEach((item, index) => {
              formData.append(
                `unit_conversion[${index}]from_unit`,
                item?.from_unit.value
              );
              formData.append(
                `unit_conversion[${index}]ratio`,
                item?.base_multiplier
              );
            });
          }
          if (productInventory?.length > 0) {
            productInventory.forEach((item, index) => {
              formData.append(
                `onhand_product[${index}]registered_date`,
                handlePrepareDateForServer({
                  date: item?.registerDate,
                  calendarCode,
                })
              );
              formData.append(
                `onhand_product[${index}]warehouse_in`,
                item?.warehouse?.value
              );
              formData.append(
                `onhand_product[${index}]expire_date`,
                handlePrepareDateForServer({
                  date: item?.expirationDate,
                  calendarCode,
                  dateFormat: expireDateFormat,
                }) ?? ''
              );
              formData.append(`onhand_product[${index}]qty`, item?.qty);
              formData.append(
                `onhand_product[${index}]each_price`,
                item?.price
              );
              formData.append(`onhand_product[${index}]unit`, baseUnit);
              formData.append(
                `onhand_product[${index}]unit_conversion_rate`,
                1
              );
            });
          }

          if (values?.units?.length < 2) {
            if (values?.perches_rate || values?.sales_rate) {
              formData.append(
                `product_price[0]perches_rate`,
                values?.perches_rate ? values?.perches_rate : 0
              );
              formData.append(
                `product_price[0]sales_rate`,
                values?.sales_rate ? values?.sales_rate : 0
              );
              formData.append(
                `product_price[0]unit`,
                values?.units?.[0]?.value
              );
              formData.append(`product_price[0]currency`, baseCurrencyId);
              formData.append(`product_price[0]currency_rate`, 1);
            }
          } else {
            if (Boolean(values?.purchase) && values?.purchase > 0) {
              const unitCon = getPriceRecording(
                values?.unitPurchase?.value,
                values?.unitConversion
              );

              const baseUnitPurchase = unitCon
                ? fixedNumber(
                    print(math.evaluate(`${values?.purchase}/ ${unitCon}`)),
                    7
                  )
                : values?.purchase;
              values.priceRecording.forEach((item, index) => {
                formData.append(
                  `product_price[${index}]perches_rate`,
                  getPriceRecording(item?.unit?.value, values?.unitConversion)
                    ? getPriceRecording(
                        item?.unit?.value,
                        values?.unitConversion
                      ) * baseUnitPurchase ? 0
                    : baseUnitPurchase
                    : 0
                );
                // formData.append(
                //   `product_price[${index}]perches_rate`,
                //   getPriceRecording(item?.unit?.value, values?.unitConversion)
                //     ? getPriceRecording(
                //         item?.unit?.value,
                //         values?.unitConversion
                //       ) * values?.purchase ?? 0
                //     : values?.purchase
                // );
                formData.append(
                  `product_price[${index}]sales_rate`,
                  item?.sales_rate ? item?.sales_rate : 0
                );
                formData.append(
                  `product_price[${index}]unit`,
                  item?.unit?.value
                );
                formData.append(
                  `product_price[${index}]currency`,
                  baseCurrencyId
                );
                formData.append(`product_price[${index}]currency_rate`, 1);
              });
            } else if (visitedTabs?.includes('3')) {
              values.priceRecording.forEach((item, index) => {
                if (item?.sales_rate) {
                  formData.append(`product_price[${index}]perches_rate`, 0);
                  formData.append(
                    `product_price[${index}]sales_rate`,
                    item?.sales_rate
                  );
                  formData.append(
                    `product_price[${index}]unit`,
                    item?.unit?.value
                  );
                  formData.append(
                    `product_price[${index}]currency`,
                    baseCurrencyId
                  );
                  formData.append(`product_price[${index}]currency_rate`, 1);
                }
              });
            } else {
              values.priceRecording.forEach((item, index) => {
                formData.append(
                  `product_price[${index}]perches_rate`,
                  item?.perches_rate ? item?.perches_rate : 0
                );
                formData.append(
                  `product_price[${index}]sales_rate`,
                  item?.sales_rate ? item?.sales_rate : 0
                );
                formData.append(
                  `product_price[${index}]unit`,
                  item?.unit?.value
                );
                formData.append(
                  `product_price[${index}]currency`,
                  baseCurrencyId
                );
                formData.append(`product_price[${index}]currency_rate`, 1);
              });
            }
          }

          if (type === '0') {
            message.loading({
              content: t('Message.Loading'),
              key: messageKey,
            });
          }

          mutateAddProduct({
            value: formData,
            type,
            barcode: values?.barcode,
          });
        }
      })
      .catch((info) => {
        if (
          info?.errorFields?.[0]?.name?.[2] === 'base_multiplier' &&
          keyTab !== '2'
        ) {
          message.error({
            content: t(
              'Sales.Product_and_services.Form.Unit_conversion_error_message'
            ),
            duration: 5,
          });
        }
      });
  };

  const onReset = () => {
    form.resetFields();
    setFileList([]);
    setDefaultUnit([]);
    setDefault1('');
    setKeyTab('1');
    setFile();
    setVisitedTabs(['']);
    setBarcodeList([]);
    setProductInventory([]);
    setDisabled(true);
    setShowBaseUnitMessage(false);
    setError(false);
    reset();
  };

  const showModal = () => {
    setIsShowModal({
      visible: true,
    });
  };

  const handleCancel = (e) => {
    setIsShowModal({
      visible: false,
    });
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  //upload
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const keyMap = {
    NEW_PRODUCT: ['Shift+N', 'Control+p'],
  };

  const handlers = {
    NEW_PRODUCT: (event) => {
      event.preventDefault();
      event.stopPropagation();

      showModal();
    },
  };

  const handleClickBarcode = async () => {
    await axiosInstance
      .get(`${props.baseUrl}generate_unique_barcode/`)
      .then((res) => {
        const barcode = res?.data?.[0];
        form.setFieldsValue({ barcode: barcode, isOriginBarcode: false });
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };

  const handleFocusName = () => {
    setProductListVisible(true);
  };
  const handleBlurName = () => {
    setProductListVisible(false);
  };

  return (
    <div>
      {props.place === 'salesInvoice' ? (
        <AddItem showModal={showModal} />
      ) : (
        <GlobalHotKeys keyMap={keyMap} handlers={handlers} allowChanges={true}>
          <PageNewButton onClick={showModal} model={PRODUCT_M} />

          {/* <Row onClick={showModal} align="middle" className="Button">
            <Col xl={5} md={{ span: 6 }} xs={{ span: 6 }}>
              <DropboxOutlined className=" Button__icon" />
            </Col>
            <Col
              xl={18}
              md={{ span: 17, offset: 1 }}
              xs={{ span: 17, offset: 1 }}
            >
              <p className="modal__p">
                {t("Sales.Product_and_services.Product")}
                <br />
                <span className="modal__span">
                  {t("Sales.Product_and_services.Product_description")}
                </span>
              </p>
            </Col>
          </Row> */}
        </GlobalHotKeys>
      )}

      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Sales.Product_and_services.Product_information')}
          />
        }
        afterClose={onReset}
        open={isShowModal.visible}
        okText='submit'
        centered
        destroyOnClose={true}
        width={
          isMobile
            ? '100vw'
            : isMiniTablet
            ? '85vw'
            : isTablet
            ? 520
            : isMiniComputer
            ? 520
            : 520
        }
        onCancel={handleCancel}
        style={Styles.modal(isMobile)}
        bodyStyle={Styles.modalBody(isMobile, isSubBase, isMiniTablet)}
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
        footer={
          <ReachableContext.Provider value='Light'>
            <Row justify='space-between'>
              <Col>
                <ResetButton onClick={onReset} />
              </Col>
              <Col>
                <SaveAndNewButton
                  onSubmit={handleOk}
                  loading={isLoading}
                  open={visible}
                  setVisible={setVisible}
                />
              </Col>
            </Row>
            {contextHolder}

            <UnreachableContext.Provider value='Bamboo' />
          </ReachableContext.Provider>
        }
      >
        <Form
          form={form}
          hideRequiredMark={true}
          scrollToFirstError={true}
          layout='vertical'
          initialValues={{
            category: { label: defaultCategory?.name, value: 1 },
            convertUnit: { multiplier: 1 },
            convertUnit1: { multiplier: 1 },
            isFixedAssets: false,
            isVip: false,
            isOriginBarcode: true,
            supplier: {
              value: 201001,
              label: defaultSupplier?.full_name,
            },
          }}
        >
          <Row gutter={10}>
            <Col xl={{ span: 17 }} md={{ span: 16 }} xs={{ span: 15 }}>
              <Dropdown overlay={productMenu} open={productListVisible}>
                <Form.Item
                  label={
                    <span>
                      {t('Form.Name')}
                      <span className='star'>*</span>
                    </span>
                  }
                  name='name'
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: t('Form.Name_required'),
                    },
                  ]}
                >
                  <Input
                    autoFocus
                    autoComplete='off'
                    onChange={handleSearchProduct}
                    onFocus={handleFocusName}
                    onBlur={handleBlurName}
                  />
                </Form.Item>
              </Dropdown>
              <Form.Item noStyle>
                <CategoryField
                  form={form}
                  url='/product/category/'
                  label={
                    <span>
                      {t('Sales.Product_and_services.Form.Category')}
                      <span className='star'>*</span>
                    </span>
                  }
                  style={styles.formItem}
                />
              </Form.Item>
            </Col>
            <Col
              xl={{ span: 7 }}
              md={{ span: 8 }}
              xs={{ span: 9 }}
              className='upload_col'
            >
              <Form.Item
                name='upload'
                getValueFromEvent={normFile}
                help={error ? `${t('Form.Photo_error')}` : undefined}
                validateStatus={error === true ? 'error' : undefined}
                className='upload'
              >
                <Uplod
                  setFile={setFile}
                  name={t('Form.Photo')}
                  setFileList={setFileList}
                  fileList={fileList}
                  setError={setError}
                  onChange={onChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            {defaultUnit?.length < 2 && (
              <Col span={12}>
                <InfiniteScrollSelectFormItem
                  name='units'
                  label={
                    <span>
                      {t('Sales.Product_and_services.Form.Units')}
                      <span className='star'>*</span>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: t(
                        'Sales.Product_and_services.Form.Units_required'
                      ),
                    },
                  ]}
                  addItem={<AddUnit form={form} setUnits={setDefaultUnit} />}
                  fields='name,id,symbol'
                  mode='multiple'
                  baseUrl='/product/unit/'
                  onChange={onChangeUnit}
                  onClear={onUnitsClear}
                  onDeselect={onUnitsClear}
                  allowClear={true}
                />
              </Col>
            )}
            <Col xl={{ span: 12 }} md={{ span: 12 }} xs={{ span: 24 }}>
              <Form.Item
                name='barcode'
                label={t('Sales.Product_and_services.Form.Barcode')}
                style={styles.formItem}
              >
                <Input.Group compact name='barcode1'>
                  <Form.Item name='barcode' noStyle style={styles.formItem}>
                    <Input
                      className='num'
                      style={{ width: `calc(100% - 45px)` }}
                      readOnly={barcodeList?.length > 0}
                      placeholder={
                        barcodeList?.length > 0
                          ? `${barcodeList?.[0]?.barcode} ******************`
                          : ''
                      }
                      prefix={
                        <AddProductMultipleBarcode
                          units={defaultUnit}
                          form={form}
                          baseUrl={props.baseUrl}
                          setBarcodeList={setBarcodeList}
                          barcodeList={barcodeList}
                        />
                      }
                    />
                  </Form.Item>
                  <Button
                    type='primary'
                    ref={addBarcodeRef}
                    onClick={handleClickBarcode}
                    style={{ width: '45px' }}
                    disabled={barcodeList?.length > 0}
                    icon={<PlusOutlined />}
                  ></Button>
                </Input.Group>
              </Form.Item>
            </Col>
            {defaultUnit?.length < 2 && (
              <Col span={12}>
                <Form.Item
                  name='perches_rate'
                  label={
                    <span>
                      {t(
                        'Sales.Product_and_services.Price_recording.Purchase_price'
                      )}
                    </span>
                  }
                  style={styles.formItem}
                >
                  <InputNumber
                    min={0.01}
                    type='number'
                    className='num'
                    inputMode='numeric'
                  />
                </Form.Item>
              </Col>
            )}
            {defaultUnit?.length < 2 && (
              <Col span={12}>
                <Form.Item
                  name='sales_rate'
                  label={
                    <span>
                      {t(
                        'Sales.Product_and_services.Price_recording.Sales_price'
                      )}
                    </span>
                  }
                  style={styles.formItem}
                >
                  <InputNumber
                    min={0.01}
                    type='number'
                    className='num'
                    inputMode='numeric'
                  />
                </Form.Item>
              </Col>
            )}

            <Col xl={{ span: 12 }} md={{ span: 12 }} xs={{ span: 24 }}>
              <InfiniteScrollSelectFormItem
                name='supplier'
                label={t('Expenses.Suppliers.Supplier')}
                style={styles.formItem}
                fields='full_name,id'
                baseUrl='/supplier_account/supplier/'
              />
            </Col>
            <Col
              xl={{ span: defaultUnit?.length < 2 ? 12 : 24 }}
              md={{ span: defaultUnit?.length < 2 ? 12 : 24 }}
              xs={{ span: 24 }}
            >
              <Form.Item name='description' label={t('Form.Description')}>
                <Input.TextArea
                  autoSize={{ minRows: 1, maxRows: 3 }}
                  showCount={true}
                />
              </Form.Item>
            </Col>
            <Col xl={{ span: 24 }} md={{ span: 24 }} xs={{ span: 24 }}>
              <Row>
                <Col span={8}>
                  <Form.Item
                    name='isOriginBarcode'
                    style={{ marginTop: '0px', marginBottom: '10px' }}
                    valuePropName='checked'
                  >
                    <Checkbox disabled={barcodeList?.length > 0}>
                      {t('Sales.Product_and_services.Form.Is_origin_barcode')}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name='isFixedAssets'
                    style={{ marginTop: '0px', marginBottom: '10px' }}
                    valuePropName='checked'
                  >
                    <Checkbox>
                      {t('Sales.Product_and_services.Form.Is_fixed_assets')}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name='isVip'
                    style={{ marginTop: '0px', marginBottom: '10px' }}
                    valuePropName='checked'
                  >
                    <Checkbox>
                      {t('Sales.Product_and_services.Form.Vip_price')}
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

          {defaultUnit?.length > 1 && (
            <Tabs
              type='card'
              size='small'
              activeKey={keyTab}
              onTabClick={onTabClick}
              tabBarStyle={styles.tab(isMobile)}
              style={{ width: '100%' }}
            >
              <TabPane
                tab={t('Sales.Product_and_services.Form.Units')}
                key='1'
                forceRender={true}
              >
                <Row gutter={[10]}>
                  <Col span={12}>
                    <InfiniteScrollSelectFormItem
                      name='units'
                      label={
                        <span>
                          {t('Sales.Product_and_services.Form.Units')}
                          <span className='star'>*</span>
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: t(
                            'Sales.Product_and_services.Form.Units_required'
                          ),
                        },
                      ]}
                      addItem={
                        <AddUnit form={form} setUnits={setDefaultUnit} />
                      }
                      style={styles.formItem}
                      fields='name,id,symbol'
                      mode='multiple'
                      baseUrl='/product/unit/'
                      onChange={onChangeUnit}
                      onClear={onUnitsClear}
                      onDeselect={onDeselectUnit}
                      allowClear={true}
                      maxTagCount='responsive'
                    />
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='base_unit'
                      style={styles.formItem}
                      label={
                        <span style={styles.name}>
                          {t('Sales.Product_and_services.Form.Base_unit')}
                          <span className='star'>*</span>
                          <Tooltip
                            title={t(
                              'Sales.Product_and_services.Form.Base_unit_message'
                            )}
                          >
                            &nbsp;&nbsp;
                            <QuestionCircleOutlined />
                          </Tooltip>
                        </span>
                      }
                      rules={[
                        {
                          message: t(
                            'Sales.Product_and_services.Form.Default_unit_required'
                          ),
                          required: defaultUnit.length !== 1 ? true : undefined,
                        },
                      ]}
                    >
                      <Select
                        onChange={onChangeDefault}
                        labelInValue
                        showSearch
                      >
                        {defaultUnit?.map((item) => (
                          <Option value={item.value} key={item.key}>
                            {item.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={10}>
                  <Col span={12}>
                    <Form.Item
                      name='default_pur'
                      label={
                        <span>
                          {t('Sales.Product_and_services.Form.Purchases_unit')}
                        </span>
                      }
                    >
                      <Select
                        notFoundContent={
                          <span>
                            {t(
                              'Sales.Product_and_services.Form.Select_unit_error'
                            )}
                          </span>
                        }
                        labelInValue
                        showSearch
                      >
                        {defaultUnit?.map((item) => (
                          <Option value={item.value} key={item.key}>
                            {item.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='default_sal'
                      label={
                        <span style={styles.name}>
                          {t('Sales.Product_and_services.Form.Sales_unit')}

                          <Tooltip
                            title={
                              <span>
                                {t(
                                  'Sales.Product_and_services.Form.Units_error'
                                )}
                              </span>
                            }
                          ></Tooltip>
                        </span>
                      }
                    >
                      <Select
                        notFoundContent={
                          <span>
                            {t(
                              'Sales.Product_and_services.Form.Select_unit_error'
                            )}
                          </span>
                        }
                        labelInValue
                        showSearch
                      >
                        {defaultUnit?.map((item) => (
                          <Option value={item.value} key={item.key}>
                            {item.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    {t('Sales.Product_and_services.Form.Unit_conversions')}
                    <span className='star'>*</span>
                  </span>
                }
                key='2'
                disabled={
                  defaultUnit.length < 2 || !default1?.key ? true : false
                }
              >
                <Row gutter={[5, 5]} align='middle'>
                  <Col span={24}>
                    <Form.List name='unitConversion'>
                      {(fields) => (
                        <>
                          {fields?.map((field, index) => (
                            //@ts-ignore
                            <Row
                              align='bottom'
                              gutter={5}
                              key={field?.key}
                              style={{
                                marginBottom: 8,
                              }}
                            >
                              <Col span={6}>
                                <Form.Item
                                  {...field}
                                  validateTrigger={['onChange', 'onBlur']}
                                  name={[field.name, 'base_multiplier']}
                                  fieldKey={[field.fieldKey, 'base_multiplier']}
                                  label={
                                    index === 0 ? (
                                      <span>
                                        {t(
                                          'Sales.Product_and_services.Form.Base_multiplier'
                                        )}
                                        <span className='star'>*</span>
                                      </span>
                                    ) : (
                                      ''
                                    )
                                  }
                                  rules={[
                                    {
                                      message: `${t('Form.Required')}`,
                                      required: true,
                                    },
                                  ]}
                                  style={styles.input}
                                >
                                  <InputNumber
                                    min={1}
                                    type='number'
                                    className='num'
                                    inputMode='numeric'
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item
                                  {...field}
                                  validateTrigger={['onChange', 'onBlur']}
                                  fieldKey={[field.fieldKey, 'to_unit']}
                                  name={[field.name, 'to_unit']}
                                  label={
                                    index === 0
                                      ? t(
                                          'Sales.Product_and_services.Form.Default_unit'
                                        )
                                      : ''
                                  }
                                  style={styles.input}
                                >
                                  <Select disabled showarrow={false}></Select>
                                </Form.Item>
                              </Col>
                              <Col span={1} style={styles.equal1}>
                                =
                              </Col>
                              <Col span={5}>
                                <Form.Item
                                  {...field}
                                  validateTrigger={['onChange', 'onBlur']}
                                  fieldKey={[field.fieldKey, 'multiplier']}
                                  name={[field.name, 'multiplier']}
                                  label={
                                    index === 0 ? (
                                      <span>
                                        {t(
                                          'Sales.Product_and_services.Form.Multiplier'
                                        )}
                                      </span>
                                    ) : (
                                      ''
                                    )
                                  }
                                  style={styles.input}
                                >
                                  <InputNumber
                                    min={0}
                                    type='number'
                                    className='num'
                                    disabled
                                    inputMode='numeric'
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item
                                  {...field}
                                  validateTrigger={['onChange', 'onBlur']}
                                  name={[field.name, 'from_unit']}
                                  fieldKey={[field.fieldKey, 'from_unit']}
                                  label={
                                    index === 0 ? (
                                      <span>
                                        {t(
                                          'Sales.Product_and_services.Form.From_unit'
                                        )}

                                        <Tooltip
                                          title={
                                            <span>
                                              {' '}
                                              {t(
                                                'Sales.Product_and_services.Form.Change_unit_message'
                                              )}
                                            </span>
                                          }
                                        >
                                          &nbsp;&nbsp;
                                        </Tooltip>
                                      </span>
                                    ) : (
                                      ''
                                    )
                                  }
                                  style={styles.input}
                                >
                                  <Select
                                    disabled
                                    labelInValue
                                    showarrow={false}
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          ))}
                        </>
                      )}
                    </Form.List>
                  </Col>
                </Row>
              </TabPane>
              <TabPane
                tab={t('Sales.All_sales.Invoice.Units_price')}
                key='3'
                disabled={
                  defaultUnit.length < 2 || !default1?.key ? true : false
                }
                forceRender={true}
              >
                <Row gutter={10}>
                  <Col span={12}>
                    <Form.Item
                      name='unitPurchase'
                      style={styles.formItem}
                      label={
                        <span>
                          {t('Sales.Product_and_services.Units.Unit')}
                        </span>
                      }
                    >
                      <Select labelInValue showSearch>
                        {defaultUnit?.map((item) => (
                          <Option value={item.value} key={item.key}>
                            {item.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='purchase'
                      style={styles.formItem}
                      label={
                        <span>
                          {t(
                            'Sales.Product_and_services.Price_recording.Purchase_price'
                          )}
                        </span>
                      }
                    >
                      <InputNumber
                        min={0.01}
                        type='number'
                        className='num'
                        inputMode='numeric'
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.List name='priceRecording'>
                  {(fields, { add, remove }) => (
                    <>
                      {fields?.map((field, index) => (
                        <Row
                          key={field.key}
                          style={{
                            marginBottom: 16,
                          }}
                        >
                          <Col span={24}>
                            <Row gutter={10}>
                              <Col span={12}>
                                <Form.Item
                                  {...field}
                                  validateTrigger={['onChange', 'onBlur']}
                                  fieldKey={[field.fieldKey, 'sales_rate']}
                                  name={[field.name, 'sales_rate']}
                                  label={
                                    index === 0 ? (
                                      <span>{t('Sales.1')}</span>
                                    ) : (
                                      ''
                                    )
                                  }
                                  style={styles.input}
                                >
                                  <InputNumber
                                    min={0.01}
                                    type='number'
                                    className='num'
                                    inputMode='numeric'
                                  />
                                </Form.Item>
                              </Col>

                              <Col span={12}>
                                <Form.Item
                                  {...field}
                                  validateTrigger={['onChange', 'onBlur']}
                                  name={[field.name, 'unit']}
                                  fieldKey={[field.fieldKey, 'unit']}
                                  label={
                                    index === 0 ? (
                                      <span>
                                        {t(
                                          'Sales.Product_and_services.Units.Unit'
                                        )}
                                      </span>
                                    ) : (
                                      ''
                                    )
                                  }
                                  rules={[
                                    {
                                      message: `${t('Form.Required')}`,
                                      required: true,
                                    },
                                  ]}
                                  style={styles.input}
                                >
                                  <Select disabled labelInValue>
                                    {props?.record?.product_units
                                      ?.filter(
                                        (item) =>
                                          item?.unit?.id !==
                                          props?.record?.product_units.filter(
                                            (item) => item?.base_unit === true
                                          )?.[0]?.unit?.id
                                      )
                                      ?.map((item) => (
                                        <Select.Option
                                        key={item?.unit?.id}
                                          value={item?.unit?.id}
                                          label={item?.unit?.name}
                                        >
                                          {item?.unit?.name}
                                        </Select.Option>
                                      ))}
                                  </Select>
                                </Form.Item>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      ))}
                    </>
                  )}
                </Form.List>
              </TabPane>
            </Tabs>
          )}

          <AddOpeningAccount
            {...{
              form,
              productInventory,
              setProductInventory,
              baseUnit:
                defaultUnit?.length === 1
                  ? defaultUnit?.[0]?.label
                  : default1?.label,
              dateFormat,
              expireDateFormat,
              calendarCode,
            }}
          />
        </Form>
      </Modal>
    </div>
  );
};

const styles = {
  tab: () => ({
    marginBottom: '5px',
  }),
  input: { marginBottom: '0px' },
  name: { marginBottom: '0px' },
  formItem: { marginBottom: '10px' },
  equal1: { paddingBottom: '6px', textAlign: 'center' },
  barcodeErrorList: {
    listStyleType: 'disclosure-closed',
    paddingInlineStart: '20px',
    marginBottom: '3px',
  },
  productList: { margin: '0px', padding: '0px' },
};

// const enhancProduct = withObservables(["groups"], ({ database }) => ({
//   groups: database.collections.get("groups").query().observe(),
// }));

// export default connect(null)(withDatabase(enhancProduct(ModalApp)));
export default AddProduct;
