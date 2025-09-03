import React, { useState } from 'react';
import { Modal, Col, Row, Button, Descriptions, Input } from 'antd';
import { useMediaQuery } from '../../../MediaQurey';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../../ApiBaseUrl';
import { Popconfirm, Progress } from 'antd';
import { useTranslation } from 'react-i18next';
import { ModalDragTitle } from '../../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { trimString } from '../../../../Functions/TrimString';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../../../Hooks/useDarkMode';
import { handleClearLocalStorageLogout } from '../../../../Functions';
import { lessVars } from '../../../../theme/index';
import { CancelButton } from '../../../../components';

const RestoreBackup = (props) => {
  const queryClient = useQueryClient();
  const [mode, setMode] = useDarkMode();
  const { t } = useTranslation();
  const history = useNavigate();
  const isBgTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const [percent, setPercent] = useState(0);
  const [confMessage, setConfMessage] = useState('');
  const [status, setStatus] = useState('normal');
  const [response, setResponse] = useState({});
  const [disabled, setDisabled] = useState(true);

  const onCancel = () => {
    props.setVisible(false);
  };

  const restoreBackup = async (id) => {
    await axiosInstance
      .get(`/system_setting/backup/manage/${id}/restore/`, { timeout: 0 })
      .then((res) => {
        setPercent(100);
        setResponse(res?.data);
        setStatus('success');

        if (mode !== 'light') {
          window.less.modifyVars(lessVars.light);
          setMode('light');
        }

        queryClient.clear();
        handleClearLocalStorageLogout();

        setTimeout(() => {
          history('/');
          // queryClient.invalidateQueries(`/system_setting/backup/manage/`);
        }, 500);
      })
      .catch((error) => {
        setStatus('exception');
      });
  };

  const { mutate: mutateRestoreBackup } = useMutation(restoreBackup, {
    onSuccess: () => {
      queryClient.invalidateQueries(`/system_setting/backup/manage/`);
    },
    onError: (error) => {
      setStatus('exception');
    },
  });

  const handleAfterClose = () => {
    queryClient.invalidateQueries(`/system_setting/backup/`);
  };

  const handleOk = async () => {
    try {
      setStatus('active');
      setPercent(99.9);

      mutateRestoreBackup(props.record.id);
    } catch (info) {
      console.log('Validate Failed:', info);
    }
  };
  const onChangeMessage = (e) => {
    setConfMessage(e.target.value);
  };
  const text = `${t('Company.Restore_user_text')}`;
  const ref = React.useRef(null);
  const confirm = () => {
    return (
      <Row style={styles.message}>
        <Col span={24}>{t('Company.Restore_question_text')} </Col>
        <br />
        <h3>{text}</h3>
        <Col span={24}>
          <Input onChange={onChangeMessage} />{' '}
        </Col>
      </Row>
    );
  };
  return (
    <div>
      <Button type='primary' onClick={props.handleOk} loading={props.loading}>
        {t('Sales.Customers.Table.Send')}
      </Button>
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Company.Restore')}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled} nodeRef={ref}>
            <div ref={ref}>{modal}</div>
          </Draggable>
        )}
        centered
        open={props.visible}
        afterClose={handleAfterClose}
        onCancel={onCancel}
        width={isMobile ? '100%' : isTablet ? 380 : isBgTablet ? 380 : 380}
        footer={
          <Row justify='end' align='middle'>
            <Col>
              <CancelButton onClick={onCancel} disabled={response.id} />

              <Popconfirm
                placement='bottomRight'
                title={confirm}
                onConfirm={handleOk}
                okText={t('Manage_users.Yes')}
                okButtonProps={{
                  disabled: trimString(text) !== trimString(confMessage),
                }}
                cancelText={t('Manage_users.No')}
                disabled={response.id}
              >
                <Button type='primary' disabled={response.id}>
                  {t('Company.Restore')}
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        }
      >
        <Row justify='center' align='middle'>
          <Col>
            <Progress
              type='circle'
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              percent={percent}
              status={status}
            />
          </Col>
        </Row>
        {response?.file && (
          <Row>
            <Col>
              <Descriptions
                column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 2, xs: 1 }}
              >
                <Descriptions.Item label={t('Company.Created_by')}>
                  {response?.user?.username}
                </Descriptions.Item>
                <Descriptions.Item label={t('Company.File_size')}>
                  {response?.size}
                </Descriptions.Item>
                <Descriptions.Item label={t('Sales.Customers.Form.Date')}>
                  {response?.date}
                </Descriptions.Item>
                <Descriptions.Item label={t('Form.Notes')}>
                  {response?.note}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        )}
      </Modal>
    </div>
  );
};

const styles = {
  cancel: { margin: '0px 8px' },
  message: { width: '306px' },
};

export default RestoreBackup;
