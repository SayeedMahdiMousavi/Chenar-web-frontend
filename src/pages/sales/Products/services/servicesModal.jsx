import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../../ApiBaseUrl';
import { GlobalHotKeys } from 'react-hotkeys';
import {
  CustomerServiceOutlined,
  CaretDownOutlined,
  // PlusOutlined,
} from '@ant-design/icons';
import {
  Form,
  Input,
  InputNumber,
  Button,
  // Select,
  Dropdown,
  Menu,
  Row,
  Col,
  // Divider,
  Modal,
  message,
} from 'antd';
import { useMediaQuery } from '../../../MediaQurey';
import { connect } from 'react-redux';
import { ModalDragTitle } from '../../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { trimString } from '../../../../Functions/TrimString';
import { ActionMessage } from '../../../SelfComponents/TranslateComponents/ActionMessage';

// import useKey from '../../../useKey'

// import { useDatabase } from "@nozbe/watermelondb/hooks";
// import withObservables from "@nozbe/with-observables";
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
// const { Option } = Select;
const layout = {
  labelCol: {
    xl: { span: 24 },
    md: { span: 24 },
    xs: { span: 24 },
  },
  wrapperCol: {
    xl: { span: 24 },
    md: { span: 24 },
    xs: { span: 24 },
  },
};

