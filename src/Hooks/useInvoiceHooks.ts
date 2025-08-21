import { invoiceService } from '../services/invoice';
import { createCRUDHooks, useGenericQuery, useGenericMutation } from './useApiHooks';
import { useQueryClient } from 'react-query';
import { message } from 'antd';

// Sales Invoices
export const useSalesInvoices = (params?: {
  page?: number;
  page_size?: number;
  search?: string;
  customer?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
  ordering?: string;
}) => {
  return useGenericQuery(
    ['invoices', 'sales', params],
    () => invoiceService.getSalesInvoices(params),
    {
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000,
    }
  );
};

export const useSalesInvoice = (id: string | number) => {
  return useGenericQuery(
    ['invoices', 'sales', id],
    () => invoiceService.getSalesInvoiceById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useCreateSalesInvoice = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    (data: any) => invoiceService.createSalesInvoice(data),
    {
      onSuccess: (invoice) => {
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['invoices', 'sales'] }] });
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['dashboard'] }] });
        message.success(`Sales invoice ${invoice.invoice_number} created successfully`);
      },
      onError: () => {
        message.error('Failed to create sales invoice');
      },
    }
  );
};

export const useUpdateSalesInvoice = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    ({ id, data }: { id: string | number; data: any }) =>
      invoiceService.updateSalesInvoice(id, data),
    {
      onSuccess: (invoice, variables) => {
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['invoices', 'sales'] }] });
        queryClient.setQueryData(['invoices', 'sales', variables.id], invoice);
        message.success('Sales invoice updated successfully');
      },
      onError: () => {
        message.error('Failed to update sales invoice');
      },
    }
  );
};

export const useDeleteSalesInvoice = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    (id: string | number) => invoiceService.deleteSalesInvoice(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['invoices', 'sales'] }] });
        message.success('Sales invoice deleted successfully');
      },
      onError: () => {
        message.error('Failed to delete sales invoice');
      },
    }
  );
};

// Purchase Invoices
export const usePurchaseInvoices = (params?: {
  page?: number;
  page_size?: number;
  search?: string;
  supplier?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
  ordering?: string;
}) => {
  return useGenericQuery(
    ['invoices', 'purchase', params],
    () => invoiceService.getPurchaseInvoices(params),
    {
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000,
    }
  );
};

export const usePurchaseInvoice = (id: string | number) => {
  return useGenericQuery(
    ['invoices', 'purchase', id],
    () => invoiceService.getPurchaseInvoiceById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useCreatePurchaseInvoice = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    (data: any) => invoiceService.createPurchaseInvoice(data),
    {
      onSuccess: (invoice) => {
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['invoices', 'purchase'] }] });
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['dashboard'] }] });
        message.success(`Purchase invoice ${invoice.invoice_number} created successfully`);
      },
      onError: () => {
        message.error('Failed to create purchase invoice');
      },
    }
  );
};

export const useUpdatePurchaseInvoice = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    ({ id, data }: { id: string | number; data: any }) =>
      invoiceService.updatePurchaseInvoice(id, data),
    {
      onSuccess: (invoice, variables) => {
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['invoices', 'purchase'] }] });
        queryClient.setQueryData(['invoices', 'purchase', variables.id], invoice);
        message.success('Purchase invoice updated successfully');
      },
      onError: () => {
        message.error('Failed to update purchase invoice');
      },
    }
  );
};

// Sales Orders
export const useSalesOrders = (params?: {
  page?: number;
  page_size?: number;
  search?: string;
  customer?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
  ordering?: string;
}) => {
  return useGenericQuery(
    ['orders', 'sales', params],
    () => invoiceService.getSalesOrders(params),
    {
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000,
    }
  );
};

export const useSalesOrder = (id: string | number) => {
  return useGenericQuery(
    ['orders', 'sales', id],
    () => invoiceService.getSalesOrderById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useCreateSalesOrder = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    (data: any) => invoiceService.createSalesOrder(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['orders', 'sales'] }] });
        message.success('Sales order created successfully');
      },
      onError: () => {
        message.error('Failed to create sales order');
      },
    }
  );
};

export const useConvertSalesOrderToInvoice = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    (id: string | number) => invoiceService.convertSalesOrderToInvoice(id),
    {
      onSuccess: (invoice) => {
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['orders', 'sales'] }] });
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['invoices', 'sales'] }] });
        message.success(`Sales order converted to invoice ${invoice.invoice_number}`);
      },
      onError: () => {
        message.error('Failed to convert sales order to invoice');
      },
    }
  );
};

// Purchase Orders
export const usePurchaseOrders = (params?: {
  page?: number;
  page_size?: number;
  search?: string;
  supplier?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
  ordering?: string;
}) => {
  return useGenericQuery(
    ['orders', 'purchase', params],
    () => invoiceService.getPurchaseOrders(params),
    {
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000,
    }
  );
};

export const usePurchaseOrder = (id: string | number) => {
  return useGenericQuery(
    ['orders', 'purchase', id],
    () => invoiceService.getPurchaseOrderById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    (data: any) => invoiceService.createPurchaseOrder(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['orders', 'purchase'] }] });
        message.success('Purchase order created successfully');
      },
      onError: () => {
        message.error('Failed to create purchase order');
      },
    }
  );
};

export const useConvertPurchaseOrderToInvoice = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    (id: string | number) => invoiceService.convertPurchaseOrderToInvoice(id),
    {
      onSuccess: (invoice) => {
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['orders', 'purchase'] }] });
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['invoices', 'purchase'] }] });
        message.success(`Purchase order converted to invoice ${invoice.invoice_number}`);
      },
      onError: () => {
        message.error('Failed to convert purchase order to invoice');
      },
    }
  );
};

