import React, { Key, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  Dropdown,
  Button,
  message,
  Row,
  Col,
  Popconfirm,
  Input,
} from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { ActionMessage } from '../SelfComponents/TranslateComponents/ActionMessage';
import { useMutation } from 'react-query';
import axiosInstance from '../ApiBaseUrl';
import { useQueryClient } from 'react-query';
import { trimString } from '../../Functions/TrimString';

interface IProps {
  selectedRows: any[];
  selectedRowKeys: Key[];
  setSelectedRowKeys: (value: string[]) => void;
  baseUrl: string;
}

function ApproveCenterBatchAction(props: IProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [confMessage, setConfMessage] = useState('');
  const [visible, setVisible] = useState(false);
  // const [removeLoading, setRemoveLoading] = useState(false);
  const [removeVisible, setRemoveVisible] = useState(false);
  const [removeAllVisible, setRemoveAllVisible] = useState(false);

  const {
    mutate: mutateDeleteSelectedItems,
    isLoading: selectItemLoading,
    reset: selectItemReset,
  } = useMutation(
    async (value: { invoice: Key[]; action: string }) =>
      await axiosInstance
        .delete(`${props.baseUrl}clear_rejected_invoice/`, {
          data: value,
        })
        .then((res) => {
          setRemoveVisible(false);
          message.success(<ActionMessage name='' message='Message.Remove' />);
          setVisible(false);
          props.setSelectedRowKeys([]);
        })
        .catch((error) => {
          message.error(`${error?.response?.data?.data?.message}`);
        }),
    {
      onSuccess: () => queryClient.invalidateQueries(`${props.baseUrl}`),
    },
  );
  let oneRequest = false;

  const handelDeleteSelectedItems = async (e: any) => {
    if (oneRequest) {
      return;
    }
    oneRequest = true;
    try {
      mutateDeleteSelectedItems({
        invoice: props.selectedRowKeys,
        action: 'remove',
      });

      oneRequest = false;
    } catch (info) {
      //
      oneRequest = false;
    }
  };
  const {
    mutate: mutateDeleteRejectedItems,
    isLoading,
    reset,
  } = useMutation(
    async () =>
      await axiosInstance
        .delete(`${props.baseUrl}clear_all_rejected_invoice/`)
        .then((res) => {
          setRemoveAllVisible(false);
          message.success(<ActionMessage name='' message='Message.Remove' />);
          setVisible(false);
          props.setSelectedRowKeys([]);
        })
        .catch((error) => {
          message.error(`${error?.response?.data?.data?.message}`);
        }),
    {
      onSuccess: () => queryClient.invalidateQueries(`${props.baseUrl}`),
    },
  );
  let removeRejectedItems = false;

  const handelDeleteRejectedItems = async (e: any) => {
    if (removeRejectedItems) {
      return;
    }
    removeRejectedItems = true;
    try {
      mutateDeleteRejectedItems();
      removeRejectedItems = false;
    } catch (info) {
      //
      removeRejectedItems = false;
    }
  };

  const cancel = () => {
    setVisible(false);
    setRemoveVisible(false);
    setRemoveAllVisible(false);
    setConfMessage('');
    selectItemReset();
    reset();
  };

  const onClickRemove = () => {
    if (props?.selectedRowKeys?.length === 0) {
    } else {
      setRemoveVisible(!removeVisible);
      setRemoveAllVisible(false);
    }
  };
  const onClickRemoveAll = () => {
    if (props?.selectedRowKeys?.length > 0) {
    } else {
      setRemoveAllVisible(!removeVisible);
      setRemoveVisible(false);
    }
  };

  const onChangeMessage = (e: any) => {
    setConfMessage(e.target.value);
  };

  const text = `${t('Sales.All_sales.Remove_all_rejected_items_type_message')}`;

  const removeRejectedItemsTitle = () => {
    return (
      <Row style={styles.message}>
        <Col span={24}>
          {t('Sales.All_sales.Remove_all_rejected_items_message')}
        </Col>
        <br />
        <h3>{t('Sales.All_sales.Remove_all_rejected_items_type_message')}</h3>
        <Col span={24}>
          <Input onChange={onChangeMessage} value={confMessage} />{' '}
        </Col>
      </Row>
    );
  };
  const batch = (
    <Menu>
      <Menu.Item key='1' danger disabled={props?.selectedRowKeys?.length > 0}>
        <Popconfirm
          placement='topRight'
          open={removeAllVisible}
          okButtonProps={{
            loading: isLoading,
            disabled: trimString(text) !== trimString(confMessage),
          }}
          title={removeRejectedItemsTitle}
          onConfirm={handelDeleteRejectedItems}
          okText={t('Manage_users.Yes')}
          cancelText={t('Manage_users.No')}
          onCancel={cancel}
          disabled={props?.selectedRowKeys?.length > 0}
        >
          <div onClick={onClickRemoveAll}>
            {t('Sales.All_sales.Remove_all_rejected_items')}
          </div>
        </Popconfirm>
      </Menu.Item>

      <Menu.Item key='2' disabled={props?.selectedRowKeys?.length === 0} danger>
        <Popconfirm
          placement='topRight'
          open={removeVisible}
          okButtonProps={{ loading: selectItemLoading }}
          title={t('Sales.All_sales.Remove_selected_items_message')}
          onConfirm={handelDeleteSelectedItems}
          okText={t('Manage_users.Yes')}
          cancelText={t('Manage_users.No')}
          onCancel={cancel}
          disabled={props?.selectedRowKeys?.length === 0}
        >
          <div onClick={onClickRemove}>
            {t('Sales.All_sales.Remove_selected_items')}
          </div>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );
  const handleVisibleChange = (flag: any) => {
    setVisible(flag);
  };
  return (
    <Row justify='end'>
      <Col span={23}>
        <Dropdown
          overlay={batch}
          trigger={['click']}
          onOpenChange={handleVisibleChange}
          open={visible}
        >
          <Button className='table-col' type='primary' shape='round' danger>
            {t('Sales.Customers.Table.Batch_action')}
            <CaretDownOutlined />
          </Button>
        </Dropdown>
      </Col>
    </Row>
  );
}
const styles = {
  message: { width: '306px' },
};
export default ApproveCenterBatchAction;