const ModalAppServices = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);
  // const database = useDatabase();
  // const [items, setItems] = useState([]);
  // const [name, setName] = useState("");
  // useEffect(() => {
  //   setItems(props.groups);
  // }, [props.groups]);
  const isMiniComputer = useMediaQuery('(max-width:1024px)');
  const isTabletBase = useMediaQuery('(max-width:768px)');
  const isMiniTablet = useMediaQuery('(max-width:576px)');
  const isMobileBase = useMediaQuery('(max-width:425px)');
  const ref = useRef(null);
  // const onNameChange = (event) => {
  //   const name = event.target.value;
  //   setName(name);
  // };

  // const addItem = async () => {
  //   //
  //   // const { items, name } = this.state;
  //   if (!name) {
  //   } else {
  //     let groups = database.collections.get("groups");
  //     await database.action(async () => {
  //       await groups.create((group) => {
  //         group.name = name;
  //       });
  //     });
  //     setItems([...items, name]);
  //     setName("");
  //   }
  // };
  const addService = async ({ value, type }) => {
    await axiosInstance
      .post(`/product_service/service/`, value)
      .then((res) => {
        // setLoading(false);
        if (type === 'submit') {
          setIsShowModal({
            visible: false,
          });
        }

        message.success(
          <ActionMessage name={res.data?.name} message='Message.Add' />,
        );
        // form.resetFields();
      })
      .catch((error) => {
        setLoading(false);
        if (error?.response?.data?.name?.[0]) {
          message.error(`${error?.response?.data?.name?.[0]}`);
        } else if (error?.response?.data?.price?.[0]) {
          message.error(`${error?.response.data?.price?.[0]}`);
        } else if (error?.response?.data?.description?.[0]) {
          message.error(`${error?.response.data?.description?.[0]}`);
        } else {
          message.error(`${t('Message.Something')}`);
        }
      });
  };
  const { mutate: mutateAddService } = useMutation(addService, {
    onSuccess: () => queryClient.invalidateQueries(`/product_service/product/`),
  });
  // if (status === "error") {
  //   message.error(`${error.response.data}`);
  // const addService1 = async (value) => {
  //   await axiosInstance
  //     .post(`/product_service/service/`, value)
  //     .then((res) => {
  //       // setLoading(false);
  //       setVisible(false);
  //       message.info(`${t("Message.Add")} ${res.data.name}`);
  //       form.resetFields();
  //     })
  //     .catch((error) => {
  //       // setLoading(false);
  //       if (error?.response?.data?.name?.[0]) {
  //         message.error(`${error?.response?.data?.name?.[0]}`);
  //       } else if (error?.response?.data?.price?.[0]) {
  //         message.error(`${error?.response.data?.price?.[0]}`);
  //       } else if (error?.response?.data?.description?.[0]) {
  //         message.error(`${error?.response.data?.description?.[0]}`);
  //       } else {
  //         message.error(`${t("Message.Something")}`);
  //       }
  //     });
  // };
  // const { mutate: mutateAddService1,isLoading} = useMutation(addService1, {
  //   onSuccess: () => queryClient.invalidateQueries(`/product_service/product/`),
  // });
  // }

  const onFinish = async (e) => {
    //
    const type = e.target.type;
    //
    // setProducts(values);
    form
      .validateFields()
      .then(async (values) => {
        // let products = database.collections.get("products");
        // await database.action(async () => {
        //   await products.create((product) => {
        //     product.name = values?.name;
        //     product.price = values?.price;
        //     product.group = values?.group;

        //     product.description = values?.description;
        //     product.status = "active";
        //     product.type = "service";
        //   });
        // });
        setLoading(true);
        const allData = {
          name: trimString(values?.name),
          price: values?.price,
          description: trimString(values?.description),
          // product_type: "service",
        };
        // if (type === "submit") {
        mutateAddService({ value: allData, type });
        //

        // return;
        // } else {
        //   mutateAddService({ value: allData, type });
        // }
      })
      .catch((info) => {});
  };

  const onReset = () => {
    form.resetFields();
    setLoading(false);
  };

  const handleAfterClose = () => {
    form.resetFields();
    setLoading(false);
  };
  const showModal = () => {
    setIsShowModal({
      visible: true,
    });

    props.closeDrawer({
      visible: false,
    });
  };
  // useKey(83,showModal)
  const handleCancel = (e) => {
    //
    setIsShowModal({
      visible: false,
    });
    form.resetFields();
    setLoading(false);
  };

  const menu = (
    <Menu>
      <Menu.Item key='0'>
        <span name='saveAnd' onClick={onFinish}>
          {' '}
          {t('Form.Save_and_new')}
        </span>
      </Menu.Item>
    </Menu>
  );

  const onOpenChange = () => {
    setVisible(!visible);
  };
  const keyMap = {
    NEW_SERVICE: ['Control+S', 'ctrl+s'],
  };
  const handlers = {
    NEW_SERVICE: (event) => {
      event.preventDefault();
      event.stopPropagation();
      props.closeDrawer({
        visible: false,
      });
      setIsShowModal({
        visible: true,
      });

      //
    },
  };
  return (
    <Row>
      <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
      <Row onClick={showModal} align='middle' className='Button'>
        <Col xl={6} md={7} xs={{ span: 7 }}>
          <CustomerServiceOutlined className='Button__icon ' />
        </Col>
        <Col
          xl={{ span: 18 }}
          md={{ span: 17, offset: 0 }}
          xs={{ span: 17, offset: 0 }}
        >
          <p className='modal__p'>
            {t('Sales.Product_and_services.Service')}
            <br />
            <span className='modal__span'>
              {t('Sales.Product_and_services.Service_description')}
            </span>
          </p>
        </Col>
      </Row>
      {/* </GlobalHotKeys> */}
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Sales.Product_and_services.Service_information')}
          />
        }
        afterClose={handleAfterClose}
        modalRender={(modal) => (
          <Draggable disabled={disabled} nodeRef={ref}>
            <div ref={ref}>{modal}</div>
          </Draggable>
        )}
        open={isShowModal.visible}
        centered
        destroyOnClose={true}
        width={
          isMobileBase
            ? '100vw'
            : isMiniTablet
              ? '70vw'
              : isTabletBase
                ? '50vw'
                : isMiniComputer
                  ? '40vw'
                  : '30vw'
        }
        onCancel={handleCancel}
        bodyStyle={styles.bodyStyle}
        footer={
          <Row gutter={[0, 15]}>
            <Col md={{ span: 21 }} sm={21} xs={21}>
              <Button
                type='primary'
                shape='round'
                onClick={onFinish}
                loading={loading}
                name='save'
                className='form-save'
                htmlType='submit'
              >
                {t('Form.Save')}
              </Button>
            </Col>
            <Col xl={3} md={3} xs={3}>
              <Dropdown
                overlay={menu}
                trigger={['click']}
                placement='bottomCenter'
                open={visible}
                onOpenChange={onOpenChange}
              >
                <Button
                  type='primary'
                  shape='round'
                  icon={<CaretDownOutlined />}
                  size='small'
                  style={styles.drop(isMobileBase, isTabletBase)}
                />
              </Dropdown>
            </Col>
            <Col span={24}>
              <Button
                onClick={onReset}
                className='num'
                type='dashed'
                htmlType='reset'
              >
                {t('Form.Reset')}
              </Button>
            </Col>
          </Row>
        }
      >
        <Form
          {...layout}
          // labelAlign={props.rtl ? "right" : "left"}
          name='nest-messages'
          // layout={isMobileBase ? "vertical" : "horizontal"}
          layout='vertical'
          hideRequiredMark={true}
          colon={false}
          form={form}
        >
          <Form.Item
            name='name'
            label={
              <span>
                {t('Form.Name')} <span className='star'>*</span>
              </span>
            }
            rules={[
              {
                required: true,
                message: t('Form.Name_required'),
              },
              {
                whitespace: true,
                message: t('Form.Name_required'),
              },
            ]}
            className='margin'
          >
            <Input autoFocus />
          </Form.Item>

          <Form.Item
            name='price'
            label={
              <span>
                {t('Sales.Product_and_services.Form.Price')}
                <span className='star'>*</span>
              </span>
            }
            className='margin'
            rules={[
              {
                message: `${t(
                  'Sales.Product_and_services.Form.Price_required',
                )}`,
                required: true,
              },
              // {
              //   pattern: /^-?\d+\.?\d*$/,
              //   // whitespace: true,
              // message: `${t("Form.Name_required")}`,
              // },
            ]}
          >
            <InputNumber
              min={1}
              type='number'
              className='num'
              inputMode='numeric'
            />
          </Form.Item>
          {/* <Form.Item
            style={styles.marginButtom(isMobileBase)}
            name='group'
            label={t("Sales.Product_and_services.Form.Category")}
          >
            <Select
              showSearch
              dropdownRender={(menu) => (
                <div>
                  {menu}
                  <Divider style={styles.divider} />
                  <div style={styles.addItem}>
                    <Input
                      style={styles.addInput}
                      value={name}
                      onChange={onNameChange}
                    />
                    <a style={styles.add} onClick={addItem}>
                      <PlusOutlined />
                      {t("Sales.Product_and_services.Form.Add_item")}
                    </a>
                  </div>
                </div>
              )}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {items.map((item) => (
                <Option value={item.name} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item> */}

          <Form.Item
            name='description'
            className='margin1'
            label={t('Form.Description')}
          >
            <Input.TextArea showCount />
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
};
const styles = {
  bodyStyle: {
    maxHeight: `calc(100vh - 194px)`,
    overflowY: 'auto',
  },
  drop: (isMobileBase, isTabletBase) => ({
    height: '100%',
    width: '100%',
  }),
};
const mapStateToProps = (state) => ({
  rtl: state.direction.rtl,
  ltr: state.direction.ltr,
});

// const enhancProduct = withObservables(["groups"], ({ database }) => ({
//   groups: database.collections.get("groups").query().observe(),
// }));

// export default connect(mapStateToProps)(
//   withDatabase(enhancProduct(ModalAppServices))
// );
export default connect(mapStateToProps)(ModalAppServices);
