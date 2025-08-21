import React, { useState } from "react";
import { Col, Row, Form, Select } from "antd";
import { debounce } from "throttle-debounce";
import { useQuery } from "react-query";
import axiosInstance from "../../ApiBaseUrl";
import { useTranslation } from "react-i18next";
import { CenteredSpin } from "../../SelfComponents/Spin";

const getExpenseData = async ({ queryKey }: any) => {
  const key = queryKey?.[0];
  const { data } = await axiosInstance.get(`${key}?page=1&page_size=10`);
  return data;
};

const getExpenseSearch = async ({ queryKey }: any) => {
  const search = queryKey?.[1];
  const { data } = await axiosInstance.get(
    `/chart_of_account/?page=1&page_size=10&name__contains=${search}&content_type__model__in=expensetype,widthdraw`
  );
  return data;
};

interface IProps {
  form: any;
}
export const ExpenseAndWithDrawProperties: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [expenses, setExpenses] = useState<any>([]);
  const [withDraws, setWithDraws] = useState<any>([]);

  const onSearch = (value: string) => {
    debounceFuncWarehouse(value);
  };

  const debounceFuncWarehouse = debounce(500, async (value: string) => {
    setSearch(value);
  });

  const expenseData = useQuery(
    `/chart_of_account/IEI-502/child/`,
    getExpenseData
  );
  const withDraw = useQuery(`/chart_of_account/WTC-302/child/`, getExpenseData);
  const searchExpenseData = useQuery(
    [`/chart_of_account/expenseWithDraw/`, search],
    getExpenseSearch
  );

  React.useEffect(() => {
    const expenses = searchExpenseData?.data?.results?.filter((item: any) => {
      const id = item?.id?.split("-");

      return id?.[0] === "OXP";
    });

    const withDraw = searchExpenseData?.data?.results?.filter((item: any) => {
      const id = item?.id?.split("-");
      return id?.[0] === "TAK";
    });
    setExpenses(expenses);
    setWithDraws(withDraw);
  }, [searchExpenseData]);

  const onChangeAccountName = (value: { value: string; label: string }) => {
    props.form.setFieldsValue({ expenseId: value.value });
    setSearch("");
  };
  //when expense code change
  // const onChangeAccountId = (value: string) => {
  //   if (search) {
  //     const newData = searchExpenseData?.data?.find((item: any) => {
  //       return item?.results?.find((item: any) => item.id === value);
  //     });
  //     const expense = newData?.find((item: any) => item?.id === value);
  //     props.form.setFieldsValue({
  //       expenseName: { value: expense?.id, label: expense.name },
  //     });
  //   } else {
  //     const newValue = value.split("-");
  //     if (newValue?.[0] === "OXP") {
  //       const expense = expenseData?.data?.results?.find(
  //         (item: any) => item?.id === value
  //       );
  //       props.form.setFieldsValue({
  //         expenseName: { value: expense?.id, label: expense.name },
  //       });
  //     } else {
  //       const expense = withDraw?.data?.results?.find(
  //         (item: any) => item?.id === value
  //       );
  //       props.form.setFieldsValue({
  //         expenseName: { value: expense?.id, label: expense.name },
  //       });
  //     }
  //   }
  //   setSearch("");
  // };

  const allExpenses = search ? expenses : expenseData?.data?.results;
  const allWithDraws = search ? withDraws : withDraw?.data?.results;
  return (
    <Row gutter={10}>
      {/* <Col span={7}>
        <Form.Item
          name="expenseId"
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
              searchExpenseData?.isFetching ? (
                <CenteredSpin size="small" style={styles.spin} />
              ) : undefined
            }
            dropdownRender={(menu) => (
              <div>
                {expenseData?.isLoading && withDraw?.isLoading ? (
                  <CenteredSpin size="small" style={styles.spin} />
                ) : (
                  menu
                )}
              </div>
            )}
          >
            <Select.OptGroup label={t("Expenses.1")}>
              {allExpenses?.map((item: any) => (
                <Select.Option key={item?.id} value={item?.id} label={item?.id}>
                  {item?.id}
                </Select.Option>
              ))}
            </Select.OptGroup>
            <Select.OptGroup label={t("Expenses.With_draw.1")}>
              {allWithDraws?.map((item: any) => (
                <Select.Option key={item?.id} value={item?.id} label={item?.id}>
                  {item?.id}
                </Select.Option>
              ))}
            </Select.OptGroup>
          </Select>
        </Form.Item>
      </Col> */}
      <Col span={7}>
        <Form.Item
          name="expenseName"
          className="margin1"
          rules={[
            {
              required: true,
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
            labelInValue
            optionFilterProp="label"
            notFoundContent={
              searchExpenseData?.isFetching || searchExpenseData.isLoading ? (
                <CenteredSpin size="small" style={styles.spin} />
              ) : undefined
            }
            dropdownRender={(menu) => <div>{menu}</div>}
          >
            <Select.OptGroup label={t("Expenses.1")}>
              {expenseData?.isLoading ? (
                <Select.Option
                  disabled={true}
                  key="expenseLoader"
                  value="expenseLoader"
                  label={<CenteredSpin size="small" />}
                  style={styles.option}
                >
                  <CenteredSpin size="small" style={styles.optionLoader} />
                </Select.Option>
              ) : (
                allExpenses?.map((item: any) => (
                  <Select.Option
                    key={item?.id}
                    value={item?.id}
                    label={item?.name}
                    disabled={item?.id === "OXP-502005"}
                  >
                    {item?.name}
                  </Select.Option>
                ))
              )}
            </Select.OptGroup>
            <Select.OptGroup label={t("Expenses.With_draw.1")}>
              {withDraw?.isLoading ? (
                <Select.Option
                  disabled={true}
                  key="withdrawLoader"
                  value="withdrawLoader"
                  label={<CenteredSpin size="small" />}
                  style={styles.option}
                >
                  <CenteredSpin size="small" style={styles.optionLoader} />
                </Select.Option>
              ) : (
                allWithDraws?.map((item: any) => (
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
