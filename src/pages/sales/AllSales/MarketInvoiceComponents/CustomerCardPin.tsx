import React, { useRef, useState } from "react";
import { Form, Input, Row, Col, Typography } from "antd";
import { useTranslation } from "react-i18next";

interface IProps {
  setSaveFocus: (value: boolean) => void;
  setSaveDisabled: (value: boolean) => void;
  setCustomerCardPin: (value: string) => void;
  form1: any;
  customerCardPin: string;
}
export default function CustomerCardPin(props: IProps) {
  const { t } = useTranslation();
  const firstPinRef = useRef<any>(null);
  const secondPinRef = useRef<any>(null);
  const thirdPinRef = useRef<any>(null);
  const fourthPinRef = useRef<any>(null);
  const [error, setError] = useState(false);
  const checkPin = React.useCallback(() => {
    const row = props.form1.getFieldsValue();
    const newValue = `${row?.firstPinCod}${row?.secondPinCod}${row?.thirdPinCod}${row?.fourthPinCod}`;
    //@ts-ignore
    props.setCustomerCardPin((prev: string) => {
      if (prev === newValue) {
        setError(false);
        props.setSaveDisabled(true);
      } else {
        setError(true);
        props.setSaveDisabled(false);
      }
      return prev;
    });
  }, [props]);

  const onChangeFirstPin = (e: any) => {
    //@ts-ignore
    props.setCustomerCardPin((prev: string) => {
      const row = props.form1.getFieldsValue();
      if (
        prev ===
        `${row?.firstPinCod}${row.secondPinCod}${row.thirdPinCod}${row?.fourthPinCod}`
      ) {
        setError(false);
        props.setSaveDisabled(true);
      } else {
        setError(true);
        props.setSaveDisabled(false);
      }
      return prev;
    });
    if (e.target.value) {
      setTimeout(() => {
        secondPinRef.current!.focus();
      }, 10);
    }
  };

  const onChangeSecondPin = (e: any) => {
    //@ts-ignore
    props.setCustomerCardPin((prev: string) => {
      const row = props.form1.getFieldsValue();
      if (
        prev ===
        `${row?.firstPinCod}${row.secondPinCod}${row.thirdPinCod}${row?.fourthPinCod}`
      ) {
        setError(false);
        props.setSaveDisabled(true);
      } else {
        setError(true);
        props.setSaveDisabled(false);
      }
      return prev;
    });
    if (e.target.value) {
      setTimeout(() => {
        thirdPinRef.current!.focus();
      }, 10);
    }
  };

  const onChangeThirdPin = (e: any) => {
    //@ts-ignore
    props.setCustomerCardPin((prev: string) => {
      const row = props.form1.getFieldsValue();
      if (
        prev?.[2] ===
        `${row?.firstPinCod}${row.secondPinCod}${row.thirdPinCod}${row?.fourthPinCod}`
      ) {
        setError(false);
        props.setSaveDisabled(true);
      } else {
        setError(true);
        props.setSaveDisabled(false);
      }
      return prev;
    });

    if (e.target.value) {
      setTimeout(() => {
        fourthPinRef.current!.focus();
      }, 10);
    }
  };

  const onChangeFourthPin = (e: any) => {
    checkPin();
  };

  const handleFocusInputNumber = (e: any) => {
    e.target.select();
  };
  return (
    <Form form={props.form1}>
      <Row gutter={7}>
        <Col>
          <Form.Item
            style={styles.formItem}
            validateStatus={error === true ? "error" : undefined}
            name="firstPinCod"
          >
            <Input
              ref={firstPinRef}
              onChange={onChangeFirstPin}
              onFocus={handleFocusInputNumber}
              maxLength={1}
              autoFocus
              style={styles.input}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            style={styles.formItem}
            validateStatus={error === true ? "error" : undefined}
            name="secondPinCod"
          >
            <Input
              maxLength={1}
              min={0}
              ref={secondPinRef}
              onChange={onChangeSecondPin}
              onFocus={handleFocusInputNumber}
              max={9}
              style={styles.input}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            style={styles.formItem}
            validateStatus={error === true ? "error" : undefined}
            name="thirdPinCod"
          >
            <Input
              maxLength={1}
              ref={thirdPinRef}
              onChange={onChangeThirdPin}
              onFocus={handleFocusInputNumber}
              min={0}
              max={9}
              style={styles.input}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            style={styles.formItem}
            validateStatus={error === true ? "error" : undefined}
            name="fourthPinCod"
          >
            <Input
              maxLength={1}
              ref={fourthPinRef}
              onChange={onChangeFourthPin}
              onFocus={handleFocusInputNumber}
              min={0}
              max={9}
              style={styles.input}
            />
          </Form.Item>
        </Col>
        <Col>
          {error && (
            <Typography.Text type="danger">
              {t("Sales.All_sales.Invoice.Pin_code_error_message")}
            </Typography.Text>
          )}{" "}
        </Col>
      </Row>
    </Form>
  );
}

interface IStyle {
  input: React.CSSProperties;
  formItem: React.CSSProperties;
}
const styles: IStyle = {
  input: {
    width: "50px",
    textAlign: "center",
    fontWeight: "bold",
  },
  formItem: { marginBottom: "0px" },
};
