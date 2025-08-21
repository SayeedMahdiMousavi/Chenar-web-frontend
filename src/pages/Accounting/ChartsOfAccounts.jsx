import Navbar from "./Navbar";
import { useTranslation } from "react-i18next";
import { Row, Col, Layout, Menu } from "antd";
import { useMediaQuery } from "../MediaQurey.js";
import { Title } from "../SelfComponents/Title.js";
import ChartsOfAccountsTree from "./ChartsOfAccounts/ChartOfAccountsTree";
import AddExpense from "../Expenses/Expenses/AddExpense.js";
import AddIncomeType from "../Expenses/IncomeTypeAndWithDraw/AddIncomeType";
import AddBankAccount from "../Banking/Bank/AddBankAccount";
import AddCashBox from "../Banking/CashBox/AddCashBox.js";
import { bankBaseUrl } from "../Banking/Bank/index.js";
import { expenseBaseUrl } from "../Expenses/Expenses/index";
import { PageNewDropdown } from "../../components/index";
import {
  BANK_M,
  CASH_M,
  CHART_OF_ACCOUNT_M,
  EXPENSE_TYPE_M,
  INCOME_TYPE_M,
  WITHDRAW_TYPE_M,
} from "../../constants/permissions.js";
import { checkPermissions } from "../../Functions/index.js";

function ChartsOfAccounts(props) {
  const { t } = useTranslation();
  const isMiniMobile = useMediaQuery("(max-width:375px)");
  const isMiniTablet = useMediaQuery("(max-width:485px)");

  const menu = (
    <Menu>
      {checkPermissions(`add_${EXPENSE_TYPE_M}`) && (
        <Menu.Item key="1">
          <AddExpense type="chartOfAccount" baseUrl={expenseBaseUrl} />{" "}
        </Menu.Item>
      )}
      {checkPermissions(`add_${INCOME_TYPE_M}`) && (
        <Menu.Item key="2">
          <AddIncomeType
            type="chartOfAccount"
            baseUrl="/expense_revenue/revenue/"
            title={t("Expenses.Income.Income_type_information")}
          />
        </Menu.Item>
      )}
      {checkPermissions(`add_${WITHDRAW_TYPE_M}`) && (
        <Menu.Item key="3">
          <AddIncomeType
            type="chartOfAccount"
            baseUrl="/expense_revenue/withdraw/"
            title={t("Expenses.With_draw.With_draw_information")}
          />
        </Menu.Item>
      )}
      {checkPermissions(`add_${BANK_M}`) && (
        <Menu.Item key="4">
          <AddBankAccount type="chartOfAccount" baseUrl={bankBaseUrl} />
        </Menu.Item>
      )}
      {checkPermissions(`add_${CASH_M}`) && (
        <Menu.Item key="5">
          <AddCashBox type="chartOfAccount" />
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <Layout>
      <Navbar />

      <Row className="Sales__content-3" align="middle" justify="start">
        <Col
          xl={{ span: 7 }}
          md={{ span: 8 }}
          sm={{ span: 10 }}
          xs={{ span: 13 }}
          className="Sales__content-3-body"
        >
          <Row>
            <Col span={24}>
              <Title
                value={t("Accounting.Chart_of_accounts.1")}
                model={CHART_OF_ACCOUNT_M}
              />
            </Col>
          </Row>
        </Col>
        <Col
          xl={{ span: 3, offset: 14 }}
          lg={{ span: 3, offset: 13 }}
          md={{ span: 4, offset: 10 }}
          sm={{ span: 5, offset: 6 }}
          xs={
            isMiniMobile
              ? { span: 6, offset: 2 }
              : isMiniTablet
              ? { span: 8, offset: 3 }
              : { span: 6, offset: 5 }
          }
          // xl={{ span: 3, offset: 11 }}
          // lg={{ span: 3, offset: 11 }}
          // md={{ span: 4, offset: 10 }}
          // sm={{ span: 5, offset: 8 }}
          // xs={{ span: 6, offset: 4 }}
        >
          {checkPermissions([
            `add_${EXPENSE_TYPE_M}`,
            `add_${INCOME_TYPE_M}`,
            `add_${WITHDRAW_TYPE_M}`,
            `add_${BANK_M}`,
            `add_${CASH_M}`,
          ]) && <PageNewDropdown overlay={menu} />}
        </Col>
      </Row>
      <ChartsOfAccountsTree />
    </Layout>
  );
}

export default ChartsOfAccounts;
