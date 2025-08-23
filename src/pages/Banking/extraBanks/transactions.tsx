import { Button, Col, Layout, Row } from 'antd';
import React, { useMemo } from 'react';
import Navbar from '../Navbar';
import { useTranslation } from 'react-i18next';
import { Title } from '../../SelfComponents/Title';
import { BANK_M, BANK_TRANSACTION_M_M } from '../../../constants/permissions';
import { useMediaQuery } from '../../MediaQurey';
import { PaginateTable } from '../../../components/antd/PaginateTable';
import Column from 'antd/lib/table/Column';
import ConnectBank from './connectBank/connectBank';

const Transactions = (props: any) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width:425px)');

  const columns = useMemo(
    () => (type: string, hasSelected: boolean) => {
      const sorter = type !== 'print' ? true : false;
      return (
        <React.Fragment>
          <Column
            title={t('Banking.Bank_id').toUpperCase()}
            dataIndex='id'
            key='id'
            width={120}
            fixed={sorter}
            className='table-col'
            // align="center"
            sorter={sorter && { multiple: 9 }}
          />
          <Column
            title={t('Form.Name').toUpperCase()}
            width={isMobile ? 70 : 170}
            dataIndex='account_name'
            key='account_name'
            fixed={sorter}
            sorter={sorter && { multiple: 8 }}
            className='table-col'
          />
          <Column
            title={t('Banking.Form.Manager_name').toUpperCase()}
            dataIndex='manager_name'
            key='manager_name'
            sorter={sorter && { multiple: 5 }}
            className='table-col'
          />
        </React.Fragment>
      );
    },
    [
      // accountNumber,
      // address,
      // branch,
      // fax,
      isMobile,
      // notes,
      // phone,
      props.baseUrl,
      t,
    ],
  );

  const handleGetBanks = () => {};
  return (
    <Layout>
      <Navbar />
      <Row className='categore-header' align='middle' justify='space-between'>
        <Col className='Sales__content-3-body'>
          <Title
            value={t('Banking.Transactions.1')}
            model={BANK_TRANSACTION_M_M}
          />
        </Col>

        <Col>
          <ConnectBank />
        </Col>
      </Row>
      <Row>
        <PaginateTable
          title={t('Banking.1')}
          columns={columns}
          model={BANK_M}
          queryKey={props.baseUrl}
          handleGetData={handleGetBanks}
          // settingMenu={setting}
        />
      </Row>
    </Layout>
  );
};

export default Transactions;
