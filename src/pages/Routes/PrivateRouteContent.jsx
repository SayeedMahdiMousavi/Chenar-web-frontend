import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import {
  Layout,
  Row,
  Col,
  ConfigProvider,
  Alert,
  FloatButton,
  Divider,
  Spin,
} from 'antd';
import Heade from '../Header';
import { useTranslation } from 'react-i18next';
import { Detector } from 'react-detect-offline';
import jalaliday from 'jalaliday';
import dayjs from 'dayjs';
import enUS from 'antd/lib/locale/en_US';
import fa_IR from 'antd/lib/locale/fa_IR';
import 'moment/locale/fa';
import Sidebar from './Sidebar';
import { useDarkMode } from '../../Hooks/useDarkMode';
import RetryButton from '../SelfComponents/RetryButton';
import { Colors } from '../colors';
dayjs.extend(jalaliday);
dayjs.calendar('jalali');

const { Header, Content } = Layout;

export default function PrivateRouteContent(props) {
  const [mode] = useDarkMode();
  const { t } = useTranslation();

  return (
    <ConfigProvider
      direction={t('Dir') === 'ltr' ? 'ltr' : 'rtl'}
      locale={t('Dir') === 'ltr' ? enUS : fa_IR}
    >
      <Detector
        render={({ online }) => (
          <Row>
            <Col span={24}>
              <div style={{ width: '100%' }}>
                {online ? null : (
                  <Alert
                    type='error'
                    message={
                      <span className='internet_error'>
                        {t('Internet.No_internet_message')}
                      </span>
                    }
                    // banner
                    style={{
                      width: '100%',
                      height: '30px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                    banner
                  />
                )}
              </div>

              <Layout
                hasSider={true}
                style={!online ? styles.offlineStyle : styles.layout}
              >
                <Sidebar />
                <Divider
                  type='vertical'
                  style={{ height: '1vh', margin: '0px' }}
                />

                <Layout style={styles.layout1}>
                  <Header
                    style={mode === 'dark' ? { padding: '0px' } : styles.header}
                    // className='dashboard_header'
                    className='site-layout-background'
                  >
                    <Heade />
                  </Header>
                  <Content
                    className={online ? 'page-body' : 'page-body-offline'}
                    style={{
                      backgroundColor:
                        mode === 'dark'
                          ? Colors.secondaryDarkBackground
                          : '#f5f5f5',
                      width: '100%',
                    }}
                    id='mainComponent'
                  >
                    <ErrorBoundary
                      FallbackComponent={({ error, resetErrorBoundary }) => (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '95vh',
                            width: '100%',
                          }}
                        >
                          <div
                            style={{
                              width: '50%',
                              textAlign: 'center',
                              color: mode === 'dark' ? 'white' : 'black',
                            }}
                          >
                            مشکلی روخ دارد
                            <RetryButton
                              handleRetry={() => resetErrorBoundary()}
                              size='middle'
                            />
                            <pre style={{ whiteSpace: 'normal' }}>
                              {error.message}
                            </pre>
                          </div>
                        </div>
                      )}
                    >
                      <React.Suspense
                        fallback={
                          <div className='suspense'>
                            <Spin size='large' />
                          </div>
                        }
                      >
                        <Row
                          className='customer__table'
                          style={{ padding: '0px 12px' }}
                        >
                          {props.component}
                        </Row>
                      </React.Suspense>
                    </ErrorBoundary>
                    <FloatButton.BackTop
                      visibilityHeight={200}
                      target={() => document.getElementById('mainComponent')}
                    >
                      {/* <div className="backTop"
                      >{t("BackTop.1")}</div> */}
                    </FloatButton.BackTop>
                  </Content>
                </Layout>
              </Layout>

              {/* )} */}
            </Col>
          </Row>
        )}
      />
    </ConfigProvider>
  );
}
const styles = {
  // layout: { height: `calc(100vh - 30px)`, overflow: "hidden" },
  offlineStyle: { height: `calc(100vh - 30px)`, overflow: 'hidden' },
  layout: { height: `100vh`, overflow: 'hidden' },
  layout1: { overflow: 'hidden' },
  sider: {
    // boxShadow: "2px 2px 2px rgba(1 10, 110, 110, 0.452)",
  },

  header: {
    padding: '0',
    background: '#fff',
  },
  themeIcon: {
    position: 'absolute',
    left: '30px',
    bottom: '30px',
  },
  themeIcon1: {
    position: 'absolute',
    right: '30px',
    bottom: '30px',
  },
};
