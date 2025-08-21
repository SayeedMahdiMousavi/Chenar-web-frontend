import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { debounce } from 'throttle-debounce';
import axiosInstance from '../../../ApiBaseUrl';
import { TreeSelect, Tooltip } from 'antd';
import { CenteredSpin } from '../../../SelfComponents/Spin';
import RetryButton from '../../../SelfComponents/RetryButton';

interface IProps {
  url: string;
  setValue: (value: any) => void;
  value: string;
  place: string;
  placeholder?: string;
  style?: React.CSSProperties;
  onChange: (value: any) => void;
}

const updateTreeData = (list: any, parent: string, children: any) => {
  return list?.map((node: any) => {
    if (node.title === parent) {
      return {
        ...node,
        children: children,
      };
    } else if (node.children?.[0]) {
      return {
        ...node,
        children: updateTreeData(node.children, parent, children),
      };
    }
    return node;
  });
};

export const CategorySelect: React.FC<IProps> = (props) => {
  const [{ treeData, status }, setTreeData] = useState({
    treeData: [],
    status: 'idle',
  });
  const [search, setSearch] = useState('');

  const onSearchCategories = (value: string) => {
    debounceFunc(value);
  };

  const debounceFunc = debounce(500, async (value: string) => {
    setSearch(value);
  });

  const searchCategories = React.useCallback(
    async ({ queryKey }) => {
      const { search } = queryKey?.[1];
      const { data } = await axiosInstance.get(
        `${props.url}?name__contains=${search}`
      );
      return data;
    },
    [props.url]
  );

  const { data, isFetching } = useQuery(
    [`${props.url}`, { search }],
    searchCategories
  );

  React.useEffect(() => {
    if (status === 'idle') {
      (async () => {
        if (treeData?.length === 0) {
          setTreeData((prev) => {
            return { ...prev, status: 'pending' };
          });
          await axiosInstance
            .get(`${props.url}get_root_category/`, {
              'axios-retry': {
                retries: 4,
              },
            })
            .then((res) => {
              const allData = res?.data?.map((item: any) => {
                const data = {
                  id: item.id,
                  title: item?.name,
                  value: item.id,
                  name: item?.name,
                  isLeaf: item?.is_leaf,
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
              setTreeData((prev) => {
                return { ...prev, status: 'rejected' };
              });
            });
          // }
        }
      })();
    }
  }, [treeData, props.url, search, status]);

  const handleRetry = () => {
    setTreeData((prev) => {
      return { ...prev, status: 'idle' };
    });
  };

  const onExpandTable = async (node: any) => {
    const { title, value } = node;
    const { data } = await axiosInstance.get(`${props.url}${value}/child/`);
    return new Promise((resolve) => {
      if (node.children?.[0]) {
        //@ts-ignore
        resolve();
        return;
      }

      const data3 = data?.map((item: any) => {
        return {
          id: item.id,
          title: item.name,
          value: item.id,
          name: item?.name,
          isLeaf: item?.is_leaf,
        };
      });
      setTimeout(() => {
        setTreeData((prev) => {
          return {
            ...prev,
            treeData: updateTreeData(
              prev.treeData,
              title,
              data3?.length === 0 ? undefined : data3
            ),
          };
        });
        //@ts-ignore
        resolve();
      }, 300);
    });
  };

  const allData = data?.results?.map((item: any) => {
    const data = {
      id: item.id,
      title: <Tooltip title={item?.get_fomrated_path}>{item?.name}</Tooltip>,
      value: item.id,
      name: item?.name,
      isLeaf: true,
    };
    return data;
  });
  const allTreeData = search ? allData : treeData;

  const onChangeCategory = (value: any) => {
    setSearch('');
    props.setValue(value);
    props.onChange(value);
  };
  return (
    <TreeSelect
      loadData={onExpandTable}
      className='num'
      treeData={allTreeData}
      allowClear={props.place === 'filter' ? true : false}
      labelInValue
      placeholder={props.placeholder}
      onSearch={onSearchCategories}
      onChange={onChangeCategory}
      value={props?.value}
      showSearch
      notFoundContent={
        search !== '' ? (
          isFetching ? (
            <CenteredSpin size='small' style={{ padding: '24px' }} />
          ) : undefined
        ) : status === 'pending' ? (
          <CenteredSpin size='small' style={{ padding: '24px' }} />
        ) : status === 'rejected' ? (
          <RetryButton handleRetry={handleRetry} />
        ) : undefined
      }
      popupClassName={props.place === 'filter' ? '' : 'z_index'}
      treeNodeFilterProp='name'
      treeNodeLabelProp='name'
      dropdownRender={(menu: any) => <div>{menu}</div>}
    />
  );
};
