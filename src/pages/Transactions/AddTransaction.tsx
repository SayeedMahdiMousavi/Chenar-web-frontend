import React, { useState } from 'react';
import { Modal, Col, Row, Divider, Form, message, Typography } from 'antd';
import { useMediaQuery } from '../MediaQurey';
import { GlobalHotKeys } from 'react-hotkeys';
import dayjs from 'dayjs';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../ApiBaseUrl';
import { useTranslation } from 'react-i18next';
import { Styles } from '../styles';
import Draggable from 'react-draggable';
import { ModalDragTitle } from '../SelfComponents/ModalDragTitle';
import { CurrencyProperties } from './Components/CurrencyProperties';
import { ReceiveDetailsProperties } from './Components/ReceiveDetailsProperties';
import { CalculatedCurrencyProperties } from './Components/CalculatedCurrencyProperties';
import { CashBoxProperties } from './Components/CashBoxProperries';
import { IncomeProperties } from './Components/IncomeProperties';
import { EmployeeProperties } from './Components/EmployeeProperties';
import CashAndBankProperties from './Components/CashAndBankProperties';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { TranslateMessage } from '../SelfComponents/TranslateComponents/TranslateMessage';
import {
  changeGToJ,
  handlePrepareDateForServer,
  utcDate,
} from '../../Functions/utcDate';
import moment from 'moment';
import useGetCalender from '../../Hooks/useGetCalender';
import useGetRunningPeriod from '../../Hooks/useGetRunningPeriod';
// import {
//   journalResultUrl,
//   journalUrl,
// } from "../Reports/AllReports/JournalBook/JournalBook";
// import { cashTransactionsUrl } from "../Reports/AllReports/AllReports";
// import { accountStatisticsUrl } from "../Reports/AllReports/AccountsStatistics/AccountsStatistics";
// import { debitCreditUrl } from "../Reports/AllReports/DebitAndCredit/DebitAndCredit";
import useGetBaseCurrency from '../../Hooks/useGetBaseCurrency';
import { ExpenseProperties } from './Components/ExpenseProperties';
import { PageNewButton, ResetButton, SaveAndNewButton } from '../../components';
import { manageErrors } from '../../Functions';
import { JOURNAL_RESULT_LIST } from '../../constants/routes';
import { fixedNumber, math, print } from '../../Functions/math';
import { reportsDateFormat } from '../../Context';
import { manageNetworkError } from '../../Functions/manageNetworkError';

