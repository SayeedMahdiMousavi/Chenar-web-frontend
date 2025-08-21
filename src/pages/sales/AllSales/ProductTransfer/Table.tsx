import React, { useCallback, useMemo } from "react";
import axiosInstance from "../../../ApiBaseUrl";
import { Table } from "antd";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "../../../MediaQurey";
import { PaginateTable } from "../../../../components/antd";
import { WAREHOUSE_M } from "../../../../constants/permissions";
import ShowDate from "../../../SelfComponents/JalaliAntdComponents/ShowDate";
import { WAREHOUSE_PRODUCT_TRANSFER_LIST } from "../../../../constants/routes";
import WarehouseProductTransferAction from "./Action";

const { Column } = Table;

const WarehouseProductTransferTable = () => {
  const isMobile = useMediaQuery("(max-width:400px)");
  const { t } = useTranslation();

  //get product transfer list
  const getProductTransferList = useCallback(async ({ queryKey }) => {
    const { page, pageSize, search, order } = queryKey?.[1];
    const { data } = await axiosInstance.get(
      `${WAREHOUSE_PRODUCT_TRANSFER_LIST}?page=${page}&page_size=${pageSize}&search=${search}&ordering=${order}
&fields=created,created_by,date_time,description,id,modified,,modified_by,currency,currency_rate`
    );
    return data;
  }, []);

  const columns = useMemo(
    () => (type: string, hasSelected: boolean) => {
      const sorter = type !== "print";
      return (
        <React.Fragment>
          <Column
            title={t(
              "Sales.All_sales.Purchase_and_sales.Invoice_id"
            ).toUpperCase()}
            dataIndex="id"
            key="id"
            width={type !== "print" ? 155 : undefined}
            sorter={sorter && { multiple: 5 }}
            fixed={type !== "print" ? true : false}
            className="table-col"
            align="center"
          />

          <Column
            title={t("Sales.Customers.Form.Date").toUpperCase()}
            // width={isMobile ? 70 : 180}
            dataIndex="date_time"
            key="date_time"
            sorter={sorter && { multiple: 4 }}
            render={(text) => {
              return <ShowDate date={text} />;
            }}
            className="table-col"
          />
          <Column
            title={t("Form.Created_by").toUpperCase()}
            dataIndex="created_by"
            key="created_by"
            sorter={sorter && { multiple: 3 }}
            width={type !== "print" ? 140 : undefined}
            render={(text) => <React.Fragment>{text?.username}</React.Fragment>}
          />
          <Column
            title={t(
              "Sales.Product_and_services.Form.Created_date"
            ).toUpperCase()}
            dataIndex="created"
            key="created"
            sorter={sorter && { multiple: 2 }}
            className="table-col"
            render={(text) => {
              return <ShowDate date={text} />;
            }}
          />
          {/* {modifiedBy && ( */}
          <Column
            title={`${t(
              "Sales.Product_and_services.Form.Modified_by"
            ).toUpperCase()}`}
            dataIndex="modified_by"
            key="modified_by"
            render={(text) => {
              return <span>{text?.username} </span>;
            }}
            sorter={sorter && { multiple: 3 }}
          />
          {/* )}
          {modifiedDate && ( */}
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
          {/* )} */}
          <Column
            title={t("Form.Description").toUpperCase()}
            dataIndex="description"
            key="description"
            className="table-col"
            sorter={sorter && { multiple: 1 }}
          />
          {type !== "print" && (
            <Column
              title={t("Table.Action")}
              key="action"
              align="center"
              width={isMobile ? 50 : 70}
              className="table-col"
              render={(_, record) => (
                <WarehouseProductTransferAction
                  record={record}
                  hasSelected={hasSelected}
                />
              )}
            />
          )}
        </React.Fragment>
      );
    },
    [isMobile, t]
  );

  return (
    <PaginateTable
      title={t("Sales.All_sales.Invoice.Product_transfer")}
      model={WAREHOUSE_M}
      columns={columns}
      queryKey={WAREHOUSE_PRODUCT_TRANSFER_LIST}
      placeholder={t("Form.Search")}
      handleGetData={getProductTransferList}
    />
  );
};

export default WarehouseProductTransferTable;
