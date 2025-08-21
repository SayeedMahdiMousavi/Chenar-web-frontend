# API Migration Guide

This guide helps you migrate from the old API patterns to the new modern TanStack React Query v5 based system.

## Overview

The new API system provides:
- ✅ Modern TanStack React Query v5 patterns
- ✅ Consistent error handling
- ✅ Optimistic updates
- ✅ Better TypeScript support
- ✅ Automatic cache invalidation
- ✅ Standardized loading states
- ✅ Built-in retry logic

## Migration Examples

### Before vs After: Product Management

#### OLD WAY (Legacy)
```jsx
// OLD - src/pages/sales/Products/AddProduct.jsx
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';

const AddProduct = () => {
  const queryClient = useQueryClient();
  
  const { mutate: mutateAddProduct, isLoading } = useMutation(
    async (value) => await axiosInstance.post(`/product/items/`, value),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('/product/items/');
        message.success('Product added successfully');
      },
      onError: (error) => {
        message.error('Failed to add product');
      },
    }
  );
  
  // Manual form handling...
};
```

#### NEW WAY (Modern)
```jsx
// NEW - Using modern hooks
import { useCreateProduct, useProducts } from '../../../hooks';

const AddProduct = () => {
  const { mutate: createProduct, isPending } = useCreateProduct();
  const { data: products, isLoading: productsLoading } = useProducts({
    page: 1,
    page_size: 20,
  });
  
  const handleSubmit = (values) => {
    createProduct(values, {
      onSuccess: (newProduct) => {
        // Auto-handled: cache invalidation, success message
        form.resetFields();
        setVisible(false);
      },
    });
  };
  
  // Form JSX...
};
```

### Before vs After: Customer Operations

#### OLD WAY
```jsx
// OLD - Multiple manual API calls
const CustomerDetails = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axiosInstance.get(`/customer_account/customer/${id}/`);
        setCustomer(response.data);
      } catch (error) {
        message.error('Failed to load customer');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchCustomer();
    }
  }, [id]);
  
  const handleUpdate = async (data) => {
    try {
      await axiosInstance.patch(`/customer_account/customer/${id}/`, data);
      message.success('Customer updated');
      // Manual state update
      setCustomer(prev => ({ ...prev, ...data }));
    } catch (error) {
      message.error('Update failed');
    }
  };
};
```

#### NEW WAY
```jsx
// NEW - Declarative with automatic caching
import { useCustomer, useUpdateCustomer } from '../../../hooks';

const CustomerDetails = ({ customerId }) => {
  const { data: customer, isLoading, error } = useCustomer(customerId);
  const { mutate: updateCustomer, isPending } = useUpdateCustomer();
  
  const handleUpdate = (data) => {
    updateCustomer({ 
      id: customerId, 
      data 
    }, {
      onSuccess: () => {
        // Auto-handled: cache update, success message, optimistic updates
      },
    });
  };
  
  if (isLoading) return <Spin />;
  if (error) return <Alert message="Failed to load customer" type="error" />;
  
  return (
    <CustomerForm 
      customer={customer} 
      onSubmit={handleUpdate}
      loading={isPending}
    />
  );
};
```

### Before vs After: Authentication

#### OLD WAY
```jsx
// OLD - src/pages/Login/LoginPage.jsx
const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/user_account/tokens/obtain/', {
        username: values.username,
        password: values.password,
      });
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      // Manual navigation and state management
      navigate('/dashboard');
    } catch (error) {
      message.error('Login failed');
    } finally {
      setLoading(false);
    }
  };
};
```

#### NEW WAY
```jsx
// NEW - Clean and simple
import { useLogin } from '../../../hooks';

const LoginPage = () => {
  const { mutate: login, isPending } = useLogin();
  const navigate = useNavigate();
  
  const onFinish = (values) => {
    login(values, {
      onSuccess: () => {
        // Auto-handled: token storage, cache setup, axios headers
        navigate('/dashboard');
      },
    });
  };
  
  return (
    <Form onFinish={onFinish}>
      {/* Form fields */}
      <Button 
        type="primary" 
        htmlType="submit" 
        loading={isPending}
      >
        Login
      </Button>
    </Form>
  );
};
```

## Key Migration Patterns

### 1. Replace Direct Axios Calls

**OLD:**
```js
const response = await axiosInstance.get('/api/endpoint');
```

**NEW:**
```js
const { data, isLoading, error } = useGenericQuery(
  ['endpoint'],
  () => service.getEndpoint()
);
```

### 2. Replace Manual Cache Management

**OLD:**
```js
queryClient.invalidateQueries('/products/');
queryClient.invalidateQueries('/categories/');
```

**NEW:**
```js
// Automatic cache invalidation in hooks
const { mutate } = useCreateProduct(); // Auto-invalidates related queries
```

### 3. Replace Manual Error Handling

