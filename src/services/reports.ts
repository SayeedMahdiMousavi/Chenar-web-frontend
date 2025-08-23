import { ApiService, PaginationParams } from './api';

export interface ReportFilter {
  date_from?: string;
  date_to?: string;
  warehouse?: number;
  category?: number;
  currency?: number;
  account_type?: string;
  invoice_type?: string;
  customer?: number;
  supplier?: number;
  product?: number;
  staff?: number;
}

export interface DashboardSummary {
  total_sales: string;
  total_purchases: string;
  total_expenses: string;
  net_profit: string;
  cash_balance: string;
  bank_balance: string;
  pending_invoices: number;
  overdue_invoices: number;
  low_stock_products: number;
  total_customers: number;
  total_suppliers: number;
  recent_transactions: any[];
  sales_chart_data: any[];
  expense_chart_data: any[];
}

export class ReportsService extends ApiService {
  constructor() {
    super('/accounting_reports');
  }

  // Warehouse Reports
  async getProductStatistics(filters?: ReportFilter): Promise<any> {
    return this.get('/warehouse/product_statistic/', filters);
  }

  async getProductDeficits(filters?: ReportFilter): Promise<any> {
    return this.get('/warehouse/product_deficits/', filters);
  }

  async getSalesPriceReport(filters?: ReportFilter): Promise<any> {
    return this.get('/warehouse/sales_price/', filters);
  }

  async getPurchasePriceReport(filters?: ReportFilter): Promise<any> {
    return this.get('/warehouse/purchase_price/', filters);
  }

  async getProductExpirationReport(filters?: ReportFilter): Promise<any> {
    return this.get('/warehouse/product_expiration/', filters);
  }

  async generateInventoryReport(filters?: ReportFilter): Promise<any> {
    return this.post('/warehouse/inventory/', filters);
  }

  async getInventoryReportResult(): Promise<any> {
    return this.get('/warehouse/inventory/result/');
  }

  async generateWarehouseCardexReport(filters?: ReportFilter): Promise<any> {
    return this.post('/warehouse/warehouse_cardex/', filters);
  }

  async getWarehouseCardexResult(): Promise<any> {
    return this.get('/warehouse/warehouse_cardex/result/');
  }

  async generateSalesInvoiceReport(filters?: ReportFilter): Promise<any> {
    return this.post('/warehouse/sales_invoice/', filters);
  }

  async getSalesInvoiceReportResult(): Promise<any> {
    return this.get('/warehouse/sales_invoice/result/');
  }

  async generateInvoiceReport(filters?: ReportFilter): Promise<any> {
    return this.post('/warehouse/invoice_report/', filters);
  }

  async getInvoiceReportResult(): Promise<any> {
    return this.get('/warehouse/invoice_report/result/');
  }

  async generateInvoiceByProductReport(filters?: ReportFilter): Promise<any> {
    return this.post('/warehouse/invoice_by_product/', filters);
  }

  async getInvoiceByProductResult(): Promise<any> {
    return this.get('/warehouse/invoice_by_product/result/');
  }

  async generateInvoiceByPersonReport(filters?: ReportFilter): Promise<any> {
    return this.post('/warehouse/invoice_by_person/', filters);
  }

  async getInvoiceByPersonResult(): Promise<any> {
    return this.get('/warehouse/invoice_by_person/result/');
  }

  async generateProductProfitReport(filters?: ReportFilter): Promise<any> {
    return this.post('/warehouse/product_profit/', filters);
  }

  async getProductProfitResult(): Promise<any> {
    return this.get('/warehouse/product_profit/result/');
  }

  async getSalesInvoiceGraphReport(filters?: ReportFilter): Promise<any> {
    return this.get('/warehouse/sales_invoice/graph_report/', filters);
  }

  async getPurchaseInvoiceGraphReport(filters?: ReportFilter): Promise<any> {
    return this.get('/warehouse/purchase_invoice/graph_report/', filters);
  }

  // Financial Reports
  async generateJournalReport(filters?: ReportFilter): Promise<any> {
    return this.post('/financial/journal/', filters);
  }

  async getJournalReportResult(): Promise<any> {
    return this.get('/financial/journal/result/');
  }

  async generateAccountStatisticsReport(filters?: ReportFilter): Promise<any> {
    return this.post('/financial/account_statistic/', filters);
  }

  async getAccountStatisticsResult(): Promise<any> {
    return this.get('/financial/account_statistic/result/');
  }

  async generateDebitCreditReport(filters?: ReportFilter): Promise<any> {
    return this.post('/financial/debit_credit/', filters);
  }

  async getDebitCreditResult(): Promise<any> {
    return this.get('/financial/debit_credit/result/');
  }

  async getDetailedBalanceReport(filters?: ReportFilter): Promise<any> {
    return this.get('/financial/balance/detailed/', filters);
  }

  async getTrialBalanceReport(filters?: ReportFilter): Promise<any> {
    return this.get('/financial/balance/trial/', filters);
  }

  async getBalanceSheetDefaultCurrency(filters?: ReportFilter): Promise<any> {
    return this.get('/financial/balance/main/default', filters);
  }

  async getBalanceSheetMultiCurrency(filters?: ReportFilter): Promise<any> {
    return this.get('/financial/balance/main/', filters);
  }

