import React from "react";
import Navbar from "../../Accounting/Navbar";
import { useTranslation } from "react-i18next";
import { Title } from "../../SelfComponents/Title";
import { Row, Col, Layout } from "antd";
import AddOpenAccount from "./AddOpenAccount";
import OpenAccountTable from "./OpenAccountTable";
import { OPINING_ACCOUNT_M } from "../../../constants/permissions";
import {
  JOURNAL_LIST,
  JOURNAL_RESULT_LIST,
  OPENING_ACCOUNT_LIST,
  OPENING_ACCOUNT_RESULT_LIST,
} from "../../../constants/routes";
import { useQueryClient } from "react-query";

const baseUrl = OPENING_ACCOUNT_LIST;

const OpenAccounts: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const handleUpdateItems = React.useCallback(() => {
    queryClient.invalidateQueries(baseUrl);
    queryClient.invalidateQueries(JOURNAL_LIST);
    queryClient.invalidateQueries(JOURNAL_RESULT_LIST);
    queryClient.invalidateQueries(OPENING_ACCOUNT_RESULT_LIST);
  }, [queryClient]);

  return (
    <Layout>
      <Navbar />

      <Row className="categore-header" align="middle" justify="start">
        <Col
          md={{ span: 10 }}
          sm={{ span: 11 }}
          xs={{ span: 14 }}
          className="Sales__content-3-body"
        >
          <Title value={t("Opening_accounts.1")} model={OPINING_ACCOUNT_M} />
        </Col>
        <Col
          xl={{ span: 3, offset: 11 }}
          lg={{ span: 3, offset: 11 }}
          md={{ span: 4, offset: 10 }}
          sm={{ span: 5, offset: 8 }}
          xs={{ span: 6, offset: 4 }}
        >
          <AddOpenAccount
            baseUrl={baseUrl}
            handleUpdateItems={handleUpdateItems}
          />
        </Col>
      </Row>

      <OpenAccountTable
        baseUrl={baseUrl}
        handleUpdateItems={handleUpdateItems}
      />
    </Layout>
  );
};

export default OpenAccounts;
