import { ApiService, PaginationParams } from './api';

export interface InvoiceItem {
  id?: number;
  product: number;
  quantity: string;
  unit_price: string;
  total: string;
  unit?: number;
  description?: string;
  discount?: string;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  customer?: {
    id: number;
    name: string;
  };
  supplier?: {
    id: number;
    name: string;
  };
  invoice_date: string;
  due_date?: string;
  subtotal: string;
  tax_amount?: string;
  discount?: string;
  total_amount: string;
  status: 'draft' | 'pending' | 'paid' | 'cancelled';
  items: InvoiceItem[];
  notes?: string;
  created?: string;
  modified?: string;
}

export interface CreateInvoiceData {
  customer?: number;
  supplier?: number;
  invoice_date: string;
  due_date?: string;
  items: Omit<InvoiceItem, 'id'>[];
  notes?: string;
  discount?: string;
  tax_amount?: string;
  status?: string;
}

export interface SalesOrder extends Omit<Invoice, 'status'> {
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  delivery_date?: string;
}

export interface PurchaseOrder extends Omit<Invoice, 'status' | 'customer'> {
  status: 'pending' | 'confirmed' | 'received' | 'cancelled';
  expected_delivery_date?: string;
}

export interface Estimate extends Omit<Invoice, 'status' | 'invoice_number'> {
  estimate_number: string;
  valid_until?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
}

export interface ProductTransfer {
  id: number;
  transfer_number: string;
  from_warehouse: {
    id: number;
    name: string;
  };
  to_warehouse: {
    id: number;
    name: string;
  };
  transfer_date: string;
  items: InvoiceItem[];
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled';
  notes?: string;
}

export interface ProductAdjustment {
  id: number;
  adjustment_number: string;
  warehouse: {
    id: number;
    name: string;
  };
  adjustment_date: string;
  items: (InvoiceItem & {
    adjustment_type: 'increase' | 'decrease';
    reason?: string;
  })[];
  status: 'pending' | 'approved' | 'completed';
  notes?: string;
}

export class InvoiceService extends ApiService {
  constructor() {
    super('/invoice');
  }

  // Sales Invoices
  async getSalesInvoices(
    params?: PaginationParams,
  ): Promise<{ results: Invoice[]; count: number }> {
    return this.get('/sales/', params);
  }

  async getSalesInvoiceById(id: string | number): Promise<Invoice> {
    return this.get(`/sales/${id}/`);
  }

  async createSalesInvoice(data: CreateInvoiceData): Promise<Invoice> {
    return this.post('/sales/', data);
  }

  async updateSalesInvoice(
    id: string | number,
    data: Partial<CreateInvoiceData>,
  ): Promise<Invoice> {
    return this.patch(`/sales/${id}/`, data);
  }

  async deleteSalesInvoice(id: string | number): Promise<void> {
    return this.delete(`/sales/${id}/`);
  }

  // Purchase Invoices
  async getPurchaseInvoices(
    params?: PaginationParams,
  ): Promise<{ results: Invoice[]; count: number }> {
    return this.get('/purchase/', params);
  }

  async getPurchaseInvoiceById(id: string | number): Promise<Invoice> {
    return this.get(`/purchase/${id}/`);
  }

  async createPurchaseInvoice(data: CreateInvoiceData): Promise<Invoice> {
    return this.post('/purchase/', data);
  }

  async updatePurchaseInvoice(
    id: string | number,
    data: Partial<CreateInvoiceData>,
  ): Promise<Invoice> {
    return this.patch(`/purchase/${id}/`, data);
  }

  async deletePurchaseInvoice(id: string | number): Promise<void> {
    return this.delete(`/purchase/${id}/`);
  }

  // Sales Orders
  async getSalesOrders(
    params?: PaginationParams,
  ): Promise<{ results: SalesOrder[]; count: number }> {
    return this.get('/sales_order/', params);
  }

  async getSalesOrderById(id: string | number): Promise<SalesOrder> {
    return this.get(`/sales_order/${id}/`);
  }

  async createSalesOrder(
    data: CreateInvoiceData & { delivery_date?: string },
  ): Promise<SalesOrder> {
    return this.post('/sales_order/', data);
  }

  async updateSalesOrder(
    id: string | number,
    data: Partial<CreateInvoiceData & { delivery_date?: string }>,
  ): Promise<SalesOrder> {
    return this.patch(`/sales_order/${id}/`, data);
  }

  async deleteSalesOrder(id: string | number): Promise<void> {
    return this.delete(`/sales_order/${id}/`);
  }

  async convertSalesOrderToInvoice(id: string | number): Promise<Invoice> {
    return this.post(`/sales_order/${id}/convert_to_invoice/`);
  }

  // Purchase Orders
  async getPurchaseOrders(
    params?: PaginationParams,
  ): Promise<{ results: PurchaseOrder[]; count: number }> {
    return this.get('/purchase_order/', params);
  }

  async getPurchaseOrderById(id: string | number): Promise<PurchaseOrder> {
    return this.get(`/purchase_order/${id}/`);
  }

