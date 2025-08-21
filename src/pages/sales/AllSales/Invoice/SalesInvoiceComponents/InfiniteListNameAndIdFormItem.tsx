import React, { ReactNode, useState } from "react";
import { Form, Select } from "antd";
import { debounce } from "throttle-debounce";
import { useInfiniteQuery } from "react-query";
import axiosInstance from "../../../../ApiBaseUrl";
import { CenteredSpin } from "../../../../SelfComponents/Spin";
import { InfiniteScrollSelectError } from "../../../../../components/antd";
interface IProps {
  label?: string;
  queryKey: string;
  baseUrl: string;
  style: React.CSSProperties;
  rules?: any;
  fields?: string;
  disabled?: boolean;
  placeholder: string;
  addItem?: ReactNode;
  onChangeName?: (value: any) => void;
}

export const InfiniteListNameAndIdFormItem: React.FC<IProps> = (props) => {
  const [search, setSearch] = useState("");

  const getData = React.useCallback(
    async ({ pageParam = 1, queryKey }) => {
      const search = queryKey?.[1];
      const res = await axiosInstance.get(
        `${props.baseUrl}?page=${pageParam}&page_size=10&search=${search}&ordering=-id&status=active&fields=${props.fields}`
      );
      return res?.data;
    },
    [props.fields, props.baseUrl]
  );

  const onSearch = (value: string) => {
    debounceFunc(value);
  };

  const debounceFunc = debounce(500, async (value: string) => {
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
  } = useInfiniteQuery([props?.queryKey, search], getData, {
    getNextPageParam: (lastPage, pages) => lastPage.nextPageNumber,
  });

  const loadMore = (e: any) => {
    var node = e.target;
    const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
    if (bottom) {
      if (hasNextPage) {
        fetchNextPage();
      }
    }
  };

  const onChangeName = (value: { label: string; value: number }) => {
    setSearch("");
    if (props.onChangeName) {
      const item = data?.pages?.map((item) => {
        return item?.results?.find((item: any) => item.id === value.value);
      });
      const newItem = item?.find((item: any) => item?.id === value.value);
      props.onChangeName(newItem);
    }
  };

  const handleRetry = () => {
    refetch();
  };
  return (
    <Form.Item
      name="account"
      style={props.style}
      rules={props.rules}
      label={props?.label}
    >
      <Select
        placeholder={props.placeholder}
        showSearch
        onSearch={onSearch}
        onChange={onChangeName}
        showArrow
        disabled={props?.disabled}
        optionFilterProp="label"
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
        popupClassName="sales_invoice_customer_popup"
        labelInValue
        onPopupScroll={loadMore}
        dropdownRender={(menu) => (
          <div>
            {props?.addItem}
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
                  key={item.id}
                  value={item?.id}
                  label={item?.full_name}
                >
                  {item?.full_name}
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
