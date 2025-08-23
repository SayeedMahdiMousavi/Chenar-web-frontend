import { supplierService } from '../services/supplier';
import {
  createCRUDHooks,
  useGenericQuery,
  useGenericMutation,
} from './useApiHooks';
import { useQueryClient } from 'react-query';
import { message } from 'antd';

// Create base CRUD hooks for suppliers
const supplierHooks = createCRUDHooks(supplierService, 'suppliers');

// Extended supplier-specific hooks
export const useSuppliers = (params?: {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  is_active?: boolean;
  ordering?: string;
}) => {
  return supplierHooks.useList(params);
};

export const useSupplier = (id: string | number) => {
  return supplierHooks.useDetail(id);
};

export const useCreateSupplier = () => {
  return supplierHooks.useCreate();
};

export const useUpdateSupplier = () => {
  return supplierHooks.useUpdate();
};

export const useDeleteSupplier = () => {
  return supplierHooks.useDelete();
};

export const useSupplierStatus = () => {
  return supplierHooks.useSetStatus();
};

// Supplier categories
export const useSupplierCategories = () => {
  return useGenericQuery(
    ['suppliers', 'categories'],
    () => supplierService.getSupplierCategories(),
    {
      staleTime: 30 * 60 * 1000, // 30 minutes
    },
  );
};

export const useCreateSupplierCategory = () => {
  const queryClient = useQueryClient();

  return useGenericMutation(
    (data: { name: string; description?: string }) =>
      supplierService.createSupplierCategory(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [{ queryKey: ['suppliers', 'categories'] }],
        });
        message.success('Supplier category created successfully');
      },
      onError: () => {
        message.error('Failed to create supplier category');
      },
    },
  );
};

export const useUpdateSupplierCategory = () => {
  const queryClient = useQueryClient();

  return useGenericMutation(
    ({
      id,
      data,
    }: {
      id: string | number;
      data: { name?: string; description?: string };
    }) => supplierService.updateSupplierCategory(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [{ queryKey: ['suppliers', 'categories'] }],
        });
        message.success('Supplier category updated successfully');
      },
      onError: () => {
        message.error('Failed to update supplier category');
      },
    },
  );
};

export const useDeleteSupplierCategory = () => {
  const queryClient = useQueryClient();

  return useGenericMutation(
    (id: string | number) => supplierService.deleteSupplierCategory(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [{ queryKey: ['suppliers', 'categories'] }],
        });
        message.success('Supplier category deleted successfully');
      },
      onError: () => {
        message.error('Failed to delete supplier category');
      },
    },
  );
};

// Supplier financial operations
export const useSupplierPayments = (
  supplierId: string | number,
  params?: {
    page?: number;
    page_size?: number;
    date_from?: string;
    date_to?: string;
  },
) => {
  return useGenericQuery(
    ['suppliers', supplierId, 'payments', params],
    () => supplierService.getSupplierPayments(supplierId, params),
    {
      enabled: !!supplierId,
      staleTime: 5 * 60 * 1000,
    },
  );
};

export const useSupplierInvoices = (
  supplierId: string | number,
  params?: {
    page?: number;
    page_size?: number;
    date_from?: string;
    date_to?: string;
  },
) => {
  return useGenericQuery(
    ['suppliers', supplierId, 'invoices', params],
    () => supplierService.getSupplierInvoices(supplierId, params),
    {
      enabled: !!supplierId,
      staleTime: 5 * 60 * 1000,
    },
  );
};

export const useSupplierBalance = (supplierId: string | number) => {
  return useGenericQuery(
    ['suppliers', supplierId, 'balance'],
    () => supplierService.getSupplierBalance(supplierId),
    {
      enabled: !!supplierId,
      staleTime: 2 * 60 * 1000, // Balance changes frequently
    },
  );
};

// Import/Export operations
export const useImportSuppliers = () => {
  const queryClient = useQueryClient();

  return useGenericMutation(
    (file: File) => supplierService.importSuppliers(file),
    {
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({
          queryKey: [{ queryKey: ['suppliers'] }],
        });
        message.success(
          `Successfully imported ${data.imported_count} suppliers`,
        );
        if (data.skipped_count > 0) {
          message.warning(`Skipped ${data.skipped_count} duplicate entries`);
        }
      },
      onError: () => {
        message.error('Failed to import suppliers');
      },
    },
  );
};

export const useExportSuppliers = () => {
  return useGenericMutation(
    (params?: any) => supplierService.exportSuppliers(params),
    {
      onSuccess: () => {
        message.success('Suppliers exported successfully');
      },
      onError: () => {
        message.error('Failed to export suppliers');
      },
    },
  );
};

// Bulk operations
export const useBulkUpdateSuppliers = () => {
  const queryClient = useQueryClient();

  return useGenericMutation(
    (data: { ids: number[]; updates: any }) => {
      // This would need to be implemented in the service
      return Promise.all(
        data.ids.map((id) => supplierService.updateSupplier(id, data.updates)),
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [{ queryKey: ['suppliers'] }],
        });
        message.success('Suppliers updated successfully');
      },
      onError: () => {
        message.error('Failed to update suppliers');
      },
    },
  );
};

export const useBulkDeleteSuppliers = () => {
  const queryClient = useQueryClient();

  return useGenericMutation(
    (ids: number[]) => {
      return Promise.all(ids.map((id) => supplierService.deleteSupplier(id)));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [{ queryKey: ['suppliers'] }],
        });
        message.success('Suppliers deleted successfully');
      },
      onError: () => {
        message.error('Failed to delete suppliers');
      },
    },
  );
};

// Search and filter hooks
export const useSupplierSearch = (
  searchTerm: string,
  options?: {
    category?: number;
    is_active?: boolean;
  },
) => {
  return useGenericQuery(
    ['suppliers', 'search', searchTerm, options],
    () =>
      supplierService.getSuppliers({
        search: searchTerm,
        category: options?.category?.toString(),
        ...options,
        page_size: 50, // Limit search results
      }),
    {
      enabled: searchTerm.length >= 2,
      staleTime: 30 * 1000, // 30 seconds for search
    },
  );
};

export const useActiveSuppliers = () => {
  return useGenericQuery(
    ['suppliers', 'active'],
    () =>
      supplierService.getSuppliers({
        page_size: 1000,
        ordering: 'name',
      }),
    {
      staleTime: 15 * 60 * 1000,
      select: (data: any) =>
        data.results?.filter((supplier: any) => supplier.is_active),
    },
  );
};

// Export all hooks
export { supplierHooks };
