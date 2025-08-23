import React from 'react';
import { Row, Col, Select, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';

import { handlePrepareDateForServer } from '../../../Functions/utcDate';
import useGetCalender from '../../../Hooks/useGetCalender';
import { ApplyButton, ResetButton } from '../../../components';

interface IProps {
  setVisible: (value: boolean) => void;
  setFilters: (value: any) => void;

  setPage: (value: number) => void;
}

export function LoginAuditingFilters(props: IProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  const onFinish = async (values: any) => {
    const startDate = handlePrepareDateForServer({
      date: values?.dateTime?.[0],
      calendarCode,
    });
    const endDate = handlePrepareDateForServer({
      date: values?.dateTime?.[1],
      calendarCode,
    });

    const device = values?.device ?? '';

    props.setFilters({
      loginStatus: values?.loginStatus ?? '',
      browser: values?.browser ?? '',
      os: values?.os ?? '',
      ip: values?.ip ?? '',
      isMobile: device === 'isMobile' ? true : '',
      isPC: device === 'isPC' ? true : '',
      isTablet: device === 'isTablet' ? true : '',
      isTouchable: device === 'isTouchable' ? true : '',
      isBot: device === 'isBot' ? true : '',
      startDate: startDate ?? '',
      endDate: endDate ?? '',
    });

    props.setVisible(false);
    props.setPage(1);
  };
  const onReset = () => {
    form.resetFields();
    props.setFilters({
      loginStatus: '',
      browser: '',
      os: '',
      ip: '',
      isMobile: '',
      isPC: '',
      isTablet: '',
      isTouchable: '',
      isBot: '',
      startDate: '',
      endDate: '',
    });
    props.setVisible(false);
  };

  return (
    <Form layout='vertical' onFinish={onFinish} form={form} style={styles.form}>
      <Row gutter={[10, 10]}>
        {/* <Col span={12}>
          <Form.Item
            name="device"
            label={t("Auditing.User_device")}
            style={styles.margin}
          >
            <Select className="num " showSearch showArrow allowClear>
              <Select.Option key="isPc" value="isPc">
                {t("Auditing.Is_computer")}
              </Select.Option>
              <Select.Option key="isTablet" value="isTablet">
                {t("Auditing.Is_tablet")}
              </Select.Option>
              <Select.Option key="isMobile" value="isMobile">
                {t("Auditing.Is_mobile")}
              </Select.Option>
              <Select.Option key="isBot" value="isBot">
                {t("Auditing.Is_bot")}
              </Select.Option>
            </Select>
          </Form.Item>
        </Col> */}
        <Col span={12}>
          <Form.Item
            name='loginStatus'
            label={t('Auditing.Login_type')}
            style={styles.margin}
          >
            <Select className='num ' showSearch showArrow allowClear>
              <Select.Option key='login' value='login'>
                {t('Auditing.Login')}
              </Select.Option>
              <Select.Option key='logout' value='logout'>
                {t('Auditing.Logout')}
              </Select.Option>
              <Select.Option key='failed_login' value='failed_login'>
                {t('Auditing.Failed_login')}
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='os'
            label={t('Auditing.Operating_system')}
            style={styles.margin}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='browser'
            label={t('Auditing.Browser')}
            style={styles.margin}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name='ip' label={t('Auditing.IP')} style={styles.margin}>
            <Input />
          </Form.Item>
        </Col>
        {/* <Col span={24}>
          <RangePickerFormItem
            showTime={true}
            placeholder={["", ""]}
            format="YYYY-MM-DD HH:mm"
            rules={[]}
            name="dateTime"
            label={
              <Row className="num" style={{ height: "20px" }}>
                <Col span={13}>{t("Expenses.Table.Start")}</Col>
                <Col span={11}>{t("Expenses.Table.End")}</Col>
              </Row>
            }
            style={styles.margin}
          />
        </Col> */}

        <Col span={24}>
          <Form.Item style={styles.margin}>
            <Row className='num' justify='space-between'>
              <Col>
                <ResetButton onClick={onReset} />
              </Col>
              <Col>
                <ApplyButton />
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
const styles = {
  margin: { marginBottom: '8px' },
  form: { width: '370px' },
  spin: { margin: '20px' },
};
