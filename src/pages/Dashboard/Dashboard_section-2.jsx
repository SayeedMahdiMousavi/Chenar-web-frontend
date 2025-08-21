import React from 'react';
import ImageOne from './image-1.jpg';
// import ImageTwo from "./image-2.jpg";
import ImageThree from './svg/001-cocktail.svg';
// import ImageThree from "./svg/SvgBook.svg";
import ImageFour from './svg/002-french-fries.svg';
import ImageFive from './svg/003-car.svg';
import ImageSIx from './svg/004-exchange.svg';
import { Table, Row, Col, PageHeader } from 'antd';
import { useMediaQuery } from '../MediaQurey';
import Avatar from 'antd/lib/avatar/avatar';
const columns = [
  {
    title: 'First Name',
    dataIndex: 'name',
    render: (text) => <a>{text}</a>,
    className: 'table-col',
  },
  {
    title: 'Last Name',
    className: 'column-money',
    dataIndex: 'last_name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    className: 'table-col',
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    last_name: '￥300,000.00',
    age: 'New York No.',
  },
  {
    key: '2',
    name: 'Jim Green',
    last_name: '￥1,256,000.00',
    age: 'London No.',
  },
  {
    key: '3',
    name: 'Joe Black',
    last_name: '￥120,000.00',
    age: 'Sidney No. ',
  },
];

const Activities = [
  {
    img: ImageThree,
    text: 'Serv Estin-pub-piata Mica',
    span: '31 july 2019, 11:08PM',
    textTwo: '120 RON',
  },
  {
    img: ImageSIx,
    text: 'Serv Estin-pub-piata Mica',
    span: '31 july 2019, 11:08PM',
    textTwo: '120 RON',
  },
  {
    img: ImageFive,
    text: 'Serv Estin-pub-piata Mica',
    span: '31 july 2019, 11:08PM',
    textTwo: '120 RON',
  },
  {
    img: ImageFour,
    text: 'Serv Estin-pub-piata Mica',
    span: '31 july 2019, 11:08PM',
    textTwo: '120 RON',
  },
];

const photos = [
  'sh',
  'eh',
  'ka',
  'ja',
  ImageOne,
  ImageThree,
  ImageSIx,
  ImageFive,
  ImageFour,
];
const DashboardSectionTwo = () => {
  const isMobile = useMediaQuery('(max-width:425px)');
  return (
    <Row className='content-container-1' justify='space-around'>
      <Col xl={13} md={22} xs={22} className='content-container-2'>
        <PageHeader
          className='site-page-header content-container-2__title'
          title='Activity'
        />
        <div className='content-container-2__content'>
          <div className='content-container-2__content-1'>
            {Activities?.map((activiy, index) => {
              return (
                <div className='fixed-container' key={index}>
                  <div className='fixed-container-1'>
                    <div className='image'>
                      <img src={activiy.img} className='image' />
                    </div>
                    <div className='activity' key={index}>
                      <p className='text'>
                        {activiy.text} <br />
                        <span className='span'>{activiy.span}</span>
                      </p>
                    </div>
                  </div>
                  <div className='ron' key={index}>
                    <p className='textTwo'>{activiy.textTwo}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Col>
      <Col xl={9} md={22} xs={22}>
        <div className='content-container-1__content'>
          <Table
            columns={columns}
            dataSource={data}
            size={isMobile ? 'small' : 'large'}
            title={() => (
              <span className='content-container-1__h2'>
                {' '}
                Account Watchlist
              </span>
            )}
            pagination={false}
          />
        </div>
        <Row className='content-container-1__content-2'>
          <Col span={24}>
            <Row>
              <Col span={24}>
                <h2>COLLEGUES</h2>
              </Col>
            </Row>
            <Row align='middle' gutter={10}>
              <Avatar.Group
                maxCount={5}
                size={{ xxl: 60, xl: 55 }}
                maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
              >
                {photos?.map((item) => (
                  <Avatar key={item} src={`${item}`}>
                    {item}{' '}
                  </Avatar>
                ))}
              </Avatar.Group>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default DashboardSectionTwo;
