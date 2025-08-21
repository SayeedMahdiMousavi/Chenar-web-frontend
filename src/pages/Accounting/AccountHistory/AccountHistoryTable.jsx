import React, { useState } from 'react';
import { connect } from 'react-redux';
import Filters from './Filters.js';
// import { getProducts } from "../../actions/products/actionProducts";
// import { getServecies } from "../../actions/servecies/action";

// import withObservables from "@nozbe/with-observables";
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
// import { Q } from "@nozbe/watermelondb";
import NewTransaction from './NewTransaction.js';
import {
  FilterOutlined,
  PrinterOutlined,
  ExportOutlined,
  SettingOutlined,
  CaretDownOutlined,
  // DownOutlined,
  // UpOutlined,
  // UpSquareTwoTone,
  // DownSquareTwoTone,
  // ArrowDownOutlined,
} from '@ant-design/icons';
import Action from './Action.js';
import {
  Checkbox,
  Row,
  Col,
  Select,
  // message,
  // Menu,
  // Form,
  Table,
  Dropdown,
  // Button,
  // Input,
  // Modal,
  // Statistic,
  Typography,
} from 'antd';
// import Table from "rc-table";
import { useTranslation } from 'react-i18next';

// import DeleteProducts from "../../DeleteProducts";
import { useMediaQuery } from '../../MediaQurey.js';
// import TransactionAction from "./TransactionAction";

const { Text, Paragraph } = Typography;
const { Option } = Select;
const { Column } = Table;
// const { Search } = Input;

