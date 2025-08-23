import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from 'react-query';
import { message } from 'antd';
import { ApiService, PaginationParams } from '../services/api';

// Query keys factory
export const createQueryKeys = (baseKey: string) => ({
  all: [baseKey] as const,
  lists: () => [...createQueryKeys(baseKey).all, 'list'] as const,
  list: (params?: any) =>
    [...createQueryKeys(baseKey).lists(), params] as const,
  details: () => [...createQueryKeys(baseKey).all, 'detail'] as const,
  detail: (id: string | number) =>
    [...createQueryKeys(baseKey).details(), id] as const,
  infinite: (params?: any) =>
    [...createQueryKeys(baseKey).all, 'infinite', params] as const,
});

// Generic hooks for CRUD operations
export function useGenericQuery<T>(
  queryKey: any[],
  queryFn: () => Promise<T>,
  options?: any,
) {
  return useQuery(queryKey, queryFn, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

export function useGenericMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, Error, TVariables>,
) {
  return useMutation(mutationFn, options);
}

// CRUD operations hook factory
export function createCRUDHooks<
  T,
  TCreateData,
  TUpdateData = Partial<TCreateData>,
>(service: ApiService, baseKey: string) {
  const queryKeys = createQueryKeys(baseKey);

  // List hook
  const useList = (
    params?: PaginationParams,
    options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>,
  ) => {
    return useGenericQuery(
      queryKeys.list(params) as unknown as any[],
      () => service.list<T>(params),
      {
        ...options,
        keepPreviousData: true,
      },
    );
  };

  // Detail hook
  const useDetail = (
    id: string | number,
    options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>,
  ) => {
    return useGenericQuery(
      queryKeys.detail(id) as unknown as any[],
      () => service.getById<T>(id),
      {
        ...options,
        enabled: !!id && options?.enabled !== false,
      },
    );
  };

  // Create mutation
  const useCreate = (options?: UseMutationOptions<T, Error, TCreateData>) => {
    const queryClient = useQueryClient();

    return useGenericMutation(
      (data: TCreateData) => service.create<T, TCreateData>(data),
      {
        onSuccess: (data, variables, context) => {
          // Invalidate list queries
          queryClient.invalidateQueries(queryKeys.lists());

          message.success('Item created successfully');

          options?.onSuccess?.(data, variables, context);
        },
        onError: (error: any, variables, context) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Failed to create item';
          message.error(errorMessage);

          options?.onError?.(error, variables, context);
        },
        ...options,
      },
    );
  };

  // Update mutation
  const useUpdate = (
    options?: UseMutationOptions<
      T,
      Error,
      { id: string | number; data: TUpdateData }
    >,
  ) => {
    const queryClient = useQueryClient();

    return useGenericMutation(
      ({ id, data }: { id: string | number; data: TUpdateData }) =>
        service.update<T, TUpdateData>(id, data),
      {
        onSuccess: (data, variables, context) => {
          // Invalidate and update relevant queries
          queryClient.invalidateQueries(queryKeys.lists());
          queryClient.invalidateQueries(queryKeys.detail(variables.id));

          // Optimistically update the cache
          queryClient.setQueryData(queryKeys.detail(variables.id), data);

          message.success('Item updated successfully');

          options?.onSuccess?.(data, variables, context);
        },
        onError: (error: any, variables, context) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Failed to update item';
          message.error(errorMessage);

          options?.onError?.(error, variables, context);
        },
        ...options,
      },
    );
  };

  // Delete mutation
  const useDelete = (
    options?: UseMutationOptions<any, Error, string | number>,
  ) => {
    const queryClient = useQueryClient();

    return useGenericMutation((id: string | number) => service.deleteById(id), {
      onSuccess: (data, variables, context) => {
        // Remove from cache and invalidate lists
        queryClient.removeQueries(queryKeys.detail(variables));
        queryClient.invalidateQueries(queryKeys.lists());

        message.success('Item deleted successfully');

        options?.onSuccess?.(data, variables, context);
      },
      onError: (error: any, variables, context) => {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to delete item';
        message.error(errorMessage);

        options?.onError?.(error, variables, context);
      },
      ...options,
    });
  };

  // Status change mutation (activate/deactivate)
  const useSetStatus = (
    options?: UseMutationOptions<
      T,
      Error,
      { id: string | number; status: 'active' | 'deactivate' }
    >,
  ) => {
    const queryClient = useQueryClient();

    return useGenericMutation(
      ({
        id,
        status,
      }: {
        id: string | number;
        status: 'active' | 'deactivate';
      }) => service.setStatus<T>(id, status),
      {
        onSuccess: (data, variables, context) => {
          // Invalidate and update relevant queries
          queryClient.invalidateQueries(queryKeys.lists());
          queryClient.invalidateQueries(queryKeys.detail(variables.id));

          // Optimistically update the cache
          queryClient.setQueryData(queryKeys.detail(variables.id), data);

          const actionText =
            variables.status === 'active' ? 'activated' : 'deactivated';
          message.success(`Item ${actionText} successfully`);

          options?.onSuccess?.(data, variables, context);
        },
        onError: (error: any, variables, context) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Failed to update status';
          message.error(errorMessage);

          options?.onError?.(error, variables, context);
        },
        ...options,
      },
    );
  };

  return {
    queryKeys,
    useList,
    useDetail,
    useCreate,
    useUpdate,
    useDelete,
    useSetStatus,
  };
}

// Utility hooks
export function useInvalidateQueries() {
  const queryClient = useQueryClient();

  return (queryKeys: any[]) => {
    queryClient.invalidateQueries(queryKeys);
  };
}

export function useRefetchQueries() {
  const queryClient = useQueryClient();

  return (queryKeys: any[]) => {
    queryClient.refetchQueries(queryKeys);
  };
}

export function usePrefetchQuery<T>(
  queryKey: any[],
  queryFn: () => Promise<T>,
  staleTime: number = 5 * 60 * 1000,
) {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery(queryKey, queryFn, {
      staleTime,
    });
  };
}

// Optimistic updates utility
export function useOptimisticUpdate<T>(queryKey: any[]) {
  const queryClient = useQueryClient();

  return {
    setData: (data: T | ((oldData: T | undefined) => T)) => {
      queryClient.setQueryData(queryKey, data);
    },

    invalidate: () => {
      queryClient.invalidateQueries(queryKey);
    },

    cancel: async () => {
      await queryClient.cancelQueries(queryKey);
    },

    rollback: (previousData: T) => {
      queryClient.setQueryData(queryKey, previousData);
    },
  };
}

// Error handling utilities
export function handleApiError(error: any): string {
  if (error?.response?.data) {
    const data = error.response.data;

    // Handle validation errors
    if (data.details && typeof data.details === 'object') {
      const fieldErrors = Object.entries(data.details)
        .map(
          ([field, errors]) =>
            `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`,
        )
        .join('; ');
      return fieldErrors;
    }

    // Handle general error messages
    if (data.message) {
      return data.message;
    }

    if (data.detail) {
      return data.detail;
    }
  }

  if (error?.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

// Loading state utilities
export function useLoadingState() {
  const queryClient = useQueryClient();

  return {
    isAnyLoading: () => {
      return queryClient.isFetching() > 0;
    },

    isMutating: () => {
      return queryClient.isMutating() > 0;
    },
  };
}
