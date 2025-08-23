import React, { useCallback } from 'react';
import { Layout, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { Title } from '../SelfComponents/Title';
import { useMediaQuery } from '../MediaQurey';
import AddRole from './Add';
import { ROLES_LIST, USERS } from '../../constants/routes';
import { useQueryClient } from 'react-query';
import RolesTable from './Table';
import { BackIcon } from '../../components';
import { USER_ROLE_M } from '../../constants/permissions';

export default function Roles() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isMiniTablet = useMediaQuery('(max-width:485px)');
  const isMiniMobile = useMediaQuery('(max-width:375px)');

  const handleUpdateItems = useCallback(() => {
    queryClient.invalidateQueries(ROLES_LIST);
  }, [queryClient]);

  return (
    <Layout>
      <Row className='categore-header' align='middle' justify='start'>
        <Col
          xl={{ span: 7 }}
          md={{ span: 8 }}
          sm={{ span: 10 }}
          xs={{ span: 13 }}
          className='Sales__content-3-body'
        >
          <Title value={t('Roles')} model={USER_ROLE_M} />
          <BackIcon url={USERS} name={t('Manage_users.1')} />
        </Col>
        <Col
          xl={{ span: 6, offset: 11 }}
          md={{ span: 8, offset: 8 }}
          sm={{ span: 10, offset: 4 }}
          xs={
            isMiniMobile
              ? { span: 8, offset: 3 }
              : isMiniTablet
                ? { span: 7, offset: 4 }
                : { span: 6, offset: 5 }
          }
          style={{ textAlign: 'end' }}
        >
          <Row justify={'space-around'} gutter={[0, 5]}>
            <Col xl={10} md={10} sm={9} xs={23}></Col>
            <Col xl={13} md={12} sm={13} xs={24}>
              <AddRole handleUpdateItems={handleUpdateItems} />
            </Col>
          </Row>
        </Col>
      </Row>

      <RolesTable handleUpdateItems={handleUpdateItems} />
    </Layout>
  );
}
