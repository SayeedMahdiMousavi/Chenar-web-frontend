import React from "react";
import { Row, Col, Checkbox } from "antd";
import { useTranslation } from "react-i18next";

interface VisibilityFilters {
  barcode: boolean;
  units: boolean;
  date: boolean;
  available: boolean;
  currency: boolean;
}
interface Props {
  column: {
    onChangeFax: () => void;
    onChangePhone: () => void;
    onChangeAddress: () => void;
    onChangeAccountNumber: () => void;

    onChangeBranch: () => void;
    onChangeNotes: () => void;
  };
}

const Settings: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  return (
    <div className="table__header2-setting">
      <Checkbox.Group defaultValue={["B", "A", "E"]}>
        <Row className="table__header2-setting-group" gutter={[0, 10]}>
          <Col span={20} offset={2}>
            <h4>{t("Sales.Product_and_services.Columns")}</h4>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              value="A"
              onChange={props.column.onChangeBranch}
              className="table__header2-setting-column"
            >
              {t("Banking.Form.Branch")}
            </Checkbox>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              value="B"
              onChange={props.column.onChangeAccountNumber}
              className="table__header2-setting-column"
            >
              {t("Banking.Form.Account_number")}
            </Checkbox>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              value="E"
              name="address"
              onChange={props.column.onChangeAddress}
              className="table__header2-setting-column"
            >
              {t("Form.Address")}
            </Checkbox>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              name="phone"
              value="C"
              onChange={props.column.onChangePhone}
              className="table__header2-setting-column"
            >
              {t("Form.Phone")}
            </Checkbox>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              value="D"
              onChange={props.column.onChangeFax}
              className="table__header2-setting-column"
            >
              {t("Form.Fax")}
            </Checkbox>
          </Col>

          <Col span={20} offset={2}>
            <Checkbox
              value="F"
              onChange={props.column.onChangeNotes}
              className="table__header2-setting-column"
            >
              {t("Form.Description")}
            </Checkbox>
          </Col>
        </Row>
      </Checkbox.Group>
    </div>
  );
};

export default Settings;