**OLD:**
```js
.catch((error) => {
  if (error.response?.data?.message) {
    message.error(error.response.data.message);
  } else {
    message.error('Something went wrong');
  }
});
```

**NEW:**
```js
// Automatic error handling in hooks
const { mutate } = useCreateProduct(); // Auto-handles errors with proper messages
```

### 4. Replace Manual Loading States

**OLD:**
```js
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await axiosInstance.get('/api/data');
    setData(response.data);
  } catch (err) {
    setError(err);
  } finally {
    setLoading(false);
  }
};
```

**NEW:**
```js
const { data, isLoading, error } = useGenericQuery(
  ['data'],
  () => service.getData()
);
```

## Available Services and Hooks

### Services
- `authService` - Authentication operations
- `productService` - Product management
- `customerService` - Customer management
- `supplierService` - Supplier management (NEW)
- `staffService` - Staff management (NEW)
- `invoiceService` - All invoice types (NEW)
- `financeService` - Financial operations (NEW)
- `inventoryService` - Inventory management (NEW)
- `reportsService` - Comprehensive reporting (NEW)
- `bankingService` - Banking operations (NEW)

### Hooks
- `useProducts()`, `useCreateProduct()`, `useUpdateProduct()`, etc.
- `useCustomers()`, `useCreateCustomer()`, `useUpdateCustomer()`, etc.
- `useSuppliers()`, `useCreateSupplier()`, `useUpdateSupplier()`, etc.
- `useSalesInvoices()`, `useCreateSalesInvoice()`, etc.
- `usePurchaseInvoices()`, `useCreatePurchaseInvoice()`, etc.
- `useSalesOrders()`, `usePurchaseOrders()`, `useEstimates()`, etc.
- `useProductTransfers()`, `useProductAdjustments()`, etc.
- And many more...

## Migration Checklist

1. ✅ **Identify Legacy API Calls**: Find direct axios usage
2. ✅ **Replace with Service Calls**: Use appropriate service methods
3. ✅ **Update Hooks**: Replace `react-query` v3 with modern hooks
4. ✅ **Remove Manual Error Handling**: Let hooks handle errors
5. ✅ **Remove Manual Loading States**: Use hook loading states
6. ✅ **Remove Manual Cache Management**: Let hooks manage cache
7. ✅ **Update TypeScript Types**: Use provided interface types
8. ✅ **Test Thoroughly**: Ensure all functionality works

## Common Gotchas

1. **Query Key Changes**: New query keys follow consistent patterns
2. **Hook Names**: Some hooks have new names (e.g., `isPending` vs `isLoading`)
3. **Error Format**: Error handling is now standardized
4. **Cache Invalidation**: Now automatic in most cases
5. **Optimistic Updates**: Available but optional

## Need Help?

1. Check existing modern components for examples
2. Review the service interfaces for available methods
3. Look at hook implementations for patterns
4. Test incrementally - migrate one component at a time

## Example: Complete Component Migration

```jsx
// BEFORE: Legacy component with manual API handling
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/product/items/?page=${page}&page_size=20`);
        setProducts(response.data.results);
      } catch (error) {
        message.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page]);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/product/items/${id}/`);
      message.success('Product deleted');
      setProducts(prev => prev.filter(p => p.id !== id));
      queryClient.invalidateQueries('/product/items/');
    } catch (error) {
      message.error('Delete failed');
    }
  };

  return (
    <Table 
      dataSource={products}
      loading={loading}
      pagination={{
        current: page,
        onChange: setPage,
      }}
      columns={[
        {
          title: 'Actions',
          render: (_, record) => (
            <Button onClick={() => handleDelete(record.id)}>
              Delete
            </Button>
          ),
        },
      ]}
    />
  );
};

// AFTER: Modern component with hooks
const ProductList = () => {
  const [page, setPage] = useState(1);
  
  const { 
    data: productsData, 
    isLoading 
  } = useProducts({ 
    page, 
    page_size: 20 
  });
  
  const { mutate: deleteProduct } = useDeleteProduct();

  const handleDelete = (id) => {
    deleteProduct(id, {
      onSuccess: () => {
        // Auto-handled: cache invalidation, success message
      },
    });
  };

  return (
    <Table 
      dataSource={productsData?.results || []}
      loading={isLoading}
      pagination={{
        current: page,
        total: productsData?.count,
        onChange: setPage,
      }}
      columns={[
        {
          title: 'Actions',
          render: (_, record) => (
            <Button onClick={() => handleDelete(record.id)}>
              Delete
            </Button>
          ),
        },
      ]}
    />
  );
};
```

This migration results in:
- ✅ 50% less code
- ✅ Better error handling
- ✅ Automatic cache management
- ✅ Better TypeScript support
- ✅ Consistent patterns across app
- ✅ Better performance (caching, deduplication)




