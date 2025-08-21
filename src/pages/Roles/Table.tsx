import React, { Fragment, useCallback, useMemo } from "react";
import axiosInstance from "../ApiBaseUrl";
import { Table } from "antd";
import { useTranslation } from "react-i18next";
// import RolesTableAction from "./RolesTableAction";
import { useMediaQuery } from "../MediaQurey";

import { AntdTag, PaginateTable } from "../../components/antd";
import { ROLES_LIST } from "../../constants/routes";
import { Colors } from "../colors";
import RoleTableAction from "./Action";
import { USER_ROLE_M } from "../../constants/permissions";
import { checkActionColumnPermissions } from "../../Functions";

const { Column } = Table;

const RolesTable = ({
  handleUpdateItems,
}: {
  handleUpdateItems: () => void;
}) => {
  const isMobile = useMediaQuery("(max-width:400px)");
  const { t } = useTranslation();
  //@ts-ignore
  const handelGetUsers = useCallback(async ({ queryKey }) => {
    const { page, pageSize, search, order } = queryKey?.[1];
    const { data } = await axiosInstance.get(
      `${ROLES_LIST}?page=${page}&page_size=${pageSize}&search=${search}&ordering=${order}&expand=*`
    );

    return data;
  }, []);

  const columns = useMemo(
    () => () =>
      (
        <React.Fragment>
          <Column
            title={t("Role").toUpperCase()}
            dataIndex="name"
            key="name"
            sorter={{ multiple: 2 }}
          />
          <Column
            title={t("Manage_users.Permissions").toUpperCase()}
            dataIndex="permissions"
            key="permissions"
            sorter={{ multiple: 1 }}
            render={(value) => {
              return (
                <Fragment>
                  {value?.slice(0, 7)?.map((item: string) => (
                    <AntdTag key={item} color={Colors.primaryColor}>
                      {item}
                    </AntdTag>
                  ))}
                  {value?.length > 7 ? "..." : ""}
                </Fragment>
              );
            }}
          />
          {checkActionColumnPermissions(USER_ROLE_M) && (
            <Column
              title={t("Table.Action")}
              key="action"
              width={isMobile ? 50 : 70}
              fixed="right"
              align="center"
              className="table-col"
              render={(text, record: { name: string; permissions: string[]; id?: number; system_default: boolean }) => (
                <RoleTableAction
                record={record}
                  handleUpdateItems={handleUpdateItems}
                />
              )}
            />
          )}
        </React.Fragment>
      ),
    [isMobile, handleUpdateItems, t]
  );

  return (
    <PaginateTable
      columns={columns}
      queryKey={ROLES_LIST}
      handleGetData={handelGetUsers}
      rowSelectable={false}
      model={USER_ROLE_M}
    />
  );
};

export default RolesTable;