const AccountHistoryTable = ({ customers, collapse }) => {
  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [{ visible, visibleFilter }, setVisibal] = useState({
    visible: false,
    visibleFilter: false,
  });
  const isMobile = useMediaQuery('(max-width: 425px)');
  const { t } = useTranslation();
  // const [visibality, setVisibality] = useState(false);
  const [
    { reconcileStatus, bankingStatus, memo, tax, runningBalance },
    setColumns,
  ] = useState({
    reconcileStatus: false,
    bankingStatus: false,
    memo: false,
    tax: false,
    runningBalance: false,
  });

  const [data, setData] = useState([]);

  const [search, setSearch] = useState('');

  // useEffect(() => {
  //   let allDat = [];
  //   customers.forEach((customer) => {
  //     const d = customer.createdAt;
  //     const u = customer.updatedAt;
  //     const data = {
  //       key: customer.id,
  //       date: d.toISOString(),

  //       customer: customer.name,
  //       method: customer.last_name,
  //       source: customer.display_name,
  //       memo: customer.company,
  //       ageing: customer.phone,
  //       last_delivered: u.toISOString(),
  //       email: customer.email,
  //       attachments: customer.attachments,
  //       type: customer.bill_with,
  //       no: customer.fax,
  //       deu_date: customer.website,
  //       balance: customer.parent_customer,
  //       status: customer.note,
  //     };
  //
  //     allDat.unshift(data);
  //   });

  //   setData(allDat);
  // }, [customers]);

  //edit
  const edit = (Allfilds, id) => {
    const allDat = data?.map((item) => {
      if (item.key === id) {
        return {
          ...item,
          ...Allfilds,
        };
      } else {
        return item;
      }
    });
    setData(allDat);
  };
  //delete
  const deleteProduct = (id) => {
    const allDat = data.filter((item) => item.id !== id);
    setData(allDat);
  };
  //active
  // const active = (id) => {
  //   // inactive = true;
  //   const allDat = data.map((item) => {
  //     if (item.key === id) {
  //       return {
  //         ...item,
  //         status: "active",
  //       };
  //     } else {
  //       return item;
  //     }
  //   });
  //   // setData(allDat);
  //
  // };
  //inactive
  const inActive = (id) => {
    // active1 = true;
    const allDat = data?.map((item) => {
      if (item.key === id) {
        return {
          ...item,
          status: 'inActive',
        };
      } else {
        return item;
      }
    });

    setData(allDat);
  };
  //search
  // const onSearch = (e) => {
  //   setSearch(e.target.value);
  // };
  //
  // const filterDataSource = data.filter((item) => {
  //   const nameMatch = item.customer
  //     .toLowerCase()
  //     .includes(search.toLowerCase());

  //   return nameMatch;
  // });

  // const onSearch = (val) => {
  //
  // };

  //setting drop
  const handleVisibleChange = (flag) => {
    setVisibal({ visible: flag });
  };
  // setting  checkbox show More
  // const handelVisibality = () => {
  //   setVisibality(!visibality);
  // };
  //setting checkbox

  const onChangeReconcileStatus = () =>
    setColumns((prev) => {
      return { ...prev, reconcileStatus: !reconcileStatus };
    });
  const onChangeBankingStatus = (e) => {
    setColumns((prev) => {
      return { ...prev, bankingStatus: !bankingStatus };
    });
  };
  const onChangeMemo = (e) => {
    setColumns((prev) => {
      return { ...prev, memo: !memo };
    });
  };
  const onChangeTax = (e) => {
    setColumns((prev) => {
      return { ...prev, tax: !tax };
    });
  };
  const onChangeRunningBalance = (e) => {
    setColumns((prev) => {
      return { ...prev, runningBalance: !runningBalance };
    });
  };

  //getproducts
  // useEffect(() => {
  //   // props.getProducts();
  //   // props.getServecies();
  // }, [getProducts, getServecies]);
  //  const componentDidMount=()=> {
  //     this.props.getProducts();
  //   }
  // const onChange = () => {};

  // products.forEach((product) => {
  //   const data = {
  //     key: product.id,
  //     name: product.name,
  //     age: product.username,
  //     address: product.email,
  //   };
  //   allData.push(data);
  // });
  // let servic = [];
  // servecies.forEach((servic) => {
  //   const data = {
  //     key: servic.id,
  //     name: servic.name,
  //     description: servic.username,
  //     barcode: servic.email,
  //   };
  //   allData.push(data);
  // });
  // for (let i = 0; i <ProductTableFilter 1; i++) {
  //   allData.push({
  //     key: i,
  //     name: `Edward King ${i}`,
  //     age: 32,
  //     address: `London, Park Lane no. ${i}`
  //   });
  // }
  // const hasSelected = selectedRowKeys.length > 0;
  // const deleteMultiple = () => {
  //   const allData = data.filter((item) => {
  //     for (let index = 0; index < selectedRowKeys.length; index++) {
  //       const element = selectedRowKeys[index];
  //       if (item.id === element) {
  //         return false;
  //       }
  //     }
  //     return true;
  //   });

  //   setData(allData);
  // };
  // const MakeInActiveMultiple = () => {
  //   setSelectedRowKeys([]);
  //   // let element = [];
  //   // for (let index = 0; index < selectedRowKeys.length; index++) {
  //   //   element = selectedRowKeys[index];
  //   // }
  //   // const allDat = data.map((item) => {
  //   //   if (item.key === selectedRowKeys[0]) {
  //   //     return {
  //   //       ...item,
  //   //       status: "inActive",
  //   //     };
  //   //   } else {
  //   //     return item;
  //   //   }
  //   // });

  //   // setData(allDat);
  //   //
  // };
  // const changeGroup = (value) => {
  //   const allData = data.map((item) => {
  //     let element = [];
  //     for (let index = 0; index < selectedRowKeys.length; index++) {
  //       element = selectedRowKeys[index];
  //     }
  //     if (item.key === element) {
  //       return { ...item, status: value };
  //     }
  //     return item;
  //   });

  //   setData(allData);

  //   setSelectedRowKeys([]);
  // };

  const setting = (
    <div className='account_table__header2-setting'>
      {/* <Col span={24}> */}
      <Checkbox.Group>
        <Row className='table__header2-setting-group' gutter={[0, 11]}>
          <Col span={20} offset={2}>
            <h4>{t('Sales.Product_and_services.Columns')}</h4>
          </Col>

          <Col span={20} offset={2}>
            <Checkbox
              name='reconcileStatus'
              value='A'
              onChange={onChangeReconcileStatus}
              className='table__header2-setting-column'
            >
              {t('Accounting.Bank_register.Reconcile_status')}
            </Checkbox>
          </Col>

          <Col span={20} offset={2}>
            <Checkbox
              name='bankingStatus'
              value='B'
              onChange={onChangeBankingStatus}
              className='table__header2-setting-column'
            >
              {t('Accounting.Bank_register.Banking_status')}
            </Checkbox>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              value='C'
              onChange={onChangeTax}
              className='table__header2-setting-column'
            >
              {t('Taxes.Tax')}
            </Checkbox>
          </Col>

          <Col span={20} offset={2}>
            <Checkbox
              value='D'
              onChange={onChangeMemo}
              className='table__header2-setting-column'
            >
              {t('Sales.Customers.Form.Memo')}
            </Checkbox>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              value='E'
              onChange={onChangeRunningBalance}
              className='table__header2-setting-column'
            >
              {t('Accounting.Bank_register.Running_balance')}
            </Checkbox>
          </Col>
        </Row>
      </Checkbox.Group>
      <Row gutter={[0, 11]}>
        <Col span={20} offset={2} style={{ paddingBottom: '0rem' }}>
          <p style={{ margin: '0rem' }}> {t('Sales.Customers.Other')}</p>
        </Col>
        <Col span={20} offset={2}>
          <Checkbox name='oneLine' defaultChecked={true}>
            {t('Accounting.Bank_register.Show_one_line')}
          </Checkbox>
        </Col>
        <Col span={20} offset={2}>
          <Checkbox name='ledgerMode' defaultChecked={true}>
            {t('Accounting.Bank_register.Paper_ledger_mode')}
          </Checkbox>
        </Col>
        <Col offset={2} span={22}>
          <label htmlFor='status'>{t('Sales.Product_and_services.Rows')}</label>
        </Col>
        <Col offset={2} span={18}>
          <Select
            showSearch
            defaultValue='30'
            optionFilterProp='children'
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value={30}>30</Option>
            <Option value={20}>20</Option>
            <Option value={10}>10</Option>
          </Select>
        </Col>
        <Col span={20} offset={2}>
          <Checkbox
            name='compact'
            defaultChecked={true}
            // onChange={onChangeCategory}
          >
            {t('Sales.Customers.Compact')}
          </Checkbox>
        </Col>
      </Row>
      {/* </Col> */}
    </div>
  );
  //filter
  // const filters = (values) => {
  // let allData = [];
  // inActiveProducts.forEach((produc) => {
  //   const data = {
  //     key: produc.id,
  //     name: produc.name,
  //     barcode: produc.barcode,
  //     description: produc.description,
  //     group: produc.group.name,
  //     status: produc.status,
  //   };
  //   allData.unshift(data);
  // });
  // let allDat = [];
  // activeProducts.forEach((produc) => {
  //   const data = {
  //     key: produc.id,
  //     name: produc.name,
  //     barcode: produc.barcode,
  //     description: produc.description,
  //     group: produc.group.name,
  //     status: produc.status,
  //   };
  //   allDat.unshift(data);
  // });
  //
  // if (values.status === "inActive") {
  //   active1 = false;
  //   allProducts = false;
  //   inactive = true;
  //   setData(inActiveProducts);
  //   setVisibal({ visibleFilter: false });
  // } else if (values.status === "all") {
  //   active1 = false;
  //   allProducts = true;
  //   inactive = false;
  //   setData([...activeProducts, ...inActiveProducts]);
  //   // inactive = false;
  //   // setData([...inActiveProducts, ...activeProducts]);
  //   setVisibal({ visibleFilter: false });
  // } else {
  //   active1 = true;
  //   allProducts = false;
  //   inactive = false;
  //   setData(activeProducts);
  //   setVisibal({ visibleFilter: false });
  // }
  // };
  const handleVisibleChangFilter = (flag) => {
    setVisibal({ visibleFilter: flag });
  };
  const menu = <Filters />;

  //pagination
  const pagination = {
    pageSizeOptions: [5, 10, 20, 50],
    defaultPageSize: 5,

    showTotal: (total) =>
      `${t('Pagination.Total')} ${total} ${t('Pagination.Item')}`,
    // size: isMobile ? "small" : "default",
    showQuickJumper: true,
    showSizeChanger: true,
    responsive: true,
    showLessItems: true,
  };
  return (
    <div className='table-col table__padding'>
      <Row justify='space-around'>
        <Col span={23} className='banner'>
          <Table
            expandable
            className='table-content'
            size='middle'
            // rowKey={(record) => record.id}
            pagination={pagination}
            dataSource={data}
            bordered={true}
            scroll={{ x: 'max-content', scrollToFirstRowOnChange: true }}
            align='center'
            // rowClassName={() => "editable-row"}
            // footer={() => (
            //   <Button type='primary' shape='round'>
            //     Add a row
            //   </Button>
            // )}
            title={() => {
              return (
                <Row className='num' align='middle'>
                  <Col span={24}>
                    <Row className='num' align='middle'>
                      <Col
                        md={17}
                        sm={15}
                        xs={isMobile ? 24 : 14}
                        className='account_ending_balance'
                      >
                        {' '}
                        <Text>
                          {t(
                            'Accounting.Reconcile.Form.Ending_balance'
                          ).toUpperCase()}{' '}
                        </Text>
                        <div className='header'> - {t('Taxes.Aed')}-123.00</div>
                      </Col>
                      <Col
                        md={7}
                        sm={9}
                        xs={isMobile ? 24 : 10}
                        style={{ textAlign: 'end' }}
                      >
                        <NewTransaction />
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    xl={{ span: 8 }}
                    lg={{ span: 9 }}
                    md={{ span: 11 }}
                    sm={{ span: 15 }}
                    xs={{ span: 17 }}
                    className='expenses_table_header'
                  >
                    <Row justify='space-around' align='start'>
                      <Col md={18} sm={17} xs={18}>
                        <Select
                          className='num'
                          showSearch
                          defaultValue='masoud'
                          dropdownRender={(menu) => <div>{menu}</div>}
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {customers?.map((item) => (
                            <Option value={item.name} key={item.id}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                      <Col md={5} sm={6} xs={5}>
                        <Dropdown
                          menu={menu}
                          trigger={['click']}
                          placement='bottomLeft'
                          onOpenChange={handleVisibleChangFilter}
                          open={visibleFilter}
                        >
                          <a
                            className='ant-dropdown-link'
                            onClick={(e) => e.preventDefault()}
                            href='#'
                          >
                            <FilterOutlined className=' table__header1-filter' />
                            <CaretDownOutlined />
                          </a>
                          {/* </a> */}
                        </Dropdown>
                      </Col>
                    </Row>
                  </Col>

                  <Col
                    xl={{ span: 2, offset: 14 }}
                    lg={{ span: 3, offset: 12 }}
                    md={{ span: 3, offset: 10 }}
                    sm={{ span: 4, offset: 5 }}
                    xs={{ span: 7, offset: 0 }}
                    className='table__header2'
                  >
                    <Row justify='end'>
                      <Col sm={8} xs={8}>
                        {' '}
                        <PrinterOutlined className='table__header2-icon' />
                      </Col>
                      <Col sm={8} xs={8}>
                        <ExportOutlined className='table__header2-icon' />
                      </Col>
                      <Col sm={8} xs={8}>
                        {' '}
                        <Dropdown
                          overlay={setting}
                          trigger={['click']}
                          onOpenChange={handleVisibleChange}
                          open={visible}
                        >
                          <a className='ant-dropdown-link' href='#'>
                            <SettingOutlined className='table__header2-icon' />
                          </a>
                        </Dropdown>
                      </Col>
                    </Row>
                  </Col>
                  {/* )} */}
                </Row>
              );
            }}
          >
            <Column
              title={
                <span style={styles.firstRow}>
                  {t('Sales.Customers.Form.Date').toUpperCase()}
                </span>
              }
              width={isMobile ? 75 : 180}
              dataIndex='date'
              key='date'
              fixed={true}
              render={(text, record) => (
                <React.Fragment>
                  <Paragraph style={styles.firstRow}> {text} </Paragraph>
                </React.Fragment>
              )}
              className='table-col'
            />

            {reconcileStatus && (
              <Column
                title={t(
                  'Accounting.Bank_register.Reconcile_status'
                ).toUpperCase()}
                dataIndex='reconcileStatus'
                key='reconcileStatus'
                className='table-col'
              />
            )}
            {bankingStatus && (
              <Column
                title={t(
                  'Accounting.Bank_register.Banking_status'
                ).toUpperCase()}
                dataIndex='bankingStatus'
                key='bankingStatus'
                className='table-col'
                // width={150}
              />
            )}
            {tax && (
              <Column
                title={t('Taxes.Tax').toUpperCase()}
                dataIndex='tax'
                key='tax'
                className='table-col'
                // width={150}
              />
            )}

            {memo && (
              <Column
                title={t('Sales.Customers.Form.Memo').toUpperCase()}
                dataIndex='memo'
                key='memo'
                className='table-col'
                // width={150}
              />
            )}

            {runningBalance && (
              <Column
                title={t(
                  'Accounting.Bank_register.Running_balance'
                ).toUpperCase()}
                dataIndex='type'
                key='type'
                className='table-col'
              />
            )}

            <Column
              title={t('Sales.Customers.Form.No').toUpperCase()}
              dataIndex='no'
              key='no'
              className='table-col'
            />

            <Column
              title={t('Expenses.Table.Payee').toUpperCase()}
              dataIndex='payee'
              key='payee'
              className='table-col'
            />

            <Column
              title={t('Form.Attachments').toUpperCase()}
              dataIndex='attachments'
              key='attachments'
              className='table-col'
            />

            <Column
              title={t('Accounting.Account').toUpperCase()}
              dataIndex='account'
              key='account'
              className='table-col'
            />
            <Column
              title={t('Form.Payment').toUpperCase()}
              dataIndex='payment'
              key='payment'
              className='table-col'
            />
            <Column
              title={t('Accounting.Bank_register.Deposit').toUpperCase()}
              dataIndex='deposit'
              key='deposit'
              className='table-col'
            />

            <Column
              title={t('Table.Action')}
              key='action'
              align='center'
              width={isMobile ? 55 : 70}
              render={(text, record) => (
                <Action
                  record={record}
                  delete={deleteProduct}
                  inActive={inActive}
                  edit={edit}
                />
              )}
              fixed={'right'}
              className='table-col'
            />
          </Table>
        </Col>
      </Row>
    </div>
  );
};
const styles = {
  firstRow: { paddingInlineStart: '1rem', margin: '0px' },
};

const mapStateToProps = (state) => ({
  products: state.products.products,
  rtl: state.direction.rtl,
  ltr: state.direction.ltr,
  servecies: state.servecies.servecies,
});
// const enhancProduct = withObservables(["customers"], ({ database }) => ({
//   customers: database.collections.get("customers").query().observe(),
//   // customers: customer,
//   // addresses: customers.addresses.observe(),
// }));

// export default connect(mapStateToProps)(
//   withDatabase(enhancProduct(AccountHistoryTable))
// );
export default connect(mapStateToProps)(AccountHistoryTable);