// Estimates
export const useEstimates = (params?: {
  page?: number;
  page_size?: number;
  search?: string;
  customer?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
  ordering?: string;
}) => {
  return useGenericQuery(
    ['estimates', params],
    () => invoiceService.getEstimates(params),
    {
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000,
    }
  );
};

export const useEstimate = (id: string | number) => {
  return useGenericQuery(
    ['estimates', id],
    () => invoiceService.getEstimateById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useCreateEstimate = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    (data: any) => invoiceService.createEstimate(data),
    {
      onSuccess: (estimate) => {
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['estimates'] }] });
        message.success(`Estimate ${estimate.estimate_number} created successfully`);
      },
      onError: () => {
        message.error('Failed to create estimate');
      },
    }
  );
};

export const useConvertEstimateToInvoice = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    (id: string | number) => invoiceService.convertEstimateToInvoice(id),
    {
      onSuccess: (invoice) => {
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['estimates'] }] });
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['invoices', 'sales'] }] });
        message.success(`Estimate converted to invoice ${invoice.invoice_number}`);
      },
      onError: () => {
        message.error('Failed to convert estimate to invoice');
      },
    }
  );
};

export const useConvertEstimateToSalesOrder = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    (id: string | number) => invoiceService.convertEstimateToSalesOrder(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['estimates'] }] });
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['orders', 'sales'] }] });
        message.success('Estimate converted to sales order successfully');
      },
      onError: () => {
        message.error('Failed to convert estimate to sales order');
      },
    }
  );
};

// Product Transfers
export const useProductTransfers = (params?: {
  page?: number;
  page_size?: number;
  search?: string;
  from_warehouse?: number;
  to_warehouse?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
  ordering?: string;
}) => {
  return useGenericQuery(
    ['transfers', params],
    () => invoiceService.getProductTransfers(params),
    {
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000,
    }
  );
};

export const useProductTransfer = (id: string | number) => {
  return useGenericQuery(
    ['transfers', id],
    () => invoiceService.getProductTransferById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useCreateProductTransfer = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    (data: any) => invoiceService.createProductTransfer(data),
    {
      onSuccess: (transfer) => {
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['transfers'] }] });
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['inventory'] }] });
        message.success(`Product transfer ${transfer.transfer_number} created successfully`);
      },
      onError: () => {
        message.error('Failed to create product transfer');
      },
    }
  );
};

export const useApproveProductTransfer = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    (id: string | number) => invoiceService.approveProductTransfer(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['transfers'] }] });
        message.success('Product transfer approved successfully');
      },
      onError: () => {
        message.error('Failed to approve product transfer');
      },
    }
  );
};

export const useCompleteProductTransfer = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    (id: string | number) => invoiceService.completeProductTransfer(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['transfers'] }] });
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['inventory'] }] });
        message.success('Product transfer completed successfully');
      },
      onError: () => {
        message.error('Failed to complete product transfer');
      },
    }
  );
};

// Product Adjustments
export const useProductAdjustments = (params?: {
  page?: number;
  page_size?: number;
  search?: string;
  warehouse?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
  ordering?: string;
}) => {
  return useGenericQuery(
    ['adjustments', params],
    () => invoiceService.getProductAdjustments(params),
    {
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000,
    }
  );
};

export const useProductAdjustment = (id: string | number) => {
  return useGenericQuery(
    ['adjustments', id],
    () => invoiceService.getProductAdjustmentById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useCreateProductAdjustment = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    (data: any) => invoiceService.createProductAdjustment(data),
    {
      onSuccess: (adjustment) => {
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['adjustments'] }] });
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['inventory'] }] });
        message.success(`Product adjustment ${adjustment.adjustment_number} created successfully`);
      },
      onError: () => {
        message.error('Failed to create product adjustment');
      },
    }
  );
};

export const useApproveProductAdjustment = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    (id: string | number) => invoiceService.approveProductAdjustment(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['adjustments'] }] });
        message.success('Product adjustment approved successfully');
      },
      onError: () => {
        message.error('Failed to approve product adjustment');
      },
    }
  );
};

export const useCompleteProductAdjustment = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    (id: string | number) => invoiceService.completeProductAdjustment(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['adjustments'] }] });
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['inventory'] }] });
        message.success('Product adjustment completed successfully');
      },
      onError: () => {
        message.error('Failed to complete product adjustment');
      },
    }
  );
};

// Common operations
export const useInvoiceStatistics = (params?: {
  date_from?: string;
  date_to?: string;
  type?: string;
}) => {
  return useGenericQuery(
    ['invoices', 'statistics', params],
    () => invoiceService.getInvoiceStatistics(params),
    {
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const usePrintInvoice = () => {
  return useGenericMutation(
    ({ type, id, format }: { type: string; id: string | number; format?: 'pdf' | 'html' }) =>
      invoiceService.printInvoice(type, id, format),
    {
      onSuccess: () => {
        message.success('Invoice printed successfully');
      },
      onError: () => {
        message.error('Failed to print invoice');
      },
    }
  );
};

export const useEmailInvoice = () => {
  return useGenericMutation(
    ({ type, id, email }: { type: string; id: string | number; email: string }) =>
      invoiceService.emailInvoice(type, id, email),
    {
      onSuccess: () => {
        message.success('Invoice emailed successfully');
      },
      onError: () => {
        message.error('Failed to email invoice');
      },
    }
  );
};

export const useDuplicateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useGenericMutation(
    ({ type, id }: { type: string; id: string | number }) =>
      invoiceService.duplicateInvoice(type, id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['invoices'] }] });
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['orders'] }] });
        queryClient.invalidateQueries({ queryKey: [{ queryKey: ['estimates'] }] });
        message.success('Invoice duplicated successfully');
      },
      onError: () => {
        message.error('Failed to duplicate invoice');
      },
    }
  );
};