interface IProps {
  baseUrl: string;
  place: string;
  modalTitle: string;
  model: string;
}
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const AddTransaction: React.FC<IProps> = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [currencyValue, setCurrencyValue] = useState(1);
  const [calCurrencyValue, setCalCurrencyValue] = useState(1);
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

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  const showModal = () => {
    setIsShowModal({
      visible: true,
    });
  };

  //get running period
  const runningPeriod = useGetRunningPeriod();
  const curStartDate = runningPeriod?.data?.start_date;

  //get base currency
  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyId = baseCurrency?.data?.id;
  const baseCurrencyName = baseCurrency?.data?.name;

  const messageKey = 'transactionAdd';
  const addTransaction = async ({
    value,
    type,
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

  const { mutate: mutateAddTransaction, reset } = useMutation(addTransaction, {
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
        // setCurrencyValue(1);
        // setCalCurrencyValue(1);
        message.destroy(messageKey);
        message.success({
          content: `${t('Message.Transaction_add_message')}`,
          duration: 3,
        });
      }
      setLoading(false);
      // queryClient.invalidateQueries(`${journalUrl}`);
      // queryClient.invalidateQueries(`${journalResultUrl}`);
      // queryClient.invalidateQueries(`${cashTransactionsUrl}`);
      // queryClient.invalidateQueries(`${cashTransactionsUrl}result/`);
      queryClient.invalidateQueries(`${props.baseUrl}`);
      if (props.place === 'recordSalaries') {
        // queryClient.invalidateQueries(`${accountStatisticsUrl}`);
        // queryClient.invalidateQueries(`${accountStatisticsUrl}result/`);
        // queryClient.invalidateQueries(`${debitCreditUrl}`);
        // queryClient.invalidateQueries(`${debitCreditUrl}result/`);
      }
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
        setLoading(true);
        if (type === '0') {
          message.loading({
            content: t('Message.Loading'),
            key: messageKey,
          });
        }
        const dateTime = handlePrepareDateForServer({
          date: values?.date,
          calendarCode,
        });

        const allData = {
          pay_by:
            props.place === 'moneyTransfer'
              ? values.payBankName?.value
              : props.place === 'recordExpense'
                ? values.cashBoxName?.value
                : props.place === 'recordSalaries'
                  ? 'OXP-502005'
                  : values.incomeName?.value,
          rec_by:
            props.place === 'moneyTransfer'
              ? values.recBankName?.value
              : props.place === 'recordSalaries'
                ? values.employeeName?.value
                : props.place === 'recordExpense'
                  ? values.expenseName?.value
                  : values.cashBoxName?.value,
          date_time: dateTime,
          description: values.description,
          amount: values.amount,
          currency: values.currency?.value,
          currency_rate: values.currencyRate,
          amount_calc:
            props.place === 'recordSalaries' && showCalCurrency
              ? parseInt(values.calAmount)
              : values.amount,
          currency_calc:
            props.place === 'recordSalaries' && showCalCurrency
              ? values.calCurrency.value
              : values.currency?.value,
          currency_rate_calc:
            props.place === 'recordSalaries' && showCalCurrency
              ? values.calCurrencyRate
              : values.currencyRate,
        };

        if (
          props.place === 'recordExpense' ||
          props.place === 'moneyTransfer'
        ) {
          const startDate = curStartDate
            ? moment(curStartDate, reportsDateFormat).format(reportsDateFormat)
            : '';

          const bankId =
            props.place === 'moneyTransfer'
              ? values.payBankName?.value
              : values.cashBoxName?.value;

          await axiosInstance
            .get(
              `${JOURNAL_RESULT_LIST}?account=${bankId}&date_time_after=${startDate}&date_time_before=${utcDate().format(
                reportsDateFormat,
              )}&currency=${values?.currency?.value}`,
            )
            .then((res) => {
              const bankName =
                props.place === 'moneyTransfer'
                  ? values.payBankName?.label
                  : values.cashBoxName?.label;
              if (res?.data?.length === 0) {
                message.error(
                  <TranslateMessage
                    values={{
                      bank: bankName,
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
                        bank: bankName,
                        currency: values?.currency?.label,
                      }}
                      message='Sales.Customers.Receive_cash.Pay_cash_enough_money_error_message'
                    />,
                  );
                  setLoading(false);
                  message.destroy(messageKey);
                } else {
                  mutateAddTransaction({ value: allData, type });
                }
              }
            })
            .catch((error) => {
              setLoading(false);
              message.destroy(messageKey);
              manageErrors(error);
              manageNetworkError(error);
            });
        } else {
          mutateAddTransaction({ value: allData, type });
        }
      })
      .catch((info) => {
        //

        message.destroy(messageKey);
      });
  };

  const onReset = () => {
    form.resetFields();
    reset();
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

  const onChangPayBankId = React.useCallback(
    (value: { value: string; label: string }) => {
      const row = form.getFieldsValue();
      if (row.recBankId === value.value) {
        Modal.warning({
          bodyStyle: {
            direction: t('Dir') as
              | 'ltr'
              | 'rtl'
              | 'inherit'
              | 'initial'
              | 'unset',
          },
          title: t('Banking.Same_bank_error_message'),
          onOk: () => {
            form.setFieldsValue({
              payBankName: undefined,
              payBankId: undefined,
            });
          },
        });
      } else {
        form.setFieldsValue({ payBankName: value });
      }
    },
    [form, t],
  );

  const onChangPayBankName = React.useCallback(
    (value: string) => {
      const row = form.getFieldsValue();

      if (row?.recBankName?.value === value) {
        Modal.warning({
          bodyStyle: {
            direction: t('Dir') as
              | 'ltr'
              | 'rtl'
              | 'inherit'
              | 'initial'
              | 'unset',
          },
          title: t('Banking.Same_bank_error_message'),
          onOk: () => {
            form.setFieldsValue({
              payBankName: undefined,
              payBankId: undefined,
            });
          },
        });
      } else {
        form.setFieldsValue({ payBankId: value });
      }
    },
    [form, t],
  );

  const onChangRecBankId = React.useCallback(
    (value: { value: string; label: string }) => {
      const row = form.getFieldsValue();

      if (row.payBankId === value.value) {
        Modal.warning({
          bodyStyle: {
            direction: t('Dir') as
              | 'ltr'
              | 'rtl'
              | 'inherit'
              | 'initial'
              | 'unset',
          },
          title: t('Banking.Same_bank_error_message'),
          onOk: () => {
            form.setFieldsValue({
              recBankName: undefined,
              recBankId: undefined,
            });
          },
        });
      } else {
        form.setFieldsValue({ recBankName: value });
      }
    },
    [form, t],
  );

  const onChangRecBankName = React.useCallback(
    (value: string) => {
      const row = form.getFieldsValue();

      if (row?.payBankName?.value === value) {
        Modal.warning({
          bodyStyle: {
            direction: t('Dir') as
              | 'ltr'
              | 'rtl'
              | 'inherit'
              | 'initial'
              | 'unset',
          },
          title: t('Banking.Same_bank_error_message'),
          onOk: () => {
            form.setFieldsValue({
              recBankName: undefined,
              recBankId: undefined,
            });
          },
        });
      } else {
        form.setFieldsValue({ recBankId: value });
      }
    },
    [form, t],
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
        <PageNewButton onClick={showModal} model={props?.model} />
      </GlobalHotKeys>

      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={props.modalTitle}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
        centered
        open={isShowModal.visible}
        onCancel={handleCancel}
        destroyOnClose={true}
        afterClose={onReset}
        width={isMobile ? '100%' : isTablet ? '70%' : isBgTablet ? 700 : 700}
        //@ts-ignore
        style={Styles.modal}
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
        <Form
          form={form}
          hideRequiredMark={true}
          scrollToFirstError={true}
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
          <Divider orientation={orientation}>
            {props.place === 'recordSalaries'
              ? t('Employees.Employee')
              : t('Sales.Customers.Receive_cash.Payer')}{' '}
          </Divider>

          {props.place === 'moneyTransfer' ? (
            <CashAndBankProperties
              onChangBankName={onChangPayBankName}
              onChangBankId={onChangPayBankId}
              form={form}
              fieldId='payBankId'
              fieldName='payBankName'
            />
          ) : props.place === 'recordSalaries' ? (
            <EmployeeProperties form={form} />
          ) : props.place === 'recordExpense' ? (
            <CashBoxProperties form={form} />
          ) : (
            <IncomeProperties form={form} />
          )}

          <Divider orientation={orientation}>
            {props.place === 'recordSalaries'
              ? t('Employees.Salary_details')
              : t('Sales.Customers.Receive_cash.Receive_details')}{' '}
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
          {props.place === 'recordSalaries' && (
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
          {props.place === 'recordSalaries' && showCalCurrency && (
            <Divider orientation={orientation}>
              {t('Sales.Customers.Receive_cash.Calculate_currency')}{' '}
            </Divider>
          )}
          {props.place === 'recordSalaries' && showCalCurrency && (
            <CalculatedCurrencyProperties
              setCurrencyValue={setCalCurrencyValue}
              currencyValue={calCurrencyValue}
              form={form}
              type='recordExpanse'
            />
          )}
          {props.place !== 'recordSalaries' && (
            <Divider orientation={orientation}>
              {t('Sales.Customers.Receive_cash.Receiver')}{' '}
            </Divider>
          )}

          {props.place !== 'recordSalaries' &&
            (props.place === 'moneyTransfer' ? (
              <CashAndBankProperties
                onChangBankName={onChangRecBankName}
                onChangBankId={onChangRecBankId}
                form={form}
                fieldId='recBankId'
                fieldName='recBankName'
              />
            ) : props.place === 'recordExpense' ? (
              <ExpenseProperties form={form} />
            ) : (
              <CashBoxProperties form={form} />
            ))}
        </Form>
      </Modal>
    </div>
  );
};

export default AddTransaction;
