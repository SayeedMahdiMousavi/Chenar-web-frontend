import { ApiService, PaginationParams } from './api';

export interface Warehouse {
  id: number;
  name: string;
  location?: string;
  address?: string;
  manager?: string;
  capacity?: string;
  current_stock?: string;
  is_active: boolean;
  created?: string;
  modified?: string;
}

export interface InventoryItem {
  id: number;
  product: {
    id: number;
    name: string;
    barcode?: string;
  };
  warehouse: {
    id: number;
    name: string;
  };
  quantity: string;
  reserved_quantity?: string;
  available_quantity?: string;
  unit: {
    id: number;
    name: string;
    symbol: string;
  };
  cost_per_unit?: string;
  total_value?: string;
  last_updated?: string;
  expiry_date?: string;
  batch_number?: string;
  location_in_warehouse?: string;
}

export interface StockMovement {
  id: number;
  product: {
    id: number;
    name: string;
  };
  warehouse: {
    id: number;
    name: string;
  };
  movement_type: 'in' | 'out' | 'transfer' | 'adjustment';
  quantity: string;
  unit: {
    id: number;
    name: string;
  };
  reference_type?:
    | 'sales_invoice'
    | 'purchase_invoice'
    | 'transfer'
    | 'adjustment';
  reference_id?: number;
  date: string;
  description?: string;
  created_by?: {
    id: number;
    username: string;
  };
}

export interface LowStockAlert {
  id: number;
  product: {
    id: number;
    name: string;
  };
  warehouse: {
    id: number;
    name: string;
  };
  current_quantity: string;
  minimum_quantity: string;
  recommended_order_quantity?: string;
  last_restocked?: string;
  status: 'active' | 'resolved' | 'ignored';
}

export interface CreateWarehouseData {
  name: string;
  location?: string;
  address?: string;
  manager?: string;
  capacity?: string;
}

export class InventoryService extends ApiService {
  constructor() {
    super('/inventory');
  }

  // Warehouse Management
  async getWarehouses(
    params?: PaginationParams,
  ): Promise<{ results: Warehouse[]; count: number }> {
    return this.get('/warehouse/', params);
  }

  async getWarehouseById(id: string | number): Promise<Warehouse> {
    return this.get(`/warehouse/${id}/`);
  }

  async createWarehouse(data: CreateWarehouseData): Promise<Warehouse> {
    return this.post('/warehouse/', data);
  }

  async updateWarehouse(
    id: string | number,
    data: Partial<CreateWarehouseData>,
  ): Promise<Warehouse> {
    return this.patch(`/warehouse/${id}/`, data);
  }

  async deleteWarehouse(id: string | number): Promise<void> {
    return this.delete(`/warehouse/${id}/`);
  }

  async activateWarehouse(id: string | number): Promise<Warehouse> {
    return this.patch(`/warehouse/${id}/`, { is_active: true });
  }

  async deactivateWarehouse(id: string | number): Promise<Warehouse> {
    return this.patch(`/warehouse/${id}/`, { is_active: false });
  }

  // Inventory Items
  async getInventoryItems(
    params?: PaginationParams & {
      warehouse?: number;
      product?: number;
      low_stock?: boolean;
      expiring_soon?: boolean;
    },
  ): Promise<{ results: InventoryItem[]; count: number }> {
    return this.get('/items/', params);
  }

  async getInventoryItemById(id: string | number): Promise<InventoryItem> {
    return this.get(`/items/${id}/`);
  }

  async updateInventoryItem(
    id: string | number,
    data: {
      quantity?: string;
      cost_per_unit?: string;
      expiry_date?: string;
      batch_number?: string;
      location_in_warehouse?: string;
    },
  ): Promise<InventoryItem> {
    return this.patch(`/items/${id}/`, data);
  }

  async getProductInventory(
    productId: string | number,
    warehouseId?: number,
  ): Promise<InventoryItem[]> {
    const params = warehouseId ? { warehouse: warehouseId } : {};
    return this.get(`/items/by_product/${productId}/`, params);
  }

  async getWarehouseInventory(
    warehouseId: string | number,
    params?: PaginationParams,
  ): Promise<{ results: InventoryItem[]; count: number }> {
    return this.get(`/items/by_warehouse/${warehouseId}/`, params);
  }

  // Stock Movements
  async getStockMovements(
    params?: PaginationParams & {
      product?: number;
      warehouse?: number;
      movement_type?: string;
      date_from?: string;
      date_to?: string;
    },
  ): Promise<{ results: StockMovement[]; count: number }> {
    return this.get('/movements/', params);
  }

  async getStockMovementById(id: string | number): Promise<StockMovement> {
    return this.get(`/movements/${id}/`);
  }

  async createStockMovement(data: {
    product: number;
    warehouse: number;
    movement_type: 'in' | 'out' | 'transfer' | 'adjustment';
    quantity: string;
    unit: number;
    reference_type?: string;
    reference_id?: number;
    date: string;
    description?: string;
  }): Promise<StockMovement> {
    return this.post('/movements/', data);
  }

