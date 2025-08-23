# Chenar Backend API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Onboarding Guide](#onboarding-guide)
3. [Authentication](#authentication)
4. [API Base Information](#api-base-information)
5. [User Account Management](#user-account-management)
6. [Product Management](#product-management)
7. [Customer Management](#customer-management)
8. [Supplier Management](#supplier-management)
9. [Staff Management](#staff-management)
10. [Banking Operations](#banking-operations)
11. [Invoice Management](#invoice-management)
12. [Finance Operations](#finance-operations)
13. [Inventory Management](#inventory-management)
14. [Reports](#reports)
15. [System Settings](#system-settings)
16. [Error Handling](#error-handling)
17. [Common Response Formats](#common-response-formats)

---

## Overview

The Chenar Backend is a comprehensive accounting and business management system built with Django 5.1 and Django REST Framework. It provides a complete suite of APIs for managing accounting operations, inventory, customer relationships, and financial reporting.

### Key Features

- **Multi-tenant Architecture**: Support for multiple companies/organizations
- **Comprehensive Accounting**: Full double-entry accounting system
- **Inventory Management**: Product catalog, warehouse management, and stock tracking
- **Customer Relationship Management**: Customer and supplier management
- **Financial Operations**: Banking, payments, receipts, and transfers
- **Invoice Processing**: Sales, purchase, and various invoice types
- **Reporting**: Extensive financial and operational reports
- **User Management**: Role-based access control and permissions

### Technology Stack

- **Backend Framework**: Django 5.1 with Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens) with refresh token support
- **Documentation**: drf-spectacular (OpenAPI/Swagger)
- **Containerization**: Docker support
- **Task Queue**: Celery with Redis

---

## Onboarding Guide

### Prerequisites

- Python 3.11+
- Docker and Docker Compose
- PostgreSQL database
- Redis (for caching and task queue)

### Quick Start

1. **Clone the Repository**

   ```bash
   git clone https://github.com/MicrocisCorp/chenar-backend.git
   cd chenar-backend
   git checkout upgrade
   ```

2. **Environment Setup**

   ```bash
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

   # Install dependencies
   pip install -r requirements/production.txt
   ```

3. **Docker Setup**

   ```bash
   # Build Docker image
   docker compose build

   # Start services
   docker compose up

   # Initialize project (run migrations, create superuser, etc.)
   docker compose exec demo_acc_backend python3 manage.py initialize_project
   ```

4. **Access the API**
   - Base URL: `http://api.chenar.x9f4a7.onten.io:3333//api/v1/`
   - Swagger Documentation: `http://api.chenar.x9f4a7.onten.io:3333//docs/swagger-ui/`
   - ReDoc Documentation: `http://api.chenar.x9f4a7.onten.io:3333//docs/redoc/`

### Development Environment

- The system uses Django settings modules for different environments
- Development settings: `Accounting.settings.development_local`
- Production settings: `Accounting.settings.production`

---

## Authentication

The API uses JWT (JSON Web Token) authentication with refresh token support.

### Authentication Endpoints

#### Obtain Token Pair

**POST** `/api/v1/user_account/tokens/obtain/`

Authenticate user and obtain access and refresh tokens.

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### Refresh Token

**POST** `/api/v1/user_account/tokens/refresh/`

Refresh the access token using a valid refresh token.

**Request Body:**

```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response:**

```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### Logout (Blacklist Token)

**POST** `/api/v1/user_account/tokens/blacklist/`

Blacklist the refresh token to log out the user.

**Request Body:**

```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response:**

```json
{
  "status": "Successfully Logged out"
}
```

### Using Authentication

Include the access token in the Authorization header for all authenticated requests:

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### Token Lifecycle

- **Access Token Lifetime**: 21600 minutes (15 days)
- **Refresh Token Lifetime**: 15 minutes
- **Token Rotation**: Enabled (new refresh token issued on refresh)
- **Blacklist After Rotation**: Enabled

---

## API Base Information

### Base URL

```
http://localhost:8000/api/v1/
```

### Content Type

All requests should use `application/json` content type unless specified otherwise.

### Pagination

The API uses custom pagination with the following structure:

**Response Format:**

```json
{
  "count": 100,
  "next": "http://localhost:8000/api/v1/endpoint/?page=2",
  "previous": null,
  "results": [...]
}
```

### Filtering and Search

Most list endpoints support filtering and search:

- **Filtering**: Use query parameters matching field names
- **Search**: Use `search` parameter for text-based search
- **Ordering**: Use `ordering` parameter for sorting

**Example:**

```
GET /api/v1/product/items/?search=laptop&category=1&ordering=-created
```

---

## User Account Management

Base URL: `/api/v1/user_account/`

### User Management

#### List Users

**GET** `/api/v1/user_account/users/`

Retrieve a list of system users.

**Query Parameters:**

- `first_name`: Filter by first name
- `last_name`: Filter by last name
- `username`: Filter by username
- `is_active`: Filter by active status
- `search`: Search across filterable fields

**Response:**

```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "first_name": "Admin",
      "last_name": "User",
      "is_active": true,
      "date_joined": "2024-01-01T00:00:00Z",
      "groups": [
        {
          "id": 1,
          "name": "Administrators"
        }
      ]
    }
  ]
}
```

#### Get User Details

**GET** `/api/v1/user_account/users/{username}/`

Retrieve details of a specific user.

**Response:**

```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "first_name": "Admin",
  "last_name": "User",
  "is_active": true,
  "photo": "http://localhost:8000/media/user/photo.jpg",
  "user_theme": {
    "id": 1,
    "name": "Default Theme"
  },
  "user_language": {
    "id": 1,
    "name": "English"
  },
  "user_calender": {
    "id": 1,
    "name": "Gregorian"
  },
  "groups": []
}
```

#### Update User

**PATCH** `/api/v1/user_account/users/{username}/`

Update user information.

**Request Body:**

```json
{
  "first_name": "Updated Name",
  "last_name": "Updated Last Name",
  "email": "updated@example.com"
}
```

#### Delete User

**DELETE** `/api/v1/user_account/users/{username}/`

Soft delete a user (sets is_active to false).

### User Profile Management

#### Get User Profile

**GET** `/api/v1/user_account/user_profile/{username}/`

Get the authenticated user's profile.

#### Update User Profile

**PATCH** `/api/v1/user_account/user_profile/{username}/`

Update the authenticated user's profile.

**Request Body:**

```json
{
  "first_name": "New Name",
  "photo": "base64_encoded_image_or_file_upload"
}
```

#### Check Password

**POST** `/api/v1/user_account/user_profile/check_password/`

Verify the user's current password.

**Request Body:**

```json
{
  "password": "current_password"
}
```

**Response:**

```json
{
  "status": true
}
```

#### Get User Permissions

**GET** `/api/v1/user_account/user_profile/{username}/permissions/`

Get all permissions for the authenticated user.

**Response:**

```json
{
  "count": 50,
  "results": [
    {
      "id": 1,
      "name": "Can add product",
      "codename": "add_product",
      "content_type": {
        "id": 10,
        "app_label": "Product",
        "model": "product"
      }
    }
  ]
}
```

### Permission Management

#### List All Permissions

**GET** `/api/v1/user_account/permit/`

Get all system permissions.

#### Get Models with Permissions

**GET** `/api/v1/user_account/permit/get_model/`

Get all content types (models) with their associated permissions.

#### Get Model Permissions

**GET** `/api/v1/user_account/permit/get_model_permission/{content_type_id}/`

Get permissions for a specific model.

#### Get Permission Dependencies

**GET** `/api/v1/user_account/permit/{permission_id}/dependency/`

Get all prerequisite permissions for a given permission.

### Role Management

#### List Roles

**GET** `/api/v1/user_account/roles/`

Get all user roles (groups).

**Response:**

```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "name": "Administrators",
      "permissions": [1, 2, 3, 4, 5]
    }
  ]
}
```

#### Create Role

**POST** `/api/v1/user_account/roles/`

Create a new user role.

**Request Body:**

```json
{
  "name": "Sales Manager",
  "permissions": [10, 11, 12, 13]
}
```

### User Invitation System

#### Invite User

**POST** `/api/v1/user_account/add_user/`

Send an invitation email to a new user.

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "first_name": "New",
  "last_name": "User",
  "groups": [1, 2]
}
```

#### Accept Invitation

**POST** `/api/v1/user_account/accept_invite/`

Accept a user invitation and complete account setup.

**Request Body:**

```json
{
  "token": "invitation_token",
  "password": "new_password",
  "password_confirm": "new_password"
}
```

### Password Reset

#### Request Password Reset

**POST** `/api/v1/user_account/reset_password/send_email`

Request a password reset email.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

#### Validate Reset Token

**POST** `/api/v1/user_account/reset_password/validate_token`

Validate a password reset token.

**Request Body:**

```json
{
  "token": "reset_token"
}
```

#### Confirm Password Reset

**POST** `/api/v1/user_account/reset_password/confirm`

Complete the password reset process.

**Request Body:**

```json
{
  "token": "reset_token",
  "password": "new_password"
}
```

---

## Product Management

Base URL: `/api/v1/product/`

### Product Operations

#### List Products

**GET** `/api/v1/product/items/`

Retrieve a list of products with filtering and search capabilities.

**Query Parameters:**

- `name`: Filter by product name
- `description`: Filter by description
- `category`: Filter by category ID
- `is_pine`: Filter by pine status
- `is_asset`: Filter by asset status
- `supplier`: Filter by supplier ID
- `search`: Search across name, description, ID, and barcode
- `ordering`: Sort by fields (id, name, description, category, etc.)

**Response:**

```json
{
  "count": 100,
  "results": [
    {
      "id": 1,
      "name": "Laptop Computer",
      "description": "High-performance laptop",
      "photo": "http://localhost:8000/media/products/laptop.jpg",
      "is_pine": false,
      "is_asset": true,
      "is_have_vip_price": true,
      "category": {
        "id": 1,
        "name": "Electronics",
        "parent": null
      },
      "supplier": {
        "id": 1,
        "name": "Tech Supplier Ltd"
      },
      "units": [
        {
          "id": 1,
          "name": "Piece",
          "symbol": "pcs"
        }
      ],
      "product_units": [
        {
          "unit": 1,
          "default_sal": true,
          "default_pur": true,
          "base_unit": true
        }
      ],
      "price": [
        {
          "unit": 1,
          "sales_rate": "1500.00",
          "perches_rate": "1200.00",
          "currency": "USD"
        }
      ],
      "product_barcode": [
        {
          "barcode": "1234567890123",
          "default": true,
          "original": true,
          "unit": 1
        }
      ],
      "created": "2024-01-01T00:00:00Z",
      "modified": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Product Details

**GET** `/api/v1/product/items/{id}/`

Retrieve detailed information about a specific product.

#### Create Product

**POST** `/api/v1/product/items/`

Create a new product.

**Request Body:**

```json
{
  "name": "New Product",
  "description": "Product description",
  "category": 1,
  "supplier": 1,
  "is_pine": false,
  "is_asset": false,
  "is_have_vip_price": false,
  "product_units": [
    {
      "unit": 1,
      "default_sal": true,
      "default_pur": true,
      "base_unit": true
    }
  ],
  "unit_conversion": [
    {
      "from_unit": 2,
      "ratio": 12
    }
  ]
}
```

#### Update Product

**PATCH** `/api/v1/product/items/{id}/`

Update an existing product.

#### Update Product Units

**PUT** `/api/v1/product/items/{id}/update_unit/`

Update the units associated with a product.

**Request Body:**

```json
[
  {
    "unit": 1,
    "default_sal": true,
    "default_pur": true,
    "base_unit": true
  },
  {
    "unit": 2,
    "default_sal": false,
    "default_pur": false,
    "base_unit": false
  }
]
```

#### Get Latest Products

**GET** `/api/v1/product/items/latest_product/`

Get the 5 most recently created products.

#### Get Best Selling Products

**GET** `/api/v1/product/items/best_selling/`

Get the top 20 best-selling products.

#### Generate Unique Barcode

**GET** `/api/v1/product/items/generate_unique_barcode/?count=5`

Generate unique barcodes for products.

**Query Parameters:**

- `count`: Number of barcodes to generate (max 200)

**Response:**

```json
["1234567890123", "1234567890124", "1234567890125"]
```

### Product Categories

#### List Categories

**GET** `/api/v1/product/category/`

Get product categories in a tree structure.

**Response:**

```json
{
  "count": 10,
  "results": [
    {
      "id": 1,
      "name": "Electronics",
      "parent": null,
      "children": [
        {
          "id": 2,
          "name": "Computers",
          "parent": 1
        }
      ]
    }
  ]
}
```

#### Create Category

**POST** `/api/v1/product/category/`

Create a new product category.

**Request Body:**

```json
{
  "name": "New Category",
  "parent": 1
}
```

### Product Units

#### List Units

**GET** `/api/v1/product/unit/`

Get all product units.

**Response:**

```json
{
  "count": 20,
  "results": [
    {
      "name": "Piece",
      "symbol": "pcs",
      "status": "active"
    }
  ]
}
```

#### Create Unit

**POST** `/api/v1/product/unit/`

Create a new product unit.

**Request Body:**

```json
{
  "name": "Kilogram",
  "symbol": "kg",
  "status": "active"
}
```

### Product Pricing

#### List Product Prices

**GET** `/api/v1/product/price/`

Get product pricing information.

**Query Parameters:**

- `product__name`: Filter by product name
- `product__product_barcode__barcode`: Filter by barcode
- `sales_rate`: Filter by sales rate

#### Bulk Create Prices

**POST** `/api/v1/product/price/bulk_create/`

Create multiple product prices at once.

**Request Body:**

```json
[
  {
    "product": 1,
    "unit": 1,
    "sales_rate": "100.00",
    "perches_rate": "80.00",
    "currency": "USD"
  }
]
```

#### Bulk Update Prices

**PUT** `/api/v1/product/price/bulk_update/{product_id}/`

Update all prices for a specific product.

### Product Barcodes

#### List Barcodes

**GET** `/api/v1/product/items/barcode/`

Get product barcodes.

#### Create Barcode

**POST** `/api/v1/product/items/barcode/`

Create a new product barcode.

**Request Body:**

```json
{
  "product": 1,
  "barcode": "1234567890123",
  "default": true,
  "original": true,
  "unit": 1
}
```

### Unit Conversions

#### List Unit Conversions

**GET** `/api/v1/product/unit/conversion/`

Get unit conversion rates.

#### Bulk Create Conversions

**POST** `/api/v1/product/unit/conversion/bulk_create/`

Create multiple unit conversions.

**Request Body:**

```json
[
  {
    "product": 1,
    "from_unit": 2,
    "ratio": 12
  }
]
```

#### Bulk Update Conversions

**PUT** `/api/v1/product/unit/conversion/bulk_update/{product_id}/`

Update all unit conversions for a product.

### VIP Pricing

#### List VIP Prices

**GET** `/api/v1/product/price/vip/`

Get VIP pricing information.

#### Bulk Update VIP Prices

**PUT** `/api/v1/product/items/bulk/update/vip_price/`

Update VIP prices for multiple products.

**Request Body:**

```json
{
  "products": [1, 2, 3],
  "vip_percent": "10.00"
}
```

### Product Settings

#### Get Product Settings

**GET** `/api/v1/product/setting/`

Get global product settings.

**Response:**

```json
{
  "vip_price": {
    "enabled": true,
    "default_percentage": 10
  }
}
```

#### Update Product Settings

**PUT** `/api/v1/product/setting/{id}/`

Update product settings.

---

## Customer Management

Base URL: `/api/v1/customer_account/`

### Customer Operations

#### List Customers

**GET** `/api/v1/customer_account/customer/`

Retrieve a list of customers.

**Response:**

```json
{
  "count": 50,
  "results": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": "123 Main St",
      "category": {
        "id": 1,
        "name": "Regular Customer"
      },
      "credit_limit": "5000.00",
      "current_balance": "1500.00",
      "is_active": true,
      "created": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Customer

**POST** `/api/v1/customer_account/customer/`

Create a new customer.

**Request Body:**

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567891",
  "address": "456 Oak Ave",
  "category": 1,
  "credit_limit": "3000.00"
}
```

#### Get Customer Details

**GET** `/api/v1/customer_account/customer/{id}/`

#### Update Customer

**PATCH** `/api/v1/customer_account/customer/{id}/`

#### Delete Customer

**DELETE** `/api/v1/customer_account/customer/{id}/`

### Customer Categories

#### List Customer Categories

**GET** `/api/v1/customer_account/customer_category/`

#### Create Customer Category

**POST** `/api/v1/customer_account/customer_category/`

**Request Body:**

```json
{
  "name": "VIP Customer",
  "description": "High-value customers"
}
```

### Customer Discounts

#### List Discount Types

**GET** `/api/v1/customer_account/discount/type/`

#### List Discount Cards

**GET** `/api/v1/customer_account/discount/card/`

#### List Customer Discounts

**GET** `/api/v1/customer_account/discount/customer/`

---

## Supplier Management

Base URL: `/api/v1/supplier_account/`

### Supplier Operations

#### List Suppliers

**GET** `/api/v1/supplier_account/supplier/`

Retrieve a list of suppliers.

**Response:**

```json
{
  "count": 25,
  "results": [
    {
      "id": 1,
      "name": "Tech Supplies Inc",
      "email": "contact@techsupplies.com",
      "phone": "+1234567890",
      "address": "789 Industrial Blvd",
      "category": {
        "id": 1,
        "name": "Electronics Supplier"
      },
      "credit_limit": "50000.00",
      "current_balance": "15000.00",
      "is_active": true
    }
  ]
}
```

#### Create Supplier

**POST** `/api/v1/supplier_account/supplier/`

#### Get Supplier Details

**GET** `/api/v1/supplier_account/supplier/{id}/`

#### Update Supplier

**PATCH** `/api/v1/supplier_account/supplier/{id}/`

#### Delete Supplier

**DELETE** `/api/v1/supplier_account/supplier/{id}/`

### Supplier Categories

#### List Supplier Categories

**GET** `/api/v1/supplier_account/supplier_category/`

#### Create Supplier Category

**POST** `/api/v1/supplier_account/supplier_category/`

---

## Staff Management

Base URL: `/api/v1/staff_account/`

### Staff Operations

#### List Staff

**GET** `/api/v1/staff_account/staff/`

#### Create Staff

**POST** `/api/v1/staff_account/staff/`

**Request Body:**

```json
{
  "name": "Employee Name",
  "email": "employee@company.com",
  "phone": "+1234567890",
  "position": "Sales Representative",
  "salary": "3000.00",
  "hire_date": "2024-01-01",
  "category": 1
}
```

#### Get Staff Details

**GET** `/api/v1/staff_account/staff/{id}/`

#### Update Staff

**PATCH** `/api/v1/staff_account/staff/{id}/`

### Staff Categories

#### List Staff Categories

**GET** `/api/v1/staff_account/staff_category/`

#### Create Staff Category

**POST** `/api/v1/staff_account/staff_category/`

---

## Banking Operations

Base URL: `/api/v1/banking/`

### Bank Management

#### List Banks

**GET** `/api/v1/banking/bank/`

Retrieve a list of bank accounts.

**Response:**

```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "name": "Main Business Account",
      "bank_name": "First National Bank",
      "account_number": "1234567890",
      "iban": "US12345678901234567890",
      "swift_code": "FNBKUS33",
      "balance": "25000.00",
      "currency": "USD",
      "is_active": true
    }
  ]
}
```

#### Create Bank Account

**POST** `/api/v1/banking/bank/`

**Request Body:**

```json
{
  "name": "Secondary Account",
  "bank_name": "Second Bank",
  "account_number": "0987654321",
  "iban": "US09876543210987654321",
  "swift_code": "SECBUS33",
  "currency": "USD"
}
```

### Cash Management

#### List Cash Accounts

**GET** `/api/v1/banking/cash/`

#### Create Cash Account

**POST** `/api/v1/banking/cash/`

**Request Body:**

```json
{
  "name": "Main Cash Register",
  "balance": "1000.00",
  "currency": "USD",
  "location": "Main Office"
}
```

---

## Invoice Management

Base URL: `/api/v1/invoice/`

### Sales Invoices

#### List Sales Invoices

**GET** `/api/v1/invoice/sales/`

Retrieve sales invoices.

**Response:**

```json
{
  "count": 100,
  "results": [
    {
      "id": 1,
      "invoice_number": "INV-2024-001",
      "customer": {
        "id": 1,
        "name": "John Doe"
      },
      "invoice_date": "2024-01-15",
      "due_date": "2024-02-15",
      "subtotal": "1000.00",
      "tax_amount": "100.00",
      "total_amount": "1100.00",
      "status": "paid",
      "items": [
        {
          "product": {
            "id": 1,
            "name": "Laptop Computer"
          },
          "quantity": "1.00",
          "unit_price": "1000.00",
          "total": "1000.00"
        }
      ]
    }
  ]
}
```

#### Create Sales Invoice

**POST** `/api/v1/invoice/sales/`

**Request Body:**

```json
{
  "customer": 1,
  "invoice_date": "2024-01-15",
  "due_date": "2024-02-15",
  "items": [
    {
      "product": 1,
      "quantity": "2.00",
      "unit_price": "500.00"
    }
  ],
  "notes": "Special delivery instructions"
}
```

### Purchase Invoices

#### List Purchase Invoices

**GET** `/api/v1/invoice/purchase/`

#### Create Purchase Invoice

**POST** `/api/v1/invoice/purchase/`

### Sales Orders

#### List Sales Orders

**GET** `/api/v1/invoice/sales_order/`

#### Create Sales Order

**POST** `/api/v1/invoice/sales_order/`

### Purchase Orders

#### List Purchase Orders

**GET** `/api/v1/invoice/purchase_order/`

#### Create Purchase Order

**POST** `/api/v1/invoice/purchase_order/`

### Estimates

#### List Estimates

**GET** `/api/v1/invoice/estimate/`

#### Create Estimate

**POST** `/api/v1/invoice/estimate/`

### Product Transfers

#### List Product Transfers

**GET** `/api/v1/invoice/transfer/`

#### Create Product Transfer

**POST** `/api/v1/invoice/transfer/`

### Product Adjustments

#### List Product Adjustments

**GET** `/api/v1/invoice/adjustment/`

#### Create Product Adjustment

**POST** `/api/v1/invoice/adjustment/`

---

## Finance Operations

Base URL: `/api/v1/pay_receive_cash/`

### Cash Flow Management

#### List Cash Flow Entries

**GET** `/api/v1/pay_receive_cash/cash_flow/`

#### Create Cash Flow Entry

**POST** `/api/v1/pay_receive_cash/cash_flow/`

### Income Operations

#### List Income Cash Entries

**GET** `/api/v1/pay_receive_cash/income_cash/`

#### Create Income Cash Entry

**POST** `/api/v1/pay_receive_cash/income_cash/`

**Request Body:**

```json
{
  "amount": "1500.00",
  "description": "Service payment received",
  "date": "2024-01-15",
  "account": 1,
  "category": 1
}
```

### Expense Operations

#### List Expense Cash Entries

**GET** `/api/v1/pay_receive_cash/expense_cash/`

#### Create Expense Cash Entry

**POST** `/api/v1/pay_receive_cash/expense_cash/`

### Staff Financial Operations

#### List Staff Salaries

**GET** `/api/v1/pay_receive_cash/staff/salary/`

#### Create Staff Salary Entry

**POST** `/api/v1/pay_receive_cash/staff/salary/`

#### List Staff Payments/Receipts

**GET** `/api/v1/pay_receive_cash/staff/`

#### Create Staff Payment/Receipt

**POST** `/api/v1/pay_receive_cash/staff/`

### Customer Financial Operations

#### List Customer Payments/Receipts

**GET** `/api/v1/pay_receive_cash/customer/`

#### Create Customer Payment/Receipt

**POST** `/api/v1/pay_receive_cash/customer/`

**Request Body:**

```json
{
  "customer": 1,
  "amount": "500.00",
  "type": "payment",
  "date": "2024-01-15",
  "description": "Invoice payment",
  "account": 1
}
```

### Supplier Financial Operations

#### List Supplier Payments/Receipts

**GET** `/api/v1/pay_receive_cash/supplier/`

#### Create Supplier Payment/Receipt

**POST** `/api/v1/pay_receive_cash/supplier/`

### Bank Transfers

#### List Bank/Cash Transfers

**GET** `/api/v1/pay_receive_cash/bank_cash_transfer/`

#### Create Bank/Cash Transfer

**POST** `/api/v1/pay_receive_cash/bank_cash_transfer/`

**Request Body:**

```json
{
  "from_account": 1,
  "to_account": 2,
  "amount": "1000.00",
  "date": "2024-01-15",
  "description": "Transfer to secondary account"
}
```

### Exchange Operations

#### List Exchange Union Entries

**GET** `/api/v1/pay_receive_cash/exchange_union/`

#### Create Exchange Union Entry

**POST** `/api/v1/pay_receive_cash/exchange_union/`

### Withdrawals

#### List Withdrawals

**GET** `/api/v1/pay_receive_cash/withdrawal/`

#### Create Withdrawal

**POST** `/api/v1/pay_receive_cash/withdrawal/`

### Journal Reports

#### Get Journal Report

**GET** `/api/v1/pay_receive_cash/report/journal/`

---

## Inventory Management

Base URL: `/api/v1/inventory/`

### Warehouse Management

#### List Warehouses

**GET** `/api/v1/inventory/warehouse/`

Retrieve a list of warehouses.

**Response:**

```json
{
  "count": 3,
  "results": [
    {
      "id": 1,
      "name": "Main Warehouse",
      "location": "Downtown Location",
      "address": "123 Warehouse St",
      "manager": "John Manager",
      "capacity": "10000.00",
      "current_stock": "7500.00",
      "is_active": true
    }
  ]
}
```

#### Create Warehouse

**POST** `/api/v1/inventory/warehouse/`

**Request Body:**

```json
{
  "name": "Secondary Warehouse",
  "location": "Suburb Location",
  "address": "456 Storage Ave",
  "manager": "Jane Manager",
  "capacity": "5000.00"
}
```

#### Get Warehouse Details

**GET** `/api/v1/inventory/warehouse/{id}/`

#### Update Warehouse

**PATCH** `/api/v1/inventory/warehouse/{id}/`

#### Delete Warehouse

**DELETE** `/api/v1/inventory/warehouse/{id}/`

---

## Reports

Base URL: `/api/v1/accounting_reports/`

### Warehouse Reports

#### Product Statistics Report

**GET** `/api/v1/accounting_reports/warehouse/product_statistic/`

Get product availability statistics.

**Query Parameters:**

- `warehouse`: Filter by warehouse ID
- `category`: Filter by product category
- `date_from`: Start date for the report
- `date_to`: End date for the report

#### Product Deficits Report

**GET** `/api/v1/accounting_reports/warehouse/product_deficits/`

Get products that are below minimum stock levels.

#### Sales Price Report

**GET** `/api/v1/accounting_reports/warehouse/sales_price/`

#### Purchase Price Report

**GET** `/api/v1/accounting_reports/warehouse/purchase_price/`

#### Product Expiration Report

**GET** `/api/v1/accounting_reports/warehouse/product_expiration/`

#### Inventory Report

**GET** `/api/v1/accounting_reports/warehouse/inventory/`

Generate inventory report.

**GET** `/api/v1/accounting_reports/warehouse/inventory/result/`

Get inventory report results.

#### Warehouse Cardex Report

**GET** `/api/v1/accounting_reports/warehouse/warehouse_cardex/`

**GET** `/api/v1/accounting_reports/warehouse/warehouse_cardex/result/`

#### Sales Invoice Report

**GET** `/api/v1/accounting_reports/warehouse/sales_invoice/`

**GET** `/api/v1/accounting_reports/warehouse/sales_invoice/result/`

#### Invoice Reports

**GET** `/api/v1/accounting_reports/warehouse/invoice_report/`

**GET** `/api/v1/accounting_reports/warehouse/invoice_report/result/`

#### Invoice by Product Report

**GET** `/api/v1/accounting_reports/warehouse/invoice_by_product/`

**GET** `/api/v1/accounting_reports/warehouse/invoice_by_product/result/`

#### Invoice by Person Report

**GET** `/api/v1/accounting_reports/warehouse/invoice_by_person/`

**GET** `/api/v1/accounting_reports/warehouse/invoice_by_person/result/`

#### Product Profit Report

**GET** `/api/v1/accounting_reports/warehouse/product_profit/`

**GET** `/api/v1/accounting_reports/warehouse/product_profit/result/`

#### Graph Reports

**GET** `/api/v1/accounting_reports/warehouse/sales_invoice/graph_report/`

**GET** `/api/v1/accounting_reports/warehouse/purchase_invoice/graph_report/`

### Financial Reports

#### Journal Report

**GET** `/api/v1/accounting_reports/financial/journal/`

Generate journal entries report.

**GET** `/api/v1/accounting_reports/financial/journal/result/`

Get journal report results.

#### Account Statistics Report

**GET** `/api/v1/accounting_reports/financial/account_statistic/`

**GET** `/api/v1/accounting_reports/financial/account_statistic/result/`

#### Debit/Credit Report

**GET** `/api/v1/accounting_reports/financial/debit_credit/`

**GET** `/api/v1/accounting_reports/financial/debit_credit/result/`

#### Balance Reports

**GET** `/api/v1/accounting_reports/financial/balance/detailed/`

Get detailed balance report.

**GET** `/api/v1/accounting_reports/financial/balance/trial/`

Get trial balance report.

**GET** `/api/v1/accounting_reports/financial/balance/main/default`

Get balance sheet in base currency.

**GET** `/api/v1/accounting_reports/financial/balance/main/`

Get balance sheet in multiple currencies.

#### Profit & Loss Reports

**GET** `/api/v1/accounting_reports/financial/profit_lost/year/`

Get fiscal year profit report.

**GET** `/api/v1/accounting_reports/financial/profit_lost/`

Get profit and loss report.

#### Graph Reports

**GET** `/api/v1/accounting_reports/financial/income_report/`

Get income graph report.

**GET** `/api/v1/accounting_reports/financial/expense_report/`

Get expense graph report.

#### Dashboard Report

**GET** `/api/v1/accounting_reports/financial/dashboard/`

Get dashboard summary data.

**Response:**

```json
{
  "total_sales": "50000.00",
  "total_purchases": "30000.00",
  "total_expenses": "5000.00",
  "net_profit": "15000.00",
  "cash_balance": "25000.00",
  "bank_balance": "75000.00",
  "pending_invoices": 15,
  "overdue_invoices": 3
}
```

---

## System Settings

### Company Information

**GET/PUT** `/api/v1/company/`

### System Settings

**GET/PUT** `/api/v1/setting/`

### User Settings

**GET/PUT** `/api/v1/system_setting/`

### Currency Management

**GET/POST** `/api/v1/currency/`

### Chart of Accounts

**GET/POST** `/api/v1/chart_of_account/`

### Opening Balance

**GET/POST** `/api/v1/opening_balance/`

### Expense/Revenue Categories

**GET/POST** `/api/v1/expense_revenue/`

---

## Error Handling

### HTTP Status Codes

The API uses standard HTTP status codes:

- **200 OK**: Successful GET, PUT, PATCH requests
- **201 Created**: Successful POST requests
- **204 No Content**: Successful DELETE requests
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server errors

### Error Response Format

```json
{
  "error": "Error message",
  "details": {
    "field_name": ["Field-specific error message"]
  },
  "code": "ERROR_CODE"
}
```

### Common Error Scenarios

#### Authentication Errors

```json
{
  "detail": "Given token not valid for any token type",
  "code": "token_not_valid",
  "messages": [
    {
      "token_class": "AccessToken",
      "token_type": "access",
      "message": "Token is invalid or expired"
    }
  ]
}
```

#### Validation Errors

```json
{
  "name": ["This field is required."],
  "email": ["Enter a valid email address."],
  "price": ["Ensure this value is greater than 0."]
}
```

#### Permission Errors

```json
{
  "detail": "You do not have permission to perform this action."
}
```

---

## Common Response Formats

### Success Response

```json
{
  "status": true,
  "message": "Operation completed successfully",
  "data": {...}
}
```

### List Response with Pagination

```json
{
  "count": 100,
  "next": "http://localhost:8000/api/v1/endpoint/?page=2",
  "previous": null,
  "results": [...]
}
```

### Bulk Operation Response

```json
{
  "status": true,
  "message": "Bulk operation completed successfully",
  "created": 5,
  "updated": 3,
  "errors": []
}
```

### File Upload Response

```json
{
  "status": true,
  "message": "File uploaded successfully",
  "file_url": "http://localhost:8000/media/uploads/file.pdf"
}
```

---

## Best Practices

### Request Guidelines

1. Always include the `Authorization` header for authenticated endpoints
2. Use appropriate HTTP methods (GET, POST, PUT, PATCH, DELETE)
3. Include `Content-Type: application/json` for JSON requests
4. Use query parameters for filtering and pagination
5. Handle file uploads using `multipart/form-data`

### Response Handling

1. Always check the HTTP status code
2. Parse error responses to display meaningful messages
3. Implement proper pagination for list endpoints
4. Cache frequently accessed data when appropriate
5. Handle network timeouts and connection errors

### Security Considerations

1. Store JWT tokens securely (not in localStorage for web apps)
2. Implement token refresh logic
3. Validate all user inputs on the frontend
4. Use HTTPS in production
5. Implement proper CORS policies

### Performance Optimization

1. Use filtering and search parameters to reduce response size
2. Implement client-side caching for static data
3. Use pagination for large datasets
4. Minimize the number of API calls by using bulk operations
5. Implement proper loading states in the UI

---

## Support and Documentation

### Additional Resources

- **Swagger UI**: `http://localhost:8000/docs/swagger-ui/`
- **ReDoc**: `http://localhost:8000/docs/redoc/`
- **OpenAPI Schema**: `http://localhost:8000/schema/`

### Contact Information

- **Development Team**: MicrocisCorp
- **Repository**: https://github.com/MicrocisCorp/chenar-backend
- **Email**: chenar1099@gmail.com

### Version Information

- **API Version**: v1
- **Django Version**: 5.1
- **DRF Version**: Latest
- **Last Updated**: 2024

---

_This documentation is generated for the Chenar Backend API upgrade branch. For the most up-to-date information, please refer to the Swagger documentation at `/docs/swagger-ui/`._
