import { ApiService, PaginationParams } from './api';

export interface Supplier {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  category?: {
    id: number;
    name: string;
  };
  credit_limit?: string;
  current_balance?: string;
  is_active: boolean;
  created?: string;
  modified?: string;
}

export interface SupplierCategory {
  id: number;
  name: string;
  description?: string;
}

export interface CreateSupplierData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  category?: number;
  credit_limit?: string;
}

export class SupplierService extends ApiService {
  constructor() {
    super('/supplier_account');
  }

  async getSuppliers(params?: PaginationParams): Promise<{ results: Supplier[]; count: number }> {
    return this.get('/supplier/', params);
  }

  async getSupplierById(id: string | number): Promise<Supplier> {
    return this.get(`/supplier/${id}/`);
  }

  async createSupplier(data: CreateSupplierData): Promise<Supplier> {
    return this.post('/supplier/', data);
  }

  async updateSupplier(id: string | number, data: Partial<CreateSupplierData>): Promise<Supplier> {
    return this.patch(`/supplier/${id}/`, data);
  }

  async deleteSupplier(id: string | number): Promise<void> {
    return this.delete(`/supplier/${id}/`);
  }

  async activateSupplier(id: string | number): Promise<Supplier> {
    return this.patch(`/supplier/${id}/`, { status: 'active' });
  }

  async deactivateSupplier(id: string | number): Promise<Supplier> {
    return this.patch(`/supplier/${id}/`, { status: 'deactivate' });
  }

  async getSupplierCategories(params?: PaginationParams): Promise<{ results: SupplierCategory[] }> {
    return this.get('/supplier_category/', params);
  }

  async createSupplierCategory(data: { name: string; description?: string }): Promise<SupplierCategory> {
    return this.post('/supplier_category/', data);
  }

  async updateSupplierCategory(id: string | number, data: { name?: string; description?: string }): Promise<SupplierCategory> {
    return this.patch(`/supplier_category/${id}/`, data);
  }

  async deleteSupplierCategory(id: string | number): Promise<void> {
    return this.delete(`/supplier_category/${id}/`);
  }

  async getSupplierPayments(supplierId: string | number, params?: PaginationParams) {
    return this.get(`/supplier/${supplierId}/payments/`, params);
  }

  async getSupplierInvoices(supplierId: string | number, params?: PaginationParams) {
    return this.get(`/supplier/${supplierId}/invoices/`, params);
  }

  async getSupplierBalance(supplierId: string | number) {
    return this.get(`/supplier/${supplierId}/balance/`);
  }

  async importSuppliers(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.post('/supplier/import/', formData);
  }

  async exportSuppliers(params?: any) {
    return this.get('/supplier/export/', params);
  }
}

export const supplierService = new SupplierService();

