import React, { useCallback, useEffect, useState } from 'react';
import {
  Row,
  Col,
  Button,
  TreeSelect,
  Input,
  Tooltip,
  Space,
  Typography,
} from 'antd';
import { useQuery } from 'react-query';
import { CloseOutlined, SettingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import LoginToAnarPay from './LoginToAnarPay';
import axiosInstance from '../../../ApiBaseUrl';
import { CenteredSpin } from '../../../SelfComponents/Spin';
import RetryButton from '../../../SelfComponents/RetryButton';
import SelectCustomer from './SelectCustomer';
const categoryBaseUrl = '/product/category/';

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
  graphqlEndPoint: string;
  onChangeTreeSestet: (value: string) => void;
  onSearch: (value: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchCategories: (value: any) => void;
  setSearchCategory: (value: any) => void;
  searchCategory: string;
  nameSearch: any;
  type: string;
  responseId: boolean;
  setInvoiceHeader: (value: any) => void;
  invoiceHeader: any;
  totalPrice: number;
  form: any;
  handleCloseFunction: () => void;
}
const POSHeader = ({
  graphqlEndPoint,
  onChangeTreeSestet,
  onSearch,
  onSearchCategories,
  setSearchCategory,
  searchCategory,
  nameSearch,
  type,
  responseId,
  setInvoiceHeader,
  invoiceHeader,
  totalPrice,
  form,
  handleCloseFunction,
}: IProps) => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [{ treeData, status }, setTreeData] = useState({
    treeData: [],
    status: 'idle',
  });

  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  useEffect(() => {
    if (status === 'idle') {
      (async () => {
        if (treeData?.length === 0) {
          setTreeData((prev) => {
            return { ...prev, status: 'pending' };
          });
          await axiosInstance
            .get(`${categoryBaseUrl}get_root_category/`)
            .then((res) => {
              const allData = res?.data?.map((item: any) => {
                const data = {
                  id: item.id,
                  title: item.name,
                  value: item.name,
                  name: item?.name,
                  children: [],
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
    }
  }, [status, treeData]);

  const handleRetry = () => {
    setTreeData((prev) => {
      return { ...prev, status: 'idle' };
    });
  };

  const handleClearCategory = () => {
    setSearchCategory('');
  };

  const onExpandTable = async (node: any) => {
    const { title, id } = node;
    const { data } = await axiosInstance.get(`${categoryBaseUrl}${id}/child/`);
    return new Promise((resolve) => {
      if (node.children?.[0]) {
        //@ts-ignore
        resolve();
        // setLoading(false);
        return;
      }

      const data3 = data?.map((item: any) => {
        return {
          id: item.id,
          title: item.name,
          value: item.name,
          name: item?.name,
          isLeaf: item?.is_leaf,
          // children: [],
          // isLeaf: item?.children?.length === 0 ? true : false,
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
        // setLoading(false)
      }, 300);
    });
  };

  const searchCategories = useCallback(async ({ queryKey }: any) => {
    const { searchCategory } = queryKey?.[1];
    const { data } = await axiosInstance.get(
      `${categoryBaseUrl}?name__contains=${searchCategory}`,
    );
    return data;
  }, []);

  const { data, isFetching } = useQuery(
    [`${categoryBaseUrl}`, { searchCategory }],
    searchCategories,
  );

  const allData = data?.results?.map((item: any) => {
    const data = {
      id: item.id,
      title: <Tooltip title={item?.get_fomrated_path}>{item?.name}</Tooltip>,
      value: item.id,
      name: item?.name,
      // key: item?.name,
      isLeaf: true,
    };
    return data;
  });
  const allTreeData = searchCategory ? allData : treeData;
  return (
    <Row align='middle' className='height' gutter={10}>
      <Col span={13}>
        <Row>
          {type === 'addPOS' && (
            <Col xxl={7} xl={8}>
              <Space size={20}>
                {/* <Button
                  type="primary"
                  shape="round"
                  style={{
                    boxShadow: "0px 0px 5px -2px rgba(255,255,255,1)",
                  }}
                  icon={<SettingOutlined className="table-col" />}
                /> */}
                <SelectCustomer
                  {...{
                    setInvoiceHeader,
                    invoiceHeader,
                    responseId,
                    totalPrice,
                    form,
                  }}
                />
                <LoginToAnarPay graphqlEndPoint={graphqlEndPoint} />
              </Space>
            </Col>
          )}
          {/* 
          <Col xxl={10} xl={11}>
            {type === "addPOS" ? (
              <Row justify="space-between" align="middle">
                <Col span={6}>
                  <Button
                    shape="round"
                    onClick={prev}
                    disabled={current < 1}
                    type="primary"
                    style={{
                      boxShadow: "0px 0px 5px -2px rgba(255,255,255,1)",
                    }}
                  >
                    {t("Step.Prev")}
                  </Button>{" "}
                </Col>
                <Col span={12} className="text_align_center color_white">
                  {current === 0
                    ? "21345543 "
                    : current === 1
                    ? "456789"
                    : current === 2
                    ? "098732"
                    : current === 3
                    ? "2345"
                    : current === 4
                    ? "34564"
                    : "567"}
                </Col>
                <Col span={6}>
                  <Button
                    shape="round"
                    onClick={next}
                    disabled={current > 4}
                    type="primary"
                    style={{
                      boxShadow: "0px 0px 5px -2px rgba(255,255,255,1)",
                    }}
                  >
                    {t("Step.Next")}
                  </Button>{" "}
                </Col>
              </Row>
            ) : (
              <Typography.Text style={{ color: "white" }}>
                {t("Sales.All_sales.Invoice.Edit_POS_invoice")}
              </Typography.Text>
            )}
          </Col> */}
        </Row>
      </Col>
      <Col span={11}>
        <Row gutter={24}>
          <Col span={11}>
            <TreeSelect
              className='num'
              placeholder={t('Sales.All_sales.Invoice.Filter_by_category_name')}
              popupClassName='z_index'
              treeNodeFilterProp='name'
              treeNodeLabelProp='name'
              style={{ borderRadius: '20px' }}
              onSearch={onSearchCategories}
              dropdownRender={(menu) => <div>{menu}</div>}
              labelInValue
              onChange={onChangeTreeSestet}
              loadData={onExpandTable}
              onClear={handleClearCategory}
              treeData={allTreeData}
              showSearch
              allowClear
              notFoundContent={
                searchCategory !== '' ? (
                  isFetching ? (
                    <CenteredSpin size='small' style={{ padding: '24px' }} />
                  ) : undefined
                ) : status === 'pending' ? (
                  <CenteredSpin size='small' style={{ padding: '24px' }} />
                ) : status === 'rejected' ? (
                  <RetryButton handleRetry={handleRetry} />
                ) : undefined
              }
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            />
          </Col>

          <Col span={11}>
            <Input
              // style={{ borderRadius: "20px" }}
              onChange={onSearch}
              ref={nameSearch}
              placeholder={t('Sales.All_sales.Invoice.Search_placeholder')}
            />
          </Col>
          <Col span={2}>
            <CloseOutlined
              onClick={handleCloseFunction}
              style={{ color: '#FFF' }}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export const POSHeader1 = React.memo(POSHeader);
