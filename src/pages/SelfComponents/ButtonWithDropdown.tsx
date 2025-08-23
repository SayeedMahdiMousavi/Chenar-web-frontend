import React, { ReactNode } from 'react';
import { Col, Divider, Row, Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';
import { DownOutlined } from '@ant-design/icons';
import { Colors } from '../colors';

interface IProps {
  button: ReactNode;
  menu: any;
}
export default function ButtonWithDropdown(props: IProps) {
  const { i18n } = useTranslation();
  return (
    <Row>
      <Col xl={17} md={17} sm={17} xs={17}>
        {props.button}
      </Col>
      <Col>
        {' '}
        <Divider type='vertical' style={styles.divider} />
      </Col>

      <Col sm={6} xs={6}>
        <Dropdown overlay={props.menu} trigger={['click']}>
          <button
            className='button__new'
            style={i18n.language === 'en' ? styles.newDrop : styles.newDrop1}
          >
            <DownOutlined />
          </button>
        </Dropdown>
      </Col>
    </Row>
  );
}
const styles = {
  newDrop: {
    width: '100%',
    height: '100%',
    borderRadius: '0px 50px 50px 0px',
  },
  newDrop1: {
    width: '100%',
    height: '100%',
    borderRadius: '50px 0px 0px 50px',
  },
  divider: {
    height: '100%',
    margin: '0px',
    background: Colors.buttonDividerColor,
  },
};
