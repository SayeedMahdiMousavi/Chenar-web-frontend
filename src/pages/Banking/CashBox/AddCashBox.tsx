import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import { Drawer, Form, Col, Row, Input, Space, Modal } from 'antd';
import { useMediaQuery } from '../../MediaQurey';
import { trimString } from '../../../Functions/TrimString';
import { InfiniteScrollSelectFormItem } from '../../../components/antd';
import { CancelButton, PageNewButton, SaveButton } from '../../../components';
import { CASH_M } from '../../../constants/permissions';
import BankCashOpenAccount from '../BankCashOpenAccount';
import { useGetBaseCurrency, useGetCalender } from '../../../Hooks';
import {
  changeGToJ,
  handlePrepareDateForServer,
  utcDate,
} from '../../../Functions/utcDate';
import dayjs from 'dayjs';
import { addMessage, manageErrors } from '../../../Functions';
import {
  OPENING_ACCOUNT_LIST,
  OPENING_ACCOUNT_RESULT_LIST,
} from '../../../constants/routes';

interface IProps {
  type: string;
  baseUrl: string;
}
const dateFormat = 'YYYY-MM-DD HH:mm';
const AddCashBox: React.FC<IProps> = (props) => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const isTablet = useMediaQuery('(max-width:768px)');
  const isMobile = useMediaQuery('(max-width:425px)');

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  //get base currency
  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyId = baseCurrency?.data?.id;
  const baseCurrencyName = baseCurrency?.data?.name;

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
    form.resetFields();
  };

  const addCashBox = async (value: {
    account_name: string | undefined;
    cashier: string;
  }) => await axiosInstance.post(`${props.baseUrl}`, value);

  const {
    mutate: mutateAddCashBox,
    isLoading,
    reset,
  } = useMutation(addCashBox, {
    onSuccess: (values: any, { opening_balance }: any) => {
      setVisible(false);
      addMessage(values?.data?.account_name);
      queryClient.invalidateQueries(props.baseUrl);

      if (Boolean(opening_balance)) {
        queryClient.invalidateQueries(OPENING_ACCOUNT_RESULT_LIST);
        queryClient.invalidateQueries(OPENING_ACCOUNT_LIST);
      }
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const onFinish = () => {
    form.validateFields().then(async (values) => {
      const openBalance = {
        currency: values?.currency?.value,
        currency_rate: values?.currencyRate,
        amount: values?.amount,
        date_time: handlePrepareDateForServer({
          date: values?.date,
          calendarCode,
        }),
      };
      const allData = {
        account_name: trimString(values.name),
        cashier: values?.employee?.map(
          (item: { value: number }) => item?.value,
        ),
        opening_balance:
          Boolean(values?.amount) && values?.amount > 0
            ? [openBalance]
            : undefined,
      };
      mutateAddCashBox(allData);
    });
    if (visible === false) {
      form.resetFields();
      reset();
    }
  };

  const handleAfterClose = (visible: boolean) => {
    if (visible === false) {
      form.resetFields();
      reset();
    }
  };

  return (
    <div>
      {props.type === 'cash' ? (
        <PageNewButton onClick={showDrawer} model={CASH_M} />
      ) : (
        <div onClick={showDrawer}> {t('Banking.Cash_box.New_cash')} </div>
      )}
      <Modal
        maskClosable={false}
        title={t('Banking.Cash_box.Cash_box_information')}
        width={isMobile ? '80%' : isTablet ? 500 : 500}
        onCancel={onClose}
        open={visible}
        destroyOnClose
        // afterVisibleChange={handleAfterClose}
        // placement={i18n.language === "en" ? "right" : "left"}
        footer={
          <div className='textAlign__end'>
            <Space>
              <CancelButton onClick={onClose} />

              <SaveButton onClick={onFinish} loading={isLoading} />
            </Space>
          </div>
        }
      >
        <Form
          layout='vertical'
          hideRequiredMark
          form={form}
          initialValues={{
            date:
              calendarCode === 'gregory'
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
          }}
        >
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item
                name='name'
                label={
                  <span>
                    {t('Form.Name')} <span className='star'>*</span>
                  </span>
                }
                rules={[
                  { required: true, message: `${t('Form.Name_required')}` },
                ]}
              >
                <Input autoFocus={true} autoComplete='off' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <InfiniteScrollSelectFormItem
                name='employee'
                label={
                  <span>
                    {t('Banking.Cash_box.Cashier')}
                    <span className='star'>*</span>
                  </span>
                }
                mode='multiple'
                fields='full_name,id'
                baseUrl='/staff_account/staff/'
                rules={[
                  {
                    required: true,
                    message: `${t('Banking.Cash_box.Cashier_required')}`,
                  },
                ]}
              />
            </Col>
          </Row>
          <BankCashOpenAccount {...{ form, baseCurrencyId }} type='bank' />
        </Form>
      </Modal>
    </div>
  );
};

export default AddCashBox;
