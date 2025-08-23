import React, { useEffect } from 'react';
import { Form } from 'antd';
import { InfiniteScrollSelectFormItem } from '../../../components/antd';
import { useTranslation } from 'react-i18next';
import useGetDefaultWarehouse from '../../../Hooks/useGetDefaultWarehouse';
interface Props {
  setWarehouse: (value: any) => void;
  editingKey: string;
  warehouse?: any;
}

const FiltersWarehouse: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onChangeWarehouse = (value: any) => {
    props?.setWarehouse(value);
  };

  //get default warehouse
  const defaultWarehouse = useGetDefaultWarehouse();

  const warehouseName = defaultWarehouse?.name;
  const warehouseId = defaultWarehouse?.id;

  useEffect(() => {
    if (props?.warehouse === undefined && defaultWarehouse?.id) {
      props?.setWarehouse({
        label: warehouseName,
        value: warehouseId,
      });
      form.setFieldsValue({
        warehouse: {
          label: warehouseName,
          value: warehouseId,
        },
      });
    }
  }, [defaultWarehouse, form, props, warehouseId, warehouseName]);

  return (
    <Form form={form}>
      <InfiniteScrollSelectFormItem
        name='warehouse'
        placeholder={t('Warehouse.1')}
        style={{}}
        fields='name,id'
        onChange={onChangeWarehouse}
        baseUrl='/inventory/warehouse/'
      />
    </Form>
  );
};

export default FiltersWarehouse;
