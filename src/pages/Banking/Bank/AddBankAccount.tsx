import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Button,
  message,
  Tooltip,
  Space,
} from 'antd';
import { useMediaQuery } from '../../MediaQurey';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { ModalDragTitle } from '../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { Styles } from '../../styles';
import { trimString } from '../../../Functions/TrimString';
import { PageNewButton, ResetButton, SaveButton } from '../../../components';
import { BANK_M } from '../../../constants/permissions';
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
const AddBankAccount: React.FC<IProps> = (props) => {
  const queryClient = useQueryClient();

  const { t } = useTranslation();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState<boolean>(true);
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isBigMobile = useMediaQuery('(max-width: 480px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  //get base currency
  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyId = baseCurrency?.data?.id;
  const baseCurrencyName = baseCurrency?.data?.name;

  const addBankAccount = async (value: {
    account_name: string | undefined;
    branch: string | undefined;
    account_number: string | undefined;
    mobile: { mobile_list: { name: string; number: string }[] };
    fax: string;
    manager_name: string;
    address: string;
    description: string;
  }) => await axiosInstance.post(`${props.baseUrl}`, value);

  const {
    mutate: mutateAddBankAccount,
    isLoading,
    reset,
  } = useMutation(addBankAccount, {
    onSuccess: (values, { opening_balance }: any) => {
      setIsShowModal({
        visible: false,
      });
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
        account_name: trimString(values?.name),
        branch: values?.branch ? trimString(values?.branch) : '',
        account_number: values.accountNumber
          ? trimString(values.accountNumber)
          : '',
        mobile: { mobile_list: values.mobiles },
        fax: values.fax,
        manager_name: values.managerName,
        address: values.address,
        description: values.description,
        opening_balance:
          Boolean(values?.amount) && values?.amount > 0
            ? [openBalance]
            : undefined,
      };
      mutateAddBankAccount(allData, {
        onSuccess: () => {},
      });
    });
  };

  const showModal = () => {
    setIsShowModal({
      visible: true,
    });
  };

  const handleCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };

  const handleAfterClose = () => {
    reset();
    form.resetFields();
  };

  return (
    <div>
      {props.type === 'bank' ? (
        <PageNewButton onClick={showModal} model={BANK_M} />
      ) : (
        <div onClick={showModal}>{t('Banking.New_bank')}</div>
      )}

      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Banking.Account_information')}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
        style={Styles.modal(isMobile)}
        bodyStyle={Styles.modalBody(isMobile, isSubBase, isMiniTablet)}
        open={isShowModal.visible}
        destroyOnClose
        afterClose={handleAfterClose}
        centered
        width={600}
        onCancel={handleCancel}
        footer={
          <Row justify='end' align='middle'>
            <Col>
              <ResetButton onClick={handleAfterClose} />
              <SaveButton onClick={onFinish} loading={isLoading} />
            </Col>
          </Row>
        }
      >
        <Form
          form={form}
          hideRequiredMark={true}
          scrollToFirstError={true}
          layout='vertical'
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
          <Row gutter={20}>
            <Col span={isBigMobile ? 24 : 12}>
              <Form.Item
                label={
                  <span>
                    {t('Banking.Form.Account_name')}
                    <span className='star'>*</span>
                  </span>
                }
                name='name'
                className='margin'
                rules={[
                  {
                    required: true,
                    message: `${t('Banking.Form.Account_name_required')}`,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={<span>{t('Banking.Form.Branch')}</span>}
                name='branch'
                className='margin'
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={<span>{t('Banking.Form.Account_number')}</span>}
                name='accountNumber'
                className='margin'
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={<span>{t('Banking.Form.Manager_name')}</span>}
                name='managerName'
                className='margin'
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={t('Form.Address')}
                name='address'
                className='margin'
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={isBigMobile ? 24 : 12}>
              <Row>
                <Col xs={24} style={{ paddingTop: '30px' }}>
                  <Form.List name='mobiles'>
                    {(fields, { add, remove }, { errors }) => (
                      <>
                        {fields?.map((field) => (
                          <Space
                            key={field.key}
                            style={{ display: 'flex', marginBottom: 18 }}
                            align='baseline'
                            className='editable-row'
                          >
                            <Form.Item
                              {...field}
                              validateTrigger={['onChange', 'onBlur']}
                              name={[field.name, 'name']}
                              rules={[
                                {
                                  required: true,
                                  whitespace: true,
                                  message: `${t(
                                    'Banking.Form.Person_required',
                                  )}`,
                                },
                              ]}
                              className='margin1'
                            >
                              <Input placeholder={t('Banking.Form.Person')} />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              validateTrigger={['onChange', 'onBlur']}
                              name={[field.name, 'number']}
                              className='margin1'
                              rules={[
                                {
                                  required: true,
                                  whitespace: true,
                                  message: `${t(
                                    'Banking.Form.Number_required',
                                  )}`,
                                },
                              ]}
                            >
                              <Input placeholder={t('Banking.Form.Number')} />
                            </Form.Item>

                            <MinusCircleOutlined
                              onClick={() => remove(field.name)}
                            />
                          </Space>
                        ))}{' '}
                        {fields?.length < 3 ? (
                          <Form.Item className='margin1'>
                            <Button
                              type='dashed'
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                              className='margin'
                            >
                              {t('Company.Add_mobile')}
                            </Button>
                          </Form.Item>
                        ) : null}
                      </>
                    )}
                  </Form.List>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    name='fax'
                    label={
                      <span>
                        {t('Form.Fax')}
                        &nbsp;
                        <Tooltip
                          title={`${t(
                            'Form.Fax_sample',
                          )} 93799773529@efaxsend.com `}
                        >
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </span>
                    }
                    className='margin'
                  >
                    <Input style={styles.row} />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    style={styles.margin}
                    name='description'
                    label={t('Form.Description')}
                  >
                    <Input.TextArea showCount />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <BankCashOpenAccount {...{ form, baseCurrencyId }} type='bank' />
        </Form>
      </Modal>
    </div>
  );
};

interface IStyles {
  bodyStyle: (isSubBase: any, isBigMobile: any) => React.CSSProperties;
  name: React.CSSProperties;
  save: React.CSSProperties;
  reset: React.CSSProperties;
  drop: React.CSSProperties;
  row: React.CSSProperties;
  marginBottom: React.CSSProperties;
  margin: React.CSSProperties;
  modal: React.CSSProperties;
}
const styles: IStyles = {
  bodyStyle: (isSubBase, isBigMobile) => ({
    maxHeight: `calc(100vh - 152px)`,
    overflowY: 'auto',
    padding: isSubBase ? '20px ' : '10px 24px',
    // paddingTop: "10px 2",
  }),
  name: { marginBottom: '0rem' },
  save: { width: '137%' },
  reset: { width: '100%' },
  drop: { height: '100%' },
  row: {
    width: '100%',
    paddingInlineEnd: '16px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  marginBottom: { marginBottom: '.3rem' },

  margin: { marginBottom: '12px' },
  modal: { top: 10, bottom: 10 },
};

export default AddBankAccount;
