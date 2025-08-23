import React, { useState } from 'react';
import { Modal, Col, Row, Divider, Form, message, Typography } from 'antd';
import { useMediaQuery } from '../../MediaQurey';
import { GlobalHotKeys } from 'react-hotkeys';
import moment from 'moment';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import { useTranslation } from 'react-i18next';
import { Styles } from '../../styles';
import Draggable from 'react-draggable';
import { ModalDragTitle } from '../../SelfComponents/ModalDragTitle';
import { CurrencyProperties } from '../Components/CurrencyProperties';
import { ReceiveDetailsProperties } from '../Components/ReceiveDetailsProperties';
import { CalculatedCurrencyProperties } from '../Components/CalculatedCurrencyProperties';
import { CashBoxProperties } from '../Components/CashBoxProperries';
import { SupplierProperties } from '../Components/SupplierProperties';
import { EmployeeProperties } from '../Components/EmployeeProperties';
import CashAndBankProperties from '../Components/CashAndBankProperties';
import { CustomerProperties } from '../Components/CustomerProperties';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { TranslateMessage } from '../../SelfComponents/TranslateComponents/TranslateMessage';
import {
  handlePrepareDateForDateField,
  handlePrepareDateForServer,
  utcDate,
} from '../../../Functions/utcDate';
import useGetCalender from '../../../Hooks/useGetCalender';
import useGetRunningPeriod from '../../../Hooks/useGetRunningPeriod';
import { WithdrawProperties } from '../Components/WithdrawProperties';
// import {
//   journalResultUrl,
//   journalUrl,
// } from "../../Reports/AllReports/JournalBook/JournalBook";
// import { accountStatisticsUrl } from "../../Reports/AllReports/AccountsStatistics/AccountsStatistics";
// import { debitCreditUrl } from "../../Reports/AllReports/DebitAndCredit/DebitAndCredit";
// import { cashTransactionsUrl } from "../../Reports/AllReports/AllReports";
import { EmployeeCustomerSupplierChart } from '../Components/EmployeeCustomerSupplierChart';
import { manageNetworkError } from '../../../Functions/manageNetworkError';
import { CancelButton, SaveButton } from '../../../components';
import { JOURNAL_RESULT_LIST } from '../../../constants/routes';
import { fixedNumber, math, print } from '../../../Functions/math';
import { manageErrors } from '../../../Functions';

