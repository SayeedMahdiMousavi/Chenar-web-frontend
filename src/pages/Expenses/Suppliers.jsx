import React from 'react';
import { Title } from '../SelfComponents/Title';
import AddSupplier from './Suppliers/AddSupplier';
import { useTranslation } from 'react-i18next';
import { Row, Col, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '../MediaQurey';
import SuppliersTable from './Suppliers/SuppliersTable';
// import ImportSuppliers from "./Suppliers/ImportSuppliers";
import InventoryNavbar from '../sales/Navbar';
import { checkPermissionsModel } from '../../Functions';
import {
  SUPPLIER_CATEGORY_M,
  SUPPLIER_M,
  SUPPLIER_PAY_REC_M,
} from '../../constants/permissions';
import { PageMoreButton } from '../../components';
import ContactsNavbar from '../Employees/Navbar';
// import ButtonWithDropdown from "../SelfComponents/ButtonWithDropdown";

const baseUrl = '/supplier_account/supplier/';
function Suppliers() {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width:425px)');
  const isMiniMobile = useMediaQuery('(max-width:375px)');
  const isMiniTablet = useMediaQuery('(max-width:485px)');

  // const imp = (
  //   <Menu>
  //     <Menu.Item key="1">
  //       <ImportSuppliers />
  //     </Menu.Item>
  //   </Menu>
  // );

  const menu = (
    <Menu>
      {checkPermissionsModel(SUPPLIER_CATEGORY_M) && (
        <Menu.Item key='1'>
          <Link to='/supplier-categories'>
            {t('Sales.Product_and_services.Categories.1')}
          </Link>
        </Menu.Item>
      )}
      {checkPermissionsModel(SUPPLIER_PAY_REC_M) && (
        <Menu.Item key='2'>
          <Link to='/supplier-payAndReceive_cash'>
            {t('Employees.Pay_and_receive_cash')}
          </Link>
        </Menu.Item>
      )}
    </Menu>
  );
  return (
    <>
      <ContactsNavbar />

      <Row className='Sales__content-3' align='middle' justify='start'>
        <Col
          xl={{ span: 7 }}
          md={{ span: 8 }}
          sm={{ span: 10 }}
          xs={{ span: 13 }}
        >
          <Title value={t('Expenses.Suppliers.1')} model={SUPPLIER_M} />
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
                permissions={[SUPPLIER_M, SUPPLIER_CATEGORY_M]}
                overlay={menu}
              />
            </Col>
            <Col xl={13} md={12} sm={13} xs={24}>
              <AddSupplier baseUrl={baseUrl} />
              {/* <ButtonWithDropdown
                          button={<AddSupplier />}
                          menu={imp}
                        /> */}
            </Col>
          </Row>
        </Col>
      </Row>

      {checkPermissionsModel(SUPPLIER_M) && (
        <SuppliersTable baseUrl={baseUrl} />
      )}
    </>
  );
}

export default Suppliers;
