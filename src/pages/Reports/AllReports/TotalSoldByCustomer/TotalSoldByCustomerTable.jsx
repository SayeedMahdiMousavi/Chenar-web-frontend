import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useQuery } from "react-query";
import { Checkbox, Table, Menu, Typography, Descriptions } from "antd";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../ApiBaseUrl";
import { utcDate } from "../../../../Functions/utcDate";
import TotalSoldByCustomerFilters from "./Filters";
import useGetRunningPeriod from "../../../../Hooks/useGetRunningPeriod";
import { ReportTable, Statistics } from "../../../../components/antd";
import { reportsDateFormat } from "../../../../Context";
import { TableSummaryCell } from "../../../../components";
import { INVOICE_BY_PERSON_RESULT_LIST } from "../../../../constants/routes";

const { Column } = Table;
const dateFormat = reportsDateFormat;

const TotalSoldByCustomerTable = (props) => {
  const [selectResult, setSelectResult] = useState(false);
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
  const [
    {
      total,
      discount,
      expense,
      amount,
      returnAmount,
      returnDiscount,
      returnExpense,
      returnTotal,
      net,
    },
    setColumns,
  ] = useState({
    total: true,
    discount: true,
    expense: true,
    amount: true,
    returnAmount: true,
    returnDiscount: true,
    returnExpense: true,
    returnTotal: true,
    net: true,
  });

  const [filters, setFilters] = useState({
    customer: { value: "", label: "" },
    startDate: "",
    endDate: utcDate().format(dateFormat),
    invoiceType: {
      value: "sales",
      label: t("Sales.All_sales.Invoice.Sales_invoice"),
    },
  });

  const { customer, startDate, endDate, invoiceType } = filters;

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

  //setting checkbox

  const handleChange = (e) => {
    const value = e.target.checked;
    const name = e.target.name;
    setColumns((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const setting = (
    <Menu style={styles.settingsMenu}>
      <Menu.Item key="1">
        <Typography.Text strong={true}>
          {t("Sales.Product_and_services.Columns")}
        </Typography.Text>
      </Menu.Item>
      <Menu.Item key="2">
        <Checkbox onChange={handleChange} checked={amount} name="amount">
          {t("Sales.Customers.Form.Amount")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="3">
        <Checkbox onChange={handleChange} checked={discount} name="discount">
          {t("Sales.Customers.Discount.1")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="4">
        <Checkbox onChange={handleChange} checked={expense} name="expense">
          {t("Expenses.1")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="5">
        <Checkbox onChange={handleChange} checked={total} name="total">
          {t("Sales.Customers.Form.Total")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="6">
        <Checkbox
          onChange={handleChange}
          checked={returnAmount}
          name="returnAmount"
        >
          {t("Returned_amount")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="7">
        <Checkbox
          onChange={handleChange}
          checked={returnDiscount}
          name="returnDiscount"
        >
          {t("Returned_discount")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="8">
        <Checkbox
          onChange={handleChange}
          checked={returnExpense}
          name="returnExpense"
        >
          {t("Returned_expense")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="9">
        <Checkbox
          onChange={handleChange}
          checked={returnTotal}
          name="returnTotal"
        >
          {t("Returned_total")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="10">
        <Checkbox onChange={handleChange} checked={net} name="net">
          {t("Net")}
        </Checkbox>
      </Menu.Item>
    </Menu>
  );

  const customerId = customer?.value;
  const invoiceTypeId = invoiceType?.value;

  const handleGetSoldOrPurchasedByCustomer = React.useCallback(
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
      } = queryKey?.[1] || {};
      const customerId = customer?.value;
      const invoiceTypeId = invoiceType?.value;
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?page=${page}&page_size=${pageSize}&search=${search}&ordering=${order}&customer_id=${customerId}&invoice_type=${invoiceTypeId}&date_time_after=${startDate}&date_time_before=${endDate}`
      );
      // &date_time_after=${startDate}&date_time_before=${endDate}
      return data;
    },
    [props.baseUrl]
  );

  const getTotalSoldOrPurchasedResult = React.useCallback(
    async ({ queryKey }) => {
      const { search, customerId, startDate, endDate, invoiceTypeId } =
        queryKey?.[1] || {};
      const { data } = await axiosInstance.get(
        `${INVOICE_BY_PERSON_RESULT_LIST}?search=${search}&customer_id=${customerId}&date_time_after=${startDate}&date_time_before=${endDate}&invoice_type=${invoiceTypeId}`
      );
      return data;
    },
    []
  );

  const result = useQuery(
    [
      INVOICE_BY_PERSON_RESULT_LIST,
      { search, customerId, startDate, endDate, invoiceTypeId },
    ],
    getTotalSoldOrPurchasedResult
    // { enabled: !!startDate, cacheTime: 0 }
  );

  const resultData = [result?.data];

  const columns = useMemo(
(type) => {
      const sorter = type !== "print" ? true : false;
      return (
        <React.Fragment>
          <Column
            title={t("Banking.Form.Account_id").toUpperCase()}
            dataIndex="customer_id"
            key="customer_id"
            width={type !== "print" ? 155 : undefined}
            sorter={sorter && { multiple: 11 }}
            fixed={type !== "print" ? true : undefined}
            className="table-col"
            align="center"
          />

          <Column
            title={t("Banking.Form.Account_name").toUpperCase()}
            dataIndex="customer_name"
            key="customer_name"
            // width={150}
            sorter={sorter && { multiple: 10 }}
            // fixed={type !== "print" ? true : undefined}
            className="table-col"
          />

          {amount && (
            <Column
              title={t("Sales.Customers.Form.Amount").toUpperCase()}
              dataIndex="invoice_amount"
              key="invoice_amount"
              sorter={sorter && { multiple: 9 }}
              className="table-col"
              render={(value) => <Statistics value={value} />}
            />
          )}
          {discount && (
            <Column
              title={t("Sales.Customers.Discount.1").toUpperCase()}
              dataIndex="invoice_discount"
              key="invoice_discount"
              sorter={sorter && { multiple: 8 }}
              className="table-col"
              render={(value) => <Statistics value={value} />}
            />
          )}
          {expense && (
            <Column
              title={t("Expenses.1").toUpperCase()}
              dataIndex="invoice_expense"
              key="invoice_expense"
              sorter={sorter && { multiple: 7 }}
              className="table-col"
              render={(value) => <Statistics value={value} />}
            />
          )}
          {total && (
            <Column
              title={t("Sales.Customers.Form.Total").toUpperCase()}
              dataIndex="invoice_net_amount"
              key="invoice_net_amount"
              sorter={sorter && { multiple: 6 }}
              className="table-col"
              render={(value) => <Statistics value={value} />}
            />
          )}
          {returnAmount && (
            <Column
              title={t("Returned_amount").toUpperCase()}
              dataIndex="invoice_amount_rej"
              key="invoice_amount_rej"
              sorter={sorter && { multiple: 5 }}
              className="table-col"
              render={(value) => <Statistics value={value} />}
            />
          )}
          {returnDiscount && (
            <Column
              title={t("Returned_discount").toUpperCase()}
              dataIndex="invoice_rej_discount"
              key="invoice_rej_discount"
              sorter={sorter && { multiple: 4 }}
              className="table-col"
              render={(value) => <Statistics value={value} />}
            />
          )}
          {returnExpense && (
            <Column
              title={t("Returned_expense").toUpperCase()}
              dataIndex="invoice_rej_expense"
              key="invoice_rej_expense"
              sorter={sorter && { multiple: 3 }}
              className="table-col"
              render={(value) => <Statistics value={value} />}
            />
          )}
          {returnTotal && (
            <Column
              title={t("Returned_total").toUpperCase()}
              dataIndex="invoice_net_amount_rej"
              key="invoice_net_amount_rej"
              sorter={sorter && { multiple: 2 }}
              className="table-col"
              render={(value) => <Statistics value={value} />}
            />
          )}
          {net && (
            <Column
              title={t("Net").toUpperCase()}
              dataIndex="invoice_result"
              key="invoice_result"
              sorter={sorter && { multiple: 1 }}
              className="table-col"
              fixed={type !== "print" ? "right" : undefined}
              render={(value) => <Statistics value={value} />}
            />
          )}
        </React.Fragment>
      );
    },
    [
      amount,
      discount,
      expense,
      net,
      returnAmount,
      returnDiscount,
      returnExpense,
      returnTotal,
      t,
      total,
    ]
  );

  const resultColumns = useMemo(
    () => (
      <React.Fragment>
        <Column
          title={t("Table.Row").toUpperCase()}
          dataIndex="serial"
          key="serial"
          width={60}
          align="center"
          render={(_, __, index) => (
            <React.Fragment>{index + 1}</React.Fragment>
          )}
        />
        {amount && (
          <Column
            title={t("Sales.Customers.Form.Amount").toUpperCase()}
            dataIndex="total_amount"
            key="total_amount"
            width={150}
            className="table-col"
            render={(value) => <Statistics value={value} />}
          />
        )}
        {discount && (
          <Column
            title={t("Sales.Customers.Discount.1").toUpperCase()}
            dataIndex="total_discount"
            key="total_discount"
            className="table-col"
            render={(value) => <Statistics value={value} />}
          />
        )}
        {expense && (
          <Column
            title={t("Expenses.1").toUpperCase()}
            dataIndex="total_expense"
            key="total_expense"
            className="table-col"
            render={(value) => <Statistics value={value} />}
          />
        )}
        {total && (
          <Column
            title={t("Sales.Customers.Form.Total").toUpperCase()}
            dataIndex="total_net_amount"
            key="total_net_amount"
            className="table-col"
            render={(value) => <Statistics value={value} />}
          />
        )}
        {returnAmount && (
          <Column
            title={t("Returned_amount").toUpperCase()}
            dataIndex="total_rej_amount"
            key="total_rej_amount"
            className="table-col"
            render={(value) => <Statistics value={value} />}
          />
        )}
        {returnDiscount && (
          <Column
            title={t("Returned_discount").toUpperCase()}
            dataIndex="total_rej_discount"
            key="total_rej_discount"
            className="table-col"
            render={(value) => <Statistics value={value} />}
          />
        )}
        {returnExpense && (
          <Column
            title={t("Returned_expense").toUpperCase()}
            dataIndex="total_rej_expense"
            key="total_rej_expense"
            className="table-col"
            render={(value) => <Statistics value={value} />}
          />
        )}
        {returnTotal && (
          <Column
            title={t("Returned_total").toUpperCase()}
            dataIndex="total_rej_net_amount"
            key="total_rej_net_amount"
            className="table-col"
            render={(value) => <Statistics value={value} />}
          />
        )}
        {net && (
          <Column
            title={t("Net").toUpperCase()}
            dataIndex="total_result"
            key="total_result"
            className="table-col"
            render={(value) => <Statistics value={value} />}
          />
        )}
      </React.Fragment>
    ),
    [
      amount,
      discount,
      expense,
      net,
      returnAmount,
      returnDiscount,
      returnExpense,
      returnTotal,
      t,
      total,
    ]
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
    </Descriptions>
  );

  const onChangeSelectResult = (e) => {
    setSelectResult(e.target.checked);
  };

  const summary = () => {
    return (
      <>
        {resultData?.map((item, index) => {
          return (
            <Table.Summary.Row key={index}>
              <TableSummaryCell
                isSelected={selectResult}
                index={0}
                type="checkbox"
              >
                <Checkbox
                  onChange={onChangeSelectResult}
                  checked={selectResult}
                />
              </TableSummaryCell>
              <TableSummaryCell isSelected={selectResult} index={1}>
                {index === 0 && t("Sales.Customers.Form.Total")}{" "}
              </TableSummaryCell>

              <TableSummaryCell isSelected={selectResult} index={2} />

              <TableSummaryCell isSelected={selectResult} index={3} />

              {amount && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={4}
                  type="total"
                  value={item?.total_amount}
                />
              )}

              {discount && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={5}
                  type="total"
                  value={item?.total_discount}
                />
              )}
              {expense && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={6}
                  type="total"
                  value={item?.total_expense}
                />
              )}

              {total && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={7}
                  type="total"
                  value={item?.total_net_amount}
                />
              )}
              {returnAmount && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={8}
                  type="total"
                  value={item?.total_rej_amount}
                />
              )}

              {returnDiscount && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={9}
                  type="total"
                  value={item?.total_rej_discount}
                />
              )}
              {returnExpense && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={10}
                  type="total"
                  value={item?.total_rej_expense}
                />
              )}

              {returnTotal && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={11}
                  type="total"
                  value={item?.total_rej_net_amount}
                />
              )}
              {net && (
                <TableSummaryCell
                  isSelected={selectResult}
                  index={12}
                  type="total"
                  value={item?.total_result}
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
      rowKey="customer_id"
      queryKey={props.baseUrl}
      handleGetData={handleGetSoldOrPurchasedByCustomer}
      settingMenu={setting}
      filters={filters}
      filterNode={(setPage, setSelectedRowKeys) => (
        <TotalSoldByCustomerFilters
          setFilters={setFilters}
          setPage={setPage}
          type="customer"
          setSelectedRowKeys={setSelectedRowKeys}
          setSelectResult={setSelectResult}
        />
      )}
      filtersComponent={printFilters}
      resultDataSource={resultData}
      resultDomColumns={resultColumns}
      // queryConf={{ cacheTime: 0 }}
      summary={summary}
      resultLoading={result.isLoading}
      resultFetching={result.isFetching}
    />
  );
};
const styles = {
  card: { background: "#3498db", padding: "24px 20px" },
  settingsMenu: { width: "170px", paddingBottom: "10px" },
};

export default TotalSoldByCustomerTable;
