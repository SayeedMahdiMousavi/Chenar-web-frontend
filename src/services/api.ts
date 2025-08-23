import { AxiosResponse } from 'axios';
import axiosInstance from '../pages/ApiBaseUrl';

// Generic API service types
export interface ApiResponse<T = any> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: T[];
  data?: T;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

// Base API service class
export class ApiService {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Generic GET request
  async get<T>(
    endpoint: string = '',
    params?: Record<string, any>,
  ): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.get(
      `${this.baseUrl}${endpoint}`,
      { params },
    );
    return response.data;
  }

  // Generic POST request
  async post<T, D = any>(endpoint: string = '', data?: D): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.post(
      `${this.baseUrl}${endpoint}`,
      data,
    );
    return response.data;
  }

  // Generic PUT request
  async put<T, D = any>(endpoint: string = '', data?: D): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.put(
      `${this.baseUrl}${endpoint}`,
      data,
    );
    return response.data;
  }

  // Generic PATCH request
  async patch<T, D = any>(endpoint: string = '', data?: D): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.patch(
      `${this.baseUrl}${endpoint}`,
      data,
    );
    return response.data;
  }

  // Generic DELETE request
  async delete<T>(endpoint: string = ''): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.delete(
      `${this.baseUrl}${endpoint}`,
    );
    return response.data;
  }

  // Paginated list request
  async list<T>(params?: PaginationParams): Promise<ApiResponse<T>> {
    return this.get<ApiResponse<T>>('', params);
  }

  // Get single item by ID
  async getById<T>(id: string | number): Promise<T> {
    return this.get<T>(`${id}/`);
  }

  // Create new item
  async create<T, D = any>(data: D): Promise<T> {
    return this.post<T, D>('', data);
  }

  // Update item by ID
  async update<T, D = any>(id: string | number, data: D): Promise<T> {
    return this.patch<T, D>(`${id}/`, data);
  }

  // Delete item by ID
  async deleteById<T>(id: string | number): Promise<T> {
    return this.delete<T>(`${id}/`);
  }

  // Activate/Deactivate item
  async setStatus<T>(
    id: string | number,
    status: 'active' | 'deactivate',
  ): Promise<T> {
    return this.patch<T>(`${id}/`, { status });
  }

  // Bulk operations
  async bulkCreate<T, D = any>(data: D[]): Promise<T> {
    return this.post<T>('bulk_create/', data);
  }

  async bulkUpdate<T, D = any>(data: D[]): Promise<T> {
    return this.put<T>('bulk_update/', data);
  }

  async bulkDelete<T>(ids: (string | number)[]): Promise<T> {
    return this.post<T>('bulk_delete/', { ids });
  }
}

// Specialized services
export class AuthService extends ApiService {
  constructor() {
    super('/user_account');
  }

  async login(credentials: { username: string; password: string }) {
    return this.post('/tokens/obtain/', credentials);
  }

  async refreshToken(refreshToken: string) {
    return this.post('/tokens/refresh/', { refresh: refreshToken });
  }

  async logout(refreshToken: string) {
    return this.post('/tokens/blacklist/', { refresh_token: refreshToken });
  }

  async resetPassword(email: string) {
    return this.post('/reset_password/send_email', { email });
  }

  async confirmResetPassword(token: string, password: string) {
    return this.post('/reset_password/confirm', { token, password });
  }

  async getUserProfile(username: string) {
    return this.get(`/user_profile/${username}/?expand=*`);
  }

  async updateUserProfile(username: string, data: any) {
    return this.patch(`/user_profile/${username}/`, data);
  }

  async checkPassword(password: string) {
    return this.post('/user_profile/check_password/', { password });
  }

  async getUserPermissions(username: string) {
    return this.get(`/user_profile/${username}/permissions/`);
  }

  async getPermissions() {
    return this.get('/permit/format_permission/?page_size=100');
  }

  async getRoles() {
    return this.get('/roles/');
  }

  async createRole(data: any) {
    return this.post('/roles/', data);
  }

  async inviteUser(data: any) {
    return this.post('/add_user/', data);
  }

  async acceptInvitation(data: any) {
    return this.post('/accept_invite/', data);
  }
}

