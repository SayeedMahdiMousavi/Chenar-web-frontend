import React, { useState } from 'react';
import { Layout, Row, Col, Radio, Space, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import { Title } from '../SelfComponents/Title';
import DashboardBody from './DashboardBody';
import { useDarkMode } from '../../Hooks/useDarkMode';
import { Colors } from '../colors';

export default () => {
  const { t } = useTranslation();
  const [mode] = useDarkMode();
  const [durationState, setLineChartSelectState] = useState('daily');

  function onChange(e: any) {
    setLineChartSelectState(e.target.value);
  }

  const getButtonStyle = (value: string) => ({
    ...styles.radioButton,
    backgroundColor:
      value === durationState ? Colors.primaryColor : 'transparent',
    color:
      value === durationState
        ? '#fff'
        : mode === 'dark'
          ? '#fff'
          : Colors.primaryDarkBackground,
    border: 'none',
  });

  return (
    <div>
      <Row
        style={{ height: '80px', margin: '1rem 0' }}
        align='middle'
        justify='space-between'
      >
        <Col sm={24} md={6}>
          <Row>
            <Col span={24}>
              <Title value={t('Dashboard.1')} />
            </Col>
          </Row>
        </Col>
        <Col sm={24} md={12}>
          <Row justify='center' align='middle'>
            <Col>
              <Space size='middle'>
                <Radio.Group
                  onChange={onChange}
                  defaultValue='daily'
                  buttonStyle='solid'
                  style={styles.radioGroup(mode)}
                >
                  <Radio.Button value='daily' style={getButtonStyle('daily')}>
                    {t('Date.Daily')}
                  </Radio.Button>
                  <Divider type='vertical' style={styles.divider} />
                  <Radio.Button value='weekly' style={getButtonStyle('weekly')}>
                    {t('Date.Weekly')}
                  </Radio.Button>
                  <Divider type='vertical' style={styles.divider} />
                  <Radio.Button
                    value='monthly'
                    style={getButtonStyle('monthly')}
                  >
                    {t('Date.Monthly')}
                  </Radio.Button>
                </Radio.Group>
              </Space>
            </Col>
          </Row>
        </Col>
        <Col sm={24} md={6}></Col>
      </Row>
      <DashboardBody duration={durationState} />
    </div>
  );
};

const styles = {
  radioButton: {
    borderRadius: '30px',
    border: 'none',
    height: '32px',
    lineHeight: '32px',
  },
  radioGroup: (mode: string) => ({
    padding: '5px',
    borderRadius: '60px',
    border: '1px solid dimgray',
    backgroundColor: mode === 'dark' ? Colors.cardBg : '#fff',
  }),
  divider: {
    margin: '0px 5px',
    height: '20px',
    backgroundColor: 'dimgray',
  },
};
