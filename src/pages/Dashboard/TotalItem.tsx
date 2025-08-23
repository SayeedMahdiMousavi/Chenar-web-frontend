import { Card, Statistic, Col } from 'antd';
import React, { Fragment, ReactNode } from 'react';
import { Statistics } from '../../components/antd';
import { checkPermissions } from '../../Functions';

interface IProps {
  bgImage: string;
  icon: ReactNode;
  title: string;
  value: number | string;
  loading: boolean;
  permission: string;
  span?: any;
}
export default function TotalItem(props: IProps) {
  return (
    // <Col span={props?.span ? props?.span : 8}>
    <Card
      className='box'
      // className="dashboard__card"
      loading={props?.loading}
      size='small'
      style={styles.card(props?.bgImage, props?.permission)}
      hoverable={true}
      // type="inner"
      bodyStyle={styles.cardBody}

      // cover={<img alt="example" src={green} />}
    >
      {checkPermissions(props?.permission) && (
        <Fragment>
          <Statistic
            //@ts-ignore
            value={props.title}
            valueStyle={{ color: 'white', fontSize: '15px' }}
            prefix={props.icon}
            style={{ marginBottom: '35px' }}
          />
          <Statistics value={props?.value} valueStyle={styles.statisticValue} />
        </Fragment>
      )}
    </Card>
    // </Col>
  );
}

interface IStyles {
  statisticValue: React.CSSProperties;
  statistic: React.CSSProperties;
  statisticTitle: React.CSSProperties;
  cardBody: React.CSSProperties;
  card: (value: string, permission: string) => React.CSSProperties;
}

const styles: IStyles = {
  statisticValue: {
    color: 'white',
    textAlign: 'end',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  statisticTitle: { color: 'white', fontSize: '15px' },
  statistic: { marginBottom: '35px' },
  card: (bgImage: string, permission: string) => ({
    height: '100px',
    padding: '5px',
    // backgroundImage: `linear-gradient(${
    //   i18n?.language === "en" ? "to right" : "to left"
    // },${props.bgColor},30%,${props.rgbaBgColor})`,

    backgroundImage: checkPermissions(permission) ? `url(${bgImage})` : '',
    backgroundPosition: 'center center',
    backgroundSize: '200%',
    backgroundRepeat: 'no-repeat',
    backgroundColor: checkPermissions(permission) ? 'transparent' : '',
  }),
  cardBody: {
    padding: '4px 7px 0px 7px',
  },
};
