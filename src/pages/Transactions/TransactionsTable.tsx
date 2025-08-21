import React, { useState } from "react";
import axiosInstance from "../ApiBaseUrl";
import { Table, Menu, Typography, Checkbox } from "antd";
import { useTranslation } from "react-i18next";
import Action from "./Action";
import { useMediaQuery } from "../MediaQurey";
import { useMemo } from "react";
import ShowDate from "../SelfComponents/JalaliAntdComponents/ShowDate";
import { PaginateTable, Statistics } from "../../components/antd";
import { checkActionColumnPermissions } from "../../Functions";

const { Column, ColumnGroup } = Table;
interface IProps {
  baseUrl: string;
  place: string;
  modalTitle: string;
  title: string;
  model: string;
}
const TransactionsTable: React.FC<IProps> = ({
  baseUrl,
  place,
  modalTitle,
  title,
  model,
}) => {
  const isMobile = useMediaQuery("(max-width:425px)");
  const { t } = useTranslation();
  const [{ currency, calCurrency, details }, setColumns] = useState({
    currency: true,
    calCurrency: false,
    details: true,
  });

  //setting actions
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
      <Menu.Item key="2">
        <Checkbox defaultChecked onChange={onChangeCurrency}>
          {t("Sales.Customers.Receive_cash.Paid_currency")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="3">
        <Checkbox defaultChecked onChange={onChangeDetails}>
          {t("Sales.Customers.Receive_cash.Receive_details")}
        </Checkbox>
      </Menu.Item>
      {(place === "recordSalaries" ||
        place === "customerPayAndRecCash" ||
        place === "employeePayAndRecCash" ||
        place === "currencyExchange" ||
        place === "withdrawPayAndRecCash" ||
        place === "supplierPayAndRecCash") && (
        <Menu.Item key="4">
          <Checkbox onChange={onChangeCalCurrency}>
            {place === "currencyExchange"
              ? t("Sales.Customers.Receive_cash.Receive_currency")
              : t("Sales.Customers.Receive_cash.Calculate_currency")}
          </Checkbox>
        </Menu.Item>
      )}
    </Menu>
  );

  const handleGetTransactions = React.useCallback(
    async ({ queryKey }) => {
      const { page, pageSize, search, order } = queryKey?.[1];
      const { data } = await axiosInstance.get(
        `${baseUrl}?page=${page}&page_size=${pageSize}&ordering=${order}&search=${search}&expand=*`
      );

      console.log("dddddddddddddddddddddd" , data)
      return data;
    },
    [baseUrl]
  );

  const columns = useMemo(
    () => (type: string, hasSelected: boolean) => {
      const sorter = type !== "print" ? true : false;
      return (
        <React.Fragment>
          {place !== "recordSalaries" && (
            <Column
              title={t("Sales.Customers.Receive_cash.Payer").toUpperCase()}
              dataIndex="pay_by"
              key="pay_by"
              fixed={type !== "print" ? true : false}
              render={(text: any) => {
                return <>{text?.name} </>;
              }}
              className="table-col"
              sorter={sorter && { multiple: 10 }}
            />
          )}

          {currency && (
            <ColumnGroup
              title={t("Sales.Customers.Receive_cash.Paid_currency")}
            >
              <Column
                title={t("Sales.Customers.Form.Amount").toUpperCase()}
                dataIndex="amount"
                key="amount"
                sorter={sorter && { multiple: 9 }}
                render={(text: any) => {
                  return <Statistics value={text} />;
                }}
                className="table-col"
              />

              <Column
                title={t(
                  "Sales.Product_and_services.Inventory.Currency"
                ).toUpperCase()}
                dataIndex="currency"
                key="currency"
                sorter={sorter && { multiple: 8 }}
                render={(text: any) => {
                  return <>{t(`Reports.${text?.symbol}`)} </>;
                }}
                className="table-col"
              />

              <Column
                title={t(
                  "Sales.Product_and_services.Currency.Currency_rate"
                ).toUpperCase()}
                dataIndex="currency_rate"
                key="currency_rate"
                render={(text: any) => {
                  return <Statistics value={text} />;
                }}
                className="table-col"
                sorter={sorter && { multiple: 7 }}
              />
            </ColumnGroup>
          )}
          {place === "recordSalaries" ||
          place === "customerPayAndRecCash" ||
          place === "employeePayAndRecCash" ||
          place === "currencyExchange" ||
          place === "withdrawPayAndRecCash" ||
          place === "supplierPayAndRecCash"
            ? calCurrency && (
                <ColumnGroup
                  title={
                    place === "currencyExchange"
                      ? t("Sales.Customers.Receive_cash.Receive_currency")
                      : t("Sales.Customers.Receive_cash.Calculate_currency")
                  }
                >
                  <Column
                    title={t("Sales.Customers.Form.Amount").toUpperCase()}
                    dataIndex={
                      place === "currencyExchange"
                        ? "amount_exchange"
                        : "amount_calc"
                    }
                    key={
                      place === "currencyExchange"
                        ? "amount_exchange"
                        : "amount_calc"
                    }
                    sorter={sorter && { multiple: 6 }}
                    render={(text: any) => {
                      return <Statistics value={text} />;
                    }}
                    className="table-col"
                  />

                  <Column
                    title={t(
                      "Sales.Product_and_services.Inventory.Currency"
                    ).toUpperCase()}
                    dataIndex={
                      place === "currencyExchange"
                        ? "currency_exchange"
                        : "currency_calc"
                    }
                    key={
                      place === "currencyExchange"
                        ? "currency_exchange"
                        : "currency_calc"
                    }
                    sorter={sorter && { multiple: 5 }}
                    className="table-col"
                    render={(text: any) => {
                      return <>
                      ییی
                      {/* {text?.name} */}
                       </>;
                    }}
                  />

                  <Column
                    title={t(
                      "Sales.Product_and_services.Currency.Currency_rate"
                    ).toUpperCase()}
                    dataIndex={
                      place === "currencyExchange"
                        ? "currency_rate_exchange"
                        : "currency_rate_calc"
                    }
                    key={
                      place === "currencyExchange"
                        ? "currency_rate_exchange"
                        : "currency_rate_calc"
                    }
                    render={(text: any) => {
                      var num = parseFloat(text);
                      return <>{num}</>;
                    }}
                    className="table-col"
                    sorter={sorter && { multiple: 4 }}
                  />
                </ColumnGroup>
              )
            : null}

          {details && (
            <ColumnGroup
              title={t("Sales.Customers.Receive_cash.Receive_details")}
            >
              <Column
                title={t("Sales.All_sales.Invoice.Date_and_time").toUpperCase()}
                dataIndex="date_time"
                key="date_time"
                className="table-col"
                render={(text) => {
                  return <ShowDate date={text} />;
                }}
                sorter={sorter && { multiple: 3 }}
              />

              <Column
                title={`${t("Form.Description").toUpperCase()}`}
                dataIndex="description"
                key="description"
                sorter={sorter && { multiple: 2 }}
                className="table-col"
              />
            </ColumnGroup>
          )}
          <Column
            title={t("Sales.Customers.Receive_cash.Receiver").toUpperCase()}
            dataIndex="rec_by"
            key="rec_by"
            render={(text: any) => {
              return <>{text?.name} </>;
            }}
            className="table-col"
            sorter={sorter && { multiple: 1 }}
          />

          {type !== "print" && checkActionColumnPermissions(model) && (
            <Column
              title={t("Table.Action").toUpperCase()}
              key="action"
              width={isMobile ? 50 : 70}
              align="center"
              render={(text, record) => (
                <Action
                  modalTitle={modalTitle}
                  record={record}
                  baseUrl={baseUrl}
                  place={place}
                  hasSelected={hasSelected}
                  model={model}
                />
              )}
              fixed={"right"}
              className="table-col"
            />
          )}
        </React.Fragment>
      );
    },
    [
      baseUrl,
      calCurrency,
      currency,
      details,
      isMobile,
      modalTitle,
      model,
      place,
      t,
    ]
  );

  return (
    
    <PaginateTable
      model={model}
      title={title}
      columns={columns}
      queryKey={baseUrl}
      handleGetData={handleGetTransactions}
      settingMenu={setting}
    />
  );
};
const styles = {
  settingsMenu: { minWidth: "130px", paddingBottom: "10px" },
};

export default TransactionsTable;
