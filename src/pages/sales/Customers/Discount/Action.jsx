import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
// import { useDatabase } from "@nozbe/watermelondb/hooks";
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../../ApiBaseUrl';
import EditDiscount from './EditDiscount';
import {
  Row,
  Col,
  message,
  Menu,
  Dropdown,
  Input,
  Popconfirm,
  Typography,
} from 'antd';
import { connect } from 'react-redux';
import { ActionMessage } from '../../../SelfComponents/TranslateComponents/ActionMessage';
import ActionButton from '../../../SelfComponents/ActionButton';
function Action(props) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [confMessage, setConfMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [removeVisible, setRemoveVisible] = useState(false);
  // const database = useDatabase();

  const { mutate: mutateDelete } = useMutation(
    async (id) =>
      await axiosInstance
        .delete(`/customer_account/discount/card/${id}/`)
        .then((res) => {
          setVisible(false);
          setRemoveLoading(false);

          message.success(
            <ActionMessage
              name={props?.record?.name}
              message='Message.Remove'
            />,
          );
          setConfMessage('');
        })
        .catch((error) => {
          setRemoveLoading(false);
        }),
    {
      onSuccess: () =>
        queryClient.invalidateQueries(`/customer_account/discount/card/`),
    },
  );
  let oneRequest = false;
  const confirm = async () => {
    if (oneRequest) {
      return;
    }
    oneRequest = true;
    setRemoveLoading(true);
    try {
      mutateDelete(props.record.id, {
        onSuccess: () => {},
      });

      oneRequest = false;
    } catch (info) {
      oneRequest = false;
    }
  };
  const cancel = () => {
    setVisible(false);
    setRemoveVisible(false);
  };

  const onClickRemove = () => {
    setRemoveVisible(!removeVisible);
  };
  const onClickEdit = () => {
    setRemoveVisible(false);
  };
  //popconfig
  const text = t('Sales.Customers.Discount.Remove_Card_message1', {
    name: props?.record?.name,
  });
  const onChangeMessage = (e) => {
    setConfMessage(e.target.value);
  };

  const confirm1 = () => {
    return (
      <Row style={styles.message}>
        <Col span={24}>
          <Trans
            i18nKey='Sales.Customers.Discount.Remove_Card_message' // optional -> fallbacks to defaults if not provided
            values={{ name: props?.record?.name }}
            components={{
              italic: <i />,
              bold: <Typography.Text strong={true} />,
            }}
          />
        </Col>
        {/* {console.log(props.record?.name)} */}
        <br />
        <h3>{text}</h3>
        <Col span={24}>
          <Input onChange={onChangeMessage} value={confMessage} />{' '}
        </Col>
      </Row>
    );
  };

  const action = (
    <Menu>
      <Menu.Item>
        <Popconfirm
          placement='topLeft'
          title={confirm1}
          onConfirm={confirm}
          open={removeVisible}
          okButtonProps={{
            loading: removeLoading,
            disabled: text !== confMessage,
          }}
          okText={t('Manage_users.Yes')}
          cancelText={t('Manage_users.No')}
          onCancel={cancel}
        >
          <div onClick={onClickRemove}>{t('Sales.Customers.Table.Remove')}</div>
        </Popconfirm>
      </Menu.Item>

      <Menu.Item onClick={onClickEdit}>
        <EditDiscount record={props.record} setVisible={setVisible} />
      </Menu.Item>
    </Menu>
  );
  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };
  return (
    <Dropdown
      overlay={action}
      trigger={['click']}
      onOpenChange={handleVisibleChange}
      open={visible}
    >
      <ActionButton
        onClick={handleVisibleChange}
        disabled={props?.record?.system_default === true}
      />
    </Dropdown>
  );
}
const styles = {
  drop: { zIndex: 0 },
  message: { width: '306px' },
};
export default connect(null)(Action);
