import {
  Space,
  Tabs,
  Typography,
  Form,
  Input,
  Row,
  Col,
  Select,
  Button,
  Descriptions,
  Card,
  ConfigProvider,
} from 'antd';
import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { changeGToJ, changeJToG } from '../../Functions/utcDate';
import moment from 'moment';
import { toHijri, toGregorian } from 'hijri-converter';
import { indianToArabic } from '../../Functions/arabicToIndian';
import { useMemo } from 'react';
import { useDarkMode } from '../../Hooks/useDarkMode';
import { Colors } from '../colors';

const { TabPane } = Tabs;
const { Option } = Select;
const dateFormat = 'YYYY/MM/DD';
const datePFormat = 'jYYYY/jM/jD';
export default function ConvertDate() {
  const [mode] = useDarkMode();
  const { t } = useTranslation();
  const [tabKey, setTabKey] = useState('1');
  const [{ jToGregory, jToLunar }, setChangedJallaliDate] = useState({
    jToGregory: '',
    jToLunar: '',
  });
  const [{ gToJallali, gToLunar }, setChangedGregoryDate] = useState({
    gToJallali: '',
    gToLunar: '',
  });
  const [{ tToJallali, tToGregory }, setChangedLunarDate] = useState({
    tToJallali: '',
    tToGregory: '',
  });

  const handleChangeTab = (key: string) => {
    setTabKey(key);
  };
  const button = (
    <Button
      size='small'
      type='primary'
      block
      style={{
        borderRadius: '5px',
        backgroundColor: Colors.primaryColor,
        marginTop: '10px',
        padding: '15px 10px',
      }}
      htmlType='submit'
    >
      {t('Date.Convert')}
    </Button>
  );

  const handleFinish = (values: any) => {
    const key = tabKey;

    if (key === '1') {
      const date = `${values?.jYear}/${values?.jMonth}/${values?.jDay}`;
      const gregoryDate = changeJToG(date, dateFormat);
      const arabicDate = indianToArabic(gregoryDate);
      const splitGregory = arabicDate?.split('/');
      const hijriDate = toHijri(
        parseFloat(splitGregory?.[0]),
        parseFloat(splitGregory?.[1]),
        parseFloat(splitGregory?.[2]),
      );
      setChangedJallaliDate({
        jToGregory: gregoryDate,
        jToLunar: `${hijriDate?.hy}/${hijriDate?.hm}/${hijriDate?.hd}`,
      });
    } else if (key === '2') {
      const date = `${values?.gYear}/${values?.gMonth}/${values?.gDay}`;
      //
      // //@ts-ignore
      //
      const hijriDate = toHijri(
        parseFloat(values?.gYear),
        parseFloat(values?.gMonth),
        parseFloat(values?.gDay),
      );

      setChangedGregoryDate({
        gToJallali: changeGToJ(date, dateFormat, datePFormat),
        gToLunar: `${hijriDate?.hy}/${hijriDate?.hm}/${hijriDate?.hd}`,
      });
    } else if (key === '3') {
      const gregoryDate = toGregorian(
        parseFloat(values?.year),
        parseFloat(values?.month),
        parseFloat(values?.day),
      );
      const newGregoryDate = `${gregoryDate?.gy}/${gregoryDate?.gm}/${gregoryDate?.gd}`;
      setChangedLunarDate({
        tToJallali: changeGToJ(newGregoryDate, dateFormat, datePFormat),
        tToGregory: newGregoryDate,
      });
    }
  };

  const defaultDate = useMemo(() => {
    const newDate = moment().format(dateFormat);
    const gregoryDate = newDate?.split('/');

    const newJalaliDate = changeGToJ(
      moment().format(dateFormat),
      dateFormat,
      datePFormat,
    );
    const jallaliDate = newJalaliDate?.split('/');

    const arabicDate = indianToArabic(newDate);
    const splitGregory = arabicDate?.split('/');
    const hijriDate = toHijri(
      parseFloat(splitGregory?.[0]),
      parseFloat(splitGregory?.[1]),
      parseFloat(splitGregory?.[2]),
    );

    const hijri = `${hijriDate?.hy}/${hijriDate?.hm}/${hijriDate?.hd}`;
    return {
      jallali: {
        date: newJalaliDate,
        year: jallaliDate?.[0],
        month: jallaliDate?.[1],
        day: jallaliDate?.[2],
      },
      gregory: {
        date: newDate,
        year: gregoryDate?.[0],
        month: gregoryDate?.[1],
        day: gregoryDate?.[2],
      },
      hijri: {
        date: hijri,
        year: hijriDate?.hy,
        month: hijriDate?.hm,
        day: hijriDate?.hd,
      },
    };
  }, []);

  const bordered = mode === 'dark' ? true : false;
  const inputClassName = `Input__${mode}--borderLess`;
  return (
    <Card
      className='box'
      size='small'
      hoverable={mode === 'dark' ? false : true}
      style={{
        borderRadius: '10px',
        border: bordered ? '1px solid #303030' : '1px solid #e8e8e8',
        backgroundColor: mode === 'dark' ? Colors.cardBg : Colors.white,
        color: mode === 'dark' ? Colors.white : 'black',
      }}
      bodyStyle={{
        padding: '0px',
      }}
    >
      <Space direction='vertical' size='small'>
        <Typography.Text
          strong={true}
          style={{
            fontSize: '14px',
            color: mode === 'dark' ? Colors.white : 'black ',
          }}
        >
          {t('Date.Convert_dates')}
        </Typography.Text>
        <Form
          onFinish={handleFinish}
          initialValues={{
            gYear: defaultDate?.gregory?.year,
            gMonth: defaultDate?.gregory?.month,
            gDay: defaultDate?.gregory?.day,
            jYear: defaultDate?.jallali?.year,
            jMonth: defaultDate?.jallali?.month,
            jDay: defaultDate?.jallali?.day,
            year: defaultDate?.hijri?.year,
            month: `${defaultDate?.hijri?.month}`,
            day: defaultDate?.hijri?.day,
          }}
        >
          <ConfigProvider
            theme={{
              components: {
                Tabs: {
                  itemSelectedColor: Colors.primaryColor,
                  inkBarColor: Colors.primaryColor,
                  colorText: mode === 'dark' ? Colors.white : 'black',
                  itemHoverColor: Colors.primaryColor,
                },
              },
            }}
          >
            <Tabs
              // defaultActiveKey="1"
              activeKey={tabKey}
              onChange={handleChangeTab}
              tabBarStyle={{
                fontSize: '10px',
              }}
              className='ant__tabs'
              size='small'
              centered
              tabBarGutter={0}
            >
              <TabPane tab={t('Date.Jallali')} key='1'>
                <Row gutter={7}>
                  <Col span={7}>
                    <Form.Item style={styles.formItem} name='jYear'>
                      <Input
                        className={inputClassName}
                        bordered={bordered}
                        placeholder={t('Date.Year')}
                        minLength={4}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item style={styles.formItem} name='jMonth'>
                      <Select
                        className={`num ${inputClassName}`}
                        bordered={bordered}
                        placeholder={t('Date.Month')}
                      >
                        <Option value='1'>{t('Date.Hamal')}</Option>
                        <Option value='2'>{t('Date.Sawr')}</Option>
                        <Option value='3'>{t('Date.Jawza')}</Option>
                        <Option value='4'>{t('Date.Saratan')}</Option>
                        <Option value='5'>{t('Date.Asad')}</Option>
                        <Option value='6'>{t('Date.Sunbula')}</Option>
                        <Option value='7'>{t('Date.Mizan')}</Option>
                        <Option value='8'>{t('Date.Aqrab')}</Option>
                        <Option value='9'>{t('Date.Qaws')}</Option>
                        <Option value='10'>{t('Date.jaddi')}</Option>
                        <Option value='11'>{t('Date.Dalwa')}</Option>
                        <Option value='12'>{t('Date.Hout')}</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item style={styles.formItem} name='jDay'>
                      <Select
                        className={`num ${inputClassName}`}
                        bordered={bordered}
                        placeholder={t('Date.Day')}
                      >
                        {new Array(30).fill(null)?.map((_, index) => (
                          <Option value={`${index + 1}`} key={index + 1}>
                            {index + 1}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Descriptions
                  // column={{ xxl: 2, xl: 1, lg: 1, md: 1, sm: 1 }}
                  column={1}
                  size='small'
                  style={{
                    marginTop: '10px',
                    color: mode === 'dark' ? Colors.white : 'white',
                  }}
                >
                  <Descriptions.Item
                    label={
                      <span
                        style={{ color: mode === 'dark' ? 'white' : '#aaa' }}
                      >
                        {t('Date.Gregory')}
                      </span>
                    }
                  >
                    <span
                      style={{ color: mode === 'dark' ? 'white' : 'black' }}
                    >
                      {Boolean(jToGregory)
                        ? jToGregory
                        : defaultDate?.gregory?.date}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={
                      <span
                        style={{ color: mode === 'dark' ? 'white' : '#aaa' }}
                      >
                        {t('Date.Lunar')}
                      </span>
                    }
                  >
                    <span
                      style={{ color: mode === 'dark' ? 'white' : 'black' }}
                    >
                      {Boolean(jToLunar) ? jToLunar : defaultDate?.hijri?.date}
                    </span>
                  </Descriptions.Item>
                </Descriptions>
                {button}
              </TabPane>
              <TabPane tab={t('Date.Gregory')} key='2'>
                <Row gutter={7}>
                  <Col span={7}>
                    <Form.Item style={styles.formItem} name='gYear'>
                      <Input
                        className={inputClassName}
                        bordered={bordered}
                        placeholder={t('Date.Year')}
                        minLength={4}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item style={styles.formItem} name='gMonth'>
                      <Select
                        className={`num ${inputClassName}`}
                        bordered={bordered}
                        placeholder={t('Date.Month')}
                      >
                        <Option value='01'>{t('Date.January')}</Option>
                        <Option value='02'>{t('Date.February')}</Option>
                        <Option value='03'>{t('Date.March')}</Option>
                        <Option value='04'>{t('Date.April')}</Option>
                        <Option value='05'>{t('Date.May')}</Option>
                        <Option value='06'>{t('Date.June')}</Option>
                        <Option value='07'>{t('Date.July')}</Option>
                        <Option value='08'>{t('Date.August')}</Option>
                        <Option value='09'>{t('Date.September')}</Option>
                        <Option value='10'>{t('Date.October')}</Option>
                        <Option value='11'>{t('Date.November')}</Option>
                        <Option value='12'>{t('Date.December')}</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item style={styles.formItem} name='gDay'>
                      <Select
                        className={`num ${inputClassName}`}
                        bordered={bordered}
                        placeholder={t('Date.Day')}
                      >
                        {new Array(31).fill(null)?.map((_, index) => (
                          <Option value={`${index + 1}`} key={index + 1}>
                            {index + 1}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Descriptions
                  column={1}
                  size='small'
                  style={{ marginTop: '10px' }}
                >
                  <Descriptions.Item
                    label={
                      <span
                        style={{ color: mode === 'dark' ? 'white' : '#aaa' }}
                      >
                        {t('Date.Jallali')}
                      </span>
                    }
                  >
                    <span
                      style={{ color: mode === 'dark' ? 'white' : 'black' }}
                    >
                      {Boolean(gToJallali)
                        ? gToJallali
                        : defaultDate?.jallali?.date}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={
                      <span
                        style={{ color: mode === 'dark' ? 'white' : '#aaa' }}
                      >
                        {t('Date.Lunar')}
                      </span>
                    }
                  >
                    <span
                      style={{ color: mode === 'dark' ? 'white' : 'black' }}
                    >
                      {Boolean(gToLunar) ? gToLunar : defaultDate?.hijri?.date}
                    </span>
                  </Descriptions.Item>
                </Descriptions>

                {/* <Row
                justify="space-around"
                align="middle"
                style={{ height: "40px" }}
              >
                <Col>
                  {t("Date.Jallali")} :{" "}
                  {Boolean(gToJallali) ? gToJallali : newJalaliDate}
                </Col>
                <Col>
                  {t("Date.Lunar")} :{" "}
                  {Boolean(gToLunar) ? gToLunar : newJalaliDate}
                </Col>
              </Row> */}
                {button}
              </TabPane>
              <TabPane tab={t('Date.Lunar')} key='3'>
                <Row gutter={7}>
                  <Col span={7}>
                    <Form.Item style={styles.formItem} name='year'>
                      <Input
                        className={inputClassName}
                        bordered={bordered}
                        placeholder={t('Date.Year')}
                        minLength={4}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item style={styles.formItem} name='month'>
                      <Select
                        className={`num ${inputClassName}`}
                        bordered={bordered}
                        placeholder={t('Date.Month')}
                      >
                        <Option value='1'>{t('Date.Muharram')}</Option>
                        <Option value='2'>{t('Date.Safar')}</Option>
                        <Option value='3'>{t('Date.Rabi_al-Awwal')}</Option>
                        <Option value='4'>{t('Date.Rabi_ath-Thani')}</Option>
                        <Option value='5'>{t('Date.jumada_I-Ula')}</Option>
                        <Option value='6'>{t('Date.Jumada_t-Tania')}</Option>
                        <Option value='7'>{t('Date.Rajab')}</Option>
                        <Option value='8'>{t('Date.Shaban')}</Option>
                        <Option value='9'>{t('Date.Ramadan')}</Option>
                        <Option value='10'>{t('Date.Shawwal')}</Option>
                        <Option value='11'>{t('Date.Dhu_I-Qada')}</Option>
                        <Option value='12'>{t('Date.Dhu_I-Hijja')}</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item style={styles.formItem} name='day'>
                      <Select
                        className={`num ${inputClassName}`}
                        bordered={bordered}
                        placeholder={t('Date.Day')}
                      >
                        {new Array(29).fill(null)?.map((_, index) => (
                          <Option value={index + 1} key={index + 1}>
                            {index + 1}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Descriptions
                  column={1}
                  size='small'
                  style={{ marginTop: '10px' }}
                >
                  <Descriptions.Item
                    label={
                      <span
                        style={{ color: mode === 'dark' ? 'white' : '#aaa' }}
                      >
                        {t('Date.Jallali')}
                      </span>
                    }
                  >
                    <span
                      style={{ color: mode === 'dark' ? 'white' : 'black' }}
                    >
                      {tToJallali ? tToJallali : defaultDate?.jallali?.date}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={
                      <span
                        style={{ color: mode === 'dark' ? 'white' : '#aaa' }}
                      >
                        {t('Date.Gregory')}
                      </span>
                    }
                  >
                    <span
                      style={{ color: mode === 'dark' ? 'white' : 'black' }}
                    >
                      {Boolean(tToGregory)
                        ? tToGregory
                        : defaultDate?.gregory?.date}
                    </span>
                  </Descriptions.Item>
                </Descriptions>

                {button}
              </TabPane>
            </Tabs>
          </ConfigProvider>
        </Form>
      </Space>
    </Card>
  );
}

const styles = {
  formItem: {
    marginBottom: '0px',
  },
};
