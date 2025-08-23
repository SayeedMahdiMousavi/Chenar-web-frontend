import React, { useState } from 'react';
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
import { useGetDefaultCategory } from '../../../Hooks';
import { CancelButton, PageNewButton, SaveButton } from '../../../components';
import { EXPENSE_TYPE_M } from '../../../constants/permissions';
import { addMessage, manageErrors } from '../../../Functions';

interface IProps {
  type: string;
  baseUrl: string;
}

const AddExpense = (props: IProps) => {
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

  // open add expense method
  const showModal = () => {
    setIsShowModal({
      visible: true,
    });
  };

  //cancel add expense method
  const onCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };

  //get default category
  const defaultCategory = useGetDefaultCategory(`${props.baseUrl}category/`);

  //add expense
  const addExpense = async (value: any) =>
    await axiosInstance.post(`${props.baseUrl}`, value);

  const {
    mutate: mutateAddExpense,
    isLoading,
    reset,
  } = useMutation(addExpense, {
    onSuccess: (values: any) => {
      setIsShowModal({
        visible: false,
      });
      addMessage(values?.data?.name);

      queryClient.invalidateQueries(props.baseUrl);
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  //on submit method
  const handleOk = () => {
    form.validateFields().then(async (values) => {
      const data = {
        name: trimString(values.name),
        category: values?.category?.value,
      };
      mutateAddExpense(data);
    });
  };

  //after close method
  const handelAfterClose = () => {
    form.resetFields();
    reset();
  };

  return (
    <div>
      {props?.type === 'expense' ? (
        <PageNewButton onClick={showModal} model={EXPENSE_TYPE_M} />
      ) : (
        <div onClick={showModal}>{t('Expenses.New_expense')} </div>
      )}
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
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
        centered
        open={isShowModal.visible}
        onCancel={onCancel}
        destroyOnClose
        afterClose={handelAfterClose}
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
          initialValues={{
            category: { label: defaultCategory?.name, value: 1 },
          }}
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
              url={`${props.baseUrl}category/`}
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

export default AddExpense;
