import React, { useEffect } from 'react';
import { Tabs, Row, Col, Collapse } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Colors } from '../colors';
import {
  ACCOUNT_STATISTIC_P,
  BALANCE_SHEET_P,
  CASH_TRANSACTION_M,
  CURRENCY_EXCHANGE_M,
  CURRENCY_RATE_M,
  DEBIT_CREDIT_P,
  EXPENSE_M,
  EXPIRE_PRODUCTS_P,
  FINANCIAL_REPORT_P,
  INCOME_M,
  INVOICES_P,
  INVOICE_BY_PERSON_P,
  INVOICE_BY_PRODUCT_P,
  JOURNAL_M,
  MONEY_TRANSFER_M,
  PRODUCT_PROFIT_P,
  PRODUCT_STATISTIC_P,
  SALES_INVOICE_M,
  WAREHOUSE_CARDX_P,
  WAREHOUSE_REPORT_P,
  WAREHOUSE_STATISTIC_P,
} from '../../constants/permissions';
import { checkPermissions } from '../../Functions';

const { TabPane } = Tabs;
const { Panel } = Collapse;

const ReportsBody = () => {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();

  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

  useEffect(() => {
    if (!checkPermissions(FINANCIAL_REPORT_P) && params?.id !== 'warehouse') {
      navigate('/report/warehouse');
    }
  }, []);

  // const genExtra = (value) => (
  //   <div>
  //     {value ? (
  //       <StarFilled
  //         onClick={(e) => {
  //           e.stopPropagation();
  //         }}
  //         style={i18n.language === "en" ? styles.star : styles.starPersian}
  //       />
  //     ) : (
  //       <StarOutlined
  //         onClick={(e) => {
  //           e.stopPropagation();
  //         }}
  //         style={i18n.language === "en" ? styles.star : styles.starPersian}
  //       />
  //     )}
  //   </div>
  // );
  // const menu = (
  //   <Menu>
  //     <Menu.Item key="1">
  //       <Link to="/sales/categories">
  //         <Text>Taxable Sales Summary</Text>
  //       </Link>
  //     </Menu.Item>
  //     <Menu.Item key="2">
  //       <Link to="/sales/units">
  //         <Text>Transactions without sales tax</Text>{" "}
  //       </Link>
  //     </Menu.Item>
  //     <Menu.Item key="3">
  //       <Link to="/sales/units">
  //         <Text>Profile and loss</Text>{" "}
  //       </Link>
  //     </Menu.Item>
  //   </Menu>
  // );
  // const operations = (
  //   <Dropdown overlay={menu} trigger={["click"]}>
  //     <Button shape="round" className="num">
  //       {/* {t("Sales.Product_and_services.More")} */}
  //       <Text>View reports</Text>
  //       <DownOutlined />
  //     </Button>
  //   </Dropdown>
  // );

  const warehouse = [
    // {
    //   name: t("Reports.Favorite"),
    //   children: [
    //     [
    //       {
    //         header: t("Reports.Expired_products"),
    //         url: "expired-products",
    //         content: text,
    //         isFavorite: true,
    //       },
    //       {
    //         header: t("Reports.Incoming_products"),
    //         url: "incoming-products",
    //         content: text,
    //         isFavorite: true,
    //       },
    //       {
    //         header: t("Reports.Outgoing_products"),
    //         url: "outgoing-products",
    //         content: text,
    //         isFavorite: true,
    //       },
    //     ],
    //     [
    //       {
    //         header: t("Sales.All_sales.Invoice.Sales_invoice"),
    //         url: "sales",
    //         content: text,
    //         isFavorite: true,
    //       },
    //       {
    //         header: t("Reports.Invoices"),
    //         url: "invoices",
    //         content: text,
    //         isFavorite: false,
    //       },

    //       {
    //         header: t("Reports.Total_sold_products"),
    //         url: "total-sold-products",
    //         content: text,
    //         isFavorite: false,
    //       },
    //     ],
    //   ],
    // },
    {
      name: t('Reports.Product_statistics'),
      code: 'product_statistic',
      permissions: [PRODUCT_STATISTIC_P, EXPIRE_PRODUCTS_P],
      children: [
        [
          {
            header: t('Reports.Product_statistics'),
            url: 'product-statistics',
            content: text,
            isFavorite: false,
            permission: PRODUCT_STATISTIC_P,
          },
          {
            header: t('Reports.Product_deficits'),
            url: 'product-deficits',
            content: text,
            isFavorite: true,
            permission: PRODUCT_STATISTIC_P,
          },
        ],
        [
          {
            header: t('Reports.Expired_products'),
            url: 'expired-products',
            content: text,
            isFavorite: true,
            permission: EXPIRE_PRODUCTS_P,
          },
        ],
      ],
    },
    {
      name: t('Reports.Warehouse_statistics'),
      code: 'warehouse_statistic',
      permissions: [WAREHOUSE_STATISTIC_P, WAREHOUSE_CARDX_P],
      children: [
        [
          {
            header: t('Reports.Warehouse_statistics'),
            url: 'warehouse-statistics',
            content: text,
            isFavorite: false,
            permission: WAREHOUSE_STATISTIC_P,
          },
        ],
        [
          {
            header: t('Reports.Warehouse_cart_x'),
            url: 'warehouse-cart-x',
            content: text,
            isFavorite: false,
            permission: WAREHOUSE_CARDX_P,
          },
        ],
      ],
    },
    {
      name: t('Reports.Sales_and_purchases'),
      code: 'invoice_report',
      permissions: [
        `view_${SALES_INVOICE_M}`,
        INVOICES_P,
        INVOICE_BY_PRODUCT_P,
        INVOICE_BY_PERSON_P,
      ],
      children: [
        [
          {
            header: t('Sales.All_sales.Invoice.Sales_invoice'),
            url: 'sales',
            content: text,
            isFavorite: true,
            permission: `view_${SALES_INVOICE_M}`,
          },
          {
            header: t('Reports.Invoices'),
            url: 'invoices',
            content: text,
            isFavorite: false,
            permission: INVOICES_P,
          },
        ],
        [
          {
            header: t('Reports.Total_sold_products'),
            url: 'total-sold-products',
            content: text,
            isFavorite: false,
            permission: INVOICE_BY_PRODUCT_P,
          },
          {
            header: t('Reports.Total_sold_by_customer'),
            url: 'total-sold-by-customer',
            content: text,
            isFavorite: false,
            permission: INVOICE_BY_PERSON_P,
          },
        ],
      ],
    },
    {
      name: t('Reports.Sales_and_purchases_price'),
      code: 'product_price_report',
      permissions: [PRODUCT_STATISTIC_P],
      children: [
        [
          {
            header: t('Reports.Product_purchases_price'),
            url: 'product-purchase-price',
            content: text,
            isFavorite: true,
            permission: PRODUCT_STATISTIC_P,
          },
        ],
        [
          {
            header: t('Reports.Product_sales_price'),
            url: 'product-sales-price',
            content: text,
            isFavorite: true,
            permission: PRODUCT_STATISTIC_P,
          },
        ],
      ],
    },
    {
      name: t('Reports.Extra'),
      code: 'extra_product_report',
      permissions: [PRODUCT_PROFIT_P],
      children: [
        [
          {
            header: t('Reports.Product_profit_average'),
            url: 'product-profit-average',
            content: text,
            isFavorite: true,
            permission: PRODUCT_PROFIT_P,
          },
        ],
      ],
    },
  ];
  const financial = [
    // {
    //   name: t("Reports.Favorite"),
    //   children: [
    //     [
    //       {
    //         header: t("Reports.Accounts_statistics"),
    //         url: "accounts-statistics",
    //         content: text,
    //         isFavorite: false,
    //       },

    //       {
    //         header: t("Reports.Trial_balance"),
    //         url: "trial-balance",
    //         content: text,
    //         isFavorite: false,
    //       },
    //       {
    //         header: t("Reports.Detailed_balance"),
    //         url: "detailed-balance",
    //         content: text,
    //         isFavorite: false,
    //       },
    //     ],
    //     [
    //       {
    //         header: t("Reports.Currency_exchange"),
    //         url: "currency-exchange",
    //         content: text,
    //         isFavorite: false,
    //       },

    //       {
    //         header: t("Expenses.1"),
    //         url: "expenses",
    //         content: text,
    //         isFavorite: false,
    //       },

    //       {
    //         header: t("Reports.Journal_book"),
    //         url: "journal",
    //         content: text,
    //         isFavorite: false,
    //       },
    //     ],
    //   ],
    // },
    {
      name: t('Reports.Financial_statement'),
      code: 'financial_statements',
      permissions: [`view_${JOURNAL_M}`, BALANCE_SHEET_P],
      children: [
        [
          {
            header: t('Reports.Journal_book'),
            url: 'journal',
            content: text,
            isFavorite: false,
            permission: `view_${JOURNAL_M}`,
          },
          {
            header: t('Reports.Income_statement'),
            url: 'income-statement',
            content: text,
            isFavorite: true,
            // permission: BALANCE_SHEET_P,
            permission: `view_${JOURNAL_M}`,
          },
          {
            header: t('Reports.Fiscal_periods_income'),
            url: 'fiscal_periods_income',
            content: text,
            isFavorite: false,
            // permission: BALANCE_SHEET_P,
            permission: `view_${JOURNAL_M}`,
          },
        ],
        [
          {
            header: t('Reports.Balance_sheet'),
            url: 'balance-sheet',
            content: text,
            isFavorite: false,
            // permission: BALANCE_SHEET_P,
            permission: `view_${JOURNAL_M}`,
          },
          {
            header: t('Reports.Trial_balance'),
            url: 'trial-balance',
            content: text,
            isFavorite: false,
            // permission: BALANCE_SHEET_P,
            permission: `view_${JOURNAL_M}`,
          },
          {
            header: t('Reports.Detailed_balance'),
            url: 'detailed-balance',
            content: text,
            isFavorite: false,
            // permission: BALANCE_SHEET_P,
            permission: `view_${JOURNAL_M}`,
          },
        ],
      ],
    },
    {
      name: t('Reports.Accounts_statistics'),
      code: 'account_statements',
      permissions: [`view_${JOURNAL_M}`],
      // permissions: [ACCOUNT_STATISTIC_P, DEBIT_CREDIT_P],
      children: [
        [
          {
            header: t('Reports.Accounts_statistics'),
            url: 'accounts-statistics',
            content: text,
            isFavorite: false,
            // permission: ACCOUNT_STATISTIC_P,
            permission: `view_${JOURNAL_M}`,
          },
        ],
        [
          {
            header: t('Reports.Debit_and_credit'),
            url: 'debit-credit',
            content: text,
            isFavorite: false,
            // permission: DEBIT_CREDIT_P,
            permission: `view_${JOURNAL_M}`,
          },
        ],
      ],
    },
    {
      name: t('Sales.Product_and_services.Currency.1'),
      code: 'currency_report',
      permissions: [`view_${CURRENCY_EXCHANGE_M}`, `view_${CURRENCY_RATE_M}`],
      children: [
        [
          {
            header: t('Reports.Currency_exchange'),
            url: 'currency-exchange',
            content: text,
            isFavorite: false,
            permission: `view_${CURRENCY_EXCHANGE_M}`,
          },
        ],
        [
          {
            header: t('Sales.Product_and_services.Currency.Currency_navigate'),
            url: 'currency-navigate',
            content: text,
            isFavorite: true,
            permission: `view_${CURRENCY_RATE_M}`,
          },
        ],
      ],
    },
    {
      name: t('Expenses.Expenses_and_incomes'),
      code: 'income_expanse_report',
      permissions: [`view_${EXPENSE_M}`, `view_${INCOME_M}`],
      children: [
        [
          {
            header: t('Expenses.1'),
            url: 'expenses',
            content: text,
            isFavorite: false,
            permission: `view_${EXPENSE_M}`,
          },
        ],
        [
          {
            header: t('Expenses.Income.1'),
            url: 'income',
            content: text,
            isFavorite: false,
            permission: `view_${INCOME_M}`,
          },
        ],
      ],
    },
    {
      name: t('Reports.Extra'),
      code: 'extra_finance_report',
      permissions: [`view_${MONEY_TRANSFER_M}`, `view_${CASH_TRANSACTION_M}`],
      children: [
        [
          {
            header: t('Reports.Cash_transactions'),
            url: 'cash-transactions',
            content: text,
            isFavorite: false,
            permission: `view_${CASH_TRANSACTION_M}`,
          },
        ],
        [
          {
            header: t('Banking.Money_transfer'),
            url: 'money-transfer',
            content: text,
            isFavorite: false,
            permission: `view_${MONEY_TRANSFER_M}`,
          },
        ],
      ],
    },
  ];

  const handleTabClick = (key) => {
    if (key === 'financial') {
      navigate('/report/financial');
    } else {
      navigate('/report/warehouse');
    }
  };
  const financialList = financial;

  const warehouseList = warehouse;
  return (
    <Row>
      <Col span={24}>
        <Tabs
          tabBarStyle={styles.tabs}
          animated={false}
          activeKey={params?.id}
          onTabClick={handleTabClick}
        >
          {checkPermissions(FINANCIAL_REPORT_P) && (
            <TabPane tab={t('Reports.Financial_reports')} key='financial'>
              <Collapse
                defaultActiveKey={['0']}
                // bordered={tr}
                // className="site-collapse-custom-collapse"
                style={styles.mainCollapse}
              >
                {financialList?.map((item, index) =>
                  !checkPermissions(item?.permissions) ? null : (
                    <Panel
                      header={item?.name}
                      key={`${index}`}
                      className='site-collapse-custom-panel'
                    >
                      <Row gutter={20}>
                        {item?.children?.map((item1, index) => {
                          const permissions = item1?.map(
                            (item) => item?.permission,
                          );
                          return !checkPermissions(permissions) ? null : (
                            <Col span={12} key={index}>
                              <Collapse
                                // defaultActiveKey={["1"]}
                                bordered={false}
                                key={`${index}`}
                              >
                                {item1?.map((item2) =>
                                  !checkPermissions(
                                    item2?.permission,
                                  ) ? null : (
                                    <Panel
                                      header={
                                        <Link
                                          to={`/all-reports/${item2.url}`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                          }}
                                        >
                                          {item2?.header}
                                        </Link>
                                      }
                                      key={`/all-reports/${item2.url}`}
                                      // className="site-collapse-custom-panel"
                                      showarrow={false}
                                      // extra={genExtra(item2?.isFavorite)}
                                    >
                                      {/* <p>{text}</p> */}
                                    </Panel>
                                  ),
                                )}
                              </Collapse>
                            </Col>
                          );
                        })}
                      </Row>
                    </Panel>
                  ),
                )}
              </Collapse>
            </TabPane>
          )}
          {checkPermissions(WAREHOUSE_REPORT_P) && (
            <TabPane tab={t('Reports.Warehouse_reports')} key='warehouse'>
              <Collapse defaultActiveKey={['0']} style={styles.mainCollapse}>
                {warehouseList?.map((item, index) =>
                  !checkPermissions(item?.permissions) ? null : (
                    <Panel
                      header={item?.name}
                      key={`${index}`}
                      className='site-collapse-custom-panel'
                    >
                      <Row gutter={20}>
                        {item?.children?.map((item1, index) => (
                          <Col span={12} key={index}>
                            <Collapse
                              // defaultActiveKey={["1"]}
                              bordered={false}
                              key={index}
                              // ghost
                              // className="site-collapse-custom-collapse"
                            >
                              {item1?.map((item2) =>
                                !checkPermissions(item2?.permission) ? null : (
                                  <Panel
                                    header={
                                      <Link
                                        to={`/all-reports/${item2.url}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
                                      >
                                        {item2?.header}
                                      </Link>
                                    }
                                    key={`/all-reports/${item2.url}`}
                                    // className="site-collapse-custom-panel"
                                    showarrow={false}
                                    // extra={genExtra(item2?.isFavorite)}
                                  >
                                    {/* <p>{text}</p> */}
                                  </Panel>
                                ),
                              )}
                            </Collapse>
                          </Col>
                        ))}
                      </Row>
                    </Panel>
                  ),
                )}
              </Collapse>
            </TabPane>
          )}
        </Tabs>
      </Col>
    </Row>
  );
};

const styles = {
  star: { fontSize: '22px' },
  starPersian: { fontSize: '22px', marginInlineEnd: '15px' },
  tabs: {
    borderBottom: `1px solid ${Colors.borderColor}`,
  },
  mainCollapse: {
    maxHeight: '500px',
    overflowY: 'auto',
    marginBottom: '24px',
  },
};
export default ReportsBody;
