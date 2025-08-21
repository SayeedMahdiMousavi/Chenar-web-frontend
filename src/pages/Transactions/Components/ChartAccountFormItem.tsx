import React, { useState } from "react";
import { Form, Select } from "antd";
import { debounce } from "throttle-debounce";
import { useInfiniteQuery, useQuery } from "react-query";
import axiosInstance from "../../ApiBaseUrl";
import { useTranslation } from "react-i18next";
import { CenteredSpin } from "../../SelfComponents/Spin";
import { InfiniteScrollSelectError } from "../../../components/antd";

interface IProps {
  searchIn: string;
  baseUrl: string;
  searchKey: string;
  name?: string;
  place?: string;
  onChangeAccount?: (item: string) => void;
  placeholder?: string;
}

const getData = async ({ pageParam = 1, queryKey }: any) => {
  const key = queryKey?.[0];
  const res = await axiosInstance.get(
    `${key}?page=${pageParam}&page_size=10&ordering=-id&status=active`
  );
  return res.data;
};

export const ChartAccountFormItem: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    status,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery([`${props.baseUrl}`], getData, {
    getNextPageParam: (lastPage, pages) => lastPage.nextPageNumber,
    enabled: !!props.baseUrl,
  });

  const getSearchData = React.useCallback(
    async ({ queryKey }) => {
      const search = queryKey?.[1];
      const { data } = await axiosInstance.get(
        `/chart_of_account/?page_size=10&name__contains=${search}&ordering=-id&status=active&content_type__model__in=${props.searchIn}`
      );
      return data;
    },
    [props.searchIn]
  );

  const searchData = useQuery([`${props.searchKey}`, search], getSearchData);
  const onSearch = (value: string) => {
    debounceFunc(value);
  };
  const debounceFunc = debounce(500, async (value: string) => {
    setSearch(value);
  });

  const onChangeAccount = (value: { value: string; label: string }) => {
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

  //@ts-ignore
  const allData: any[] = search
    ? [{ results: searchData?.data?.results }]
    : Array.isArray(data?.pages)
    ? data?.pages
    : //@ts-ignore
      [{ results: data?.results }];

  const handleRetry = () => {
    refetch();
  };

  return (
    <Form.Item
      name={props.name ? props.name : "accountName"}
      className="margin1"
      rules={[
        {
          required: props?.place !== "report" && true,
          message: t("Banking.Form.Account_name_required"),
        },
      ]}
    >
      <Select
        placeholder={
          props.placeholder ? props.placeholder : t("Banking.Form.Account_name")
        }
        showSearch
        onSearch={onSearch}
        onChange={onChangeAccount}
        showArrow
        labelInValue
        allowClear={props?.place === "report" && true}
        optionFilterProp="label"
        onPopupScroll={loadMore}
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
            {isFetchingNextPage || searchData?.isFetching ? (
              <CenteredSpin size="small" style={styles.spin} />
            ) : null}
          </div>
        )}
      >
        {allData &&
          allData?.map((page: any, index: number) => (
            <React.Fragment key={index}>
              {page?.results?.map((item: any) => (
                <Select.Option
                  key={item?.id}
                  value={item?.id}
                  label={item?.name}
                >
                  {item?.name}
                </Select.Option>
              ))}
            </React.Fragment>
          ))}
      </Select>
    </Form.Item>
  );
};
const styles = {
  spin: { padding: "7px" },
};
