import React, { useState } from "react";
import { connect } from "react-redux";

// import withObservables from "@nozbe/with-observables";
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
// import { Q } from "@nozbe/watermelondb";
import axiosInstance from "../../../ApiBaseUrl";
import { Title } from "../../../SelfComponents/Title";
import { useQuery, useQueryClient } from "react-query";
// import { Colors } from "../colors";
import AddDiscount from "./AddDiscount";
import {
  Row,
  Col,
  // message,

  // Skeleton,
  Table,

  //   Button,
  // Input,
  // Typography,
  BackTop,
} from "antd";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "../../../MediaQurey";
import Action from "./Action";
import { Link } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { SearchInput } from "../../../SelfComponents/SearchInput";
import { usePaginationNumber } from "../../../usePaginationNumber";
// const { Paragraph } = Typography;

const { Column } = Table;
// const { Search } = Input;

const Discounts = (props) => {
  const queryClient = useQueryClient();
  // const isMiniMobile = useMediaQuery("(max-width:350px)");
  const isMobile = useMediaQuery("(max-width:400px)");
  // const isMiniTablet1 = useMediaQuery("(max-width:576px)");
  // const isMiniTablet = useMediaQuery("(max-width:470px)");
  const { t, i18n } = useTranslation();
  const [order, setOrder] = useState("-id");
  // const [allData, setAllData] = useState([]);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState("");
  // const [visible, setVisible] = useState(false);
  // const [status1, setStatus1] = useState(true);

  //edit
  // const edit = (Allfilds, id) => {
  //   const allDat = data.map((item) => {
  //     if (item.key === id) {
  //       return {
  //         ...item,
  //         ...Allfilds,
  //       };
  //     } else {
  //       return item;
  //     }
  //   });
  //   setData(allDat);
  // };
  // //delete
  // const deleteProduct = (id) => {
  //   const allDat = data.filter((item) => item.id !== id);
  //   setData(allDat);
  //   
  // };
  // //active
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
  // //inactive
  // const inActive = (id) => {
  //   // active1 = true;
  //   const allDat = data.map((item) => {
  //     if (item.key === id) {
  //       return {
  //         ...item,
  //         status: "inActive",
  //       };
  //     } else {
  //       return item;
  //     }
  //   });
  //   
  //   setData(allDat);
  // };
  //search
  //filter
  // const handleVisibleChangFilter = (flag) => {
  //   setVisible({ visibleFilter: flag });
  // };
  // const menu = <div></div>;
  // <Filters setStatus1={setStatus1} setVisible={setVisible} />;
  const getDiscountCardData = async (key, page, pageSize, search, order) => {
    const { data } = await axiosInstance.get(
      `/customer_account/discount/card/?page=${page}&page_size=${pageSize}&ordering=${order}&search=${search}&expand=*`
    );
    return data;
  };
  const {
    isLoading,
    isFetching,
    data,

    // error,
    // isFetching,
  } = useQuery(
    [`/customer_account/discount/card/`, page, pageSize, search, order],
    getDiscountCardData
  );
  const hasMore = Boolean(data?.nextPageNumber);
  React.useEffect(() => {
    if (hasMore) {
      queryClient.prefetchQuery(
        [`/customer_account/discount/card/`, page, pageSize, search, order],
        getDiscountCardData
        // { refetchInterval: 100 }
      );
    }
  }, [page, pageSize, search, order, hasMore, queryClient]);
  // 
  //search
  // const onSearch = (e) => {
  //   debounceFunc(e.target.value);
  // };
  // const debounceFunc = debounce(800, async (value) => {
  //   setSearch(value);
  // });
  //pagination
  const paginationChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };
  const onPageSizeChange = (current, size) => {
    setPageSize(size);
    setPage(current);
    // 
  };

  const onChangeTable = (pagination, filters, sorter) => {
    // 
    if (sorter.order === "ascend") {
      setOrder(sorter.field);
    } else if (sorter.order === "descend") {
      setOrder(`-${sorter.field}`);
    } else {
      setOrder(`-id`);
    }
  };

  const pagination = {
    total: data?.count,
    pageSizeOptions: [5, 10, 20, 50],
    onShowSizeChange: onPageSizeChange,
    defaultPageSize: 5,
    current: page,
    pageSize: pageSize,
    defaultCurrent: 1,
    onChange: paginationChange,
    showTotal: (total) =>
      `${t("Pagination.Total")} ${total} ${t("Pagination.Item")}`,
    // size: isMobile ? "small" : "default",
    showQuickJumper: true,
    showSizeChanger: true,
    responsive: true,
    showLessItems: true,
  };
  const allData = usePaginationNumber(data, page, pageSize);
  // 
  // 
  // if (status === "loading") {
  //   return (
  //     <Row justify='space-around'>
  //       <Col span={23} className='product_table_skeleton banner'>
  //         <Skeleton
  //           loading={true}
  //           paragraph={{ rows: 8 }}
  //           title={false}
  //           active
  //         ></Skeleton>
  //       </Col>
  //     </Row>
  //   );
  // } else

  // 

  return (
    <div className="table-col page-body table__padding" id="CategoryBackUp">
      <Row justify="space-around">
        <Col xl={23} md={23} xs={23} className="banner">
          <Row className="categore-header" align="middle" justify="start">
            <Col
              md={{ span: 10 }}
              sm={{ span: 11 }}
              xs={{ span: 14 }}
              className="Sales__content-3-body"
            >
              <Row>
                <Col span={24}>
                  <Title
                    value={t("Sales.Customers.Discount.Customers_discount")}
                  />
                </Col>
                <Col
                  xl={{ span: 12, offset: 0 }}
                  lg={{ span: 17, offset: 0 }}
                  md={{ span: 18, offset: 0 }}
                  xs={{ span: 17, offset: 0 }}
                >
                  <Link to="/customer" className="category__product">
                    {i18n.language === "en" ? (
                      <LeftOutlined />
                    ) : (
                      <RightOutlined />
                    )}
                    {t("Sales.Customers.1")}
                  </Link>
                </Col>
              </Row>
            </Col>
            <Col
              xl={{ span: 3, offset: 11 }}
              lg={{ span: 3, offset: 11 }}
              md={{ span: 4, offset: 10 }}
              sm={{ span: 5, offset: 8 }}
              xs={{ span: 6, offset: 4 }}
            >
              <AddDiscount />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="customer__table" justify="space-around">
        <Col span={23} className="banner">
          <Table
            loading={isLoading || isFetching ? true : false}
            size="middle"
            tableLayout="auto"
            rowKey={(record) => record.id}
            onChange={onChangeTable}
            pagination={pagination}
            dataSource={allData}
            rowClassName="rod"
            scroll={{ x: "max-content", scrollToFirstRowOnChange: true }}
            // bordered
            title={() => {
              return (
                <Row style={{ width: "100%" }}>
                  <Col
                    xl={{ span: 7 }}
                    lg={{ span: 9 }}
                    md={{ span: 10 }}
                    sm={{ span: 11 }}
                    className="table__header1"
                  >
                    <Row>
                      <Col md={18} sm={{ span: 17 }}>
                        <SearchInput
                          setPage={setPage}
                          placeholder={t("Employees.Filter_by_name")}
                          setSearch={setSearch}
                        />
                      </Col>
                      <Col
                        md={{ span: 3, offset: 2 }}
                        sm={{ span: 4, offset: 2 }}
                      >
                        {" "}
                        {/* <Dropdown
                          overlay={menu}
                          trigger={["click"]}
                          onOpenChange={handleVisibleChangFilter}
                          open={visible}
                        >
                          <a
                            className='ant-dropdown-link'
                            onClick={(e) => e.preventDefault()}
                            href='#'
                          >
                            <FilterOutlined className=' table__header1-filter' />
                            <CaretDownOutlined />
                          </a>
                        </Dropdown> */}
                      </Col>
                    </Row>
                  </Col>

                  <Col
                    xl={{ span: 2, offset: 15 }}
                    lg={{ span: 3, offset: 12 }}
                    md={{ span: 3, offset: 11 }}
                    sm={{ span: 4, offset: 9 }}
                    xs={{ span: 6, offset: 4 }}
                    className="table__header2"
                  >
                    <Row></Row>
                  </Col>
                </Row>
              );
            }}
          >
            {/* <Column
              title={t("TREE").toUpperCase()}
              // dataIndex='id'
              key='id'
              width={80}
              className='table-col'
              fixed='left'
              align='center'
            /> */}
            <Column
              title={t("Table.Row").toUpperCase()}
              dataIndex="serial"
              key="serial"
              width={80}
              className="table-col"
              fixed="left"
              align="center"
            />
            <Column
              title={t("Form.Name").toUpperCase()}
              width={isMobile ? 75 : 260}
              fixed={true}
              dataIndex="name"
              key="name"
              // render={(text, record) => (
              //   <React.Fragment>
              //     <Paragraph style={styles.firstRow1(record.level)}>
              //       {" "}
              //       {text}{" "}
              //     </Paragraph>
              //   </React.Fragment>
              // )}
              className="table-col"
              sorter={true}
            />

            <Column
              title={t(
                "Sales.Product_and_services.Inventory.Expiration_date"
              ).toUpperCase()}
              dataIndex="number_of_month"
              key="number_of_month"
              className="table-col"
              sorter={true}
              render={(text) => (
                <>{text && text + "" + t("Sales.Customers.Discount.Month")}</>
              )}
            />
            <Column
              title={t("Sales.Customers.Discount.Percent").toUpperCase()}
              dataIndex="percent"
              key="percent"
              render={(text) => <>{text && text + "%"}</>}
              className="table-col"
              sorter={true}
            />
            <Column
              title={t("Sales.Product_and_services.Type").toUpperCase()}
              dataIndex="type"
              key="type"
              className="table-col"
              render={(text) => <>{text?.name}</>}
              sorter={true}
            />

            <Column
              title={t("Table.Action")}
              key="action"
              width={isMobile ? 50 : 70}
              className="table-col"
              align="center"
              render={(text, record) => <Action record={record} />}
            />
          </Table>

          <BackTop
            visibilityHeight={200}
            target={() => document.getElementById("CategoryBackUp")}
          >
            <div className="backTop">{t("BackTop.1")}</div>
          </BackTop>
        </Col>
      </Row>
    </div>
  );
};
// const styles = {
//   firstRow: { paddingInlineStart: "1rem", margin: "0px" },
//   firstRow1: (level) => ({
//     paddingInlineStart:
//       level === "A" ? "1.5rem" : level === "B" ? "2.5rem" : "3.5rem",
//     margin: "0px",
//   }),
//   // close: { color: `${Colors.red}` },
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

export default connect(mapStateToProps)(Discounts);