  async getProductMovementHistory(
    productId: string | number,
    params?: PaginationParams,
  ): Promise<{ results: StockMovement[]; count: number }> {
    return this.get(`/movements/by_product/${productId}/`, params);
  }

  // Stock Adjustments
  async createStockAdjustment(data: {
    warehouse: number;
    adjustments: {
      product: number;
      quantity: string;
      adjustment_type: 'increase' | 'decrease';
      reason?: string;
    }[];
    description?: string;
  }) {
    return this.post('/adjustments/', data);
  }

  async getStockAdjustments(
    params?: PaginationParams,
  ): Promise<{ results: any[]; count: number }> {
    return this.get('/adjustments/', params);
  }

  async approveStockAdjustment(id: string | number) {
    return this.post(`/adjustments/${id}/approve/`);
  }

  // Stock Transfers
  async createStockTransfer(data: {
    from_warehouse: number;
    to_warehouse: number;
    items: {
      product: number;
      quantity: string;
      unit: number;
    }[];
    description?: string;
  }) {
    return this.post('/transfers/', data);
  }

  async getStockTransfers(
    params?: PaginationParams,
  ): Promise<{ results: any[]; count: number }> {
    return this.get('/transfers/', params);
  }

  async approveStockTransfer(id: string | number) {
    return this.post(`/transfers/${id}/approve/`);
  }

  async completeStockTransfer(id: string | number) {
    return this.post(`/transfers/${id}/complete/`);
  }

  // Low Stock Alerts
  async getLowStockAlerts(
    params?: PaginationParams & {
      warehouse?: number;
      status?: string;
    },
  ): Promise<{ results: LowStockAlert[]; count: number }> {
    return this.get('/low_stock_alerts/', params);
  }

  async updateLowStockAlert(
    id: string | number,
    data: {
      status?: 'active' | 'resolved' | 'ignored';
      recommended_order_quantity?: string;
    },
  ): Promise<LowStockAlert> {
    return this.patch(`/low_stock_alerts/${id}/`, data);
  }

  async setMinimumStockLevel(data: {
    product: number;
    warehouse: number;
    minimum_quantity: string;
    reorder_quantity?: string;
  }) {
    return this.post('/minimum_stock_levels/', data);
  }

  async getMinimumStockLevels(
    params?: PaginationParams,
  ): Promise<{ results: any[]; count: number }> {
    return this.get('/minimum_stock_levels/', params);
  }

  // Inventory Reports
  async getInventoryValuation(params?: {
    warehouse?: number;
    date?: string;
    category?: number;
  }) {
    return this.get('/reports/valuation/', params);
  }

  async getStockLevelsReport(params?: {
    warehouse?: number;
    low_stock_only?: boolean;
    category?: number;
  }) {
    return this.get('/reports/stock_levels/', params);
  }

  async getMovementSummary(params?: {
    date_from?: string;
    date_to?: string;
    warehouse?: number;
    product?: number;
  }) {
    return this.get('/reports/movement_summary/', params);
  }

  async getExpiringProductsReport(params?: {
    warehouse?: number;
    days_ahead?: number;
  }) {
    return this.get('/reports/expiring_products/', params);
  }

  async getInventoryTurnoverReport(params?: {
    date_from?: string;
    date_to?: string;
    warehouse?: number;
    category?: number;
  }) {
    return this.get('/reports/turnover/', params);
  }

  // Stock Count
  async createStockCount(data: {
    warehouse: number;
    count_date: string;
    items: {
      product: number;
      counted_quantity: string;
      unit: number;
    }[];
    description?: string;
  }) {
    return this.post('/stock_counts/', data);
  }

  async getStockCounts(
    params?: PaginationParams,
  ): Promise<{ results: any[]; count: number }> {
    return this.get('/stock_counts/', params);
  }

  async approveStockCount(id: string | number) {
    return this.post(`/stock_counts/${id}/approve/`);
  }

  // Batch and Serial Number Tracking
  async getBatches(
    params?: PaginationParams & {
      product?: number;
      warehouse?: number;
      expired?: boolean;
    },
  ): Promise<{ results: any[]; count: number }> {
    return this.get('/batches/', params);
  }

  async createBatch(data: {
    product: number;
    warehouse: number;
    batch_number: string;
    quantity: string;
    expiry_date?: string;
    manufacture_date?: string;
    supplier?: number;
  }) {
    return this.post('/batches/', data);
  }

  async getSerialNumbers(
    params?: PaginationParams & {
      product?: number;
      warehouse?: number;
      status?: string;
    },
  ): Promise<{ results: any[]; count: number }> {
    return this.get('/serial_numbers/', params);
  }

  async createSerialNumber(data: {
    product: number;
    warehouse: number;
    serial_number: string;
    status?: 'available' | 'sold' | 'damaged' | 'returned';
  }) {
    return this.post('/serial_numbers/', data);
  }
}

export const inventoryService = new InventoryService();
