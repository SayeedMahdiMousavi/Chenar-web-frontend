import React, { useCallback, useMemo, useState } from "react";
import axiosInstance from "../ApiBaseUrl";
import Photo from "../sales/Products/Photo";
import Filters from "../sales/Products/Units/Filters";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { Table, Menu, Typography, Checkbox, Button } from "antd";
import { useTranslation } from "react-i18next";
// import EmployeesAction from "./EmployeesAction";
import { useMediaQuery } from "../MediaQurey";
import ShowDate from "../SelfComponents/JalaliAntdComponents/ShowDate";
import { PaginateTable, Statistics } from "../../components/antd";
import { EMPLOYEE_M } from "../../constants/permissions";
import { checkActionColumnPermissions } from "../../Functions";
import { EMPLOYEE_DETAILS } from "../../constants/routes";
import { useNavigate } from "react-router-dom";
import EmployeesAction from "../Employees/EmployeesAction";

const { Column } = Table;
const dateFormat = "YYYY-MM-DD";
const datePFormat = "jYYYY/jM/jD";

const PartnersTable = (props:any) => {
  const [filters, setFilters] = useState({ state: "active" });
  const [settingsVisible, setSettingsVisible] = useState(false);
  const isMobile = useMediaQuery("(max-width:425px)");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [
    {
      phone,
      email,
      // mobile,
      photo,
      nationalId,
      salary,
      attachment,
      notes,
      birthDate,
      address,
      released,
      gender,
      // hireDate,
    },
    setColumns,
  ] = useState({
    phone: false,
    email: false,
    mobile: false,
    photo: false,
    nationalId: false,
    salary: true,
    attachment: false,
    notes: false,
    address: false,
    birthDate: false,
    released: false,
    hireDate: false,
    gender: false,
  });

  //setting checkbox
  const onChangePhone = (e:any) =>
    setColumns((prev) => {
      return { ...prev, phone: e.target.checked };
    });

  const onChangeEmail = (e:any) => {
    setColumns((prev) => {
      return { ...prev, email: e.target.checked };
    });
  };
  const onChangeAttachment = (e:any) =>
    setColumns((prev) => {
      return { ...prev, attachment: e.target.checked };
    });

  const onChangeNotes = (e:any) => {
    setColumns((prev) => {
      return { ...prev, notes: e.target.checked };
    });
  };

  const onChangeNationalId = (e:any) => {
    setColumns((prev) => {
      return { ...prev, nationalId: e.target.checked };
    });
  };
  const onChangeSalary = (e:any) => {
    setColumns((prev) => {
      return { ...prev, salary: e.target.checked };
    });
  };
  const onChangeBirthDate = (e:any) => {
    setColumns((prev) => {
      return { ...prev, birthDate: e.target.checked };
    });
  };
  const onChangeAddress = (e:any) => {
    setColumns((prev) => {
      return { ...prev, address: e.target.checked };
    });
  };
  const onChangePhoto = (e:any) => {
    setColumns((prev) => {
      return { ...prev, photo: e.target.checked };
    });
  };
  const onChangeReleased = (e:any) => {
    setColumns((prev) => {
      return { ...prev, released: e.target.checked };
    });
  };
  const onChangeGender = (e:any) => {
    setColumns((prev) => {
      return { ...prev, gender: e.target.checked };
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
        <Checkbox onChange={onChangeSalary} checked={salary}>
          {t("Employees.Salary")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="3">
        <Checkbox onChange={onChangePhone} checked={phone}>
          {t("Form.Phone")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="4">
        <Checkbox onChange={onChangeAddress} checked={address}>
          {t("Form.Address")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="5">
        <Checkbox onChange={onChangeEmail} checked={email}>
          {t("Form.Email")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="6">
        <Checkbox onChange={onChangePhoto} checked={photo}>
          {t("Form.Photo")}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="7">
        <Checkbox onChange={onChangeNationalId} checked={nationalId}>
          {t("Sales.Customers.Form.National_id_number1")}
        </Checkbox>
      </Menu.Item>
      {settingsVisible && (
        <React.Fragment>
          <Menu.Item key="9">
            <Checkbox onChange={onChangeBirthDate} checked={birthDate}>
              {t("Employees.BirthDate")}
            </Checkbox>
          </Menu.Item>

          <Menu.Item key="8">
            <Checkbox onChange={onChangeReleased} checked={released}>
              {t("Employees.Released")}
            </Checkbox>
          </Menu.Item>

          <Menu.Item key="10">
            <Checkbox onChange={onChangeGender} checked={gender}>
              {t("Employees.Gender")}
            </Checkbox>
          </Menu.Item>

          <Menu.Item key="11">
            <Checkbox onChange={onChangeNotes} checked={notes}>
              {t("Form.Notes")}
            </Checkbox>
          </Menu.Item>

          <Menu.Item key="12">
            <Checkbox onChange={onChangeAttachment} checked={attachment}>
              {t("Form.Attachments")}
            </Checkbox>
          </Menu.Item>
        </React.Fragment>
      )}

      <Menu.Item
        key="13"
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

  const handleGetEmployees = useCallback(
    /// @ts-ignore
    async ({ queryKey }) => {
      const { page, pageSize, search, order, state } = queryKey?.[1];
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?page=${page}&page_size=${pageSize}&ordering=${order}&status=${state}&search=${search}&expand=*&omit=cash`
      );
      return data;
    },
    [props.baseUrl]
  );

  const handleDoubleClickAction = (e:any) => {
    e.stopPropagation();
  };

  const columns = useMemo(
    () => (type:any, hasSelected:any) => {
      const sorter = type !== "print" ? true : false;
      return (
        <React.Fragment>
            
          <Column
            title={t("Form.Name").toUpperCase()}
            dataIndex="name"
            key="name"
            //@ts-ignore
            width={type !== "print" ? 145 : false}
            sorter={sorter && { multiple: 16 }}
            fixed={sorter}
            className="table-col"
            // align="center"
          />
          <Column
            title={t("Form.Last_Name").toUpperCase()}
            // width={isMobile ? 70 : 170}
            dataIndex="Last_Name"
            key="Last_Name"
            fixed={sorter}
            render={(text, record:any) => (
              <React.Fragment>{record?.Last_Name}</React.Fragment>
            )}
            sorter={sorter && { multiple: 15 }}
            className="table-col"
          />
           
            <Column
              title={`${t("Form.Phone").toUpperCase()}`}
              dataIndex="Phone"
              key="Phone"
              className="table-col"
            //   width={80}
            sorter={sorter && { multiple: 14 }}
              // align="center"
            //   render={(text, record) => {
            //     return <Photo photo={text} />;
            //   }}
              // width={150}
            />
          
          
            <Column
              title={t("Form.Capital_amount").toUpperCase()}
              dataIndex="capital_amount"
              key="capital_amount"
              sorter={sorter && { multiple: 14 }}
              className="table-col"
              render={(value) => <Statistics value={value} />}
            />
            <Column
              title={t("Form.Address")}
              dataIndex="Address"
              key="Address"
              className="table-col"
              sorter={sorter && { multiple: 13 }}
            />
            <Column
            title={t("Form.Photo").toUpperCase()}
            dataIndex="Photo"
            key="Photo"
            sorter={sorter && { multiple: 12 }}
            className="table-col"
          />

          {/* <Column
            title={t("Form.Mobile")}
            dataIndex="mobile_number"
            key="mobile_number"
            render={(text, record) => {
              return <React.Fragment>{text}</React.Fragment>;
            }}
            className="table-col"
            sorter={sorter && { multiple: 9 }}
          /> */}
          {/* )} */}
          {/* <Column
            title={t("Employees.Position").toUpperCase()}
            dataIndex="position"
            key="position"
            sorter={sorter && { multiple: 12 }}
            className="table-col"
          /> */}
          {/* {address && (
            <Column
              title={t("Sales.Customers.Table.Address")}
              dataIndex="full_billing_address"
              key="full_billing_address"
              sorter={sorter && { multiple: 11 }}
              className="table-col"
            />
          )} */}
          {/* <Column
            title={`${t("Sales.Product_and_services.Category").toUpperCase()}`}
            dataIndex="category"
            key="category"
            className="table-col"
            render={(text, record) => {
              return <span>{text?.get_fomrated_path}</span>;
            }}
            sorter={sorter && { multiple: 10 }}
            // width={150}
          /> */}

          {/* {email && (
            <Column
              title={t("Sales.Customers.Table.Email")}
              dataIndex="email"
              key="email"
              className="table-col"
              sorter={sorter && { multiple: 9 }}
              // width={150}
            />
          )} */}
          {/* {nationalId && (
            <Column
              title={t("Sales.Customers.Form.National_id_number").toUpperCase()}
              dataIndex="national_id_number"
              key="national_id_number"
              sorter={sorter && { multiple: 8 }}
              className="table-col"
            />
          )} */}
          {/* {birthDate && (
            <Column
              title={t("Employees.BirthDate").toUpperCase()}
              dataIndex="date_of_birth"
              key="date_of_birth"
              render={(text) => {
                return (
                  <ShowDate
                    datePFormat={datePFormat}
                    dateFormat={dateFormat}
                    date={text}
                  />
                );
              }}
              sorter={sorter && { multiple: 7 }}
              className="table-col"
            />
          )} */}

          {/* <Column
            title={t("Employees.Hire_date").toUpperCase()}
            dataIndex="hire_date"
            key="hire_date"
            sorter={sorter && { multiple: 6 }}
            render={(text) => {
              return (
                <ShowDate
                  datePFormat={datePFormat}
                  dateFormat={dateFormat}
                  date={text}
                />
              );
            }}
            className="table-col"
          /> */}

          {/* {released && (
            <Column
              title={t("Employees.Released").toUpperCase()}
              dataIndex="release_date"
              key="release_date"
              render={(text) => {
                return (
                  <ShowDate
                    datePFormat={datePFormat}
                    dateFormat={dateFormat}
                    date={text}
                  />
                );
              }}
              sorter={sorter && { multiple: 5 }}
              className="table-col"
            />
          )} */}
          {/* {gender && (
            <Column
              title={t("Employees.Gender").toUpperCase()}
              dataIndex="gender"
              key="gender"
              sorter={sorter && { multiple: 4 }}
              className="table-col"
            />
          )} */}

          {/* <Column
            title={t("Employees.Employee_uid").toUpperCase()}
            dataIndex="Staff_UID"
            key="Staff_UID"
            sorter={sorter && { multiple: 3 }}
            className="table-col"
          /> */}

          {/* {attachment && (
            <Column
              title={t("Sales.Customers.Table.Attachments").toUpperCase()}
              dataIndex="attachment"
              key="attachment"
              sorter={sorter && { multiple: 2 }}
              render={(text, record) => {
                const attachment = text?.split("/");
                return <React.Fragment>{attachment?.[6]}</React.Fragment>;
              }}
              className="table-col"
            />
          )} */}
          {/* {notes && (
            <Column
              title={t("Form.Notes").toUpperCase()}
              dataIndex="notes"
              key="notes"
              sorter={sorter && { multiple: 1 }}
              className="table-col"
            />
          )} */}

          {type !== "print" && checkActionColumnPermissions(EMPLOYEE_M) && (
            <Column
              title={t("Table.Action").toUpperCase()}
              key="action"
              width={isMobile ? 50 : 70}
              align="center"
              render={(text, record) => (
                <div onDoubleClick={handleDoubleClickAction}>
                  <EmployeesAction
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
      attachment,
      birthDate,
      email,
      gender,
      isMobile,
      nationalId,
      notes,
      phone,
      photo,
      props.baseUrl,
      released,
      salary,
      t,
    ]
  );

  return (
    <PaginateTable
      title={t("Employees.1")}
      model={EMPLOYEE_M}
      columns={columns}
      queryKey={props.baseUrl}
      handleGetData={handleGetEmployees}
      filters={filters}
      filterNode={(setPage, setVisible) => (
        <Filters
          setFilters={setFilters}
          setVisible={setVisible}
          setPage={setPage}
        />
      )}
    //   settingMenu={setting}
      onRow={(record:any) => {
        return {
          onDoubleClick: () => {
            navigate(`${EMPLOYEE_DETAILS}/${record.id}`);
          }, // double click row
        };
      }}
    />
  );
};

const styles = {
  settingsMenu: { width: "170px", paddingBottom: "10px" },
};

export default PartnersTable;