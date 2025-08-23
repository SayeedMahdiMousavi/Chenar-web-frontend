import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Row, Col, Menu } from 'antd';
import { useDarkMode } from '../../Hooks/useDarkMode';

const Navbar = () => {
  const { t } = useTranslation();
  const [mode] = useDarkMode();
  const location = useLocation();

  return (
    <Row>
      <Col span={24}>
        <Menu
          theme='light'
          mode='horizontal'
          selectedKeys={[location.pathname]}
          // className="sub_nave"
          className={`navbar__${mode}`}
        >
          <Menu.Item key='/open-accounts'>
            <Link to='/open-accounts'>{t('Opening_accounts.1')}</Link>
          </Menu.Item>

          <Menu.Item key='/inventory'>
            <Link to='/inventory'>
              {t('Sales.Product_and_services.Inventory.1')}
            </Link>
          </Menu.Item>
        </Menu>
      </Col>
    </Row>
  );
};
export default Navbar;
