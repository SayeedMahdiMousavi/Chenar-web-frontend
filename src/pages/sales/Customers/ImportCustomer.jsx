import React, { useState } from 'react';
import { useMediaQuery } from '../../MediaQurey';
import { useTranslation } from 'react-i18next';
import { Drawer, Button, Col, Row, Input, Steps, message, Upload } from 'antd';
import { connect } from 'react-redux';
import { QuestionCircleOutlined, DownloadOutlined } from '@ant-design/icons';

const { Step } = Steps;
const steps = [
  {
    title: 'First',
    content: 'First-content',
  },
  {
    title: 'Second',
    content: 'Second-content',
  },
  {
    title: 'Last',
    content: 'Last-content',
  },
];

const ImportCustomer = (props) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [fileList, setFileList] = useState();
  const [fileUrl, setFileUrl] = useState('');
  const [disabled, setdisabled] = useState(true);
  const isTablitBased = useMediaQuery('(max-width: 576px)');
  const isMobileBased = useMediaQuery('(max-width: 320px)');
  const isMiddleMobile = useMediaQuery('(max-width: 375px)');

  const showDrawer = () => {
    setVisible(true);
  };

  //steps
  const next = () => {
    const curren = current + 1;
    setCurrent(curren);
  };

  const prev = () => {
    const curren = current - 1;
    setCurrent(curren);
  };

  const onClose = () => {
    setVisible(false);
  };
  const prop = {
    showUploadList: false,
    accept: '.csv,.xls',
    action: '//jsonplaceholder.typicode.com/posts/',
    name: 'file',

    previewFile(file) {
      // Your process logic. Here we just mock to the same file
      return fetch('https://next.json-generator.com/api/json/get/4ytyBoLK8', {
        method: 'POST',
        body: file,
      })
        .then((res) => res.json())
        .then(({ thumbnail }) => thumbnail);
    },
    // fileList:{1},
    listType: 'picture',
    onChange(info) {
      setFileList(info.fileList.slice()); // Note: A new object must be used here!!!
      setLoading(true);
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        setFileUrl(info.file.name);
        setLoading(false);
        setdisabled(false);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
        setLoading(false);
        setdisabled(false);
      }
    },
    // showUploadList: {
    //   showDownloadIcon: true,
    //   downloadIcon: <DownloadOutlined />,
    //   showRemoveIcon: true,
    // },
  };
  return (
    <div>
      <span onClick={showDrawer}>{t('Sales.Product_and_services.Import')}</span>

      <Drawer
        maskClosable={false}
        mask={true}
        headerStyle={{ padding: '.8rem 0 .7rem 0 ' }}
        title={
          <Row align='middle' style={styles.nav(isTablitBased)}>
            <Col xl={7} lg={10} sm={11} xs={14}>
              <h3 className='drawer-title'>
                {t('Sales.Customers.Import_customer')}
              </h3>
            </Col>
            <Col
              xl={{ span: 1, offset: 14 }}
              lg={{ span: 2, offset: 10 }}
              sm={{ span: 2, offset: 8 }}
              xs={
                isMiddleMobile ? { span: 3, offset: 2 } : { span: 2, offset: 3 }
              }
            >
              <Row justify='space-around'>
                <Col span={11}>
                  {' '}
                  <QuestionCircleOutlined className='font' />
                </Col>
                <Col span={11}>
                  {' '}
                  <span>{t('Sales.Product_and_services.Help')}</span>
                </Col>
              </Row>
            </Col>
          </Row>
        }
        height='100%'
        onClose={onClose}
        open={visible}
        placement='top'
        bodyStyle={{ paddingBottom: 10 }}
        footer={
          <div className='import__footer'>
            <div>
              <Button onClick={onClose} shape='round'>
                {t('Form.Cancel')}
              </Button>
            </div>
            <div>
              {current > 0 && (
                <Button
                  style={{ margin: '0 8px' }}
                  shape='round'
                  onClick={() => prev()}
                >
                  {t('Step.Previous')}
                </Button>
              )}
              {current < steps.length - 1 && (
                <Button type='primary' shape='round' onClick={() => next()}>
                  {t('Step.Next')}
                </Button>
              )}
              {current === steps.length - 1 && (
                <Button
                  type='primary'
                  shape='round'
                  onClick={() => message.success('Processing complete!')}
                >
                  {t('Step.Done')}
                </Button>
              )}
            </div>
          </div>
        }
      >
        <div>
          <Steps
            current={current}
            labelPlacement='vertical'
            type={isMobileBased ? 'navigation' : 'default'}
            direction={isMobileBased ? 'vertical' : 'horizontal'}
            style={{ paddingTop: '2rem' }}
          >
            {/* {steps.map((item) => ( */}
            <Step title={`${t('Step.Upload')}`} />
            <Step title={`${t('Step.Map_data')}`} />
            <Step title={`${t('Step.Import')}`} />
            {/* ))} */}
          </Steps>
          {current === 0 && (
            <div>
              <h3 style={styles.upload}>{t('Upload.Select_csv/excel')}</h3>
              <Row gutter={[7]}>
                <Col xl={5} md={8} sm={8} xs={16}>
                  <Input value={fileUrl} disabled={disabled} />
                </Col>
                <Col span={2}>
                  <Upload {...prop}>
                    <Button type='primary' loading={loading} ghost>
                      {t('Upload.Browse')}
                    </Button>
                  </Upload>
                  {/* <Form>
                    <Form.Item
                      name='upload'
                      label='Upload'
                      valuePropName='fileList'
                      getValueFromEvent={normFile}
                    >
                      <Upload name='logo' action='/upload.do' listType='text'>
                        <Button>
                          <UploadOutlined /> Click to upload
                        </Button>
                      </Upload>
                      <Input onChange={normFile} />
                    </Form.Item>
                  </Form> */}
                </Col>

                <Col span={24} style={{ paddingTop: '5px' }}>
                  <a
                    href='/Sodagar_Online_PnS_Sample_File_SS_ESS.xls'
                    target='_blank'
                    download
                  >
                    {t('Upload.Download_sample')}
                    <DownloadOutlined />
                  </a>
                </Col>
              </Row>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
};
const styles = {
  nav: (isMobileBased) => ({ height: isMobileBased ? '7vh' : '5vh' }),
  upload: { marginTop: '4rem' },
};
const mapStateToProps = (state) => {
  return {
    rtl: state.direction.rtl,
    ltr: state.direction.ltr,
  };
};

export default connect(mapStateToProps)(ImportCustomer);
