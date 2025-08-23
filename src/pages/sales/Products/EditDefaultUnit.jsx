import React, { useState } from 'react';
import { Modal, Form, Select, message, Row, Col, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import { ModalDragTitle } from '../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { ActionMessage } from '../../SelfComponents/TranslateComponents/ActionMessage';
import { CancelButton, SaveButton } from '../../../components';
import { manageErrors, updateMessage } from '../../../Functions';

export default function EditDefaultUnit(props) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [units, setUnits] = useState([]);
  const [form] = Form.useForm();

  const handleCancel = () => {
    setVisible(false);
  };

  const showModal = () => {
    props.setVisible(false);

    const units = props?.record?.product_units?.map((item) => ({
      label: item?.unit?.name,
      value: item?.unit?.id,
    }));

    setUnits(units);

    form.setFieldsValue({
      default_sal: props?.record?.product_units.filter(
        (item) => item?.default_sal === true,
      )?.[0]?.unit?.id,
      default_pur: props?.record?.product_units.filter(
        (item) => item?.default_pur === true,
      )?.[0]?.unit?.id,
    });
    setVisible(true);
  };

  const editUnit = async (value) =>
    await axiosInstance.put(
      `${props.baseUrl}${props?.record?.id}/update_unit/`,
      value,
    );

  const handleSuccessEdit = () => {
    queryClient.invalidateQueries(props.baseUrl);
  };

  const {
    mutate: mutateEditUnit,
    isLoading,
    reset,
  } = useMutation(editUnit, {
    onSuccess: () => {
      setVisible(false);
      updateMessage(
        t('Sales.Product_and_services.Form.Default_unit').toLowerCase(),
      );
      handleSuccessEdit();
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const onFinish = () => {
    form
      .validateFields()
      .then(async (values) => {
        const units = props?.record?.product_units?.map((item) => {
          return {
            unit: item?.unit?.id,
            default_sal: item?.unit?.id === values.default_sal ? true : false,
            default_pur: item?.unit?.id === values.default_pur ? true : false,
            base_unit: item?.base_unit === true ? true : false,
          };
        });
        mutateEditUnit(units);
      })
      .catch((info) => {});
  };

  const handleAfterClose = () => {
    form.resetFields();
    reset();
  };

  return (
    <div>
      <div onClick={showModal} className='num'>
        {t('Sales.Product_and_services.Edit_default_unit')}
      </div>
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Sales.Product_and_services.Edit_default_unit')}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
        afterClose={handleAfterClose}
        destroyOnClose
        open={visible}
        width={320}
        centered
        onCancel={handleCancel}
        onOk={onFinish}
        footer={
          <Row justify='end'>
            <Col>
              <CancelButton onClick={handleCancel} />
              <SaveButton onClick={onFinish} loading={isLoading} />
            </Col>
          </Row>
        }
      >
        <Form form={form} layout='vertical'>
          <Row>
            <Col span={24}>
              <Form.Item
                name='default_pur'
                label={t('Sales.Product_and_services.Form.Purchases_unit')}
              >
                <Select>
                  {units?.map((item) => (
                    <Select.Option value={item?.value} key={item?.label}>
                      {item?.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name='default_sal'
                style={styles.formItem}
                label={t('Sales.Product_and_services.Form.Sales_unit')}
              >
                <Select>
                  {units?.map((item) => (
                    <Select.Option value={item?.value} key={item?.label}>
                      {item?.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
const styles = {
  formItem: { marginBottom: '10px' },
};
