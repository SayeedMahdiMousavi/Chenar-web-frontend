import React, { useCallback, useMemo, useState } from "react";
import axiosInstance from "../../ApiBaseUrl";
import { Table, Space } from "antd";
import { useTranslation } from "react-i18next";
import ViewAuditing from "./View";
import CrudAuditingFilters from "./Filters";
import ShowDate from "../../SelfComponents/JalaliAntdComponents/ShowDate";
import { PaginateTable } from "../../../components/antd";
import { useMediaQuery } from "../../MediaQurey";
import Photo from "../../sales/Products/Photo";
import { CRUD_AUDIT_M } from "../../../constants/permissions";

const { Column } = Table;
const baseUrl = "/auditing/crud/";

const CrudAuditingTable = () => {
  const isMobile = useMediaQuery("(max-width:425px)");
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ contentType: "" });

  const handleGetCrudAuditing = useCallback(async ({ queryKey }: { queryKey: unknown[] }) => {
    const { page, pageSize, search, order, contentType } = queryKey?.[1] as { page: number; pageSize: number; search: string; order: string; contentType: string };
    const { data } = await axiosInstance.get(
      `${baseUrl}?page=${page}&page_size=${pageSize}&ordering=${order}&content_type=${contentType}&search=${search}&expand=*`
    );
    return data;
  }, []);
  const columns = useMemo(
    () => () =>
      (
        <React.Fragment>
          <Column
            title={t("Company.User").toUpperCase()}
            dataIndex="user"
            key="user"
            fixed={true}
            sorter={{ multiple: 5 }}
            render={(text, record: any) => {
              return (
                <React.Fragment>
                  <Space>
                    <Photo
                      photo={record?.user_photo}
                      content={text?.username?.[0]?.toUpperCase()}
                    />
                    {text?.username}
                  </Space>
                </React.Fragment>
              );
            }}
          />
          <Column
            title={t("Auditing.Content_type").toUpperCase()}
            dataIndex="content_type"
            key="content_type"
            sorter={{ multiple: 4 }}
          />
          <Column
            title={t("Auditing.Event").toUpperCase()}
            dataIndex="event_type"
            key="event_type"
            sorter={{ multiple: 3 }}
          />
          <Column
            title={t("Auditing.Item_id").toUpperCase()}
            dataIndex="object_id"
            key="object_id"
            sorter={{ multiple: 2 }}
          />

          <Column
            title={t("Sales.All_sales.Invoice.Date_and_time").toUpperCase()}
            dataIndex="datetime"
            key="datetime"
            sorter={{ multiple: 1 }}
            render={(text) => {
              return <ShowDate date={text} />;
            }}
          />

          <Column
            title={t("Table.Action").toUpperCase()}
            key="action"
            width={isMobile ? 50 : 70}
            align="center"
            render={(text, record) => <ViewAuditing record={record} />}
            fixed={"right"}
          />
        </React.Fragment>
      ),
    [isMobile, t]
  );

  return (
    <div className="table-col table__padding">
      <PaginateTable
        columns={columns}
        queryKey={baseUrl}
        handleGetData={handleGetCrudAuditing}
        rowSelectable={false}
        filters={filters}
        model={CRUD_AUDIT_M}
        filterNode={(setPage, setVisible) => (
          <CrudAuditingFilters
            setFilters={setFilters}
            setVisible={setVisible}
            setPage={setPage}
          />
        )}
      />
    </div>
  );
};

export default CrudAuditingTable;
