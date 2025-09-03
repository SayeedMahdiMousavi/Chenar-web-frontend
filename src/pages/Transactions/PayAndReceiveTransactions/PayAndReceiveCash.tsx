import React, { useState, useRef } from 'react';
import { Modal, Col, Row, Divider, Form, message, Typography } from 'antd';
import { useMediaQuery } from '../../MediaQurey';
import { GlobalHotKeys } from 'react-hotkeys';
import dayjs from 'dayjs';
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
import { WithdrawProperties } from '../Components/WithdrawProperties';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { TranslateMessage } from '../../SelfComponents/TranslateComponents/TranslateMessage';
import {
  changeGToJ,
  handlePrepareDateForServer,
  utcDate,
} from '../../../Functions/utcDate';
// import {
//   journalResultUrl,
//   journalUrl,
// } from "../../Reports/AllReports/JournalBook/JournalBook";
import useGetCalender from '../../../Hooks/useGetCalender';
import useGetRunningPeriod from '../../../Hooks/useGetRunningPeriod';
// import { accountStatisticsUrl } from "../../Reports/AllReports/AccountsStatistics/AccountsStatistics";
// import { debitCreditUrl } from "../../Reports/AllReports/DebitAndCredit/DebitAndCredit";
// import { cashTransactionsUrl } from "../../Reports/AllReports/AllReports";
import useGetBaseCurrency from '../../../Hooks/useGetBaseCurrency';
import { EmployeeCustomerSupplierChart } from '../Components/EmployeeCustomerSupplierChart';
import {
  PageNewButton,
  ResetButton,
  SaveAndNewButton,
} from '../../../components';
import { manageErrors } from '../../../Functions';
import { JOURNAL_RESULT_LIST } from '../../../constants/routes';
import { fixedNumber, math, print } from '../../../Functions/math';
import { manageNetworkError } from '../../../Functions/manageNetworkError';
// import { useDatabase } from "@nozbe/watermelondb/hooks";
// import withObservables from "@nozbe/with-observables";
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";

const formItemLayout = {
  labelCol: {
    span: 24,
  },
};

