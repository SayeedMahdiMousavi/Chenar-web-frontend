import React from 'react';
import AddBranch from './Add';
import CompanyBranchTable from './Table';
import { useTranslation } from 'react-i18next';
import { Title } from '../SelfComponents/Title';
import { Row, Col } from 'antd';
import { useMediaQuery } from '../MediaQurey';
import { BRANCH_M, WAREHOUSE_M } from '../../constants/permissions';
// import { DownOutlined } from "@ant-design/icons";
// import { Link } from "react-router-dom";
// import ImportProduct from "./ImportProductAndService";

const baseUrl = '/inventory/warehouse/';

export default function CompanyBranch(props) {
  const { t } = useTranslation();
  const isMiniTablet = useMediaQuery('(max-width:485px)');
  const isMobile = useMediaQuery('(max-width:425px)');
  const isMiniMobile = useMediaQuery('(max-width:375px)');

  // const menu = (
  //   <Menu>
  //     {/* <Menu.Item key="1">
  //       <Link to="/warehouse-notification">
  //         {t("Warehouse.Notification.1")}
  //       </Link>
  //     </Menu.Item> */}
  //     <Menu.Item key="2">
  //       <Link to="/product-statistic-adjustment">
  //         {t("Warehouse.Warehouse_adjustment")}
  //       </Link>
  //     </Menu.Item>
  //   </Menu>
  // );

  return (
    <>
      <Row className='categore-header' align='middle' justify='start'>
        <Col
          xl={{ span: 7 }}
          md={{ span: 8 }}
          sm={{ span: 10 }}
          xs={{ span: 13 }}
          className='Sales__content-3-body'
        >
          <Row>
            <Col span={24}>
              <Title value={t('Company_branch.1')} model={BRANCH_M} />
            </Col>
          </Row>
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
          <Row justify={isMobile ? 'center' : 'space-around'} gutter={[0, 5]}>
            <Col xl={10} md={10} sm={9} xs={23}>
              {/* <Dropdown overlay={menu} trigger={["click"]}>
                <Button
                  shape="round"
                  type="primary"
                  className="more-button"
                  ghost
                >
                  {t("Sales.Product_and_services.More")} <DownOutlined />
                </Button>
              </Dropdown> */}
            </Col>
            <Col xl={13} md={12} sm={13} xs={24}>
              <AddBranch baseUrl={baseUrl} />
            </Col>
          </Row>
        </Col>
      </Row>

      <CompanyBranchTable baseUrl={baseUrl} />
    </>
  );
}
