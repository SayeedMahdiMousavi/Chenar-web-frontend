import React, { ReactNode, useState } from 'react';
import { Select, Form, Avatar, Row, Col, Typography } from 'antd';
import { debounce } from 'throttle-debounce';
import { useInfiniteQuery } from 'react-query';
import axiosInstance from '../../pages/ApiBaseUrl';
import { CenteredSpin } from '../../pages/SelfComponents/Spin';
import { fixedNumber, math, print } from '../../Functions/math';
import { useTranslation } from 'react-i18next';
import { InfiniteScrollSelectError } from '.';

interface IProps {
  queryKey?: string;
  baseUrl: string;
  fields: string;
  onChange?: (value: any) => void;
  onDeselect?: (value: any) => void;
  disabledOption?: (value: any) => boolean;
  onClear?: () => void;
  mode?: 'multiple' | 'tags' | undefined;
  placeholder?: string;
  allowClear?: boolean;
  style?: React.CSSProperties;
  rules?: any;
  name: string | (string | number)[];
  label?: string | ReactNode;
  maxTagCount?: number | 'responsive';
  addItem?: ReactNode;
  className?: string;
  bordered?: boolean;
  place?: string;
  dropdownMatchSelectWidth?: boolean;
  validateTrigger?: string[];
  fieldKey?: (string | number)[];
  disabled?: boolean;
}

const InfiniteScrollSelectFormItem: React.FC<IProps> = React.memo(
  (props) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');

    const getData = React.useCallback(
      // @ts-ignore
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
      status,
      isFetchingNextPage,
      refetch,
    } = useInfiniteQuery(
      [props?.queryKey ? props?.queryKey : `${props.baseUrl}infinite/`, search],
      getData,
      {
        getNextPageParam: (lastPage, pages) => lastPage.nextPageNumber,
      }
    );

    const loadMore = (e: any) => {
      var node = e.target;
      const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
      if (bottom && hasNextPage) {
        // const nextPage = data?.[data?.length - 1]?.nextPageNumber;
        // if (nextPage === null) {
        //   return;
        // } else {

        fetchNextPage();

        // }
      }
    };
    const handleChangeSelect = (value: any) => {
      if (props?.place === 'dashboard' && props.onChange) {
        const currencyPart = data?.pages?.map((item) => {
          return item?.results?.find((item: any) => item.id === value?.value);
        });
        const currency = currencyPart?.find(
          (item: any) => item?.id === value.value
        );
        const currencyRate = fixedNumber(
          print(
            //@ts-ignore
            math.evaluate(
              `(${currency?.base_amount})/ ${currency?.equal_amount}`
            )
          ),
          20
        );
        props.onChange({ ...currency, currencyRate });
      } else if (props.onChange) {
        props.onChange(value);
      }
      setSearch('');
    };

    const label =
      props.name === 'customer' ||
      props.name === 'supplier' ||
      props.name === 'employee'
        ? 'full_name'
        : props?.name === 'id'
        ? 'id'
        : 'name';

    const handleRetry = () => {
      refetch();
    };

    return (
      <Form.Item
        name={props.name}
        label={props?.label}
        style={props.style}
        rules={props?.rules}
        validateTrigger={props?.validateTrigger}
        fieldKey={props?.fieldKey}
      >
        <Select
          mode={props.mode}
          showSearch
          onSearch={onSearch}
          onChange={handleChangeSelect}
          onClear={props?.onClear}
          onDeselect={props?.onDeselect}
          placeholder={props?.placeholder}
          suffixIcon={null}
          disabled={props?.disabled}
          filterOption={false}
          className={props?.className}
          variant={props?.bordered ? 'outlined' : 'filled'}
          optionLabelProp='label'
          optionFilterProp='label'
          popupClassName='sales_invoice_customer_popup'
          allowClear={props.allowClear}
          labelInValue
          maxTagCount={props?.maxTagCount}
          popupMatchSelectWidth={props?.dropdownMatchSelectWidth}
          onPopupScroll={loadMore}
          notFoundContent={
            status === 'loading' ? (
              <CenteredSpin size='small' style={styles.spin} />
            ) : status !== 'error' ? undefined : (
              <InfiniteScrollSelectError
                error={error}
                handleRetry={handleRetry}
              />
            )
          }
          dropdownRender={(menu) => (
            <div>
              {Boolean(props?.addItem) && props?.addItem}
              {menu}
              {isFetchingNextPage || (isFetching && Boolean(search)) ? (
                <CenteredSpin size='small' style={styles.spin} />
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
                    // label={item?.[`${label}`]}
                    label={
                      props?.baseUrl === '/currency/active_currency_rate/'
                        ? t(`Reports.${item?.symbol}`)
                        : item?.[`${label}`]
                    }
                    disabled={
                      props?.disabledOption && props?.disabledOption(item)
                    }
                  >
                    {props?.place === 'currencyHistory' &&
                    props?.name === 'currency' ? (
                      <Row justify='space-between' align='middle' gutter={5}>
                        <Col>{item.name}</Col>
                        {/* <Col>{t(`${item.symbol}`)}</Col> */}
                        <Col style={{ width: '60px' }}>
                          <Typography.Text type='secondary'>
                            {item?.is_active
                              ? t('Sales.Product_and_services.Active')
                              : t('Sales.Product_and_services.Inactive')}
                          </Typography.Text>
                        </Col>
                      </Row>
                    ) : props?.name === 'units' ||
                      props?.name === 'currency' ? (
                      <div>
                        {props?.place !== 'dashboard' && (
                          <Avatar
                            size='small'
                            style={{ background: '#10899e' }}
                          >
                            {item.symbol}
                          </Avatar>
                        )}{' '}
                        {/* {item.name} */}
                        {props?.name === 'units'
                          ? item?.name
                          : t(`Reports.${item.symbol}`)}
                      </div>
                    ) : props?.baseUrl === '/currency/active_currency_rate/' ? (
                      t(`Reports.${item.symbol}`)
                    ) : (
                      item?.[`${label}`]
                    )}
                  </Select.Option>
                ))}
              </React.Fragment>
            ))}
        </Select>
      </Form.Item>
    );
  },

  (prevProps, nextProps) => {
    if (
      prevProps.queryKey !== nextProps.queryKey ||
      prevProps.fields !== nextProps.fields ||
      prevProps.onChange !== nextProps.onChange ||
      prevProps.name !== nextProps.name ||
      prevProps.mode !== nextProps.mode ||
      prevProps.placeholder !== nextProps.placeholder ||
      prevProps.dropdownMatchSelectWidth !==
        nextProps.dropdownMatchSelectWidth ||
      prevProps.place !== nextProps.place ||
      prevProps.bordered !== nextProps.bordered ||
      prevProps.className !== nextProps.className ||
      prevProps.maxTagCount !== nextProps.maxTagCount ||
      prevProps.label !== nextProps.label ||
      prevProps.allowClear !== nextProps.allowClear ||
      prevProps.onClear !== nextProps.onClear ||
      prevProps.disabledOption !== nextProps.disabledOption ||
      prevProps.onDeselect !== nextProps.onDeselect ||
      prevProps.disabled !== nextProps.disabled ||
      prevProps.baseUrl !== nextProps.baseUrl
    ) {
      return false;
    }
    return true;
  }
);

const styles = {
  spin: { padding: '7px' },
  formItem: { margin: '0px' },
};

export default InfiniteScrollSelectFormItem;
