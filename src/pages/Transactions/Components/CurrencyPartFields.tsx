import React, { useState } from "react";
import { Col, Row, Form, Select, InputNumber, Avatar } from "antd";
import { debounce } from "throttle-debounce";
import { useInfiniteQuery } from "react-query";
import axiosInstance from "../../ApiBaseUrl";
import { useTranslation } from "react-i18next";
import { CenteredSpin } from "../../SelfComponents/Spin";
import { print, math, fixedNumber } from "../../../Functions/math";
import useGetBaseCurrency from "../../../Hooks/useGetBaseCurrency";
import { InfiniteScrollSelectError } from "../../../components/antd";

interface IProps {
  form: any;
  type: string;
  currency: string;
  responseId?: boolean;
  currencyValue: number;
  setCurrencyValue: (value: number) => void;
  onChangeCurrency?: (value: any) => void;
  onChangeCurrencyRate?: (value: any) => void;
}

const getCurrencies = async ({ pageParam = 1, queryKey }: any) => {
  const search = queryKey?.[1];
  const res = await axiosInstance.get(
    `/currency/active_currency_rate/?page=${pageParam}&page_size=10&search=${search}`
  );

  return res?.data;
};

export const CurrencyPartFields: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  //get base currency
  const baseCurrency = useGetBaseCurrency();
  const baseCurrencyId = baseCurrency?.data?.id;

  const onSearchCurrency = (value: string) => {
    debounceFuncCurrency(value);
  };

  const debounceFuncCurrency = debounce(500, async (value: string) => {
    setSearch(value);
  });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery(
    ["/currency/active_currency_rate/infinite/", search],
    getCurrencies,
    {
      getNextPageParam: (lastPage, pages) => lastPage.nextPageNumber,
      refetchOnWindowFocus:false
    }
  );

  const onChangeCurrency = (value: { label: string; value: number }) => {
    props.setCurrencyValue(value.value);
    const row = props.form.getFieldsValue();
    const currency = data?.pages?.map((item) => {
      return item?.results?.find((item: any) => item.id === value?.value);
    });
    const newCurrency = currency?.find((item: any) => item?.id === value.value);
    const currencyRate = fixedNumber(
      print(
        //@ts-ignore
        math.evaluate(
          `(${newCurrency?.base_amount})/ ${newCurrency?.equal_amount}`
        )
      ),
      20
    );
    const amount = row?.amount ?? 0;
    if (props.onChangeCurrency) {
      props.onChangeCurrency(newCurrency);
    }
    if (props.currency === "calCurrency") {
      const currencyRate1 = row?.currencyRate ?? 1;
      props.form.setFieldsValue({
        calCurrencyRate: parseFloat(currencyRate.toFixed(4)),
        calAmount: fixedNumber(
          print(
            //@ts-ignore
            math.evaluate(`(${amount}*${currencyRate1})/ ${currencyRate}`)
          ),
          4
        ),
      });
    } else if (props?.type !== "invoice") {
      if (row.calCurrency) {
        const calCurrencyRate = row?.calCurrencyRate ?? 1;

        props.form.setFieldsValue({
          currencyRate: parseFloat(currencyRate.toFixed(4)),
          calAmount: fixedNumber(
            print(
              //@ts-ignore
              math.evaluate(`(${amount}*${currencyRate})/ ${calCurrencyRate}`)
            )
          ),
        });
      } else {
        props.form.setFieldsValue({
          currencyRate: parseFloat(currencyRate.toFixed(4)),
        });
      }
    }
    setSearch("");
  };

  const loadMore = (e: any) => {
    var node = e.target;
    const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
    if (bottom) {
      // const nextPage = data?.[data?.length - 1]?.nextPageNumber;
      // if (nextPage === null) {
      //   return;
      // } else {
      if (hasNextPage) {
        fetchNextPage();
      }
      // }
    }
  };

  const onChangeCurrencyRate = (value: any) => {
    debounceChangeCurrencyRate(value ?? 1);
  };

  const debounceChangeCurrencyRate = debounce(500, async (value: string) => {
    const newValue = value === "" ? 1 : value;

    if (props.currency === "calCurrency") {
      const row = props.form.getFieldsValue();

      props.form.setFieldsValue({
        calAmount: fixedNumber(
          print(
            //@ts-ignore
            math.evaluate(`(${row?.amount}*${row?.currencyRate})/ ${newValue}`)
          ),
          4
        ),
      });
    } else {
      const row = props.form.getFieldsValue();

      if (props.currency !== "calCurrency" && props.onChangeCurrencyRate) {
        props.onChangeCurrencyRate(row.currencyRate);
      }

      if (row.calCurrency) {
        props.form.setFieldsValue({
          calAmount: fixedNumber(
            print(
              //@ts-ignore
              math.evaluate(
                `(${row.amount}*${newValue})/ ${row.calCurrencyRate}`
              )
            ),
            4
          ),
        });
      }
    }
  });

  const onChangeAmount = (value: any) => {
    debounceChangeAmount(value);
  };

  const debounceChangeAmount = debounce(500, async (value: string) => {
    if (props.currency !== "calCurrency") {
      const row = props.form.getFieldsValue();
      if (row.calCurrency) {
        props.form.setFieldsValue({
          calAmount: fixedNumber(
            //@ts-ignore
            print(
              //@ts-ignore
              math.evaluate(
                `(${value}*${row.currencyRate})/ ${row.calCurrencyRate}`
              )
            ),
            4
          ),
        });
      }
    }
  });

  const onFocusAmount = (e: any) => {
    e.target.select();
  };

  const handleRetry = () => {
    refetch();
  };
  return (
    <Row gutter={10}>
      {props.type === "openAccount" ? null : (
        <Col span={7}>
          <Form.Item
            name={props.currency === "calCurrency" ? "calAmount" : "amount"}
            className="margin1"
            rules={[
              {
                required: true,
                message: t("Sales.Customers.Form.Amount_required"),
              },
            ]}
          >
            <InputNumber
              placeholder={t("Sales.Customers.Form.Amount")}
              type="number"
              className="num"
              inputMode="numeric"
              onFocus={onFocusAmount}
              onChange={onChangeAmount}
              min={1}
              readOnly={props.currency === "calCurrency" ? true : false}
            />
          </Form.Item>
        </Col>
      )}
      <Col span={props.type === "openAccount" ? 12 : 10}>
        {" "}
        <Form.Item
          name={props.currency === "calCurrency" ? "calCurrency" : "currency"}
          className="margin1"
          rules={[
            {
              required: true,
              message: t(
                "Sales.Product_and_services.Currency.Currency_required"
              ),
            },
          ]}
        >
          <Select
            placeholder={t("Sales.Product_and_services.Inventory.Currency")}
            showSearch
            onSearch={onSearchCurrency}
            onChange={onChangeCurrency}
            showArrow
            disabled={props?.responseId}
            labelInValue
            onPopupScroll={loadMore}
            optionFilterProp="label"
            optionLabelProp="label"
            // defaultOpen
            notFoundContent={
              status === "loading" ? (
                <CenteredSpin size="small" style={styles.spin} />
              ) : status !== "error" ? undefined : (
                <InfiniteScrollSelectError
                  error={error}
                  handleRetry={handleRetry}
                />
              )
            }
            dropdownRender={(menu) => (
              <div>
                {menu}
                {isFetchingNextPage || (isFetching && Boolean(search)) ? (
                  <CenteredSpin size="small" style={styles.spin} />
                ) : null}
              </div>
            )}
          >
            {data &&
              data?.pages?.map((page: any) => (
                <React.Fragment key={page.nextPageNumber ?? 1}>
                  {page?.results?.map((item: any) => (
                    <Select.Option
                      key={item?.id}
                      value={item?.id}
                      // label={item?.name}
                      label={t(`Reports.${item.symbol}`)}
                      // isSelectOption={props?.currency === item?.name}
                    >
                      <div>
                        <Avatar size="small" style={{ background: "#10899e" }}>
                          {item.symbol}
                        </Avatar>{" "}
                        {/* {item.name} */}
                        {t(`Reports.${item?.symbol}`)}
                      </div>
                    </Select.Option>
                  ))}
                </React.Fragment>
              ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={props.type === "openAccount" ? 12 : 7}>
        <Form.Item
          name={
            props.currency === "calCurrency"
              ? "calCurrencyRate"
              : "currencyRate"
          }
          className="margin1"
          rules={[
            {
              required: true,
              message: t(
                "Sales.Product_and_services.Currency.Currency_rate_required"
              ),
            },
          ]}
        >
          <InputNumber
            type="number"
            className="num"
            inputMode="numeric"
            min={0}
            readOnly={Boolean(props?.responseId)}
            onFocus={onFocusAmount}
            onChange={onChangeCurrencyRate}
            disabled={props.currencyValue !== baseCurrencyId ? false : true}
            placeholder={t("Sales.Product_and_services.Currency.Currency_rate")}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

const styles = {
  spin: { padding: "7px" },
};
