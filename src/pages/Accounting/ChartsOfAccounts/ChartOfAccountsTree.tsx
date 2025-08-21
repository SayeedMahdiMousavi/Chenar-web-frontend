import React, { useState } from 'react';
import { Tree, Input, Button, Tooltip, Empty } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../ApiBaseUrl';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { CenteredSpin } from '../../SelfComponents/Spin';
import RetryButton from '../../SelfComponents/RetryButton';
const { Search } = Input;

const x = 3;
const y = 2;
const z = 1;
const gData: any = [];

const generateData = (_level: any, _preKey: any, _tns: any) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
//@ts-ignore
generateData(z);

const dataList: any = [];
const generateList = (data: any) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key } = node;
    dataList.push({ key, title: key });
    if (node.children) {
      generateList(node.children);
    }
  }
};
generateList(gData);

const updateTreeData = (list: any, value: any, children: any) => {
  return list?.map((node: any) => {
    if (node.value === value) {
      return {
        ...node,
        children: children,
      };
    } else if (node.children?.[0]) {
      return {
        ...node,
        children: updateTreeData(node.children, value, children),
      };
    }

    return node;
  });
};

interface IProps {}
const ChartsOfAccounts: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>();
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [search, setSearch] = useState('');
  const [allSearchData, setAllSearchData] = useState([]);
  const [{ treeData, status }, setTreeData] = useState({
    treeData: [],
    status: 'idle',
  });

  React.useEffect(() => {
    if (status === 'idle' && treeData?.length === 0) {
      (async () => {
        setTreeData((prev) => {
          return { ...prev, status: 'pending' };
        });
        await axiosInstance
          .get(`/chart_of_account/get_root_category/`)
          .then((res) => {
            const allData = res?.data?.map((item: any) => {
              const data = {
                key: item.id,
                title: t(`${item.account_type}`),
                value: item.id,
                children: [],
              };

              return data;
            });

            setTreeData((prev) => {
              return { ...prev, status: 'resolved', treeData: allData };
            });
          })
          .catch((error) => {
            if (error.response) {
              setTreeData((prev) => {
                return { ...prev, status: 'rejected' };
              });
            }
          })
          .finally(() => {
            // setTreeData((prev) => {
            //   return { ...prev, status: "rejected" };
            // });
          });
      })();
    }
  }, [status, treeData]);

  const handleRetry = () => {
    setTreeData((prev) => {
      return { ...prev, status: 'idle' };
    });
  };

  const onExpandTable = async (node: any) => {
    // setLoading(true);
    // if (!expanded) {
    //   setLoading(false);
    // }

    const { value } = node.props;
    const { data } = await axiosInstance.get(
      `/chart_of_account/${value}/child/?page=1&page_size=10`
    );

    return new Promise((resolve) => {
      if (node.children?.[0]) {
        //@ts-ignore
        resolve();
        // setLoading(false);
        return;
      }
      console.log('datadatadatadatadatadatadatadata', data);
      const data3 = data?.results?.map((item: any) => {
        const data = {
          key: item.id,
          title:
            item?.id === 'ACU-103' ? (
              <Link style={styles.linkItem} to='/customer'>
                {item.name}
              </Link>
            ) : item.id === 'APR-105' ? (
              <Link style={styles.linkItem} to='/product'>
                {item.name}
              </Link>
            ) : item.id === 'LST-203' ? (
              <Link style={styles.linkItem} to='/employee'>
                {item.name}
              </Link>
            ) : item.id === 'LSU-201' ? (
              <Link style={styles.linkItem} to='/supplier'>
                {item.name}
              </Link>
            ) : (
              item?.name
            ),
          value: item.id,
          children: [],
          isLeaf:
            item?.id === 'ACU-103' ||
            item.id === 'APR-105' ||
            item.id === 'LST-203' ||
            item.id === 'LSU-201'
              ? true
              : item?.is_leaf,
        };

        return data;
        // if(item.Chil)
      });
      console.log('data3data3data3data3data3data3', data3);
      setTimeout(() => {
        setTreeData((prev) => {
          return {
            ...prev,
            treeData: updateTreeData(prev.treeData, value, data3),
          };
        });
        //@ts-ignore
        resolve();
        // setLoading(false)
      }, 500);
    });
  };

  const searchCharOfAccounts = async ({ queryKey }: any) => {
    const [_key, { search }] = queryKey;
    const { data } = await axiosInstance.get(
      `/chart_of_account/?search=${search}&page=1&page_size=15`
    );
    return data;
  };

  const searchData = useQuery(
    [`/chartOf_accounts/search/`, { search }],
    searchCharOfAccounts,
    {
      enabled: !!search,
    }
  );

  const handleRetrySearch = () => {
    searchData.refetch();
  };

  const onSearch = (value: string) => {
    setSearch(value);
  };

  const searchData1 = searchData?.data?.results;

  React.useEffect(() => {
    const newData = searchData1?.map((item: any) => {
      const newItem = {
        key: item.id,
        title: <Tooltip title={item?.get_fomrated_path}>{item.name}</Tooltip>,
        value: item.id,
        isLeaf: true,
      };
      return newItem;
    });

    setAllSearchData(newData);
  }, [searchData1]);

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setSearch('');
    }
  };

  const data = search ? allSearchData : treeData;

  // const onCheck = (checkedKeysValue: React.Key[]) => {
  //
  //   setCheckedKeys(checkedKeysValue);
  // };

  // const onSelect = (selectedKeysValue: React.Key[], info: any) => {
  //
  //   setSelectedKeys(selectedKeysValue);
  // };

  return (
    <div>
      <Search
        placeholder={t('Accounting.Chart_of_accounts.Search_placeholder')}
        onSearch={onSearch}
        onChange={onChangeSearch}
      />

      {
        // !treeData.length || searchData.isFetching || searchData.isLoading ? (
        //   <CenteredSpin size="default" style={styles.spin} />
        search !== '' ? (
          searchData.isFetching ? (
            <CenteredSpin size='default' style={styles.spin} />
          ) : searchData.isError ? (
            <RetryButton handleRetry={handleRetrySearch} />
          ) : searchData.isFetched && data?.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <Tree
              style={{ padding: '10px' }}
              showLine={search ? false : { showLeafIcon: false }}
              showIcon={false}
              //@ts-ignore
              height={`calc(100vh - 290px)`}
              // virtual={false}
              //@ts-ignore
              loadData={onExpandTable}
              treeData={data}
              switcherIcon={
                <Button
                  icon={<DownOutlined />}
                  size='small'
                  type='primary'
                  className='category_icon'
                  style={styles.expandButton}
                />
              }
            />
          )
        ) : search === '' ? (
          status === 'pending' ? (
            <CenteredSpin size='default' style={styles.spin} />
          ) : status === 'rejected' ? (
            <RetryButton handleRetry={handleRetry} size='large' />
          ) : status === 'resolved' && data?.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <Tree
              style={{ padding: '10px' }}
              showLine={search ? false : { showLeafIcon: false }}
              showIcon={false}
              // checkable
              //@ts-ignore
              // onCheck={onCheck}
              // checkedKeys={checkedKeys}
              //@ts-ignore
              height={`calc(100vh - 290px)`}
              //@ts-ignore
              loadData={onExpandTable}
              treeData={search ? allSearchData : treeData}
              switcherIcon={
                <Button
                  icon={<DownOutlined />}
                  size='small'
                  type='primary'
                  className='category_icon'
                  style={styles.expandButton}
                />
              }
            />
          )
        ) : null
      }
    </div>
  );
};

const styles = {
  expandButton: { height: '18px', width: '18px', borderRadius: '4px' },
  spin: { margin: '30px 0px' },
  linkItem: { textDecoration: 'underline' },
};
export default ChartsOfAccounts;
