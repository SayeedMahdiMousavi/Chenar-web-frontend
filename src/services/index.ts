import {
  ApiService,
  authService,
  productService,
  customerService,
} from './api';
import { supplierService } from './supplier';
import { staffService } from './staff';
import { invoiceService } from './invoice';
import { financeService } from './finance';
import { inventoryService } from './inventory';
import { reportsService } from './reports';
import { bankingService } from './banking';

// Export all services
export {
  ApiService,
  authService,
  productService,
  customerService,
} from './api';
export { supplierService } from './supplier';
export { staffService } from './staff';
export { invoiceService } from './invoice';
export { financeService } from './finance';
export { inventoryService } from './inventory';
export { reportsService } from './reports';
export { bankingService } from './banking';

// Export types
export type { ApiResponse, PaginationParams, ApiError } from './api';

export type {
  Supplier,
  SupplierCategory,
  CreateSupplierData,
} from './supplier';

export type {
  Staff,
  StaffCategory,
  CreateStaffData,
  StaffSalary,
  StaffPayment,
} from './staff';

export type {
  Invoice,
  InvoiceItem,
  CreateInvoiceData,
  SalesOrder,
  PurchaseOrder,
  Estimate,
  ProductTransfer,
  ProductAdjustment,
} from './invoice';

export type {
  CashFlowEntry,
  BankTransfer,
  CustomerPayment,
  SupplierPayment,
  ExchangeUnionEntry,
  Withdrawal,
  CreateCashFlowData,
  CreateBankTransferData,
} from './finance';

export type {
  Warehouse,
  InventoryItem,
  StockMovement,
  LowStockAlert,
  CreateWarehouseData,
} from './inventory';

export type { ReportFilter, DashboardSummary } from './reports';

export type {
  BankAccount,
  CashAccount,
  BankTransaction,
  BankStatement,
  BankReconciliation,
  CreateBankAccountData,
  CreateCashAccountData,
} from './banking';

// Service instances for easy import
export const services = {
  auth: authService,
  product: productService,
  customer: customerService,
  supplier: supplierService,
  staff: staffService,
  invoice: invoiceService,
  finance: financeService,
  inventory: inventoryService,
  reports: reportsService,
  banking: bankingService,
};
