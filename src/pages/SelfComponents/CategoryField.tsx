import React, { ReactNode, useState } from 'react';
import AddCategory from '../sales/Products/AddCategory';
import { useQuery } from 'react-query';
import { debounce } from 'throttle-debounce';
import axiosInstance from '../ApiBaseUrl';
import { TreeSelect, Form, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { CenteredSpin } from './Spin';
import RetryButton from './RetryButton';
import { manageNetworkError } from '../../Functions/manageNetworkError';

interface IProps {
  form: any;
  url: string;
  place: string;
  label?: ReactNode | string;
  placeholder?: string;
  style?: React.CSSProperties;
}

function updateTreeData<T, U extends string, G>(
  list: T,
  parent: U,
  children: G,
) {
  //@ts-ignore
  return list?.map((node) => {
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
}
export const CategoryField: React.FC<IProps> = (props) => {
  const [{ treeData, status }, setTreeData] = useState({
    treeData: [],
    status: 'idle',
  });
  const [search, setSearch] = useState('');
  const { t } = useTranslation();

  const onSearchCategories = (value: string) => {
    debounceFunc(value);
  };
  const debounceFunc = debounce(500, async (value: string) => {
    setSearch(value);
  });

  const handleSearchCategory = React.useCallback(
    async ({ queryKey }: { queryKey: any }) => {
      const { search } = queryKey?.[1];
      const { data } = await axiosInstance.get(
        `${props.url}?name__contains=${search}`,
      );
      return data;
    },
    [props.url],
  );

  const { data, isFetching } = useQuery(
    [`${props.url}`, { search }],
    handleSearchCategory,
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
            } as any)
            .then((res) => {
              const allData = res?.data?.map((item: any) => {
                const data = {
                  id: item.id,
                  title: item?.name,
                  value: item.id,
                  name: item?.name,
                  isLeaf: item?.is_leaf,
                  // children: [],
                };

                return data;
              });

              setTreeData((prev) => {
                return { ...prev, status: 'resolved', treeData: allData };
              });
            })
            .catch((error) => {
              setTreeData((prev) => {
                return { ...prev, status: 'rejected' };
              });
            });
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
    setTreeData((prev) => {
      return { ...prev, status: 'pending' };
    });
    const { data } = await axiosInstance
      .get(`${props.url}${value}/child/`)
      .catch((error) => {
        manageNetworkError(error);
        setTreeData((prev) => {
          return { ...prev, status: 'rejected' };
        });

        return error;
      });
    return new Promise((resolve, reject) => {
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
          // children: [],
        };
      });

      setTimeout(() => {
        setTreeData((prev) => {
          return {
            ...prev,
            treeData: updateTreeData(
              prev.treeData,
              title,
              data3?.length === 0 ? undefined : data3,
            ),
          };
        });
        setTreeData((prev) => {
          return { ...prev, status: 'resolved' };
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
  };

  return (
    <Form.Item
      name='category'
      label={props.label}
      style={props.style}
      rules={[
        {
          message: `${t('Sales.Product_and_services.Form.Category_required')}`,
          required: props.place === 'filter' ? false : true,
        },
      ]}
    >
      <TreeSelect
        loadData={onExpandTable}
        treeData={allTreeData}
        allowClear={props.place === 'filter' ? true : false}
        labelInValue
        placeholder={props.placeholder}
        onSearch={onSearchCategories}
        onChange={onChangeCategory}
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
        dropdownRender={(menu: any) => (
          <div>
            {props.place === 'filter' ? null : (
              <AddCategory
                form={props.form}
                url={props.url}
                setTreeData={setTreeData}
              />
            )}
            {menu}
          </div>
        )}
      />
    </Form.Item>
  );
};
