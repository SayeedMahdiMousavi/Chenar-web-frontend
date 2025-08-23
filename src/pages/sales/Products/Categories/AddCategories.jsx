import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import axiosInstance from '../../../ApiBaseUrl';

import { Form, Col, Row, Input, Space, Modal } from 'antd';
import { useMediaQuery } from '../../../MediaQurey';
import { trimString } from '../../../../Functions/TrimString';
import {
  CancelButton,
  PageNewButton,
  SaveButton,
} from '../../../../components';
import { addMessage, manageErrors } from '../../../../Functions';

const addTreeData = (list, parent, children) => {
  return list?.map((node) => {
    if (node.id === parent) {
      return {
        ...node,
        children: node?.children ? [...node.children, children] : [children],
      };
    } else if (node.children?.[0]) {
      return {
        ...node,
        children: addTreeData(node.children, parent, children),
      };
    }
    return node;
  });
};

const AddCategory = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [subCategory, setSubCategory] = useState(false);
  const isTablet = useMediaQuery('(max-width:768px)');
  const isMobile = useMediaQuery('(max-width:425px)');

  const showDrawer = () => {
    setVisible(true);
  };

  const handleAddCategory = async (value) =>
    await axiosInstance.post(props.url, value);

  const {
    mutate: mutateAddCategory,
    isLoading,
    reset,
  } = useMutation(handleAddCategory, {
    onSuccess: (values) => {
      setVisible(false);
      props.setTreeData((prev) => {
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
      addMessage(values?.data?.name);
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const onFinish = () => {
    form.validateFields().then(async (value) => {
      mutateAddCategory({
        name: trimString(value?.name),
        description: value?.description,
      });
    });
    form.resetFields();
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleAfterVisibleChange = (value) => {
    if (value === false) {
      form.resetFields();
      setSubCategory(false);
      reset();
    }
  };

  return (
    <div>
      <PageNewButton
        onClick={showDrawer}
        // model={props?.model}
      />

      <Modal
        maskClosable={false}
        title={t('Sales.Product_and_services.Categories.Category_information')}
        width={isMobile ? '80%' : isTablet ? 370 : 370}
        onCancel={handleClose}
        open={visible}
        // placement={t("Dir") === "ltr" ? "right" : "left"}
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
                <Input autoFocus autoComplete='off' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name='description' label={t('Form.Description')}>
                <Input.TextArea showCount />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AddCategory;
