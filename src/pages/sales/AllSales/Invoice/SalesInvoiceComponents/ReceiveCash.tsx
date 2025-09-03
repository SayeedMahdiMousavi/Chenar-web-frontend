import React, { useCallback, useState, useRef } from 'react';
import {
  Modal,
  Col,
  Row,
  Divider,
  Form,
  message,
  Checkbox,
  Typography,
  Select,
} from 'antd';
import { useMediaQuery } from '../../../../MediaQurey';
import { GlobalHotKeys } from 'react-hotkeys';
import axiosInstance from '../../../../ApiBaseUrl';
import { useTranslation } from 'react-i18next';
import { Styles } from '../../../../styles';
import Draggable from 'react-draggable';
import { ModalDragTitle } from '../../../../SelfComponents/ModalDragTitle';
import { CurrencyProperties } from '../../../../Transactions/Components/CurrencyProperties';
import { ReceiveDetailsProperties } from '../../../../Transactions/Components/ReceiveDetailsProperties';
import { CalculatedCurrencyProperties } from '../../../../Transactions/Components/CalculatedCurrencyProperties';
import { TranslateMessage } from '../../../../SelfComponents/TranslateComponents/TranslateMessage';
import { changeGToJ, utcDate } from '../../../../../Functions/utcDate';
import dayjs from 'dayjs';
import useGetRunningPeriod from '../../../../../Hooks/useGetRunningPeriod';
import useGetBaseCurrency from '../../../../../Hooks/useGetBaseCurrency';
import {
  CancelButton,
  EditButton,
  FormListAddButton,
  SaveButton,
} from '../../../../../components';
import { fixedNumber, math, print } from '../../../../../Functions/math';
import CashAndBankProperties from '../../../../Transactions/Components/CashAndBankProperties';
import { defaultStartPeriodDate } from '../../../../../constants';
import { manageErrors } from '../../../../../Functions';
import { JOURNAL_RESULT_LIST } from '../../../../../constants/routes';
import { reportsDateFormat } from '../../../../../Context';

const formItemLayout = {
  labelCol: {
    span: 24,
  },
};

