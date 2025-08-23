import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Layout } from 'antd';
import ReportsBody from './ReportsBody';
import { Title } from '../SelfComponents/Title';

const Reports = (props) => {
  const { t } = useTranslation();

  return (
    <Layout>
      <Row className='Sales__content-3' align='middle' justify='space-between'>
        <Col span={12} className='Sales__content-3-body'>
          <Title value={t('Reports.1')} />
        </Col>
        <Col span={12}>
          {/* <Input.Search
                  size="middle"
                  placeholder="Find report by name"
                  // value={search}
                  // setSearch={setSearch}
                  className="report_search"
                  // style={hasSelected ? { width: "87%" } : {}}
                /> */}
        </Col>
      </Row>

      <ReportsBody />
    </Layout>
  );
};

export default Reports;
