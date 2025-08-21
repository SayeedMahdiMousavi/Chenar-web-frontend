import React, { ReactNode } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useMediaQuery } from "../../MediaQurey";
import { Title } from "../Title";
import PageBody from "./PageBody";

interface IProps {
  title: string;
  backText?: string;
  backUrl?: string;
  children?: ReactNode;
  table?: ReactNode;
  navbar?: ReactNode;
}

export default function PagHeader(props: IProps) {
  const { i18n } = useTranslation();
  const isMiniMiniMobile = useMediaQuery("(max-width:336px)");
  const isMiniMobile = useMediaQuery("(max-width:375px)");
  const isMiniTablet = useMediaQuery("(max-width:485px)");
  return (
    <div style={{ width: "100%" }} >
      {props.navbar}
      <Row className="Sales__content-3" align="middle" justify="start">
        <Col xl={10} lg={11} md={13} sm={15} xs={isMiniMiniMobile ? 14 : 12}>
          <Row>
            <Col span={24}>
              <Title value={props.title} />
            </Col>

            {Boolean(props.backUrl) && (
              <Col
                xl={{ span: 12, offset: 0 }}
                lg={{ span: 17, offset: 0 }}
                md={{ span: 18, offset: 0 }}
                xs={{ span: 17, offset: 0 }}
              >
                <Link to={`${props.backUrl}`} className="category__product">
                  {i18n.language === "en" ? (
                    <LeftOutlined />
                  ) : (
                    <RightOutlined />
                  )}
                  {props.backText}
                </Link>
              </Col>
            )}
          </Row>
        </Col>
        <Col
          xl={14}
          lg={13}
          md={11}
          sm={9}
          xs={isMiniMobile ? 10 : isMiniTablet ? 10 : 12}
        >
          {props.children}
        </Col>
      </Row>
      {props.table}
    </div>
  );
}
