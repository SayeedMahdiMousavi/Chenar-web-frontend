import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import withObservables from '@nozbe/with-observables';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { Q } from '@nozbe/watermelondb';
import {
  FilterOutlined,
  DownOutlined,
  SettingOutlined,
  CaretDownOutlined,
  //   DownOutlined,
  //   UpOutlined,
} from '@ant-design/icons';

import {
  Checkbox,
  Row,
  Col,
  Select,
  message,
  Menu,
  //   Form,
  Table,
  Dropdown,
  Button,
  Input,
  //   Modal,
  Statistic,
  Card,
  //   BackTop,
  Typography,
} from 'antd';
// import Table from "rc-table";
import { useTranslation } from 'react-i18next';
import Filters from './Filters';
import Action from './Action';
import { useMediaQuery } from '../../MediaQurey';
// import InActive from "./InActive";
import RecordPayment from './RecordPayment';
import { Link } from 'react-router-dom';
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Column } = Table;
const { Search } = Input;
// let inactive = false;
// let active1 = true;
// let allProducts = false;

const PaymentsTable = ({ activeProducts, customers }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [{ visible }, setVisibal] = useState({
    visible: false,
  });
  const [visibleFilter, setVisibleFilter] = useState(false);
  // const [pagination, setPagination] = useState({ pageSize: 5 });
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery('(max-width:425px)');
  const { t } = useTranslation();

  const [{ phone, email, showInactive }, setColumns] = useState({
    phone: true,
    email: true,
    showInactive: false,
  });

  const [data, setData] = useState([]);

  useEffect(() => {
    // let allDat = [];
    // customers.forEach((produc) => {
    //   const data = {
    //     key: produc.id,
    //     name: produc.name,
    //     address: produc.last_name,
    //     phone: produc.phone,
    //     email: produc.email,
    //     attachments: produc.attachments,
    //   };
    //   allDat.unshift(data);
    // });
    if (showInactive) {
      setData(customers);
    } else {
      setData(activeProducts);
    }
  }, [activeProducts, customers, showInactive]);
  // useEffect(() => {
  //   fetch({ pagination });
  // }, []);
  const getRandomuserParams = (params) => {
    return {
      results: params.pagination.pageSize,
      page: params.pagination.current,
      ...params,
    };
  };
  const fetch = (params = {}) => {
    setLoading(true);

    // reqwest({
    //   url: 'https://randomuser.me/api',
    //   method: 'get',
    //   type: 'json',
    //   data: getRandomuserParams(params),
    // }).then(data => {

    setLoading(false);
    // setPagination({
    //   ...params.pagination,
    // });
    setData(customers);

    // });
  };
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
  const active = (id) => {
    // inactive = true;
    const allDat = data?.map((item) => {
      if (item.key === id) {
        return {
          ...item,
          status: 'active',
        };
      } else {
        return item;
      }
    });
    // setData(allDat);
  };
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

  //setting drop
  const handleVisibleChange = (flag) => {
    setVisibal({ visible: flag });
  };

  const onChangeInactive = (e) => {
    setColumns((prev) => {
      return { ...prev, showInactive: !showInactive };
    });
  };

  //   const hasSelected = selectedRowKeys.length > 0;
  //   const deleteMultiple = () => {
  //     const allData = data.filter((item) => {
  //       for (let index = 0; index < selectedRowKeys.length; index++) {
  //         const element = selectedRowKeys[index];
  //         if (item.id === element) {
  //           return false;
  //         }
  //       }
  //       return true;
  //     });

  //     setData(allData);
  //   };
  //   const MakeInActiveMultiple = () => {
  //     setSelectedRowKeys([]);
  //     // let element = [];
  //     // for (let index = 0; index < selectedRowKeys.length; index++) {
  //     //   element = selectedRowKeys[index];
  //     // }
  //     // const allDat = data.map((item) => {
  //     //   if (item.key === selectedRowKeys[0]) {
  //     //     return {
  //     //       ...item,
  //     //       status: "inActive",
  //     //     };
  //     //   } else {
  //     //     return item;
  //     //   }
  //     // });

  //     // setData(allDat);
  //     //
  //   };
  //   const changeGroup = (value) => {
  //     const allData = data.map((item) => {
  //       let element = [];
  //       for (let index = 0; index < selectedRowKeys.length; index++) {
  //         element = selectedRowKeys[index];
  //       }
  //       if (item.key === element) {
  //         return { ...item, status: value };
  //       }
  //       return item;
  //     });

  //     setData(allData);

  //     setSelectedRowKeys([]);
  //   };
  const setting = (
    <div className='table__header2-setting'>
      {/* <Col span={24}> */}
      <Checkbox.Group defaultValue={['B', 'A']}>
        <Row className='table__header2-setting-group' gutter={[0, 11]}>
          <Col span={20} offset={2} style={{ paddingBottom: '0rem' }}>
            <p>
              <Text strong={true}> {t('Form.Display_density')}</Text>
            </p>
          </Col>
          <Col span={20} offset={2} style={{ paddingTop: '0rem' }}>
            <Checkbox
              value='E'
              onChange={onChangeInactive}
              className='table__header2-setting-column'
            >
              {t('Sales.Customers.Compact')}
            </Checkbox>
          </Col>
        </Row>
      </Checkbox.Group>
      <Row>
        <Col offset={2} span={22}>
          <label htmlFor='status'>{t('Sales.Product_and_services.Rows')}</label>
        </Col>
        <Col offset={2} span={10}>
          <Select
            showSearch
            defaultValue={30}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value={30}>30</Option>
            <Option value={20}>20</Option>
            <Option value={10}>10</Option>
          </Select>
        </Col>
      </Row>
      {/* </Col> */}
    </div>
  );
  const paginationChange = (page, pageSize) => {
    // if (page === 2) {
    //   setData(masoud);
    // } else if (page === 3) {
    //   setData(marouf);
    // }
  };
  // pagination
  const pagination = {
    total: 200,
    pageSizeOptions: [5, 10, 20, 50],
    defaultPageSize: 5,
    onChange: paginationChange,
    showTotal: (total) =>
      `${t('Pagination.Total')} ${total} ${t('Pagination.Item')}`,
    // size: isMobile ? "small" : "default",
    showQuickJumper: true,
    showSizeChanger: true,
    responsive: true,
    showLessItems: true,
  };
  //filter
  const handleVisibleChangFilter = (flag) => {
    setVisibleFilter(flag);
  };
  const menu = <Filters />;
  return (
    <div className='table-col table__padding'>
      <Row className='customer__table'>
        <Col span={24}>
          <Table
            loading={loading}
            expandable
            // className='table-content'
            size='middle'
            tableLayout='auto'
            rowKey={(record) => record.id}
            pagination={pagination}
            dataSource={data}
            // scroll={
            //   this.state.quality && this.state.description && { x: "1000" }
            // }
            // bordered={true}
            scroll={{ x: 1300, scrollToFirstRowOnChange: true }}
            align='center'
            title={() => {
              return (
                <div>
                  <Row justify='end'>
                    <Col>
                      <RecordPayment />
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      xl={{ span: 2 }}
                      lg={{ span: 2 }}
                      md={{ span: 3 }}
                      sm={{ span: 5 }}
                      xs={isMobile ? { span: 5 } : { span: 3 }}
                      className='table__header1'
                      style={styles.filter}
                    >
                      <Dropdown
                        overlay={menu}
                        trigger={['click']}
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
                      </Dropdown>
                    </Col>

                    <Col
                      xl={{ span: 2, offset: 20 }}
                      lg={{ span: 2, offset: 20 }}
                      md={{ span: 2, offset: 19 }}
                      sm={{ span: 3, offset: 16 }}
                      xs={
                        isMobile
                          ? { span: 5, offset: 14 }
                          : { span: 4, offset: 17 }
                      }
                      className='table__header2'
                      // style={{ background: "white" }}
                    >
                      <Row justify='end'>
                        <Col span={12}>
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
                  </Row>
                </div>
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
                  <span style={styles.firstRow}> {text} </span>
                </React.Fragment>
              )}
              className='table-col'
            />

            <Column
              title={t('Sales.Product_and_services.Type').toUpperCase()}
              dataIndex='type'
              key='type'
              className='table-col'
            />

            <Column
              title={t('Taxes.Form.Tax_period').toUpperCase()}
              dataIndex='tax_period'
              key='tax_period'
              className='table-col'
              // width={150}
            />
            <Column
              title={t('Taxes.Form.Amount').toUpperCase()}
              dataIndex='amount'
              key='amount'
              className='table-col'
              // width={150}
            />
            <Column
              title={t('Sales.Customers.Form.Memo').toUpperCase()}
              dataIndex='memo'
              key='memo'
              className='table-col'
              // width={150}
            />

            <Column
              title={t('Table.Action')}
              key='action'
              width={isMobile ? 50 : 70}
              align='center'
              render={
                (text, record) => (
                  // record.status === "inActive" ? (
                  //   //   <InActive record={record} active={active} />
                  //   <div></div>
                  // ) : (
                  <Action
                    record={record}
                    delete={deleteProduct}
                    inActive={inActive}
                    edit={edit}
                  />
                )

                // )
              }
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
  tableHeader: { margin: '0 1rem' },
  firstRow: { paddingInlineStart: '1rem' },
  filter: { textAlign: 'center' },
};

const mapStateToProps = (state) => ({
  products: state.products.products,
  rtl: state.direction.rtl,
  ltr: state.direction.ltr,
  servecies: state.servecies.servecies,
});
const enhancProduct = withObservables(['customers'], ({ database }) => ({
  customers: database.collections.get('customers').query().observe(),
  inActiveProducts: database.collections
    .get('customers')
    .query(Q.where('status', 'inActive')),
  activeProducts: database.collections
    .get('customers')
    .query(Q.where('status', 'active')),
}));

export default connect(mapStateToProps)(
  withDatabase(enhancProduct(PaymentsTable)),
);
