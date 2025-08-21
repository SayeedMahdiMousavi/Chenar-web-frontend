/* eslint-disable react/display-name */
import React, { useCallback, useMemo, useState } from "react";
// import { debounce } from "throttle-debounce";
// import { getProducts } from "../../actions/products/actionProducts";
// import { getServecies } from "../../actions/servecies/action";
import BatchAction from "./BatchAction";
// import withObservables from "@nozbe/with-observables";
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
// import { Q } from "@nozbe/watermelondb";
// import { TweenOneGroup } from "rc-tween-one";
import { Colors } from "../../colors";
import axiosInstance from "../../ApiBaseUrl";
import { Table } from "antd";
import { useTranslation } from "react-i18next";
import ProductTableFilter from "./ProductTableFilter";
import Action from "./DeleteProducts";
import { useMediaQuery } from "../../MediaQurey";
import Photo from "./Photo";
import ShowDate from "../../SelfComponents/JalaliAntdComponents/ShowDate";
import { PaginateTable, AntdTag, Statistics } from "../../../components/antd";
import { PRODUCT_M } from "../../../constants/permissions";
import ProductSettings from "./ProductSettings";
import { TrueFalseIcon } from "../../../components";

const { Column } = Table;

const ProductTable = (props) => {
  const [filters, setFilters] = useState({ state: "active", category: "" });
  const isMobile = useMediaQuery("(max-width:425px)");
  const { t, i18n } = useTranslation();
  const [filterColumns, setColumns] = useState({
    price: true,
    category: true,
    barcode: false,
    description: false,
    createdBy: false,
    photo: false,
    modifiedBy: false,
    vip: false,
    modifiedDate: false,
    createdDate: false,
  });

  const {
    price,
    barcode,
    description,
    createdBy,
    photo,
    modifiedDate,
    modifiedBy,
    vip,
    category,
    createdDate,
  } = filterColumns;

  //get product list
  const handleGetProducts = useCallback(
    async ({ queryKey }) => {
      const { page, pageSize, search, order, state, category } = queryKey?.[1] || {};
      const { data } = await axiosInstance.get(
        `${props?.baseUrl}?page=${page}&page_size=${pageSize}&ordering=${order}&status=${state}&search=${search}&category=${category}&expand=*,product_units.unit,vip_price,product_barcode.unit&omit=product_statistic,min_max,is_pine,cht_account_id,category.get_fomrated_path,category.description,category.node_parent,category.system_default,category.is_leaf,category.depth,created_by.first_name`
      );

      return data;
    },
    [props.baseUrl]
  );

  const setting = (
    <ProductSettings {...filterColumns} setColumns={setColumns} />
  );

  const handleCheckBaseUnitPrice = (record) => {
    return record?.price?.find((item) =>
      item?.unit_pro_relation?.includes("base_unit")
    );
  };

  const columns = useMemo(
    () => (type, hasSelected) => {
      const sorter = type !== "print";
      return (
        <React.Fragment>
          <Column
            title={t("Sales.Product_and_services.Product_id").toUpperCase()}
            dataIndex="id"
            key="id"
            fixed={type !== "print" ? true : false}
            width={
              type !== "print"
                ? i18n.language === "en"
                  ? 135
                  : 145
                : undefined
            }
            sorter={sorter && { multiple: 12 }}
            // align="center"
          />
          <Column
            title={`${t("Form.Name").toUpperCase()}`}
            // width={isMobile ? 70 : 180}
            dataIndex="name"
            key="name"
            fixed={type !== "print" ? true : false}
            sorter={sorter && { multiple: 11 }}
          />
          {photo && (
            <Column
              title={`${t("Form.Photo").toUpperCase()}`}
              dataIndex="photo"
              key="photo"
              width={80}
              align="center"
              render={(text) => {
                return <Photo photo={text} type="product" />;
              }}
            />
          )}

          {barcode && (
            <Column
              title={`${t("Sales.Product_and_services.Barcode").toUpperCase()}`}
              dataIndex="barcode"
              key="barcode"
              // width={150}
              sorter={sorter && { multiple: 10 }}
              render={(text, record) => (
                <React.Fragment>
                  {sorter
                    ? record?.product_barcode?.map((item) => (
                        <AntdTag
                          key={item?.barcode}
                          color={Colors.primaryColor}
                        >
                          {item?.barcode}
                        </AntdTag>
                      ))
                    : record?.product_barcode?.map((item, index) => {
                        if (index === 0) {
                          return item?.barcode;
                        }
                        return `,${item?.barcode}`;
                      })}
                </React.Fragment>
              )}
            />
          )}
          {price && (
            <Column
              title={`${t(
                "Sales.Product_and_services.Price_recording.Sales_price"
              ).toUpperCase()}`}
              dataIndex="price__sales_rate"
              key="price__sales_rate"
              // width={type !== "print" ? 120 : undefined}
              // align="center"
              sorter={sorter && { multiple: 9 }}
              render={(text, record) => {
                const unitPrice = handleCheckBaseUnitPrice(record)?.sales_rate;

                return unitPrice && <Statistics value={unitPrice} />;
              }}
            />
          )}

          {/* {modifiedBy && (
              <Column
                title={`${t(
                  "Sales.Product_and_services.Form.Is_origin_barcode"
                ).toUpperCase()}`}
                dataIndex="original_barcode"
                key="original_barcode"
                // width={150}
                
                sorter={sorter&&{ multiple: 5 }}
                align="center"
                render={(text, record) => {
                  return (
                    <span>
                      {!text ? (
                        <CloseOutlined style={styles.close} />
                      ) : (
                        <CheckOutlined className="list_tick" />
                      )}
                    </span>
                  );
                }}
              />
            )} */}
          {vip && (
            <Column
              title={`${t(
                "Sales.Product_and_services.Form.Vip_price"
              ).toUpperCase()}`}
              dataIndex="is_have_vip_price"
              key="is_have_vip_price"
              // width={150}

              sorter={sorter && { multiple: 8 }}
              align="center"
              render={(value) => {
                return <TrueFalseIcon value={value} />;
              }}
            />
          )}

          <Column
            title={t("Sales.Product_and_services.Form.Units").toUpperCase()}
            dataIndex="product_units"
            key="product_units"
            render={(value) => {
              return (
                <span style={styles.unit}>
                  {sorter
                    ? value?.map((item) => {
                        return (
                          <AntdTag
                            key={item?.unit?.name}
                            color={Colors.primaryColor}
                          >
                            {item?.unit?.name}
                          </AntdTag>
                        );
                      })
                    : value?.map((item, index) => {
                        if (index === 0) {
                          return item?.unit?.name;
                        }
                        return `,${item?.unit?.name}`;
                      })}
                </span>
              );
            }}
            sorter={sorter && { multiple: 7 }}
          />

          {category && (
            <Column
              title={`${t(
                "Sales.Product_and_services.Category"
              ).toUpperCase()}`}
              dataIndex="category"
              key="category"
              render={(text) => {
                // return <span>{text?.get_fomrated_path}</span>;
                return <span>{text?.name}</span>
              }}
              sorter={sorter && { multiple: 6 }}
              // width={150}
            />
          )}
          {createdBy && (
            <Column
              title={`${t(
                "Sales.Product_and_services.Form.Created_by"
              ).toUpperCase()}`}
              dataIndex="created_by"
              key="created_by"
              render={(text) => {
                return <span>{text?.username} </span>;
              }}
              sorter={sorter && { multiple: 5 }}
            />
          )}
          {modifiedBy && (
            <Column
              title={`${t(
                "Sales.Product_and_services.Form.Modified_by"
              ).toUpperCase()}`}
              dataIndex="modified_by"
              key="modified_by"
              render={(text) => {
                return <span>{text?.username} </span>;
              }}
              sorter={sorter && { multiple: 4 }}
            />
          )}
          {createdDate && (
            <Column
              title={`${t(
                "Sales.Product_and_services.Form.Created_date"
              ).toUpperCase()}`}
              dataIndex="created"
              key="created"
              render={(text) => {
                return <ShowDate date={text} />;
              }}
              sorter={sorter && { multiple: 3 }}
            />
          )}
          {modifiedDate && (
            <Column
              title={`${t(
                "Sales.Product_and_services.Form.Modified_date"
              ).toUpperCase()}`}
              dataIndex="modified"
              key="modified"
              render={(text) => {
                return <ShowDate date={text} />;
              }}
              sorter={sorter && { multiple: 2 }}
            />
          )}

          {description && (
            <Column
              title={`${t("Form.Description").toUpperCase()}`}
              dataIndex="description"
              key="description"
              sorter={sorter && { multiple: 1 }}
            />
          )}

          {type !== "print" && (
            <Column
              title={t("Table.Action")}
              key="action"
              width={isMobile ? 55 : 70}
              align="center"
              render={(text, record) => (
                <div>
                  <Action
                    record={record}
                    baseUrl={props.baseUrl}
                    hasSelected={hasSelected}
                    handleUpdateItems={props?.handleUpdateItems}
                  />{" "}
                </div>
              )}
              fixed={"right"}
            />
          )}
        </React.Fragment>
      );
    },
    [
      t,
      i18n.language,
      photo,
      barcode,
      price,
      vip,
      category,
      createdBy,
      modifiedBy,
      createdDate,
      modifiedDate,
      description,
      isMobile,
      props.baseUrl,
      props.handleUpdateItems,
    ]
  );

  return (
    <PaginateTable
      title={t("Sales.Product_and_services.1")}
      model={PRODUCT_M}
      printIcon={null}
      columns={columns}
      queryKey={props.baseUrl}
      placeholder={t("Sales.Product_and_services.Find_Products_and_Services")}
      handleGetData={handleGetProducts}
      filters={filters}
      settingMenu={setting}
      filterNode={(setPage, setVisible) => (
        <ProductTableFilter
          setFilters={setFilters}
          setVisible={setVisible}
          setPage={setPage}
        />
      )}
      batchAction={(
        selectedRowKeys,
        setSelectedRowKeys,
        selectedRows,
        setSelectedRows,
        columns
      ) => (
        <BatchAction
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          columns={columns}
          baseUrl={props.baseUrl}
        />
      )}
    />
  );
};
const styles = {
  modal1: (photo) => ({
    padding: "0px",
  }),
  closeIcon: { color: `${Colors.white}` },
  unit: {},
  settingsMenu: { width: "160px", paddingBottom: "10px" },
  close: { color: `${Colors.red}` },
};
// const mapStateToProps = (state) => ({
//   // products: state.products.products,
//   rtl: state.direction.rtl,
//   ltr: state.direction.ltr,
//   // servecies: state.servecies.servecies,
// });
// const enhancProduct = withObservables(["products"], ({ database }) => ({
//   // product: database.collections
//   //   .get("products")
//   //   .query(Q.where("status", "active"))
//   //   .observe(),
//   inActiveProducts: database.collections
//     .get("products")
//     .query(Q.where("status", "inActive")),
//   activeProducts: database.collections
//     .get("products")
//     .query(Q.where("status", "active")),
// }));

export default ProductTable;