  async getFiscalYearProfitReport(filters?: ReportFilter): Promise<any> {
    return this.get('/financial/profit_lost/year/', filters);
  }

  async getProfitLossReport(filters?: ReportFilter): Promise<any> {
    return this.get('/financial/profit_lost/', filters);
  }

  async getIncomeGraphReport(filters?: ReportFilter): Promise<any> {
    return this.get('/financial/income_report/', filters);
  }

  async getExpenseGraphReport(filters?: ReportFilter): Promise<any> {
    return this.get('/financial/expense_report/', filters);
  }

  async getDashboardReport(): Promise<DashboardSummary> {
    return this.get('/financial/dashboard/');
  }

  // Custom Reports
  async createCustomReport(data: {
    name: string;
    description?: string;
    report_type: 'financial' | 'warehouse' | 'sales' | 'purchase';
    filters: ReportFilter;
    columns: string[];
    grouping?: string[];
    sorting?: string[];
  }): Promise<any> {
    return this.post('/custom_reports/', data);
  }

  async getCustomReports(
    params?: PaginationParams,
  ): Promise<{ results: any[]; count: number }> {
    return this.get('/custom_reports/', params);
  }

  async runCustomReport(
    id: string | number,
    filters?: ReportFilter,
  ): Promise<any> {
    return this.post(`/custom_reports/${id}/run/`, filters);
  }

  async updateCustomReport(id: string | number, data: any): Promise<any> {
    return this.patch(`/custom_reports/${id}/`, data);
  }

  async deleteCustomReport(id: string | number): Promise<void> {
    return this.delete(`/custom_reports/${id}/`);
  }

  // Scheduled Reports
  async createScheduledReport(data: {
    custom_report: number;
    name: string;
    schedule_type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    schedule_day?: number;
    schedule_time: string;
    email_recipients: string[];
    is_active: boolean;
  }): Promise<any> {
    return this.post('/scheduled_reports/', data);
  }

  async getScheduledReports(
    params?: PaginationParams,
  ): Promise<{ results: any[]; count: number }> {
    return this.get('/scheduled_reports/', params);
  }

  async updateScheduledReport(id: string | number, data: any): Promise<any> {
    return this.patch(`/scheduled_reports/${id}/`, data);
  }

  async deleteScheduledReport(id: string | number): Promise<void> {
    return this.delete(`/scheduled_reports/${id}/`);
  }

  async activateScheduledReport(id: string | number): Promise<any> {
    return this.patch(`/scheduled_reports/${id}/`, { is_active: true });
  }

  async deactivateScheduledReport(id: string | number): Promise<any> {
    return this.patch(`/scheduled_reports/${id}/`, { is_active: false });
  }

  // Export Reports
  async exportReport(
    reportType: string,
    format: 'pdf' | 'excel' | 'csv',
    filters?: ReportFilter,
  ): Promise<Blob> {
    const response = await this.get(`/${reportType}/export/`, {
      ...filters,
      format,
    });
    return response as unknown as Blob;
  }

  async emailReport(
    reportType: string,
    email: string,
    format: 'pdf' | 'excel' | 'csv',
    filters?: ReportFilter,
  ): Promise<any> {
    return this.post(`/${reportType}/email/`, {
      email,
      format,
      ...filters,
    });
  }

  // Report Templates
  async getReportTemplates(reportType?: string): Promise<{ results: any[] }> {
    return this.get('/templates/', { report_type: reportType });
  }

  async createReportTemplate(data: {
    name: string;
    report_type: string;
    template_data: any;
    is_default?: boolean;
  }): Promise<any> {
    return this.post('/templates/', data);
  }

  async updateReportTemplate(id: string | number, data: any): Promise<any> {
    return this.patch(`/templates/${id}/`, data);
  }

  async deleteReportTemplate(id: string | number): Promise<void> {
    return this.delete(`/templates/${id}/`);
  }

  // Comparative Reports
  async getComparativeReport(data: {
    report_type: string;
    periods: {
      name: string;
      date_from: string;
      date_to: string;
    }[];
    filters?: ReportFilter;
  }): Promise<any> {
    return this.post('/comparative/', data);
  }

  // Trend Analysis
  async getTrendAnalysis(data: {
    metric: string;
    date_from: string;
    date_to: string;
    granularity: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    filters?: ReportFilter;
  }): Promise<any> {
    return this.post('/trend_analysis/', data);
  }

  // Key Performance Indicators (KPIs)
  async getKPIs(filters?: ReportFilter): Promise<any> {
    return this.get('/kpis/', filters);
  }

  async createKPI(data: {
    name: string;
    description?: string;
    formula: string;
    target_value?: string;
    display_format: 'number' | 'percentage' | 'currency';
    chart_type?: 'line' | 'bar' | 'pie' | 'gauge';
  }): Promise<any> {
    return this.post('/kpis/', data);
  }

  async updateKPI(id: string | number, data: any): Promise<any> {
    return this.patch(`/kpis/${id}/`, data);
  }

  async deleteKPI(id: string | number): Promise<void> {
    return this.delete(`/kpis/${id}/`);
  }
}

export const reportsService = new ReportsService();
