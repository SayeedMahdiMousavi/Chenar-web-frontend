import React from 'react';
import { Row, Col } from 'antd';
const Details = (props) => {
  return (
    <Row className='Detail'>
      <Col span={24}>
        <Row align='bottom' className='Detail__income'>
          <Col offset={1} span={23}>
            income
          </Col>
        </Row>

        <Row className='Detail__content' align='middle'>
          <Col offset={1} span={18}>
            <p className='Detail__p'>
              {props.income}
              <span className='Detail__span'>AFN</span>
            </p>
          </Col>
          <Col offset={0} span={5}>
            <p className='Detail__p1'>
              {props.week} <br /> <span className=''>this week</span>
            </p>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Details;
