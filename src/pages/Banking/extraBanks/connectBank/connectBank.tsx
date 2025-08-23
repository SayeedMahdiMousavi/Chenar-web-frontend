import React, { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import {
  AirPayIcon,
  GrabPayIcon,
  IconVisa,
  LineIconIcon,
  MasterCartIcon,
  OnePayIcon,
  PaypalIcon,
  VnptMoneyIcon,
} from '../../../../icons';
import { useMediaQuery } from '../../../MediaQurey';
import { useTranslation } from 'react-i18next';

const ConnectBank = () => {
  const { t } = useTranslation();
  const isTablet = useMediaQuery('(max-width:768px)');
  const isMobile = useMediaQuery('(max-width:425px)');
  const [form] = Form.useForm();
  const [isVisible, setIsVisible] = React.useState(false);
  const [steps, setSteps] = React.useState(0);
  const handleNextStepsFunction = () => {
    if (steps === 4) return;
    setSteps(steps + 1);
  };
  const handlePreStepsFunction = () => {
    if (steps === 0) return;
    setSteps(steps - 1);
  };
  const handleOpenModal = () => {
    setIsVisible(!isVisible);
  };
  const [bankAccountsState, setBankAccounts] = useState([
    {
      id: 1,
      iconUrl: <GrabPayIcon />,
      title: 'Grab pay Bank',
      balance: 'XXXX-0241',
    },
    {
      id: 2,
      iconUrl: <GrabPayIcon />,
      title: 'JP Morgan Chase Bank ',
      balance: 'XXXX-0241',
    },
    {
      id: 3,
      iconUrl: <IconVisa />,
      title: 'Visa xxxx 1648',
      balance: 'Expires on 11/25',
    },
    {
      id: 4,
      iconUrl: <PaypalIcon />,
      title: 'Paypal xxxx 1678',
      balance: 'Expires on 11/25',
    },
    {
      id: 5,
      iconUrl: <MasterCartIcon />,
      title: 'Mastercard xxxx 3323',
      balance: 'Expires on 12/23',
    },
    {
      id: 6,
      iconUrl: <VnptMoneyIcon />,
      title: 'Vnpt money xxxx 7778',
      balance: 'Expires on 12/28',
    },
    {
      id: 7,
      iconUrl: <AirPayIcon />,
      title: 'Air pay xxxx 9358',
      balance: 'Expires on 9/23',
    },
    {
      id: 8,
      iconUrl: <OnePayIcon />,
      title: 'Onepay xxxx 6586',
      balance: 'Expires on 12/28',
    },
  ]);
  return (
    <Row>
      <Col>
        <Button
          color='primary'
          shape='round'
          size='large'
          type='primary'
          icon={<LineIconIcon />}
          onClick={handleOpenModal}
        >
          اتصال حساب
        </Button>
      </Col>
      <Modal
        maskClosable={false}
        title={t('Banking.Transactions.Bank_account')}
        width={isMobile ? '80%' : isTablet ? 500 : 650}
        onCancel={handleOpenModal}
        open={isVisible}
        destroyOnClose
        // afterVisibleChange={handleAfterClose}
        // placement={i18n.language === "en" ? "right" : "left"}
        footer={
          <div className='textAlign__end'>
            <Space>
              {/* <CancelButton
              onClick={onClose}
              /> */}
              <Button
                color='primary'
                onClick={handlePreStepsFunction}
                disabled={steps === 0}
              >
                بازگشت
              </Button>

              <Button
                color='primary'
                type='primary'
                onClick={handleNextStepsFunction}
                disabled={steps === 4}
              >
                ادامه
              </Button>
              {/* <SaveButton
              onClick={onFinish}
              loading={isLoading}
              /> */}
            </Space>
          </div>
        }
      >
        <Form
          layout='vertical'
          hideRequiredMark
          form={form}
          initialValues={{
            // date:
            //   calendarCode === 'gregory'
            //     ? utcDate()
            //     : dayjs(changeGToJ(utcDate().format(dateFormat), dateFormat), {
            //         //@ts-ignore
            //         jalali: true,
            //       }),
            // currency: {
            //   value: baseCurrencyId,
            //   label: baseCurrencyName,
            // },
            currencyRate: 1,
          }}
        >
          {steps === 0 && (
            <Row gutter={[10, 10]}>
              <Col span={24}>
                <Typography.Text>
                  کارت اعتباری خود را برای انجام معاملات خود وصل کنید.
                </Typography.Text>
                <Input
                  style={{ marginTop: '10px', marginBottom: '10px' }}
                  autoFocus={false}
                  autoComplete='onBlur'
                  placeholder='نام بانک یا URL بانک خود را وارد کنید'
                />
              </Col>
              {bankAccountsState?.map((item) => {
                return (
                  <Col span={12} key={item?.id}>
                    <Card>
                      <Row gutter={[20, 10]}>
                        <Col
                          span={6}
                          style={{
                            background: '#f0f0f0',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '5px',
                          }}
                        >
                          {item?.iconUrl}
                        </Col>
                        <Col span={18}>
                          <Typography.Title
                            level={5}
                            style={{ marginBottom: '0' }}
                          >
                            {item?.title}
                          </Typography.Title>
                          <Typography.Text>{item?.balance}</Typography.Text>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                );
              })}
              <Col
                span={24}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '10px',
                  marginBottom: '10px',
                }}
              >
                <Button color='primary' shape='round' size='large'>
                  بیشتر
                </Button>
              </Col>
            </Row>
          )}
          {steps === 1 && (
            <Row>
              <Col span={14}>
                <Typography.Title level={5}>
                  وارد حساب کاربری شوید
                </Typography.Title>
                <Card>
                  <Row gutter={[20, 10]}>
                    <Col
                      span={6}
                      style={{
                        background: '#f0f0f0',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // padding: '0 15px',
                        borderRadius: '5px',
                      }}
                    >
                      <GrabPayIcon />
                    </Col>
                    <Col span={18}>
                      <Typography.Title level={5} style={{ marginBottom: '0' }}>
                        Grab pay Bank{' '}
                      </Typography.Title>
                      <Typography.Text>XXXX-0241</Typography.Text>
                    </Col>
                  </Row>
                </Card>
                <br />
                <Form.Item
                  name='username'
                  label={
                    <span>
                      نام کاربری <span className='star'>*</span>
                    </span>
                  }
                  rules={[
                    { required: true, message: `${t('Form.Name_required')}` },
                  ]}
                >
                  <Input autoFocus={true} autoComplete='off' />
                </Form.Item>
                <br />
                <Form.Item
                  name='password'
                  label={
                    <span>
                      رمز عبور <span className='star'>*</span>
                    </span>
                  }
                  rules={[
                    { required: true, message: `${t('Form.Name_required')}` },
                  ]}
                >
                  <Input autoFocus={true} autoComplete='off' type='password' />
                </Form.Item>
              </Col>
            </Row>
          )}
          {steps === 2 && (
            <Row>
              <Col span={14}>
                <Card>
                  <Row gutter={[20, 10]}>
                    <Col
                      span={6}
                      style={{
                        background: '#f0f0f0',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // padding: '0 15px',
                        borderRadius: '5px',
                      }}
                    >
                      <GrabPayIcon />
                    </Col>
                    <Col span={18}>
                      <Typography.Title level={5} style={{ marginBottom: '0' }}>
                        Grab pay Bank{' '}
                      </Typography.Title>
                      <Typography.Text>XXXX-0241</Typography.Text>
                    </Col>
                  </Row>
                </Card>
                <br />
                <Typography.Text>
                  لطفا انتخاب کنید که چگونه می خواهید کد دریافت کنید
                </Typography.Text>
                <br />
                <Radio.Group
                // onChange={onChange} value={value}
                >
                  <Space direction='vertical'>
                    <Radio value={1}>تماس به ***-***-1234</Radio>
                    <Radio value={2}>پیام به ***-***-1234</Radio>
                    <Radio value={3}>ایمیل به ***-***- sample.com</Radio>
                  </Space>
                </Radio.Group>
              </Col>
            </Row>
          )}
          {steps === 3 && (
            <Row>
              <Col span={14}>
                <Card>
                  <Row gutter={[20, 10]}>
                    <Col
                      span={6}
                      style={{
                        background: '#f0f0f0',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // padding: '0 15px',
                        borderRadius: '5px',
                      }}
                    >
                      <GrabPayIcon />
                    </Col>
                    <Col span={18}>
                      <Typography.Title level={5} style={{ marginBottom: '0' }}>
                        Grab pay Bank{' '}
                      </Typography.Title>
                      <Typography.Text>XXXX-0241</Typography.Text>
                    </Col>
                  </Row>
                </Card>
                <br />
                <Form.Item
                  name='username'
                  label={
                    <span>
                      لطفا کد ارسال شده را وارد کنید{' '}
                      <span className='star'>*</span>
                    </span>
                  }
                  rules={[
                    { required: true, message: `${t('Form.Name_required')}` },
                  ]}
                >
                  <Input autoFocus={true} autoComplete='off' />
                </Form.Item>
              </Col>
            </Row>
          )}
          {steps === 4 && (
            <Row gutter={[30, 30]} style={{ margin: '0 40px' }}>
              <Col span={8}>
                <Card
                  bodyStyle={{
                    padding: '5px',
                  }}
                >
                  <Row gutter={[3, 3]}>
                    <Col
                      span={24}
                      style={{
                        background: '#f0f0f0',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // padding: '0 15px',
                        borderRadius: '5px',
                        height: '6rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <GrabPayIcon />
                    </Col>
                    <Col
                      span={24}
                      style={{
                        justifyContent: 'center',
                        display: 'grid',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <Typography.Title
                        level={5}
                        style={{ marginBottom: '0', textAlign: 'center' }}
                      >
                        Grab pay Bank{' '}
                      </Typography.Title>
                      <Typography.Text style={{ textAlign: 'center' }}>
                        XXXX-0241
                      </Typography.Text>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  bodyStyle={{
                    padding: '5px',
                  }}
                >
                  <Row gutter={[3, 3]}>
                    <Col
                      span={24}
                      style={{
                        background: '#f0f0f0',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // padding: '0 15px',
                        borderRadius: '5px',
                        height: '6rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <GrabPayIcon />
                    </Col>
                    <Col
                      span={24}
                      style={{
                        justifyContent: 'center',
                        display: 'grid',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <Typography.Title
                        level={5}
                        style={{ marginBottom: '0', textAlign: 'center' }}
                      >
                        Grab pay Bank{' '}
                      </Typography.Title>
                      <Typography.Text style={{ textAlign: 'center' }}>
                        XXXX-0241
                      </Typography.Text>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  bodyStyle={{
                    padding: '5px',
                  }}
                >
                  <Row gutter={[3, 3]}>
                    <Col
                      span={24}
                      style={{
                        background: '#f0f0f0',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // padding: '0 15px',
                        borderRadius: '5px',
                        height: '6rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <GrabPayIcon />
                    </Col>
                    <Col
                      span={24}
                      style={{
                        justifyContent: 'center',
                        display: 'grid',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <Typography.Title
                        level={5}
                        style={{ marginBottom: '0', textAlign: 'center' }}
                      >
                        Grab pay Bank{' '}
                      </Typography.Title>
                      <Typography.Text style={{ textAlign: 'center' }}>
                        XXXX-0241
                      </Typography.Text>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={24}>
                <Typography.Title level={5}>
                  تراکنش ها از حساب انتخابی شما از تاریخ 12/3/2024 انجام خواهد
                  شد
                </Typography.Title>
                <Typography.Text>
                  {' '}
                  می توانید تاریخ متفاوتی را برای انجام تراکنش انتخاب کنید برخی
                  از محدودیت های بانک ممکن است اعمال شوند.
                </Typography.Text>
              </Col>
              <Col span={14}>
                <Select
                  showSearch
                  placeholder='Select a person'
                  optionFilterProp='children'
                  style={{ width: '100%' }}
                  // onChange={onChange}
                  // onSearch={onSearch}
                  // filterOption={filterOption}
                  options={[
                    {
                      value: 'سال گذشته 12/3/2023 ',
                      label: 'سال گذشته 12/3/2023 ',
                    },
                    // {
                    //   value: 'lucy',
                    //   label: 'Lucy',
                    // },
                    // {
                    //   value: 'tom',
                    //   label: 'Tom',
                    // },
                  ]}
                />
              </Col>
            </Row>
          )}
        </Form>
      </Modal>
    </Row>
  );
};
export default ConnectBank;
