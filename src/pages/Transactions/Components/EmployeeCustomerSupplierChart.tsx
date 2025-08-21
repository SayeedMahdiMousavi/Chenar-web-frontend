import React, { useState } from "react";
import { Form, Select, Row, Col } from "antd";
import { debounce } from "throttle-debounce";
import { useQuery } from "react-query";
import axiosInstance from "../../ApiBaseUrl";
import { useTranslation } from "react-i18next";
import { CenteredSpin } from "../../SelfComponents/Spin";

const getData = async ({ queryKey }: any) => {
  const key = queryKey?.[0];
  const { data } = await axiosInstance.get(`${key}?page=1&page_size=7`);
  return data;
};

const getSearchData = async ({ queryKey }: any) => {
  const search = queryKey?.[1];
  const { data } = await axiosInstance.get(
    `/chart_of_account/?page=1&page_size=7&name__contains=${search}&content_type__model__in=customer,staff,supplier`
  );
  return data;
};

interface IProps {
  form: any;
  required?: boolean;
}
export const EmployeeCustomerSupplierChart: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<any>([]);
  const [employees, setEmployees] = useState<any>([]);
  const [suppliers, setSuppliers] = useState<any>([]);
  const [bonkData, setBonkData] = useState<any>([]);
  

  const onSearch = (value: string) => {
    debounceFuncWarehouse(value);
  };

  const debounceFuncWarehouse = debounce(500, async (value: string) => {
    setSearch(value);
  });

  const customerData = useQuery(`/chart_of_account/ACU-103/child/`, getData);
  const supplierData = useQuery(`/chart_of_account/LSU-201/child/`, getData);
  const { data } = useQuery(`/chart_of_account/ACB-101/child/`, getData);

  const employeeData = useQuery(`/chart_of_account/LST-203/child/`, getData);
  const searchAllData = useQuery(
    [`/chart_of_account/customerEmployeeSupplier/`, search],
    getSearchData
  );

  React.useEffect(() => {
    const customer = searchAllData?.data?.results?.filter((item: any) => {
      const id = item?.id?.split("-");
      return id?.[0] === "CUS";
    });

    const employee = searchAllData?.data?.results?.filter((item: any) => {
      const id = item?.id?.split("-");
      return id?.[0] === "SUP";
    });

    const supplier = searchAllData?.data?.results?.filter((item: any) => {
      const id = item?.id?.split("-");
      return id?.[0] === "SUP";
    });
    setCustomers(customer);
    setEmployees(employee);
    setSuppliers(supplier);
    setBonkData(data?.pages?.[0]?.results)
  }, [searchAllData?.data?.results?.length  , data?.pages?.[0]?.results?.length]);

  const onChangeAccountName = (value: { value: string; label: string }) => {
    props.form.setFieldsValue({ accountId: value.value });
    setSearch("");
  };

  // const onChangeAccountId = (value: string) => {
  //   if (search) {
  //     const newData = searchAllData?.data?.find((item: any) => {
  //       return item?.results?.find((item: any) => item.id === value);
  //     });
  //     const item = newData?.find((item: any) => item?.id === value);
  //     props.form.setFieldsValue({
  //       expenseName: { value: item?.id, label: item?.name },
  //     });
  //   } else {
  //     const newValue = value.split("-");
  //     if (newValue?.[0] === "CUS") {
  //       const item = customerData?.data?.results?.find(
  //         (item: any) => item?.id === value
  //       );
  //       props.form.setFieldsValue({
  //         accountName: { value: item?.id, label: item.name },
  //       });
  //     } else if (newValue?.[0] === "SUP") {
  //       const item = supplierData?.data?.results?.find(
  //         (item: any) => item?.id === value
  //       );
  //       props.form.setFieldsValue({
  //         accountName: { value: item?.id, label: item.name },
  //       });
  //     } else {
  //       const item = employeeData?.data?.results?.find(
  //         (item: any) => item?.id === value
  //       );
  //       props.form.setFieldsValue({
  //         accountName: { value: item?.id, label: item.name },
  //       });
  //     }
  //   }
  //   setSearch("");
  // };

  const allCustomers = search ? customers : customerData?.data?.results;
  const allEmployees = search ? employees : employeeData?.data?.results;
  const allSuppliers = search ? suppliers : supplierData?.data?.results;
  return (
    <Row gutter={10}>
      {/* <Col span={7}>
        <Form.Item
          name="accountId"
          className="margin1"
          rules={[
            { required: true, message: t("Banking.Form.Account_id_required") },
          ]}
        >
          <Select
            placeholder={t("Banking.Form.Account_id")}
            showSearch
            onSearch={onSearch}
            onChange={onChangeAccountId}
            showArrow
            filterOption={false}
            optionFilterProp="label"
            notFoundContent={
              searchAllData?.isFetching || searchAllData.isLoading ? (
                <CenteredSpin size="small" style={styles.spin} />
              ) : undefined
            }
            dropdownRender={(menu) => (
              <div>
                {customerData?.isLoading &&
                supplierData?.isLoading &&
                employeeData?.isLoading ? (
                  <CenteredSpin size="small" style={styles.spin} />
                ) : (
                  menu
                )}
              </div>
            )}
          >
            <Select.OptGroup label={t("Sales.Customers.1")}>
              {customerData?.isLoading ? (
                <Select.Option
                  disabled={true}
                  key="supplierLoader"
                  value="supplierLoader"
                  label={<CenteredSpin size="small" />}
                  style={styles.option}
                >
                  <CenteredSpin size="small" style={styles.optionLoader} />
                </Select.Option>
              ) : (
                allCustomers?.map((item: any) => (
                  <Select.Option
                    key={item?.id}
                    value={item?.id}
                    label={item?.id}
                  >
                    {item?.id}
                  </Select.Option>
                ))
              )}
            </Select.OptGroup>
            <Select.OptGroup label={t("Expenses.Suppliers.1")}>
              {supplierData?.isLoading ? (
                <Select.Option
                  disabled={true}
                  key="supplierLoader"
                  value="supplierLoader"
                  label={<CenteredSpin size="small" />}
                  style={styles.option}
                >
                  <CenteredSpin size="small" style={styles.optionLoader} />
                </Select.Option>
              ) : (
                allSuppliers?.map((item: any) => (
                  <Select.Option
                    key={item?.id}
                    value={item?.id}
                    label={item?.id}
                  >
                    {item?.id}
                  </Select.Option>
                ))
              )}
            </Select.OptGroup>
            <Select.OptGroup label={t("Employees.1")}>
              {employeeData?.isLoading ? (
                <Select.Option
                  disabled={true}
                  key="employeeLoader"
                  value="employeeLoader"
                  label={<CenteredSpin size="small" />}
                  style={styles.option}
                >
                  <CenteredSpin size="small" style={styles.optionLoader} />
                </Select.Option>
              ) : (
                allEmployees?.map((item: any) => (
                  <Select.Option
                    key={item?.id}
                    value={item?.id}
                    label={item?.id}
                  >
                    {item?.id}
                  </Select.Option>
                ))
              )}
            </Select.OptGroup>
          </Select>
        </Form.Item>
      </Col> */}
      <Col span={7}>
        <Form.Item
          name="accountName"
          className="margin1"
          rules={[
            {
              required: props?.required ? true : false,
              message: t("Banking.Form.Account_name_required"),
            },
          ]}
        >
          <Select
            placeholder={t("Banking.Form.Account_name")}
            showSearch
            onSearch={onSearch}
            onChange={onChangeAccountName}
            showArrow
            notFoundContent={
              searchAllData?.isFetching || searchAllData.isLoading ? (
                <CenteredSpin size="small" style={styles.spin} />
              ) : undefined
            }
            allowClear={props?.required ? false : true}
            labelInValue
            optionFilterProp="label"
            dropdownRender={(menu) => <div>{menu}</div>}
          >
            <Select.OptGroup label={t("Sales.Customers.1")}>
              {
                bonkData?.map((item: any) => (
                  <Select.Option
                    key={item?.id}
                    value={item?.id}
                    label={item?.name}
                  >
                    {item?.name}
                  </Select.Option>
                ))
              }
            </Select.OptGroup>
            <Select.OptGroup label={t("Sales.Customers.1")}>
              {customerData?.isLoading ? (
                <Select.Option
                  disabled={true}
                  key="supplierLoader"
                  value="supplierLoader"
                  label={<CenteredSpin size="small" />}
                  style={styles.option}
                >
                  <CenteredSpin size="small" style={styles.optionLoader} />
                </Select.Option>
              ) : (
                allCustomers?.map((item: any) => (
                  <Select.Option
                    key={item?.id}
                    value={item?.id}
                    label={item?.name}
                  >
                    {item?.name}
                  </Select.Option>
                ))
              )}
            </Select.OptGroup>
            <Select.OptGroup label={t("Expenses.Suppliers.1")}>
              {supplierData?.isLoading ? (
                <Select.Option
                  disabled={true}
                  key="supplierLoader"
                  value="supplierLoader"
                  label={<CenteredSpin size="small" />}
                  style={styles.option}
                >
                  <CenteredSpin size="small" style={styles.optionLoader} />
                </Select.Option>
              ) : (
                allSuppliers?.map((item: any) => (
                  <Select.Option
                    key={item?.id}
                    value={item?.id}
                    label={item?.name}
                  >
                    {item?.name}
                  </Select.Option>
                ))
              )}
            </Select.OptGroup>
            <Select.OptGroup label={t("Employees.1")}>
              {employeeData?.isLoading ? (
                <Select.Option
                  disabled={true}
                  key="employeeLoader"
                  value="employeeLoader"
                  label={<CenteredSpin size="small" />}
                  style={styles.option}
                >
                  <CenteredSpin size="small" style={styles.optionLoader} />
                </Select.Option>
              ) : (
                allEmployees?.map((item: any) => (
                  <Select.Option
                    key={item?.id}
                    value={item?.id}
                    label={item?.name}
                  >
                    {item?.name}
                  </Select.Option>
                ))
              )}
            </Select.OptGroup>
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
};

const styles = {
  spin: { padding: "7px" },
  optionLoader: { margin: "0px" },
  option: { height: "45px" },
};
