import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// import { getProducts } from "../../../actions/products/actionProducts";
// import { getServecies } from "../../../actions/servecies/action";
import BatchAction from './BatchAction';
// import withObservables from "@nozbe/with-observables";
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
// import { Q } from "@nozbe/watermelondb";
import {
  // FilterOutlined,
  PrinterOutlined,
  ExportOutlined,
  SettingOutlined,
  // CaretDownOutlined,
  // DownOutlined,
  // UpOutlined,
  // UpSquareTwoTone,
  // DownSquareTwoTone,
  // ArrowDownOutlined,
} from '@ant-design/icons';

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
  Input,
  // Modal,
  // Statistic,
  // Card,
} from 'antd';
// import Table from "rc-table";
import { useTranslation } from 'react-i18next';

import Action from './Action';
import { useMediaQuery } from '../../MediaQurey';
import InActive from './InActive';

const { Option } = Select;
const { Column } = Table;
const { Search } = Input;

const AccountsTable = ({ activeProducts, customers }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [{ visible }, setVisibal] = useState({
    visible: false,
  });
  const isMobile = useMediaQuery('(max-width:425px)');
  const { t } = useTranslation();

  const [
    { type, detailType, taxRate, pandaBalance, showInactive },
    setColumns,
  ] = useState({
    type: true,
    detailType: true,
    taxRate: true,
    pandaBalance: true,
    showInactive: false,
  });
  const [count, setCount] = useState(10);
  const [data, setData] = useState([]);

  const [search, setSearch] = useState('');

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
    const allDat = data?.filter((item) => item.id !== id);
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
  //search
  const onSearch = (e) => {
    setSearch(e.target.value);
  };
  //
  const filterDataSource = data?.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(search.toLowerCase());

    return nameMatch;
  });

  //select
  const onChangeNumber = (value) => {
    const count = parseInt(value, 10) || 0;
    setCount(count);
  };

  const onBlur = () => {};

  const onFocus = () => {};

  // const onSearch = (val) => {
  //
  // };

  //setting drop
  const handleVisibleChange = (flag) => {
    setVisibal({ visible: flag });
  };

  //setting checkbox
  const onChangeType = () =>
    setColumns((prev) => {
      return { ...prev, type: !type };
    });

  const onChangeDetailType = () =>
    setColumns((prev) => {
      return { ...prev, detailType: !detailType };
    });

  const onChangeTaxRate = (e) => {
    // const description = e.target.cheked;
    setColumns((prev) => {
      return { ...prev, taxRate: !taxRate };
    });
  };
  const onChangePandaBalance = (e) => {
    setColumns((prev) => {
      return { ...prev, pandaBalance: !pandaBalance };
    });
  };
  const onChangeInactive = (e) => {
    setColumns((prev) => {
      return { ...prev, showInactive: !showInactive };
    });
  };

  const hasSelected = selectedRowKeys.length > 0;
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
    //   console.log(
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
      <Checkbox.Group defaultValue={['B', 'A', 'C', 'D']}>
        <Row className='table__header2-setting-group' gutter={[0, 11]}>
          <Col span={20} offset={2}>
            <h4>{t('Sales.Product_and_services.Columns')}</h4>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              value='B'
              name='address'
              onChange={onChangeType}
              className='table__header2-setting-column'
            >
              {t('Sales.Product_and_services.Type')}
            </Checkbox>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              name='price'
              value='A'
              onChange={onChangeDetailType}
              className='table__header2-setting-column'
            >
              {t('Accounting.Chart_of_accounts.Form.Detail_type')}
            </Checkbox>
          </Col>

          <Col span={20} offset={2}>
            <Checkbox
              value='C'
              name='email'
              onChange={onChangeTaxRate}
              className='table__header2-setting-column'
            >
              {t('Taxes.Tax_rates.Tax_rate')}
            </Checkbox>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              value='D'
              onChange={onChangePandaBalance}
              className='table__header2-setting-column'
            >
              {t('Accounting.Chart_of_accounts.Form.Panda_balance')}
            </Checkbox>
          </Col>

          <Col span={20} offset={2} style={{ paddingBottom: '0rem' }}>
            <p style={{ margin: '0rem' }}> {t('Sales.Customers.Other')}</p>
          </Col>
          <Col span={20} offset={2} style={{ paddingTop: '0rem' }}>
            <Checkbox
              value='E'
              onChange={onChangeInactive}
              className='table__header2-setting-column'
            >
              {t('Sales.Customers.Include_inactive')}
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
            defaultValue={count}
            optionFilterProp='children'
            onChange={onChangeNumber}
            onFocus={onFocus}
            onBlur={onBlur}
            onSearch={onSearch}
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
      <Row className='customer__table' justify='space-around'>
        <Col span={23} className='banner'>
          <Table
            expandable
            className='table-content'
            size='middle'
            tableLayout='auto'
            title={() => {
              return (
                <Row style={{ width: '100%' }}>
                  <Col
                    xl={{ span: 6 }}
                    lg={{ span: 7 }}
                    md={{ span: 8 }}
                    sm={{ span: 8 }}
                    xs={{ span: 12 }}
                    className='table__header1'
                    // style={{ background: "white" }}
                  >
                    <Search
                      placeholder={t('Employees.Filter_by_name')}
                      value={search}
                      setSearch={setSearch}
                      className='table__header1-input'
                    />
                  </Col>
                  {hasSelected ? (
                    <Col
                      xl={{ span: 4, offset: 14 }}
                      lg={{ span: 5, offset: 12 }}
                      md={{ span: 5, offset: 11 }}
                      sm={{ span: 7, offset: 9 }}
                      xs={{ span: 11, offset: 1 }}
                    >
                      <BatchAction
                        selectedRowKeys={selectedRowKeys}
                        delete={deleteMultiple}
                        changeGroup={changeGroup}
                        MakeInActiveMultiple={MakeInActiveMultiple}
                      />
                    </Col>
                  ) : (
                    <Col
                      xl={{ span: 2, offset: 16 }}
                      lg={{ span: 3, offset: 14 }}
                      md={{ span: 3, offset: 13 }}
                      sm={{ span: 4, offset: 12 }}
                      xs={{ span: 6, offset: 6 }}
                      className='table__header2'
                      // style={{ background: "white" }}
                    >
                      <Row>
                        <Col span={8}>
                          <PrinterOutlined className='table__header2-icon' />
                        </Col>
                        <Col span={8}>
                          <ExportOutlined className='table__header2-icon' />
                        </Col>
                        <Col span={8}>
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
                  )}
                </Row>
              );
            }}
            rowSelection={rowSelection}
            rowKey={(record) => record.id}
            pagination={pagination}
            dataSource={filterDataSource}
            // scroll={
            //   this.state.quality && this.state.description && { x: "1000" }
            // }
            bordered={true}
            scroll={{ x: 'max-content', scrollToFirstRowOnChange: true }}
            align='center'
          >
            <Column
              title={t('Form.Name').toUpperCase()}
              width={isMobile ? 70 : 170}
              dataIndex='name'
              key='name'
              fixed={true}
              className='table-col'
            />

            {type && (
              <Column
                title={t('Sales.Product_and_services.Type').toUpperCase()}
                dataIndex='type'
                key='type'
                width={150}
                className='table-col'
              />
            )}
            {detailType && (
              <Column
                title={t(
                  'Accounting.Chart_of_accounts.Form.Detail_type',
                ).toUpperCase()}
                dataIndex='detailType'
                key='detailType'
                className='table-col'
              />
            )}
            {taxRate && (
              <Column
                title={t('Taxes.Tax_rates.Tax_rate').toUpperCase()}
                dataIndex='taxRate'
                key='taxRate'
                className='table-col'
                // width={150}
              />
            )}
            {pandaBalance && (
              <Column
                title={t(
                  'Accounting.Chart_of_accounts.Form.Panda_balance',
                ).toUpperCase()}
                dataIndex='pandaBalance'
                key='pandaBalance'
                className='table-col'
              />
            )}
            <Column
              title={t(
                'Accounting.Chart_of_accounts.Form.Bank_balance',
              ).toUpperCase()}
              dataIndex='bankBalance'
              key='bankBalance'
              className='table-col'
            />
            <Column
              title={t('Table.Action')}
              key='action'
              width={isMobile ? 50 : 70}
              render={(text, record) =>
                record.status === 'inActive' ? (
                  <InActive record={record} active={active} />
                ) : (
                  <Action
                    record={record}
                    delete={deleteProduct}
                    inActive={inActive}
                    edit={edit}
                  />
                )
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
//   inActiveProducts: database.collections
//     .get("customers")
//     .query(Q.where("status", "inActive")),
//   activeProducts: database.collections
//     .get("customers")
//     .query(Q.where("status", "active")),
// }));

// export default connect(mapStateToProps)(
//   withDatabase(enhancProduct(AccountsTable))
// );
export default connect(mapStateToProps)(AccountsTable);
