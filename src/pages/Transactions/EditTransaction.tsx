import React, { useState } from 'react';
import { Modal, Col, Row, Divider, Form, message, Typography } from 'antd';
import { useMediaQuery } from '../MediaQurey';
import { GlobalHotKeys } from 'react-hotkeys';
import moment from 'moment';
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
  handlePrepareDateForDateField,
  handlePrepareDateForServer,
  utcDate,
} from '../../Functions/utcDate';
import useGetCalender from '../../Hooks/useGetCalender';
import useGetRunningPeriod from '../../Hooks/useGetRunningPeriod';
// import {
//   journalResultUrl,
//   journalUrl,
// } from "../Reports/AllReports/JournalBook/JournalBook";
// import { cashTransactionsUrl } from "../Reports/AllReports/AllReports";
// import { accountStatisticsUrl } from "../Reports/AllReports/AccountsStatistics/AccountsStatistics";
// import { debitCreditUrl } from "../Reports/AllReports/DebitAndCredit/DebitAndCredit";
import { ExpenseProperties } from './Components/ExpenseProperties';
import { CancelButton, SaveButton } from '../../components';
import { JOURNAL_RESULT_LIST } from '../../constants/routes';
import { fixedNumber, math, print } from '../../Functions/math';
import { reportsDateFormat } from '../../Context';
import { manageErrors } from '../../Functions';
import { manageNetworkError } from '../../Functions/manageNetworkError';

interface IProps {
  baseUrl: string;
  place: string;
  modalTitle: string;
  record: any;
  setVisible: (value: boolean) => void;
}