interface IProps {
  baseUrl: string;
  place: string;
  type: string;
  record: any;
  setVisible: (value: boolean) => void;
}
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const EditPayAndReceiveCash: React.FC<IProps> = (props) => {
  const queryClient = useQueryClient();
  const [currencyValue, setCurrencyValue] = useState<any>(1);
  const [calCurrencyValue, setCalCurrencyValue] = useState(1);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [showCalCurrency, setShowCalCurrency] = useState(false);
  const isBgTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');

  const [prevCurrency, setPrevCurrency] = useState<{
    currency: string;
    amount: number;
  }>({ currency: '', amount: 0 });

  //get running period
  const runningPeriod = useGetRunningPeriod();
  const curStartDate = runningPeriod?.data?.start_date;

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  const addTransaction = async (value: {
    pay_by: string;
    rec_by: string;
    date_time: string;
    description: string;
    amount: number;
    currency: number;
    currency_rate: number;
    amount_calc: number;
    currency_calc: number;
    currency_rate_calc: number;
  }) => {
    await axiosInstance
      .put(`${props.baseUrl}${props?.record?.id}/`, value)
      .then((res) => {
        setIsShowModal({
          visible: false,
        });
        message.success(`${t('Message.Transaction_add_message')}`);
      })
      .catch((error) => {
        setLoading(false);
        message.destroy();
        manageErrors(error);
      });
  };

  const { mutate: mutateEditTransaction } = useMutation(addTransaction, {
    onSuccess: () => {
      // queryClient.invalidateQueries(`${journalUrl}`);
      // queryClient.invalidateQueries(`${journalResultUrl}`);
      // queryClient.invalidateQueries(`${accountStatisticsUrl}`);
      // queryClient.invalidateQueries(`${accountStatisticsUrl}result/`);
      // queryClient.invalidateQueries(`${debitCreditUrl}`);
      // queryClient.invalidateQueries(`${debitCreditUrl}result/`);
      // queryClient.invalidateQueries(`${cashTransactionsUrl}`);
      // queryClient.invalidateQueries(`${cashTransactionsUrl}result/`);
      queryClient.invalidateQueries(`${props.baseUrl}`);
    },
  });

  const handleOk = (e: any) => {
    form
      .validateFields()
      .then(async (values) => {
        console.log('values', values);
        const dateTime = handlePrepareDateForServer({
          date: values?.date,
          calendarCode,
        });

        const currencyExchangeFields = {
          amount_exchange: values?.calAmount
            ? parseInt(values?.calAmount)
            : values?.amount,
          currency_exchange: values?.calCurrency?.value
            ? values?.calCurrency?.value
            : values?.currency?.value,
          currency_rate_exchange: values?.calCurrencyRate
            ? values?.calCurrencyRate
            : values?.currencyRate,
        };

        setLoading(true);
        const allData = {
          pay_by:
            props.type === 'payCash'
              ? values?.cashBoxName?.value
              : props.place === 'employeePayAndRecCash'
                ? values?.employeeName?.value
                : props.place === 'customerPayAndRecCash'
                  ? values?.customerName?.value
                  : props.place === 'withdrawPayAndRecCash'
                    ? values?.withdrawName?.value
                    : values?.supplierName?.value,
          rec_by:
            props.type === 'recCash'
              ? values?.recBankName?.value
              : props.place === 'employeePayAndRecCash'
                ? values?.employeeName?.value
                : props.place === 'customerPayAndRecCash'
                  ? values?.customerName?.value
                  : props.place === 'withdrawPayAndRecCash'
                    ? values?.withdrawName?.value
                    : values?.supplierName?.value,
          date_time: dateTime,
          description: values?.description,
          amount: values?.amount,
          currency: values?.currency?.value,
          currency_rate: values?.currencyRate,
          amount_calc: showCalCurrency
            ? parseInt(values?.calAmount)
            : values?.amount,
          currency_calc: showCalCurrency
            ? values?.calCurrency?.value
            : values?.currency?.value,
          currency_rate_calc: showCalCurrency
            ? values?.calCurrencyRate
            : values?.currencyRate,
          ...currencyExchangeFields,
        };
        if (props.place === 'recordSalaries') {
          delete allData['pay_by'];
        }
        if (props.type === 'payCash') {
          const startDate = curStartDate
            ? moment(curStartDate, dateFormat).format(dateFormat)
            : '';
          await axiosInstance
            .get(
              `${JOURNAL_RESULT_LIST}?account=${
                values?.cashBoxName?.value
              }&date_time_after=${startDate}&date_time_before=${utcDate().format(
                dateFormat,
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
                const available =
                  values?.currency?.value !== prevCurrency?.currency
                    ? print(
                        //@ts-ignore
                        math.evaluate(
                          `${res?.data?.[0]?.debit ?? 0} - ${
                            res?.data?.[0]?.credit ?? 0
                          }`,
                        ),
                      )
                    : print(
                        //@ts-ignore
                        math.evaluate(
                          `(${res?.data?.[0]?.debit ?? 0} + ${
                            prevCurrency?.amount ?? 0
                          }) - ${res?.data?.[0]?.credit ?? 0}`,
                        ),
                      );

                if (fixedNumber(available, 10) < parseFloat(values?.amount)) {
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
                  mutateEditTransaction(allData);
                }
              }
            })
            .catch((error) => {
              setLoading(false);
              manageErrors(error);
              manageNetworkError(error);
            });
        } else {
          mutateEditTransaction(allData);
        }
      })
      .catch((info) => {});
  };

  console.log('props?.place', props?.place);
  const showModal = () => {
    const record = props?.record;
    props.setVisible(false);
    if (record?.currency?.id !== record?.currency_calc?.id) {
      setShowCalCurrency(true);
    }
    setIsShowModal({
      visible: true,
    });
    setPrevCurrency({
      currency: record?.currency?.id,
      amount: parseFloat(record?.amount),
    });
    setCalCurrencyValue(
      props?.place === 'currencyExchange'
        ? record?.currency_exchange?.id
        : record?.currency_calc.id,
    );
    setCurrencyValue(record?.currency.id);
    const date = handlePrepareDateForDateField({
      date: record?.date_time,
      calendarCode,
    });

    console.log('record', record);
    const currency = {
      currency: {
        value: record?.currency?.id,
        label: record?.currency?.name,
      },
      calCurrency:
        props?.place === 'currencyExchange'
          ? {
              value: record?.currency_exchange?.id,
              label: record?.currency_exchange?.name,
            }
          : {
              value: record?.currency_calc?.id,
              label: record?.currency_calc?.name,
            },
      amount: record?.amount,
      calAmount:
        props?.place === 'currencyExchange'
          ? record?.amount_exchange
          : record?.amount_calc,
      currencyRate: record?.currency_rate,
      calCurrencyRate:
        props?.place === 'currencyExchange'
          ? record?.currency_rate_exchange
          : record?.currency_rate_calc,
      date: date,
      description: record?.description,
      showCalCurrency:
        record?.currency?.name !== record?.currency_calc?.name ? true : false,
    };
    const cashBox = {
      cashBoxId: record?.pay_by?.id,
      cashBoxName: {
        value: record?.pay_by?.id,
        label: record?.pay_by?.name,
      },
    };
    const bankId = {
      recBankId: record?.rec_by?.id,
      recBankName: {
        value: record?.rec_by?.id,
        label: record?.rec_by?.name,
      },
    };

    if (props.type === 'payCash') {
      if (props.place === 'employeePayAndRecCash') {
        form.setFieldsValue({
          ...cashBox,
          employeeId: record?.rec_by?.id,
          employeeName: {
            value: record?.rec_by?.id,
            label: record?.rec_by?.name,
          },
          ...currency,
        });
      } else if (props.place === 'customerPayAndRecCash') {
        form.setFieldsValue({
          ...cashBox,
          customerId: record?.rec_by?.id,
          customerName: {
            value: record?.rec_by?.id,
            label: record?.rec_by?.name,
          },
          ...currency,
        });
      } else if (props.place === 'withdrawPayAndRecCash') {
        form.setFieldsValue({
          ...cashBox,
          withdrawId: record?.rec_by?.id,
          withdrawName: {
            value: record?.rec_by?.id,
            label: record?.rec_by?.name,
          },
          ...currency,
        });
      } else if (props.place === 'currencyExchange') {
        form.setFieldsValue({
          ...cashBox,
          accountId: record?.rec_by?.id,
          accountName: {
            value: record?.rec_by?.id,
            label: record?.rec_by?.name,
          },
          ...currency,
        });
      } else {
        form.setFieldsValue({
          ...cashBox,
          supplierId: record?.rec_by?.id,
          supplierName: {
            value: record?.rec_by?.id,
            label: record?.rec_by?.name,
          },
          ...currency,
        });
      }
    } else {
      if (props.place === 'employeePayAndRecCash') {
        form.setFieldsValue({
          employeeId: record?.pay_by?.id,
          employeeName: {
            value: record?.pay_by?.id,
            label: record?.pay_by?.name,
          },
          ...bankId,
          ...currency,
        });
      } else if (props.place === 'customerPayAndRecCash') {
        form.setFieldsValue({
          customerId: record?.pay_by?.id,
          customerName: {
            value: record?.pay_by?.id,
            label: record?.pay_by?.name,
          },
          ...bankId,
          ...currency,
        });
      } else if (props.place === 'withdrawPayAndRecCash') {
        form.setFieldsValue({
          withdrawId: record?.pay_by?.id,
          withdrawName: {
            value: record?.pay_by?.id,
            label: record?.pay_by?.name,
          },
          ...bankId,
          ...currency,
        });
      } else {
        form.setFieldsValue({
          supplierId: record?.pay_by?.id,
          supplierName: {
            value: record?.pay_by?.id,
            label: record?.pay_by?.name,
          },
          ...bankId,
          ...currency,
        });
      }
    }
  };

  const handleCancel = () => {
    setIsShowModal({
      visible: false,
    });
    form.resetFields();
    setLoading(false);
    setShowCalCurrency(false);
    // setCurrencyValue(1);
    // setCalCurrencyValue(1);
  };

  const handleAfterClose = () => {
    form.resetFields();
    setLoading(false);
    setShowCalCurrency(false);
    // setCurrencyValue(1);
    // setCalCurrencyValue(1);
    setPrevCurrency({
      currency: '',
      amount: 0,
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

  const orientation = t('Dir') === 'ltr' ? 'left' : 'right';

  const onChangRecBankId = React.useCallback(
    (value: { value: string; label: string }) => {
      form.setFieldsValue({ recBankName: value });
    },
    [form],
  );

  const onChangRecBankName = React.useCallback(
    (value: string) => {
      form.setFieldsValue({ recBankId: value });
    },
    [form],
  );

  const onChangeCalCurrency = (e: any) => {
    const row = form.getFieldsValue();
    setShowCalCurrency(e.target.checked);
    if (e.target.checked === true) {
      form.setFieldsValue({
        calAmount: row.amount * row.currencyRate,
      });
    } else {
      // form.setFieldsValue({
      //   calCurrency: {
      //     value: defaultCurrent?.data?.id,
      //     label: defaultCurrent?.data?.name,
      //   },
      //   calCurrencyRate: 1,
      //   calAmount: 1,
      // });
    }
  };

  return (
    <div>
      <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
        <div onClick={showModal}>
          {props.type === 'payCash' && props.place === 'withdrawPayAndRecCash'
            ? t('Expenses.With_draw.Edit_withdraw')
            : props.type === 'payCash' && props.place === 'currencyExchange'
              ? t('Sales.Customers.Table.Edit')
              : props.type === 'payCash' &&
                  props.place !== 'withdrawPayAndRecCash'
                ? t('Employees.Edit_pay_cash')
                : props.type === 'recCash' &&
                    props.place === 'withdrawPayAndRecCash'
                  ? t('Expenses.With_draw.Edit_deposit')
                  : t('Employees.Edit_receive_cash')}
        </div>
      </GlobalHotKeys>
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={
              props.type === 'payCash' &&
              props.place === 'withdrawPayAndRecCash'
                ? t('Expenses.With_draw.Withdraw_information')
                : props.type === 'payCash' && props.place === 'currencyExchange'
                  ? t('Reports.Currency_exchange_information')
                  : props.type === 'payCash' &&
                      props.place !== 'withdrawPayAndRecCash'
                    ? t('Employees.Pay_cash_information')
                    : props.type === 'recCash' &&
                        props.place === 'withdrawPayAndRecCash'
                      ? t('Expenses.With_draw.Deposit_information')
                      : t('Employees.Receive_cash_information')
            }
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
        centered
        open={isShowModal.visible}
        onCancel={handleCancel}
        destroyOnClose
        afterClose={handleAfterClose}
        width={isMobile ? '100%' : isTablet ? '70%' : isBgTablet ? '55%' : 700}
        style={Styles.modal(isMobile)}
        bodyStyle={Styles.modalBody(isMobile, isSubBase, isMiniTablet)}
        footer={
          <Row justify='end'>
            <Col>
              <CancelButton onClick={handleCancel} />
              <SaveButton onClick={handleOk} loading={loading} />
            </Col>
          </Row>
        }
      >
        <Form form={form} hideRequiredMark={true} scrollToFirstError={true}>
          <Row>
            <Col span={24}>
              <Divider orientation={orientation}>
                {t('Sales.Customers.Receive_cash.Payer')}{' '}
              </Divider>
              {props.type === 'payCash' ? (
                <CashBoxProperties form={form} />
              ) : props.place === 'employeePayAndRecCash' ? (
                <EmployeeProperties form={form} />
              ) : props.place === 'customerPayAndRecCash' ? (
                <CustomerProperties form={form} />
              ) : props.place === 'withdrawPayAndRecCash' ? (
                <WithdrawProperties form={form} />
              ) : (
                <SupplierProperties form={form} />
              )}

              <Divider orientation={orientation}>
                {t('Sales.Customers.Receive_cash.Receive_details')}{' '}
              </Divider>
              <ReceiveDetailsProperties type='recordExpanse' />
              <Divider orientation={orientation}>
                {t('Sales.Customers.Receive_cash.Paid_currency')}{' '}
              </Divider>
              <CurrencyProperties
                setCurrencyValue={setCurrencyValue}
                currencyValue={currencyValue}
                form={form}
                type={props.place}
              />
              {props.place !== 'currencyExchange' && (
                <Form.Item
                  name='showCalCurrency'
                  valuePropName='checked'
                  style={{ marginBottom: '0px', marginTop: '5px' }}
                >
                  <Checkbox onChange={onChangeCalCurrency}>
                    {' '}
                    <Typography.Text strong={true}>
                      {t('Sales.Customers.Receive_cash.Calculate_currency')}
                    </Typography.Text>{' '}
                  </Checkbox>
                </Form.Item>
              )}
              {props.place === 'currencyExchange' ? (
                <Divider orientation={orientation}>
                  {t('Sales.Customers.Receive_cash.Receive_currency')}
                </Divider>
              ) : (
                showCalCurrency && (
                  <Divider orientation={orientation}>
                    {t('Sales.Customers.Receive_cash.Calculate_currency')}
                  </Divider>
                )
              )}
              {props.place === 'currencyExchange' ? (
                <CalculatedCurrencyProperties
                  setCurrencyValue={setCalCurrencyValue}
                  currencyValue={calCurrencyValue}
                  form={form}
                  type='recordExpanse'
                />
              ) : (
                showCalCurrency && (
                  <CalculatedCurrencyProperties
                    setCurrencyValue={setCalCurrencyValue}
                    currencyValue={calCurrencyValue}
                    form={form}
                    type='recordExpanse'
                  />
                )
              )}
              <Divider orientation={orientation}>
                {t('Sales.Customers.Receive_cash.Receiver')}{' '}
              </Divider>
              {props.type === 'recCash' ? (
                <CashAndBankProperties
                  onChangBankName={onChangRecBankName}
                  onChangBankId={onChangRecBankId}
                  form={form}
                  fieldId='recBankId'
                  fieldName='recBankName'
                />
              ) : props.place === 'employeePayAndRecCash' ? (
                <EmployeeProperties form={form} />
              ) : props.place === 'customerPayAndRecCash' ? (
                <CustomerProperties form={form} />
              ) : props.place === 'withdrawPayAndRecCash' ? (
                <WithdrawProperties form={form} />
              ) : props.place === 'currencyExchange' ? (
                <EmployeeCustomerSupplierChart form={form} />
              ) : (
                <SupplierProperties form={form} />
              )}
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default EditPayAndReceiveCash;