  async createPurchaseOrder(
    data: CreateInvoiceData & { expected_delivery_date?: string },
  ): Promise<PurchaseOrder> {
    return this.post('/purchase_order/', data);
  }

  async updatePurchaseOrder(
    id: string | number,
    data: Partial<CreateInvoiceData & { expected_delivery_date?: string }>,
  ): Promise<PurchaseOrder> {
    return this.patch(`/purchase_order/${id}/`, data);
  }

  async deletePurchaseOrder(id: string | number): Promise<void> {
    return this.delete(`/purchase_order/${id}/`);
  }

  async convertPurchaseOrderToInvoice(id: string | number): Promise<Invoice> {
    return this.post(`/purchase_order/${id}/convert_to_invoice/`);
  }

  // Estimates
  async getEstimates(
    params?: PaginationParams,
  ): Promise<{ results: Estimate[]; count: number }> {
    return this.get('/estimate/', params);
  }

  async getEstimateById(id: string | number): Promise<Estimate> {
    return this.get(`/estimate/${id}/`);
  }

  async createEstimate(
    data: CreateInvoiceData & { valid_until?: string },
  ): Promise<Estimate> {
    return this.post('/estimate/', data);
  }

  async updateEstimate(
    id: string | number,
    data: Partial<CreateInvoiceData & { valid_until?: string }>,
  ): Promise<Estimate> {
    return this.patch(`/estimate/${id}/`, data);
  }

  async deleteEstimate(id: string | number): Promise<void> {
    return this.delete(`/estimate/${id}/`);
  }

  async convertEstimateToInvoice(id: string | number): Promise<Invoice> {
    return this.post(`/estimate/${id}/convert_to_invoice/`);
  }

  async convertEstimateToSalesOrder(id: string | number): Promise<SalesOrder> {
    return this.post(`/estimate/${id}/convert_to_sales_order/`);
  }

  // Product Transfers
  async getProductTransfers(
    params?: PaginationParams,
  ): Promise<{ results: ProductTransfer[]; count: number }> {
    return this.get('/transfer/', params);
  }

  async getProductTransferById(id: string | number): Promise<ProductTransfer> {
    return this.get(`/transfer/${id}/`);
  }

  async createProductTransfer(
    data: Omit<ProductTransfer, 'id' | 'transfer_number'>,
  ): Promise<ProductTransfer> {
    return this.post('/transfer/', data);
  }

  async updateProductTransfer(
    id: string | number,
    data: Partial<Omit<ProductTransfer, 'id' | 'transfer_number'>>,
  ): Promise<ProductTransfer> {
    return this.patch(`/transfer/${id}/`, data);
  }

  async deleteProductTransfer(id: string | number): Promise<void> {
    return this.delete(`/transfer/${id}/`);
  }

  async approveProductTransfer(id: string | number): Promise<ProductTransfer> {
    return this.post(`/transfer/${id}/approve/`);
  }

  async completeProductTransfer(id: string | number): Promise<ProductTransfer> {
    return this.post(`/transfer/${id}/complete/`);
  }

  // Product Adjustments
  async getProductAdjustments(
    params?: PaginationParams,
  ): Promise<{ results: ProductAdjustment[]; count: number }> {
    return this.get('/adjustment/', params);
  }

  async getProductAdjustmentById(
    id: string | number,
  ): Promise<ProductAdjustment> {
    return this.get(`/adjustment/${id}/`);
  }

  async createProductAdjustment(
    data: Omit<ProductAdjustment, 'id' | 'adjustment_number'>,
  ): Promise<ProductAdjustment> {
    return this.post('/adjustment/', data);
  }

  async updateProductAdjustment(
    id: string | number,
    data: Partial<Omit<ProductAdjustment, 'id' | 'adjustment_number'>>,
  ): Promise<ProductAdjustment> {
    return this.patch(`/adjustment/${id}/`, data);
  }

  async deleteProductAdjustment(id: string | number): Promise<void> {
    return this.delete(`/adjustment/${id}/`);
  }

  async approveProductAdjustment(
    id: string | number,
  ): Promise<ProductAdjustment> {
    return this.post(`/adjustment/${id}/approve/`);
  }

  async completeProductAdjustment(
    id: string | number,
  ): Promise<ProductAdjustment> {
    return this.post(`/adjustment/${id}/complete/`);
  }

  // Common operations
  async getInvoiceStatistics(params?: {
    date_from?: string;
    date_to?: string;
    type?: string;
  }) {
    return this.get('/statistics/', params);
  }

  async printInvoice(
    type: string,
    id: string | number,
    format: 'pdf' | 'html' = 'pdf',
  ) {
    return this.get(`/${type}/${id}/print/?format=${format}`);
  }

  async emailInvoice(type: string, id: string | number, email: string) {
    return this.post(`/${type}/${id}/email/`, { email });
  }

  async duplicateInvoice(type: string, id: string | number) {
    return this.post(`/${type}/${id}/duplicate/`);
  }
}

export const invoiceService = new InvoiceService();