export class ProductService extends ApiService {
  constructor() {
    super('/product');
  }

  async getProducts(
    params?: PaginationParams & {
      category?: string;
      supplier?: string;
      is_pine?: boolean;
      is_asset?: boolean;
      status?: string;
    },
  ) {
    return this.get('/items/', {
      ...params,
      expand: '*,product_units.unit,vip_price,product_barcode.unit',
      omit: 'product_statistic,min_max,is_pine,cht_account_id,category.get_fomrated_path,category.description,category.node_parent,category.system_default,category.is_leaf,category.depth,created_by.first_name',
    });
  }

  async getProductById(id: string | number) {
    return this.get(`/items/${id}/`);
  }

  async createProduct(data: any) {
    return this.post('/items/', data);
  }

  async updateProduct(id: string | number, data: any) {
    return this.patch(`/items/${id}/`, data);
  }

  async updateProductUnits(id: string | number, units: any[]) {
    return this.put(`/items/${id}/update_unit/`, units);
  }

  async getLatestProducts() {
    return this.get('/items/latest_product/');
  }

  async getBestSellingProducts() {
    return this.get('/items/best_selling/');
  }

  async generateUniqueBarcodes(count: number = 5) {
    return this.get(`/items/generate_unique_barcode/?count=${count}`);
  }

  async getCategories() {
    return this.get('/category/');
  }

  async createCategory(data: any) {
    return this.post('/category/', data);
  }

  async getUnits() {
    return this.get('/unit/');
  }

  async createUnit(data: any) {
    return this.post('/unit/', data);
  }

  async getPrices(params?: any) {
    return this.get('/price/', params);
  }

  async bulkCreatePrices(data: any[]) {
    return this.post('/price/bulk_create/', data);
  }

  async bulkUpdatePrices(productId: string | number, data: any[]) {
    return this.put(`/price/bulk_update/${productId}/`, data);
  }

  async getBarcodes() {
    return this.get('/items/barcode/');
  }

  async createBarcode(data: any) {
    return this.post('/items/barcode/', data);
  }

  async getUnitConversions() {
    return this.get('/unit/conversion/');
  }

  async bulkCreateConversions(data: any[]) {
    return this.post('/unit/conversion/bulk_create/', data);
  }

  async bulkUpdateConversions(productId: string | number, data: any[]) {
    return this.put(`/unit/conversion/bulk_update/${productId}/`, data);
  }

  async getVipPrices() {
    return this.get('/price/vip/');
  }

  async bulkUpdateVipPrices(data: { products: number[]; vip_percent: string }) {
    return this.put('/items/bulk/update/vip_price/', data);
  }

  async getProductSettings() {
    return this.get('/setting/');
  }

  async updateProductSettings(id: string | number, data: any) {
    return this.put(`/setting/${id}/`, data);
  }
}

export class CustomerService extends ApiService {
  constructor() {
    super('/customer_account');
  }

  async getCustomers(params?: PaginationParams) {
    return this.list(params);
  }

  async getCustomerById(id: string | number) {
    return this.getById(id);
  }

  async createCustomer(data: any) {
    return this.post('/customer/', data);
  }

  async updateCustomer(id: string | number, data: any) {
    return this.patch(`/customer/${id}/`, data);
  }

  async deleteCustomer(id: string | number) {
    return this.delete(`/customer/${id}/`);
  }

  async activateCustomer(id: string | number) {
    return this.patch(`/customer/${id}/`, { status: 'active' });
  }

  async deactivateCustomer(id: string | number) {
    return this.patch(`/customer/${id}/`, { status: 'deactivate' });
  }

  async getCustomerCategories() {
    return this.get('/customer_category/');
  }

  async createCustomerCategory(data: any) {
    return this.post('/customer_category/', data);
  }

  async getDiscountTypes() {
    return this.get('/discount/type/');
  }

  async getDiscountCards() {
    return this.get('/discount/card/');
  }

  async getCustomerDiscounts() {
    return this.get('/discount/customer/');
  }
}

// Service instances
export const authService = new AuthService();
export const productService = new ProductService();
export const customerService = new CustomerService();
