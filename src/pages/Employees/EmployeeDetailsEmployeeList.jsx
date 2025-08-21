import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Input, Space, Tooltip } from "antd";
import { debounce } from "throttle-debounce";
import axiosInstance from "../ApiBaseUrl";
import { useInfiniteQuery } from "react-query";
import { useTranslation } from "react-i18next";
import { CenteredSpin } from "../SelfComponents/Spin";
import { SearchOutlined } from "@ant-design/icons";
import { useDarkMode } from "../../Hooks/useDarkMode";
import { InfiniteScrollSelectError } from "../../components/antd";
import { EMPLOYEE_DETAILS } from "../../constants/routes";

const EmployeeDetailsEmployeeList = ({ baseUrl }) => {
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
  const [mode] = useDarkMode();
  const location = useLocation();

  // const handleGetSupplier = async ({ queryKey }) => {
  //   const { search } = queryKey?.[1];
  //   const { data } = await axiosInstance.get(
  //     `/supplier_account/supplier/?fields=full_name,id,mobile_number&page_size=15&search=${search}`
  //   );
  //   return data;
  // };
  // const { status, data, isFetching } = useQuery(
  //   [`/supplier_account/supplier/`, { search }],
  //   handleGetSupplier
  // );

  const onSearch = (e) => {
    debounceFunc(e.target.value);
  };

  const debounceFunc = debounce(800, async (value) => {
    setSearch(value);
  });

  const getData = React.useCallback(
    async ({ pageParam = 1, queryKey }) => {
      const search = queryKey?.[1];
      const res = await axiosInstance.get(
        `${baseUrl}?page=${pageParam}&page_size=15&search=${search}&ordering=-id&status=active&fields=id,full_name,mobile_number`
      );
      return res?.data;
    },
    [baseUrl]
  );

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    status,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery([`${baseUrl}infinite/`, search], getData, {
    getNextPageParam: (lastPage, pages) => lastPage.nextPageNumber,
  });

  const handleScrollList = (e) => {
    var node = e.target;
    const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
    if (bottom && hasNextPage) {
      fetchNextPage();
    }
  };

  const handleRetry = () => {
    refetch();
  };

  return (
    <Space direction="vertical" size="small">
      <Input
        style={styles.search}
        placeholder={t("Sales.Customers.Details.Search_placeholder")}
        onChange={onSearch}
        suffix={<SearchOutlined className="search_icon_color" />}
      />

      {status === "loading" ? (
        <CenteredSpin size="small" style={styles.spin} />
      ) : (
        <Menu
          mode="vertical"
          theme={mode}
          selectedKeys={[location.pathname]}
          style={{
            height: "65vh",
            overflowY: "auto",
          }}
          onScroll={handleScrollList}
        >
          {status === "loading" ? (
            <CenteredSpin size="small" style={styles.spin} />
          ) : status !== "error" ? (
            data?.pages?.map((page) => (
              <React.Fragment key={page.nextPageNumber ?? 1}>
                {page?.results?.map((item) => (
                  <Menu.Item
                    className="customer__details__show"
                    style={item.mobile ? styles.menuItem : styles.margin}
                    key={`${EMPLOYEE_DETAILS}/${item?.id}`}
                  >
                    <Tooltip
                      title={
                        item?.full_name?.length > 25 ? item?.full_name : ""
                      }
                      // placement={
                      //   i18n.language === "en" ? "topLeft" : "topRight"
                      // }
                    >
                      <Link to={`${EMPLOYEE_DETAILS}/${item?.id}`}>
                        <span>{item?.full_name}</span>
                        <br />
                        <span>{item?.mobile_number}</span>
                      </Link>
                    </Tooltip>
                  </Menu.Item>
                ))}
              </React.Fragment>
            ))
          ) : (
            <InfiniteScrollSelectError
              error={error}
              handleRetry={handleRetry}
            />
          )}
          {isFetchingNextPage || (isFetching && Boolean(search)) ? (
            <Menu.Item style={{ height: "100px" }}>
              <CenteredSpin size="default" style={styles.spin} />
            </Menu.Item>
          ) : null}
        </Menu>
      )}
    </Space>
  );
};

const styles = {
  menuItem: {
    lineHeight: "20px",
    margin: "0rem",
    padding: " 5px 15px",
    height: "50px",
  },
  margin: {
    margin: "0rem",
  },
  spin: { padding: "20px" },
};
export default EmployeeDetailsEmployeeList;
