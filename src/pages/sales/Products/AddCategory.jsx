import React, { useState } from 'react';
import { Modal, Button, Form, Typography, Input, message, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import { AddItem } from '../../SelfComponents/AddItem';
import Draggable from 'react-draggable';
import { ActionMessage } from '../../SelfComponents/TranslateComponents/ActionMessage';
import { trimString } from '../../../Functions/TrimString';
import { CategoryFormItem } from './Categories/CategoryFormItem';
import { CancelButton, SaveButton } from '../../../components';

const { Title } = Typography;
const AddCategory = (props) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const addTreeData = (list, parent, children) => {
    return list?.map((node) => {
      if (node.id === parent) {
        return {
          ...node,
          isLeaf: false,
          children: node?.children ? [...node.children, children] : [children],
        };
      } else if (node.children?.[0]) {
        return {
          ...node,
          children: addTreeData(node?.children, parent, children),
        };
      }

      return node;
    });
  };

  const addCategory = async (value) => {
    await axiosInstance
      .post(`${props.url}`, value)
      .then((res) => {
        setVisible(false);
        setTimeout(() => {
          props.form.setFieldsValue({
            category: { label: res?.data?.name, value: res?.data?.id },
          });
        }, 200);

        const newData = {
          title: res?.data?.name,
          label: res?.data?.name,
          value: res?.data?.id,
          id: res?.data?.id,
          isLeaf: true,
        };

        props.setTreeData((prev) => {
          if (!value?.parent) {
            const data = [newData, ...prev.treeData];
            return { ...prev, treeData: data };
          } else {
            return {
              ...prev,
              treeData: addTreeData(prev?.treeData, value?.parent, newData),
            };
          }
        });
        message.success(
          <ActionMessage name={res.data?.name} message='Message.Add' />,
        );
      })
      .catch((error) => {
        setLoading(false);
        if (error?.response?.data?.name?.[0]) {
          message.error(`${error?.response?.data?.name?.[0]}`);
        } else if (error?.response?.data?.parent?.[0]) {
          message.error(`${error?.response.data?.parent?.[0]}`);
        }
      });
  };
  const { mutate: mutateAddCategory } = useMutation(addCategory, {
    onSuccess: () => queryClient.invalidateQueries(`${props.url}`),
  });

  const onFinish = async (value) => {
    setLoading(true);
    const allData = {
      name: trimString(value?.name),
      parent: value?.category?.value,
    };
    mutateAddCategory(allData, {
      onSuccess: () => {},
    });
  };
  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };
  const handleAfterClose = () => {
    form.resetFields();

    setLoading(false);
  };

  return (
    <div>
      <AddItem showModal={showModal} />
      <Modal
        maskClosable={false}
        open={visible}
        onOk={onFinish}
        onCancel={handleCancel}
        footer={null}
        width={360}
        destroyOnClose
        afterClose={handleAfterClose}
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
      >
        <Form
          layout='vertical'
          onFinish={onFinish}
          hideRequiredMark={true}
          form={form}
        >
          <Title
            level={5}
            className='drag_modal'
            onMouseOver={() => {
              setDisabled(false);
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            onFocus={() => {}}
            onBlur={() => {}}
          >
            {t('Sales.Product_and_services.Categories.Category_information')}
          </Title>
          <Form.Item
            name='name'
            label={
              <span>
                {t('Form.Name')} <span className='star'>*</span>
              </span>
            }
            rules={[{ required: true, message: `${t('Form.Name_required')}` }]}
          >
            <Input />
          </Form.Item>
          <CategoryFormItem
            place='productAddCategory'
            form={form}
            url={props.url}
            categoryId={-12}
            label={t('Sales.Product_and_services.Categories.Parent')}
          />

          <Form.Item className='margin' style={styles.footer}>
            <Space>
              <CancelButton onClick={handleCancel} />
              <SaveButton htmlType='submit' loading={loading} />
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const styles = {
  footer: { paddingTop: '30px', textAlign: 'end', width: '100%' },
};

export default AddCategory;
