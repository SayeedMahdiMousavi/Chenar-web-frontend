import React from 'react';
import { Row, Col, Select, Form, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../ApiBaseUrl';
import { useQuery } from 'react-query';
import { ApplyButton, ResetButton } from '../../../../components';

const { Option } = Select;
interface Props {
  setStatus1: (status: boolean | string) => void;
  setVisible: (visible: boolean) => void;
}

const Filters: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const getWarehouse = async () => {
    const { data } = await axiosInstance.get(
      `/inventory/warehouse/?page_size=10&ordering=-id`
    );
    return data;
  };

  const Warehouse = useQuery('/inventory/warehouse/', getWarehouse);

  const onFinish = async (values: any) => {
    if (values.status === 'active') {
      props.setStatus1(true);
    } else if (values.status === 'inActive') {
      props.setStatus1(false);
    } else {
      props.setStatus1('known');
    }
    props.setVisible(false);
  };
  const onReset = () => {
    form.resetFields();
    props.setVisible(false);
    props.setStatus1(true);
  };
  return (
    <Form
      layout='vertical'
      onFinish={onFinish}
      form={form}
      initialValues={{
        status: 'active',
      }}
      className='table__header1-filter-drop'
    >
      <Row>
        <Col offset={2} span={20}>
          <Form.Item
            label={<span> {t('Warehouse.1')}</span>}
            name='display_name'
          >
            <Select
              showSearch
              showArrow
              allowClear
              optionLabelProp='label'
              optionFilterProp='label'
              dropdownRender={(menu) => <div>{menu}</div>}
            >
              {Warehouse &&
                Warehouse.data &&
                Warehouse.data.results &&
                Warehouse?.data?.results?.map(
                  (item: { id: string; name: string }) => (
                    <Option value={item.id} key={item.id} label={item.name}>
                      {item.name}
                    </Option>
                  )
                )}
            </Select>
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item>
            <Row className='num'>
              <Col
                xl={{ span: 4, offset: 2 }}
                md={{ span: 6, offset: 2 }}
                xs={{ span: 4, offset: 2 }}
              >
                <ResetButton htmlType='reset' onClick={onReset} />
              </Col>
              <Col
                xl={{ span: 4, offset: 9 }}
                md={{ span: 6, offset: 6 }}
                xs={{ span: 4, offset: 7 }}
              >
                <ApplyButton />
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default Filters;
