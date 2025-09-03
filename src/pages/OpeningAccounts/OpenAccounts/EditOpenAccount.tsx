import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import {
  Modal,
  Form,
  Row,
  Col,
  message,
  Divider,
  InputNumber,
  Select,
} from 'antd';
import moment from 'moment';
import dayjs from 'dayjs';
import { useMediaQuery } from '../../MediaQurey';
import { ModalDragTitle } from '../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { Styles } from '../../styles';
import { CurrencyProperties } from '../../Transactions/Components/CurrencyProperties';
import { ReceiveDetailsProperties } from '../../Transactions/Components/ReceiveDetailsProperties';
import { AccountName } from './AccountName';
import {
  changeGToJ,
  changeJToG,
  handlePrepareDateForDateField,
  handlePrepareDateForServer,
} from '../../../Functions/utcDate';
import useGetCalender from '../../../Hooks/useGetCalender';
import { CancelButton, EditMenuItem, SaveButton } from '../../../components';
import { OPINING_ACCOUNT_M } from '../../../constants/permissions';
import { manageErrors } from '../../../Functions';

interface IProps {
  baseUrl: string;
  record: any;
  setVisible: (value: boolean) => void;
  handleClickEdit: () => void;
  handleUpdateItems: () => void;
}

const dateFormat = 'YYYY-MM-DD HH:mm';
const { Option } = Select;
const EditOpenAccount: React.FC<IProps> = ({
  record,
  baseUrl,
  setVisible,
  handleClickEdit,
  handleUpdateItems,
  ...rest
}) => {
  const { t } = useTranslation();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [currencyValue, setCurrencyValue] = useState(1);
  const [form] = Form.useForm();
  const [bankValue, setBankValue] = useState('');
  const [disabled, setDisabled] = useState<boolean>(true);
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isBigMobile = useMediaQuery('(max-width: 480px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  const editOpenAccount = async (value: {
    account: string;
    // credit: number;
    // debit: number;
    currency: number;
    currency_rate: number;
    date_time: string;
    description: string;
    amount: number;
    transaction_type: string;
  }) => await axiosInstance.put(`${baseUrl}${record?.id}/`, value);

  const {
    mutate: mutateEditOpenAccount,
    isLoading,
    reset,
  } = useMutation(editOpenAccount, {
    onSuccess: () => {
      setIsShowModal({
        visible: false,
      });
      message.success(t('Message.Transaction_add_message'));
      handleUpdateItems();
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const onFinish = () => {
    form.validateFields().then(async (values) => {
      const allData = {
        account: values?.accountName?.value,

        // credit: values.type === "credit" ? values?.amount : 0,
        // debit: values.type === "debit" ? values?.amount : 0,
        amount: values?.amount,
        currency: values.currency?.value,
        currency_rate: values?.currencyRate,
        date_time: handlePrepareDateForServer({
          date: values?.date,
          calendarCode,
        }),
        description: values.description,
        transaction_type: values?.type,
      };

      mutateEditOpenAccount(allData);
    });
  };

  const showModal = () => {
    setVisible(false);
    handleClickEdit();
    const valueType = record?.account?.id?.split('-');
    setBankValue(valueType?.[0]);
    // setCurrencyValue(record?.currency?.id);
    // const debit = parseFloat(record?.debit) === 0 ? "" : record?.debit;
    //
    // const credit = parseFloat(record?.credit) === 0 ? "" : record?.credit;

    form.setFieldsValue({
      accountName: {
        label: record?.account?.name,
        value: record?.account?.id,
      },
      type: record?.transaction_type,
      // type: parseFloat(record?.credit) === 0 ? "debit" : "credit",
      amount: parseFloat(record?.amount),
      // parseFloat(record?.credit) === 0
      //   ? parseFloat(record?.debit)
      //   : parseFloat(record?.credit),
      currency: {
        label: record?.currency?.name,
        value: record?.currency?.id,
      },
      currencyRate: parseFloat(record?.currency_rate),
      date: handlePrepareDateForDateField({
        date: record?.date_time,
        calendarCode,
      }),
      description: record?.description,
    });

    setIsShowModal({
      visible: true,
    });
  };

  const handleCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };

  const handelAfterClose = () => {
    form.resetFields();
    setBankValue('');
    reset();
  };

  const handleChangeName = (value: string) => {
    setBankValue(value);
    if (value === 'BNK' || value === 'CSH') {
      form.setFieldsValue({ type: 'debit' });
    }
  };

  return (
    <div>
      <EditMenuItem
        {...rest}
        onClick={showModal}
        permission={OPINING_ACCOUNT_M}
      />

      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Opening_accounts.Open_account_information')}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled} nodeRef={ref as React.RefObject<HTMLElement>}>
            <div ref={ref}>{modal}</div>
          </Draggable>
        )}
        style={Styles.modal(isMobile)}
        bodyStyle={Styles.modalBody(isMobile, isSubBase, isMiniTablet)}
        open={isShowModal.visible}
        destroyOnClose
        afterClose={handelAfterClose}
        centered
        width={500}
        onCancel={handleCancel}
        footer={
          <Row justify='end'>
            <Col>
              <CancelButton onClick={handleCancel} />
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
        >
          <Row gutter={10}>
            <Col span={isBigMobile ? 24 : 12}>
              <AccountName onChange={handleChangeName} />
            </Col>
            <Col span={24}>
              <Divider />
            </Col>
            <Col span={isBigMobile ? 24 : 12}>
              {' '}
              <Form.Item
                name='type'
                rules={[
                  {
                    required: true,
                    message: t('Sales.Customers.Discount.Required_type'),
                  },
                ]}
                style={styles.margin}
              >
                <Select
                  className='num'
                  disabled={bankValue === 'BNK' || bankValue === 'CSH'}
                  placeholder={t('Sales.Product_and_services.Type')}
                >
                  <Option value='debit'>{t('Opening_accounts.Debit')}</Option>
                  <Option value='credit'>{t('Opening_accounts.Credit')}</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={isBigMobile ? 24 : 12}>
              <Form.Item
                name='amount'
                preserve={false}
                style={styles.margin}
                rules={[
                  {
                    required: true,
                    message: t('Sales.Customers.Form.Amount_required'),
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  type='number'
                  className='num'
                  inputMode='numeric'
                  placeholder={t('Sales.Customers.Form.Amount')}
                />
              </Form.Item>
            </Col>
            {/* {bankValue === "BNK" || bankValue === "CSH" ? null : (
              <Col span={isBigMobile ? 24 : 12}>
                {" "}
                <Form.Item
                  name="credit"
                  preserve={false}
                  style={styles.margin}
                  rules={[
                    {
                      required: debit === "" ? true : false,
                      message: t("Opening_accounts.Credit_required"),
                    },
                  ]}
                >
                  <InputNumber
                    disabled={debit === "" ? false : true}
                    onChange={onChangeCredit}
                    type="number"
                    className="num"
                    inputMode="numeric"
                    placeholder={t("Opening_accounts.Credit")}
                  />
                </Form.Item>
              </Col>
            )}
            <Col span={isBigMobile ? 24 : 12}>
              {" "}
              <Form.Item
                name="debit"
                style={styles.margin}
                rules={[
                  {
                    required: credit === "" ? true : false,
                    message: t("Opening_accounts.Debit_required"),
                  },
                ]}
              >
                <InputNumber
                  disabled={credit === "" ? false : true}
                  onChange={onChangeDebit}
                  type="number"
                  className="num"
                  inputMode="numeric"
                  placeholder={t("Opening_accounts.Debit")}
                />
              </Form.Item>
            </Col> */}

            <Col span={24}>
              <Divider />
            </Col>
            <Col span={24}>
              <CurrencyProperties
                currencyValue={currencyValue}
                setCurrencyValue={setCurrencyValue}
                form={form}
                type='openAccount'
              />{' '}
            </Col>
            <Col span={24}>
              <Divider />
            </Col>
            <Col span={24}>
              <ReceiveDetailsProperties type='openAccount' />{' '}
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

interface IStyles {
  margin: React.CSSProperties;
}
const styles: IStyles = {
  margin: { margin: '0rem' },
};

export default EditOpenAccount;
