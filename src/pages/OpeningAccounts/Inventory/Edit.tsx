import { Form } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CancelButton,
  DraggableModal,
  EditButton,
  SaveButton,
} from '../../../components';
import { PRODUCT_INVENTORY_M } from '../../../constants/permissions';
import { PRODUCT_INVENTORY_LIST } from '../../../constants/routes';
import {
  handlePrepareDateForDateField,
  handlePrepareDateForServer,
} from '../../../Functions/utcDate';
import ProductInventoryFormItems from './FormItems';
import { useGetCalender } from '../../../Hooks';
import axiosInstance from '../../ApiBaseUrl';
import { useMutation } from 'react-query';
import { manageErrors, updateMessage } from '../../../Functions';

const expireDateFormat = 'YYYY-MM-DD';
function EditProductInventory({
  handleUpdateItems,
  id,
  productName,
  productId,
  unitName,
  unitId,
  warehouseName,
  warehouseId,
  registerDate,
  expirationDate,
  price,
  qty,
  unitConversion,
  hasSelected,
}: any) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [product, setProduct] = useState('');

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  const showModal = () => {
    form.setFieldsValue({
      product: { value: productId, label: productName },
      unit: { value: unitId, label: unitName },
      warehouse: { value: warehouseId, label: warehouseName },
      price,
      ...(expirationDate
        ? {
            expirationDate: handlePrepareDateForDateField({
              calendarCode,
              date: expirationDate,
              dateFormat: expireDateFormat,
            }),
          }
        : {}),
      registerDate: handlePrepareDateForDateField({
        calendarCode,
        date: registerDate,
      }),
      qty,
      unitConversion,
    });
    setProduct(productId);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEditProductInventory = async (value: any) => {
    return await axiosInstance.put(`${PRODUCT_INVENTORY_LIST}${id}/`, value);
  };

  const {
    mutate: mutateEditProductInventory,
    isLoading,
    reset,
  } = useMutation(handleEditProductInventory, {
    onSuccess: (values) => {
      setIsModalVisible(false);
      updateMessage(values?.data?.product?.label);
      handleUpdateItems();
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      const unitConversion = form.getFieldValue('unitConversion');

      mutateEditProductInventory({
        product: values?.product?.value,
        unit: values?.unit?.value,
        unit_conversion_rate: unitConversion,
        warehouse_in: values?.warehouse?.value,
        qty: values?.qty,
        each_price: values?.price,
        expire_date: handlePrepareDateForServer({
          date: values?.expirationDate,
          calendarCode,
          dateFormat: expireDateFormat,
        }),
        registered_date: handlePrepareDateForServer({
          date: values?.registerDate,
          calendarCode,
        }),
      });
    });
  };

  const handleAfterClose = () => {
    form.resetFields();
    reset();
  };

  return (
    <>
      <EditButton
        onClick={showModal}
        model={PRODUCT_INVENTORY_M}
        disabled={hasSelected}
      />

      <DraggableModal
        title={t('Product_inventory_information')}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={420}
        bodyStyle={styles.modalBody}
        afterClose={handleAfterClose}
        footer={
          <>
            <CancelButton onClick={handleCancel} />
            <SaveButton onClick={handleOk} loading={isLoading} />
          </>
        }
      >
        <Form form={form} layout='vertical' hideRequiredMark>
          <ProductInventoryFormItems {...{ setProduct, product, form }} />
        </Form>
      </DraggableModal>
    </>
  );
}

const styles = {
  modalBody: { padding: '10px 30px' },
};

//@ts-ignore
// eslint-disable-next-line no-func-assign
EditProductInventory = React.memo(EditProductInventory);

export default EditProductInventory;
