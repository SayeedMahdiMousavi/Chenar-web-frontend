import React, { useCallback, useMemo, useState } from "react";
import axiosInstance from "../../ApiBaseUrl";
import { Table } from "antd";
import { useTranslation } from "react-i18next";
import UserTableAction from "./UserTableAction";
import { useMediaQuery } from "../../MediaQurey";
import FilterUsers from "./FilterUsers";
import ShowDate from "../../SelfComponents/JalaliAntdComponents/ShowDate";
import { PaginateTable } from "../../../components/antd";
import { TrueFalseIcon } from "../../../components";
import { checkActionColumnPermissions } from "../../../Functions";
import { USERS_M } from "../../../constants/permissions";
const { Column } = Table;

const UserTable = (props) => {
  const isMobile = useMediaQuery("(max-width:400px)");
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ state: true });

  const handelGetUsers = useCallback(
    async ({ queryKey }) => {
      const { page, pageSize, search, state, order } = queryKey?.[1] || {};
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?page=${page}&page_size=${pageSize}&search=${search}&is_active=${state}&ordering=${order}&expand=*`
      );

      return data;
    },
    [props.baseUrl]
  );

  const columns = useMemo(
    // eslint-disable-next-line react/display-name
    () => (type, hasSelected) => (
      <React.Fragment>
        <Column
          title={t("Form.User_name").toUpperCase()}
          dataIndex="username"
          key="username"
          fixed={true}
          sorter={{ multiple: 8 }}
          className="table-col"
        />
        <Column
          title={t("Form.Name1").toUpperCase()}
          dataIndex="first_name"
          key="first_name"
          className="table-col"
          sorter={{ multiple: 7 }}
        />
        <Column
          title={t("Sales.Product_and_services.Type").toUpperCase()}
          dataIndex="user_type"
          key="user_type"
          className="table-col"
          sorter={{ multiple: 6 }}
          render={(text) => (
            <span>
              {text === "admin"
                ? t("Manage_users.Company_admin")
                : t("Manage_users.Custom_user")}
            </span>
          )}
        />
        <Column
          title={t("Sales.Customers.Table.Email").toUpperCase()}
          dataIndex="email"
          key="email"
          className="table-col"
          sorter={{ multiple: 5 }}
        />
        <Column
          title={t("Sales.Product_and_services.Status").toUpperCase()}
          dataIndex="is_active"
          key="is_active"
          align="center"
          render={(text) => <TrueFalseIcon value={text} />}
          sorter={{ multiple: 4 }}
          className="table-col"
        />
        <Column
          title={t("Employees.Employee").toUpperCase()}
          dataIndex="user_staff"
          key="user_staff"
          className="table-col"
          render={(text) => <React.Fragment>{text?.full_name}</React.Fragment>}
          sorter={{ multiple: 3 }}
        />
        <Column
          title={t("Sales.Customers.Form.Date").toUpperCase()}
          dataIndex="date_joined"
          key="date_joined"
          className="table-col"
          render={(text) => <ShowDate date={text} />}
          sorter={{ multiple: 2 }}
        />
        <Column
          title={t("Manage_users.Last_login").toUpperCase()}
          dataIndex="last_login"
          key="last_login"
          className="table-col"
          render={(text) => (
            <React.Fragment>
              {text ? <ShowDate date={text} /> : t("Manage_users.Last_login_message")}
            </React.Fragment>
          )}
          sorter={{ multiple: 1 }}
        />
        {checkActionColumnPermissions(USERS_M) && (
          <Column
            title={t("Table.Action")}
            key="action"
            width={isMobile ? 50 : 70}
            fixed="right"
            align="center"
            className="table-col"
            render={(text, record) => (
              <UserTableAction record={record} baseUrl={props.baseUrl} />
            )}
          />
        )}
      </React.Fragment>
    ),
    [isMobile, props.baseUrl, t]
  );



  return (
    <PaginateTable
      model={USERS_M}
      columns={columns}
      queryKey={props.baseUrl}
      handleGetData={handelGetUsers}
      rowSelectable={false}
      filters={filters}
      filterNode={(setPage, setVisible) => (
        <FilterUsers
          setFilters={setFilters}
          setVisible={setVisible}
          setPage={setPage}
        />
      )}
    />
  );
};

export default UserTable;
