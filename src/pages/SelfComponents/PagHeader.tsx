import React, { ReactNode } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "../MediaQurey";
import { Title } from "./Title";

interface IProps {
  title: string;
  back: boolean;
  backText?: string;
  backUrl?: string;
  addButton?: ReactNode;
}
export default function PagHeader(props: IProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMiniMiniMobile = useMediaQuery("(max-width:336px)");

  const handleOnClickBack = () => {
    if (props.backText === t("Reports.1") && props.backUrl) {
      navigate(props.backUrl);
    } else {
      navigate.call(navigate, -1);
    }
  };
  return (
    <Row className="Sales__content-3" align="middle" justify="start">
      <Col
        xl={{ span: 10 }}
        lg={{ span: 11 }}
        md={{ span: 13 }}
        sm={{ span: 15 }}
        xs={isMiniMiniMobile ? { span: 14 } : { span: 12 }}
      >
        <Row>
          <Col span={24}>
            <Title value={props.title} />
          </Col>

          {props.back && (
            <Col
              xl={{ span: 12, offset: 0 }}
              lg={{ span: 17, offset: 0 }}
              md={{ span: 18, offset: 0 }}
              xs={{ span: 17, offset: 0 }}
            >
              {/* <Link to={`${props.backUrl}`} className="category__product"> */}
              <a href="#" onClick={handleOnClickBack}>
                {t("Dir") === "ltr" ? <LeftOutlined /> : <RightOutlined />}
                {props.backText}
              </a>
              {/* </Link> */}
            </Col>
          )}
        </Row>
      </Col>
      <Col style={styles.new}>{props.addButton}</Col>
    </Row>
  );
}

interface IStyles {
  new: React.CSSProperties;
}
const styles: IStyles = { new: { textAlign: "end" } };
