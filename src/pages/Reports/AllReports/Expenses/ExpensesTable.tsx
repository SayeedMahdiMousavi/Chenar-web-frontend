import React, { Key, useEffect, useState } from "react";
import moment from "moment";
import axiosInstance from "../../../ApiBaseUrl";
import { Table, Menu, Typography, Checkbox, Descriptions } from "antd";
import { useTranslation } from "react-i18next";
import Filters from "../Sales/Filters";
import { utcDate } from "../../../../Functions/utcDate";
import MoneyTransferFilters from "./MoneyTransferFilters";
import ExpensesResultTable from "./ResultTable";
import CashTransactionsFilters from "./CashTransactionsFilters";
import useGetRunningPeriod from "../../../../Hooks/useGetRunningPeriod";
import { useMemo } from "react";
import CurrencyExchangeFilters from "./CurrencyExchangeFilters";
import ShowDate from "../../../SelfComponents/JalaliAntdComponents/ShowDate";
import { ReportTable, Statistics } from "../../../../components/antd";
import { reportsDateFormat } from "../../../../Context";

const { Column, ColumnGroup } = Table;
interface IProps {
  baseUrl: string;
  place: string;
  title: string;
}

const dateFormat = reportsDateFormat;

const ExpensesTable: React.FC<IProps> = (props) => {
  const [resultSelectedRowKeys, setResultSelectedRowKeys] = useState<Key[]>([]);
  const [resultSelectedRows, setResultSelectedRows] = useState<any[]>([]);
  const { t } = useTranslation();
  const [{ currency, calCurrency, details }, setColumns] = useState({
    currency: true,
    calCurrency: true,
    details: true,
  });
  const [search, setSearch] = useState<string | number>("");

  const [filters, setFilters] = useState({
    account: { value: "", label: "" },
    payBy: { value: "", label: "" },
    recBy: { value: "", label: "" },
    startDate: "",
    endDate: utcDate().format(dateFormat),
  });
  const { account, startDate, endDate, payBy, recBy } = filters;
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
  const onChangeCurrency = () =>
    setColumns((prev) => {
      return { ...prev, currency: !currency };
    });

  const onChangeDetails = () => {
    setColumns((prev) => {
      return { ...prev, details: !details };
    });
  };

  const onChangeCalCurrency = () => {
    setColumns((prev) => {
      return { ...prev, calCurrency: !calCurrency };
    });
  };

  const setting = (
    <Menu style={styles.settingsMenu}>
      <Menu.Item key="1">
        <Typography.Text strong={true}>
          {t("Sales.Product_and_services.Columns")}
        </Typography.Text>
      </Menu.Item>
      <Menu.Item key="1">
        <Checkbox defaultChecked onChange={onChangeCurrency}>
          {t("Sales.Customers.Receive_cash.Paid_currency")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="2">
        <Checkbox defaultChecked onChange={onChangeDetails}>
          {t("Sales.Customers.Receive_cash.Receive_details")}
        </Checkbox>
      </Menu.Item>
      {(props.place === "cashTransactions" ||
        props.place === "currencyExchange") && (
        <Menu.Item key="3">
          <Checkbox onChange={onChangeCalCurrency} defaultChecked>
            {props.place === "currencyExchange"
              ? t("Sales.Customers.Receive_cash.Receive_currency")
              : t("Sales.Customers.Receive_cash.Calculate_currency")}
          </Checkbox>
        </Menu.Item>
      )}
    </Menu>
  );

  const accountId = account?.value ?? "";
  const recId = recBy?.value ?? "";
  const payId = payBy?.value ?? "";

  const resultFilters = { search, startDate, endDate, payId, recId, accountId };

  const handleGetExpenses = React.useCallback(
    //@ts-ignore
    async ({ queryKey }) => {
      const {
        page,
        pageSize,
        search,
        order,
        startDate,
        endDate,
        account,
        recBy,
        payBy,
      } = queryKey?.[1];
      const accountId = account?.value ?? "";
      const recId = recBy?.value ?? "";
      const payId = payBy?.value ?? "";
      const { data } = await axiosInstance.get(
        `${
          props.baseUrl
        }?page=${page}&page_size=${pageSize}&ordering=${order}&search=${search}&date_time_after=${startDate}&date_time_before=${endDate}${
          props.place !== "currencyExchange" && props.place !== "moneyTransfer"
            ? `&account=${accountId}`
            : ""
        }&expand=*${
          props.place === "cashTransactions" ||
          props.place === "moneyTransfer" ||
          props.place === "currencyExchange"
            ? `&pay_by=${payId}&rec_by=${recId}`
            : ""
        }`
      );

      return data;
    },
    [props.baseUrl, props.place]
  );

  const columns = useMemo(
    () => (type: string) => {
      const sorter = type !== "print" ? true : false;
      return (
        <React.Fragment>
          {props.place !== "recordSalaries" && (
            <Column
              title={t("Sales.Customers.Receive_cash.Payer").toUpperCase()}
              dataIndex="pay_by"
              key="pay_by"
              fixed={type !== "print" ? true : undefined}
              render={(text: any) => {
                return <>{text?.name} </>;
              }}
              className="table-col"
              sorter={sorter && { multiple: 10 }}
            />
          )}
          {details && (
            <ColumnGroup
              title={t("Sales.Customers.Receive_cash.Receive_details")}
            >
              <Column
                title={t("Sales.All_sales.Invoice.Date_and_time").toUpperCase()}
                dataIndex="date_time"
                key="date_time"
                render={(text) => {
                  return <ShowDate date={text} />;
                }}
                sorter={sorter && { multiple: 9 }}
              />

              <Column
                title={`${t("Form.Description").toUpperCase()}`}
                dataIndex="description"
                key="description"
                sorter={sorter && { multiple: 8 }}
                className="table-col"
              />
            </ColumnGroup>
          )}
          {currency && (
            <ColumnGroup
              title={t("Sales.Customers.Receive_cash.Paid_currency")}
            >
              <Column
                title={t("Sales.Customers.Form.Amount").toUpperCase()}
                dataIndex="amount"
                key="amount"
                sorter={sorter && { multiple: 7 }}
                render={(value) => <Statistics value={value} />}
                className="table-col"
              />

              <Column
                title={t(
                  "Sales.Product_and_services.Inventory.Currency"
                ).toUpperCase()}
                dataIndex="currency"
                key="currency"
                sorter={sorter && { multiple: 6 }}
                render={(text: any) => {
                  return <>{text?.name} </>;
                }}
                className="table-col"
              />

              <Column
                title={t(
                  "Sales.Product_and_services.Currency.Currency_rate"
                ).toUpperCase()}
                dataIndex="currency_rate"
                key="currency_rate"
                render={(value) => <Statistics value={value} />}
                className="table-col"
                sorter={sorter && { multiple: 5 }}
              />
            </ColumnGroup>
          )}

          {props.place === "cashTransactions" ||
          props.place === "currencyExchange"
            ? calCurrency && (
                <ColumnGroup
                  title={
                    props.place === "currencyExchange"
                      ? t("Sales.Customers.Receive_cash.Receive_currency")
                      : t("Sales.Customers.Receive_cash.Calculate_currency")
                  }
                >
                  <Column
                    title={t("Sales.Customers.Form.Amount").toUpperCase()}
                    dataIndex={
                      props.place === "currencyExchange"
                        ? "amount_exchange"
                        : "amount_calc"
                    }
                    key={
                      props.place === "currencyExchange"
                        ? "amount_exchange"
                        : "amount_calc"
                    }
                    sorter={sorter && { multiple: 4 }}
                    render={(value) => <Statistics value={value} />}
                    className="table-col"
                  />

                  <Column
                    title={t(
                      "Sales.Product_and_services.Inventory.Currency"
                    ).toUpperCase()}
                    dataIndex={
                      props.place === "currencyExchange"
                        ? "currency_exchange"
                        : "currency_calc"
                    }
                    key={
                      props.place === "currencyExchange"
                        ? "currency_exchange"
                        : "currency_calc"
                    }
                    // dataIndex="currency_exchange"
                    // key={"currency_exchange"}
                    sorter={sorter && { multiple: 3 }}
                    render={(text: any) => {
                      return <>{text?.name} </>;
                    }}
                    className="table-col"
                  />

                  <Column
                    title={t(
                      "Sales.Product_and_services.Currency.Currency_rate"
                    ).toUpperCase()}
                    dataIndex={
                      props.place === "currencyExchange"
                        ? "currency_rate_exchange"
                        : "currency_rate_calc"
                    }
                    key={
                      props.place === "currencyExchange"
                        ? "currency_rate_exchange"
                        : "currency_rate_calc"
                    }
                    render={(value) => <Statistics value={value} />}
                    className="table-col"
                    sorter={sorter && { multiple: 2 }}
                  />
                </ColumnGroup>
              )
            : null}

          <Column
            title={t("Sales.Customers.Receive_cash.Receiver").toUpperCase()}
            dataIndex="rec_by"
            key="rec_by"
            fixed={type !== "print" ? "right" : undefined}
            render={(text: any) => {
              return <>{text?.name} </>;
            }}
            className="table-col"
            sorter={sorter && { multiple: 1 }}
          />
        </React.Fragment>
      );
    },
    [calCurrency, currency, details, props.place, t]
  );

  const resultColumns = useMemo(
    () => (
      <React.Fragment>
        <Column
          title={t("Table.Row").toUpperCase()}
          dataIndex="serial"
          key="serial"
          width={80}
          className="table-col"
          align="center"
          fixed={true}
          render={(text, record, index) => index + 1}
        />
        {(props?.place === "expenses" || props?.place === "income") &&
          <Column
            title={t("Accounting.Account").toUpperCase()}
            dataIndex="account"
            key="account"
            className="table-col"
          />
        }
        {props.place !== "income" && (
          <Column
            title={t("Reports.Pay").toUpperCase()}
            dataIndex="pay"
            key="pay"
            className="table-col"
            render={(value) => <Statistics value={value} />}
          />
        )}
        {props.place !== "expenses" && (
          <Column
            title={t("Reports.Receive").toUpperCase()}
            dataIndex="rec"
            key="rec"
            className="table-col"
            render={(value) => <Statistics value={value} />}
          />
        )}
        <Column
          title={t(
            "Sales.Product_and_services.Inventory.Currency"
          ).toUpperCase()}
          dataIndex="currency__name"
          key="currency__name"
          className="table-col"
        />
      </React.Fragment>
    ),
    [props.place, t]
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
      {account?.label && props.place !== "currencyExchange" && (
        <Descriptions.Item label={t("Banking.Form.Account_name")}>
          {account?.label}
        </Descriptions.Item>
      )}
      {payBy?.label && (
        <Descriptions.Item label={t("Sales.Customers.Receive_cash.Payer")}>
          {payBy?.label}
        </Descriptions.Item>
      )}
      {recBy?.label && (
        <Descriptions.Item label={t("Sales.Customers.Receive_cash.Receiver")}>
          {recBy?.label}
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
        title={props.title}
        columns={columns}
        queryKey={props.baseUrl}
        handleGetData={handleGetExpenses}
        settingMenu={setting}
        filters={filters}
        filterNode={(setPage, setSelectedRowKeys) =>
          props.place === "moneyTransfer" ? (
            <MoneyTransferFilters
              setFilters={setFilters}
              setPage={setPage}
              setSelectedRowKeys={setSelectedRowKeys}
              setResultSelectedRowKeys={setResultSelectedRowKeys}
            />
          ) : props.place === "cashTransactions" ? (
            <CashTransactionsFilters
              setFilters={setFilters}
              setPage={setPage}
              setSelectedRowKeys={setSelectedRowKeys}
              setResultSelectedRowKeys={setResultSelectedRowKeys}
            />
          ) : props.place === "currencyExchange" ? (
            <CurrencyExchangeFilters
              setFilters={setFilters}
              setPage={setPage}
              setSelectedRowKeys={setSelectedRowKeys}
              setResultSelectedRowKeys={setResultSelectedRowKeys}
            />
          ) : (
            <Filters
              setFilters={setFilters}
              setPage={setPage}
              type={props.place === "income" ? "income" : "expense"}
              setSelectedRowKeys={setSelectedRowKeys}
              setResultSelectedRowKeys={setResultSelectedRowKeys}
            />
          )
        }
        filtersComponent={printFilters}
        selectResult={resultSelectedRowKeys?.length > 0}
        resultDataSource={resultSelectedRows}
        resultDomColumns={resultColumns}
        // queryConf={usePaginatedProps}
        paginationPosition={t("Dir") === "ltr" ? ["topRight"] : ["topLeft"]}
      />
      <div style={{ marginTop: "1rem" }}>
        <ExpensesResultTable
          baseUrl={props.baseUrl}
          place={props.place}
          filters={resultFilters}
          setSelectedRows={setResultSelectedRows}
          setSelectedRowKeys={setResultSelectedRowKeys}
          selectedRowKeys={resultSelectedRowKeys}
          columns={resultColumns}
        />
      </div>
    </>
  );
};

const styles = {
  settingsMenu: { minWidth: "130px", paddingBottom: "10px" },
};

export default ExpensesTable;
