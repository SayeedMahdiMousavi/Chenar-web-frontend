import React, { memo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Input, Space, Tooltip } from 'antd';
import { debounce } from 'throttle-debounce';
import axiosInstance from '../../ApiBaseUrl';
import { useInfiniteQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { CenteredSpin } from '../../SelfComponents/Spin';
import { SearchOutlined } from '@ant-design/icons';
import { useDarkMode } from '../../../Hooks/useDarkMode';
import { InfiniteScrollSelectError } from '../../../components/antd';

const CustomerDetailsShowMore = memo(({ baseUrl }) => {
  const [search, setSearch] = useState('');
  const { t } = useTranslation();
  const [mode] = useDarkMode();
  const location = useLocation();

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
        `${baseUrl}?page=${pageParam}&page_size=15&search=${search}&ordering=-id&status=active&fields=id,full_name,mobile_number`,
      );
      return res.data;
    },
    [baseUrl],
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
    const node = e.target;
    const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
    if (bottom && hasNextPage) {
      fetchNextPage();
    }
  };

  const handleRetry = () => {
    refetch();
  };

  const renderContent = () => {
    if (status === 'loading') {
      return <CenteredSpin size='small' style={styles.spin} />;
    }
    if (status === 'error') {
      return (
        <InfiniteScrollSelectError error={error} handleRetry={handleRetry} />
      );
    }
    return data?.pages?.map((page) => (
      <React.Fragment key={page.nextPageNumber ?? 1}>
        {page.results?.map((item) => (
          <Menu.Item
            className='customer__details__show'
            style={item.mobile_number ? styles.menuItem : styles.margin}
            key={`/customer-details/${item.id}`}
          >
            <Tooltip title={item.full_name?.length > 25 ? item.full_name : ''}>
              <Link to={`/customer-details/${item.id}`}>{item.full_name}</Link>
            </Tooltip>
          </Menu.Item>
        ))}
      </React.Fragment>
    ));
  };

  return (
    <Space direction='vertical' size='small'>
      <Input
        placeholder={t('Sales.Customers.Details.Search_placeholder')}
        onChange={onSearch}
        suffix={<SearchOutlined className='search_icon_color' />}
      />

      <Menu
        mode='vertical'
        theme={mode}
        selectedKeys={[location.pathname]}
        style={{
          height: '65vh',
          overflowY: 'auto',
        }}
        onScroll={handleScrollList}
      >
        {renderContent()}
        {isFetchingNextPage || (isFetching && Boolean(search)) ? (
          <Menu.Item style={{ height: '100px' }}>
            <CenteredSpin size='default' style={styles.spin} />
          </Menu.Item>
        ) : null}
      </Menu>
    </Space>
  );
});

import PropTypes from 'prop-types';

CustomerDetailsShowMore.propTypes = {
  baseUrl: PropTypes.string.isRequired,
};
CustomerDetailsShowMore.displayName = 'CustomerDetailsShowMore';
const styles = {
  menuItem: {
    lineHeight: '20px',
    margin: '0rem',
    padding: ' 5px 15px',
    height: '50px',
  },
  margin: {
    margin: '0rem',
  },
  spin: { padding: '20px' },
};
export default CustomerDetailsShowMore;
