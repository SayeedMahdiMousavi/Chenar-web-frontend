import  { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../../ApiBaseUrl';
import EditCategory from './EditCategory';
import { Row, Col, message, Menu, Dropdown, Input, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import { ActionMessage } from '../../../SelfComponents/TranslateComponents/ActionMessage';
import { trimString } from '../../../../Functions/TrimString';
import ActionButton from '../../../SelfComponents/ActionButton';
function Action(props) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [confMessage, setConfMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [removeVisible, setRemoveVisible] = useState(false);

  const deleteTreeData = (list, id, parent) => {
    return list?.map((node) => {
      if (node.name === parent) {
        const allData = {
          ...node,
          children: node.children.filter((item) => item.id !== id),
        };

        return allData;
      } else if (node.children?.[0]) {
        return {
          ...node,
          children: deleteTreeData(node.children, id, parent),
        };
      }
      return node;
    });
  };
  const { mutate: mutateDeleteCategory } = useMutation(
    async (id) =>
      await axiosInstance
        .delete(`${props.url}${id}/`)
        .then(() => {
          setVisible(false);
          setRemoveLoading(false);
          message.success(
            <ActionMessage
              name={props?.record?.name}
              message='Message.Remove'
            />
          );
          props.setTreeData((prev) => {
            if (props?.record?.node_parent === null || props?.search) {
              const newData = prev?.allData?.filter(
                (item) => item?.id !== props?.record?.id
              );
              return { ...prev, allData: newData };
            } else {
              return {
                ...prev,
                allData: deleteTreeData(
                  prev?.allData,
                  props?.record?.id,
                  props?.record?.node_parent?.name
                ),
              };
            }
          });
        })
        .catch(() => {
          setRemoveLoading(false);
        }),
    {
      onSuccess: () => queryClient.invalidateQueries(`${props.url}`),
    }
  );

  let oneRequest = false;
  const confirm = async () => {
    if (oneRequest) {
      return;
    }
    oneRequest = true;
    setRemoveLoading(true);
    try {
      mutateDeleteCategory(props.record.id);

      oneRequest = false;
    } catch (error) {
      setRemoveLoading(false);
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
  const text = `${t(
    'Sales.Product_and_services.Categories.Remove_Category_message1',
    { name: props?.record?.name }
  )}`;
  const onChangeMessage = (e) => {
    setConfMessage(e.target.value);
  };
  const confirm1 = () => {
    return (
      <Row style={styles.message}>
        <Col span={24}>
          {t('Sales.Product_and_services.Categories.Remove_Category_message')}
        </Col>
        <br />
        <h3>{text}</h3>
        <Col span={24}>
          <Input onChange={onChangeMessage} />{' '}
        </Col>
      </Row>
    );
  };

  const action = (
    <Menu>
      {props?.record?.system_default === false && (
        <Menu.Item key='2'>
          <Popconfirm
            placement='topLeft'
            title={confirm1}
            onConfirm={confirm}
            open={removeVisible}
            okButtonProps={{
              loading: removeLoading,
              disabled: trimString(text) !== trimString(confMessage),
            }}
            okText={t('Manage_users.Yes')}
            cancelText={t('Manage_users.No')}
            onCancel={cancel}
          >
            <div onClick={onClickRemove}>
              {t('Sales.Customers.Table.Remove')}
            </div>
          </Popconfirm>
        </Menu.Item>
      )}

      <EditCategory
        record={props.record}
        setVisible={setVisible}
        url={props.url}
        setTreeData={props.setTreeData}
        setLoadData={props.setLoadData}
        setExpandedRowKeys={props.setExpandedRowKeys}
        onClickEdit={onClickEdit}
        model={props?.model}
        key='1'
      />
    </Menu>
  );

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };
  return (
    <Dropdown
      open={action}
      trigger={['click']}
      onOpenChange={handleVisibleChange}
      openClassName={visible}
      // disabled={props?.record?.system_default === true}
    >
      <ActionButton
        onClick={handleVisibleChange}
        // disabled={props?.record?.system_default === true ? true : false}
      />
    </Dropdown>
  );
}
const styles = {
  drop: { zIndex: 0 },
  message: { width: '306px' },
};
export default connect(null)(Action);
