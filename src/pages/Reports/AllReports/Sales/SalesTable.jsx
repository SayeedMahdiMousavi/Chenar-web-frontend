import React, { useEffect, useMemo, useState } from "react";
import Filters from "./Filters";
import moment from "moment";
import { Checkbox, Table, Menu, Typography, Descriptions } from "antd";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "../../../MediaQurey";
import axiosInstance from "../../../ApiBaseUrl";
import { utcDate } from "../../../../Functions/utcDate";
import SalesInvoiceResultTable from "./ResultTable";
import useGetRunningPeriod from "../../../../Hooks/useGetRunningPeriod";
import ShowDate from "../../../SelfComponents/JalaliAntdComponents/ShowDate";
import { ReportTable, Statistics } from "../../../../components/antd";
import { reportsDateFormat } from "../../../../Context";

const { Column } = Table;

const dateFormat = reportsDateFormat;
const SalesTable = (props) => {
  const [resultSelectedRowKeys, setResultSelectedRowKeys] = useState([]);
  const [resultSelectedRows, setResultSelectedRows] = useState([]);
  const isMobile = useMediaQuery("(max-width: 576px)");
  const { t } = useTranslation();

  const [
    { customer, date, total, discount, expense, grossAmount, currency },
    setColumns,
  ] = useState({
    customer: true,
    date: true,
    total: true,
    discount: true,
    expense: true,
    grossAmount: true,
    currency: true,
  });

  const [filters, setFilters] = useState({
    account: { value: "", label: "" },
    representative: { value: "", label: "" },
    status: { value: "pending", label: t("Pending") },
    startDate: "",
    endDate: utcDate().format(dateFormat),
  });

  const { account, representative, status, startDate, endDate } = filters;
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

  const [search, setSearch] = useState("");

  const onChangeCustomer = (e) =>
    setColumns((prev) => {
      return { ...prev, customer: e.target.checked };
    });

  const onChangeDate = (e) => {
    setColumns((prev) => {
      return { ...prev, date: e.target.checked };
    });
  };

  const onChangeTotal = (e) => {
    setColumns((prev) => {
      return { ...prev, total: e.target.checked };
    });
  };

  const onChangeDiscount = (e) => {
    setColumns((prev) => {
      return { ...prev, discount: e.target.checked };
    });
  };

  const onChangeExpense = (e) => {
    setColumns((prev) => {
      return { ...prev, expense: e.target.checked };
    });
  };

  const onChangeGrossAmount = (e) => {
    setColumns((prev) => {
      return { ...prev, grossAmount: e.target.checked };
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
        <Checkbox onChange={onChangeCustomer} checked={customer}>
          {t("Sales.Customers.Customer")}
        </Checkbox>
      </Menu.Item>

      <Menu.Item key="4">
        <Checkbox onChange={onChangeDate} checked={date}>
          {t("Sales.Customers.Form.Date")}
        </Checkbox>
      </Menu.Item>

      <Menu.Item key="7">
        <Checkbox onChange={onChangeGrossAmount} checked={grossAmount}>
          {t("Reports.Gross_amount")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="8">
        <Checkbox onChange={onChangeDiscount} checked={discount}>
          {t("Sales.Customers.Discount.1")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="9">
        <Checkbox onChange={onChangeExpense} checked={expense}>
          {t("Expenses.1")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="5">
        <Checkbox onChange={onChangeTotal} checked={total}>
          {t("Sales.Customers.Form.Total")}
        </Checkbox>
      </Menu.Item>
    </Menu>
  );

  const accountId = account?.value ?? "";
  const representativeId = representative?.value ?? "";
  const statusValue = status?.value ?? "";
  const resultFilters = {
    accountId,
    startDate,
    endDate,
    search,
    statusValue,
    representativeId,
  };

  const handleGetSales = React.useCallback(
    async ({ queryKey }) => {
      const {
        page,
        pageSize,
        search,
        order,
        account,
        representative,
        status,
        startDate,
        endDate,
      } = queryKey?.[1] ?? {};
      const accountId = account?.value ?? "";
      const representativeId = representative?.value ?? "";
      const statusValue = status?.value ?? "";
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?expand=currency&page=${page}&page_size=${pageSize}&search=${search}&ordering=${order}&customer=${accountId}&representative=${representativeId}&invoice_state=${statusValue}&date_time_after=${startDate}&date_time_before=${endDate}`
      );
      return data;
    },
    [props.baseUrl]
  );

  const columns = useMemo(
(type) => {
      const sorter = type !== "print" ? true : false;
      return (
        <React.Fragment>
          <Column
            title={t(
              "Sales.All_sales.Purchase_and_sales.Invoice_id"
            ).toUpperCase()}
            dataIndex="id"
            key="id"
            width={type !== "print" ? 155 : undefined}
            sorter={sorter && { multiple: 8 }}
            fixed={type !== "print" ? true : undefined}
            className="table-col"
            align="center"
          />
          {customer && (
            <Column
              title={t("Sales.Customers.Customer").toUpperCase()}
              dataIndex="customer"
              key="customer"
              // width={150}
              sorter={sorter && { multiple: 7 }}
              className="table-col"
              // render={(text, record) => {
              //   return (
              //     <React.Fragment>
              //       {text?.content_object?.full_name}
              //     </React.Fragment>
              //   );
              // }}
            />
          )}
          {date && (
            <Column
              title={t("Sales.Customers.Form.Date").toUpperCase()}
              width={type !== "print" ? (isMobile ? 70 : 180) : undefined}
              dataIndex="date_time"
              key="date_time"
              // fixed={true}
              sorter={sorter && { multiple: 6 }}
              render={(text) => {
                return <ShowDate date={text} />;
              }}
              className="table-col"
            />
          )}
          {grossAmount && (
            <Column
              title={t("Reports.Gross_amount").toUpperCase()}
              dataIndex="invoice_total"
              key="invoice_total"
              sorter={sorter && { multiple: 5 }}
              width={type !== "print" ? 150 : undefined}
              className="table-col"
              render={(text, record) => {
                console.log("record" , record)
                // const gross = parseFloat(record?.net_amount) + parseFloat(record?.expense)
                  // parseFloat(record?.discount ?? 0) +
                  // (parseFloat(record?.net_amount ) +
                  //   parseFloat(record?.expense ));
                return <Statistics value={text} />;
              }}
            />
          )}
          {discount && (
            <Column
              title={t("Sales.Customers.Discount.1").toUpperCase()}
              dataIndex="discount"
              key="discount"
              sorter={sorter && { multiple: 4 }}
              className="table-col"
              // render={(text, record) => {
              //   return (
              //     record?.payment_summery?.discount && (
              //       <Statistics value={record?.payment_summery?.discount} />
              //     )
              //   );
              // }}
              render={(value) => <Statistics value={value} />}
            />
          )}
          {expense && (
            <Column
              title={t("Expenses.1").toUpperCase()}
              dataIndex="expense"
              key="expense"
              sorter={sorter && { multiple: 3 }}
              className="table-col"
              render={(value) => <Statistics value={value} />}
              // render={(text, record) => {
              //   return (
              //     record?.payment_summery?.expense && (
              //       <Statistics value={record?.payment_summery?.expense} />
              //     )
              //   );
              // }}
            />
          )}
          {total && (
            <Column
              title={t("Sales.Customers.Form.Total").toUpperCase()}
              dataIndex="invoice_total"
              key="invoice_total"
              sorter={sorter && { multiple: 2 }}
              className="table-col"
              // render={(value) => <Statistics value={value} />}
              render={(text, record) => {
                const priceAfterDiscount = ((parseFloat(record.invoice_total ) - (parseFloat(record.invoice_total * parseFloat(record?.discount) ) / 100 )) + parseFloat(record?.expense))
                return (
                  // record?.payment_summery?.net_amount && (
                    <Statistics value={priceAfterDiscount} />
                  // )
                );
              }}
            />
          )}
          <Column
            title={t(
              "Sales.Product_and_services.Inventory.Currency"
            ).toUpperCase()}
            dataIndex="currency"
            key="currency"
            sorter={sorter && { multiple: 1 }}
            fixed="right"
            render={(text) => {
              return <React.Fragment>{t(`Reports.${text?.symbol}`)}</React.Fragment>;
            }}
            className="table-col"
          />
        </React.Fragment>
      );
    },
    [customer, date, discount, expense, grossAmount, isMobile, t, total]
  );

  const resultColumns = useMemo(
(type) =>
      (
        <React.Fragment>
          <Column
            title={t("Table.Row").toUpperCase()}
            dataIndex="serial"
            key="serial"
            width={type !== "print" ? 80 : 40}
            className="table-col"
            align="center"
            fixed={type !== "print" ? true : undefined}
          />

          <Column
            title={t("Sales.Customers.Customer").toUpperCase()}
            dataIndex="customer_name"
            key="customer_name"
            fixed={type !== "print" ? true : undefined}
            sorter={true}
            className="table-col"
          />

          {grossAmount && (
            <Column
              title={t("Reports.Gross_amount").toUpperCase()}
              dataIndex="total_amount"
              key="total_amount"
              className="table-col"
              sorter={true}
              render={(text, record) => {
                const gross =
                  parseFloat(record?.total_discount ?? 0) +
                  (parseFloat(record?.total_net_amount ?? 0) -
                    parseFloat(record?.total_expense ?? 0));
                return <Statistics value={gross} />;
              }}
              // render={(value) => <Statistics value={value} />}
            />
          )}
          {discount && (
            <Column
              title={t("Sales.Customers.Discount.1").toUpperCase()}
              dataIndex="total_discount"
              key="total_discount"
              sorter={true}
              className="table-col"
              render={(value) => <Statistics value={value} />}
            />
          )}
          {expense && (
            <Column
              title={t("Expenses.1").toUpperCase()}
              dataIndex="total_expense"
              key="total_expense"
              sorter={true}
              className="table-col"
              render={(value) => <Statistics value={value} />}
            />
          )}

          {total && (
            <Column
              title={t("Sales.Customers.Form.Total").toUpperCase()}
              dataIndex="total_net_amount"
              key="total_net_amount"
              sorter={true}
              className="table-col"
              render={(value) => <Statistics value={value} />}
            />
          )}

          {currency && (
            <Column
              title={t(
                "Sales.Product_and_services.Inventory.Currency"
              ).toUpperCase()}
              dataIndex="currency_name"
              key="currency_name"
              sorter={true}
              className="table-col"
            />
          )}
        </React.Fragment>
      ),
    [currency, discount, expense, grossAmount, t, total]
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
      {account?.label && (
        <Descriptions.Item label={t("Sales.All_sales.Invoice.Customer_name")}>
          {account?.label}
        </Descriptions.Item>
      )}
      {representative?.label && (
        <Descriptions.Item label={t("Representative")}>
          {representative?.label}
        </Descriptions.Item>
      )}
      {status?.label && (
        <Descriptions.Item label={t("Sales.Product_and_services.Status")}>
          {status?.label}
        </Descriptions.Item>
      )}
    </Descriptions>
  );

  return (
    <>
      <ReportTable
      pagination={true}
        setSearch={setSearch}
        search={search}
        setResultSelectedRowKeys={setResultSelectedRowKeys}
        setResultSelectedRows={setResultSelectedRows}
        title={t("Sales.All_sales.Invoice.Sales_invoice")}
        columns={columns}
        queryKey={props.baseUrl}
        handleGetData={handleGetSales}
        settingMenu={setting}
        filters={filters}
        filterNode={(setPage, setSelectedRowKeys) => (
          <Filters
            setFilters={setFilters}
            setSelectedRowKeys={setSelectedRowKeys}
            setPage={setPage}
            type="customer"
            setResultSelectedRowKeys={setResultSelectedRowKeys}
          />
        )}
        filtersComponent={printFilters}
        selectResult={resultSelectedRowKeys?.length > 0}
        resultDataSource={resultSelectedRows}
        resultDomColumns={resultColumns("print")}
        // queryConf={{ enabled: !!startDate, cacheTime: 0 }}
        paginationPosition={t("Dir") === "ltr" ? ["topRight"] : ["topLeft"]}
      />
      <div style={{padding:"10px"}}></div>
      <SalesInvoiceResultTable
        baseUrl={props.baseUrl}
        filter={resultFilters}
        tableChildren={resultColumns("originalTable")}
        setSelectedRows={setResultSelectedRows}
        setSelectedRowKeys={setResultSelectedRowKeys}
        selectedRowKeys={resultSelectedRowKeys}
      />
    </>
  );
};

const styles = {
  card: { background: "#3498db", padding: "24px 20px" },
  settingsMenu: { width: "170px", paddingBottom: "10px" },
};

export default SalesTable;
