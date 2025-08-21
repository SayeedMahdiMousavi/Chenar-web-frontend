import React, { useCallback, useState } from "react";
import axiosInstance from "../../ApiBaseUrl";
import { Table, Space, Menu, Typography, Checkbox } from "antd";
import { useTranslation } from "react-i18next";
import Action from "./Action";
import { useMediaQuery } from "../../MediaQurey";
import { useMemo } from "react";
import { AntdTag, PaginateTable } from "../../../components/antd";
import { Colors } from "../../colors";
import { checkActionColumnPermissions } from "../../../Functions";
import { BANK_M } from "../../../constants/permissions";

interface IProps {
  baseUrl: string;
}

const { Column } = Table;
const BankingTable = (props: IProps) => {
  const isMobile = useMediaQuery("(max-width:425px)");
  const { t } = useTranslation();
  const [{ phone, fax, accountNumber, branch, notes, address }, setColumns] =
    useState({
      phone: false,
      fax: false,
      accountNumber: true,
      branch: true,
      notes: false,
      address: true,
    });

  //setting checkbox
  const onChangePhone = () =>
    setColumns((prev) => {
      return { ...prev, phone: !phone };
    });

  const onChangeBranch = () => {
    setColumns((prev) => {
      return { ...prev, branch: !branch };
    });
  };

  const onChangeNotes = () => {
    setColumns((prev) => {
      return { ...prev, notes: !notes };
    });
  };

  const onChangeFax = () => {
    setColumns((prev) => {
      return { ...prev, fax: !fax };
    });
  };

  const onChangeAddress = () => {
    setColumns((prev) => {
      return { ...prev, address: !address };
    });
  };
  const onChangeAccountNumber = () => {
    setColumns((prev) => {
      return { ...prev, accountNumber: !accountNumber };
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
        <Checkbox defaultChecked onChange={onChangeBranch}>
          {t("Banking.Form.Branch")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="3">
        <Checkbox defaultChecked onChange={onChangeAccountNumber}>
          {t("Banking.Form.Account_number")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="4">
        <Checkbox defaultChecked onChange={onChangeAddress}>
          {t("Form.Address")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="5">
        <Checkbox onChange={onChangePhone}>{t("Form.Phone")}</Checkbox>
      </Menu.Item>
      <Menu.Item key="6">
        <Checkbox onChange={onChangeFax}>{t("Form.Fax")}</Checkbox>
      </Menu.Item>
      <Menu.Item key="7">
        <Checkbox onChange={onChangeNotes}>{t("Form.Description")}</Checkbox>
      </Menu.Item>
    </Menu>
  );

  const handleGetBanks = useCallback(async ({ queryKey }: { queryKey: [string, { page: number; pageSize: number; search: string; order: string; status1: string }] }) => {
    const { page, pageSize, search, order, status1 } = queryKey?.[1];
    const { data } = await axiosInstance.get(
      `/banking/bank/?page=${page}&page_size=${pageSize}&ordering=${order}&status=${status1}&search=${search}`
    );
    return data;
  }, []);
  const columns = useMemo(
    () => (type: string, hasSelected: boolean) => {
      const sorter = type !== "print" ? true : false;
      return (
        <React.Fragment>
          <Column
            title={t("Banking.Bank_id").toUpperCase()}
            dataIndex="id"
            key="id"
            width={120}
            fixed={sorter}
            className="table-col"
            // align="center"
            sorter={sorter && { multiple: 9 }}
          />
          <Column
            title={t("Form.Name").toUpperCase()}
            width={isMobile ? 70 : 170}
            dataIndex="account_name"
            key="account_name"
            fixed={sorter}
            sorter={sorter && { multiple: 8 }}
            className="table-col"
          />
          {branch && (
            <Column
              title={t("Banking.Form.Branch").toUpperCase()}
              dataIndex="branch"
              key="branch"
              className="table-col"
              sorter={sorter && { multiple: 7 }}
            />
          )}
          {accountNumber && (
            <Column
              title={t("Banking.Form.Account_number").toUpperCase()}
              dataIndex="account_number"
              key="account_number"
              sorter={sorter && { multiple: 6 }}
              className="table-col"
            />
          )}
          <Column
            title={t("Banking.Form.Manager_name").toUpperCase()}
            dataIndex="manager_name"
            key="manager_name"
            sorter={sorter && { multiple: 5 }}
            className="table-col"
          />

          {phone && (
            <Column
              title={t("Sales.Customers.Table.Phone")}
              dataIndex="mobile"
              key="mobile"
              render={(text) => {
                return (
                  <React.Fragment>
                    {text?.mobile_list?.map(
                      (
                        item: { name: string; number: string },
                        index: number
                      ) => (
                        <Space key={index}>
                          <AntdTag color={Colors.primaryColor}>
                            {item.name}
                          </AntdTag>
                          :
                          <AntdTag color={Colors.primaryColor}>
                            {item.number}
                          </AntdTag>
                        </Space>
                      )
                    )}{" "}
                  </React.Fragment>
                );
              }}
              className="table-col"
              sorter={sorter && { multiple: 4 }}
            />
          )}
          {fax && (
            <Column
              title={t("Form.Fax")}
              dataIndex="fax"
              key="fax"
              className="table-col"
              sorter={sorter && { multiple: 3 }}
            />
          )}

          {address && (
            <Column
              title={t("Sales.Customers.Table.Address")}
              dataIndex="address"
              key="address"
              sorter={sorter && { multiple: 2 }}
              className="table-col"
            />
          )}

          {notes && (
            <Column
              title={`${t("Form.Description").toUpperCase()}`}
              dataIndex="description"
              key="description"
              sorter={sorter && { multiple: 1 }}
              className="table-col"
            />
          )}

          {type !== "print" && checkActionColumnPermissions(BANK_M) && (
            <Column
              title={t("Table.Action").toUpperCase()}
              key="action"
              width={isMobile ? 50 : 70}
              align="center"
              render={(text, record) => (
                <Action
                  record={record}
                  hasSelected={hasSelected}
                  baseUrl={props.baseUrl}
                />
              )}
              fixed={sorter ? "right" : undefined}
              className="table-col"
            />
          )}
        </React.Fragment>
      );
    },
    [
      accountNumber,
      address,
      branch,
      fax,
      isMobile,
      notes,
      phone,
      props.baseUrl,
      t,
    ]
  );

  return (
    <PaginateTable
      title={t("Banking.1")}
      columns={columns}
      model={BANK_M}
      queryKey={props.baseUrl}
      handleGetData={handleGetBanks as any}
      settingMenu={setting}
    />
  );
};

const styles = {
  settingsMenu: { width: "160px", paddingBottom: "10px" },
};

export default BankingTable;
