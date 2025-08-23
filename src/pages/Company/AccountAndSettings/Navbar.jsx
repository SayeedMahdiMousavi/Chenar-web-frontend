import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Drawer, Menu } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useMediaQuery } from '../../MediaQurey';
import { connect } from 'react-redux';

const Navbar = (props) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const isTablet = useMediaQuery('(max-width:767px)');
  const isMiniTablet = useMediaQuery('(max-width:575px)');
  const isMobile = useMediaQuery('(max-width:425px)');
  const isMiniMobile = useMediaQuery('(max-width:375px)');

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <div>
      <MenuOutlined
        className='trigger'
        style={{ fontSize: '1.5rem' }}
        onClick={showDrawer}
      />

      <Drawer
        maskClosable={false}
        width={
          isMiniMobile
            ? '60%'
            : isMobile
              ? '52%'
              : isMiniTablet
                ? '44%'
                : isTablet
                  ? '32%'
                  : '30%'
        }
        onClose={onClose}
        open={visible}
        closable={false}
        placement={props.rtl ? 'right' : 'left'}
        bodyStyle={{ padding: '0rem' }}
      >
        <Menu
          mode='vertical'
          theme='light'
          style={{ height: '100vh' }}
          defaultOpenKeys={['1']}
          selectedKeys={[props.current]}
          onClick={props.onClickMenu}
        >
          <Menu.Item
            // className="Account__details__show"
            key='company'
            style={styles.margin}
          >
            {t('Company.1')}
          </Menu.Item>
          <Menu.Item
            key='smtpEmail'
            style={styles.margin}

            // className="Account__details__show"
          >
            {t('Company.SMTP_email')}
          </Menu.Item>
          {/* <Menu.Item
            // className="Account__details__show"
            key="backup"
            style={styles.margin}
          >
            {t("Company.Backup")}
          </Menu.Item> */}
          <Menu.Item
            // className="Account__details__show"
            key='billing'
            style={styles.margin}
          >
            {t('Company.Billing_subscription')}
          </Menu.Item>
          {/* 
          <Menu.Item
            // className="Account__details__show"
            key="period"
            style={styles.margin}
          >
            {t("Company.Financial_period")}
          </Menu.Item> */}
        </Menu>
      </Drawer>
    </div>
  );
};

const styles = { margin: { margin: 0 } };
const mapStateToProps = (state) => ({
  products: state.products.products,
  rtl: state.direction.rtl,
});
export default connect(mapStateToProps)(Navbar);
