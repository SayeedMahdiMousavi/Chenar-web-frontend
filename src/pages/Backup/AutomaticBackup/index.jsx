import React, { useCallback, useMemo } from 'react';
import AddInterval from './Add';
import AutomaticBackupTable from './Table';
import { useTranslation } from 'react-i18next';
import { Title } from '../../SelfComponents/Title';
import { Row, Col, Dropdown, Menu } from 'antd';
import { useMediaQuery } from '../../MediaQurey';
import { useQueryClient } from 'react-query';
import {
  PageBackIcon,
  PageNewButton,
  PageNewDropdown,
} from '../../../components';
import { BACKUP_SETTINGS_M } from '../../../constants/permissions';
import { checkPermissions } from '../../../Functions';

const baseUrl = '/system_setting/backup/schedule/';
function AutomaticBackup() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const isMiniTablet = useMediaQuery('(max-width:485px)');
  const isMobile = useMediaQuery('(max-width:425px)');
  const isMiniMobile = useMediaQuery('(max-width:375px)');

  const periodList = useMemo(
    () => [
      { value: 'days', display_name: t('Date.Days') },
      { value: 'hours', display_name: t('Date.Hours') },
      { value: 'minutes', display_name: t('Date.Minutes') },
      { value: 'seconds', display_name: t('Date.Seconds') },
    ],
    [t, i18n.language],
  );

  const handleUpdateItems = useCallback(() => {
    queryClient.invalidateQueries(baseUrl);
  }, [queryClient]);

  const menu = (
    <Menu>
      <Menu.Item key='1'>
        <AddInterval
          baseUrl={baseUrl}
          handleUpdateItems={handleUpdateItems}
          periodList={periodList}
          type='intervale'
        />
      </Menu.Item>
      <Menu.Item key='2'>
        <AddInterval
          baseUrl={baseUrl}
          handleUpdateItems={handleUpdateItems}
          periodList={periodList}
          type='schedule'
        />
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Row className='categore-header' align='middle' justify='start'>
        <Col
          xl={{ span: 7 }}
          md={{ span: 8 }}
          sm={{ span: 10 }}
          xs={{ span: 13 }}
          className='Sales__content-3-body'
        >
          <Row>
            <Col span={24}>
              <Title
                value={t('Company.Automatic_backup')}
                model={BACKUP_SETTINGS_M}
              />
            </Col>
            <Col span={24}>
              <PageBackIcon
                previousPageName={t('Company.Backup')}
                url='/backup'
              />
            </Col>
          </Row>
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
        >
          <Row justify={isMobile ? 'center' : 'space-around'} gutter={[0, 5]}>
            <Col xl={10} md={10} sm={9} xs={23}></Col>
            <Col xl={13} md={12} sm={13} xs={24}>
              {checkPermissions(`add_${BACKUP_SETTINGS_M}`) && (
                <PageNewDropdown overlay={menu} />
              )}
            </Col>
          </Row>
        </Col>
      </Row>

      <AutomaticBackupTable
        baseUrl={baseUrl}
        handleUpdateItems={handleUpdateItems}
        periodList={periodList}
      />
    </>
  );
}

export default AutomaticBackup;
