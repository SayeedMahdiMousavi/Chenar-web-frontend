import React from "react";
import { Layout, Row, Col } from "antd";
import { useTranslation } from "react-i18next";
import { Title } from "../../SelfComponents/Title";
import IncomeTypeTable from "./IncomeTypeTable";
import AddIncomeType from "./AddIncomeType";
import { Link } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

interface IProps {
  title: string;
  baseUrl: string;
  addTitle: string;
  backText: string;
  backUrl: string;
  model: string;
}
export default (props: IProps) => {
  const { i18n } = useTranslation();
  return (
    <Layout>
      <Row className="categore-header" align="middle" justify="start">
        <Col
          md={{ span: 10 }}
          sm={{ span: 11 }}
          xs={{ span: 14 }}
          className="Sales__content-3-body"
        >
          <Row>
            <Col span={24}>
              <Title value={props.title} model={props.model} />
            </Col>
            <Col
              xl={{ span: 12, offset: 0 }}
              lg={{ span: 17, offset: 0 }}
              md={{ span: 18, offset: 0 }}
              xs={{ span: 17, offset: 0 }}
            >
              <Link to={`${props.backUrl}`} className="category__product">
                {i18n.language === "en" ? <LeftOutlined /> : <RightOutlined />}
                {props.backText}
              </Link>
            </Col>
          </Row>
        </Col>
        <Col
          xl={{ span: 3, offset: 11 }}
          lg={{ span: 3, offset: 11 }}
          md={{ span: 4, offset: 10 }}
          sm={{ span: 5, offset: 8 }}
          xs={{ span: 6, offset: 4 }}
        >
          <AddIncomeType
            title={props.addTitle}
            baseUrl={props.baseUrl}
            type="incomeType"
            model={props?.model}
          />
        </Col>
      </Row>

      <IncomeTypeTable
        baseUrl={props.baseUrl}
        title={props.title}
        model={props?.model}
      />
    </Layout>
  );
};
