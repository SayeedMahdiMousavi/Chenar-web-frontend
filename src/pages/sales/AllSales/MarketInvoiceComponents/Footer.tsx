import React, { ReactNode } from 'react';
import {
  Row,
  Col,
  Form,
  InputNumber,
  Button,
  Popconfirm,
  // Checkbox,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { PrintIcon } from '../../../../icons';
import { ResetButton, SaveButton } from '../../../../components';
// import { useForm } from "antd/lib/form/Form";

interface IProps {
  // onChangeWithDraw: (value: number | string | null | undefined) => void;
  // withDrawRef: any;
  saveRef: any;
  // totalPrice: string;
  // customerCardValue: string;
  responseId: boolean;
  // customerId: number;
  editingKey: string;
  saveLoading: boolean;
  children: ReactNode;
  handlePrint: () => void;
  // handleChangeByPayCard: (value: any) => void;
  handleSendOrder: () => void;
  handleReset: () => void;
  handleCancel: () => void;
}

function PosInvoiceFooter({
  saveLoading,
  saveRef,
  // totalPrice,
  // customerCardValue,
  // customerId,
  responseId,
  editingKey,
  children,
  handleCancel,
  handlePrint,
  handleReset,
  // handleChangeByPayCard,
  handleSendOrder,
}: IProps) {
  const { t, i18n } = useTranslation();
  const totalWrapperCol = {
    xxl: i18n.language === 'en' ? { span: 13 } : { span: 14 },
    xl: i18n.language === 'en' ? { span: 13 } : { span: 14 },
    lg: i18n.language === 'en' ? { span: 13 } : { span: 14 },
  };

  const totalLabelCol = {
    xxl: i18n.language === 'en' ? { span: 11 } : { span: 10 },
    xl: i18n.language === 'en' ? { span: 11 } : { span: 10 },
    lg: i18n.language === 'en' ? { span: 11 } : { span: 10 },
  };

  // const handelWithDrawFocus = (e: any) => {
  //   e.target.select();
  // };

  // const customerId = props?.customerId;
  // const totalPrice = props.totalPrice;
  // const customerCardValue = props.customerCardValue;
  // const numberInputReg = /^0/;

  // const withDrawFormat = (value: any) => {
  //   return value >= parseInt(totalPrice) &&
  //     parseInt(totalPrice) <= parseInt(customerCardValue)
  //     ? parseInt(totalPrice)
  //     : value && parseInt(value) >= parseInt(customerCardValue)
  //     ? customerCardValue
  //     : value < 0
  //     ? 0
  //     : numberInputReg.test(value)
  //     ? 0
  //     : value;
  // };

  return (
    <Row>
      <Col style={styles.footer}>
        <Row gutter={15}>
          <Col span={12}>
            <Form.Item
              name='total'
              label={t('Sales.Customers.Form.Total')}
              labelCol={totalLabelCol}
              wrapperCol={totalWrapperCol}
              labelAlign='right'
              style={styles.margin}
            >
              <InputNumber
                type='number'
                className='num'
                inputMode='numeric'
                disabled
                style={styles.input}
              />
            </Form.Item>
            {/* <Form.Item
              name="payCash"
              label={t("Employees.Pay_cash")}
              style={styles.margin}
              labelCol={totalLabelCol}
              wrapperCol={totalWrapperCol}
            >
              <InputNumber
                style={styles.input}
                disabled
                min={0}
                type="number"
                className="num"
                inputMode="numeric"
              />
            </Form.Item> */}
          </Col>
          <Col span={12}>
            <Form.Item
              name='remainAmount'
              label={t('Sales.All_sales.Invoice.cash_amount')}
              style={styles.margin}
              labelCol={totalLabelCol}
              wrapperCol={totalWrapperCol}
            >
              <InputNumber
                disabled
                style={styles.input}
                type='number'
                className='num'
                inputMode='numeric'
              />
            </Form.Item>
            {/* <Form.Item
              name="cardBalance"
              label={t("Sales.All_sales.Invoice.Card_balance")}
              style={styles.margin}
              labelCol={totalLabelCol}
              wrapperCol={totalWrapperCol}
            >
              <InputNumber
                style={styles.input}
                disabled
                min={0}
                type="number"
                className="num"
                inputMode="numeric"
              />
            </Form.Item> */}

            {/* <Form.Item
              name="usedCardBalance"
              label={t("Sales.All_sales.Invoice.With_draw")}
              style={styles.margin}
              labelCol={totalLabelCol}
              wrapperCol={totalWrapperCol}
            >
              <InputNumber
                min={0}
                type="number"
                style={styles.input}
                inputMode="numeric"
                className="select-all-on-touch num"
                onFocus={handelWithDrawFocus}
                ref={props.withDrawRef}
                onChange={props.onChangeWithDraw}
                formatter={withDrawFormat}
                parser={withDrawFormat}
                readOnly={responseId}
              />
            </Form.Item> */}
          </Col>
        </Row>
        <Row justify='space-between' style={{ marginTop: '10px' }}>
          <Col>
            {/* <Button
              onClick={handlePrint}
              style={styles.button}
              // disabled={!responseId}
              icon={<PrintIcon />}
              type="primary"
              ghost
            >
              {t("Sales.All_sales.Invoice.Print_order")}
            </Button> */}
            {children}
          </Col>

          <Col>
            <Form.Item style={{ marginBottom: '0px' }}>
              <SaveButton
                disabled={responseId || editingKey !== ''}
                ref={saveRef}
                onClick={handleSendOrder}
                loading={saveLoading}
                style={styles.button}
                text={t('Sales.All_sales.Invoice.Send_order')}
              />
            </Form.Item>
          </Col>
          <Col>
            <Popconfirm
              placement='topLeft'
              title={t('Sales.All_sales.Invoice.Pos_cancel_message')}
              onConfirm={handleCancel}
              okText={t('Manage_users.Yes')}
              cancelText={t('Manage_users.No')}
              disabled={responseId}
            >
              <Button
                style={styles.button}
                disabled={responseId}
                type='primary'
                ghost
              >
                {t('Sales.All_sales.Invoice.Cancel_order')}
              </Button>
            </Popconfirm>
          </Col>
          <Col>
            <Popconfirm
              placement='topLeft'
              title={t('Sales.All_sales.Invoice.Pos_reset_message')}
              onConfirm={handleReset}
              okText={t('Manage_users.Yes')}
              cancelText={t('Manage_users.No')}
            >
              <ResetButton style={styles.button} />
            </Popconfirm>
          </Col>
        </Row>
      </Col>

      {/* <Col style={{ paddingInlineStart: "20px" }}>
        <Form.Item name="payByCard" valuePropName="checked">
          <Checkbox
            disabled={
              parseFloat(customerCardValue) < parseFloat(totalPrice) ||
              !customerId
            }
            onChange={props.handleChangeByPayCard}
          >
            {t("Sales.All_sales.Invoice.Pay_by_card")}
          </Checkbox>
        </Form.Item>
      </Col> */}
    </Row>
  );
}
//@ts-ignore
// eslint-disable-next-line no-func-assign
PosInvoiceFooter = React.memo(PosInvoiceFooter, (prevProps, nextProps) => {
  if (
    prevProps.saveLoading !== nextProps.saveLoading ||
    prevProps.editingKey !== nextProps.editingKey ||
    prevProps.responseId !== nextProps.responseId
    // ||
    // prevProps.customerCardValue !== nextProps.customerCardValue ||
    // prevProps.totalPrice !== nextProps.totalPrice ||
    // prevProps.customerId !== nextProps.customerId
  ) {
    return false;
  }
  return true;
});

export default PosInvoiceFooter;

const styles = {
  margin: { marginBottom: '10px' },
  button: { height: '37px', borderRadius: '4px' },
  input: { borderRadius: '4px' },
  footer: { width: '475px' },
};