const EditTransaction: React.FC<IProps> = ({
  baseUrl,
  place,
  record,
  modalTitle,
  setVisible,
  ...rest
}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [currencyValue, setCurrencyValue] = useState<any>(1);
  const [calCurrencyValue, setCalCurrencyValue] = useState(1);
  const [prevCurrency, setPrevCurrency] = useState<{
    currency: string;
    amount: number;
  }>({ currency: '', amount: 0 });
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [showCalCurrency, setShowCalCurrency] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const isBgTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');

  //get running period
  const runningPeriod = useGetRunningPeriod();
  const curStartDate = runningPeriod?.data?.start_date;

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  const editTransaction = async (value: {
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
      .put(`${baseUrl}${record?.id}/`, value)
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

  const { mutate: mutateEditTransaction } = useMutation(editTransaction, {
    onSuccess: () => {
      // queryClient.invalidateQueries(`${journalUrl}`);
      // queryClient.invalidateQueries(`${journalResultUrl}`);
      // queryClient.invalidateQueries(`${cashTransactionsUrl}`);
      // queryClient.invalidateQueries(`${cashTransactionsUrl}result/`);
      queryClient.invalidateQueries(`${baseUrl}`);
      if (place === 'recordSalaries') {
        // queryClient.invalidateQueries(`${accountStatisticsUrl}`);
        // queryClient.invalidateQueries(`${accountStatisticsUrl}result/`);
        // queryClient.invalidateQueries(`${debitCreditUrl}`);
        // queryClient.invalidateQueries(`${debitCreditUrl}result/`);
      }
    },
  });

  const handleOk = (e: any) => {
    form
      .validateFields()
      .then(async (values) => {
        const dateTime = handlePrepareDateForServer({
          date: values?.date,
          calendarCode,
        });

        setLoading(true);

        const allData = {
          pay_by:
            place === 'moneyTransfer'
              ? values?.payBankName?.value
              : place === 'recordExpense'
                ? values?.cashBoxName?.value
                : place === 'recordSalaries'
                  ? 'OXP-502005'
                  : values?.incomeName?.value,
          rec_by:
            place === 'moneyTransfer'
              ? values?.recBankName?.value
              : place === 'recordSalaries'
                ? values?.employeeName?.value
                : place === 'recordExpense'
                  ? values?.expenseName?.value
                  : values?.cashBoxName?.value,
          date_time: dateTime,
          description: values?.description,
          amount: values?.amount,
          currency: values?.currency?.value,
          currency_rate: values?.currencyRate,
          amount_calc:
            place === 'recordSalaries' && showCalCurrency
              ? parseInt(values?.calAmount)
              : values?.amount,
          currency_calc:
            place === 'recordSalaries' && showCalCurrency
              ? values?.calCurrency?.value
              : values?.currency?.value,
          currency_rate_calc:
            place === 'recordSalaries' && showCalCurrency
              ? values?.calCurrencyRate
              : values?.currencyRate,
        };

        if (place === 'recordExpense' || place === 'moneyTransfer') {
          const startDate = curStartDate
            ? moment(curStartDate, reportsDateFormat).format(reportsDateFormat)
            : '';
          const bankId =
            place === 'moneyTransfer'
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
                place === 'moneyTransfer'
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
                        bank: bankName,
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

  const showModal = () => {
    setVisible(false);
    setIsShowModal({
      visible: true,
    });
    setCalCurrencyValue(record?.currency_calc.id);
    setCurrencyValue(record?.currency.id);
    const date = handlePrepareDateForDateField({
      date: record?.date_time,
      calendarCode,
    });

    if (record?.currency?.name !== record?.currency_calc?.name) {
      setShowCalCurrency(true);
    }

    setPrevCurrency({
      currency: record?.currency?.id,
      amount: parseFloat(record?.amount),
    });

    const currency = {
      currency: {
        value: record?.currency?.id,
        label: record?.currency?.name,
      },
      calCurrency: {
        value: record?.currency_calc?.id,
        label: record?.currency_calc?.name,
      },
      amount: record?.amount,
      calAmount: record?.amount_calc,
      currencyRate: record?.currency_rate,
      calCurrencyRate: record?.currency_rate_calc,
      date: date,
      description: record?.description,
      showCalCurrency:
        record?.currency?.name !== record?.currency_calc?.name ? true : false,
    };

    if (place === 'recordExpense') {
      form.setFieldsValue({
        cashBoxId: record?.pay_by?.id,
        cashBoxName: {
          value: record?.pay_by?.id,
          label: record?.pay_by?.name,
        },
        expenseId: record?.rec_by?.id,
        expenseName: {
          value: record?.rec_by?.id,
          label: record?.rec_by?.name,
        },
        ...currency,
      });
    } else if (place === 'moneyTransfer') {
      form.setFieldsValue({
        payBankId: record?.pay_by?.id,
        payBankName: {
          value: record?.pay_by?.id,
          label: record?.pay_by?.name,
        },
        recBankId: record?.rec_by?.id,
        recBankName: {
          value: record?.rec_by?.id,
          label: record?.rec_by?.name,
        },
        ...currency,
      });
    } else if (place === 'recordSalaries') {
      form.setFieldsValue({
        employeeId: record?.rec_by?.id,
        employeeName: {
          value: record?.rec_by?.id,
          label: record?.rec_by?.name,
        },
        ...currency,
      });
    } else {
      form.setFieldsValue({
        incomeId: record?.pay_by?.id,
        incomeName: {
          value: record?.pay_by?.id,
          label: record?.pay_by?.name,
        },
        cashBoxId: record?.rec_by?.id,
        cashBoxName: {
          value: record?.rec_by?.id,
          label: record?.rec_by?.name,
        },
        ...currency,
      });
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
    //@ts-ignore
    setPrevCurrency({ currency: '', amount: 0 });
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
      //
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
        form.setFieldsValue({ recBankName: value });
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
        <div onClick={showModal}>{t('Sales.Customers.Table.Edit')}</div>
      </GlobalHotKeys>
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={modalTitle}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
        afterClose={handleAfterClose}
        centered
        open={isShowModal.visible}
        onCancel={handleCancel}
        destroyOnClose={true}
        width={isMobile ? '100%' : isTablet ? '70%' : isBgTablet ? '55%' : 700}
        //@ts-ignore
        style={Styles.modal}
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
                {place === 'recordSalaries'
                  ? t('Employees.Employee')
                  : t('Sales.Customers.Receive_cash.Payer')}{' '}
              </Divider>
              {place === 'moneyTransfer' ? (
                <CashAndBankProperties
                  onChangBankName={onChangPayBankName}
                  onChangBankId={onChangPayBankId}
                  form={form}
                  fieldId='payBankId'
                  fieldName='payBankName'
                />
              ) : place === 'recordSalaries' ? (
                <EmployeeProperties form={form} />
              ) : place === 'recordExpense' ? (
                <CashBoxProperties form={form} />
              ) : (
                <IncomeProperties form={form} />
              )}

              <Divider orientation={orientation}>
                {place === 'recordSalaries'
                  ? t('Employees.Salary_details')
                  : t('Sales.Customers.Receive_cash.Receive_details')}{' '}
              </Divider>
              <ReceiveDetailsProperties type='recordExpanse' />
              <Divider orientation={orientation}>
                {t('Sales.Customers.Receive_cash.Paid_currency')}{' '}
              </Divider>
              <CurrencyProperties
                setCurrencyValue={setCurrencyValue}
                form={form}
                type={place}
                currencyValue={currencyValue}
              />
              {place === 'recordSalaries' && (
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
              {place === 'recordSalaries' && showCalCurrency && (
                <Divider orientation={orientation}>
                  {t('Sales.Customers.Receive_cash.Calculate_currency')}{' '}
                </Divider>
              )}
              {place === 'recordSalaries' && showCalCurrency && (
                <CalculatedCurrencyProperties
                  setCurrencyValue={setCalCurrencyValue}
                  currencyValue={calCurrencyValue}
                  form={form}
                  type='recordExpanse'
                />
              )}
              {place !== 'recordSalaries' && (
                <Divider orientation={orientation}>
                  {t('Sales.Customers.Receive_cash.Receiver')}{' '}
                </Divider>
              )}
              {place !== 'recordSalaries' &&
                (place === 'moneyTransfer' ? (
                  <CashAndBankProperties
                    onChangBankName={onChangRecBankName}
                    onChangBankId={onChangRecBankId}
                    form={form}
                    fieldId='recBankId'
                    fieldName='recBankName'
                  />
                ) : place === 'recordExpense' ? (
                  <ExpenseProperties form={form} />
                ) : (
                  <CashBoxProperties form={form} />
                ))}
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default EditTransaction;
