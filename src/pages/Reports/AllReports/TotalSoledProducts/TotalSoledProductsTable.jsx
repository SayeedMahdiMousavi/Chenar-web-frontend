import React, { useEffect, useMemo, useState } from "react";
import { Colors } from "../../../colors";
import axiosInstance from "../../../ApiBaseUrl";
import { useQuery } from "react-query";
import { Checkbox, Menu, Table, Typography, Descriptions } from "antd";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Filters from "./Filters";
import { utcDate } from "../../../../Functions/utcDate";
import useGetRunningPeriod from "../../../../Hooks/useGetRunningPeriod";
import { ReportTable, Statistics } from "../../../../components/antd";
import { reportsDateFormat } from "../../../../Context";
import { TableSummaryCell } from "../../../../components";
import { INVOICE_BY_PRODUCT_RESULT_LIST } from "../../../../constants/routes";

const { Column } = Table;
const dateFormat = reportsDateFormat;
const TotalSoledProductsTable = (props) => {
  const [selectResult, setSelectResult] = useState(false);
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
  const [{ unit, soldQty, total, currency, regQuantity }, setColumns] =
    useState({
      unit: true,
      soldQty: true,
      total: true,
      currency: true,
      regQuantity: true,
    });

  const [filters, setFilters] = useState({
    category: { value: "", label: "" },
    product: { value: "", label: "" },
    customer: { value: "", label: "" },
    startDate: "",
    endDate: utcDate().format(dateFormat),
    invoiceType: {
      value: "sales",
      label: t("Sales.1"),
    },
  });

  const { category, product, customer, startDate, endDate, invoiceType } =
    filters;

  //get running period
  const runningPeriod = useGetRunningPeriod();
  const curStartDate = runningPeriod?.data?.start_date;

  useEffect(() => {
    if (curStartDate) {
      setFilters((prev) => {
        return {
          ...prev,
          startDate: curStartDate
            ? moment(curStartDate, dateFormat).format(dateFormat)
            : "",
        };
      });
    }
  }, [curStartDate]);

  const onChangeUnit = (e) =>
    setColumns((prev) => {
      return { ...prev, unit: !unit };
    });
  const onChangeSoldQty = (e) =>
    setColumns((prev) => {
      return { ...prev, soldQty: e.target.checked };
    });

  const onChangeTotal = (e) => {
    setColumns((prev) => {
      return { ...prev, total: e.target.checked };
    });
  };
  const onChangeCurrency = (e) => {
    setColumns((prev) => {
      return { ...prev, currency: e.target.checked };
    });
  };
  const onChangeRegQuantity = (e) => {
    setColumns((prev) => {
      return { ...prev, regQuantity: e.target.checked };
    });
  };

  const customerId = customer?.value;
  const categoryId = category?.value;
  const productId = product?.value;
  const invoiceTypeId = invoiceType?.value;

  const setting = (
    <Menu style={styles.settingsMenu}>
      <Menu.Item key="1">
        <Typography.Text strong={true}>
          {t("Sales.Product_and_services.Columns")}
        </Typography.Text>
      </Menu.Item>
      <Menu.Item key="2">
        <Checkbox checked={unit} onChange={onChangeUnit}>
          {t("Sales.Product_and_services.Units.Unit")}
        </Checkbox>
      </Menu.Item>

      <Menu.Item key="3">
        <Checkbox checked={soldQty} onChange={onChangeSoldQty}>
          {t(
            invoiceTypeId === "sales" ? "Sales_quantity" : "Purchase_quantity"
          )}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="5">
        <Checkbox checked={regQuantity} onChange={onChangeRegQuantity}>
          {t(
            invoiceTypeId === "sales"
              ? "Sales_reject_quantity"
              : "Purchase_reject_quantity"
          )}
        </Checkbox>
      </Menu.Item>

      <Menu.Item key="4">
        <Checkbox checked={total} onChange={onChangeTotal}>
          {t("Pagination.Total")}
        </Checkbox>
      </Menu.Item>

      <Menu.Item key="5">
        <Checkbox checked={currency} onChange={onChangeCurrency}>
          {t("Sales.Product_and_services.Inventory.Currency")}
        </Checkbox>
      </Menu.Item>
    </Menu>
  );

  const handleGetSoldOrPurchasedByProducts = React.useCallback(
    async ({ queryKey }) => {
      const {
        page,
        pageSize,
        search,
        order,
        customer,
        startDate,
        endDate,
        invoiceType,
        category,
        product,
      } = queryKey?.[1] || {};
      const customerId = customer?.value;
      const categoryId = category?.value;
      const productId = product?.value;
      const invoiceTypeId = invoiceType?.value;
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?page=${page}&page_size=${pageSize}&search=${search}&ordering=${order}&customer=${customerId}&date_time_after=${startDate}&date_time_before=${endDate}&invoice_type=${invoiceTypeId}&id=${productId}&category=${categoryId}`,
        { timeout: 25000 }
      );
      return data;
    },
    [props.baseUrl]
  );

  const result = useQuery(
    [
      INVOICE_BY_PRODUCT_RESULT_LIST,
      {
        search,
        customerId,
        startDate,
        endDate,
        invoiceTypeId,
        productId,
        categoryId,
      },
    ],
    async ({ queryKey }) => {
      const {
        invoiceTypeId,
        endDate,
        startDate,
        customerId,
        search,
        productId,
        categoryId,
      } = queryKey?.[1] || {};

      const { data } = await axiosInstance.get(
        `${INVOICE_BY_PRODUCT_RESULT_LIST}?search=${search}&customer=${customerId}&date_time_after=${startDate}&date_time_before=${endDate}&invoice_type=${invoiceTypeId}&id=${productId}&category=${categoryId}`
      );
      return data;
    }
    // { enabled: !!startDate }
  );

  const columns = useMemo(
(type) => {
      const sorter = type !== "print";
      return (
        <React.Fragment>
          <Column
            title={t("Sales.Product_and_services.Product_id").toUpperCase()}
            dataIndex="id"
            key="id"
            fixed={type !== "print" ? true : undefined}
            width={type !== "print" ? 130 : undefined}
            sorter={sorter && { multiple: 7 }}
            className="table-col"
            align="center"
          />
          <Column
            title={`${t("Sales.All_sales.Invoice.Product_name").toUpperCase()}`}
            dataIndex="name"
            key="name"
            fixed={type !== "print" ? true : undefined}
            className="table-col"
            sorter={sorter && { multiple: 6 }}
          />

          {unit && (
            <Column
              title={t("Sales.Product_and_services.Units.Unit").toUpperCase()}
              dataIndex="unit"
              key="unit"
              sorter={sorter && { multiple: 5 }}
              className="table-col"
            />
          )}
          {soldQty && (
            <Column
              title={t(
                invoiceTypeId === "sales"
                  ? "Sales_quantity"
                  : "Purchase_quantity"
              ).toUpperCase()}
              dataIndex="total_qty"
              key="total_qty"
              className="table-col"
              sorter={sorter && { multiple: 4 }}
              render={(value) => <Statistics value={value} />}
            />
          )}
          {regQuantity && (
            <Column
              title={t(
                invoiceTypeId === "sales"
                  ? "Sales_reject_quantity"
                  : "Purchase_reject_quantity"
              ).toUpperCase()}
              dataIndex="rej_qty"
              key="rej_qty"
              className="table-col"
              sorter={sorter && { multiple: 3 }}
              render={(value) => <Statistics value={value} />}
            />
          )}

          {total && (
            <Column
              title={t("Pagination.Total").toUpperCase()}
              dataIndex="total_price"
              key="total_price"
              className="table-col"
              sorter={sorter && { multiple: 2 }}
              render={(value) => <Statistics value={value} />}
            />
          )}
          {currency && (
            <Column
              title={t(
                "Sales.Product_and_services.Inventory.Currency"
              ).toUpperCase()}
              dataIndex="currency"
              key="currency"
              className="table-col"
              sorter={sorter && { multiple: 1 }}
            />
          )}
        </React.Fragment>
      );
    },
    [currency, invoiceTypeId, regQuantity, soldQty, t, total, unit]
  );

  const resultColumns = useMemo(
    () => (
      <React.Fragment>
        <Column
          title={t("Table.Row").toUpperCase()}
          dataIndex="serial"
          key="serial"
          width={40}
          align="center"
          render={(_, __, index) => (
            <React.Fragment>{index + 1}</React.Fragment>
          )}
        />
        {total && (
          <Column
            title={t("Pagination.Total").toUpperCase()}
            dataIndex="total_price"
            key="total_price"
            render={(value) => <Statistics value={value} />}
          />
        )}
        {currency && (
          <Column
            title={t(
              "Sales.Product_and_services.Inventory.Currency"
            ).toUpperCase()}
            dataIndex="currency"
            key="currency"
          />
        )}
      </React.Fragment>
    ),
    [currency, t, total]
  );

  const printFilters = (
    <Descriptions
      layout="horizontal"
      style={{ width: "100%", paddingTop: "40px" }}
      column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
      size="small"
    >
      <Descriptions.Item label={t("Form.From")}>
        {startDate} {t("Form.To")} : {endDate}
      </Descriptions.Item>
      {invoiceType?.label && (
        <Descriptions.Item label={t("Sales.Product_and_services.Type")}>
          {invoiceType?.label}
        </Descriptions.Item>
      )}
      {customer?.label && (
        <Descriptions.Item label={t("Banking.Form.Account_name")}>
          {customer?.label}
        </Descriptions.Item>
      )}
      {product?.label && (
        <Descriptions.Item label={t("Sales.Product_and_services.Product")}>
          {product?.label}
        </Descriptions.Item>
      )}
      {category?.label && (
        <Descriptions.Item
          label={t("Sales.Product_and_services.Form.Category")}
        >
          {category?.label}
        </Descriptions.Item>
      )}
    </Descriptions>
  );

  const onChangeSelectResult = (e) => {
    setSelectResult(e.target.checked);
  };

  const resultData = result?.data;

  const summary = () => {
    return (
      <>
        <Table.Summary.Row>
          <TableSummaryCell index={0} type="checkbox">
            <Checkbox onChange={onChangeSelectResult} checked={selectResult} />
          </TableSummaryCell>
          <TableSummaryCell index={1} />
          <TableSummaryCell index={2}>
            {t("Sales.Customers.Form.Total")}
          </TableSummaryCell>
          <TableSummaryCell index={3}>
            {t("Sales.Product_and_services.Inventory.Currency")}
          </TableSummaryCell>
          {(soldQty || currency || unit || total) && (
            <TableSummaryCell index={4} colSpan={5}></TableSummaryCell>
          )}
        </Table.Summary.Row>

        {resultData?.map((item) => {
          return (
            <Table.Summary.Row key={item?.id}>
              <TableSummaryCell isSelected={selectResult} index={0} />

              <TableSummaryCell isSelected={selectResult} index={1} />

              <TableSummaryCell
                isSelected={selectResult}
                index={2}
                type="total"
                value={item?.total_price}
              />

              <TableSummaryCell isSelected={selectResult} index={3}>
                {item?.currency}
              </TableSummaryCell>

              {(soldQty || currency || unit || total || regQuantity) && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={4}
                  colSpan={5}
                />
              )}
            </Table.Summary.Row>
          );
        })}
      </>
    );
  };

  return (
    <ReportTable
      setSearch={setSearch}
      search={search}
      setSelectResult={setSelectResult}
      selectResult={selectResult}
      title={props.title}
      columns={columns}
      queryKey={props.baseUrl}
      handleGetData={handleGetSoldOrPurchasedByProducts}
      settingMenu={setting}
      filters={filters}
      filterNode={(setPage, setSelectedRowKeys) => (
        <Filters
          setFilters={setFilters}
          setPage={setPage}
          type={props.type}
          setSelectedRowKeys={setSelectedRowKeys}
          setSelectResult={setSelectResult}
        />
      )}
      filtersComponent={printFilters}
      resultDataSource={resultData}
      resultDomColumns={resultColumns}
      // queryConf={{ cacheTime: 0, enabled: !!startDate }}
      summary={summary}
      resultLoading={result.isLoading}
      resultFetching={result.isFetching}
    />
  );
};
const styles = {
  modal1: (sales) => ({
    padding: "0px",
  }),
  closeIcon: { color: `${Colors.white}` },
  unit: { display: "flex" },
  settingsMenu: { width: "190px", paddingBottom: "10px" },
};

export default TotalSoledProductsTable;
