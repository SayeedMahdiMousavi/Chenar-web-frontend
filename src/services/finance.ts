import { ApiService, PaginationParams } from './api';

export interface CashFlowEntry {
  id: number;
  amount: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
  category: {
    id: number;
    name: string;
  };
  account: {
    id: number;
    name: string;
  };
  currency: {
    id: number;
    code: string;
    symbol: string;
  };
  currency_rate?: string;
  created?: string;
  modified?: string;
}

export interface BankTransfer {
  id: number;
  from_account: {
    id: number;
    name: string;
    type: 'bank' | 'cash';
  };
  to_account: {
    id: number;
    name: string;
    type: 'bank' | 'cash';
  };
  amount: string;
  date: string;
  description?: string;
  currency: {
    id: number;
    code: string;
    symbol: string;
  };
  exchange_rate?: string;
  fees?: string;
  status: 'pending' | 'completed' | 'cancelled';
  reference_number?: string;
}

export interface CustomerPayment {
  id: number;
  customer: {
    id: number;
    name: string;
  };
  amount: string;
  type: 'payment' | 'receipt';
  date: string;
  description?: string;
  account: {
    id: number;
    name: string;
  };
  currency: {
    id: number;
    code: string;
    symbol: string;
  };
  invoice?: {
    id: number;
    invoice_number: string;
  };
  payment_method?: 'cash' | 'bank_transfer' | 'check' | 'card';
  reference_number?: string;
}

export interface SupplierPayment {
  id: number;
  supplier: {
    id: number;
    name: string;
  };
  amount: string;
  type: 'payment' | 'receipt';
  date: string;
  description?: string;
  account: {
    id: number;
    name: string;
  };
  currency: {
    id: number;
    code: string;
    symbol: string;
  };
  invoice?: {
    id: number;
    invoice_number: string;
  };
  payment_method?: 'cash' | 'bank_transfer' | 'check' | 'card';
  reference_number?: string;
}

export interface ExchangeUnionEntry {
  id: number;
  from_currency: {
    id: number;
    code: string;
    symbol: string;
  };
  to_currency: {
    id: number;
    code: string;
    symbol: string;
  };
  from_amount: string;
  to_amount: string;
  exchange_rate: string;
  date: string;
  description?: string;
  fees?: string;
}

export interface Withdrawal {
  id: number;
  account: {
    id: number;
    name: string;
  };
  amount: string;
  date: string;
  description?: string;
  withdrawn_by?: string;
  purpose?: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_by?: {
    id: number;
    username: string;
  };
}

export interface CreateCashFlowData {
  amount: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
  category: number;
  account: number;
  currency?: number;
  currency_rate?: string;
}

export interface CreateBankTransferData {
  from_account: number;
  to_account: number;
  amount: string;
  date: string;
  description?: string;
  currency?: number;
  exchange_rate?: string;
  fees?: string;
  reference_number?: string;
}

export class FinanceService extends ApiService {
  constructor() {
    super('/pay_receive_cash');
  }

  // Cash Flow Management
  async getCashFlowEntries(
    params?: PaginationParams & {
      type?: 'income' | 'expense';
      date_from?: string;
      date_to?: string;
      category?: number;
      account?: number;
    },
  ): Promise<{ results: CashFlowEntry[]; count: number }> {
    return this.get('/cash_flow/', params);
  }

  async getCashFlowEntryById(id: string | number): Promise<CashFlowEntry> {
    return this.get(`/cash_flow/${id}/`);
  }

  async createCashFlowEntry(data: CreateCashFlowData): Promise<CashFlowEntry> {
    return this.post('/cash_flow/', data);
  }

  async updateCashFlowEntry(
    id: string | number,
    data: Partial<CreateCashFlowData>,
  ): Promise<CashFlowEntry> {
    return this.patch(`/cash_flow/${id}/`, data);
  }

  async deleteCashFlowEntry(id: string | number): Promise<void> {
    return this.delete(`/cash_flow/${id}/`);
  }

