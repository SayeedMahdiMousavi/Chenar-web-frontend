import React, { useState } from 'react';
import { useMediaQuery } from '../../../MediaQurey';
import { useTranslation } from 'react-i18next';
import { EditOutlined } from '@ant-design/icons';
import {
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  Typography,
  AutoComplete,
} from 'antd';

const { Option } = Select;
const { Text } = Typography;
export default function EditContactInfo(props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);
  const isTablet = useMediaQuery('(max-width: 575px)');
  const isMobile = useMediaQuery('(max-width: 425px)');

  const onInfoClick = () => {
    props.setType(false);
    props.setAddress(false);
    props.setName(false);
    props.setInfo(true);
  };
  //website
  const onWebsiteChange = (value) => {
    if (!value) {
      setAutoCompleteResult([]);
    } else {
      setAutoCompleteResult(
        ['.com', '.org', '.net']?.map((domain) => `${value}${domain}`)
      );
    }
  };
  const websiteOptions = autoCompleteResult?.map((website) => ({
    label: website,
    value: website,
  }));

  //phone number prefex
  const prefixSelector = (
    <Form.Item name='prefix' noStyle>
      <Select style={{ width: 50 }} defaultValue='+93' showarrow={false}>
        <Option value='+93'>+93</Option>
        <Option value='+87'>+85</Option>
      </Select>
    </Form.Item>
  );
  const cancel = () => {
    props.setInfo(false);
  };
  const onFinish = () => {};
  return (
    <div>
      {props.info ? (
        <Form form={form} onFinish={onFinish}>
          <Row className=' account_setting_drawer_name' gutter={[5, 15]}>
            <Col lg={5} sm={6} xs={24} style={styles.title(isTablet)}>
              {' '}
              <Text strong={true}> {t('Company.Contact_info')}</Text>
            </Col>
            <Col lg={7} sm={8} xs={isMobile ? 24 : 10}>
              {' '}
              <Text strong={true}> {t('Company.Company_email')}</Text>
              <br />
              <Text type='secondary'>
                {t('Company.Company_email_description')}
              </Text>
            </Col>
            <Col lg={7} sm={9} xs={isMobile ? 24 : 12}>
              <Form.Item
                name='email'
                style={styles.margin}
                rules={[
                  {
                    type: 'email',
                    message: `${t('Form.Email_Message')}`,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col lg={5} sm={1} xs={isMobile ? 0 : 2}></Col>
            <Col lg={5} sm={6} xs={0}></Col>

            <Col lg={5} sm={1} xs={isMobile ? 0 : 2}></Col>
            <Col lg={5} sm={6} xs={0}></Col>
            <Col lg={7} sm={8} xs={isMobile ? 24 : 10}>
              <Text strong={true}> {t('Company.Company_phone')}</Text>
              <br />
              <Text type='secondary'>
                {t('Company.Company_phone_description')}
              </Text>
            </Col>
            <Col lg={7} sm={9} xs={isMobile ? 24 : 12}>
              {' '}
              <Form.Item name='phone' style={styles.margin} rules={[]}>
                <Input addonBefore={prefixSelector} maxLength={10} />
              </Form.Item>
            </Col>
            <Col lg={5} sm={1} xs={isMobile ? 0 : 2}></Col>
            <Col lg={5} sm={6} xs={0}></Col>
            <Col lg={7} sm={8} xs={isMobile ? 24 : 10}>
              {' '}
              <Text strong={true}>{t('Form.Website')}</Text>
              <br />
              <Text type='secondary'>{t('Company.Website_description')}</Text>
            </Col>
            <Col lg={7} sm={9} xs={isMobile ? 24 : 12}>
              <Form.Item name='website' style={styles.margin}>
                <AutoComplete
                  options={websiteOptions}
                  onChange={onWebsiteChange}
                >
                  <Input />
                </AutoComplete>
              </Form.Item>
            </Col>
            <Col lg={12} sm={14} xs={isMobile ? 0 : 10}></Col>
            <Col lg={12} sm={10} xs={isMobile ? 24 : 10}>
              <Button htmlType='button' shape='round' onClick={cancel}>
                {t('Form.Cancel')}
              </Button>{' '}
              <Button
                type='primary'
                shape='round'
                htmlType='submit'
                style={styles.cancel}
              >
                {t('Form.Save')}
              </Button>
            </Col>
          </Row>
        </Form>
      ) : (
        <Row
          className='account_setting_drawer_hover line_height account_setting_drawer_name'
          onClick={onInfoClick}
        >
          <Col lg={5} sm={6} xs={24}>
            {' '}
            <Text strong={true}>{t('Company.Contact_info')}</Text>
          </Col>
          <Col lg={7} sm={8} xs={10}>
            {' '}
            <Text> {t('Company.Company_email')}</Text>
            <br />
            {/* <Text>{t("Company.Customer-facing_email")}</Text>
            <br /> */}
            <Text> {t('Company.Company_phone')}</Text>
            <br />
            <Text> {t('Form.Website')}</Text>
          </Col>
          <Col lg={12} sm={10} xs={14}>
            <Row justify='space-between'>
              <Col>
                {' '}
                <Text> {props.data?.email}</Text>
                <br />
                {/* <Text> Same as company email</Text>
                <br /> */}
                <Text> {props.data?.phone}</Text>
                <br />
                <Text> {props.data?.website}</Text>
              </Col>
              <Col>
                <EditOutlined className='font' />
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </div>
  );
}

const styles = {
  margin: { margin: '0rem' },
  cancel: { margin: '10px 10px' },
  title: (isTablet) => ({
    textAlign: isTablet ? 'center' : '',
    padding: isTablet ? '23px 0px 23px 0px' : '',
  }),
};
