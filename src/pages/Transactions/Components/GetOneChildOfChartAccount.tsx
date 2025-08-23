import React, { useState } from 'react';
import { Col, Form, Row, Select } from 'antd';
import { debounce } from 'throttle-debounce';
import { useInfiniteQuery, useQuery } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import { useTranslation } from 'react-i18next';
import { CenteredSpin } from '../../SelfComponents/Spin';
import { InfiniteScrollSelectError } from '../../../components/antd';

interface IProps {
  searchIn: string;
  baseUrl: string;
  searchKey: string;
  fieldId: string;
  fieldName: string;
  place?: string;
  placeholder?: string;
  onChangeAccountName: (item: string) => void;
  onChangeAccountId: (item: { value: string; label: string }) => void;
}

const getData = async ({ queryKey, pageParam = 1 }: any) => {
  const key = queryKey?.[0];
  const res = await axiosInstance.get(
    `${key}?page=${pageParam}&page_size=10&ordering=-id&status=active`,
  );
  return res.data;
};

export const GetOneChildOfChartAccount: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    status,
  } = useInfiniteQuery([`${props.baseUrl}`], getData, {
    getNextPageParam: (lastPage, pages) => lastPage.nextPageNumber,
    enabled: !!props.baseUrl,
  });

  const getSearchData = React.useCallback(
    async ({ queryKey }: { queryKey: any }) => {
      const { search } = queryKey?.[1];
      const { data } = await axiosInstance.get(
        `/chart_of_account/?page_size=10&name__contains=${search}&ordering=-id&status=active&content_type__model__in=${props.searchIn}`,
      );
      return data;
    },
    [props.searchIn],
  );

  const searchData = useQuery(
    [`${props.searchKey}`, { search }],
    getSearchData,
  );

  const onSearch = (value: string) => {
    debounceFunc(value);
  };

  const debounceFunc = debounce(500, async (value: string) => {
    setSearch(value);
  });

  const onChangeAccountName = (value: { value: string; label: string }) => {
    // props.onChangeAccountName(value?.value);
    setSearch('');
  };

  const loadMore = (e: any) => {
    var node = e.target;
    const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
    if (bottom) {
      if (hasNextPage) {
        fetchNextPage();
      }
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
    <Row gutter={10}>
      <Col span={props?.place === 'report' ? 24 : 7}>
        <Form.Item
          name={props.fieldName}
          className='margin1'
          rules={[
            {
              required: props?.place !== 'report' && true,
              message: t('Banking.Form.Account_name_required'),
            },
          ]}
        >
          <Select
            placeholder={props?.placeholder ?? t('Banking.Form.Account_name')}
            showSearch
            onSearch={onSearch}
            onChange={onChangeAccountName}
            showArrow
            labelInValue
            allowClear={props?.place === 'report' && true}
            optionFilterProp='label'
            onPopupScroll={loadMore}
            filterOption={false}
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
                {menu}
                {isFetchingNextPage || searchData?.isFetching ? (
                  <CenteredSpin size='small' style={styles.spin} />
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
                      disabled={item?.id === 'OXP-502005'}
                    >
                      {item?.name}
                    </Select.Option>
                  ))}
                </React.Fragment>
              ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
};

const styles = {
  spin: { padding: '7px' },
};
