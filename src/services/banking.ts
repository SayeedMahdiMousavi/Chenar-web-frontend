import { ApiService, PaginationParams } from './api';

export interface BankAccount {
  id: number;
  name: string;
  bank_name: string;
  account_number: string;
  iban?: string;
  swift_code?: string;
  balance: string;
  currency: {
    id: number;
    code: string;
    symbol: string;
  };
  is_active: boolean;
  account_type?: 'checking' | 'savings' | 'credit' | 'business';
  branch?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  created?: string;
  modified?: string;
}

export interface CashAccount {
  id: number;
  name: string;
  balance: string;
  currency: {
    id: number;
    code: string;
    symbol: string;
  };
  location?: string;
  responsible_person?: string;
  is_active: boolean;
  created?: string;
  modified?: string;
}

export interface BankTransaction {
  id: number;
  account: {
    id: number;
    name: string;
    account_number?: string;
  };
  transaction_type: 'credit' | 'debit';
  amount: string;
  balance_after: string;
  reference_number?: string;
  description?: string;
  transaction_date: string;
  value_date?: string;
  category?: {
    id: number;
    name: string;
  };
  is_reconciled: boolean;
  bank_statement_id?: number;
  created?: string;
}

export interface BankStatement {
  id: number;
  account: {
    id: number;
    name: string;
  };
  statement_date: string;
  opening_balance: string;
  closing_balance: string;
  total_credits: string;
  total_debits: string;
  transactions_count: number;
  is_processed: boolean;
  file_path?: string;
  created?: string;
}

export interface BankReconciliation {
  id: number;
  account: {
    id: number;
    name: string;
  };
  reconciliation_date: string;
  bank_statement_balance: string;
  book_balance: string;
  difference: string;
  status: 'pending' | 'completed' | 'discrepancy';
  reconciled_transactions: number[];
  outstanding_deposits: any[];
  outstanding_checks: any[];
  notes?: string;
  reconciled_by?: {
    id: number;
    username: string;
  };
}

export interface CreateBankAccountData {
  name: string;
  bank_name: string;
  account_number: string;
  iban?: string;
  swift_code?: string;
  currency: number;
  account_type?: string;
  branch?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  opening_balance?: string;
}

export interface CreateCashAccountData {
  name: string;
  currency: number;
  location?: string;
  responsible_person?: string;
  opening_balance?: string;
}

export class BankingService extends ApiService {
  constructor() {
    super('/banking');
  }

  // Bank Account Management
  async getBankAccounts(params?: PaginationParams): Promise<{ results: BankAccount[]; count: number }> {
    return this.get('/bank/', params);
  }

  async getBankAccountById(id: string | number): Promise<BankAccount> {
    return this.get(`/bank/${id}/`);
  }

  async createBankAccount(data: CreateBankAccountData): Promise<BankAccount> {
    return this.post('/bank/', data);
  }

  async updateBankAccount(id: string | number, data: Partial<CreateBankAccountData>): Promise<BankAccount> {
    return this.patch(`/bank/${id}/`, data);
  }

  async deleteBankAccount(id: string | number): Promise<void> {
    return this.delete(`/bank/${id}/`);
  }

  async activateBankAccount(id: string | number): Promise<BankAccount> {
    return this.patch(`/bank/${id}/`, { is_active: true });
  }

  async deactivateBankAccount(id: string | number): Promise<BankAccount> {
    return this.patch(`/bank/${id}/`, { is_active: false });
  }

  async getBankAccountBalance(id: string | number): Promise<{ balance: string; last_updated: string }> {
    return this.get(`/bank/${id}/balance/`);
  }

  async updateBankAccountBalance(id: string | number, balance: string): Promise<BankAccount> {
    return this.patch(`/bank/${id}/balance/`, { balance });
  }

  // Cash Account Management
  async getCashAccounts(params?: PaginationParams): Promise<{ results: CashAccount[]; count: number }> {
    return this.get('/cash/', params);
  }

  async getCashAccountById(id: string | number): Promise<CashAccount> {
    return this.get(`/cash/${id}/`);
  }

  async createCashAccount(data: CreateCashAccountData): Promise<CashAccount> {
    return this.post('/cash/', data);
  }

  async updateCashAccount(id: string | number, data: Partial<CreateCashAccountData>): Promise<CashAccount> {
    return this.patch(`/cash/${id}/`, data);
  }

  async deleteCashAccount(id: string | number): Promise<void> {
    return this.delete(`/cash/${id}/`);
  }

  async activateCashAccount(id: string | number): Promise<CashAccount> {
    return this.patch(`/cash/${id}/`, { is_active: true });
  }

  async deactivateCashAccount(id: string | number): Promise<CashAccount> {
    return this.patch(`/cash/${id}/`, { is_active: false });
  }

  async getCashAccountBalance(id: string | number): Promise<{ balance: string; last_updated: string }> {
    return this.get(`/cash/${id}/balance/`);
  }

  async updateCashAccountBalance(id: string | number, balance: string): Promise<CashAccount> {
    return this.patch(`/cash/${id}/balance/`, { balance });
  }

  // Bank Transactions
  async getBankTransactions(params?: PaginationParams & {
    account?: number;
    transaction_type?: 'credit' | 'debit';
    date_from?: string;
    date_to?: string;
    is_reconciled?: boolean;
  }): Promise<{ results: BankTransaction[]; count: number }> {
    return this.get('/transactions/', params);
  }

  async getBankTransactionById(id: string | number): Promise<BankTransaction> {
    return this.get(`/transactions/${id}/`);
  }