interface IProps {
  baseUrl: string;
  place: string;
  type: string;
  title: string;
  model: string;
}
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const PayAndReceiveCash: React.FC<IProps> = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm();
  // const database = useDatabase();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [disabled, setDisabled] = useState(true);
  const [showCalCurrency, setShowCalCurrency] = useState(false);
  const isBgTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currencyValue, setCurrencyValue] = useState(1);
  const [calCurrencyValue, setCalCurrencyValue] = useState(1);

  //get current calender
  const userCalendar = useGetCalender();
  const calendarCode = userCalendar?.data?.user_calender?.code;
  //get base currency
  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyId = baseCurrency?.data?.id;
  const baseCurrencyName = baseCurrency?.data?.name;

  const showModal = () => {
    setIsShowModal({
      visible: true,
    });
  };

  //get running period
  const runningPeriod = useGetRunningPeriod();
  const curStartDate = runningPeriod?.data?.start_date;

  const messageKey = 'transactionAdd';

  const addTransaction = async ({
    value,
  }: {
    value: {
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
    };
    type: string;
  }) => await axiosInstance.post(`${props.baseUrl}`, value);

  const { mutate: mutateAddTransaction } = useMutation(addTransaction, {
    onSuccess: (_, { type }) => {
      if (type !== '0') {
        setIsShowModal({
          visible: false,
        });
        message.success(`${t('Message.Transaction_add_message')}`);
      }
      if (type === '0') {
        setVisible(false);
        form.resetFields();

        setShowCalCurrency(false);
        setCurrencyValue(baseCurrencyId);
        setCalCurrencyValue(baseCurrencyId);
        message.destroy(messageKey);
        message.success({
          content: `${t('Message.Transaction_add_message')}`,

          duration: 3,
        });
      }
      setLoading(false);
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
    onError: (error) => {
      message.destroy(messageKey);
      manageErrors(error);
      setLoading(false);
    },
  });

  const handleOk = (e: any) => {
    const type = e?.key;
    form
      .validateFields()
      .then(async (values) => {
        //
        setLoading(true);
        const dateTime = handlePrepareDateForServer({
          date: values?.date,
          calendarCode,
        });

        if (type === '0') {
          message.loading({
            content: t('Message.Loading'),
            key: messageKey,
          });
        }
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
                    : props.place === 'currencyExchange'
                      ? values?.accountName?.value
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
          //

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
              //
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
                message.destroy(messageKey);
              } else {
                const available = print(
                  //@ts-ignore
                  math.evaluate(
                    `${res?.data?.[0]?.debit ?? 0} - ${
                      res?.data?.[0]?.credit ?? 0
                    }`,
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
                  message.destroy(messageKey);
                } else {
                  //

                  mutateAddTransaction({ value: allData, type });
                }
              }
            })
            .catch((error) => {
              message.destroy(messageKey);
              manageNetworkError(error);
              manageErrors(error);
              setLoading(false);
            });
        } else {
          mutateAddTransaction({ value: allData, type });
        }
        //
      })
      .catch((info) => {});
  };

  const onReset = () => {
    form.resetFields();
    setLoading(false);
    message.destroy(messageKey);
    setShowCalCurrency(false);
    setCurrencyValue(baseCurrencyId);
    setCalCurrencyValue(baseCurrencyId);
  };

  const handleCancel = () => {
    setIsShowModal({
      visible: false,
    });
    form.resetFields();

    message.destroy(messageKey);
    setShowCalCurrency(false);
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

  React.useEffect(() => {
    setCurrencyValue(baseCurrencyId);
    setCalCurrencyValue(baseCurrencyId);
  }, [baseCurrencyId]);

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
      form.setFieldsValue({
        calCurrency: {
          value: baseCurrencyId,
          label: baseCurrencyName,
        },
        calCurrencyRate: 1,
        calAmount: 1,
      });
    }
  };

  return (
    <div>
      <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
        <PageNewButton
          onClick={showModal}
          model={props?.model}
          text={
            props.type === 'payCash' && props.place === 'withdrawPayAndRecCash'
              ? t('Expenses.With_draw.1')
              : props.type === 'payCash' && props.place === 'currencyExchange'
                ? t('Sales.Product_and_services.New')
                : props.type === 'payCash' &&
                    props.place !== 'withdrawPayAndRecCash'
                  ? t('Employees.Pay_cash')
                  : props.type === 'recCash' &&
                      props.place === 'withdrawPayAndRecCash'
                    ? t('Expenses.With_draw.Deposit')
                    : t('Employees.Receive_cash')
          }
        />
        {/* <Button
          type="primary"
          block
          shape="round"
          onClick={showModal}
          className="more-button"
        >
          {props.type === "payCash" && props.place === "withdrawPayAndRecCash"
            ? t("Expenses.With_draw.1")
            : props.type === "payCash" && props.place === "currencyExchange"
            ? t("Sales.Product_and_services.New")
            : props.type === "payCash" &&
              props.place !== "withdrawPayAndRecCash"
            ? t("Employees.Pay_cash")
            : props.type === "recCash" &&
              props.place === "withdrawPayAndRecCash"
            ? t("Expenses.With_draw.Deposit")
            : t("Employees.Receive_cash")}
        </Button> */}
      </GlobalHotKeys>
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={props.title}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled} nodeRef={ref as React.RefObject<HTMLElement>}>
            <div ref={ref}>{modal}</div>
          </Draggable>
        )}
        centered
        destroyOnClose
        afterClose={onReset}
        open={isShowModal.visible}
        onCancel={handleCancel}
        width={isMobile ? '100%' : isTablet ? '70%' : isBgTablet ? 700 : 700}
        style={Styles.modal(isMobile)}
        bodyStyle={Styles.modalBody(isMobile, isSubBase, isMiniTablet)}
        footer={
          <Row justify='space-between' align='middle'>
            <Col>
              <ResetButton onClick={onReset} />
            </Col>
            <Col className='text_align_center'>
              {/* <a href="#">{t("Form.Privacy")}</a> */}
            </Col>

            <Col>
              <SaveAndNewButton
                onSubmit={handleOk}
                loading={loading}
                visible={visible}
                setVisible={setVisible}
              />
            </Col>
          </Row>
        }
      >
        {/* <AddCustomer open={handleOk} /> */}

        <Form
          {...formItemLayout}
          // onFinish={handleOk}
          form={form}
          hideRequiredMark={true}
          scrollToFirstError={true}
          // layout='vertical'
          initialValues={{
            date:
              calendarCode === 'gregory'
                ? utcDate()
                : dayjs(changeGToJ(utcDate().format(dateFormat), dateFormat), {
                    //@ts-ignore
                    jalali: true,
                  }),
            amount: 1,
            currency: {
              value: baseCurrencyId,
              label: baseCurrencyName,
            },
            currencyRate: 1,
            calAmount: 1,
            calCurrency: {
              value: baseCurrencyId,
              label: baseCurrencyName,
            },
            calCurrencyRate: 1,
          }}
        >
          <Row>
            <Col span={24}>
              {/* <Typography.Title level={5}>Payer</Typography.Title> */}
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
                  style={styles.calculatedCurrencyFormItem}
                >
                  <Checkbox onChange={onChangeCalCurrency}>
                    {' '}
                    <Typography.Text strong={true}>
                      {t('Sales.Customers.Receive_cash.Calculate_currency')}
                    </Typography.Text>{' '}
                  </Checkbox>
                </Form.Item>
              )}
              {/* {console.log(showCalCurrency)} */}
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

const styles = {
  calculatedCurrencyFormItem: { marginBottom: '0px', marginTop: '5px' },
};

export default PayAndReceiveCash;
