

import React from "react"
import { Row, Col, Layout, Menu,  } from "antd";
import ContactsNavbar from "../Employees/Navbar";
import { useTranslation } from "react-i18next";
import { Title } from "../SelfComponents/Title";
import { useMediaQuery } from "../MediaQurey";
import { PageMoreButton } from "../../components";
import AddPartners from "./AddPartners";
import PartnersTable from "./PartnersTable";

const PartnersPage = () => {
    const { t } = useTranslation()
    const isMobile = useMediaQuery("(max-width:425px)");
    const isMiniMobile = useMediaQuery("(max-width:375px)");
    const isMiniTablet = useMediaQuery("(max-width:485px)");
    return (

        <Layout>
      <ContactsNavbar />

      <Row className="Sales__content-3" align="middle" justify="start">
        <Col
          xl={{ span: 7 }}
          md={{ span: 8 }}
          sm={{ span: 10 }}
          xs={{ span: 13 }}
        >
          <Title value={t("Partners.1")} 
        //   model={EMPLOYEE_M}
           />
        </Col>
        <Col
          xl={{ span: 6, offset: 11 }}
          md={{ span: 8, offset: 8 }}
          sm={{ span: 10, offset: 4 }}
          xs={
            isMiniMobile
              ? { span: 8, offset: 3 }
              : isMiniTablet
              ? { span: 7, offset: 4 }
              : { span: 6, offset: 5 }
          }
        >
          <Row justify={isMobile ? "center" : "space-around"} gutter={[0, 5]}>
            {/* <Col xl={10} md={10} sm={9} xs={23}>
              <PageMoreButton
                permissions={[
                  EMPLOYEE_PAY_REC_M,
                  EMPLOYEE_SALARY_M,
                  EMPLOYEE_CATEGORY_M,
                ]}
                overlay={menu}
              />
            </Col> */}
            <Col xl={13} md={12} sm={13} xs={24}>
              <AddPartners 
            //   baseUrl={baseUrl}
               />
            </Col>
          </Row>
        </Col>
      </Row>
          <Row>
            <Col span={24}>
                <PartnersTable />
            </Col>
          </Row>
    
      </Layout>
    )
}


export default PartnersPage