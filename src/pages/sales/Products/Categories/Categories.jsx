import React, { useState } from 'react';
import { Title } from '../../../SelfComponents/Title';
import axiosInstance from '../../../ApiBaseUrl';
import { useQuery } from 'react-query';
import AddCategories from './AddCategories';
import { Row, Col, Table, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../../../MediaQurey';
import Action from './Action';
import { SearchInput } from '../../../SelfComponents/SearchInput';
import RetryButton from '../../../SelfComponents/RetryButton';
import { checkPermissions } from '../../../../Functions';
import { PageBackIcon } from '../../../../components';

const { Column } = Table;

const updateTreeData = (list, parent, children) => {
  return list?.map((node) => {
    if (node.name === parent) {
      const data = {
        ...node,
        children: children?.length > 0 ? children : undefined,
      };

      return data;
    } else if (node.children?.[0]) {
      return {
        ...node,
        children: updateTreeData(node.children, parent, children),
      };
    }
    return node;
  });
};

const Categories = (props) => {
  const isMobile = useMediaQuery('(max-width:400px)');
  const { t } = useTranslation();
  const [ setPage] = React.useState(1);
  const [search, setSearch] = useState('');
  const [loadData, setLoadData] = useState(['']);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [{ allData, status }, setTreeData] = useState({
    allData: [],
    status: 'idle',
  });

  const searchCategory = React.useCallback(
    async ({ queryKey }) => {
      const { search } = queryKey?.[1] || {};
      const { data } = await axiosInstance.get(`${props.url}?search=${search}`);
      return data;
    },
    [props.url]
  );

  const searchData = useQuery(
    [`/product/category/`, { search }],
    searchCategory
  );

  React.useEffect(() => {
    if (status === 'idle') {
      (async () => {
        if (allData?.length === 0) {
          setLoadData(['']);
          setTreeData((prev) => {
            return { ...prev, status: 'pending' };
          });
          const { data } = await axiosInstance.get(
            `${props.url}get_root_category/`,
            {
              'axios-retry': {
                retries: 4,
              },
            }
          );
          const allData = data?.map((item) => {
            return {
              ...item,
              children: [],
            };
          });
          setTreeData((prev) => {
            return { ...prev, status: 'resolved', allData: allData };
          });
        }
      })();
    }
  }, [props.url, allData.length, status]);

  const handleRetry = () => {
    setTreeData((prev) => {
      return { ...prev, status: 'idle' };
    });
  };

  const onExpandTable =  (expanded, { name, id }) => {
    return new Promise((resolve) => {
      setTreeData((prev) => {
        return { ...prev, status: 'pending' };
      });
      if (loadData.includes(name)) {
        setTreeData((prev) => {
          return { ...prev, status: 'resolved' };
        });
        resolve();
        return;
      } else {
        axiosInstance.get(`${props.url}${id}/child/`)
          .then(({ data }) => {
            const data3 = data?.map((item) => {
              return {
                ...item,
                children: [],
              };
            });

            setTimeout(() => {
              setTreeData((prev) => {
                return {
                  ...prev,
                  allData: updateTreeData(prev.allData, name, data3),
                };
              });

              if (!data?.[0]) {
                setTreeData((prev) => {
                  return { ...prev, status: 'resolved' };
                });
              }
              resolve(
                setTreeData((prev) => {
                  return { ...prev, status: 'resolved' };
                }),
                //@ts-ignore
                setLoadData((prev) => [...prev, name])
              );
            }, 300);
          });
      }
    });  };

  const onExpandedRowsChange = (expandedRows) => {
    setExpandedRowKeys(expandedRows);
  };
  return (
    <div>
      <Row className='categore-header' align='middle' justify='start'>
        <Col
          md={{ span: 10 }}
          sm={{ span: 11 }}
          xs={{ span: 14 }}
          className='Sales__content-3-body'
        >
          <Row>
            <Col span={24}>
              <Title value={props.title} model={props.model} />
            </Col>
            <Col
              xl={{ span: 12, offset: 0 }}
              lg={{ span: 17, offset: 0 }}
              md={{ span: 18, offset: 0 }}
              xs={{ span: 17, offset: 0 }}
            >
              <PageBackIcon
                previousPageName={props.backText}
                url={props.backUrl}
              />
            </Col>
          </Row>
        </Col>
        <Col
          xl={{ span: 3, offset: 11 }}
          lg={{ span: 3, offset: 11 }}
          md={{ span: 4, offset: 10 }}
          sm={{ span: 5, offset: 8 }}
          xs={{ span: 6, offset: 4 }}
        >
          <AddCategories
            url={props.url}
            setTreeData={setTreeData}
            model={props?.model}
          />
        </Col>
      </Row>

      <Table
        loading={
          (search !== '' && searchData.isLoading) ||
          (search !== '' && searchData.isFetching)
            ? true
            : status === 'pending'
        }
        expandable={false}
        size='middle'
        locale={
          search === '' && status === 'rejected'
            ? {
                emptyText: <RetryButton handleRetry={handleRetry} />,
              }
            : undefined
        }
        rowKey={(record) => record.id}
        pagination={false}
        // onChange={onChangeTable}
        onExpand={onExpandTable}
        onExpandedRowsChange={onExpandedRowsChange}
        expandedRowKeys={expandedRowKeys}
        dataSource={search ? searchData?.data?.results : allData}
        expandIcon={({ expanded, onExpand, record, expandable }) =>
          !expandable ? null : expanded ? (
            <div></div>
          ) : (
            // <Button
            //   icon={<DownOutlined />}
            //   size="small"
            //   type="primary"
            //   className="treeTable__expandIcon"
            //   onClick={(e) => onExpand(record, e)}
            //   style={styles.expandButtonDown}
            // />
            <div></div>
            // <Button
            //   icon={t("Dir") === "ltr" ? <RightOutlined /> : <LeftOutlined />}
            //   size="small"
            //   type="primary"
            //   className="treeTable__expandIcon"
            //   onClick={(e) => onExpand(record, e)}
            //   style={styles.expandButton}
            // />
          )
        }
        // expandable={false}
        title={() => {
          return (
            <Row style={{ width: '100%' }}>
              <Col
                xl={{ span: 7 }}
                lg={{ span: 9 }}
                md={{ span: 10 }}
                sm={{ span: 11 }}
                className='table__header1'
              >
                <Row>
                  <Col md={18} sm={{ span: 17 }}>
                    <SearchInput
                      setPage={setPage}
                      placeholder={t('Employees.Filter_by_name')}
                      setSearch={setSearch}
                    />
                  </Col>
                  <Col
                    md={{ span: 3, offset: 2 }}
                    sm={{ span: 4, offset: 2 }}
                  ></Col>
                </Row>
              </Col>

              <Col
                xl={{ span: 2, offset: 15 }}
                lg={{ span: 3, offset: 12 }}
                md={{ span: 3, offset: 11 }}
                sm={{ span: 4, offset: 9 }}
                xs={{ span: 6, offset: 4 }}
                className='table__header2'
              >
                <Row></Row>
              </Col>
            </Row>
          );
        }}
      >
        <Column
          title={
            <span style={search ? styles.firstRow : {}}>
              {' '}
              {t('Form.Name').toUpperCase()}
            </span>
          }
          render={(text, record) => (
            <Tooltip placement='top' title={record?.get_fomrated_path}>
              <span style={styles.firstRow}> {text}</span>
            </Tooltip>
          )}
          dataIndex='name'
          key='name'
          className='table-col'
        />

        <Column
          title={t('Form.Description').toUpperCase()}
          dataIndex='description'
          key='description'
          className='table-col'
        />

        {checkPermissions([
          `delete_${props?.model}`,
          `change_${props?.model}`,
        ]) && (
          <Column
            title={t('Table.Action')}
            key='action'
            align='center'
            width={isMobile ? 50 : 70}
            className='table-col'
            render={(text, record) => (
              <Action
                record={record}
                url={props.url}
                setTreeData={setTreeData}
                search={search}
                setLoadData={setLoadData}
                setExpandedRowKeys={setExpandedRowKeys}
                model={props?.model}
              />
            )}
          />
        )}
      </Table>
    </div>
  );
};

const styles = {
  firstRow: { paddingInlineStart: '1rem' },
  firstRow1: (level) => ({
    paddingInlineStart:
      level === 'A' ? '1.5rem' : level === 'B' ? '2.5rem' : '3.5rem',
    margin: '0px',
  }),
  expandButton: {
    borderEndEndRadius: '30px',
    borderStartEndRadius: '30px',
  },
  expandButtonDown: {
    borderEndEndRadius: '30px',
    borderEndStartRadius: '30px',
  },
};

export default Categories;
