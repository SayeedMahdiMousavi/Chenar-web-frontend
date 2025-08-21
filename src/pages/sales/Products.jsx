import React from 'react';
import AddProduct from './Products/AddProduct';
import ProductTable from './Products/table';
import { useTranslation } from 'react-i18next';
import { GlobalHotKeys } from 'react-hotkeys';
import { Title } from '../SelfComponents/Title';
import { Row, Col, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '../MediaQurey';
import { checkPermissionsModel } from '../../Functions';
import {
  PRODUCT_CATEGORY_M,
  PRODUCT_INVENTORY_M,
  PRODUCT_M,
  PRODUCT_PRICE_M,
  PRODUCT_UNIT_M,
} from '../../constants/permissions';
import { PageMoreButton } from '../../components';
import Inventory from './Inventory';
import { useQueryClient } from 'react-query';
import { PRODUCT_LIST } from '../../constants/routes';
// import ImportProduct from "./Products/ImportProductAndService";

function Products() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery('(max-width:425px)');
  const isMiniMobile = useMediaQuery('(max-width:375px)');
  const isMiniTablet = useMediaQuery('(max-width:485px)');

  const handleUpdateItems = React.useCallback(() => {
    queryClient.invalidateQueries(PRODUCT_LIST);
    queryClient.invalidateQueries(`${PRODUCT_LIST}price/`);
    queryClient.invalidateQueries(`${PRODUCT_LIST}inventory/`);
    queryClient.invalidateQueries(`${PRODUCT_LIST}infinite/`);
  }, [queryClient]);

  const keyMap = {
    MOVE_UP: { name: 'Display keyboard shortcuts', sequence: 'Control+p' },
  };
  const handlers = {
    MOVE_UP: (event) => {
      event.preventDefault();
    },
  };

  const menu = (
    <Menu>
      {checkPermissionsModel(PRODUCT_CATEGORY_M) && (
        <Menu.Item key='1'>
          <Link to='/product-categories'>
            {t('Sales.Product_and_services.Categories.1')}
          </Link>
        </Menu.Item>
      )}
      {checkPermissionsModel(PRODUCT_UNIT_M) && (
        <Menu.Item key='2'>
          <Link to='/product-units'>
            {t('Sales.Product_and_services.Units.1')}
          </Link>
        </Menu.Item>
      )}
      {checkPermissionsModel(PRODUCT_INVENTORY_M) && (
        <Menu.Item key='3'>
          <Link to='/product-inventory'>
            {t('Sales.Product_and_services.Inventory.Product_inventory')}
          </Link>
        </Menu.Item>
      )}
      {checkPermissionsModel(PRODUCT_PRICE_M) && (
        <Menu.Item key='4'>
          <Link to='/price-recording'>
            {t('Sales.Product_and_services.Price_recording.1')}
          </Link>
        </Menu.Item>
      )}
    </Menu>
  );

  // const imp = (
  //   <Menu>
  //     <Menu.Item key="1">
  //       <ImportProduct />
  //     </Menu.Item>
  //   </Menu>
  // );

  return (
    <Inventory>
      <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
        <Row className='Sales__content-3' align='middle' justify='start'>
          <Col
            xl={{ span: 7 }}
            md={{ span: 8 }}
            sm={{ span: 10 }}
            xs={{ span: 13 }}
          >
            <Row>
              <Col span={24}>
                <Title
                  value={t('Sales.Product_and_services.1')}
                  model={PRODUCT_M}
                />
              </Col>
              <Col span={24}>
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
                <PageMoreButton
                  permissions={[
                    PRODUCT_CATEGORY_M,
                    PRODUCT_INVENTORY_M,
                    PRODUCT_PRICE_M,
                    PRODUCT_UNIT_M,
                  ]}
                  overlay={menu}
                />
              </Col>
              <Col xl={13} md={12} sm={13} xs={24}>
                <AddProduct
                  place='product'
                  setUnits=''
                  form=''
                  handleUpdateItems={handleUpdateItems}
                  baseUrl={PRODUCT_LIST}
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <ProductTable
          handleUpdateItems={handleUpdateItems}
          baseUrl={PRODUCT_LIST}
        />
      </GlobalHotKeys>
    </Inventory>
  );
}

export default Products;
