import React, { useCallback, useMemo, useState } from "react";
import axiosInstance from "../../ApiBaseUrl";
import Photo from "../../sales/Products/Photo";
import Filters from "../../sales/Products/Units/Filters";
import { UpOutlined, DownOutlined } from "@ant-design/icons";

import { Row, Col, Table, Menu, Typography, Checkbox, Button } from "antd";
import { useTranslation } from "react-i18next";
import SupplierAction from "./SupplierAction";
import { useMediaQuery } from "../../MediaQurey";
import { useNavigate } from "react-router-dom";
import { PaginateTable } from "../../../components/antd";
import { checkActionColumnPermissions } from "../../../Functions";
import { SUPPLIER_M } from "../../../constants/permissions";

const { Column } = Table;

const SuppliersTable = (props) => {
  let navigate = useNavigate();
  const [filters, setFilters] = useState({ state: "active" });
  // const [collapsed, setCollapsed] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const isMobile = useMediaQuery("(max-width:425px)");
  const { t, i18n } = useTranslation();
  const [
    { phone, address, email, attachments, creditLimit, photo, nationalId },
    setColumns,
  ] = useState({
    phone: true,
    address: true,
    email: false,
    attachments: false,
    creditLimit: false,
    nationalId: false,
    photo: false,
  });

  //setting checkbox
  const onChangePhone = (e) =>
    setColumns((prev) => {
      return { ...prev, phone: e.target.checked };
    });

  const onChangeAddress = (e) =>
    setColumns((prev) => {
      return { ...prev, address: e.target.checked };
    });
  const onChangePhoto = (e) =>
    setColumns((prev) => {
      return { ...prev, photo: e.target.checked };
    });

  const onChangeEmail = (e) => {
    setColumns((prev) => {
      return { ...prev, email: e.target.checked };
    });
  };
  const onChangeAttachments = (e) => {
    setColumns((prev) => {
      return { ...prev, attachments: e.target.checked };
    });
  };
  const onChangeCreditLimit = (e) => {
    setColumns((prev) => {
      return { ...prev, creditLimit: e.target.checked };
    });
  };
  const onChangeNationalId = (e) => {
    setColumns((prev) => {
      return { ...prev, nationalId: e.target.checked };
    });
  };

  const handelMenuVisible = () => {
    setSettingsVisible(!settingsVisible);
  };

  const setting = (
    <Menu style={styles.settingsMenu}>
      <Menu.Item key="1">
        <Typography.Text strong={true}>
          {t("Sales.Product_and_services.Columns")}
        </Typography.Text>
      </Menu.Item>
      <Menu.Item key="2">
        <Checkbox onChange={onChangeAddress} checked={address}>
          {t("Form.Address")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="3">
        <Checkbox onChange={onChangePhone} checked={phone}>
          {t("Form.Phone")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="4">
        <Checkbox onChange={onChangeEmail} checked={email}>
          {t("Form.Email")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="5">
        <Checkbox onChange={onChangePhoto} checked={photo}>
          {t("Form.Photo")}
        </Checkbox>
      </Menu.Item>
      {settingsVisible && (
        <React.Fragment>
          <Menu.Item key="9">
            <Checkbox onChange={onChangeCreditLimit} checked={creditLimit}>
              {t("Sales.Customers.Form.Credit_limit")}
            </Checkbox>
          </Menu.Item>

          <Menu.Item key="8">
            <Checkbox onChange={onChangeNationalId} checked={nationalId}>
              {t("Sales.Customers.Form.National_id_number1")}
            </Checkbox>
          </Menu.Item>

          <Menu.Item key="7">
            <Checkbox onChange={onChangeAttachments} checked={attachments}>
              {t("Form.Attachments")}
            </Checkbox>
          </Menu.Item>
        </React.Fragment>
      )}
      <Menu.Item
        key="6"
        onClick={handelMenuVisible}
        className="table__header2-setting-showMore"
        style={{ textAlign: "end" }}
      >
        {settingsVisible ? (
          <Button
            type="link"
            icon={<UpOutlined />}
            className="table__header2-setting-showMore"
          >
            {t("Sales.Product_and_services.Show_less")}
          </Button>
        ) : (
          <Button
            type="link"
            icon={<DownOutlined />}
            className="table__header2-setting-showMore"
          >
            {t("Sales.Product_and_services.Show_More")}
          </Button>
        )}
      </Menu.Item>
    </Menu>
  );

  const handleGetSuppliers = useCallback(
    async ({ queryKey }) => {
      const { page, pageSize, search, order, state } = queryKey?.[1] || {};
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?page=${page}&page_size=${pageSize}&ordering=${order}&status=${state}&search=${search}&expand=category`
      );
      return data;
    },
    [props.baseUrl]
  );

  const handleDoubleClickAction = (e) => {
    e.stopPropagation();
  };

  const columns = useMemo(
  (type, hasSelected) => {
      const sorter = type !== "print" ? true : false;
      return (
        <React.Fragment>
          <Column
            title={t("Expenses.Suppliers.Supplier_id").toUpperCase()}
            dataIndex="id"
            key="id"
            width={
              type !== "print" ? (i18n.language === "en" ? 145 : 160) : false
            }
            sorter={sorter && { multiple: 10 }}
            fixed={sorter}
            className="table-col"
            // align="center"
          />
          <Column
            title={t("Expenses.Suppliers.Supplier")}
            dataIndex="first_name"
            key="first_name"
            fixed={sorter}
            render={(text, record) => (
              <React.Fragment>{record?.full_name}</React.Fragment>
            )}
            sorter={sorter && { multiple: 9 }}
            className="table-col"
          />
          {photo && (
            <Column
              title={`${t("Form.Photo").toUpperCase()}`}
              dataIndex="photo"
              key="photo"
              className="table-col"
              width={80}
              align="center"
              render={(text, record) => {
                return <Photo photo={text} />;
              }}
              // width={150}
            />
          )}
          {phone && (
            <Column
              title={t("Sales.Customers.Table.Phone")}
              dataIndex="phone_number"
              key="phone_number"
              className="table-col"
              sorter={sorter && { multiple: 8 }}
            />
          )}
          <Column
            title={t("Form.Mobile").toUpperCase()}
            dataIndex="mobile_number"
            key="mobile_number"
            className="table-col"
            sorter={sorter && { multiple: 7 }}
          />
          {address && (
            <Column
              title={t("Sales.Customers.Table.Address")}
              dataIndex="full_billing_address"
              key="full_billing_address"
              sorter={sorter && { multiple: 6 }}
              className="table-col"
            />
          )}

          {email && (
            <Column
              title={t("Sales.Customers.Table.Email")}
              dataIndex="email"
              key="email"
              className="table-col"
              sorter={sorter && { multiple: 5 }}
              // width={150}
            />
          )}
          <Column
            title={`${t("Sales.Product_and_services.Category").toUpperCase()}`}
            dataIndex="category"
            key="category"
            className="table-col"
            render={(text, record) => {
              return <span>{text?.get_fomrated_path}</span>;
            }}
            sorter={sorter && { multiple: 4 }}
            // width={150}
          />
          {attachments && (
            <Column
              title={t("Sales.Customers.Table.Attachments")}
              dataIndex="attachment"
              key="attachment"
              sorter={sorter && { multiple: 3 }}
              render={(text, record) => {
                const phone = text?.split("/");
                return <React.Fragment>{phone?.[6]}</React.Fragment>;
              }}
              className="table-col"
            />
          )}
          {creditLimit && (
            <Column
              title={t("Sales.Customers.Form.Credit_limit").toUpperCase()}
              dataIndex="credit_limit"
              key="credit_limit"
              sorter={sorter && { multiple: 2 }}
              className="table-col"
            />
          )}
          {nationalId && (
            <Column
              title={t("Sales.Customers.Form.National_id_number").toUpperCase()}
              dataIndex="national_id_number"
              key="national_id_number"
              sorter={sorter && { multiple: 1 }}
              className="table-col"
            />
          )}

          {type !== "print" && checkActionColumnPermissions(SUPPLIER_M) && (
            <Column
              title={t("Table.Action")}
              key="action"
              align="center"
              width={isMobile ? 50 : 70}
              render={(text, record) => (
                <div onDoubleClick={handleDoubleClickAction}>
                  <SupplierAction
                    record={record}
                    hasSelected={hasSelected}
                    baseUrl={props.baseUrl}
                  />
                </div>
              )}
              fixed={"right"}
              className="table-col"
            />
          )}
        </React.Fragment>
      );
    },
    [
      address,
      attachments,
      creditLimit,
      email,
      i18n.language,
      isMobile,
      nationalId,
      phone,
      photo,
      props.baseUrl,
      t,
    ]
  );

  return (
    <div>
      {/* {collapsed ? (
        ""
      ) : (
        <Row justify="space-around">
          <Col span={24}>
            <Row
              gutter={[16, 20]}
              align="middle"
              style={{ marginBottom: "20px" }}
            >
              <Col md={8} sm={12} xs={24}>
                <Card
                  hoverable
                  className="customer_admin"
                  bordered={false}
                  bodyStyle={styles.card}
                >
                  <Statistic
                    title={
                      <span style={{ color: "white" }}>
                        {t("Sales.Customers.Unbilled_last_year")}
                      </span>
                    }
                    value={9.3}
                    precision={2}
                    valueStyle={{ color: "white" }}
                    suffix={
                      <span style={{ color: "white", fontSize: "1rem" }}>
                        {t("Sales.Customers.Estimate")}
                      </span>
                    }
                  />
                </Card>
              </Col>
              <Col md={8} sm={12} xs={24}>
                <Card
                  hoverable
                  bordered={false}
                  bodyStyle={{
                    background: "#08979c",
                    padding: "24px 18px",
                  }}
                >
                  <Statistic
                    title={
                      <span style={{ color: "white" }}>
                        {t("Sales.Customers.Unpaid_last_year")}
                      </span>
                    }
                    value={9.3}
                    precision={2}
                    valueStyle={{ color: "white" }}
                    suffix={
                      <span style={{ color: "white", fontSize: "1rem" }}>
                        {t("Sales.Customers.Open_invoice")}
                      </span>
                    }
                  />
                </Card>
              </Col>
              <Col md={8} sm={24} xs={24}>
                <Card
                  hoverable
                  bordered={false}
                  headStyle={{ padding: "0pxs" }}
                  bodyStyle={{
                    background: "#2ecc71",
                    padding: "24px 18px",
                  }}
                >
                  <Statistic
                    title={
                      <span style={{ color: "white" }}>
                        {" "}
                        {t("Sales.Customers.Paid")}
                      </span>
                    }
                    value={9.3}
                    precision={2}
                    customer_admin
                    valueStyle={{ color: "white" }}
                    suffix={
                      <span style={{ color: "white", fontSize: "1rem" }}>
                        {t("Sales.Customers.Paid_last_month")}
                      </span>
                    }
                  />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      )} */}
      <Row className="position__relative">
        <Col span={24}>
          <PaginateTable
            title={t("Expenses.Suppliers.1")}
            model={SUPPLIER_M}
            columns={columns}
            queryKey={props.baseUrl}
            handleGetData={handleGetSuppliers}
            filters={filters}
            filterNode={(setPage, setVisible) => (
              <Filters
                setFilters={setFilters}
                setVisible={setVisible}
                setPage={setPage}
              />
            )}
            settingMenu={setting}
            onRow={(record) => {
              return {
                onDoubleClick: () => {
                  navigate(`/supplier-details/${record.id}`);
                }, // double click row
              };
            }}
          />
        </Col>
        {/* <Col span={1} className="table__expandIcon">
          {collapsed ? (
            <DownSquareTwoTone
              className="icon"
              onClick={onCollapsed}
              twoToneColor={Colors.primaryColor}
            />
          ) : (
            <UpSquareTwoTone
              className="icon"
              onClick={onCollapsed}
              twoToneColor={Colors.primaryColor}
            />
          )}
        </Col> */}
      </Row>
    </div>
  );
};
const styles = {
  card: { background: "#3498db", padding: "24px 20px" },
  settingsMenu: { width: "160px", paddingBottom: "10px" },
};

export default SuppliersTable;
