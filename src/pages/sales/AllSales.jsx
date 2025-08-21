import React from "react";
import { useTranslation } from "react-i18next";
import { Row, Col } from "antd";

import TransactionTable from "./AllSales/TransactionTable";
import NewTransaction from "./AllSales/NewTransaction";
import PageHeader from "../SelfComponents/LayoutComponents/PagHeader";
import { checkPermissions } from "../../Functions";
import {
  // PRODUCT_TRANSFER_INVOICE_M,
  PURCHASE_INVOICE_M,
  PURCHASE_REJ_INVOICE_M,
  QUOTATION_INVOICE_M,
  SALES_INVOICE_M,
  SALES_REJ_INVOICE_M,
} from "../../constants/permissions";
import Inventory from "./Inventory";

const AllSales = () => {
  const { t } = useTranslation();

  return !checkPermissions([
    `view_${SALES_INVOICE_M}`,
    `view_${SALES_REJ_INVOICE_M}`,
    `view_${PURCHASE_INVOICE_M}`,
    `view_${PURCHASE_REJ_INVOICE_M}`,
    `view_${QUOTATION_INVOICE_M}`,
    // `view_${PRODUCT_TRANSFER_INVOICE_M}`,
  ]) ? null : (
    <Inventory>
      <PageHeader
        title={t("Sales.All_sales.Purchase_and_sales.1")}
        table={<TransactionTable />}
      >
        <Row justify="end">
          <Col>
            <NewTransaction />
          </Col>
        </Row>
      </PageHeader>
    </Inventory>
  );
};

export default AllSales;
