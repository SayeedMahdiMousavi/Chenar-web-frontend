import React from 'react';
import { Row, Col, Spin } from 'antd';

interface IProps {
  size: 'small' | 'large' | 'default' | undefined;
  style?: React.CSSProperties;
}
export const CenteredSpin: React.FC<IProps> = (props) => {
  return (
    <Row
      justify='center'
      align='middle'
      style={{ margin: '20px', ...props.style }}
    >
      <Col>
        <Spin size={props.size} />
      </Col>
    </Row>
  );
};
