import { Alert, Carousel, Col, Row, Spin } from "antd";
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import EmptyFile from "./Empty";
import ProductItem from "./ProductItem";
import chunk from "lodash/chunk";
import { useMediaQuery } from "../../../MediaQurey";
import { Offline } from "react-detect-offline";
import { useQuery, useQueryClient, useMutation } from "react-query";
import axiosInstance from "../../../ApiBaseUrl";
import RetryButton from "../../../SelfComponents/RetryButton";
const fields =
  "id,name,barcode,photo,is_pine,is_have_vip_price,product_units,unit_conversion,price,product_barcode,vip_price,product_statistic";
const baseUrl = "/product/items/";
const endUrl =
  "status=active&expand=product_units,product_units.unit,unit_conversion,unit_conversion.unit,price,price.unit,product_barcode,product_barcode.unit,vip_price";

const AllProductItemsWithFilters = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const isMonitor = useMediaQuery("(max-width:1864px)");
  const isComputer = useMediaQuery("(max-width:1598px)");
  const isMiniComputer = useMediaQuery("(max-width:1331px)");
  const isTablet = useMediaQuery("(max-width:1067px)");
  const isMiniTablet = useMediaQuery("(max-width:800px)");

  const [bestSellingData, setBestSellingData] = useState([]);
  const [pinProductsData, setPinProductsData] = useState([]);
  const [isProductListScroll, setIsProductListScroll] = useState(true);

  useEffect(() => {
    if (!props.visible) {
      const element = document.getElementById("posProductList");
      if (element) {
        const b = element.scrollHeight > element.clientHeight;
        setIsProductListScroll(b);
      }
    }
    // const b = productListRef.scrollHeight() > productListRef.clientHeight();
  }, [props.visible]);

  const getBestSelling = useCallback(async (key) => {
    const { data } = await axiosInstance.get(
      `${baseUrl}best_selling/?page=1&page_size=12&${endUrl}&fields=${fields}`
    );

    return data;
  }, []);

  const bestSelling = useQuery(`${baseUrl}best_selling/`, getBestSelling);
  const bestSellingList = bestSelling?.data?.results;
  useEffect(() => {
    const bestSellingData = chunk(
      bestSellingList,
      isMiniTablet
        ? 2
        : isTablet
        ? 3
        : isMiniComputer
        ? 4
        : isComputer
        ? 5
        : isMonitor
        ? 6
        : 7
    );

    setBestSellingData(bestSellingData);
  }, [
    bestSellingList,
    isMiniComputer,
    isComputer,
    isMonitor,
    isTablet,
    isMiniTablet,
  ]);

  const handleRetryBest = () => {
    bestSelling.refetch();
  };

  const getPinProducts = useCallback(async () => {
    const { data } = await axiosInstance.get(
      `${baseUrl}?is_pine=true&page=1&page_size=20&${endUrl}&fields=${fields}`
    );
    return data;
  }, []);

  const pinProducts = useQuery(`${baseUrl}pin/`, getPinProducts);
  const pinProductsList = pinProducts?.data?.results;
  useEffect(() => {
    const pinProducts1 = chunk(
      pinProductsList,
      isMiniTablet
        ? 4
        : isTablet
        ? 6
        : isMiniComputer
        ? 8
        : isComputer
        ? 10
        : isMonitor
        ? 12
        : 14
    );
    setPinProductsData(pinProducts1);
  }, [
    isMiniComputer,
    isComputer,
    isMonitor,
    isTablet,
    isMiniTablet,
    pinProductsList,
  ]);

  const handleRetryPin = () => {
    pinProducts.refetch();
  };

  const getSearchProduct = async ({ queryKey }) => {
    const { search } = queryKey?.[1] || {};
    const { data } = await axiosInstance.get(
      `${baseUrl}?&page=1&page_size=12&search=${search}&status=active&fields=id,name,is_pine,photo`
    );
    return data;
  };

  const { data, isLoading, isFetching, isError, refetch } = useQuery(
    [`product/pos/search/`, { search: props.search }],
    getSearchProduct,
    { enabled: !!props?.search }
  );

  const handleRetrySearch = () => {
    refetch();
  };

  const handelStopPropagation = () => {};

  const { mutate: mutatePine } = useMutation(
    async (value) =>
      await axiosInstance.patch(`${baseUrl}${value?.id}/`, value.value),
    {
      onMutate: async (value) => {
        if (value.type === "category") {
          return;
        } else {
          await queryClient.cancelQueries(
            value.type === "search"
              ? [`product/pos/search/`, { search: props?.search }]
              : value.type === "best"
              ? `${baseUrl}best_selling/`
              : `${baseUrl}pin/`
          );
          const previousValue = queryClient.getQueryData(
            value.type === "search"
              ? [`product/pos/search/`, { search: props?.search }]
              : value.type === "best"
              ? `${baseUrl}best_selling/`
              : `${baseUrl}pin/`
          );

          queryClient.setQueryData(
            value.type === "search"
              ? [`product/pos/search/`, { search: props?.search }]
              : value.type === "best"
              ? `${baseUrl}best_selling/`
              : `${baseUrl}pin/`,
            (prev) => {
              const newPin =
                value.type === "pin"
                  ? prev?.results?.filter((item) => item?.id !== value?.id)
                  : prev?.results?.map((item) => {
                      if (item?.id === value.id) {
                        return {
                          ...item,
                          is_pine: item?.is_pine ? false : true,
                        };
                      } else {
                        return item;
                      }
                    });

              return { ...prev, results: newPin };
            }
          );
          return previousValue;
        }
      },

      onError: (err, variables, previousValue) => {
        queryClient.setQueryData(
          variables.type === "search"
            ? [`product/pos/search/`, { search: props?.search }]
            : variables.type === "best"
            ? `${baseUrl}best_selling/`
            : `${baseUrl}pin/`,
          previousValue
        );
      },

      // onSuccess: (previousValue) => {
      //   queryClient.invalidateQueries(`${baseUrl}pin/`);
      //   // queryClient.invalidateQueries(`product/pos/search/`);
      //   queryClient.invalidateQueries(`${baseUrl}best_selling/`);
      // },
      onSettled: () => {
        queryClient.refetchQueries(`${baseUrl}pin/`);
        // queryClient.refetchQueries(`product/pos/search/`);
        queryClient.refetchQueries(`${baseUrl}best_selling/`);
      },
    }
  );

  const changePinProduct = (data, id, type) => {
    if (type === "pin" || type === "best") {
      const newPin = data?.map((item) => {
        return item?.map((item1) => {
          if (item1?.id === id) {
            // const data = { ...item1, is_pine: false };
            return { ...item1, is_pine: item1?.is_pine ? false : true };
          } else {
            return item1;
          }
        });
      });
      return newPin;
    } else {
      const newPin = data?.map((item) => {
        if (item?.id === id) {
          // const data = { ...item, is_pine: false };
          return { ...item, is_pine: item?.is_pine ? false : true };
        } else {
          return item;
        }
      });
      return newPin;
    }
  };

  let Inactive = false;
  const onChangePin = React.useCallback(
    async (id, is_pine, type) => {
      if (type === "category") {
        props.setCategories((prev) => {
          const newPin = changePinProduct(prev, id, type);
          return newPin;
        });
      } else {
        props.setProducts((prev) => {
          const newPin = changePinProduct(prev, id, type);
          return newPin;
        });
      }

      if (Inactive) {
        return;
      }
      Inactive = true;

      try {
        mutatePine({
          value: { is_pine: is_pine ? false : true },
          id: id,
          type,
        });

        Inactive = false;
      } catch (info) {
        // 
        Inactive = false;
      }
    },
    [Inactive]
  );

  return (
    <Row style={{ paddingBottom: "20px" }}>
      <Col span={24}>
        {(props.categories && props.search) || props.search ? (
          <Row style={styles.categoryProducts}>
            {isLoading ? (
              <Col span={24}>
                <Spin>
                  <EmptyFile class="market_invoice_empty" />
                </Spin>
              </Col>
            ) : isError ? (
              <RetryButton handleRetry={handleRetrySearch} />
            ) : data?.results?.length > 0 ? (
              <Col span={24}>
                <Spin
                  spinning={isFetching ? true : props.searchLoading}
                  onClick={handelStopPropagation}
                >
                  <Row gutter={[10, 15]}>
                    {data?.results?.map((item) => (
                      <Col
                        style={styles.productItem(isProductListScroll)}
                        key={item?.id}
                        onClick={() => props.onClickProduct(item, "search")}
                      >
                        <ProductItem
                          name={item?.name}
                          id={item?.id}
                          photo={item?.photo}
                          isPine={item?.is_pine}
                          type="search"
                          onChangePin={onChangePin}
                        />
                      </Col>
                    ))}
                  </Row>
                </Spin>
              </Col>
            ) : (
              <Col span={24}>
                <EmptyFile class="market_invoice_empty" />
              </Col>
            )}
          </Row>
        ) : props.category !== "" ? (
          <Row gutter={[10, 15]} style={styles.categoryProducts}>
            {props.productCategoryLoading ? (
              <Col span={24}>
                <Spin style={{ width: "100%" }}>
                  <EmptyFile class="market_invoice_empty" />
                </Spin>
              </Col>
            ) : props.categories?.length > 0 ? (
              props?.categories?.map((item) => (
                <Col
                  style={styles.productItem(isProductListScroll)}
                  key={item?.id}
                  onClick={() => props.onClickProduct(item, "category")}
                >
                  <ProductItem
                    name={item?.name}
                    id={item?.id}
                    photo={item?.photo}
                    isPine={item?.is_pine}
                    type="category"
                    onChangePin={onChangePin}
                  />
                </Col>
              ))
            ) : (
              <Col span={24}>
                <EmptyFile class="market_invoice_empty" />
              </Col>
            )}
          </Row>
        ) : (
          <Row gutter={[0, 10]}>
            <Col span={24} style={{ marginBottom: "10px" }}>
              <Row>
                <Col span={1} className="market_invoice_product_menu_title">
                  {t("Sales.All_sales.Invoice.PIN")}
                </Col>
                <Col span={23}>
                  {" "}
                  <Carousel
                    dots={{ className: "market_carousel" }}
                    effect="fade"
                  >
                    {pinProducts.isLoading ? (
                      <Col span={24}>
                        <Spin>
                          <EmptyFile class="market_invoice_empty" />
                        </Spin>
                      </Col>
                    ) : pinProducts.isError &&
                      pinProducts?.data?.results === undefined ? (
                      <RetryButton handleRetry={handleRetryPin} />
                    ) : pinProductsData?.length > 0 ? (
                      pinProductsData?.map((item, index) => (
                        <div key={index}>
                          <Row gutter={[10, 15]} style={styles.productItems}>
                            {item?.map((item1) => (
                              <Col
                                style={styles.productItem(isProductListScroll)}
                                key={item1.id}
                                onClick={() =>
                                  props.onClickProduct(item1, "pin")
                                }
                              >
                                <ProductItem
                                  name={item1?.name}
                                  id={item1?.id}
                                  photo={item1?.photo}
                                  isPine={item1?.is_pine}
                                  type="pin"
                                  onChangePin={onChangePin}
                                />
                              </Col>
                            ))}
                          </Row>
                        </div>
                      ))
                    ) : (
                      <Col span={24}>
                        <EmptyFile class="" />
                      </Col>
                    )}
                  </Carousel>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row>
                <Col span={1} className="market_invoice_product_menu_title">
                  {t("Sales.All_sales.Invoice.BEST")}
                </Col>
                <Col span={23}>
                  {" "}
                  <Carousel
                    dots={{ className: "market_carousel" }}
                    effect="fade"
                  >
                    {bestSelling.isLoading ? (
                      <Col span={24}>
                        <Spin>
                          <EmptyFile class="market_invoice_empty" />
                        </Spin>
                      </Col>
                    ) : bestSellingData.isError &&
                      bestSellingData?.data?.results === undefined ? (
                      <RetryButton handleRetry={handleRetryBest} />
                    ) : bestSellingData.length > 0 ? (
                      bestSellingData?.map((item, index) => (
                        <div key={index}>
                          <Row gutter={[10, 15]} style={styles.productItems}>
                            {item?.map((item1) => (
                              <Col
                                style={styles.productItem(isProductListScroll)}
                                key={item1.id}
                                onClick={() =>
                                  props.onClickProduct(item1, "best")
                                }
                              >
                                <ProductItem
                                  name={item1?.name}
                                  id={item1?.id}
                                  photo={item1?.photo}
                                  isPine={item1?.is_pine}
                                  type="best"
                                  onChangePin={onChangePin}
                                />
                              </Col>
                            ))}
                          </Row>
                        </div>
                      ))
                    ) : (
                      <Col span={24}>
                        <EmptyFile class="" />
                      </Col>
                    )}
                  </Carousel>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </Col>

      <Col span={24} style={styles.alertBody}>
        <Offline>
          {" "}
          <Alert
            type="error"
            message={
              <span className="internet_error">
                {t("Internet.No_internet_message")}
              </span>
            }
            style={styles.alert}
            banner
          />
        </Offline>
      </Col>
    </Row>
  );
};

const styles = {
  alert: {
    width: "100%",
    height: "30px",
    fontSize: "11px",
    fontWeight: "bold",
  },
  alertBody: { position: "absolute", bottom: "0px", width: "100%" },
  productItems: { paddingInlineEnd: "10px" },
  productItem: (scroll) => ({ width: scroll ? "114px" : "117px" }),

  categoryProducts: { padding: "0px 20px" },
};

export const AllProductItemsWithFilters1 = React.memo(
  AllProductItemsWithFilters,
  (prevProps, nextProps) => {
    if (
      prevProps.categories.length !== nextProps.categories.length ||
      prevProps.visible !== nextProps.visible ||
      prevProps.category !== nextProps.category ||
      prevProps.search !== nextProps.search ||
      prevProps.productCategoryLoading !== nextProps.productCategoryLoading ||
      prevProps.setCategories !== nextProps.setCategories ||
      prevProps.onClickProduct !== nextProps.onClickProduct ||
      prevProps.searchLoading !== nextProps.searchLoading
    ) {
      return false;
    } else {
      return true;
    }
  }
);
