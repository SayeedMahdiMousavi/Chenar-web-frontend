import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../../MediaQurey';
import { Colors } from '../../colors';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import {
  TreeSelect,
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  message,
  Typography,
  Radio,
  Alert,
  Select,
} from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { ActionMessage } from '../../SelfComponents/TranslateComponents/ActionMessage';
import { trimString } from '../../../Functions/TrimString';
import { InfiniteScrollSelectFormItem } from '../../../components/antd';
import { useGetDefaultEmployee, useGetPermissions } from '../../../Hooks';
import { permissionsList, USERS_M } from '../../../constants/permissions';

import {
  CancelButton,
  PageNewButton,
  PermissionsFormItem,
  SaveButton,
} from '../../../components';
import { ROLES_LIST } from '../../../constants/routes';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const AddUser = (props) => {
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const [user, setUser] = useState('admin');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [errorMessage, setErrorMessage] = useState(false);
  // const [access, setAccess] = useState("");
  // const [openSelect, setOpenSelect] = useState(false);
  // const [timeSheets, setTimeSheets] = useState("");
  const { t } = useTranslation();
  const [values, setValues] = useState({});
  const isMiniTablet = useMediaQuery('(max-width:576px)');
  const isMobile = useMediaQuery('(max-width:425px)');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [permissionsState, setPermissionsState] = useState([]);
  const [roleId, setRoleId] = useState(null);
  const [permissionsId, setPermissionsId] = useState(null);

  //get permissions list
  const { data: permissions } = useGetPermissions();

  //get default employee
  const defaultEmployee = useGetDefaultEmployee();

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
    setCurrent(0);
    setUser('admin');
    form.resetFields();
  };
  const onChangeName = async (e) => {
    const row = await form.getFieldsValue();
    setUser(row.user);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);

    if (
      reg.test(e.target.value) &&
      reg1.test(e.target.value) &&
      reg2.test(e.target.value) &&
      e.target.value !== userName
    ) {
      setErrorMessage(false);
    }
  };
  const onChangeUserName = (e) => {
    setUserName(e.target.value);
  };

  //steps
  const next = async () => {
    const curren = current + 1;
    setCurrent(curren);
    const row = await form.getFieldsValue();
    setValues((prev) => {
      return { ...prev, ...row };
    });
  };

  const prev = () => {
    const curren = current - 1;
    setCurrent(curren);
  };
  const addUser = async (value) => {
    await axiosInstance
      .post(`${props.baseUrl}`, value)
      .then((res) => {
        setVisible(false);

        message.success(
          <ActionMessage name={res?.data?.username} message='Message.Add' />,
        );
      })
      .catch((error) => {
        setLoading(false);
        if (error?.response.data?.user_type?.[0]) {
          message.error(`${error?.response.data?.user_type?.[0]}`);
        } else if (error?.response?.data?.username?.[0]) {
          message.error(`${error?.response.data?.username?.[0]}`);
        } else if (error?.response?.data?.first_name?.[0]) {
          message.error(`${error?.response.data?.first_name?.[0]}`);
        } else if (error?.response?.data?.user_staff?.[0]) {
          message.error(`${error?.response.data?.user_staff?.[0]}`);
        } else if (error?.response?.data?.email?.[0]) {
          message.error(`${error?.response.data?.email?.[0]}`);
        } else if (error?.response?.data?.password?.[0]) {
          message.error(`${error?.response.data?.password?.[0]}`);
        }
      });
  };
  const { mutate: mutateAddUser } = useMutation(addUser, {
    onSuccess: () => queryClient.invalidateQueries(`${props.baseUrl}`),
  });

  const onSubmit = () => {
    form
      .validateFields()
      .then(async (value) => {
        if (
          !reg.test(password) ||
          !reg1.test(password) ||
          !reg2.test(password) ||
          password === userName
        ) {
          setErrorMessage(true);
          return;
        } else {
          setErrorMessage(false);

          const allData = {
            username: trimString(value?.userName),
            first_name: trimString(value?.firstName),
            email: trimString(value?.email),
            password: value?.password,
            user_type: values?.user,
            user_group: [roleId],
            // permits: values?.permissions,
            // user_permissions:values?.permissions,
            ...(permissionsId?.length > 0
              ? { user_permissions: permissionsId }
              : {}),
            user_staff: value?.employee?.value,
            user_calender: 2,
            user_theme: 2,
            user_language: 'fa',
          };
          // const userType = user;
          // console.log("allData" , allData , "value" , value)
          // if (Boolean(values?.permissions) && userType !== "admin") {
          //   message.error(t("Manage_users.Permissions_required"));
          // } else {
          setLoading(true);
          mutateAddUser(allData);
          // }
        }
      })
      .catch((info) => {});
  };

  const handleAfterVisibleChange = () => {
    setLoading(false);
    setCurrent(0);
    setUser('admin');
    form.resetFields();
    setValues({});
    setPassword('');
    setUserName('');
    setErrorMessage(false);
  };

  const handleGetPermissionFunction = async () => {
    const { data } = await axiosInstance.get(
      '/user_account/permit/?page=1&page_size=10000',
    );
    return data;
  };

  const permissionData = useQuery('', handleGetPermissionFunction);

  if (
    permissionData?.data?.results?.length > 0 &&
    permissionsState?.length === 0
  ) {
    let createPermissions = [];
    let tempPermission = [];
    for (let obj of permissionData?.data?.results || []) {
      if (tempPermission?.length <= 4) {
        let data = {
          codeName: obj?.id,
          key: obj?.codename,
          title: obj?.name,
          id: obj.id,
        };
        tempPermission.push(data);
        if (tempPermission?.length === 4) {
          createPermissions.push({
            model: tempPermission?.[0]?.title,
            title: tempPermission?.[0]?.title,
            key: tempPermission?.[0]?.id,
            children: tempPermission,
          });
          tempPermission = [];
        }
      }
    }
    // const createPermissionList = permissionData?.data?.results?.map((item:any) =>{

    // })
    //
    setPermissionsState(createPermissions);
  }

  const handelGetRole = async () => {
    const { data } = await axiosInstance.get(
      `${ROLES_LIST}?page=1&page_size=20`,
    );

    return data;
  };
  const roleData = useQuery('getRole', handelGetRole);

  const handleChangeRoleFunction = (event) => {
    setRoleId(event);
  };

  const handelGetPermissionsId = (data) => {
    setPermissionsId(data);
  };
  return (
    <div>
      <PageNewButton onClick={showDrawer} model={USERS_M} />
      <Drawer
        maskClosable={false}
        mask={true}
        title={t('Manage_users.Add_user_title')}
        height='100%'
        onClose={onClose}
        afterVisibleChange={handleAfterVisibleChange}
        open={visible}
        placement='top'
        bodyStyle={{ paddingBottom: 10 }}
        footer={
          <div className='import__footer'>
            <div>
              {current === 0 && <CancelButton onClick={onClose} />}
              {current > 0 && (
                <Button onClick={() => prev()}>{t('Step.Previous')}</Button>
              )}
            </div>
            <div>
              {(user === 'admin' && current < 1) ||
              (user === 'custom' && current < 2) ||
              (user === 'standard' && current < 1) ||
              (user === 'report_only' && current < 1) ? (
                <Button type='primary' onClick={() => next()}>
                  {t('Step.Next')}
                </Button>
              ) : (
                <SaveButton onClick={onSubmit} loading={loading} />
              )}
            </div>
          </div>
        }
      >
        <Form
          form={form}
          layout='vertical'
          hideRequiredMark
          className='num'
          initialValues={{
            // ["timeSheets"]: "yes",
            user: 'admin',
            // ["access"]: "all",
            // customer: false,
            employee: { label: defaultEmployee?.full_name, value: 203001 },
            // ["addUser"]: "no",
            // ["companyInfo"]: "no",
            // ["manageSubscriptions"]: "no",
          }}
        >
          {
            // current === 2 && user === "standard" && access === "none" ? (
            //   <Row>
            //     <Col span={24}>
            //       <Title type='secondary' level={4}>
            //         {t("Manage_users.Time_tracking_settings")}
            //       </Title>

            //       <Form.Item
            //         name='timeSheets'
            //         style={styles.userSetting}
            //         label={t("Manage_users.Submit_time_sheets")}
            //       >
            //         <Radio.Group onChange={onChangeTimeSheets}>
            //           <Radio value='yes' style={styles.radioStyle}>
            //             {t("Manage_users.Yes")}
            //           </Radio>
            //           <Radio value='no' style={styles.radioStyle}>
            //             {t("Manage_users.No")}
            //           </Radio>
            //         </Radio.Group>
            //       </Form.Item>
            //       {timeSheets === "no" ? (
            //         <div></div>
            //       ) : (
            //         <div>
            //           {" "}
            //           <Text>
            //             <Text strong={true}>
            //               {t("Manage_users.Select_employee_supplier")}
            //             </Text>
            //             <br />
            //             {t("Manage_users.Do_not_see_select")}
            //             <Text strong={true}>{t("Manage_users.Add_new")}</Text>
            //           </Text>
            //           <br />
            //           <br />
            //           <Row>
            //             <Col xl={6} lg={7} md={8} sm={11} xs={isMobile ? 20 : 15}>
            //               <Form.Item
            //                 // style={styles.marginButtom(isMobileBase)}
            //                 name='employee'
            //                 // label={t("Sales.Product_and_services.Form.Category")}
            //               >
            //                 <Select
            //                   showSearch
            //                   placeholder={t(
            //                     "Manage_users.Employee_supplier_placeholder"
            //                   )}
            //                   open={openSelect}
            //                   onMouseEnter={onClickEmployee}
            //                   onSelect={onClickEmployeeOption}
            //                   onMouseLeave={onClickEmployeeOption}
            //                   dropdownRender={(menu) => (
            //                     <div>
            //                       {addVisible ? (
            //                         <AddSupplierOrEmployee
            //                           set={setOption}
            //                           cancel={onCancel}
            //                         />
            //                       ) : (
            //                         <div>
            //                           {menu}
            //                           <Divider style={styles.divider} />
            //                           <div style={styles.addItem}>
            //                             <a
            //                               style={styles.add}
            //                               onClick={onAddClick}
            //                             >
            //                               <PlusOutlined />
            //                               {t(
            //                                 "Sales.Product_and_services.Form.Add_item"
            //                               )}
            //                             </a>
            //                           </div>
            //                         </div>
            //                       )}
            //                     </div>
            //                   )}
            //                   filterOption={(input, option) =>
            //                     option.children
            //                       .toLowerCase()
            //                       .indexOf(input.toLowerCase()) >= 0
            //                   }
            //                 >
            //                   {items.map((item) => (
            //                     <Option value={item.name} key={item.id}>
            //                       {item.name}
            //                     </Option>
            //                   ))}
            //                 </Select>
            //               </Form.Item>
            //             </Col>
            //           </Row>{" "}
            //         </div>
            //       )}
            //     </Col>
            //   </Row>
            // )
            //  :
            current === 0 ? (
              <div className='num'>
                <Title type='secondary' level={4}>
                  {t('Manage_users.Select_user_type')}
                </Title>
                <Text strong={true}>
                  {t('Manage_users.User_type_description')}
                </Text>
                <Form.Item name='user'>
                  <Radio.Group
                    size='large'
                    style={styles.radioGroup(isMiniTablet)}
                    onChange={onChangeName}
                    className='num'
                  >
                    {/* <Radio style={styles.radioStyle} value="standard">
                      {t("Manage_users.Standard_user")}
                      <Paragraph type="secondary" style={styles.text}>
                        {t("Manage_users.Standard_user_description")}
                      </Paragraph>
                    </Radio> */}
                    <br />
                    <Radio style={styles.radioStyle} value='admin'>
                      {t('Manage_users.Company_admin')}
                      <Paragraph type='secondary' style={styles.text}>
                        {t('Manage_users.Company_admin_description')}
                      </Paragraph>
                    </Radio>

                    {/* <Divider className="num" /> */}
                    <Text strong={true}>
                      {t('Manage_users.User_type_description')}
                    </Text>

                    {/* <Radio style={styles.radioStyle} value="report_only">
                      {t("Manage_users.Reports_only")}
                      <Paragraph type="secondary" style={styles.text}>
                        {t("Manage_users.Reports_only_description")}
                      </Paragraph>
                    </Radio>
                    <br /> */}
                    <br />
                    <Radio style={styles.radioStyle} value='custom'>
                      {t('Manage_users.Custom_user')}
                      <Paragraph type='secondary' style={styles.text}>
                        {t('Manage_users.Company_custom_description')}
                      </Paragraph>
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
            ) : // : current === 1 && user === "standard" ? (
            //   <Row>
            //     <Col md={10} sm={11} xs={24}>
            //       <Title type='secondary' level={4}>
            //         {t("Manage_users.Select_access_rights")}
            //       </Title>
            //       <Text strong={true}>
            //         {t("Manage_users.User_access_description")}
            //       </Text>
            //       <Form.Item name='access' style={styles.margin}>
            //         <Radio.Group
            //           size='large'
            //           style={styles.radioGroup(isMiniTablet)}
            //           onChange={onChangeAccess}
            //         >
            //           <Radio style={styles.radioStyle} value='all'>
            //             {t("Sales.Product_and_services.All")}
            //           </Radio>
            //           <Radio style={styles.radioStyle} value='none'>
            //             {t("Manage_users.None")}
            //           </Radio>
            //           <Radio style={styles.radioStyle} value='limited'>
            //             {t("Manage_users.limited")}
            //           </Radio>
            //         </Radio.Group>
            //       </Form.Item>

            //       <Form.Item
            //         name='customer'
            //         style={styles.margin}
            //         valuePropName='checked'
            //       >
            //         <Checkbox
            //           // checked={customer}
            //           onChange={onCheckCustomer}
            //           style={styles.text}
            //           disabled={access === "limited" ? false : true}
            //         >
            //           {t("Sales.Customers.1")}
            //         </Checkbox>
            //       </Form.Item>
            //       <Form.Item
            //         name='supplier'
            //         style={styles.margin}
            //         valuePropName='checked'
            //       >
            //         <Checkbox
            //           // checked={supplier}
            //           onChange={onCheckSupplier}
            //           style={styles.text}
            //           disabled={access === "limited" ? false : true}
            //         >
            //           {" "}
            //           {t("Expenses.Suppliers.1")}
            //         </Checkbox>
            //       </Form.Item>
            //     </Col>
            //     <Col
            //       md={{ span: 13, offset: 1 }}
            //       sm={{ span: 12, offset: 1 }}
            //       xs={{ span: 24, offset: 0 }}
            //     >
            //       {access === "limited" ? (
            //         <div>
            //           {supplier && customer ? (
            //             <CustomerSupplier isMiniTablet={isMiniTablet} />
            //           ) : customer ? (
            //             <Customer isMiniTablet={isMiniTablet} />
            //           ) : supplier ? (
            //             <Supplier isMiniTablet={isMiniTablet} />
            //           ) : (
            //             <div style={styles.accessPadding(isMiniTablet)}>
            //               <Text strong={true}>
            //                 {t("Manage_users.Limited_access")}
            //               </Text>{" "}
            //               <br />
            //               <br />
            //               <Text>{t("Manage_users.What_user_can_see")}</Text>
            //               <br />
            //               <Paragraph>
            //                 <ul>
            //                   <li> {t("Manage_users.Customers_and_sales")}</li>
            //                   <li>
            //                     {" "}
            //                     {t("Manage_users.Suppliers_and_purchases")}
            //                   </li>
            //                 </ul>
            //               </Paragraph>
            //             </div>
            //           )}
            //         </div>
            //       ) : access === "none" ? (
            //         <div style={styles.accessPadding(isMiniTablet)}>
            //           <Text strong={true}>
            //             {" "}
            //             {t("Manage_users.No_accounting_feature_access")}
            //           </Text>
            //           <br />
            //           <br />
            //           <Paragraph>
            //             {t(
            //               "Manage_users.No_accounting_feature_access_description"
            //             )}
            //             <br />
            //             {t(
            //               "Manage_users.No_accounting_feature_access_description1"
            //             )}
            //           </Paragraph>
            //         </div>
            //       ) : (
            //         <All isMiniTablet={isMiniTablet} />
            //       )}
            //     </Col>
            //   </Row>
            // )
            // (current === 2 && user === "standard") ||
            //   (access === "none" && current === 3 && user === "standard") ? (
            //   <div>
            //     <Title type='secondary' level={4}>
            //       {t("Manage_users.Select_user_settings")}
            //     </Title>
            //     <Form.Item
            //       style={styles.userSetting}
            //       name='addUser'
            //       label={t("Manage_users.Add_user_permission")}
            //     >
            //       <Radio.Group>
            //         <Radio value='yes' style={styles.radioStyle}>
            //           {t("Manage_users.Yes")}
            //         </Radio>
            //         <Radio value='no' style={styles.radioStyle}>
            //           {t("Manage_users.No")}
            //         </Radio>
            //         <Radio value='view only' style={styles.radioStyle}>
            //           {t("Manage_users.View_only")}
            //         </Radio>
            //       </Radio.Group>
            //     </Form.Item>
            //     <Form.Item
            //       name='companyInfo'
            //       style={styles.userSetting}
            //       label={t("Manage_users.company_permission")}
            //     >
            //       <Radio.Group>
            //         <Radio value='yes' style={styles.radioStyle}>
            //           {t("Manage_users.Yes")}
            //         </Radio>
            //         <Radio value='no' style={styles.radioStyle}>
            //           {t("Manage_users.No")}
            //         </Radio>
            //       </Radio.Group>
            //     </Form.Item>
            //     <Form.Item
            //       name='manageSubscriptions'
            //       style={styles.userSetting}
            //       label={t("Manage_users.Manage_subscription_permission")}
            //     >
            //       <Radio.Group>
            //         <Radio value='yes' style={styles.radioStyle}>
            //           {t("Manage_users.Yes")}
            //         </Radio>
            //         <Radio value='no' style={styles.radioStyle}>
            //           {t("Manage_users.No")}
            //         </Radio>
            //         <Radio value='view only' style={styles.radioStyle}>
            //           {t("Manage_users.View_only")}
            //         </Radio>
            //       </Radio.Group>
            //     </Form.Item>
            //   </div>
            // ) :
            (current === 1 && user === 'standard') ||
              (user === 'admin' && current === 1) ||
              (user === 'report_only' && current === 1) ||
              (user === 'custom' && current === 2) ? (
              <div>
                <Row>
                  <Col span={10}>
                    <Title type='secondary' level={4}>
                      {t('Manage_users.User_information')}
                    </Title>
                    {/* <Paragraph>
                      {t("Manage_users.Contact_info_description")}
                    </Paragraph> */}
                  </Col>
                </Row>

                <Row>
                  <Col xl={6} lg={7} md={9} sm={11} xs={24}>
                    {errorMessage ? (
                      <Alert
                        message={t('Manage_users.Password_validation_error')}
                        type='error'
                      />
                    ) : (
                      <div></div>
                    )}
                    <Form.Item
                      name='userName'
                      label={
                        <span>
                          {t('Form.User_name')}
                          <span className='star'>*</span>
                        </span>
                      }
                      style={styles.userSetting}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: `${t('Form.User_name_required')}`,
                        },
                      ]}
                    >
                      <Input onChange={onChangeUserName} />
                    </Form.Item>
                    <Form.Item
                      name='firstName'
                      label={t('Form.Name1')}
                      style={styles.userSetting}
                    >
                      <Input />
                    </Form.Item>
                    <InfiniteScrollSelectFormItem
                      name='employee'
                      label={
                        <span>
                          {t('Employees.Employee')}
                          <span className='star'>*</span>
                        </span>
                      }
                      style={styles.userSetting}
                      fields='full_name,id'
                      baseUrl='/staff_account/staff/'
                      rules={[
                        {
                          required: true,
                          message: t('Employees.Employee_required'),
                        },
                      ]}
                    />

                    <Form.Item
                      name='email'
                      label={
                        <span>
                          {t('Form.Email')}
                          <span className='star'>*</span>
                        </span>
                      }
                      style={styles.userSetting}
                      rules={[
                        {
                          type: 'email',
                          message: `${t('Form.Email_Message')}`,
                        },
                        {
                          required: true,
                          whitespace: true,
                          message: `${t('Form.Required_email')}`,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label={
                        <span>
                          {t('Company.Form.Password')}
                          <span className='star'>*</span>
                        </span>
                      }
                      name='password'
                      validateStatus={errorMessage ? 'error' : undefined}
                      dependencies={[String & Number]}
                      style={styles.userSetting}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: `${t('Company.Form.Required_password')}`,
                        },
                      ]}
                    >
                      <Input.Password onChange={onChangePassword} />
                    </Form.Item>

                    <Form.Item
                      name='confirm'
                      label={
                        <span>
                          {t('Company.Form.Confirm_password')}
                          <span className='star'>*</span>
                        </span>
                      }
                      dependencies={['password']}
                      hasFeedback
                      style={styles.margin}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: `${t('Company.Form.Required_confirm')}`,
                        },
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              `${t('Company.Form.Confirm_match')}`,
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Paragraph>
                      {reg.test(password) ? (
                        <CheckOutlined className='list_tick' />
                      ) : (
                        <CloseOutlined style={styles.close} />
                      )}
                      &nbsp; {t('Manage_users.Password_validation_error1')}
                      <br />
                      {reg1.test(password) ? (
                        <CheckOutlined className='list_tick' />
                      ) : (
                        <CloseOutlined style={styles.close} />
                      )}
                      &nbsp; {t('Manage_users.Password_validation_error2')}
                      <br />
                      {password !== userName ? (
                        <CheckOutlined className='list_tick' />
                      ) : (
                        <CloseOutlined style={styles.close} />
                      )}
                      &nbsp; {t('Manage_users.Password_validation_error3')}{' '}
                      <br />
                      {reg2.test(password) ? (
                        <CheckOutlined className='list_tick' />
                      ) : (
                        <CloseOutlined style={styles.close} />
                      )}
                      &nbsp; {t('Manage_users.Password_validation_error4')}{' '}
                      <br />
                    </Paragraph>
                  </Col>
                </Row>
              </div>
            ) : user === 'custom' ? (
              <Row>
                <Col span={24}>
                  <Title type='secondary' level={4}>
                    {t('Manage_users.Select_access_rights')}
                  </Title>
                  <Text style={styles.userSetting}>
                    {' '}
                    {t('Manage_users.User_access_description')}
                  </Text>
                  <Row>
                    <Col
                      xl={10}
                      lg={15}
                      md={24}
                      sm={11}
                      xs={isMobile ? 24 : 17}
                    >
                      <Form.Item
                        label={
                          <span>
                            {t('Form.Name')}
                            <span className='star'>*</span>
                          </span>
                        }
                        name='name'
                        rules={[
                          { required: false, message: t('Form.Name_required') },
                        ]}
                      >
                        <Input autoFocus autoComplete='off' />
                      </Form.Item>
                      {/* <Form.Item
                        label={
                          <span>
                            {t("Form.Role")}
                           
                          </span>
                        }
                        showDrawer={true}
                        name="role"
                        multiple
                        type="select"
                        // placeholder="Role"
                        rules={[
                          { required: false, message: t("Form.Name_required") },
                        ]}
                      >
                        <Input autoFocus autoComplete="on" />
                      </Form.Item> */}
                      <Form.Item
                        label={
                          <span>
                            {t('Form.Role')}
                            <span className='star'>*</span>
                          </span>
                        }
                        name='roleId'
                      >
                        <Select
                          style={{ width: '100%' }}
                          onChange={handleChangeRoleFunction}
                          placeholder='custom dropdown render'
                        >
                          {roleData?.data?.results?.map((item) => (
                            <Option key={item?.id} value={item?.id}>
                              {item?.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      {
                        //@ts-ignore
                        // name.toUpperCases()
                      }
                      <PermissionsFormItem
                        // treeData={permissionsList}
                        treeData={permissionsState}
                        form={form}
                        label={t('Manage_users.Permissions')}
                        getPermissionsId={handelGetPermissionsId}
                        rules={[
                          {
                            required: false,
                            message: t('Manage_users.Permissions_required'),
                          },
                        ]}
                      />
                    </Col>
                  </Row>
                  {/* <Row>
                    <Col
                      xl={10}
                      lg={15}
                      md={24}
                      sm={11}
                      xs={isMobile ? 24 : 17}
                    >
                      <Form.Item
                        label={t("Manage_users.Permissions")}
                        name="permissions"
                        rules={[
                          {
                            required: user === "admin" ? false : true,
                            message: t("Manage_users.Permissions_required"),
                          },
                        ]}
                      >
                        <TreeSelect
                          showSearch
                          treeData={permissionsList}
                          treeCheckable={true}
                          // treeNodeLabelProp='codename'
                          treeNodeFilterProp="title"
                          // treeNodeLabelProp="name"
                          placeholder={t(
                            "Manage_users.User_permissions_placeholder"
                          )}
                          className="num"
                          children="permission_set"
                          // fieldNames={{
                          //   label: "name",
                          //   key: "name",
                          //   children: "permission_set",
                          // }}
                          // maxTagCount={3}
                          showarrow={true}
                          onChange={(value) => console.log(value)}
                          // treeDefaultExpandAll={true}
                        />
                      </Form.Item>
                    </Col>
                  </Row> */}
                </Col>
              </Row>
            ) : (
              <div></div>
            )
          }
        </Form>
      </Drawer>
    </div>
  );
};
const reg = /(?=.*?[A-z]).{8,}/;
const reg1 = /(?=.*?[#?!@$%^&*-])/;
const reg2 = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/;

const styles = {
  radioStyle: {
    // display: "block",
    height: '30px',
    lineHeight: '20px',
  },
  addInput: { flex: 'auto', height: '30px' },
  divider: { margin: '0 0 4px 0' },
  addItem: {
    display: 'flex',
    flexWrap: 'nowrap',
    padding: '3px 8px',
    width: '100%',
  },
  add: {
    flex: 'none',
    padding: '4px',
    display: 'block',
    cursor: 'pointer',
    width: '100%',
  },
  text: { margin: '0 25px' },
  radioGroup: (isMiniTablet) => ({
    lineHeight: isMiniTablet ? '30px' : '50px',
  }),
  margin: { marginBottom: '.0rem' },
  userSetting: { marginBottom: '.8rem' },
  close: { color: `${Colors.red}` },
  accessPadding: (isMiniTablet) => ({ paddingTop: isMiniTablet ? '15px' : '' }),
};
const mapStateToProps = (state) => {
  return {
    rtl: state.direction.rtl,
    ltr: state.direction.ltr,
  };
};

export default connect(mapStateToProps)(AddUser);