  async createBankTransaction(data: {
    account: number;
    transaction_type: 'credit' | 'debit';
    amount: string;
    reference_number?: string;
    description?: string;
    transaction_date: string;
    value_date?: string;
    category?: number;
  }): Promise<BankTransaction> {
    return this.post('/transactions/', data);
  }

  async updateBankTransaction(id: string | number, data: any): Promise<BankTransaction> {
    return this.patch(`/transactions/${id}/`, data);
  }

  async deleteBankTransaction(id: string | number): Promise<void> {
    return this.delete(`/transactions/${id}/`);
  }

  async reconcileTransaction(id: string | number): Promise<BankTransaction> {
    return this.patch(`/transactions/${id}/`, { is_reconciled: true });
  }

  async unreconcileTransaction(id: string | number): Promise<BankTransaction> {
    return this.patch(`/transactions/${id}/`, { is_reconciled: false });
  }

  // Bank Statements
  async getBankStatements(params?: PaginationParams & {
    account?: number;
    date_from?: string;
    date_to?: string;
    is_processed?: boolean;
  }): Promise<{ results: BankStatement[]; count: number }> {
    return this.get('/statements/', params);
  }

  async getBankStatementById(id: string | number): Promise<BankStatement> {
    return this.get(`/statements/${id}/`);
  }

  async uploadBankStatement(accountId: number, file: File, statementDate: string): Promise<BankStatement> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('account', accountId.toString());
    formData.append('statement_date', statementDate);
    return this.post('/statements/upload/', formData);
  }

  async processBankStatement(id: string | number): Promise<BankStatement> {
    return this.post(`/statements/${id}/process/`);
  }

  async deleteBankStatement(id: string | number): Promise<void> {
    return this.delete(`/statements/${id}/`);
  }

  async getBankStatementTransactions(statementId: string | number): Promise<{ results: BankTransaction[] }> {
    return this.get(`/statements/${statementId}/transactions/`);
  }

  // Bank Reconciliation
  async getBankReconciliations(params?: PaginationParams & {
    account?: number;
    status?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<{ results: BankReconciliation[]; count: number }> {
    return this.get('/reconciliations/', params);
  }

  async getBankReconciliationById(id: string | number): Promise<BankReconciliation> {
    return this.get(`/reconciliations/${id}/`);
  }

  async createBankReconciliation(data: {
    account: number;
    reconciliation_date: string;
    bank_statement_balance: string;
    book_balance: string;
    notes?: string;
  }): Promise<BankReconciliation> {
    return this.post('/reconciliations/', data);
  }

  async updateBankReconciliation(id: string | number, data: any): Promise<BankReconciliation> {
    return this.patch(`/reconciliations/${id}/`, data);
  }

  async completeBankReconciliation(id: string | number, data: {
    reconciled_transactions: number[];
    outstanding_deposits?: any[];
    outstanding_checks?: any[];
    notes?: string;
  }): Promise<BankReconciliation> {
    return this.post(`/reconciliations/${id}/complete/`, data);
  }

  async deleteBankReconciliation(id: string | number): Promise<void> {
    return this.delete(`/reconciliations/${id}/`);
  }

  // Automated Reconciliation
  async autoReconcile(accountId: number, statementId: number, tolerance: string = '0.01'): Promise<{
    matched_transactions: number;
    unmatched_bank_transactions: number;
    unmatched_book_transactions: number;
    total_difference: string;
  }> {
    return this.post('/reconciliations/auto_reconcile/', {
      account: accountId,
      statement: statementId,
      tolerance,
    });
  }

  // Banking Reports
  async getBankAccountSummary(accountId?: number, dateFrom?: string, dateTo?: string) {
    return this.get('/reports/account_summary/', {
      account: accountId,
      date_from: dateFrom,
      date_to: dateTo,
    });
  }

  async getCashFlowReport(dateFrom?: string, dateTo?: string, accounts?: number[]) {
    return this.get('/reports/cash_flow/', {
      date_from: dateFrom,
      date_to: dateTo,
      accounts: accounts?.join(','),
    });
  }

  async getReconciliationReport(accountId?: number, dateFrom?: string, dateTo?: string) {
    return this.get('/reports/reconciliation/', {
      account: accountId,
      date_from: dateFrom,
      date_to: dateTo,
    });
  }

  async getBankChargesReport(dateFrom?: string, dateTo?: string) {
    return this.get('/reports/bank_charges/', {
      date_from: dateFrom,
      date_to: dateTo,
    });
  }

  // Import/Export
  async importBankTransactions(accountId: number, file: File, format: 'csv' | 'excel' | 'qif' | 'ofx'): Promise<{
    imported_count: number;
    skipped_count: number;
    errors: any[];
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('account', accountId.toString());
    formData.append('format', format);
    return this.post('/transactions/import/', formData);
  }

  async exportBankTransactions(params: {
    account?: number;
    date_from?: string;
    date_to?: string;
    format: 'csv' | 'excel' | 'pdf';
  }): Promise<Blob> {
    const response = await this.get('/transactions/export/', params);
    return response;
  }

  // Account Categories
  async getAccountCategories(): Promise<{ results: any[] }> {
    return this.get('/account_categories/');
  }

  async createAccountCategory(data: {
    name: string;
    description?: string;
    category_type: 'income' | 'expense' | 'transfer';
  }): Promise<any> {
    return this.post('/account_categories/', data);
  }

  async updateAccountCategory(id: string | number, data: any): Promise<any> {
    return this.patch(`/account_categories/${id}/`, data);
  }

  async deleteAccountCategory(id: string | number): Promise<void> {
    return this.delete(`/account_categories/${id}/`);
  }
}

export const bankingService = new BankingService();

