import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// import { getProducts } from "../../../../actions/products/actionProducts";
// import { getServecies } from "../../../../actions/servecies/action";
import BatchAction from './BatchAction';
// import withObservables from "@nozbe/with-observables";
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
import Filters from './Filters';
// import { Q } from "@nozbe/watermelondb";
import {
  // FilterOutlined,
  PrinterOutlined,
  ExportOutlined,
  SettingOutlined,
  CaretDownOutlined,
  DownOutlined,
  UpOutlined,
  // UpSquareTwoTone,
  // DownSquareTwoTone,
  // ArrowDownOutlined,
} from '@ant-design/icons';

import {
  Checkbox,
  Row,
  Col,
  // Select,
  // message,
  // Menu,
  // Form,
  Table,
  Dropdown,
  Button,
  // Input,
  // Modal,
  // Statistic,
  // Card,
} from 'antd';
// import Table from "rc-table";
import { useTranslation } from 'react-i18next';

import { useMediaQuery } from '../../../MediaQurey';

import TransactionAction from './TransactionAction';

// const { Option } = Select;
const { Column } = Table;
// const { Search } = Input;

const TransactionTable = ({ customers, collapse }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [checkedList, setCheckedList] = useState(defaultCheckedList);
  // const [indeterminate, setIndeterminate] = useState(true);
  // const [checkAll, setcheckAll] = useState(false);

  // const [batch, setBatch] = useState(false);
  // const [collapsed, setCollapsed] = useState(false);
  const [{ visible, visibleFilter }, setVisibal] = useState({
    visible: false,
    visibleFilter: false,
  });
  const isMobile = useMediaQuery('(max-width: 576px)');
  const { t } = useTranslation();
  const [visibality, setVisibality] = useState(false);
  const [
    {
      method,
      customer,
      source,
      memo,
      ageing,
      lastDelivered,
      email,
      attachments,
      type,
      no,
      deuDate,
      balance,
      status,
    },
    setColumns,
  ] = useState({
    customer: false,
    method: false,
    source: false,
    memo: false,
    ageing: false,
    lastDelivered: false,
    email: false,
    attachments: false,
    type: true,
    no: true,
    deuDate: true,
    balance: true,
    status: true,
  });
  // const [count, setCount] = useState(10);
  const [data, setData] = useState([]);

  const [search, setSearch] = useState('');

  useEffect(() => {
    let allDat = [];
    customers &&
      customers.forEach((customer) => {
        const d = customer.createdAt;
        const u = customer.updatedAt;
        const data = {
          key: customer.id,
          date: d.toISOString(),

          customer: customer.name,
          method: customer.last_name,
          source: customer.display_name,
          memo: customer.company,
          ageing: customer.phone,
          last_delivered: u.toISOString(),
          email: customer.email,
          attachments: customer.attachments,
          type: customer.bill_with,
          no: customer.fax,
          deu_date: customer.website,
          balance: customer.parent_customer,
          status: customer.note,
        };

        allDat.unshift(data);
      });

    setData(allDat);
  }, [customers]);

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
  const filterDataSource = data.filter((item) => {
    const nameMatch = item.customer
      .toLowerCase()
      .includes(search.toLowerCase());

    return nameMatch;
  });

  // const onSearch = (val) => {
  //
  // };

  //setting drop
  const handleVisibleChange = (flag) => {
    setVisibal({ visible: flag });
  };
  // setting  checkbox show More
  const handelVisibality = () => {
    setVisibality(!visibality);
  };
  //setting checkbox

  const onChangeCustomer = () =>
    setColumns((prev) => {
      return { ...prev, customer: !customer };
    });
  const onChangeMethod = () =>
    setColumns((prev) => {
      return { ...prev, method: !method };
    });
  const onChangeSource = (e) => {
    setColumns((prev) => {
      return { ...prev, source: !source };
    });
  };
  const onChangeMemo = (e) => {
    setColumns((prev) => {
      return { ...prev, memo: !memo };
    });
  };
  const onChangeAgeing = (e) => {
    setColumns((prev) => {
      return { ...prev, ageing: !ageing };
    });
  };
  const onChangeLastDelivered = (e) => {
    setColumns((prev) => {
      return { ...prev, lastDelivered: !lastDelivered };
    });
  };
  const onChangeEmail = (e) => {
    setColumns((prev) => {
      return { ...prev, email: !email };
    });
  };
  const onChangeAttachments = (e) => {
    setColumns((prev) => {
      return { ...prev, attachments: !attachments };
    });
  };
  const onChangeType = (e) => {
    setColumns((prev) => {
      return { ...prev, type: !type };
    });
  };
  const onChangeNo = (e) => {
    setColumns((prev) => {
      return { ...prev, no: !no };
    });
  };
  const onChangeDeuDate = (e) => {
    setColumns((prev) => {
      return { ...prev, deuDate: !deuDate };
    });
  };
  const onChangeBalance = (e) => {
    setColumns((prev) => {
      return { ...prev, balance: !balance };
    });
  };
  const onChangeStatus = (e) => {
    setColumns((prev) => {
      return { ...prev, status: !status };
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
  const deleteMultiple = () => {
    const allData = data.filter((item) => {
      for (let index = 0; index < selectedRowKeys.length; index++) {
        const element = selectedRowKeys[index];
        if (item.id === element) {
          return false;
        }
      }
      return true;
    });

    setData(allData);
  };
  const MakeInActiveMultiple = () => {
    setSelectedRowKeys([]);
    // let element = [];
    // for (let index = 0; index < selectedRowKeys.length; index++) {
    //   element = selectedRowKeys[index];
    // }
    // const allDat = data.map((item) => {
    //   if (item.key === selectedRowKeys[0]) {
    //     return {
    //       ...item,
    //       status: "inActive",
    //     };
    //   } else {
    //     return item;
    //   }
    // });

    // setData(allDat);
    //
  };
  const changeGroup = (value) => {
    const allData = data?.map((item) => {
      let element = [];
      for (let index = 0; index < selectedRowKeys.length; index++) {
        element = selectedRowKeys[index];
      }
      if (item.key === element) {
        return { ...item, status: value };
      }
      return item;
    });

    setData(allData);

    setSelectedRowKeys([]);
  };
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
    // this.setState({ selectedRowKeys });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    // onSelect: (record, selected, selectedRows, nativeEvent) => {
    //
    //     `record:${record} select  ${selected}  selectedRows  ${selectedRows}  nativeEvent   ${nativeEvent}`
    //   );

    // },
    // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
    // hideDefaultSelections: true,
    getCheckboxProps: (record) => ({
      disabled: record.status === 'inActive', // Column configuration not to be checked
      name: record.name,
    }),
  };

  const setting = (
    <div className='table__header2-setting'>
      {/* <Col span={24}> */}
      <Checkbox.Group defaultValue={['I', 'J', 'K', 'L', 'M']}>
        <Row className='table__header2-setting-group' gutter={[0, 11]}>
          <Col span={20} offset={2}>
            <h4>{t('Sales.Product_and_services.Columns')}</h4>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              value='A'
              name='customer'
              onChange={onChangeCustomer}
              className='table__header2-setting-column'
            >
              {t('Sales.Customers.Customer')}
            </Checkbox>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              name='method'
              value='B'
              onChange={onChangeMethod}
              className='table__header2-setting-column'
            >
              {t('Sales.Customers.Form.Method')}
            </Checkbox>
          </Col>

          <Col span={20} offset={2}>
            <Checkbox
              name='source'
              value='C'
              onChange={onChangeSource}
              className='table__header2-setting-column'
            >
              {t('Sales.Customers.Form.Source')}
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
              onChange={onChangeAgeing}
              className='table__header2-setting-column'
            >
              {t('Sales.Customers.Form.Ageing')}
            </Checkbox>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              value='F'
              onChange={onChangeLastDelivered}
              className='table__header2-setting-column'
            >
              {t('Sales.Customers.Form.Last_delivered')}
            </Checkbox>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              value='G'
              onChange={onChangeEmail}
              className='table__header2-setting-column'
            >
              {t('Form.Email')}
            </Checkbox>
          </Col>
          {visibality && (
            <Row gutter={[0, 11]}>
              <Col span={20} offset={2}>
                <Checkbox
                  value='H'
                  onChange={onChangeAttachments}
                  className='table__header2-setting-column'
                >
                  {t('Form.Attachments')}
                </Checkbox>
              </Col>
              <Col span={20} offset={2}>
                <Checkbox
                  value='I'
                  onChange={onChangeType}
                  name='type'
                  className='table__header2-setting-column'
                >
                  {t('Sales.Product_and_services.Type')}
                </Checkbox>
              </Col>
              <Col span={20} offset={2}>
                <Checkbox
                  value='J'
                  onChange={onChangeNo}
                  name='no'
                  className='table__header2-setting-column'
                >
                  {t('Sales.Customers.Form.No')}
                </Checkbox>
              </Col>
              <Col span={20} offset={2}>
                <Checkbox
                  value='K'
                  name='deuDate'
                  onChange={onChangeDeuDate}
                  className='table__header2-setting-column'
                >
                  {t('Sales.Customers.Form.Deu_date')}
                </Checkbox>
              </Col>
              <Col span={20} offset={2}>
                <Checkbox
                  value='L'
                  name='balance'
                  onChange={onChangeBalance}
                  className='table__header2-setting-column'
                >
                  {t('Sales.Customers.Form.Balance')}
                </Checkbox>
              </Col>
              <Col span={20} offset={2}>
                <Checkbox name='status' value='M' onChange={onChangeStatus}>
                  {t('Sales.Product_and_services.Status')}
                </Checkbox>
              </Col>
            </Row>
          )}
          <Col span={12} offset={12}>
            <span onClick={handelVisibality}>
              {visibality ? (
                <span className='table__header2-setting-showMore'>
                  <UpOutlined />
                  {t('Sales.Product_and_services.Show_less')}
                </span>
              ) : (
                <span className='table__header2-setting-showMore'>
                  <DownOutlined />
                  {t('Sales.Product_and_services.Show_More')}
                </span>
              )}
            </span>
          </Col>
        </Row>
      </Checkbox.Group>
      <Row>
        <Col offset={2} span={22}>
          <label htmlFor='status'>{t('Sales.Product_and_services.Rows')}</label>
        </Col>
        <Col span={20} offset={2}>
          <Checkbox
            name='compact'
            defaultChecked={true}
            onChange={onChangeStatus}
          >
            {t('Sales.Customers.Compact')}
          </Checkbox>
        </Col>
      </Row>
      {/* </Col> */}
    </div>
  );
  //filter
  const filters = (values) => {
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
  };
  const handleVisibleChangFilter = (flag) => {
    setVisibal({ visibleFilter: flag });
  };
  const menu = <Filters filter={filters} open={visibleFilter} />;
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
      <Row>
        <Col span={24}>
          <Table
            expandable
            className='table-content'
            size='middle'
            tableLayout='auto'
            rowSelection={rowSelection}
            // rowKey={(record) => record.id}
            pagination={pagination}
            dataSource={filterDataSource}
            // scroll={
            //   this.state.quality && this.state.description && { x: "1000" }
            // }
            bordered={true}
            scroll={{ x: 'max-content', scrollToFirstRowOnChange: true }}
            align='center'
            title={() => {
              return (
                <Row style={{ width: '100%' }} align='middle'>
                  <Col
                    xl={collapse ? { span: 8 } : { span: 7 }}
                    lg={{ span: 10 }}
                    md={{ span: 12 }}
                    sm={collapse ? { span: 17 } : { span: 13 }}
                    xs={{ span: 24 }}
                    className={isMobile ? 'table__header1' : ''}
                  >
                    <Row
                      // className='table__batch'
                      justify='space-around'
                      align='middle'
                    >
                      <Col md={14} sm={13} xs={12}>
                        <BatchAction
                          selectedRowKeys={selectedRowKeys}
                          delete={deleteMultiple}
                          changeGroup={changeGroup}
                          MakeInActiveMultiple={MakeInActiveMultiple}
                        />
                      </Col>
                      <Col md={8} sm={9} xs={10}>
                        <Dropdown
                          overlay={menu}
                          trigger={['click']}
                          onOpenChange={handleVisibleChangFilter}
                          open={visibleFilter}
                        >
                          {/* <a
                            className='ant-dropdown-link'
                            onClick={(e) => e.preventDefault()}
                            href='#'
                          > */}

                          <Button className='num ' shape='round'>
                            {t('Sales.Product_and_services.Filters')}{' '}
                            <CaretDownOutlined />
                          </Button>
                          {/* </a> */}
                        </Dropdown>
                      </Col>
                    </Row>
                  </Col>

                  <Col
                    xl={
                      collapse
                        ? { span: 3, offset: 13 }
                        : { span: 2, offset: 15 }
                    }
                    lg={{ span: 3, offset: 11 }}
                    md={{ span: 3, offset: 9 }}
                    sm={
                      collapse ? { span: 5, offset: 2 } : { span: 4, offset: 7 }
                    }
                    xs={{ span: 24 }}
                    className='table__header2'
                  >
                    <Row justify='end'>
                      <Col sm={8} xs={2}>
                        {' '}
                        <PrinterOutlined className='table__header2-icon' />
                      </Col>
                      <Col sm={8} xs={2}>
                        <ExportOutlined className='table__header2-icon' />
                      </Col>
                      <Col sm={8} xs={2}>
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
              title={t('Sales.Customers.Form.Date').toUpperCase()}
              width={isMobile ? 70 : 170}
              dataIndex='date'
              key='date'
              fixed={true}
              // render={(text, record) => (
              //   <React.Fragment>
              //     <Link to={`/customers/details/${record.id}`}>{text}</Link>
              //     <br />
              //     {record.last_name}
              //   </React.Fragment>
              // )}
              className='table-col'
            />

            {customer && (
              <Column
                title={t('Sales.Customers.Customer').toUpperCase()}
                dataIndex='customer'
                key='customer'
                width={150}
                className='table-col'
              />
            )}
            {method && (
              <Column
                title={t('Sales.Customers.Form.Method').toUpperCase()}
                dataIndex='method'
                key='method'
                className='table-col'
              />
            )}
            {source && (
              <Column
                title={t('Sales.Customers.Form.Source').toUpperCase()}
                dataIndex='source'
                key='source'
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
            {ageing && (
              <Column
                title={t('Sales.Customers.Form.Ageing').toUpperCase()}
                dataIndex='ageing'
                key='ageing'
                className='table-col'
                // width={150}
              />
            )}
            {lastDelivered && (
              <Column
                title={t('Sales.Customers.Form.Last_delivered').toUpperCase()}
                dataIndex='last_delivered'
                key='last_delivered'
                className='table-col'
                // width={150}
              />
            )}
            {email && (
              <Column
                title={t('Form.Email').toUpperCase()}
                dataIndex='email'
                key='email'
                className='table-col'
                // width={150}
              />
            )}
            {attachments && (
              <Column
                title={t('Form.Attachments').toUpperCase()}
                dataIndex='attachments'
                key='attachments'
                className='table-col'
              />
            )}
            {type && (
              <Column
                title={t('Sales.Product_and_services.Type').toUpperCase()}
                dataIndex='type'
                key='type'
                className='table-col'
              />
            )}
            {no && (
              <Column
                title={t('Sales.Customers.Form.No').toUpperCase()}
                dataIndex='no'
                key='no'
                className='table-col'
              />
            )}
            {deuDate && (
              <Column
                title={t('Sales.Customers.Form.Deu_date').toUpperCase()}
                dataIndex='deu_date'
                key='deuDate'
                className='table-col'
              />
            )}
            {balance && (
              <Column
                title={t('Sales.Customers.Form.Balance').toUpperCase()}
                dataIndex='balance'
                key='balance'
                className='table-col'
              />
            )}
            {status && (
              <Column
                title={t('Sales.Product_and_services.Status').toUpperCase()}
                dataIndex='status'
                key='status'
                className='table-col'
              />
            )}
            <Column
              title={t('Sales.Customers.Form.Total').toUpperCase()}
              dataIndex='total'
              key='total'
              className='table-col'
            />
            <Column
              title={t('Table.Action')}
              key='action'
              width={isMobile ? 50 : 70}
              render={(text, record) => (
                // <Row justify={isMobile ? "space-between" : "space-around"}>
                //   <Col md={14} xs={17}>
                //     <a href='#'>Print</a>
                //   </Col>
                //   <Col md={7} xs={4}>
                <TransactionAction
                  record={record}
                  delete={deleteProduct}
                  inActive={inActive}
                  edit={edit}
                />
                //   </Col>
                // </Row>
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
// const styles = {
//   card: { background: "#3498db", padding: "24px 20px" },
//   // title:,
//   // value:
// };

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

// export default connect(mapStateToProps, { getProducts, getServecies })(
//   withDatabase(enhancProduct(TransactionTable))
// );
export default connect(mapStateToProps)(TransactionTable);
