import React, { useMemo, useState } from 'react';
import axiosInstance from '../../ApiBaseUrl';
import Photo from '../Products/Photo';
import Filters from './Filters';
import { Checkbox, Row, Col, Table, Menu, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import CustomerAction from './CustomerAction';
import { useMediaQuery } from '../../MediaQurey';
import { useNavigate } from 'react-router-dom';
import { PaginateTable, Statistics } from '../../../components/antd';
import { checkActionColumnPermissions } from '../../../Functions';
import { CUSTOMER_M } from '../../../constants/permissions';

const { Column } = Table;
const CustomerTable = (props) => {
  let navigate = useNavigate();
  // const [collapsed, setCollapsed] = useState(false);
  const [filters, setFilters] = useState({
    state: 'active',
    category: '',
    discountCards: '',
    isCardExist: 'known',
    isCardExpire: 'known',
    discountCardType: '',
  });
  const isMobile = useMediaQuery('(max-width:425px)');
  const { t } = useTranslation();
  const [
    { phone, address, discountCard, email, attachments, photo },
    setColumns,
  ] = useState({
    phone: false,
    address: false,
    email: false,
    attachments: false,
    photo: false,
    discountCard: false,
  });

  //setting checkbox
  const onChangePhone = () =>
    setColumns((prev) => {
      return { ...prev, phone: !phone };
    });

  const onChangeAddress = () =>
    setColumns((prev) => {
      return { ...prev, address: !address };
    });
  const onChangePhoto = () =>
    setColumns((prev) => {
      return { ...prev, photo: !photo };
    });

  const onChangeDescription = (e) => {
    setColumns((prev) => {
      return { ...prev, email: !email };
    });
  };

  const onChangeAttachments = (e) => {
    setColumns((prev) => {
      return { ...prev, attachments: !attachments };
    });
  };

  // //collapsed
  // const onCollapsed = () => {
  //   setCollapsed(!collapsed);
  // };

  const setting = (
    <Menu style={styles.settingsMenu}>
      <Menu.Item key='1'>
        <Typography.Text strong={true}>
          {t('Sales.Product_and_services.Columns')}
        </Typography.Text>
      </Menu.Item>
      <Menu.Item key='2'>
        <Checkbox onChange={onChangeAddress} checked={address}>
          {t('Form.Address')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='3'>
        <Checkbox onChange={onChangePhone} checked={phone}>
          {t('Form.Phone')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='4'>
        <Checkbox onChange={onChangeDescription}>{t('Form.Email')}</Checkbox>
      </Menu.Item>
      <Menu.Item key='5'>
        <Checkbox onChange={onChangeAttachments}>
          {t('Form.Attachments')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='6'>
        <Checkbox onChange={onChangePhoto}>{t('Form.Photo')}</Checkbox>
      </Menu.Item>
    </Menu>
  );

  const handleGetCustomers = React.useCallback(
    async ({ queryKey }) => {
      const {
        page,
        pageSize,
        search,
        order,
        state,
        category,
        discountCards,
        discountCardType,
        isCardExist,
        isCardExpire,
      } = queryKey?.[1] || {};
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?page=${page}&page_size=${pageSize}&ordering=${order}&status=${state}&search=${search}&card_not_exist=${isCardExist}&category__name=${category}&discount_card_expire=${isCardExpire}&discount_card_name=${discountCards}&discount_card_type=${discountCardType}&expand=discount_card,discount_card.discount_card,category`,
      );
      return data;
    },
    [props.baseUrl],
  );

  const handleDoubleClickAction = (e) => {
    e.stopPropagation();
  };

  const columns = useMemo(
    (type, hasSelected) => {
      const sorter = type !== 'print' ? true : false;
      return (
        <React.Fragment>
          <Column
            title={t('Sales.Customers.Customer_id').toUpperCase()}
            dataIndex='id'
            key='id'
            width={type !== 'print' ? 145 : false}
            sorter={sorter && { multiple: 10 }}
            fixed={sorter}
            className='table-col'
            // align="center"
          />
          <Column
            title={t('Sales.Customers.Customer').toUpperCase()}
            // width={isMobile ? 70 : 170}
            dataIndex='first_name'
            key='first_name'
            fixed={sorter}
            render={(text, record) => (
              <React.Fragment>{record?.full_name}</React.Fragment>
            )}
            sorter={sorter && { multiple: 9 }}
            className='table-col'
          />
          {photo && (
            <Column
              title={`${t('Form.Photo').toUpperCase()}`}
              dataIndex='photo'
              key='photo'
              className='table-col'
              width={80}
              align='center'
              render={(text, record) => {
                return <Photo photo={text} />;
              }}
            />
          )}
          {phone && (
            <Column
              title={t('Form.Phone').toUpperCase()}
              dataIndex='phone_number'
              key='phone_number'
              className='table-col'
              sorter={sorter && { multiple: 8 }}
            />
          )}
          {/* 
          <Column
            title={t("Form.Mobile").toUpperCase()}
            dataIndex="mobile_number"
            key="mobile_number"
            className="table-col"
           sorter={sorter && { multiple: 9 }}
          /> */}

          {address && (
            <Column
              title={t('Sales.Customers.Table.Address')}
              dataIndex='full_billing_address'
              key='full_billing_address'
              sorter={sorter && { multiple: 7 }}
              className='table-col'
            />
          )}

          {email && (
            <Column
              title={t('Sales.Customers.Table.Email')}
              dataIndex='email'
              key='email'
              className='table-col'
              sorter={sorter && { multiple: 6 }}
            />
          )}
          <Column
            title={`${t('Sales.Product_and_services.Category').toUpperCase()}`}
            dataIndex='category'
            key='category'
            className='table-col'
            render={(text, record) => {
              return <>{text?.get_fomrated_path}</>;
            }}
            sorter={sorter && { multiple: 5 }}
          />
          {discountCard && (
            <Column
              title={t(
                'Sales.Customers.Discount.Customers_discount',
              ).toUpperCase()}
              dataIndex='discount_card'
              key='discount_card'
              sorter={sorter && { multiple: 4 }}
              render={(text, record) => {
                return <React.Fragment>{text?.id}</React.Fragment>;
              }}
              className='table-col'
            />
          )}
          {attachments && (
            <Column
              title={t('Sales.Customers.Table.Attachments')}
              dataIndex='attachment'
              key='attachment'
              sorter={sorter && { multiple: 3 }}
              render={(text, record) => {
                const phone = text?.split('/');
                return <React.Fragment>{phone?.[6]}</React.Fragment>;
              }}
              className='table-col'
            />
          )}
          <Column
            title={t('Sales.Customers.Form.Credit_limit').toUpperCase()}
            dataIndex='credit_limit'
            key='credit_limit'
            sorter={sorter && { multiple: 2 }}
            className='table-col'
            render={(value) => <Statistics value={value} />}
          />
          <Column
            title={t('Sales.Customers.Form.National_id_number').toUpperCase()}
            dataIndex='national_id_number'
            key='national_id_number'
            sorter={sorter && { multiple: 1 }}
            className='table-col'
          />

          {type !== 'print' && checkActionColumnPermissions(CUSTOMER_M) && (
            <Column
              title={t('Table.Action')}
              key='action'
              align='center'
              width={isMobile ? 50 : 70}
              render={(text, record) => (
                <div onDoubleClick={handleDoubleClickAction}>
                  <CustomerAction
                    record={record}
                    hasSelected={hasSelected}
                    baseUrl={props.baseUrl}
                  />
                </div>
              )}
              fixed={'right'}
              className='table-col'
            />
          )}
        </React.Fragment>
      );
    },
    [
      address,
      attachments,
      discountCard,
      email,
      isMobile,
      phone,
      photo,
      props.baseUrl,

      t,
    ],
  );

  // Replace the Menu element with a settings panel as a menu item
  const settingsMenuItems = [
    {
      key: 'settings',
      label: (
        <Menu style={styles.settingsMenu}>
          <Menu.Item key='1'>
            <Typography.Text strong={true}>
              {t('Sales.Product_and_services.Columns')}
            </Typography.Text>
          </Menu.Item>
          <Menu.Item key='2'>
            <Checkbox onChange={onChangeAddress} checked={address}>
              {t('Form.Address')}
            </Checkbox>
          </Menu.Item>
          <Menu.Item key='3'>
            <Checkbox onChange={onChangePhone} checked={phone}>
              {t('Form.Phone')}
            </Checkbox>
          </Menu.Item>
          <Menu.Item key='4'>
            <Checkbox onChange={onChangeDescription}>{t('Form.Email')}</Checkbox>
          </Menu.Item>
          <Menu.Item key='5'>
            <Checkbox onChange={onChangeAttachments}>
              {t('Form.Attachments')}
            </Checkbox>
          </Menu.Item>
          <Menu.Item key='6'>
            <Checkbox onChange={onChangePhoto}>{t('Form.Photo')}</Checkbox>
          </Menu.Item>
        </Menu>
      ),
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      {/* {collapsed ? (
        ""
      ) : (
        <Row justify="space-around">
          <Col span={24}>
            <Row
              gutter={[16, 20]}
              align="middle"
              style={{ marginBottom: "20px" }}
            >
              <Col md={8} sm={12} xs={24}>
                <Card
                  hoverable
                  className="customer_admin"
                  bordered={false}
                  bodyStyle={styles.card}
                >
                  <Statistic
                    title={
                      <span style={{ color: "white" }}>
                        {t("Sales.Customers.Unbilled_last_year")}
                      </span>
                    }
                    value={9.3}
                    precision={2}
                    valueStyle={{ color: "white" }}
                    suffix={
                      <span style={{ color: "white", fontSize: "1rem" }}>
                        {t("Sales.Customers.Estimate")}
                      </span>
                    }
                  />
                </Card>
              </Col>
              <Col md={8} sm={12} xs={24}>
                <Card
                  hoverable
                  bordered={false}
                  bodyStyle={{
                    background: "#08979c",
                    padding: "24px 18px",
                  }}
                >
                  <Statistic
                    title={
                      <span style={{ color: "white" }}>
                        {t("Sales.Customers.Unpaid_last_year")}
                      </span>
                    }
                    value={9.3}
                    precision={2}
                    valueStyle={{ color: "white" }}
                    suffix={
                      <span style={{ color: "white", fontSize: "1rem" }}>
                        {t("Sales.Customers.Open_invoice")}
                      </span>
                    }
                  />
                </Card>
              </Col>
              <Col md={8} sm={24} xs={24}>
                <Card
                  hoverable
                  bordered={false}
                  bodyStyle={{
                    background: "#2ecc71",
                    padding: "24px 18px",
                  }}
                >
                  <Statistic
                    title={
                      <span style={{ color: "white" }}>
                        {" "}
                        {t("Sales.Customers.Paid")}
                      </span>
                    }
                    value={9.3}
                    precision={2}
                    customer_admin
                    valueStyle={{ color: "white" }}
                    suffix={
                      <span style={{ color: "white", fontSize: "1rem" }}>
                        {t("Sales.Customers.Paid_last_month")}
                      </span>
                    }
                  />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      )} */}
      <Row className='position__relative'>
        <Col span={24}>
          <PaginateTable
            model={CUSTOMER_M}
            title={t('Sales.Customers.1')}
            columns={columns}
            queryKey={props.baseUrl}
            handleGetData={handleGetCustomers}
            filters={filters}
            filterNode={(setPage, setVisible) => (
              <Filters
                setFilters={setFilters}
                setVisible={setVisible}
                setPage={setPage}
              />
            )}
            settingMenu={{ items: settingsMenuItems }}
            onRow={(record) => {
              return {
                onDoubleClick: () => {
                  navigate(`/customer-details/${record.id}`);
                }, // double click row
              };
            }}
          />
        </Col>
        {/* <Col span={1} className="table__expandIcon">
          {collapsed ? (
            <DownSquareTwoTone
              className="icon"
              onClick={onCollapsed}
              twoToneColor={Colors.primaryColor}
            />
          ) : (
            <UpSquareTwoTone
              className="icon"
              onClick={onCollapsed}
              twoToneColor={Colors.primaryColor}
            />
          )}
        </Col> */}
      </Row>
    </div>
  );
};
const styles = {
  card: { background: '#3498db', padding: '24px 20px' },
  settingsMenu: { width: '160px', paddingBottom: '10px' },
};

export default CustomerTable;