  // Income Operations
  async getIncomeEntries(
    params?: PaginationParams,
  ): Promise<{ results: CashFlowEntry[]; count: number }> {
    return this.get('/income_cash/', params);
  }

  async createIncomeEntry(
    data: Omit<CreateCashFlowData, 'type'>,
  ): Promise<CashFlowEntry> {
    return this.post('/income_cash/', { ...data, type: 'income' });
  }

  async updateIncomeEntry(
    id: string | number,
    data: Partial<Omit<CreateCashFlowData, 'type'>>,
  ): Promise<CashFlowEntry> {
    return this.patch(`/income_cash/${id}/`, data);
  }

  async deleteIncomeEntry(id: string | number): Promise<void> {
    return this.delete(`/income_cash/${id}/`);
  }

  // Expense Operations
  async getExpenseEntries(
    params?: PaginationParams,
  ): Promise<{ results: CashFlowEntry[]; count: number }> {
    return this.get('/expense_cash/', params);
  }

  async createExpenseEntry(
    data: Omit<CreateCashFlowData, 'type'>,
  ): Promise<CashFlowEntry> {
    return this.post('/expense_cash/', { ...data, type: 'expense' });
  }

  async updateExpenseEntry(
    id: string | number,
    data: Partial<Omit<CreateCashFlowData, 'type'>>,
  ): Promise<CashFlowEntry> {
    return this.patch(`/expense_cash/${id}/`, data);
  }

  async deleteExpenseEntry(id: string | number): Promise<void> {
    return this.delete(`/expense_cash/${id}/`);
  }

  // Customer Financial Operations
  async getCustomerPayments(
    params?: PaginationParams & { customer?: number },
  ): Promise<{ results: CustomerPayment[]; count: number }> {
    return this.get('/customer/', params);
  }

  async createCustomerPayment(data: {
    customer: number;
    amount: string;
    type: 'payment' | 'receipt';
    date: string;
    description?: string;
    account: number;
    currency?: number;
    invoice?: number;
    payment_method?: string;
    reference_number?: string;
  }): Promise<CustomerPayment> {
    return this.post('/customer/', data);
  }

  async updateCustomerPayment(
    id: string | number,
    data: any,
  ): Promise<CustomerPayment> {
    return this.patch(`/customer/${id}/`, data);
  }

  async deleteCustomerPayment(id: string | number): Promise<void> {
    return this.delete(`/customer/${id}/`);
  }

  // Supplier Financial Operations
  async getSupplierPayments(
    params?: PaginationParams & { supplier?: number },
  ): Promise<{ results: SupplierPayment[]; count: number }> {
    return this.get('/supplier/', params);
  }

  async createSupplierPayment(data: {
    supplier: number;
    amount: string;
    type: 'payment' | 'receipt';
    date: string;
    description?: string;
    account: number;
    currency?: number;
    invoice?: number;
    payment_method?: string;
    reference_number?: string;
  }): Promise<SupplierPayment> {
    return this.post('/supplier/', data);
  }

  async updateSupplierPayment(
    id: string | number,
    data: any,
  ): Promise<SupplierPayment> {
    return this.patch(`/supplier/${id}/`, data);
  }

  async deleteSupplierPayment(id: string | number): Promise<void> {
    return this.delete(`/supplier/${id}/`);
  }

  // Staff Financial Operations
  async getStaffSalaries(
    params?: PaginationParams & { staff?: number },
  ): Promise<{ results: any[]; count: number }> {
    return this.get('/staff/salary/', params);
  }

  async createStaffSalary(data: {
    staff: number;
    amount: string;
    date: string;
    description?: string;
    currency?: number;
    salary_type?: 'monthly' | 'weekly' | 'daily' | 'hourly';
  }): Promise<any> {
    return this.post('/staff/salary/', data);
  }

  async getStaffPayments(
    params?: PaginationParams & { staff?: number },
  ): Promise<{ results: any[]; count: number }> {
    return this.get('/staff/', params);
  }