interface IProps {
  place: string;
  type: string;
  invoiceType: string;
  form: any;
  setCashAmount: (value: number) => void;
  currencySymbol: string;
  totalPrice: number;
  prevCashCurrency?: { currency: number; amount: number; bank: number }[];
  actionType: string;
  calenderCode: string;
  responseId: boolean;
  item?: string;
  addDisabled?: boolean;
}

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const ReceiveCash: React.FC<IProps> = (props) => {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const ref = useRef<HTMLDivElement>(null);
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const isBgTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');
  const [currencyValue, setCurrencyValue] = useState(1);
  const [calCurrencyValue, setCalCurrencyValue] = useState(1);
  const [currencyRate, setCurrencyRate] = useState(1);
  const [{ currencySymbol, calCurrencySymbol }, setCurrencySymbol] = useState({
    currencySymbol: '',
    calCurrencySymbol: '',
  });
  const [showCalCurrency, setShowCalCurrency] = useState(false);

  //get running period
  const runningPeriod = useGetRunningPeriod();
  const curStartDate = runningPeriod?.data?.start_date;

  const showModal = () => {
    const row = props.form.getFieldsValue();
    const cashList = props?.form.getFieldValue('cashList');
    if (Boolean(props?.item)) {
      const cashItem = cashList?.find(
        (item: any, index: number) => index === parseInt(props?.item!),
      );
      if (cashItem?.currency?.value !== cashItem?.currency_calc?.value) {
        setShowCalCurrency(true);
      }

      //
      setCurrencyValue(cashItem?.currency?.value);
      setCalCurrencyValue(cashItem?.currency_calc?.value);
      setCurrencySymbol({
        currencySymbol: cashItem?.currencySymbol,
        calCurrencySymbol: cashItem?.calCurrencySymbol,
      });
      setCurrencyRate(cashItem?.currency_rate);
      const currency = {
        date: cashItem?.date_time,
        description: cashItem?.description,
        currency: cashItem?.currency,
        currencyRate: cashItem?.currency_rate,
        amount: cashItem?.amount,
        calAmount: cashItem?.amount_calc,
        calCurrency: cashItem?.currency_calc,
        calCurrencyRate: cashItem?.currency_rate_calc,
        showCalCurrency:
          cashItem?.currency?.value !== cashItem?.currency_calc?.value
            ? true
            : false,
      };

      if (props.type === 'recCash') {
        form.setFieldsValue({
          ...currency,
          accountName: cashItem?.pay_by,
          cashBoxName: cashItem?.rec_by,
        });
      } else {
        form.setFieldsValue({
          ...currency,
          accountName: cashItem?.rec_by,
          cashBoxName: cashItem?.pay_by,
        });
      }
    } else {
      const amount = cashList?.reduce((sum: number, item: any) => {
        return sum + item?.cashAmount;
      }, 0);

      const finalAmount = fixedNumber(
        print(
          //@ts-ignore
          math.evaluate(`${props?.totalPrice ?? 0} - ${amount ?? 0}`),
        ),
      );

      setCurrencyValue(row?.currency?.value);
      setCalCurrencyValue(row?.currency?.value);
      setCurrencySymbol({
        currencySymbol: props?.currencySymbol,
        calCurrencySymbol: props?.currencySymbol,
      });
      setCurrencyRate(row.currencyRate);
      form.setFieldsValue({
        date: row?.date,
        description: row.description,
        currency: row.currency,
        amount: finalAmount,
        calAmount: finalAmount,
        currencyRate: row.currencyRate,
        calCurrency: row.currency,
        calCurrencyRate: row.currencyRate,
        // accountId: `${
        //   props.place === "customerPayAndRecCash" ? "CUS" : "SUP"
        // }-${row.account?.value}`,
        accountName: row?.account,
      });
    }

    setIsShowModal({
      visible: true,
    });
  };

  const handleCheckAmountOfSpecificCurrency = ({
    currency,
    amount,
    bank,
  }: {
    currency: number;
    amount: number;
    bank: number;
  }) => {
    const cashList = props?.form.getFieldValue('cashList') || [];
    const finalList = Boolean(props?.item)
      ? cashList?.filter(
          (item: any, index: number) =>
            index !== parseInt(props?.item!) &&
            item?.currency?.value === currency &&
            item?.pay_by?.value === bank,
        )
      : cashList?.filter((item: any) => item?.currency?.value === currency);
    const listAmount = finalList?.reduce((sum: number, item: any) => {
      return fixedNumber(
        print(
          //@ts-ignore
          math.evaluate(`${sum} + ${item?.amount ?? 0}`),
        ),
      );
    }, 0);

    const finalAmount = fixedNumber(
      print(
        //@ts-ignore
        math.evaluate(`${listAmount} + ${amount ?? 0}`),
      ),
    );
    return finalAmount;
  };

  const handleCheckAmount = ({ cashAmount }: { cashAmount?: number }) => {
    const cashList = props?.form.getFieldValue('cashList') || [];

    const finalList = Boolean(props?.item)
      ? cashList?.filter(
          (_: any, index: number) => index !== parseInt(props?.item!),
        )
      : cashList;

    const listAmount = finalList?.reduce((sum: number, item: any) => {
      return fixedNumber(
        print(
          //@ts-ignore
          math.evaluate(`${sum} + ${item?.cashAmount ?? 0}`),
        ),
      );
    }, 0);

    const finalAmount = fixedNumber(
      print(
        //@ts-ignore
        math.evaluate(`${listAmount} + ${cashAmount ?? 0}`),
      ),
    );

    return { finalAmount, cashList };
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      setLoading(true);
      const row = props.form.getFieldsValue();

      const cashAmount = fixedNumber(
        print(
          //@ts-ignore
          math.evaluate(
            `(${values.currencyRate} / ${row?.currencyRate}) * ${values.amount}`,
          ),
        ),
      );
      const allData = {
        pay_by:
          props.type === 'payCash' ? values.cashBoxName : values.accountName,
        rec_by:
          props.type === 'recCash' ? values.cashBoxName : values.accountName,
        date_time: values.date,
        description: values.description,
        cashAmount: cashAmount,
        amount: values.amount,
        currency: values.currency,
        currency_rate: values.currencyRate,
        amount_calc: showCalCurrency ? values.calAmount : values.amount,
        currency_calc: showCalCurrency ? values.calCurrency : values.currency,
        currency_rate_calc: showCalCurrency
          ? values.calCurrencyRate
          : values.currencyRate,
        currencySymbol,
        calCurrencySymbol,
        bank: values.cashBoxName?.label,
      };

      const { finalAmount, cashList } = handleCheckAmount({ cashAmount });

      if (finalAmount > props?.totalPrice) {
        setLoading(false);
        message.warning(t('Invoice_payment_gt_invoice_total'));
      } else {
        if (props.type === 'payCash') {
          // const startDate = curStartDate
          //   ? moment(curStartDate, reportsDateFormat).format(reportsDateFormat)
          //   : defaultStartPeriodDate;
          const startDate = curStartDate
            ? curStartDate
            : defaultStartPeriodDate;
          await axiosInstance
            .get(
              `${JOURNAL_RESULT_LIST}?account=${
                values?.cashBoxName?.value
              }&date_time_after=${startDate}&date_time_before=${utcDate().format(
                reportsDateFormat,
              )}&currency=${values?.currency?.value}`,
            )
            .then((res) => {
              if (res?.data?.length === 0) {
                message.error(
                  <TranslateMessage
                    values={{
                      bank: values?.cashBoxName?.label,
                      currency: values?.currency?.label,
                    }}
                    message='Sales.Customers.Receive_cash.Pay_cash_enough_money_error_message'
                  />,
                );
                setLoading(false);
              } else {
                const debit = res?.data?.[0]?.debit ?? 0;
                const credit = res?.data?.[0]?.credit ?? 0;
                const prevCurrency = props?.prevCashCurrency?.find(
                  (item) =>
                    item?.currency === values?.currency?.value &&
                    item?.bank === values?.cashBoxName?.value,
                );

                const available =
                  props?.actionType === 'add' ||
                  (values?.currency?.value !== prevCurrency?.currency &&
                    props?.actionType === 'edit')
                    ? print(
                        //@ts-ignore
                        math.evaluate(`${debit} - ${credit}`),
                      )
                    : print(
                        //@ts-ignore
                        math.evaluate(
                          `(${debit} + ${
                            prevCurrency?.amount ?? 0
                          }) - ${credit}`,
                        ),
                      );

                const amount = handleCheckAmountOfSpecificCurrency({
                  currency: values?.currency?.value,
                  amount: values?.amount,
                  bank: values?.cashBoxName?.value,
                });

                if (fixedNumber(available, 10) < amount) {
                  message.error(
                    <TranslateMessage
                      values={{
                        bank: values?.cashBoxName?.label,
                        currency: values?.currency?.label,
                      }}
                      message='Sales.Customers.Receive_cash.Pay_cash_enough_money_error_message'
                    />,
                  );
                  setLoading(false);
                } else {
                  setLoading(false);
                  props?.setCashAmount(finalAmount);
                  setCurrencySymbol({
                    currencySymbol: '',
                    calCurrencySymbol: '',
                  });
                  if (Boolean(props?.item)) {
                    const newCashList = cashList?.map(
                      (item: any, index: number) => {
                        if (index === parseInt(props?.item!)) {
                          return { ...item, ...allData };
                        } else {
                          return item;
                        }
                      },
                    );
                    props?.form.setFieldsValue({ cashList: newCashList });
                    setIsShowModal({
                      visible: false,
                    });
                  } else {
                    props?.form.setFieldsValue({
                      cashList: [
                        ...cashList,
                        { ...allData, key: cashList?.length + 1 },
                      ],
                    });
                    setIsShowModal({
                      visible: false,
                    });
                    setCurrencyRate(1);
                  }
                }
              }
            })
            .catch((error) => {
              manageErrors(error);
              setLoading(false);
            });
        } else {
          // const cashList = props?.form.getFieldValue("cashList") || [];
          // const finalList = Boolean(props?.item)
          //   ? cashList?.filter(
          //       (item: any, index: number) => index !== parseInt(props?.item!)
          //     )
          //   : cashList;
          // const amount = finalList?.reduce((sum: number, item: any) => {
          //   return sum + item?.cashAmount;
          // }, 0);
          // const finalAmount = fixedNumber(
          //   print(
          //     //@ts-ignore
          //     math.evaluate(`${amount} + ${cashAmount}`)
          //   )
          // );
          // const { finalAmount, cashList } = handleCheckAmount({ cashAmount });

          // if (finalAmount > props?.totalPrice) {
          //   setLoading(false);
          //   message.warning(t("Invoice_payment_gt_invoice_total"));
          // } else {
          props?.setCashAmount(finalAmount);
          setCurrencySymbol({ currencySymbol: '', calCurrencySymbol: '' });
          if (Boolean(props?.item)) {
            const newCashList = cashList?.map((item: any, index: number) => {
              if (index === parseInt(props?.item!)) {
                return { ...item, ...allData };
              } else {
                return item;
              }
            });
            props?.form.setFieldsValue({ cashList: newCashList });
            setIsShowModal({
              visible: false,
            });
          } else {
            props?.form.setFieldsValue({
              cashList: [
                ...cashList,
                { ...allData, key: cashList?.length + 1 },
              ],
            });
            setIsShowModal({
              visible: false,
            });
            setCurrencyRate(1);
          }
        }
      }
    });
  };

  const handleAfterClose = () => {
    setIsShowModal({
      visible: false,
    });
    form.resetFields();
    setLoading(false);
    setCalCurrencyValue(1);
    setCurrencyValue(1);
    setShowCalCurrency(false);
  };

  const handleCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };

  const keyMap = {
    NEW_CUSTOMER: ['Control+M', 'Control+m'],
  };

  const handlers = {
    NEW_CUSTOMER: (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      setIsShowModal({
        visible: true,
      });
    },
  };

  const orientation = i18n.language === 'en' ? 'left' : 'right';

  //get base currency
  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyId = baseCurrency?.data?.id;
  const baseCurrencyName = baseCurrency?.data?.name;

  React.useEffect(() => {
    setCurrencyValue(baseCurrencyId);
    setCalCurrencyValue(baseCurrencyId);
  }, [baseCurrencyId]);

  const onChangeCurrency = useCallback(
    (value: any) => {
      const formData = form.getFieldsValue();

      const currencyRate1 = fixedNumber(
        print(
          //@ts-ignore
          math.evaluate(
            `(${value?.base_amount ?? 0})/ ${value?.equal_amount ?? 1}`,
          ),
        ),
        20,
      );
      setCurrencyRate(currencyRate1);

      form.setFieldsValue({
        amount: fixedNumber(
          print(
            //@ts-ignore
            math.evaluate(
              `(${formData?.amount ?? 0}*${currencyRate})/ ${currencyRate1}`,
            ),
          ),
          4,
        ),
        currencyRate: currencyRate1,
      });

      setCurrencySymbol((prev) => ({ ...prev, currencySymbol: value?.symbol }));
    },
    [currencyRate, form],
  );

  const onChangeCalCurrency = useCallback((value: any) => {
    setCurrencySymbol((prev) => ({
      ...prev,
      calCurrencySymbol: value?.symbol,
    }));
  }, []);

  const accountFormItem = (
    <Row gutter={10}>
      <Col span={7}>
        <Form.Item name='accountName' style={styles.formItem}>
          <Select disabled labelInValue>
            <Select.Option value='dfkldlf'> dfdfd</Select.Option>
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );

  const handleChangeCashId = useCallback(
    (value: any) => {
      form.setFieldsValue({ cashBoxName: value });
    },
    [form],
  );

  const handleChangeCashName = useCallback(
    (value: any) => {
      form.setFieldsValue({ cashBoxId: value });
    },
    [form],
  );

  const handleChangeIsCalculated = (e: any) => {
    const row = form.getFieldsValue();
    setShowCalCurrency(e.target.checked);

    // if (row?.calCurrency?.value === row?.currency?.value) {
    if (e.target.checked === true) {
      form.setFieldsValue({
        calAmount: row.amount * row.currencyRate,
      });
    } else {
      form.setFieldsValue({
        calCurrency: {
          value: baseCurrencyId,
          label: baseCurrencyName,
        },
        calCurrencyRate: 1,
        calAmount: 1,
      });
    }
    // } else {
    //   if (e.target.checked === true) {
    //     form.setFieldsValue({
    //       calAmount: row.amount * row.currencyRate,
    //     });
    //   } else {
    //     form.setFieldsValue({
    //       calCurrency: {
    //         value: baseCurrencyId,
    //         label: baseCurrencyName,
    //       },
    //       calCurrencyRate: 1,
    //       calAmount: 1,
    //     });
    //   }
    // }
  };

  return (
    <div>
      <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
        {!Boolean(props?.item) ? (
          <FormListAddButton
            style={{ marginTop: '10px' }}
            text={
              props?.invoiceType === 'sales' ||
              props?.invoiceType === 'purchase_rej'
                ? t('New_cash_receivement')
                : t('New_cash_payment')
            }
            onClick={showModal}
            disabled={props?.addDisabled}
          />
        ) : (
          <EditButton
            disabled={props.totalPrice <= 0 || Boolean(props.responseId)}
            onClick={showModal}
          />
        )}
      </GlobalHotKeys>

      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={
              props.type === 'payCash'
                ? t('Employees.Pay_cash_information')
                : t('Employees.Receive_cash_information')
            }
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled} nodeRef={ref as React.RefObject<HTMLElement>}>
            <div ref={ref}>{modal}</div>
          </Draggable>
        )}
        centered
        open={isShowModal.visible}
        onCancel={handleCancel}
        afterClose={handleAfterClose}
        width={isMobile ? '100%' : isTablet ? '70%' : isBgTablet ? 740 : 740}
        style={Styles.modal(isMobile)}
        bodyStyle={Styles.modalBody(isMobile, isSubBase, isMiniTablet)}
        footer={
          <Row justify='end' align='middle'>
            <Col>
              <CancelButton onClick={handleCancel} />
              <SaveButton onClick={handleOk} loading={loading} />
            </Col>
          </Row>
        }
      >
        <Form
          {...formItemLayout}
          form={form}
          hideRequiredMark={true}
          scrollToFirstError={true}
          initialValues={{
            date:
              props?.calenderCode === 'gregory'
                ? utcDate()
                : dayjs(changeGToJ(utcDate().format(dateFormat), dateFormat), {
                    //@ts-ignore
                    jalali: true,
                  }),
            currency: {
              value: baseCurrencyId,
              label: baseCurrencyName,
            },
            currencyRate: 1,
            calCurrency: {
              value: baseCurrencyId,
              label: baseCurrencyName,
            },
            calCurrencyRate: 1,
            showCalCurrency: false,
          }}
        >
          <Row>
            <Col span={24}>
              <Divider orientation={orientation}>
                {t('Sales.Customers.Receive_cash.Payer')}
              </Divider>
              {props.type === 'payCash' ? (
                <CashAndBankProperties
                  form={form}
                  fieldId='cashBoxId'
                  fieldName='cashBoxName'
                  onChangBankId={handleChangeCashId}
                  onChangBankName={handleChangeCashName}
                />
              ) : (
                accountFormItem
              )}

              <Divider orientation={orientation}>
                {t('Sales.Customers.Receive_cash.Receive_details')}
              </Divider>
              <ReceiveDetailsProperties
                type='recordExpanse'
                disableDate={true}
              />
              <Divider orientation={orientation}>
                {t('Sales.Customers.Receive_cash.Paid_currency')}
              </Divider>
              <CurrencyProperties
                setCurrencyValue={setCurrencyValue}
                currencyValue={currencyValue}
                form={form}
                type='invoice'
                onChangeCurrency={onChangeCurrency}
              />
              <Form.Item
                name='showCalCurrency'
                valuePropName='checked'
                style={styles.calculatedCurrencyFormItem}
              >
                <Checkbox onChange={handleChangeIsCalculated}>
                  <Typography.Text strong={true}>
                    {t('Sales.Customers.Receive_cash.Calculate_currency')}
                  </Typography.Text>
                </Checkbox>
              </Form.Item>
              {showCalCurrency && (
                <Divider orientation={orientation}>
                  {t('Sales.Customers.Receive_cash.Calculate_currency')}
                </Divider>
              )}
              {showCalCurrency && (
                <CalculatedCurrencyProperties
                  setCurrencyValue={setCalCurrencyValue}
                  currencyValue={calCurrencyValue}
                  form={form}
                  type='recordExpanse'
                  onChangeCurrency={onChangeCalCurrency}
                />
              )}
              <Divider orientation={orientation}>
                {t('Sales.Customers.Receive_cash.Receiver')}
              </Divider>
              {props.type === 'recCash' ? (
                <CashAndBankProperties
                  form={form}
                  fieldId='cashBoxId'
                  fieldName='cashBoxName'
                  onChangBankId={handleChangeCashId}
                  onChangBankName={handleChangeCashName}
                />
              ) : (
                accountFormItem
              )}
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

const styles = {
  formItem: { marginBottom: '0px' },
  calculatedCurrencyFormItem: { marginBottom: '0px', marginTop: '5px' },
};

export default ReceiveCash;
