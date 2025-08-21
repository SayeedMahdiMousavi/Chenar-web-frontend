import { ApiService, PaginationParams } from './api';

export interface Staff {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  salary?: string;
  hire_date?: string;
  category?: {
    id: number;
    name: string;
  };
  is_active: boolean;
  photo?: string;
  created?: string;
  modified?: string;
}

export interface StaffCategory {
  id: number;
  name: string;
  description?: string;
}

export interface CreateStaffData {
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  salary?: string;
  hire_date?: string;
  category?: number;
  photo?: string;
}

export interface StaffSalary {
  id: number;
  staff: number;
  amount: string;
  date: string;
  description?: string;
  currency: number;
}

export interface StaffPayment {
  id: number;
  staff: number;
  amount: string;
  type: 'payment' | 'receipt';
  date: string;
  description?: string;
  account: number;
  currency: number;
}

export class StaffService extends ApiService {
  constructor() {
    super('/staff_account');
  }

  async getStaff(params?: PaginationParams): Promise<{ results: Staff[]; count: number }> {
    return this.get('/staff/', params);
  }

  async getStaffById(id: string | number): Promise<Staff> {
    return this.get(`/staff/${id}/`);
  }

  async createStaff(data: CreateStaffData): Promise<Staff> {
    return this.post('/staff/', data);
  }

  async updateStaff(id: string | number, data: Partial<CreateStaffData>): Promise<Staff> {
    return this.patch(`/staff/${id}/`, data);
  }

  async deleteStaff(id: string | number): Promise<void> {
    return this.delete(`/staff/${id}/`);
  }

  async activateStaff(id: string | number): Promise<Staff> {
    return this.patch(`/staff/${id}/`, { status: 'active' });
  }

  async deactivateStaff(id: string | number): Promise<Staff> {
    return this.patch(`/staff/${id}/`, { status: 'deactivate' });
  }

  async getStaffCategories(params?: PaginationParams): Promise<{ results: StaffCategory[] }> {
    return this.get('/staff_category/', params);
  }

  async createStaffCategory(data: { name: string; description?: string }): Promise<StaffCategory> {
    return this.post('/staff_category/', data);
  }

  async updateStaffCategory(id: string | number, data: { name?: string; description?: string }): Promise<StaffCategory> {
    return this.patch(`/staff_category/${id}/`, data);
  }

  async deleteStaffCategory(id: string | number): Promise<void> {
    return this.delete(`/staff_category/${id}/`);
  }

  // Staff Financial Operations
  async getStaffSalaries(params?: PaginationParams & { staff?: number }): Promise<{ results: StaffSalary[] }> {
    return this.get('/staff/salary/', params);
  }

  async createStaffSalary(data: Omit<StaffSalary, 'id'>): Promise<StaffSalary> {
    return this.post('/staff/salary/', data);
  }

  async updateStaffSalary(id: string | number, data: Partial<Omit<StaffSalary, 'id'>>): Promise<StaffSalary> {
    return this.patch(`/staff/salary/${id}/`, data);
  }

  async deleteStaffSalary(id: string | number): Promise<void> {
    return this.delete(`/staff/salary/${id}/`);
  }

  async getStaffPayments(params?: PaginationParams & { staff?: number }): Promise<{ results: StaffPayment[] }> {
    return this.get('/staff/payments/', params);
  }

  async createStaffPayment(data: Omit<StaffPayment, 'id'>): Promise<StaffPayment> {
    return this.post('/staff/payments/', data);
  }

  async updateStaffPayment(id: string | number, data: Partial<Omit<StaffPayment, 'id'>>): Promise<StaffPayment> {
    return this.patch(`/staff/payments/${id}/`, data);
  }

  async deleteStaffPayment(id: string | number): Promise<void> {
    return this.delete(`/staff/payments/${id}/`);
  }

  async getStaffBalance(staffId: string | number) {
    return this.get(`/staff/${staffId}/balance/`);
  }

  async getStaffTimesheet(staffId: string | number, params?: { date_from?: string; date_to?: string }) {
    return this.get(`/staff/${staffId}/timesheet/`, params);
  }

  async importStaff(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.post('/staff/import/', formData);
  }

  async exportStaff(params?: any) {
    return this.get('/staff/export/', params);
  }
}

export const staffService = new StaffService();