  async createStaffPayment(data: {
    staff: number;
    amount: string;
    type: 'payment' | 'receipt';
    date: string;
    description?: string;
    account: number;
    currency?: number;
  }): Promise<any> {
    return this.post('/staff/', data);
  }

  // Bank Transfers
  async getBankTransfers(
    params?: PaginationParams,
  ): Promise<{ results: BankTransfer[]; count: number }> {
    return this.get('/bank_cash_transfer/', params);
  }

  async getBankTransferById(id: string | number): Promise<BankTransfer> {
    return this.get(`/bank_cash_transfer/${id}/`);
  }

  async createBankTransfer(
    data: CreateBankTransferData,
  ): Promise<BankTransfer> {
    return this.post('/bank_cash_transfer/', data);
  }

  async updateBankTransfer(
    id: string | number,
    data: Partial<CreateBankTransferData>,
  ): Promise<BankTransfer> {
    return this.patch(`/bank_cash_transfer/${id}/`, data);
  }

  async deleteBankTransfer(id: string | number): Promise<void> {
    return this.delete(`/bank_cash_transfer/${id}/`);
  }

  async approveBankTransfer(id: string | number): Promise<BankTransfer> {
    return this.post(`/bank_cash_transfer/${id}/approve/`);
  }

  async completeBankTransfer(id: string | number): Promise<BankTransfer> {
    return this.post(`/bank_cash_transfer/${id}/complete/`);
  }

  // Exchange Operations
  async getExchangeUnionEntries(
    params?: PaginationParams,
  ): Promise<{ results: ExchangeUnionEntry[]; count: number }> {
    return this.get('/exchange_union/', params);
  }

  async createExchangeUnionEntry(data: {
    from_currency: number;
    to_currency: number;
    from_amount: string;
    to_amount: string;
    exchange_rate: string;
    date: string;
    description?: string;
    fees?: string;
  }): Promise<ExchangeUnionEntry> {
    return this.post('/exchange_union/', data);
  }

  async updateExchangeUnionEntry(
    id: string | number,
    data: any,
  ): Promise<ExchangeUnionEntry> {
    return this.patch(`/exchange_union/${id}/`, data);
  }

  async deleteExchangeUnionEntry(id: string | number): Promise<void> {
    return this.delete(`/exchange_union/${id}/`);
  }

  // Withdrawals
  async getWithdrawals(
    params?: PaginationParams,
  ): Promise<{ results: Withdrawal[]; count: number }> {
    return this.get('/withdrawal/', params);
  }

  async createWithdrawal(data: {
    account: number;
    amount: string;
    date: string;
    description?: string;
    withdrawn_by?: string;
    purpose?: string;
  }): Promise<Withdrawal> {
    return this.post('/withdrawal/', data);
  }

  async updateWithdrawal(id: string | number, data: any): Promise<Withdrawal> {
    return this.patch(`/withdrawal/${id}/`, data);
  }

  async deleteWithdrawal(id: string | number): Promise<void> {
    return this.delete(`/withdrawal/${id}/`);
  }

  async approveWithdrawal(id: string | number): Promise<Withdrawal> {
    return this.post(`/withdrawal/${id}/approve/`);
  }

  async rejectWithdrawal(
    id: string | number,
    reason?: string,
  ): Promise<Withdrawal> {
    return this.post(`/withdrawal/${id}/reject/`, { reason });
  }

  // Reports
  async getJournalReport(params?: {
    date_from?: string;
    date_to?: string;
    account_type?: string;
    currency?: number;
  }) {
    return this.get('/report/journal/', params);
  }

  async getCashFlowSummary(params?: {
    date_from?: string;
    date_to?: string;
    currency?: number;
  }) {
    return this.get('/report/cash_flow_summary/', params);
  }

  async getAccountBalances(params?: { date?: string; currency?: number }) {
    return this.get('/report/account_balances/', params);
  }

  async getPaymentSummary(params?: {
    date_from?: string;
    date_to?: string;
    type?: 'customer' | 'supplier' | 'staff';
  }) {
    return this.get('/report/payment_summary/', params);
  }
}

export const financeService = new FinanceService();
