import React, { useState } from "react";
import { Col, Row, Form, Select, ColProps } from "antd";
import { debounce } from "throttle-debounce";
import { useQuery } from "react-query";
import axiosInstance from "../../ApiBaseUrl";
import { useTranslation } from "react-i18next";
import { CenteredSpin } from "../../SelfComponents/Spin";

const getBankData = async ({ queryKey }: any) => {
  const key = queryKey?.[0];
  const { data } = await axiosInstance.get(`${key}?page=1&page_size=10`);
  return data;
};

const getBankSearch = async ({ queryKey }: any) => {
  const search = queryKey?.[1];
  const { data } = await axiosInstance.get(
    `/chart_of_account/?page=1&page_size=10&name__contains=${search}&content_type__model__in=bank,cash`
  );
  return data;
};

interface IProps {
  form: any;
  fieldId: string;
  fieldName: string;
  onChangBankId?: (item: { value: string; label: string }) => void;
  onChangBankName?: (item: string) => void;
  place?: string;
  disabled?: boolean;
  namePlaceholder?: string;
  idPlaceholder?: string;
  colProps?: ColProps;
}
const CashAndBankProperties: React.FC<IProps> = React.memo(
  (props) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState("");
    const [banks, setBanks] = useState<any>([]);
    const [cashes, setCashes] = useState<any>([]);

    const onSearch = (value: string) => {
      debounceFuncWarehouse(value);
    };

    const debounceFuncWarehouse = debounce(500, async (value: string) => {
      setSearch(value);
    });

    const bankData = useQuery(`/chart_of_account/ABN-102/child/`, getBankData);
    const cash = useQuery(`/chart_of_account/ACB-101/child/`, getBankData);
    const searchBankData = useQuery(
      [`/chart_of_account/bankCash/`, search],
      getBankSearch
    );

    const searchLength = searchBankData?.data?.results?.length;
    React.useEffect(() => {
      const banks = searchBankData?.data?.results?.filter((item: any) => {
        const id = item?.id?.split("-");

        return id?.[0] === "BNK";
      });

      const cash = searchBankData?.data?.results?.filter((item: any) => {
        const id = item?.id?.split("-");
        return id?.[0] === "CSH";
      });
      setBanks(banks);
      setCashes(cash);
    }, [searchLength]);

    const onChangeAccountName = (value: any) => {
      if (props.onChangBankName) {
        props.onChangBankName(value?.value);
      }
      setSearch("");
    };

    // const onChangeAccountId = (value: string) => {s
    //   if (value) {
    //     if (
    //       props.place === "report" &&
    //       value === "all" &&
    //       props.onChangBankId
    //     ) {
    //       props.onChangBankId({
    //         value: "all",
    //         label: t("Sales.Product_and_services.All"),
    //       });
    //     } else {
    //       if (search) {
    //         const newData = searchBankData?.data?.find((item: any) => {
    //           return item?.results?.find((item: any) => item?.id === value);
    //         });
    //         const bank = newData?.find((item: any) => item?.id === value);

    //         if (props.onChangBankId) {
    //           props.onChangBankId({ value: bank?.id, label: bank?.name });
    //         }
    //       } else {
    //         const newValue = value?.split("-");
    //         if (newValue?.[0] === "BNK") {
    //           const bank = bankData?.data?.results?.find(
    //             (item: any) => item?.id === value
    //           );
    //           if (props.onChangBankId) {
    //             props.onChangBankId({ value: bank?.id, label: bank?.name });
    //           }
    //         } else {
    //           const bank = cash?.data?.results?.find(
    //             (item: any) => item?.id === value
    //           );

    //           if (props.onChangBankId) {
    //             props.onChangBankId({ value: bank?.id, label: bank?.name });
    //           }
    //         }
    //       }
    //     }
    //   }
    //   setSearch("");
    // };

    const allBanks = search ? banks : bankData?.data?.results;
    const allCashes = search ? cashes : cash?.data?.results;

    return (
      <Row gutter={10}>
        {/* <Col span={props.place === "report" ? 12 : 7}>
          <Form.Item
            name={props.fieldId}
            preserve={false}
            className="margin1"
            rules={[
              {
                required: props.place !== "report" && true,
                message: t("Banking.Form.Account_id_required"),
              },
            ]}
          >
            <Select
              placeholder={
                props.idPlaceholder
                  ? props.idPlaceholder
                  : t("Banking.Form.Account_id")
              }
              showSearch
              onSearch={onSearch}
              onChange={onChangeAccountId}
              showArrow
              filterOption={false}
              disabled={props?.disabled}
              notFoundContent={
                searchBankData?.isFetching ? (
                  <CenteredSpin size="small" style={styles.spin} />
                ) : undefined
              }
              optionFilterProp="label"
              dropdownRender={(menu) => (
                <div>
                  {bankData?.isLoading && cash?.isLoading ? (
                    <CenteredSpin size="small" style={styles.spin} />
                  ) : (
                    menu
                  )}
                </div>
              )}
            >
              {props.place === "report" && (
                <Select.Option
                  key="all"
                  value="all"
                  label={t("Sales.Product_and_services.All")}
                >
                  {t("Sales.Product_and_services.All")}
                </Select.Option>
              )}
              <Select.OptGroup label="Banks">
                {allBanks?.map((item: any) => (
                  <Select.Option
                    key={item?.id}
                    value={item?.id}
                    label={item?.id}
                  >
                    {item?.id}
                  </Select.Option>
                ))}
              </Select.OptGroup>
              <Select.OptGroup label="Cashes">
                {allCashes?.map((item: any) => (
                  <Select.Option
                    key={item?.id}
                    value={item?.id}
                    label={item?.id}
                  >
                    {item?.id}
                  </Select.Option>
                ))}
              </Select.OptGroup>
            </Select>
          </Form.Item>
        </Col> */}
        <Col span={props.place === "report" ? 24 : 7} {...props?.colProps}>
          <Form.Item
            name={props.fieldName}
            preserve={false}
            className="margin1"
            rules={[
              {
                required: props.place !== "report" && true,
                message: t("Banking.Form.Account_name_required"),
              },
            ]}
          >
            <Select
              placeholder={
                props.namePlaceholder
                  ? props.namePlaceholder
                  : t("Banking.Form.Account_name")
              }
              showSearch
              onSearch={onSearch}
              onChange={onChangeAccountName}
              showArrow
              disabled={props?.disabled}
              notFoundContent={
                searchBankData?.isFetching ? (
                  <CenteredSpin size="small" style={styles.spin} />
                ) : undefined
              }
              labelInValue
              optionFilterProp="label"
              dropdownRender={(menu) => (
                <div>
                  {bankData?.isLoading && cash?.isLoading ? (
                    <CenteredSpin size="small" style={styles.spin} />
                  ) : (
                    menu
                  )}
                </div>
              )}
            >
              {props.place === "report" && (
                <Select.Option
                  key="all"
                  value="all"
                  label={t("Sales.Product_and_services.All")}
                >
                  {t("Sales.Product_and_services.All")}
                </Select.Option>
              )}
              <Select.OptGroup label={t("Banking.Banks")}>
                {bankData?.isLoading ? (
                  <Select.Option
                    disabled={true}
                    key="bankLoader"
                    value="bankLoader"
                    label={<CenteredSpin size="small" />}
                    style={styles.option}
                  >
                    <CenteredSpin size="small" style={styles.optionLoader} />
                  </Select.Option>
                ) : (
                  allBanks?.map((item: any) => (
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

              <Select.OptGroup label={t("Banking.Cash_box.1")}>
                {cash?.isLoading ? (
                  <Select.Option
                    disabled={true}
                    key="cashLoader"
                    value="cashLoader"
                    label={<CenteredSpin size="small" />}
                    style={styles.option}
                  >
                    <CenteredSpin size="small" style={styles.optionLoader} />
                  </Select.Option>
                ) : (
                  allCashes?.map((item: any) => (
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
  },
  (prevProps, nextProps) => {
    if (
      // prevProps.onChangBankId !== nextProps.onChangBankId ||
      prevProps.onChangBankName !== nextProps.onChangBankName ||
      prevProps.place !== nextProps.place ||
      prevProps.disabled !== nextProps.disabled ||
      prevProps.namePlaceholder !== nextProps.namePlaceholder ||
      prevProps.idPlaceholder !== nextProps.idPlaceholder ||
      prevProps.fieldId !== nextProps.fieldId ||
      prevProps.fieldName !== nextProps.fieldName
    ) {
      return false;
    }
    return true;
  }
);
const styles = {
  spin: { padding: "7px" },
  optionLoader: { margin: "0px" },
  option: { height: "45px" },
};

export default CashAndBankProperties;
