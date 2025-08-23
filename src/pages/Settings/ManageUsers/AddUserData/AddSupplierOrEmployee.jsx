import React from 'react';
import { Form, Select, Input, Button, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDatabase } from '@nozbe/watermelondb/hooks';
// import withObservables from "@nozbe/with-observables";
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
const { Title } = Typography;
const AddSupplierOrEmployee = (props) => {
  const database = useDatabase();
  const [form] = Form.useForm();
  const addItem = async (values) => {
    //
    // const { items, name } = this.state;
    // if (!name) {
    // } else {
    let groups = database.collections.get('groups');
    await database.action(async () => {
      await groups.create((group) => {
        group.name = values.name;
      });
    });
    //   setItems([...items, name]);
    //   setName("");
    // }
    props.set(values.name);
    props.cancel();
  };
  const { t } = useTranslation();
  const onCancel = () => {
    props.cancel();
  };
  //   const onSave = () => {};
  return (
    <Form
      layout='vertical'
      onFinish={addItem}
      hideRequiredMark={true}
      form={form}
    >
      <Title level={4} style={styles.title}>
        New name
      </Title>
      <Form.Item
        name='name'
        clickable='ant-select-dropdown'
        label={
          <p>
            {t('Form.Name')} <span className='star'>*</span>
          </p>
        }
        style={styles.margin}
        rules={[{ required: true, message: 'name is required !' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label='Type' style={styles.margin}>
        <Select defaultValue='supplier'>
          <Select.Option value='supplier'>Supplier</Select.Option>
          <Select.Option value='employee'>Employee</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <div className='import__footer'>
          <div>
            <Button style={styles.cancel} shape='round' onClick={onCancel}>
              {t('Form.Cancel')}
            </Button>
          </div>
          <div>
            <Button
              type='primary'
              shape='round'
              htmlType='submit'
              //   onClick={onSave}
              style={styles.cancel}
            >
              {t('Form.Save')}
            </Button>
          </div>
        </div>
      </Form.Item>
    </Form>
  );
};
const styles = {
  cancel: { margin: ' 15px 15px 0 15px' },
  margin: { margin: ' 0 15px 10px 15px' },
  title: { margin: '8px 15px' },
};
export default AddSupplierOrEmployee;
