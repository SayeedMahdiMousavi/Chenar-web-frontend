import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient, useMutation } from 'react-query';
import axiosInstance from '../../../ApiBaseUrl';
import { Drawer, Form, Col, Row, Input, Space } from 'antd';
import { useMediaQuery } from '../../../MediaQurey';
import { CategoryFormItem } from './CategoryFormItem';
import { trimString } from '../../../../Functions/TrimString';
import { CancelButton, EditMenuItem, SaveButton } from '../../../../components';
import { manageErrors, updateMessage } from '../../../../Functions';

const updateTreeData = (list, id, item) => {
  return list?.map((node) => {
    if (node.id === id) {
      const newRow = {
        ...node,
        ...item,
      };
      return newRow;
    } else if (node.children?.[0]) {
      return {
        ...node,
        children: updateTreeData(node.children, id, item),
      };
    }
    return node;
  });
};

const addTreeData = (list, parentId, children) => {
  return (list || []).map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        children: node.children ? [...node.children, children] : [children],
      };
    } else if (node.children?.[0]) {
      return {
        ...node,
        children: addTreeData(node.children, parentId, children),
      };
    }
    return node;
  });
};

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

const EditCategory = ({
  record,
  setTreeData,
  url,
  search,
  setLoadData,
  setExpandedRowKeys,
  setVisible: setVisibleMenu,
  onClickEdit,
  model,
  ...rest
}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const isTablet = useMediaQuery('(max-width:768px)');
  const isMobile = useMediaQuery('(max-width:425px)');

  const showDrawer = () => {
    setVisibleMenu(false);
    onClickEdit();
    setVisible(true);
    form.setFieldsValue({
      name: record?.name,
      description: record?.description,
      category: record?.node_parent !== null && {
        label: record?.node_parent?.name,
        value: record?.node_parent?.id,
      },
    });
  };

  const handleEditCategory = async (value) =>
    await axiosInstance.put(`${url}${record.id}/`, value);

  const {
    mutate: mutateEditCategory,
    isLoading,
    reset,
  } = useMutation(handleEditCategory, {
    onSuccess: (values) => {
      setVisible(false);
      updateMessage(values?.data?.name);

      queryClient.invalidateQueries(`${url}`);
      if (record?.system_default === true) {
        queryClient.invalidateQueries(`${url}default/`);
      }
      if (
        values?.data?.node_parent?.id === record?.node_parent?.id ||
        (!values?.data?.node_parent?.id && record?.node_parent === null)
      ) {
        setTreeData((prev) => {
          const data = updateTreeData(prev.allData, record.id, values?.data);
          return { ...prev, allData: data };
        });
      } else {
        setTreeData((prev) => {
          if (record?.node_parent === null || search) {
            return {
              ...prev,
              allData: prev.allData.filter((item) => item?.id !== record?.id),
            };
          } else {
            return {
              ...prev,
              allData: deleteTreeData(
                prev.allData,
                record?.id,
                record?.node_parent?.name,
              ),
            };
          }
        });

        setTreeData((prev) => {
          if (!values?.data?.node_parent?.id) {
            const data = [values?.data, ...prev.allData];
            return { ...prev, allData: data };
          } else {
            return {
              ...prev,
              allData: addTreeData(
                prev.allData,
                values?.data?.node_parent?.id,
                values?.data,
              ),
            };
          }
        });
        setLoadData((prev) => {
          const newLoadData = prev?.filter((item) => item !== record?.name);

          return newLoadData;
        });
        setExpandedRowKeys((prev) => {
          const newKeys = prev?.filter((item) => item !== record?.id);
          return newKeys;
        });
        // setUpdateItem({});
      }
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const onFinish = () => {
    form.validateFields().then(async (value) => {
      const allData = {
        name: trimString(value?.name),
        description: value?.description,
        parent: value?.category?.value ?? '',
      };
      if (!value?.category?.value) {
        delete allData['parent'];
      }
      mutateEditCategory(allData);
    });
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleAfterVisibleChange = (value) => {
    if (value === false) {
      form.resetFields();
      reset();
    }
  };
  return (
    <div>
      <EditMenuItem {...rest} onClick={showDrawer} permission={model} />

      <Drawer
        maskClosable={false}
        title={t('Sales.Product_and_services.Categories.Category_information')}
        width={isMobile ? '80%' : isTablet ? 370 : 370}
        onClose={handleClose}
        open={visible}
        placement={t('Dir') === 'ltr' ? 'right' : 'left'}
        afterVisibleChange={handleAfterVisibleChange}
        footer={
          <div className='textAlign__end'>
            <Space>
              <CancelButton onClick={handleClose} />
              <SaveButton onClick={onFinish} loading={isLoading} />
            </Space>
          </div>
        }
      >
        <Form layout='vertical' form={form} hideRequiredMark>
          <Row>
            <Col span={24}>
              <Form.Item
                name='name'
                label={
                  <span>
                    {t('Form.Name')} <span className='star'>*</span>
                  </span>
                }
                rules={[{ required: true, message: t('Form.Name_required') }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name='description' label={t('Form.Description')}>
                <Input.TextArea showCount />
              </Form.Item>
            </Col>

            <Col span={24}>
              {record?.system_default === false && (
                <CategoryFormItem
                  place='editCategory'
                  form={form}
                  label={t('Sales.Product_and_services.Categories.Parent')}
                  url={url}
                  categoryId={record?.id}
                />
              )}
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default EditCategory;
