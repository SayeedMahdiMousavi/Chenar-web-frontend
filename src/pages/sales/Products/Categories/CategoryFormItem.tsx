import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { debounce } from 'throttle-debounce';
import axiosInstance from '../../../ApiBaseUrl';
import { TreeSelect, Form, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { CenteredSpin } from '../../../SelfComponents/Spin';
import RetryButton from '../../../SelfComponents/RetryButton';
import { manageNetworkError } from '../../../../Functions/manageNetworkError';

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

interface IProps {
  form: any;
  url: string;
  place: string;
  placeholder: string;
  categoryId: number;
  label?: string;
}

export const CategoryFormItem: React.FC<IProps> = (props) => {
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

  const searchCategories = React.useCallback(
    async ({ queryKey }: { queryKey: any }) => {
      const { search } = queryKey?.[1];
      const { data } = await axiosInstance.get(
        `${props.url}?depth__lt=3&name__contains=${search}`,
      );
      return data;
    },
    [props.url],
  );

  const { data, isFetching } = useQuery(
    [`${props.url}/add/`, { search }],
    searchCategories,
  );

  const categoryId = props.categoryId;

  React.useEffect(() => {
    if (status === 'idle')
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
            .then((res: any) => {
              const allData = res?.data
                ?.filter((item: any) => item?.id !== categoryId)
                ?.map((item: any) => {
                  const data = {
                    id: item.id,
                    title: item.name,
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
              setTreeData((prev) => {
                return { ...prev, status: 'rejected' };
              });
            });
          // .finally(() => {
          //   setTreeData((prev) => {
          //     return { ...prev, status: "rejected" };
          //   });
          // });
        }
      })();
  }, [treeData, props.url, search, categoryId, status]);

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
    return new Promise((resolve) => {
      if (node.children?.[0]) {
        //@ts-ignore
        resolve();
        return;
      }

      const data3 = data
        ?.filter((item: any) => item?.id !== props.categoryId)
        ?.map((item: any) => {
          return {
            id: item.id,
            title: item.name,
            value: item.id,
            isLeaf: true,
            name: item?.name,
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
        //@ts-ignore
        resolve();
      }, 300);
    });
  };

  const allData = data?.results
    ?.filter((item: any) => item?.id !== props.categoryId)
    ?.map((item: any) => {
      const data = {
        id: item.id,
        title: <Tooltip title={item?.get_fomrated_path}>{item?.name}</Tooltip>,
        name: item?.name,
        value: item.id,
        isLeaf: true,
      };
      return data;
    });

  const onChangeCategory = () => {
    setSearch('');
  };

  return (
    <Form.Item
      name='category'
      label={
        props?.label ? (
          props.label
        ) : props.place === 'addCategory' ? (
          ''
        ) : (
          <span>{t('Sales.Product_and_services.Form.Category')}</span>
        )
      }
      className='margin1'
      rules={[
        {
          message: `${t('Sales.Product_and_services.Form.Category_required')}`,
          required: props.place === 'addCategory' ? true : false,
        },
      ]}
    >
      <TreeSelect
        loadData={onExpandTable}
        treeData={search ? allData : treeData}
        placeholder={
          props.place === 'addCategory'
            ? t('Sales.Product_and_services.Categories.Select_category')
            : ''
        }
        allowClear={true}
        labelInValue
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
        treeNodeFilterProp='name'
        dropdownRender={(menu: any) => <div>{menu}</div>}
      />
    </Form.Item>
  );
};
