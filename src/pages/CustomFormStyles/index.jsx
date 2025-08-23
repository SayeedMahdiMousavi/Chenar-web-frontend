import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Row, Col, Layout, Menu, Dropdown, Button } from 'antd';

import CustomFormStylesTable from './CustomFormStyleTable';
// import Invoice from "./Invoice";
import POSInvoice from './POSInvoice';
// import Estimate from "./Estimate";
// import SalesRecipe from "./SalesRecipe";
// import ShoppingCenter from "./ShoppingCenter";
import { Title } from '../SelfComponents/Title';
import { CUSTOM_FORM_STYLE_M } from '../../constants/permissions';
import { checkPermissions } from '../../Functions';
// import AddPurchaseDesign from "./PurchaseInvoice/AddDesign";

const baseUrl = '/setting/pos_invoice/';

const CustomFormStyles = () => {
  const { t } = useTranslation();
  // const batch = (
  //   <Menu>
  //     <Menu.Item key="8">
  //       <POSInvoice baseUrl={baseUrl} />
  //     </Menu.Item>
  //   </Menu>
  // );
  const items = [
    {
      key: '0',
      label: <POSInvoice baseUrl={baseUrl} />,
    },
  ];
  return (
    <Layout>
      <Row
        className='Sales__content-3'
        align='middle'
        justify='space-between'
        gutter={20}
      >
        <Col>
          <Row>
            <Col>
              <Title
                value={t('Custom_form_styles.1')}
                model={CUSTOM_FORM_STYLE_M}
              />
            </Col>
            <Col>
              {/* <Link to="/all-lists">
                      {i18n.language === "en" ? (
                        <LeftOutlined />
                      ) : (
                        <RightOutlined />
                      )}
                      {t("Sales.Product_and_services.All_lists")}
                    </Link> */}
            </Col>
          </Row>
        </Col>
        <Col>
          {checkPermissions(`add_${CUSTOM_FORM_STYLE_M}`) && (
            <Dropdown menu={{ items }} trigger={['click']}>
              <Button type='primary' shape='round'>
                {t('Custom_form_styles.New_style')} <DownOutlined />
              </Button>
            </Dropdown>
          )}
        </Col>
      </Row>

      <CustomFormStylesTable baseUrl={baseUrl} />
    </Layout>
  );
};

export default CustomFormStyles;
