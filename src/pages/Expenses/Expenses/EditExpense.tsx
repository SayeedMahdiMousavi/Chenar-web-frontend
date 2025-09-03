import React, { useState, useRef } from 'react';
import { Modal, Col, Row } from 'antd';
import { useMediaQuery } from '../../MediaQurey';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import { Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { ModalDragTitle } from '../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { CategoryField } from '../../SelfComponents/CategoryField';
import { Styles } from '../../styles';
import { trimString } from '../../../Functions/TrimString';
import { CancelButton, EditMenuItem, SaveButton } from '../../../components';
import { EXPENSE_TYPE_M } from '../../../constants/permissions';
import { manageErrors, updateMessage } from '../../../Functions';

interface IProps {
  record: any;
  setVisible: (value: boolean) => void;
  handleClickEdit: () => void;
  baseUrl: string;
}
const EditExpense: React.FC<IProps> = ({
  record,
  setVisible,
  baseUrl,
  handleClickEdit,
  ...rest
}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [disabled, setDisabled] = useState(true);
  const isBgTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');
  const ref = useRef(null);

  const showModal = () => {
    setVisible(false);
    handleClickEdit();
    setIsShowModal({
      visible: true,
    });
    form.setFieldsValue({
      name: record?.name,
      category: {
        value: record?.category?.id,
        label: record?.category?.name,
      },
    });
  };

  const onCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };

  const addExpense = async (value: any) =>
    await axiosInstance.put(`${baseUrl}${record?.id}/`, value);

  const {
    mutate: mutateAddExpense,
    isLoading,
    reset,
  } = useMutation(addExpense, {
    onSuccess: (values: any) => {
      setIsShowModal({
        visible: false,
      });
      updateMessage(values?.data?.name);
      queryClient.invalidateQueries(baseUrl);
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      mutateAddExpense({
        name: trimString(values.name),
        category: values?.category?.value && values?.category?.value,
      });
    });
  };

  //after close method
  const handelAfterClose = () => {
    form.resetFields();
    reset();
  };

  return (
    <div>
      <EditMenuItem {...rest} onClick={showModal} permission={EXPENSE_TYPE_M} />

      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Expenses.Definition_expense_information')}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled} nodeRef={ref as React.RefObject<HTMLElement>}>
            <div ref={ref}>{modal}</div>
          </Draggable>
        )}
        centered
        afterClose={handelAfterClose}
        destroyOnClose
        open={isShowModal.visible}
        onCancel={onCancel}
        wrapClassName='warehouse_add_modal'
        style={Styles.modal(isMobile)}
        bodyStyle={Styles.modalBody(isMobile, isSubBase, isMiniTablet)}
        width={isMobile ? '100%' : isTablet ? 360 : isBgTablet ? 360 : 360}
        footer={
          <Row justify='end' align='middle'>
            <Col>
              <CancelButton onClick={onCancel} />
              <SaveButton onClick={handleOk} loading={isLoading} />
            </Col>
          </Row>
        }
      >
        <Form
          form={form}
          hideRequiredMark={true}
          scrollToFirstError={true}
          layout='vertical'
        >
          <Form.Item
            label={
              <span>
                {t('Form.Name')}
                <span className='star'>*</span>
              </span>
            }
            name='name'
            rules={[{ required: true, message: t('Form.Name_required') }]}
          >
            <Input autoFocus autoComplete='off' />
          </Form.Item>
          <Form.Item noStyle>
            <CategoryField
              form={form}
              place='expense'
              url={`${baseUrl}category/`}
              label={
                <span>
                  {t('Sales.Product_and_services.Form.Category')}
                  <span className='star'>*</span>
                </span>
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EditExpense;
