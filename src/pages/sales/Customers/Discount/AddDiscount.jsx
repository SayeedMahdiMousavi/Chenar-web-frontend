import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
// import withObservables from "@nozbe/with-observables";
import { useMutation, useQueryClient, useQuery } from 'react-query';
import axiosInstance from '../../../ApiBaseUrl';
// import useKey from "../../../useKey";
// import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import AddType from './Type/AddType';
import EditType from './Type/EditType';
import DeleteType from './Type/DeleteType';
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  // Select,
  // Checkbox,
  message,
  // TreeSelect,
  Select,
  InputNumber,
  Space,
  // AutoComplete,
} from 'antd';
// import { PlusOutlined } from "@ant-design/icons";
import { useMediaQuery } from '../../../MediaQurey';
// import { useDatabase } from "@nozbe/watermelondb/hooks";
import { connect } from 'react-redux';
import { ActionMessage } from '../../../SelfComponents/TranslateComponents/ActionMessage';
import { trimString } from '../../../../Functions/TrimString';

// const { Option } = Select;

const AddDiscount = (props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const isTablet = useMediaQuery('(max-width:768px)');
  const isMobile = useMediaQuery('(max-width:425px)');
  // const database = useDatabase();
  const [loading, setLoading] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const getType = async (key) => {
    const { data } = await axiosInstance.get(
      `/customer_account/discount/type/?page=1&page_size=100&ordering=-id`,
    );
    return data;
  };
  const { data } = useQuery('/customer_account/discount/type/', getType);
  //
  const onClose = () => {
    setVisible(false);
    form.resetFields();
    setLoading(false);
  };
  const addCardData = async (value) => {
    await axiosInstance
      .post(`/customer_account/discount/card/`, value)
      .then((res) => {
        setLoading(false);
        setVisible(false);
        form.resetFields();

        message.success(
          <ActionMessage name={res.data?.name} message='Message.Add' />,
        );
      })
      .catch((error) => {
        setLoading(false);
        if (error?.response?.data?.name?.[0]) {
          message.error(`${error?.response?.data?.name?.[0]}`);
        } else if (error?.response?.data?.percent?.[0]) {
          message.error(`${error?.response.data?.percent?.[0]}`);
        } else if (error?.response?.data?.number_of_month?.[0]) {
          message.error(`${error?.response.data?.number_of_month?.[0]}`);
        } else if (error?.response?.data?.type?.[0]) {
          message.error(`${error?.response.data?.type?.[0]}`);
        }
      });
  };
  const { mutate: mutateAddCardData } = useMutation(addCardData, {
    onSuccess: () =>
      queryClient.invalidateQueries(`/customer_account/discount/card/`),
  });
  // if (status === "error") {
  //   message.error(`${error.response.data}`);
  // }
  const onFinish = () => {
    form
      .validateFields()
      .then(async (value) => {
        //
        setLoading(true);

        //
        const allData = {
          name: trimString(value?.name),
          number_of_month: parseInt(value?.number_of_month),
          percent: value?.percent,
          type: value?.type,
        };
        mutateAddCardData(allData, {});
      })
      .catch((info) => {});
  };
  // useKey("Enter", onFinish);
  const onClickSpace = (e) => {
    e.stopPropagation();
  };

  return (
    <div>
      <Button type='primary' block shape='round' onClick={showDrawer}>
        {t('Sales.Product_and_services.New')}
      </Button>
      <Drawer
        maskClosable={false}
        title={t('Sales.Customers.Discount.Card_information')}
        width={isMobile ? '80%' : isTablet ? '45%' : '30%'}
        onClose={onClose}
        open={visible}
        placement={t('Dir') === 'ltr' ? 'right' : 'left'}
        footer={
          <div style={styles.footer(props.rtl)}>
            <Button onClick={onClose} shape='round' style={styles.cancel}>
              {t('Form.Cancel')}
            </Button>
            <Button
              onClick={onFinish}
              shape='round'
              type='primary'
              loading={loading}
            >
              {t('Form.Save')}
            </Button>
          </div>
        }
      >
        <Form layout='vertical' form={form} hideRequiredMark>
          <Row>
            <Col span={24}>
              <Form.Item
                name='name'
                label={
                  <p>
                    {t('Form.Name')} <span className='star'>*</span>
                  </p>
                }
                style={styles.margin}
                rules={[
                  { required: true, message: `${t('Form.Name_required')}` },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name='percent'
                style={styles.margin}
                label={
                  <span>
                    {t('Sales.Customers.Discount.Percent')}
                    <span className='star'>*</span>
                  </span>
                }
                rules={[
                  {
                    message: `${t(
                      'Sales.Customers.Discount.Required_percent',
                    )}`,
                    required: true,
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  max={99}
                  // type="number"
                  className='num'
                  // inputMode="numeric"
                  formatter={(value) => `${value}%`}
                  parser={(value) => value.replace('%', '')}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name='number_of_month'
                label={
                  <span>
                    {t('Sales.Product_and_services.Inventory.Expiration_date')}
                    <span className='star'>*</span>
                  </span>
                }
                style={styles.margin}
                rules={[
                  {
                    message: `${t(
                      'Sales.Customers.Discount.Required_expiration_data',
                    )}`,
                    required: true,
                    whitespace: true,
                  },
                ]}
              >
                <Input
                  min={1}
                  type='number'
                  // style={{ width: `calc(100% - 60px)` }}
                  inputMode='numeric'
                  // formatter={(value) => `${value}M`}
                  // parser={(value) => value.replace("M", "")}
                  suffix={<span>{t('Sales.Customers.Discount.Month')}</span>}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name='type'
                label={
                  <span>
                    {t('Sales.Product_and_services.Type')}
                    <span className='star'>*</span>
                  </span>
                }
                rules={[
                  {
                    required: true,

                    message: `${t('Sales.Customers.Discount.Required_type')}`,
                  },
                ]}
              >
                <Select
                  showSearch
                  showArrow
                  allowClear
                  // loading={isLoading || isFetching ? true : false}
                  optionLabelProp='label'
                  optionFilterProp='label'
                  popupClassName='z_index'
                  dropdownRender={(menu) => (
                    <div>
                      <AddType form={form} />
                      {menu}
                    </div>
                  )}
                >
                  {data?.results?.map((item) => (
                    <Select.Option
                      value={item.id}
                      key={item.id}
                      label={item.name}
                    >
                      <Row justify='space-between'>
                        <Col>{item.name}</Col>
                        <Col>
                          <Space
                            size='small'
                            onClick={onClickSpace}
                            onDoubleClick={onClickSpace}
                          >
                            <DeleteType record={item} />
                            <EditType record={item} />
                          </Space>
                        </Col>
                      </Row>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};
const styles = {
  margin: { marginBottom: '12px' },
  cancel: { margin: ' 0 8px' },
  footer: (rtl) => ({
    textAlign: rtl ? 'left' : 'right',
  }),
};
const mapStateToProps = (state) => ({
  rtl: state.direction.rtl,
  ltr: state.direction.ltr,
});

// const enhanceGroup = withObservables(["groups"], ({ database }) => ({
//   groups: database.collections.get("groups").query().observe(),
// }));

// export default connect(mapStateToProps)(
//   withDatabase(enhanceGroup(AddCategory))
// );
export default connect(mapStateToProps)(AddDiscount);
