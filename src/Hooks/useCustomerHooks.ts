import { customerService } from '../services/api';
import {
  createCRUDHooks,
  useGenericQuery,
  useGenericMutation,
} from './useApiHooks';
import { useQueryClient } from 'react-query';
import { message } from 'antd';

// Create base CRUD hooks for customers
const customerHooks = createCRUDHooks(customerService, 'customers');

// Extended customer-specific hooks
export const useCustomers = (params?: {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  is_active?: boolean;
  ordering?: string;
}) => {
  return customerHooks.useList(params);
};

export const useCustomer = (id: string | number) => {
  return customerHooks.useDetail(id);
};

export const useCreateCustomer = () => {
  return customerHooks.useCreate();
};

export const useUpdateCustomer = () => {
  return customerHooks.useUpdate();
};

export const useDeleteCustomer = () => {
  return customerHooks.useDelete();
};

export const useCustomerStatus = () => {
  return customerHooks.useSetStatus();
};

// Customer categories
export const useCustomerCategories = () => {
  return useGenericQuery(
    ['customers', 'categories'],
    () => customerService.getCustomerCategories(),
    {
      staleTime: 30 * 60 * 1000, // 30 minutes
    },
  );
};

export const useCreateCustomerCategory = () => {
  const queryClient = useQueryClient();

  return useGenericMutation(
    (data: { name: string; description?: string }) =>
      customerService.createCustomerCategory(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [{ queryKey: ['customers', 'categories'] }],
        });
        message.success('Customer category created successfully');
      },
      onError: () => {
        message.error('Failed to create customer category');
      },
    },
  );
};

// Customer discounts
export const useDiscountTypes = () => {
  return useGenericQuery(
    ['customers', 'discount-types'],
    () => customerService.getDiscountTypes(),
    {
      staleTime: 30 * 60 * 1000,
    },
  );
};

export const useDiscountCards = () => {
  return useGenericQuery(
    ['customers', 'discount-cards'],
    () => customerService.getDiscountCards(),
    {
      staleTime: 15 * 60 * 1000,
    },
  );
};

export const useCustomerDiscounts = () => {
  return useGenericQuery(
    ['customers', 'discounts'],
    () => customerService.getCustomerDiscounts(),
    {
      staleTime: 10 * 60 * 1000,
    },
  );
};

// Search and filter hooks
export const useCustomerSearch = (
  searchTerm: string,
  options?: {
    category?: number;
    is_active?: boolean;
  },
) => {
  return useGenericQuery(
    ['customers', 'search', searchTerm, options],
    () =>
      customerService.getCustomers({
        search: searchTerm,
        ...options,
        page_size: 50, // Limit search results
      }),
    {
      enabled: searchTerm.length >= 2,
      staleTime: 30 * 1000, // 30 seconds for search
    },
  );
};

export const useActiveCustomers = () => {
  return useGenericQuery(
    ['customers', 'active'],
    () =>
      customerService.getCustomers({
        page_size: 1000,
        ordering: 'name',
      }),
    {
      staleTime: 15 * 60 * 1000,
      select: (data: any) =>
        data.results?.filter((customer: any) => customer.is_active),
    },
  );
};

// Customer for dropdowns and selects (infinite scroll)
export const useCustomerOptions = (search?: string) => {
  return useGenericQuery(
    ['customers', 'options', search],
    () =>
      customerService.getCustomers({
        search,
        page_size: 20,
        ordering: 'name',
      }),
    {
      staleTime: 5 * 60 * 1000,
      select: (data: any) =>
        data.results?.map((customer: any) => ({
          value: customer.id,
          label:
            customer.name ||
            `${customer.first_name} ${customer.last_name}`.trim(),
          data: customer,
        })),
    },
  );
};

// Customer statistics
export const useCustomerStats = () => {
  return useGenericQuery(
    ['customers', 'stats'],
    async () => {
      const [activeCustomers, totalCustomers] = await Promise.all([
        customerService.getCustomers({ page_size: 1 }),
        customerService.getCustomers({ page_size: 1 }),
      ]);

      return {
        total: totalCustomers.count,
        active: activeCustomers.count,
      };
    },
    {
      staleTime: 10 * 60 * 1000,
    },
  );
};

// Bulk operations
export const useBulkUpdateCustomers = () => {
  const queryClient = useQueryClient();

  return useGenericMutation(
    (data: { ids: number[]; updates: any }) => {
      return Promise.all(
        data.ids.map((id) => customerService.updateCustomer(id, data.updates)),
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [{ queryKey: ['customers'] }],
        });
        message.success('Customers updated successfully');
      },
      onError: () => {
        message.error('Failed to update customers');
      },
    },
  );
};

export const useBulkDeleteCustomers = () => {
  const queryClient = useQueryClient();

  return useGenericMutation(
    (ids: number[]) => {
      return Promise.all(ids.map((id) => customerService.deleteCustomer(id)));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [{ queryKey: ['customers'] }],
        });
        message.success('Customers deleted successfully');
      },
      onError: () => {
        message.error('Failed to delete customers');
      },
    },
  );
};

export const useBulkActivateCustomers = () => {
  const queryClient = useQueryClient();

  return useGenericMutation(
    (ids: number[]) => {
      return Promise.all(ids.map((id) => customerService.activateCustomer(id)));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [{ queryKey: ['customers'] }],
        });
        message.success('Customers activated successfully');
      },
      onError: () => {
        message.error('Failed to activate customers');
      },
    },
  );
};

export const useBulkDeactivateCustomers = () => {
  const queryClient = useQueryClient();

  return useGenericMutation(
    (ids: number[]) => {
      return Promise.all(
        ids.map((id) => customerService.deactivateCustomer(id)),
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [{ queryKey: ['customers'] }],
        });
        message.success('Customers deactivated successfully');
      },
      onError: () => {
        message.error('Failed to deactivate customers');
      },
    },
  );
};

// Customer insights and analytics
export const useCustomerInsights = (customerId: string | number) => {
  return useGenericQuery(
    ['customers', customerId, 'insights'],
    async () => {
      // This would typically come from a dedicated insights endpoint
      // For now, we'll simulate with existing data
      const customer = await customerService.getCustomerById(customerId);

      return {
        customer,
        totalOrders: 0, // Would come from invoice service
        totalSpent: '0.00',
        lastOrderDate: null,
        averageOrderValue: '0.00',
        paymentHistory: [],
      };
    },
    {
      enabled: !!customerId,
      staleTime: 5 * 60 * 1000,
    },
  );
};

// Export all hooks
export { customerHooks };
