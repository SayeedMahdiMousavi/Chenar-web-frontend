import { Form } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CancelButton,
  DraggableModal,
  PageNewButton,
  SaveButton,
} from '../../../components';
import { PRODUCT_INVENTORY_M } from '../../../constants/permissions';
import { PRODUCT_INVENTORY_LIST } from '../../../constants/routes';
import {
  changeGToJ,
  handlePrepareDateForServer,
  utcDate,
} from '../../../Functions/utcDate';
import ProductInventoryFormItems from './FormItems';
import dayjs from 'dayjs';
import { useGetCalender } from '../../../Hooks';
import axiosInstance from '../../ApiBaseUrl';
import { useMutation } from 'react-query';
import { addMessage, manageErrors } from '../../../Functions';

const dateFormat = 'YYYY-MM-DD HH:mm';
const expireDateFormat = 'YYYY-MM-DD';
function AddProductInventory(props: { handleUpdateItems: () => void }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { t } = useTranslation();

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddProductInventory = async (value: any) => {
    return await axiosInstance.post(PRODUCT_INVENTORY_LIST, value);
  };

  const {
    mutate: mutateAddProductInventory,
    isLoading,
    reset,
  } = useMutation(handleAddProductInventory, {
    onSuccess: (values) => {
      setIsModalVisible(false);
      addMessage(values?.data?.product?.label);
      props.handleUpdateItems();
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      const unitConversion = form.getFieldValue('unitConversion');

      mutateAddProductInventory({
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
      <PageNewButton onClick={showModal} model={PRODUCT_INVENTORY_M} />
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
        <Form
          form={form}
          layout='vertical'
          hideRequiredMark
          initialValues={{
            registerDate:
              calendarCode === 'gregory'
                ? utcDate()
                : dayjs(changeGToJ(utcDate().format(dateFormat), dateFormat), {
                    //@ts-ignore
                    jalali: true,
                  }),
          }}
        >
          <ProductInventoryFormItems form={form} />
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
AddProductInventory = React.memo(AddProductInventory);

export default AddProductInventory;
