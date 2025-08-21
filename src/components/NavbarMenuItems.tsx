import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Row, Col, Menu, Affix, Layout } from 'antd';
import { useDarkMode } from '../Hooks/useDarkMode';

interface IProps {
  menuItems: { route: string; name: string; model: string[] }[];
  onMouseEnter: () => any;
}

export const NavbarMenuItems = (props: IProps) => {
  const [mode] = useDarkMode();
  const location = useLocation();

  return (
    <Affix
      offsetTop={0}
      target={() => document.getElementById('mainComponent')}
    >
      <Layout>
        <Row>
          <Col>
            <Menu
              theme='light'
              mode='horizontal'
              selectedKeys={[location.pathname]}
              // className="table-col sub_nave"
              className={`navbar__${mode}`}
              onMouseEnter={props?.onMouseEnter}
            >
              {props?.menuItems?.map((item, index) => {
                return (
                  <Menu.Item
                    key={item?.route}
                    style={
                      props?.menuItems.length === 1
                        ? { ...styles.firstMenuItem, ...styles.lastMenuItem }
                        : index === 0
                        ? styles.firstMenuItem
                        : index === props?.menuItems?.length - 1
                        ? styles.lastMenuItem
                        : {}
                    }
                  >
                    <Link to={item?.route}>{item?.name}</Link>
                  </Menu.Item>
                );
              })}
            </Menu>
          </Col>
        </Row>
      </Layout>
    </Affix>
  );
};

const styles = {
  lastMenuItem: { marginInlineEnd: '0px' },
  firstMenuItem: { marginInlineStart: '0px' },
};
