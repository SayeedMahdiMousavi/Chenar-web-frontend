import React, { useEffect, useState } from "react";
import { Title } from "../../../SelfComponents/Title";
import axiosInstance from "../../../ApiBaseUrl";
import { Row, Col, Table, Descriptions } from "antd";
import { useTranslation } from "react-i18next";
import Filters from "./Filters";
import { useMemo } from "react";
import ShowDate from "../../../SelfComponents/JalaliAntdComponents/ShowDate";
import { ReportTable, Statistics } from "../../../../components/antd";
import useGetRunningPeriod from "../../../../Hooks/useGetRunningPeriod";
import moment from "moment";
import { reportsDateFormat } from "../../../../Context";
import { PageBackIcon } from "../../../../components";
import { REPORT } from "../../../../constants/routes";

interface IProps {}
const { Column } = Table;
const dateFormat = reportsDateFormat;
export const currencyHistoryBaseUrl = "/currency/currency_rate_history/";
const baseUrl = currencyHistoryBaseUrl;
const CurrencyHistory: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    currency: { value: "", label: "" },
  });

  const { startDate, endDate, currency } = filters;

  //get running period
  const runningPeriod = useGetRunningPeriod();
  const curStartDate = runningPeriod?.data?.start_date;

  useEffect(() => {
    if (curStartDate) {
      setFilters((prev: any) => {
        return {
          ...prev,
          startDate: curStartDate
            ? moment(curStartDate, dateFormat).format(dateFormat)
            : "",
        };
      });
    }
  }, [curStartDate]);

  const handleGetCurrencyHistory = async ({ queryKey }: any) => {
    const { page, pageSize, search, order, startDate, endDate, currency } =
      queryKey?.[1];
    const currencyId = currency?.value;
    const { data } = await axiosInstance.get(
      `${baseUrl}?page=${page}&page_size=${pageSize}&search=${search}&ordering=${order}&date_before=${endDate}&date_after=${startDate}&currency=${currencyId}`
    );
    return data;
  };

  const columns = useMemo(
    () => (type: string) => {
      const sorter = type !== "print" ? true : false;
      return (
        <React.Fragment>
          <Column
            title={t(
              "Sales.Product_and_services.Currency.Date_of_registration"
            ).toUpperCase()}
            dataIndex="update_date"
            key="update_date"
            render={(text) => {
              return <ShowDate date={text} />;
            }}
            className="table-col"
            sorter={sorter && { multiple: 3 }}
          />
          <Column
            title={t("Sales.Product_and_services.Currency.1").toUpperCase()}
            dataIndex="currency"
            key="currency"
            className="table-col"
            sorter={sorter && { multiple: 2 }}
            render={(text) => <React.Fragment>{text?.name}</React.Fragment>}
          />
          <Column
            title={t(
              "Sales.Product_and_services.Currency.Currency_rate"
            ).toUpperCase()}
            dataIndex="to_currency_rate"
            key="to_currency_rate"
            className="table-col"
            sorter={sorter && { multiple: 1 }}
            render={(value) => <Statistics value={value} />}
          />
        </React.Fragment>
      );
    },
    [t]
  );

  // const columns = useMemo(
  //   () => (type: string) => {
  //     const newColumns = [
  //       {
  //         title: t("Table.Row"),
  //         dataIndex: "serial",
  //         key: "serial",
  //         width: type !== "print" ? 80 : 40,
  //         align: "center",
  //         render: (text: number, __: any, index: number) => (
  //           <span>{type !== "print" ? text : index + 1}</span>
  //         ),
  //       },
  //       {
  //         title: t(
  //           "Sales.Product_and_services.Currency.Date_of_registration"
  //         ).toUpperCase(),
  //         dataIndex: "update_date",
  //         key: "update_date",
  //         sorter: true,
  //         width: type !== "print" ? (isMobile ? 75 : 260) : 40,
  //         render: (text: string) => {
  //           return <ShowDate date={text} />;
  //         },
  //       },
  //       {
  //         title: t("Sales.Product_and_services.Currency.1").toUpperCase(),
  //         dataIndex: "currency",
  //         key: "currency",
  //         sorter: true,
  //         render: (text: any) => <React.Fragment>{text.name}</React.Fragment>,
  //       },
  //       {
  //         title: t(
  //           "Sales.Product_and_services.Currency.Currency_rate"
  //         ).toUpperCase(),
  //         dataIndex: "to_currency_rate",
  //         key: "to_currency_rate",
  //         sorter: true,
  //       },
  //     ];
  //     return newColumns;
  //   },
  //   [isMobile, t]
  // );

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

      {currency?.label && (
        <Descriptions.Item label={t("Sales.Product_and_services.Currency.1")}>
          {currency?.label}
        </Descriptions.Item>
      )}
    </Descriptions>
  );

  return (
    <>
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
                value={t(
                  "Sales.Product_and_services.Currency.Currency_history"
                )}
              />
            </Col>
            <Col
              xl={{ span: 12, offset: 0 }}
              lg={{ span: 17, offset: 0 }}
              md={{ span: 18, offset: 0 }}
              xs={{ span: 17, offset: 0 }}
            >
              <PageBackIcon
                previousPageName={t("Reports.1")}
                url={`${REPORT}/financial`}
              />
            </Col>
          </Row>
        </Col>
        <Col
          xl={{ span: 3, offset: 11 }}
          lg={{ span: 3, offset: 11 }}
          md={{ span: 4, offset: 10 }}
          sm={{ span: 5, offset: 8 }}
          xs={{ span: 6, offset: 4 }}
        ></Col>
      </Row>

      <ReportTable
        title={t("Sales.Product_and_services.Currency.Currency_history")}
        columns={columns}
        queryKey={baseUrl}
        handleGetData={handleGetCurrencyHistory}
        filters={filters}
        filterNode={(setPage, setSelectedRowKeys) => (
          <Filters
            setFilters={setFilters}
            setSelectedRowKeys={setSelectedRowKeys}
            setPage={setPage}
          />
        )}
        filtersComponent={printFilters}
      />
    </>
  );
};

export default CurrencyHistory;
