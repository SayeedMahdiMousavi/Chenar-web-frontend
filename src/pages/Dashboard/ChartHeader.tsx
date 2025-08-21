import React from 'react';
import { Row, Col, Statistic, Select } from 'antd';
import { Colors } from '../colors';
import { CaretUpOutlined, DownOutlined } from '@ant-design/icons';
import { Statistics } from '../../components/antd';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const ChartHeader = (props: any) => {
  const { t } = useTranslation();

  const handleChange = (value: string) => {
    // console.log(`selected ${value}`);
    props.handleGetSelectValue(value);
  };
  return (
    <Row
      className='Detail'
      justify='space-between'
      style={styles.chartHeader}
      align='middle'
    >
      <Col>
        {/* <Statistic
          //@ts-ignore
          value={props.title}
          valueStyle={styles.statisticTitle}
          suffix={<DownOutlined style={styles.suffixIcon} />}
        /> */}
        <Select
          defaultValue='Sales'
          style={{
            width: 120,
            zIndex: 100,
            border: '1px solid #d9d9d9',
            borderRadius: '5px',
          }}
          // disabled
          bordered={false}
          onChange={handleChange}
        >
          <Option value='Sales'>{t('Sales.1')}</Option>
          <Option value='Purchases'>{t('Dashboard.Purchases')}</Option>
          <Option value='Revenue'>{t('Dashboard.Revenue')}</Option>
          <Option value='Expenses'>{t('Dashboard.Expenses')}</Option>
        </Select>
      </Col>
      <Col>
        {props?.title} : {props?.value}
      </Col>
      {/* <Col>
        <Statistics
          value={props?.value}
          valueStyle={styles.statisticValue}
          prefix={<CaretUpOutlined />}
        />
      </Col> */}
    </Row>
  );
};

interface IStyles {
  statisticValue: React.CSSProperties;
  suffixIcon: React.CSSProperties;
  statisticTitle: React.CSSProperties;
  chartHeader: React.CSSProperties;
}

const styles: IStyles = {
  statisticValue: {
    color: Colors.primaryColor,
    textAlign: 'end',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  suffixIcon: { fontSize: '11px' },
  statisticTitle: { fontSize: '17px' },
  chartHeader: {
    height: '40px',
    paddingInline: '3px 27px',
  },
};

export default ChartHeader;
