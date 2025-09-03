import React, { useState, useRef } from 'react';
import { Modal, Form, Select, message, Row, Col, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import { ModalDragTitle } from '../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import AddUnit from './AddUnit';
import { ActionMessage } from '../../SelfComponents/TranslateComponents/ActionMessage';
import { InfiniteScrollSelectFormItem } from '../../../components/antd';
import { CancelButton, SaveButton } from '../../../components';
import { manageErrors, updateMessage } from '../../../Functions';

interface IProps {
  record: any;
  setVisible: (value: boolean) => void;
  baseUrl: string;
}

type Unit = { value: number; label: string };
type Unit1 = {
  default_sal: boolean;
  default_pur: boolean;
  base_unit: boolean;
  unit: { id: number; name: string };
};

export default function AddUnitsToProductItem(props: IProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [disabled, setDisabled] = useState(true);
  const [disabledUnits, setDisabledUnits] = useState<string[]>([]);
  const [form] = Form.useForm();

  const handleCancel = () => {
    setVisible(false);
  };

  const showModal = () => {
    props.setVisible(false);

    setDisabledUnits(
      props?.record?.product_units?.map((item: Unit1) => item?.unit?.name),
    );

    form.setFieldsValue({
      units: props?.record?.product_units?.map((item: Unit1) => ({
        label: item?.unit?.name,
        value: item?.unit.id,
      })),
      base_unit: props?.record?.product_units.filter(
        (item: Unit1) => item?.base_unit === true,
      )?.[0]?.unit?.id,
    });
    setVisible(true);
  };

  const editUnit = async (value: any) =>
    await axiosInstance.put(
      `${props.baseUrl}${props?.record?.id}/update_unit/`,
      value,
    );

  const handleSuccessEdit = () => {
    queryClient.invalidateQueries(`${props?.baseUrl}`);
    queryClient.invalidateQueries(`${props?.baseUrl}price/`);
  };

  const {
    mutate: mutateEditUnit,
    isLoading,
    reset,
  } = useMutation(editUnit, {
    onSuccess: () => {
      setVisible(false);
      updateMessage(t('Sales.Product_and_services.Form.Units').toLowerCase());
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
        const defaultSales = props?.record?.product_units.find(
          (item: Unit1) => item?.default_sal === true,
        )?.unit?.id;
        const defaultPurchase = props?.record?.product_units.find(
          (item: Unit1) => item?.default_pur === true,
        )?.unit?.id;
        const units = values?.units?.map((item: { value: number }) => {
          return {
            unit: item?.value,
            default_sal: item?.value === defaultSales ? true : false,
            default_pur: item?.value === defaultPurchase ? true : false,
            base_unit: item?.value === values?.base_unit ? true : false,
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
        {t('Sales.Product_and_services.Units.Add_new_units')}
      </div>
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Sales.Product_and_services.Units.Add_new_units')}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled} nodeRef={ref as React.RefObject<HTMLElement>}>
            <div ref={ref}>{modal}</div>
          </Draggable>
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
        <Form form={form} layout='vertical' hideRequiredMark>
          <Row>
            <Col span={24}>
              <InfiniteScrollSelectFormItem
                name='units'
                label={
                  <span>
                    {t('Sales.Product_and_services.Form.Units')}
                    <span className='star'>*</span>
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: t(
                      'Sales.Product_and_services.Form.Units_required',
                    ),
                  },
                ]}
                addItem={<AddUnit form={form} type='addUnits' />}
                style={{}}
                fields='name,id,symbol'
                mode='multiple'
                baseUrl='/product/unit/'
                disabledOption={(item: any) =>
                  disabledUnits?.includes(item?.name)
                }
                allowClear={true}
              />
            </Col>
            <Col span={24}>
              <Form.Item
                name='base_unit'
                style={styles.formItem}
                label={t('Sales.Product_and_services.Form.Base_unit')}
              >
                <Select disabled>
                  {props?.record?.product_units?.map((item: any) => (
                    <Select.Option value={item?.unit?.id} key={item?.unit?.id}>
                      {item?.unit?.name}
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
