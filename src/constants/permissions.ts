export const loginPermissions = [
  {
    id: 293,
    codename: 'add_purchasepayment',
    name: 'Can add purchase payment',
    content_type: 'purchasepayment',
  },
  {
    id: 294,
    codename: 'change_purchasepayment',
    name: 'Can change purchase payment',
    content_type: 'purchasepayment',
  },
  {
    id: 295,
    codename: 'delete_purchasepayment',
    name: 'Can delete purchase payment',
    content_type: 'purchasepayment',
  },
  {
    id: 296,
    codename: 'view_purchasepayment',
    name: 'Can view purchase payment',
    content_type: 'purchasepayment',
  },
  {
    id: 289,
    codename: 'add_purchaseinvoiceitem',
    name: 'Can add purchase_invoice_item',
    content_type: 'purchaseinvoiceitem',
  },
  {
    id: 290,
    codename: 'change_purchaseinvoiceitem',
    name: 'Can change purchase_invoice_item',
    content_type: 'purchaseinvoiceitem',
  },
  {
    id: 291,
    codename: 'delete_purchaseinvoiceitem',
    name: 'Can delete purchase_invoice_item',
    content_type: 'purchaseinvoiceitem',
  },
  {
    id: 292,
    codename: 'view_purchaseinvoiceitem',
    name: 'Can view purchase_invoice_item',
    content_type: 'purchaseinvoiceitem',
  },
  {
    id: 293,
    codename: 'add_purchasepayment',
    name: 'Can add purchase payment',
    content_type: 'purchasepayment',
  },
  {
    id: 294,
    codename: 'change_purchasepayment',
    name: 'Can change purchase payment',
    content_type: 'purchasepayment',
  },
  {
    id: 295,
    codename: 'delete_purchasepayment',
    name: 'Can delete purchase payment',
    content_type: 'purchasepayment',
  },
  {
    id: 296,
    codename: 'view_purchasepayment',
    name: 'Can view purchase payment',
    content_type: 'purchasepayment',
  },
];

export const permissionsList = [
  {
    model: 'cashfin',
    title: 'cashfin',
    key: 'cashfin',
    children: [
      {
        codename: 'add_cashfin',
        title: 'Can add journal',
        key: 'cashfin',
        children: [
          {
            id: 105,
            key: 'add_staffsalary',
            title: 'Can add staff salary',
            content_type: 'staffsalary',
          },
          {
            id: 106,
            key: 'change_staffsalary',
            title: 'Can change staff salary',
            content_type: 'staffsalary',
          },
          {
            id: 107,
            key: 'delete_staffsalary',
            title: 'Can delete staff salary',
            content_type: 'staffsalary',
          },
          {
            id: 108,
            key: 'view_staffsalary',
            title: 'Can view staff salary',
            content_type: 'staffsalary',
          },
        ],
      },
      {
        codename: 74,
        key: 'change_cashfin',
        title: 'Can change journal',
        content_type: 'cashfin',
      },
      {
        codename: 75,
        key: 'delete_cashfin',
        title: 'Can delete journal',
        content_type: 'cashfin',
      },
      {
        codename: 76,
        key: 'view_cashfin',
        title: 'Can view journal',
        content_type: 'cashfin',
      },
    ],
  },
  {
    model: 'bankcashtransfer',
    title: 'bankcashtransfer',
    key: 'bankcashtransfer',
    children: [
      {
        codename: 77,
        key: 'add_bankcashtransfer',
        title: 'Can add cash transfer',
        content_type: 'bankcashtransfer',
      },
      {
        codename: 78,
        key: 'change_bankcashtransfer',
        title: 'Can change cash transfer',
        content_type: 'bankcashtransfer',
      },
      {
        codename: 79,
        key: 'delete_bankcashtransfer',
        title: 'Can delete cash transfer',
        content_type: 'bankcashtransfer',
      },
      {
        codename: 80,
        key: 'view_bankcashtransfer',
        title: 'Can view cash transfer',
        content_type: 'bankcashtransfer',
      },
    ],
  },
  {
    model: 'cashflow',
    title: 'cashflow',
    key: 'cashflow',
    children: [
      {
        codename: 81,
        key: 'add_cashflow',
        title: 'Can add cash flow',
        content_type: 'cashflow',
      },
      {
        codename: 82,
        key: 'change_cashflow',
        title: 'Can change cash flow',
        content_type: 'cashflow',
      },
      {
        codename: 83,
        key: 'delete_cashflow',
        title: 'Can delete cash flow',
        content_type: 'cashflow',
      },
      {
        codename: 84,
        key: 'view_cashflow',
        title: 'Can view cash flow',
        content_type: 'cashflow',
      },
    ],
  },
  {
    model: 'customerpayrec',
    title: 'customerpayrec',
    key: 'customerpayrec',
    children: [
      {
        codename: 85,
        key: 'add_customerpayrec',
        title: 'Can add customer pay and receive',
        content_type: 'customerpayrec',
      },
      {
        codename: 86,
        key: 'change_customerpayrec',
        title: 'Can change customer pay and receive',
        content_type: 'customerpayrec',
      },
      {
        codename: 87,
        key: 'delete_customerpayrec',
        title: 'Can delete customer pay and receive',
        content_type: 'customerpayrec',
      },
      {
        codename: 88,
        key: 'view_customerpayrec',
        title: 'Can view customer pay and receive',
        content_type: 'customerpayrec',
      },
    ],
  },
];

export const allPermissions = [
  {
    model: 'cashfin',
    permission_set: [
      {
        id: 73,
        codename: 'add_cashfin',
        name: 'Can add journal',
        content_type: 'cashfin',
      },
      {
        id: 74,
        codename: 'change_cashfin',
        name: 'Can change journal',
        content_type: 'cashfin',
      },
      {
        id: 75,
        codename: 'delete_cashfin',
        name: 'Can delete journal',
        content_type: 'cashfin',
      },
      {
        id: 76,
        codename: 'view_cashfin',
        name: 'Can view journal',
        content_type: 'cashfin',
      },
    ],
  },
  {
    model: 'bankcashtransfer',
    permission_set: [
      {
        id: 77,
        codename: 'add_bankcashtransfer',
        name: 'Can add cash transfer',
        content_type: 'bankcashtransfer',
      },
      {
        id: 78,
        codename: 'change_bankcashtransfer',
        name: 'Can change cash transfer',
        content_type: 'bankcashtransfer',
      },
      {
        id: 79,
        codename: 'delete_bankcashtransfer',
        name: 'Can delete cash transfer',
        content_type: 'bankcashtransfer',
      },
      {
        id: 80,
        codename: 'view_bankcashtransfer',
        name: 'Can view cash transfer',
        content_type: 'bankcashtransfer',
      },
    ],
  },
  {
    model: 'cashflow',
    permission_set: [
      {
        id: 81,
        codename: 'add_cashflow',
        name: 'Can add cash flow',
        content_type: 'cashflow',
      },
      {
        id: 82,
        codename: 'change_cashflow',
        name: 'Can change cash flow',
        content_type: 'cashflow',
      },
      {
        id: 83,
        codename: 'delete_cashflow',
        name: 'Can delete cash flow',
        content_type: 'cashflow',
      },
      {
        id: 84,
        codename: 'view_cashflow',
        name: 'Can view cash flow',
        content_type: 'cashflow',
      },
    ],
  },
  {
    model: 'customerpayrec',
    permission_set: [
      {
        id: 85,
        codename: 'add_customerpayrec',
        name: 'Can add customer pay and receive',
        content_type: 'customerpayrec',
      },
      {
        id: 86,
        codename: 'change_customerpayrec',
        name: 'Can change customer pay and receive',
        content_type: 'customerpayrec',
      },
      {
        id: 87,
        codename: 'delete_customerpayrec',
        name: 'Can delete customer pay and receive',
        content_type: 'customerpayrec',
      },
      {
        id: 88,
        codename: 'view_customerpayrec',
        name: 'Can view customer pay and receive',
        content_type: 'customerpayrec',
      },
    ],
  },
  {
    model: 'exchangeunion',
    permission_set: [
      {
        id: 89,
        codename: 'add_exchangeunion',
        name: 'Can add exchange union',
        content_type: 'exchangeunion',
      },
      {
        id: 90,
        codename: 'change_exchangeunion',
        name: 'Can change exchange union',
        content_type: 'exchangeunion',
      },
      {
        id: 91,
        codename: 'delete_exchangeunion',
        name: 'Can delete exchange union',
        content_type: 'exchangeunion',
      },
      {
        id: 92,
        codename: 'view_exchangeunion',
        name: 'Can view exchange union',
        content_type: 'exchangeunion',
      },
    ],
  },
  {
    model: 'expensecashfin',
    permission_set: [
      {
        id: 93,
        codename: 'add_expensecashfin',
        name: 'Can add expense cash',
        content_type: 'expensecashfin',
      },
      {
        id: 94,
        codename: 'change_expensecashfin',
        name: 'Can change expense cash',
        content_type: 'expensecashfin',
      },
      {
        id: 95,
        codename: 'delete_expensecashfin',
        name: 'Can delete expense cash',
        content_type: 'expensecashfin',
      },
      {
        id: 96,
        codename: 'view_expensecashfin',
        name: 'Can view expense cash',
        content_type: 'expensecashfin',
      },
    ],
  },
  {
    model: 'incomecashfin',
    permission_set: [
      {
        id: 97,
        codename: 'add_incomecashfin',
        name: 'Can add income cash',
        content_type: 'incomecashfin',
      },
      {
        id: 98,
        codename: 'change_incomecashfin',
        name: 'Can change income cash',
        content_type: 'incomecashfin',
      },
      {
        id: 99,
        codename: 'delete_incomecashfin',
        name: 'Can delete income cash',
        content_type: 'incomecashfin',
      },
      {
        id: 100,
        codename: 'view_incomecashfin',
        name: 'Can view income cash',
        content_type: 'incomecashfin',
      },
    ],
  },
  {
    model: 'staffpayrec',
    permission_set: [
      {
        id: 101,
        codename: 'add_staffpayrec',
        name: 'Can add staff pay and receive',
        content_type: 'staffpayrec',
      },
      {
        id: 102,
        codename: 'change_staffpayrec',
        name: 'Can change staff pay and receive',
        content_type: 'staffpayrec',
      },
      {
        id: 103,
        codename: 'delete_staffpayrec',
        name: 'Can delete staff pay and receive',
        content_type: 'staffpayrec',
      },
      {
        id: 104,
        codename: 'view_staffpayrec',
        name: 'Can view staff pay and receive',
        content_type: 'staffpayrec',
      },
    ],
  },
  {
    model: 'staffsalary',
    permission_set: [
      {
        id: 105,
        codename: 'add_staffsalary',
        name: 'Can add staff salary',
        content_type: 'staffsalary',
      },
      {
        id: 106,
        codename: 'change_staffsalary',
        name: 'Can change staff salary',
        content_type: 'staffsalary',
      },
      {
        id: 107,
        codename: 'delete_staffsalary',
        name: 'Can delete staff salary',
        content_type: 'staffsalary',
      },
      {
        id: 108,
        codename: 'view_staffsalary',
        name: 'Can view staff salary',
        content_type: 'staffsalary',
      },
    ],
  },
  {
    model: 'supplierpayrec',
    permission_set: [
      {
        id: 109,
        codename: 'add_supplierpayrec',
        name: 'Can add supplier pay and receive',
        content_type: 'supplierpayrec',
      },
      {
        id: 110,
        codename: 'change_supplierpayrec',
        name: 'Can change supplier pay and receive',
        content_type: 'supplierpayrec',
      },
      {
        id: 111,
        codename: 'delete_supplierpayrec',
        name: 'Can delete supplier pay and receive',
        content_type: 'supplierpayrec',
      },
      {
        id: 112,
        codename: 'view_supplierpayrec',
        name: 'Can view supplier pay and receive',
        content_type: 'supplierpayrec',
      },
    ],
  },
  {
    model: 'withdrawpayrec',
    permission_set: [
      {
        id: 113,
        codename: 'add_withdrawpayrec',
        name: 'Can add withdrawals or reject withdrawals',
        content_type: 'withdrawpayrec',
      },
      {
        id: 114,
        codename: 'change_withdrawpayrec',
        name: 'Can change withdrawals or reject withdrawals',
        content_type: 'withdrawpayrec',
      },
      {
        id: 115,
        codename: 'delete_withdrawpayrec',
        name: 'Can delete withdrawals or reject withdrawals',
        content_type: 'withdrawpayrec',
      },
      {
        id: 116,
        codename: 'view_withdrawpayrec',
        name: 'Can view withdrawals or reject withdrawals',
        content_type: 'withdrawpayrec',
      },
    ],
  },
  {
    model: 'systemuser',
    permission_set: [
      {
        id: 117,
        codename: 'add_systemuser',
        name: 'Can add SystemUser',
        content_type: 'systemuser',
      },
      {
        id: 118,
        codename: 'change_systemuser',
        name: 'Can change SystemUser',
        content_type: 'systemuser',
      },
      {
        id: 119,
        codename: 'delete_systemuser',
        name: 'Can delete SystemUser',
        content_type: 'systemuser',
      },
      {
        id: 120,
        codename: 'view_systemuser',
        name: 'Can view SystemUser',
        content_type: 'systemuser',
      },
    ],
  },
  {
    model: 'permissiondependency',
    permission_set: [
      {
        id: 121,
        codename: 'add_permissiondependency',
        name: 'Can add permission dependency',
        content_type: 'permissiondependency',
      },
      {
        id: 122,
        codename: 'change_permissiondependency',
        name: 'Can change permission dependency',
        content_type: 'permissiondependency',
      },
      {
        id: 123,
        codename: 'delete_permissiondependency',
        name: 'Can delete permission dependency',
        content_type: 'permissiondependency',
      },
      {
        id: 124,
        codename: 'view_permissiondependency',
        name: 'Can view permission dependency',
        content_type: 'permissiondependency',
      },
    ],
  },
  {
    model: 'custompermission',
    permission_set: [
      {
        id: 462,
        codename: 'view_InvoiceByPersonReport',
        name: 'Can view invoice by person report',
        content_type: 'custompermission',
      },
      {
        id: 463,
        codename: 'view_InvoiceByProductReport',
        name: 'Can view invoice by product report',
        content_type: 'custompermission',
      },
      {
        id: 458,
        codename: 'view_InvoicesReport',
        name: 'Can view invoices report',
        content_type: 'custompermission',
      },
      {
        id: 461,
        codename: 'view_ProductExpirationReport',
        name: 'Can view product expiration report',
        content_type: 'custompermission',
      },
      {
        id: 467,
        codename: 'view_ProductStatisticReport',
        name: 'Can view product statistic report',
        content_type: 'custompermission',
      },
      {
        id: 465,
        codename: 'view_SalesGraphReport',
        name: 'Can view sales graph report',
        content_type: 'custompermission',
      },
      {
        id: 466,
        codename: 'view_SalesProfitReport',
        name: 'Can view sales profit report',
        content_type: 'custompermission',
      },
      {
        id: 464,
        codename: 'view_TopSalesReport',
        name: 'Can view top sales report',
        content_type: 'custompermission',
      },
      {
        id: 459,
        codename: 'view_WarehouseCardexReport',
        name: 'Can view warehouse cardex report',
        content_type: 'custompermission',
      },
      {
        id: 468,
        codename: 'view_WarehouseStatisticReport',
        name: 'Can view warehouse statistic report',
        content_type: 'custompermission',
      },
      {
        id: 460,
        codename: 'view_customer_account',
        name: 'Can view customer account',
        content_type: 'custompermission',
      },
    ],
  },
  {
    model: 'systemcalender',
    permission_set: [
      {
        id: 125,
        codename: 'add_systemcalender',
        name: 'Can add system calender',
        content_type: 'systemcalender',
      },
      {
        id: 126,
        codename: 'change_systemcalender',
        name: 'Can change system calender',
        content_type: 'systemcalender',
      },
      {
        id: 127,
        codename: 'delete_systemcalender',
        name: 'Can delete system calender',
        content_type: 'systemcalender',
      },
      {
        id: 128,
        codename: 'view_systemcalender',
        name: 'Can view system calender',
        content_type: 'systemcalender',
      },
    ],
  },
  {
    model: 'systemlanguage',
    permission_set: [
      {
        id: 129,
        codename: 'add_systemlanguage',
        name: 'Can add user settings language',
        content_type: 'systemlanguage',
      },
      {
        id: 130,
        codename: 'change_systemlanguage',
        name: 'Can change user settings language',
        content_type: 'systemlanguage',
      },
      {
        id: 131,
        codename: 'delete_systemlanguage',
        name: 'Can delete user settings language',
        content_type: 'systemlanguage',
      },
      {
        id: 132,
        codename: 'view_systemlanguage',
        name: 'Can view user settings language',
        content_type: 'systemlanguage',
      },
    ],
  },
  {
    model: 'systemtheme',
    permission_set: [
      {
        id: 133,
        codename: 'add_systemtheme',
        name: 'Can add StaffCategory',
        content_type: 'systemtheme',
      },
      {
        id: 134,
        codename: 'change_systemtheme',
        name: 'Can change StaffCategory',
        content_type: 'systemtheme',
      },
      {
        id: 135,
        codename: 'delete_systemtheme',
        name: 'Can delete StaffCategory',
        content_type: 'systemtheme',
      },
      {
        id: 136,
        codename: 'view_systemtheme',
        name: 'Can view StaffCategory',
        content_type: 'systemtheme',
      },
    ],
  },
  {
    model: 'companyinfo',
    permission_set: [
      {
        id: 137,
        codename: 'add_companyinfo',
        name: 'Can add CompanyInfo',
        content_type: 'companyinfo',
      },
      {
        id: 138,
        codename: 'change_companyinfo',
        name: 'Can change CompanyInfo',
        content_type: 'companyinfo',
      },
      {
        id: 139,
        codename: 'delete_companyinfo',
        name: 'Can delete CompanyInfo',
        content_type: 'companyinfo',
      },
      {
        id: 140,
        codename: 'view_companyinfo',
        name: 'Can view CompanyInfo',
        content_type: 'companyinfo',
      },
    ],
  },
  {
    model: 'companysmtp',
    permission_set: [
      {
        id: 141,
        codename: 'add_companysmtp',
        name: 'Can add CompanySmtp',
        content_type: 'companysmtp',
      },
      {
        id: 142,
        codename: 'change_companysmtp',
        name: 'Can change CompanySmtp',
        content_type: 'companysmtp',
      },
      {
        id: 143,
        codename: 'delete_companysmtp',
        name: 'Can delete CompanySmtp',
        content_type: 'companysmtp',
      },
      {
        id: 144,
        codename: 'view_companysmtp',
        name: 'Can view CompanySmtp',
        content_type: 'companysmtp',
      },
    ],
  },
  {
    model: 'backup',
    permission_set: [
      {
        id: 145,
        codename: 'add_backup',
        name: 'Can add backup',
        content_type: 'backup',
      },
      {
        id: 146,
        codename: 'change_backup',
        name: 'Can change backup',
        content_type: 'backup',
      },
      {
        id: 147,
        codename: 'delete_backup',
        name: 'Can delete backup',
        content_type: 'backup',
      },
      {
        id: 148,
        codename: 'view_backup',
        name: 'Can view backup',
        content_type: 'backup',
      },
    ],
  },
  {
    model: 'financialperiod',
    permission_set: [
      {
        id: 149,
        codename: 'add_financialperiod',
        name: 'Can add Financial Period',
        content_type: 'financialperiod',
      },
      {
        id: 150,
        codename: 'change_financialperiod',
        name: 'Can change Financial Period',
        content_type: 'financialperiod',
      },
      {
        id: 151,
        codename: 'delete_financialperiod',
        name: 'Can delete Financial Period',
        content_type: 'financialperiod',
      },
      {
        id: 152,
        codename: 'view_financialperiod',
        name: 'Can view Financial Period',
        content_type: 'financialperiod',
      },
    ],
  },
  {
    model: 'customercategory',
    permission_set: [
      {
        id: 153,
        codename: 'add_customercategory',
        name: 'Can add customer category',
        content_type: 'customercategory',
      },
      {
        id: 154,
        codename: 'change_customercategory',
        name: 'Can change customer category',
        content_type: 'customercategory',
      },
      {
        id: 155,
        codename: 'delete_customercategory',
        name: 'Can delete customer category',
        content_type: 'customercategory',
      },
      {
        id: 156,
        codename: 'view_customercategory',
        name: 'Can view customer category',
        content_type: 'customercategory',
      },
    ],
  },
  {
    model: 'customer',
    permission_set: [
      {
        id: 157,
        codename: 'add_customer',
        name: 'Can add customer',
        content_type: 'customer',
      },
      {
        id: 158,
        codename: 'change_customer',
        name: 'Can change customer',
        content_type: 'customer',
      },
      {
        id: 159,
        codename: 'delete_customer',
        name: 'Can delete customer',
        content_type: 'customer',
      },
      {
        id: 160,
        codename: 'view_customer',
        name: 'Can view customer',
        content_type: 'customer',
      },
    ],
  },
  {
    model: 'discounttype',
    permission_set: [
      {
        id: 161,
        codename: 'add_discounttype',
        name: 'Can add discount type',
        content_type: 'discounttype',
      },
      {
        id: 162,
        codename: 'change_discounttype',
        name: 'Can change discount type',
        content_type: 'discounttype',
      },
      {
        id: 163,
        codename: 'delete_discounttype',
        name: 'Can delete discount type',
        content_type: 'discounttype',
      },
      {
        id: 164,
        codename: 'view_discounttype',
        name: 'Can view discount type',
        content_type: 'discounttype',
      },
    ],
  },
  {
    model: 'discountcard',
    permission_set: [
      {
        id: 165,
        codename: 'add_discountcard',
        name: 'Can add discount card',
        content_type: 'discountcard',
      },
      {
        id: 166,
        codename: 'change_discountcard',
        name: 'Can change discount card',
        content_type: 'discountcard',
      },
      {
        id: 167,
        codename: 'delete_discountcard',
        name: 'Can delete discount card',
        content_type: 'discountcard',
      },
      {
        id: 168,
        codename: 'view_discountcard',
        name: 'Can view discount card',
        content_type: 'discountcard',
      },
    ],
  },
  {
    model: 'customerdiscount',
    permission_set: [
      {
        id: 169,
        codename: 'add_customerdiscount',
        name: 'Can add customer discount',
        content_type: 'customerdiscount',
      },
      {
        id: 170,
        codename: 'change_customerdiscount',
        name: 'Can change customer discount',
        content_type: 'customerdiscount',
      },
      {
        id: 171,
        codename: 'delete_customerdiscount',
        name: 'Can delete customer discount',
        content_type: 'customerdiscount',
      },
      {
        id: 172,
        codename: 'view_customerdiscount',
        name: 'Can view customer discount',
        content_type: 'customerdiscount',
      },
    ],
  },
  {
    model: 'staffcategory',
    permission_set: [
      {
        id: 173,
        codename: 'add_staffcategory',
        name: 'Can add StaffCategory',
        content_type: 'staffcategory',
      },
      {
        id: 174,
        codename: 'change_staffcategory',
        name: 'Can change StaffCategory',
        content_type: 'staffcategory',
      },
      {
        id: 175,
        codename: 'delete_staffcategory',
        name: 'Can delete StaffCategory',
        content_type: 'staffcategory',
      },
      {
        id: 176,
        codename: 'view_staffcategory',
        name: 'Can view StaffCategory',
        content_type: 'staffcategory',
      },
    ],
  },
  {
    model: 'staff',
    permission_set: [
      {
        id: 177,
        codename: 'add_staff',
        name: 'Can add Staff',
        content_type: 'staff',
      },
      {
        id: 178,
        codename: 'change_staff',
        name: 'Can change Staff',
        content_type: 'staff',
      },
      {
        id: 179,
        codename: 'delete_staff',
        name: 'Can delete Staff',
        content_type: 'staff',
      },
      {
        id: 180,
        codename: 'view_staff',
        name: 'Can view Staff',
        content_type: 'staff',
      },
    ],
  },
  {
    model: 'suppliercategory',
    permission_set: [
      {
        id: 181,
        codename: 'add_suppliercategory',
        name: 'Can add SupplierCategory',
        content_type: 'suppliercategory',
      },
      {
        id: 182,
        codename: 'change_suppliercategory',
        name: 'Can change SupplierCategory',
        content_type: 'suppliercategory',
      },
      {
        id: 183,
        codename: 'delete_suppliercategory',
        name: 'Can delete SupplierCategory',
        content_type: 'suppliercategory',
      },
      {
        id: 184,
        codename: 'view_suppliercategory',
        name: 'Can view SupplierCategory',
        content_type: 'suppliercategory',
      },
    ],
  },
  {
    model: 'supplier',
    permission_set: [
      {
        id: 185,
        codename: 'add_supplier',
        name: 'Can add Supplier',
        content_type: 'supplier',
      },
      {
        id: 186,
        codename: 'change_supplier',
        name: 'Can change Supplier',
        content_type: 'supplier',
      },
      {
        id: 187,
        codename: 'delete_supplier',
        name: 'Can delete Supplier',
        content_type: 'supplier',
      },
      {
        id: 188,
        codename: 'view_supplier',
        name: 'Can view Supplier',
        content_type: 'supplier',
      },
    ],
  },
  {
    model: 'product',
    permission_set: [
      {
        id: 189,
        codename: 'add_product',
        name: 'Can add Product',
        content_type: 'product',
      },
      {
        id: 190,
        codename: 'change_product',
        name: 'Can change Product',
        content_type: 'product',
      },
      {
        id: 191,
        codename: 'delete_product',
        name: 'Can delete Product',
        content_type: 'product',
      },
      {
        id: 192,
        codename: 'view_product',
        name: 'Can view Product',
        content_type: 'product',
      },
    ],
  },
  {
    model: 'productcategory',
    permission_set: [
      {
        id: 193,
        codename: 'add_productcategory',
        name: 'Can add ProductCategory',
        content_type: 'productcategory',
      },
      {
        id: 194,
        codename: 'change_productcategory',
        name: 'Can change ProductCategory',
        content_type: 'productcategory',
      },
      {
        id: 195,
        codename: 'delete_productcategory',
        name: 'Can delete ProductCategory',
        content_type: 'productcategory',
      },
      {
        id: 196,
        codename: 'view_productcategory',
        name: 'Can view ProductCategory',
        content_type: 'productcategory',
      },
    ],
  },
  {
    model: 'productpricesetting',
    permission_set: [
      {
        id: 197,
        codename: 'add_productpricesetting',
        name: 'Can add product price setting',
        content_type: 'productpricesetting',
      },
      {
        id: 198,
        codename: 'change_productpricesetting',
        name: 'Can change product price setting',
        content_type: 'productpricesetting',
      },
      {
        id: 199,
        codename: 'delete_productpricesetting',
        name: 'Can delete product price setting',
        content_type: 'productpricesetting',
      },
      {
        id: 200,
        codename: 'view_productpricesetting',
        name: 'Can view product price setting',
        content_type: 'productpricesetting',
      },
    ],
  },
  {
    model: 'productsetting',
    permission_set: [
      {
        id: 201,
        codename: 'add_productsetting',
        name: 'Can add product_setting',
        content_type: 'productsetting',
      },
      {
        id: 202,
        codename: 'change_productsetting',
        name: 'Can change product_setting',
        content_type: 'productsetting',
      },
      {
        id: 203,
        codename: 'delete_productsetting',
        name: 'Can delete product_setting',
        content_type: 'productsetting',
      },
      {
        id: 204,
        codename: 'view_productsetting',
        name: 'Can view product_setting',
        content_type: 'productsetting',
      },
    ],
  },
  {
    model: 'unit',
    permission_set: [
      {
        id: 205,
        codename: 'add_unit',
        name: 'Can add unit',
        content_type: 'unit',
      },
      {
        id: 206,
        codename: 'change_unit',
        name: 'Can change unit',
        content_type: 'unit',
      },
      {
        id: 207,
        codename: 'delete_unit',
        name: 'Can delete unit',
        content_type: 'unit',
      },
      {
        id: 208,
        codename: 'view_unit',
        name: 'Can view unit',
        content_type: 'unit',
      },
    ],
  },
  {
    model: 'vipprice',
    permission_set: [
      {
        id: 209,
        codename: 'add_vipprice',
        name: 'Can add vip price',
        content_type: 'vipprice',
      },
      {
        id: 210,
        codename: 'change_vipprice',
        name: 'Can change vip price',
        content_type: 'vipprice',
      },
      {
        id: 211,
        codename: 'delete_vipprice',
        name: 'Can delete vip price',
        content_type: 'vipprice',
      },
      {
        id: 212,
        codename: 'view_vipprice',
        name: 'Can view vip price',
        content_type: 'vipprice',
      },
    ],
  },
  {
    model: 'unitconversion',
    permission_set: [
      {
        id: 213,
        codename: 'add_unitconversion',
        name: 'Can add unitConversion',
        content_type: 'unitconversion',
      },
      {
        id: 214,
        codename: 'change_unitconversion',
        name: 'Can change unitConversion',
        content_type: 'unitconversion',
      },
      {
        id: 215,
        codename: 'delete_unitconversion',
        name: 'Can delete unitConversion',
        content_type: 'unitconversion',
      },
      {
        id: 216,
        codename: 'view_unitconversion',
        name: 'Can view unitConversion',
        content_type: 'unitconversion',
      },
    ],
  },
  {
    model: 'productunit',
    permission_set: [
      {
        id: 217,
        codename: 'add_productunit',
        name: 'Can add product unit',
        content_type: 'productunit',
      },
      {
        id: 218,
        codename: 'change_productunit',
        name: 'Can change product unit',
        content_type: 'productunit',
      },
      {
        id: 219,
        codename: 'delete_productunit',
        name: 'Can delete product unit',
        content_type: 'productunit',
      },
      {
        id: 220,
        codename: 'view_productunit',
        name: 'Can view product unit',
        content_type: 'productunit',
      },
    ],
  },
  {
    model: 'productprice',
    permission_set: [
      {
        id: 221,
        codename: 'add_productprice',
        name: 'Can add product price',
        content_type: 'productprice',
      },
      {
        id: 222,
        codename: 'change_productprice',
        name: 'Can change product price',
        content_type: 'productprice',
      },
      {
        id: 223,
        codename: 'delete_productprice',
        name: 'Can delete product price',
        content_type: 'productprice',
      },
      {
        id: 224,
        codename: 'view_productprice',
        name: 'Can view product price',
        content_type: 'productprice',
      },
    ],
  },
  {
    model: 'productmini',
    permission_set: [
      {
        id: 225,
        codename: 'add_productmini',
        name: 'Can add product mini',
        content_type: 'productmini',
      },
      {
        id: 226,
        codename: 'change_productmini',
        name: 'Can change product mini',
        content_type: 'productmini',
      },
      {
        id: 227,
        codename: 'delete_productmini',
        name: 'Can delete product mini',
        content_type: 'productmini',
      },
      {
        id: 228,
        codename: 'view_productmini',
        name: 'Can view product mini',
        content_type: 'productmini',
      },
    ],
  },
  {
    model: 'productbarcode',
    permission_set: [
      {
        id: 229,
        codename: 'add_productbarcode',
        name: 'Can add product barcode',
        content_type: 'productbarcode',
      },
      {
        id: 230,
        codename: 'change_productbarcode',
        name: 'Can change product barcode',
        content_type: 'productbarcode',
      },
      {
        id: 231,
        codename: 'delete_productbarcode',
        name: 'Can delete product barcode',
        content_type: 'productbarcode',
      },
      {
        id: 232,
        codename: 'view_productbarcode',
        name: 'Can view product barcode',
        content_type: 'productbarcode',
      },
    ],
  },
  {
    model: 'warehouse',
    permission_set: [
      {
        id: 233,
        codename: 'add_warehouse',
        name: 'Can add warehouse',
        content_type: 'warehouse',
      },
      {
        id: 234,
        codename: 'change_warehouse',
        name: 'Can change warehouse',
        content_type: 'warehouse',
      },
      {
        id: 235,
        codename: 'delete_warehouse',
        name: 'Can delete warehouse',
        content_type: 'warehouse',
      },
      {
        id: 236,
        codename: 'view_warehouse',
        name: 'Can view warehouse',
        content_type: 'warehouse',
      },
    ],
  },
  {
    model: 'currency',
    permission_set: [
      {
        id: 237,
        codename: 'add_currency',
        name: 'Can add currency',
        content_type: 'currency',
      },
      {
        id: 238,
        codename: 'change_currency',
        name: 'Can change currency',
        content_type: 'currency',
      },
      {
        id: 239,
        codename: 'delete_currency',
        name: 'Can delete currency',
        content_type: 'currency',
      },
      {
        id: 240,
        codename: 'view_currency',
        name: 'Can view currency',
        content_type: 'currency',
      },
    ],
  },
  {
    model: 'currencyrate',
    permission_set: [
      {
        id: 241,
        codename: 'add_currencyrate',
        name: 'Can add currency rate',
        content_type: 'currencyrate',
      },
      {
        id: 242,
        codename: 'change_currencyrate',
        name: 'Can change currency rate',
        content_type: 'currencyrate',
      },
      {
        id: 243,
        codename: 'delete_currencyrate',
        name: 'Can delete currency rate',
        content_type: 'currencyrate',
      },
      {
        id: 244,
        codename: 'view_currencyrate',
        name: 'Can view currency rate',
        content_type: 'currencyrate',
      },
    ],
  },
  {
    model: 'posinvoicesetting',
    permission_set: [
      {
        id: 245,
        codename: 'add_posinvoicesetting',
        name: 'Can add pos invoice setting',
        content_type: 'posinvoicesetting',
      },
      {
        id: 246,
        codename: 'change_posinvoicesetting',
        name: 'Can change pos invoice setting',
        content_type: 'posinvoicesetting',
      },
      {
        id: 247,
        codename: 'delete_posinvoicesetting',
        name: 'Can delete pos invoice setting',
        content_type: 'posinvoicesetting',
      },
      {
        id: 248,
        codename: 'view_posinvoicesetting',
        name: 'Can view pos invoice setting',
        content_type: 'posinvoicesetting',
      },
    ],
  },
  {
    model: 'chartofaccount',
    permission_set: [
      {
        id: 249,
        codename: 'add_chartofaccount',
        name: 'Can add ChartOfAccount',
        content_type: 'chartofaccount',
      },
      {
        id: 250,
        codename: 'change_chartofaccount',
        name: 'Can change ChartOfAccount',
        content_type: 'chartofaccount',
      },
      {
        id: 251,
        codename: 'delete_chartofaccount',
        name: 'Can delete ChartOfAccount',
        content_type: 'chartofaccount',
      },
      {
        id: 252,
        codename: 'view_chartofaccount',
        name: 'Can view ChartOfAccount',
        content_type: 'chartofaccount',
      },
    ],
  },
  {
    model: 'bank',
    permission_set: [
      {
        id: 253,
        codename: 'add_bank',
        name: 'Can add bank',
        content_type: 'bank',
      },
      {
        id: 254,
        codename: 'change_bank',
        name: 'Can change bank',
        content_type: 'bank',
      },
      {
        id: 255,
        codename: 'delete_bank',
        name: 'Can delete bank',
        content_type: 'bank',
      },
      {
        id: 256,
        codename: 'view_bank',
        name: 'Can view bank',
        content_type: 'bank',
      },
    ],
  },
  {
    model: 'cash',
    permission_set: [
      {
        id: 257,
        codename: 'add_cash',
        name: 'Can add Cash',
        content_type: 'cash',
      },
      {
        id: 258,
        codename: 'change_cash',
        name: 'Can change Cash',
        content_type: 'cash',
      },
      {
        id: 259,
        codename: 'delete_cash',
        name: 'Can delete Cash',
        content_type: 'cash',
      },
      {
        id: 260,
        codename: 'view_cash',
        name: 'Can view Cash',
        content_type: 'cash',
      },
    ],
  },
  {
    model: 'expensecategory',
    permission_set: [
      {
        id: 261,
        codename: 'add_expensecategory',
        name: 'Can add ExpenseCategory',
        content_type: 'expensecategory',
      },
      {
        id: 262,
        codename: 'change_expensecategory',
        name: 'Can change ExpenseCategory',
        content_type: 'expensecategory',
      },
      {
        id: 263,
        codename: 'delete_expensecategory',
        name: 'Can delete ExpenseCategory',
        content_type: 'expensecategory',
      },
      {
        id: 264,
        codename: 'view_expensecategory',
        name: 'Can view ExpenseCategory',
        content_type: 'expensecategory',
      },
    ],
  },
  {
    model: 'incometype',
    permission_set: [
      {
        id: 265,
        codename: 'add_incometype',
        name: 'Can add IncomeType',
        content_type: 'incometype',
      },
      {
        id: 266,
        codename: 'change_incometype',
        name: 'Can change IncomeType',
        content_type: 'incometype',
      },
      {
        id: 267,
        codename: 'delete_incometype',
        name: 'Can delete IncomeType',
        content_type: 'incometype',
      },
      {
        id: 268,
        codename: 'view_incometype',
        name: 'Can view IncomeType',
        content_type: 'incometype',
      },
    ],
  },
  {
    model: 'widthdraw',
    permission_set: [
      {
        id: 269,
        codename: 'add_widthdraw',
        name: 'Can add WidthDraw',
        content_type: 'widthdraw',
      },
      {
        id: 270,
        codename: 'change_widthdraw',
        name: 'Can change WidthDraw',
        content_type: 'widthdraw',
      },
      {
        id: 271,
        codename: 'delete_widthdraw',
        name: 'Can delete WidthDraw',
        content_type: 'widthdraw',
      },
      {
        id: 272,
        codename: 'view_widthdraw',
        name: 'Can view WidthDraw',
        content_type: 'widthdraw',
      },
    ],
  },
  {
    model: 'expensetype',
    permission_set: [
      {
        id: 273,
        codename: 'add_expensetype',
        name: 'Can add ExpenseType',
        content_type: 'expensetype',
      },
      {
        id: 274,
        codename: 'change_expensetype',
        name: 'Can change ExpenseType',
        content_type: 'expensetype',
      },
      {
        id: 275,
        codename: 'delete_expensetype',
        name: 'Can delete ExpenseType',
        content_type: 'expensetype',
      },
      {
        id: 276,
        codename: 'view_expensetype',
        name: 'Can view ExpenseType',
        content_type: 'expensetype',
      },
    ],
  },
  {
    model: 'openaccount',
    permission_set: [
      {
        id: 277,
        codename: 'add_openaccount',
        name: 'Can add OpenAccount',
        content_type: 'openaccount',
      },
      {
        id: 278,
        codename: 'change_openaccount',
        name: 'Can change OpenAccount',
        content_type: 'openaccount',
      },
      {
        id: 279,
        codename: 'delete_openaccount',
        name: 'Can delete OpenAccount',
        content_type: 'openaccount',
      },
      {
        id: 280,
        codename: 'view_openaccount',
        name: 'Can view OpenAccount',
        content_type: 'openaccount',
      },
    ],
  },
  {
    model: 'openproduct',
    permission_set: [
      {
        id: 281,
        codename: 'add_openproduct',
        name: 'Can add open product',
        content_type: 'openproduct',
      },
      {
        id: 282,
        codename: 'change_openproduct',
        name: 'Can change open product',
        content_type: 'openproduct',
      },
      {
        id: 283,
        codename: 'delete_openproduct',
        name: 'Can delete open product',
        content_type: 'openproduct',
      },
      {
        id: 284,
        codename: 'view_openproduct',
        name: 'Can view open product',
        content_type: 'openproduct',
      },
    ],
  },
  {
    model: 'purchaseinvoiceitem',
    permission_set: [
      {
        id: 289,
        codename: 'add_purchaseinvoiceitem',
        name: 'Can add purchase_invoice_item',
        content_type: 'purchaseinvoiceitem',
      },
      {
        id: 290,
        codename: 'change_purchaseinvoiceitem',
        name: 'Can change purchase_invoice_item',
        content_type: 'purchaseinvoiceitem',
      },
      {
        id: 291,
        codename: 'delete_purchaseinvoiceitem',
        name: 'Can delete purchase_invoice_item',
        content_type: 'purchaseinvoiceitem',
      },
      {
        id: 292,
        codename: 'view_purchaseinvoiceitem',
        name: 'Can view purchase_invoice_item',
        content_type: 'purchaseinvoiceitem',
      },
    ],
  },
  {
    model: 'purchasepayment',
    permission_set: [
      {
        id: 293,
        codename: 'add_purchasepayment',
        name: 'Can add purchase payment',
        content_type: 'purchasepayment',
      },
      {
        id: 294,
        codename: 'change_purchasepayment',
        name: 'Can change purchase payment',
        content_type: 'purchasepayment',
      },
      {
        id: 295,
        codename: 'delete_purchasepayment',
        name: 'Can delete purchase payment',
        content_type: 'purchasepayment',
      },
      {
        id: 296,
        codename: 'view_purchasepayment',
        name: 'Can view purchase payment',
        content_type: 'purchasepayment',
      },
    ],
  },
  {
    model: 'purchaserejectinvoiceitem',
    permission_set: [
      {
        id: 301,
        codename: 'add_purchaserejectinvoiceitem',
        name: 'Can add purchase reject invoice',
        content_type: 'purchaserejectinvoiceitem',
      },
      {
        id: 302,
        codename: 'change_purchaserejectinvoiceitem',
        name: 'Can change purchase reject invoice',
        content_type: 'purchaserejectinvoiceitem',
      },
      {
        id: 303,
        codename: 'delete_purchaserejectinvoiceitem',
        name: 'Can delete purchase reject invoice',
        content_type: 'purchaserejectinvoiceitem',
      },
      {
        id: 304,
        codename: 'view_purchaserejectinvoiceitem',
        name: 'Can view purchase reject invoice',
        content_type: 'purchaserejectinvoiceitem',
      },
    ],
  },
  {
    model: 'purchaserejpayment',
    permission_set: [
      {
        id: 305,
        codename: 'add_purchaserejpayment',
        name: 'Can add purchase rej payment',
        content_type: 'purchaserejpayment',
      },
      {
        id: 306,
        codename: 'change_purchaserejpayment',
        name: 'Can change purchase rej payment',
        content_type: 'purchaserejpayment',
      },
      {
        id: 307,
        codename: 'delete_purchaserejpayment',
        name: 'Can delete purchase rej payment',
        content_type: 'purchaserejpayment',
      },
      {
        id: 308,
        codename: 'view_purchaserejpayment',
        name: 'Can view purchase rej payment',
        content_type: 'purchaserejpayment',
      },
    ],
  },
  {
    model: 'quotationinvoiceitem',
    permission_set: [
      {
        id: 313,
        codename: 'add_quotationinvoiceitem',
        name: 'Can add quotation invoice item',
        content_type: 'quotationinvoiceitem',
      },
      {
        id: 314,
        codename: 'change_quotationinvoiceitem',
        name: 'Can change quotation invoice item',
        content_type: 'quotationinvoiceitem',
      },
      {
        id: 315,
        codename: 'delete_quotationinvoiceitem',
        name: 'Can delete quotation invoice item',
        content_type: 'quotationinvoiceitem',
      },
      {
        id: 316,
        codename: 'view_quotationinvoiceitem',
        name: 'Can view quotation invoice item',
        content_type: 'quotationinvoiceitem',
      },
    ],
  },
  {
    model: 'salesinvoiceitem',
    permission_set: [
      {
        id: 321,
        codename: 'add_salesinvoiceitem',
        name: 'Can add sales invoice item',
        content_type: 'salesinvoiceitem',
      },
      {
        id: 322,
        codename: 'change_salesinvoiceitem',
        name: 'Can change sales invoice item',
        content_type: 'salesinvoiceitem',
      },
      {
        id: 323,
        codename: 'delete_salesinvoiceitem',
        name: 'Can delete sales invoice item',
        content_type: 'salesinvoiceitem',
      },
      {
        id: 324,
        codename: 'view_salesinvoiceitem',
        name: 'Can view sales invoice item',
        content_type: 'salesinvoiceitem',
      },
    ],
  },
  {
    model: 'salespayment',
    permission_set: [
      {
        id: 325,
        codename: 'add_salespayment',
        name: 'Can add sales payment',
        content_type: 'salespayment',
      },
      {
        id: 326,
        codename: 'change_salespayment',
        name: 'Can change sales payment',
        content_type: 'salespayment',
      },
      {
        id: 327,
        codename: 'delete_salespayment',
        name: 'Can delete sales payment',
        content_type: 'salespayment',
      },
      {
        id: 328,
        codename: 'view_salespayment',
        name: 'Can view sales payment',
        content_type: 'salespayment',
      },
    ],
  },
  {
    model: 'salesrejectinvoiceitem',
    permission_set: [
      {
        id: 333,
        codename: 'add_salesrejectinvoiceitem',
        name: 'Can add sales reject invoice item',
        content_type: 'salesrejectinvoiceitem',
      },
      {
        id: 334,
        codename: 'change_salesrejectinvoiceitem',
        name: 'Can change sales reject invoice item',
        content_type: 'salesrejectinvoiceitem',
      },
      {
        id: 335,
        codename: 'delete_salesrejectinvoiceitem',
        name: 'Can delete sales reject invoice item',
        content_type: 'salesrejectinvoiceitem',
      },
      {
        id: 336,
        codename: 'view_salesrejectinvoiceitem',
        name: 'Can view sales reject invoice item',
        content_type: 'salesrejectinvoiceitem',
      },
    ],
  },
  {
    model: 'salesrejpayment',
    permission_set: [
      {
        id: 337,
        codename: 'add_salesrejpayment',
        name: 'Can add sales rej payment',
        content_type: 'salesrejpayment',
      },
      {
        id: 338,
        codename: 'change_salesrejpayment',
        name: 'Can change sales rej payment',
        content_type: 'salesrejpayment',
      },
      {
        id: 339,
        codename: 'delete_salesrejpayment',
        name: 'Can delete sales rej payment',
        content_type: 'salesrejpayment',
      },
      {
        id: 340,
        codename: 'view_salesrejpayment',
        name: 'Can view sales rej payment',
        content_type: 'salesrejpayment',
      },
    ],
  },
  {
    model: 'warehouseproducttransfer',
    permission_set: [
      {
        id: 341,
        codename: 'add_warehouseproducttransfer',
        name: 'Can add product transfer invoice',
        content_type: 'warehouseproducttransfer',
      },
      {
        id: 342,
        codename: 'change_warehouseproducttransfer',
        name: 'Can change product transfer invoice',
        content_type: 'warehouseproducttransfer',
      },
      {
        id: 343,
        codename: 'delete_warehouseproducttransfer',
        name: 'Can delete product transfer invoice',
        content_type: 'warehouseproducttransfer',
      },
      {
        id: 344,
        codename: 'view_warehouseproducttransfer',
        name: 'Can view product transfer invoice',
        content_type: 'warehouseproducttransfer',
      },
    ],
  },
  {
    model: 'warehouseproducttransferitem',
    permission_set: [
      {
        id: 345,
        codename: 'add_warehouseproducttransferitem',
        name: 'Can add warehouse product transfer item',
        content_type: 'warehouseproducttransferitem',
      },
      {
        id: 346,
        codename: 'change_warehouseproducttransferitem',
        name: 'Can change warehouse product transfer item',
        content_type: 'warehouseproducttransferitem',
      },
      {
        id: 347,
        codename: 'delete_warehouseproducttransferitem',
        name: 'Can delete warehouse product transfer item',
        content_type: 'warehouseproducttransferitem',
      },
      {
        id: 348,
        codename: 'view_warehouseproducttransferitem',
        name: 'Can view warehouse product transfer item',
        content_type: 'warehouseproducttransferitem',
      },
    ],
  },
  {
    model: 'wasteinvoiceitem',
    permission_set: [
      {
        id: 353,
        codename: 'add_wasteinvoiceitem',
        name: 'Can add waste invoice item',
        content_type: 'wasteinvoiceitem',
      },
      {
        id: 354,
        codename: 'change_wasteinvoiceitem',
        name: 'Can change waste invoice item',
        content_type: 'wasteinvoiceitem',
      },
      {
        id: 355,
        codename: 'delete_wasteinvoiceitem',
        name: 'Can delete waste invoice item',
        content_type: 'wasteinvoiceitem',
      },
      {
        id: 356,
        codename: 'view_wasteinvoiceitem',
        name: 'Can view waste invoice item',
        content_type: 'wasteinvoiceitem',
      },
    ],
  },
  {
    model: 'datareport',
    permission_set: [
      {
        id: 357,
        codename: 'add_datareport',
        name: 'Can add data report',
        content_type: 'datareport',
      },
      {
        id: 358,
        codename: 'change_datareport',
        name: 'Can change data report',
        content_type: 'datareport',
      },
      {
        id: 359,
        codename: 'delete_datareport',
        name: 'Can delete data report',
        content_type: 'datareport',
      },
      {
        id: 360,
        codename: 'view_datareport',
        name: 'Can view data report',
        content_type: 'datareport',
      },
    ],
  },
  {
    model: 'dataperms',
    permission_set: [
      {
        id: 361,
        codename: 'add_dataperms',
        name: 'Can add data perms',
        content_type: 'dataperms',
      },
      {
        id: 362,
        codename: 'change_dataperms',
        name: 'Can change data perms',
        content_type: 'dataperms',
      },
      {
        id: 365,
        codename: 'code_extra',
        name: 'Extra data show ',
        content_type: 'dataperms',
      },
      {
        id: 363,
        codename: 'delete_dataperms',
        name: 'Can delete data perms',
        content_type: 'dataperms',
      },
      {
        id: 364,
        codename: 'view_dataperms',
        name: 'Can view data perms',
        content_type: 'dataperms',
      },
    ],
  },
  {
    model: 'ticket',
    permission_set: [
      {
        id: 366,
        codename: 'add_ticket',
        name: 'Can add ticket',
        content_type: 'ticket',
      },
      {
        id: 367,
        codename: 'change_ticket',
        name: 'Can change ticket',
        content_type: 'ticket',
      },
      {
        id: 368,
        codename: 'delete_ticket',
        name: 'Can delete ticket',
        content_type: 'ticket',
      },
      {
        id: 369,
        codename: 'view_ticket',
        name: 'Can view ticket',
        content_type: 'ticket',
      },
    ],
  },
  {
    model: 'ticketsetting',
    permission_set: [
      {
        id: 370,
        codename: 'add_ticketsetting',
        name: 'Can add ticket setting',
        content_type: 'ticketsetting',
      },
      {
        id: 371,
        codename: 'change_ticketsetting',
        name: 'Can change ticket setting',
        content_type: 'ticketsetting',
      },
      {
        id: 372,
        codename: 'delete_ticketsetting',
        name: 'Can delete ticket setting',
        content_type: 'ticketsetting',
      },
      {
        id: 373,
        codename: 'view_ticketsetting',
        name: 'Can view ticket setting',
        content_type: 'ticketsetting',
      },
    ],
  },
  {
    model: 'loginevent',
    permission_set: [
      {
        id: 378,
        codename: 'add_loginevent',
        name: 'Can add login event',
        content_type: 'loginevent',
      },
      {
        id: 379,
        codename: 'change_loginevent',
        name: 'Can change login event',
        content_type: 'loginevent',
      },
      {
        id: 380,
        codename: 'delete_loginevent',
        name: 'Can delete login event',
        content_type: 'loginevent',
      },
      {
        id: 381,
        codename: 'view_loginevent',
        name: 'Can view login event',
        content_type: 'loginevent',
      },
    ],
  },
  {
    model: 'userremoteip',
    permission_set: [
      {
        id: 382,
        codename: 'add_userremoteip',
        name: 'Can add user remote ip',
        content_type: 'userremoteip',
      },
      {
        id: 383,
        codename: 'change_userremoteip',
        name: 'Can change user remote ip',
        content_type: 'userremoteip',
      },
      {
        id: 384,
        codename: 'delete_userremoteip',
        name: 'Can delete user remote ip',
        content_type: 'userremoteip',
      },
      {
        id: 385,
        codename: 'view_userremoteip',
        name: 'Can view user remote ip',
        content_type: 'userremoteip',
      },
    ],
  },
  {
    model: 'userdeviceinfo',
    permission_set: [
      {
        id: 386,
        codename: 'add_userdeviceinfo',
        name: 'Can add user device info',
        content_type: 'userdeviceinfo',
      },
      {
        id: 387,
        codename: 'change_userdeviceinfo',
        name: 'Can change user device info',
        content_type: 'userdeviceinfo',
      },
      {
        id: 388,
        codename: 'delete_userdeviceinfo',
        name: 'Can delete user device info',
        content_type: 'userdeviceinfo',
      },
      {
        id: 389,
        codename: 'view_userdeviceinfo',
        name: 'Can view user device info',
        content_type: 'userdeviceinfo',
      },
    ],
  },
  {
    model: 'backup',
    permission_set: [
      {
        id: 390,
        codename: 'add_backup',
        name: 'Can add backup',
        content_type: 'backup',
      },
      {
        id: 391,
        codename: 'change_backup',
        name: 'Can change backup',
        content_type: 'backup',
      },
      {
        id: 392,
        codename: 'delete_backup',
        name: 'Can delete backup',
        content_type: 'backup',
      },
      {
        id: 394,
        codename: 'restore_backup',
        name: 'Can restore backup',
        content_type: 'backup',
      },
      {
        id: 395,
        codename: 'upload_to_cloud_backup',
        name: 'Can upload to cloud',
        content_type: 'backup',
      },
      {
        id: 393,
        codename: 'view_backup',
        name: 'Can view backup',
        content_type: 'backup',
      },
    ],
  },
  {
    model: 'backupsettings',
    permission_set: [
      {
        id: 396,
        codename: 'add_backupsettings',
        name: 'Can add backup settings',
        content_type: 'backupsettings',
      },
      {
        id: 397,
        codename: 'change_backupsettings',
        name: 'Can change backup settings',
        content_type: 'backupsettings',
      },
      {
        id: 398,
        codename: 'delete_backupsettings',
        name: 'Can delete backup settings',
        content_type: 'backupsettings',
      },
      {
        id: 399,
        codename: 'view_backupsettings',
        name: 'Can view backup settings',
        content_type: 'backupsettings',
      },
    ],
  },
  {
    model: 'permission',
    permission_set: [
      {
        id: 5,
        codename: 'add_permission',
        name: 'Can add permission',
        content_type: 'permission',
      },
      {
        id: 6,
        codename: 'change_permission',
        name: 'Can change permission',
        content_type: 'permission',
      },
      {
        id: 7,
        codename: 'delete_permission',
        name: 'Can delete permission',
        content_type: 'permission',
      },
      {
        id: 8,
        codename: 'view_permission',
        name: 'Can view permission',
        content_type: 'permission',
      },
    ],
  },
  {
    model: 'allowip',
    permission_set: [
      {
        id: 374,
        codename: 'add_allowip',
        name: 'Can add allow ip',
        content_type: 'allowip',
      },
      {
        id: 375,
        codename: 'change_allowip',
        name: 'Can change allow ip',
        content_type: 'allowip',
      },
      {
        id: 376,
        codename: 'delete_allowip',
        name: 'Can delete allow ip',
        content_type: 'allowip',
      },
      {
        id: 377,
        codename: 'view_allowip',
        name: 'Can view allow ip',
        content_type: 'allowip',
      },
    ],
  },
  {
    model: 'logentry',
    permission_set: [
      {
        id: 1,
        codename: 'add_logentry',
        name: 'Can add log entry',
        content_type: 'logentry',
      },
      {
        id: 2,
        codename: 'change_logentry',
        name: 'Can change log entry',
        content_type: 'logentry',
      },
      {
        id: 3,
        codename: 'delete_logentry',
        name: 'Can delete log entry',
        content_type: 'logentry',
      },
      {
        id: 4,
        codename: 'view_logentry',
        name: 'Can view log entry',
        content_type: 'logentry',
      },
    ],
  },
  {
    model: 'purchaseinvoice',
    permission_set: [
      {
        id: 285,
        codename: 'add_purchaseinvoice',
        name: 'Can add purchase invoice',
        content_type: 'purchaseinvoice',
      },
      {
        id: 286,
        codename: 'change_purchaseinvoice',
        name: 'Can change purchase invoice',
        content_type: 'purchaseinvoice',
      },
      {
        id: 287,
        codename: 'delete_purchaseinvoice',
        name: 'Can delete purchase invoice',
        content_type: 'purchaseinvoice',
      },
      {
        id: 288,
        codename: 'view_purchaseinvoice',
        name: 'Can view purchase invoice',
        content_type: 'purchaseinvoice',
      },
    ],
  },
  {
    model: 'purchaserejectinvoice',
    permission_set: [
      {
        id: 297,
        codename: 'add_purchaserejectinvoice',
        name: 'Can add purchase reject invoice',
        content_type: 'purchaserejectinvoice',
      },
      {
        id: 298,
        codename: 'change_purchaserejectinvoice',
        name: 'Can change purchase reject invoice',
        content_type: 'purchaserejectinvoice',
      },
      {
        id: 299,
        codename: 'delete_purchaserejectinvoice',
        name: 'Can delete purchase reject invoice',
        content_type: 'purchaserejectinvoice',
      },
      {
        id: 300,
        codename: 'view_purchaserejectinvoice',
        name: 'Can view purchase reject invoice',
        content_type: 'purchaserejectinvoice',
      },
    ],
  },
  {
    model: 'quotationinvoice',
    permission_set: [
      {
        id: 309,
        codename: 'add_quotationinvoice',
        name: 'Can add quotation invoice',
        content_type: 'quotationinvoice',
      },
      {
        id: 310,
        codename: 'change_quotationinvoice',
        name: 'Can change quotation invoice',
        content_type: 'quotationinvoice',
      },
      {
        id: 311,
        codename: 'delete_quotationinvoice',
        name: 'Can delete quotation invoice',
        content_type: 'quotationinvoice',
      },
      {
        id: 312,
        codename: 'view_quotationinvoice',
        name: 'Can view quotation invoice',
        content_type: 'quotationinvoice',
      },
    ],
  },
  {
    model: 'salesinvoice',
    permission_set: [
      {
        id: 317,
        codename: 'add_salesinvoice',
        name: 'Can add sales invoice',
        content_type: 'salesinvoice',
      },
      {
        id: 318,
        codename: 'change_salesinvoice',
        name: 'Can change sales invoice',
        content_type: 'salesinvoice',
      },
      {
        id: 319,
        codename: 'delete_salesinvoice',
        name: 'Can delete sales invoice',
        content_type: 'salesinvoice',
      },
      {
        id: 320,
        codename: 'view_salesinvoice',
        name: 'Can view sales invoice',
        content_type: 'salesinvoice',
      },
    ],
  },
  {
    model: 'salesrejectinvoice',
    permission_set: [
      {
        id: 329,
        codename: 'add_salesrejectinvoice',
        name: 'Can add sales reject invoice',
        content_type: 'salesrejectinvoice',
      },
      {
        id: 330,
        codename: 'change_salesrejectinvoice',
        name: 'Can change sales reject invoice',
        content_type: 'salesrejectinvoice',
      },
      {
        id: 331,
        codename: 'delete_salesrejectinvoice',
        name: 'Can delete sales reject invoice',
        content_type: 'salesrejectinvoice',
      },
      {
        id: 332,
        codename: 'view_salesrejectinvoice',
        name: 'Can view sales reject invoice',
        content_type: 'salesrejectinvoice',
      },
    ],
  },
  {
    model: 'wasteinvoice',
    permission_set: [
      {
        id: 349,
        codename: 'add_wasteinvoice',
        name: 'Can add waste invoice',
        content_type: 'wasteinvoice',
      },
      {
        id: 350,
        codename: 'change_wasteinvoice',
        name: 'Can change waste invoice',
        content_type: 'wasteinvoice',
      },
      {
        id: 351,
        codename: 'delete_wasteinvoice',
        name: 'Can delete waste invoice',
        content_type: 'wasteinvoice',
      },
      {
        id: 352,
        codename: 'view_wasteinvoice',
        name: 'Can view waste invoice',
        content_type: 'wasteinvoice',
      },
    ],
  },
  {
    model: 'group',
    permission_set: [
      {
        id: 9,
        codename: 'add_group',
        name: 'Can add group',
        content_type: 'group',
      },
      {
        id: 10,
        codename: 'change_group',
        name: 'Can change group',
        content_type: 'group',
      },
      {
        id: 11,
        codename: 'delete_group',
        name: 'Can delete group',
        content_type: 'group',
      },
      {
        id: 12,
        codename: 'view_group',
        name: 'Can view group',
        content_type: 'group',
      },
    ],
  },
  {
    model: 'periodictask',
    permission_set: [
      {
        id: 57,
        codename: 'add_periodictask',
        name: 'Can add periodic task',
        content_type: 'periodictask',
      },
      {
        id: 58,
        codename: 'change_periodictask',
        name: 'Can change periodic task',
        content_type: 'periodictask',
      },
      {
        id: 59,
        codename: 'delete_periodictask',
        name: 'Can delete periodic task',
        content_type: 'periodictask',
      },
      {
        id: 60,
        codename: 'view_periodictask',
        name: 'Can view periodic task',
        content_type: 'periodictask',
      },
    ],
  },
  {
    model: 'contenttype',
    permission_set: [
      {
        id: 13,
        codename: 'add_contenttype',
        name: 'Can add content type',
        content_type: 'contenttype',
      },
      {
        id: 14,
        codename: 'change_contenttype',
        name: 'Can change content type',
        content_type: 'contenttype',
      },
      {
        id: 15,
        codename: 'delete_contenttype',
        name: 'Can delete content type',
        content_type: 'contenttype',
      },
      {
        id: 16,
        codename: 'view_contenttype',
        name: 'Can view content type',
        content_type: 'contenttype',
      },
    ],
  },
  {
    model: 'session',
    permission_set: [
      {
        id: 17,
        codename: 'add_session',
        name: 'Can add session',
        content_type: 'session',
      },
      {
        id: 18,
        codename: 'change_session',
        name: 'Can change session',
        content_type: 'session',
      },
      {
        id: 19,
        codename: 'delete_session',
        name: 'Can delete session',
        content_type: 'session',
      },
      {
        id: 20,
        codename: 'view_session',
        name: 'Can view session',
        content_type: 'session',
      },
    ],
  },
  {
    model: 'resetpasswordtoken',
    permission_set: [
      {
        id: 21,
        codename: 'add_resetpasswordtoken',
        name: 'Can add Password Reset Token',
        content_type: 'resetpasswordtoken',
      },
      {
        id: 22,
        codename: 'change_resetpasswordtoken',
        name: 'Can change Password Reset Token',
        content_type: 'resetpasswordtoken',
      },
      {
        id: 23,
        codename: 'delete_resetpasswordtoken',
        name: 'Can delete Password Reset Token',
        content_type: 'resetpasswordtoken',
      },
      {
        id: 24,
        codename: 'view_resetpasswordtoken',
        name: 'Can view Password Reset Token',
        content_type: 'resetpasswordtoken',
      },
    ],
  },
  {
    model: 'blacklistedtoken',
    permission_set: [
      {
        id: 25,
        codename: 'add_blacklistedtoken',
        name: 'Can add blacklisted token',
        content_type: 'blacklistedtoken',
      },
      {
        id: 26,
        codename: 'change_blacklistedtoken',
        name: 'Can change blacklisted token',
        content_type: 'blacklistedtoken',
      },
      {
        id: 27,
        codename: 'delete_blacklistedtoken',
        name: 'Can delete blacklisted token',
        content_type: 'blacklistedtoken',
      },
      {
        id: 28,
        codename: 'view_blacklistedtoken',
        name: 'Can view blacklisted token',
        content_type: 'blacklistedtoken',
      },
    ],
  },
  {
    model: 'outstandingtoken',
    permission_set: [
      {
        id: 29,
        codename: 'add_outstandingtoken',
        name: 'Can add outstanding token',
        content_type: 'outstandingtoken',
      },
      {
        id: 30,
        codename: 'change_outstandingtoken',
        name: 'Can change outstanding token',
        content_type: 'outstandingtoken',
      },
      {
        id: 31,
        codename: 'delete_outstandingtoken',
        name: 'Can delete outstanding token',
        content_type: 'outstandingtoken',
      },
      {
        id: 32,
        codename: 'view_outstandingtoken',
        name: 'Can view outstanding token',
        content_type: 'outstandingtoken',
      },
    ],
  },
  {
    model: 'apikey',
    permission_set: [
      {
        id: 33,
        codename: 'add_apikey',
        name: 'Can add API key',
        content_type: 'apikey',
      },
      {
        id: 34,
        codename: 'change_apikey',
        name: 'Can change API key',
        content_type: 'apikey',
      },
      {
        id: 35,
        codename: 'delete_apikey',
        name: 'Can delete API key',
        content_type: 'apikey',
      },
      {
        id: 36,
        codename: 'view_apikey',
        name: 'Can view API key',
        content_type: 'apikey',
      },
    ],
  },
  {
    model: 'crudevent',
    permission_set: [
      {
        id: 37,
        codename: 'add_crudevent',
        name: 'Can add CRUD event',
        content_type: 'crudevent',
      },
      {
        id: 38,
        codename: 'change_crudevent',
        name: 'Can change CRUD event',
        content_type: 'crudevent',
      },
      {
        id: 39,
        codename: 'delete_crudevent',
        name: 'Can delete CRUD event',
        content_type: 'crudevent',
      },
      {
        id: 40,
        codename: 'view_crudevent',
        name: 'Can view CRUD event',
        content_type: 'crudevent',
      },
    ],
  },
  {
    model: 'loginevent',
    permission_set: [
      {
        id: 41,
        codename: 'add_loginevent',
        name: 'Can add login event',
        content_type: 'loginevent',
      },
      {
        id: 42,
        codename: 'change_loginevent',
        name: 'Can change login event',
        content_type: 'loginevent',
      },
      {
        id: 43,
        codename: 'delete_loginevent',
        name: 'Can delete login event',
        content_type: 'loginevent',
      },
      {
        id: 44,
        codename: 'view_loginevent',
        name: 'Can view login event',
        content_type: 'loginevent',
      },
    ],
  },
  {
    model: 'requestevent',
    permission_set: [
      {
        id: 45,
        codename: 'add_requestevent',
        name: 'Can add request event',
        content_type: 'requestevent',
      },
      {
        id: 46,
        codename: 'change_requestevent',
        name: 'Can change request event',
        content_type: 'requestevent',
      },
      {
        id: 47,
        codename: 'delete_requestevent',
        name: 'Can delete request event',
        content_type: 'requestevent',
      },
      {
        id: 48,
        codename: 'view_requestevent',
        name: 'Can view request event',
        content_type: 'requestevent',
      },
    ],
  },
  {
    model: 'crontabschedule',
    permission_set: [
      {
        id: 49,
        codename: 'add_crontabschedule',
        name: 'Can add crontab',
        content_type: 'crontabschedule',
      },
      {
        id: 50,
        codename: 'change_crontabschedule',
        name: 'Can change crontab',
        content_type: 'crontabschedule',
      },
      {
        id: 51,
        codename: 'delete_crontabschedule',
        name: 'Can delete crontab',
        content_type: 'crontabschedule',
      },
      {
        id: 52,
        codename: 'view_crontabschedule',
        name: 'Can view crontab',
        content_type: 'crontabschedule',
      },
    ],
  },
  {
    model: 'intervalschedule',
    permission_set: [
      {
        id: 53,
        codename: 'add_intervalschedule',
        name: 'Can add interval',
        content_type: 'intervalschedule',
      },
      {
        id: 54,
        codename: 'change_intervalschedule',
        name: 'Can change interval',
        content_type: 'intervalschedule',
      },
      {
        id: 55,
        codename: 'delete_intervalschedule',
        name: 'Can delete interval',
        content_type: 'intervalschedule',
      },
      {
        id: 56,
        codename: 'view_intervalschedule',
        name: 'Can view interval',
        content_type: 'intervalschedule',
      },
    ],
  },
  {
    model: 'periodictasks',
    permission_set: [
      {
        id: 61,
        codename: 'add_periodictasks',
        name: 'Can add periodic tasks',
        content_type: 'periodictasks',
      },
      {
        id: 62,
        codename: 'change_periodictasks',
        name: 'Can change periodic tasks',
        content_type: 'periodictasks',
      },
      {
        id: 63,
        codename: 'delete_periodictasks',
        name: 'Can delete periodic tasks',
        content_type: 'periodictasks',
      },
      {
        id: 64,
        codename: 'view_periodictasks',
        name: 'Can view periodic tasks',
        content_type: 'periodictasks',
      },
    ],
  },
  {
    model: 'solarschedule',
    permission_set: [
      {
        id: 65,
        codename: 'add_solarschedule',
        name: 'Can add solar event',
        content_type: 'solarschedule',
      },
      {
        id: 66,
        codename: 'change_solarschedule',
        name: 'Can change solar event',
        content_type: 'solarschedule',
      },
      {
        id: 67,
        codename: 'delete_solarschedule',
        name: 'Can delete solar event',
        content_type: 'solarschedule',
      },
      {
        id: 68,
        codename: 'view_solarschedule',
        name: 'Can view solar event',
        content_type: 'solarschedule',
      },
    ],
  },
  {
    model: 'clockedschedule',
    permission_set: [
      {
        id: 69,
        codename: 'add_clockedschedule',
        name: 'Can add clocked',
        content_type: 'clockedschedule',
      },
      {
        id: 70,
        codename: 'change_clockedschedule',
        name: 'Can change clocked',
        content_type: 'clockedschedule',
      },
      {
        id: 71,
        codename: 'delete_clockedschedule',
        name: 'Can delete clocked',
        content_type: 'clockedschedule',
      },
      {
        id: 72,
        codename: 'view_clockedschedule',
        name: 'Can view clocked',
        content_type: 'clockedschedule',
      },
    ],
  },
];

export const INVENTORY_PAGE_M = [
  'product',
  'productcategory',
  'unit',
  'productprice',
  'openproduct',
  'warehouse',
  'salesinvoice',
  'salesrejectinvoice',
  'quotationinvoice',
  'purchaseinvoice',
  'purchaserejectinvoice',
  'warehouseproducttransfer',
];

//pages models constants

export const PRODUCT_PAGE_M = [
  'product',
  'productcategory',
  'unit',
  'productprice',
  'openproduct',
];

export const INVOICE_PAGE_M = [
  'salesinvoice',
  'salesrejectinvoice',
  'quotationinvoice',
  'purchaseinvoice',
  'purchaserejectinvoice',
];

export const WAREHOUSE_PAGE_M = ['warehouse', 'warehouseproducttransfer'];

export const CUSTOMER_PAGE_M = [
  'customer',
  'customercategory',
  'customerpayrec',
];
export const CUSTOMER_AND_EMPLOYEE_PAGE_M = [
  'customer',
  'customercategory',
  'customerpayrec',
  'staff',
  'staffcategory',
  'staffsalary',
  'staffpayrec',
  'supplier',
  'suppliercategory',
  'supplierpayrec',
];

export const CURRENCY_PAGE_M = ['currencyrate', 'currency', 'exchangeunion'];
export const EXPENSE_PAGE_M = ['expensecashfin', 'expensetype'];
export const EXPENSE_TYPE_PAGE_M = ['expensetype', 'expensecategory'];
export const INCOME_PAGE_M = ['incomecashfin', 'incometype'];
export const WITHDRAW_PAGE_M = ['widthdraw'];
export const SUPPLIER_PAGE_M = [
  'supplier',
  'suppliercategory',
  'supplierpayrec',
];
export const EMPLOYEE_PAGE_M = [
  'partners',
  'createpartners',
  'deletepartners',
  'updatepartners',
];
export const PARTNERS_PAGE_M = [
  'staff',
  'staffcategory',
  'staffsalary',
  'staffpayrec',
];
export const BACKUP_PAGE_M = ['backup', 'backupsettings'];
export const BANK_PAGE_M = ['bank', 'bankcashtransfer'];
export const CASH_PAGE_M = ['cash', 'bankcashtransfer'];
export const BANK_TRANSACTION_PAGE_M = ['banktransaction', 'banktransaction'];
export const USERS_PAGE_M = ['systemuser', 'group'];
export const BRANCH_PAGE_M = ['systemuser'];
export const AUDIT_CENTER_PAGE_M = ['crudevent', 'loginevent'];

//models constants
export const DASHBOARD_M = 'dashboard';
export const JOURNAL_BOOK = '';
export const WAREHOUSE_M = 'warehouse';
export const WAREHOUSE_ADJUSTMENT_M = 'warehouse';
export const MONEY_TRANSFER_M = 'bankcashtransfer';
export const BANK_M = 'bank';
export const BANK_TRANSACTION_M_M = 'transaction';
export const CASH_M = 'cash';
export const SALES_INVOICE_M = 'salesinvoice';
export const SALES_REJ_INVOICE_M = 'salesrejectinvoice';
export const SALES_ORDER_INVOICE_M = 'salesorderinvoice';
export const PURCHASE_INVOICE_M = 'purchaseinvoice';
export const PURCHASE_REJ_INVOICE_M = 'purchaserejectinvoice';
export const PURCHASE_ORDER_INVOICE_M = 'purchaseorderinvoice';
export const QUOTATION_INVOICE_M = 'quotationinvoice';
export const PRODUCT_TRANSFER_INVOICE_M = 'warehouseproducttransfer';
export const CUSTOMER_M = 'customer';
export const CUSTOMER_PAY_REC_M = 'customerpayrec';
export const CUSTOMER_CATEGORY_M = 'customercategory';
export const PRODUCT_M = 'product';
export const PRODUCT_PRICE_M = 'productprice';
export const PRODUCT_INVENTORY_M = 'openproduct';
export const PRODUCT_CATEGORY_M = 'productcategory';
export const PRODUCT_UNIT_M = 'unit';
export const CURRENCY_M = 'currency';
export const CURRENCY_RATE_M = 'currencyrate';
export const CURRENCY_EXCHANGE_M = 'exchangeunion';
export const EXPENSE_M = 'expensecashfin';
export const EXPENSE_TYPE_M = 'expensetype';
export const EXPENSE_CATEGORY_M = 'expensecategory';
export const INCOME_M = 'incomecashfin';
export const INCOME_TYPE_M = 'incometype';
export const WITHDRAW_M = 'widthdraw';
export const WITHDRAW_TYPE_M = 'widthdraw';
export const SUPPLIER_M = 'supplier';
export const SUPPLIER_PAY_REC_M = 'supplierpayrec';
export const SUPPLIER_CATEGORY_M = 'suppliercategory';
export const EMPLOYEE_M = 'staff';
export const EMPLOYEE_PAY_REC_M = 'staffpayrec';
export const EMPLOYEE_SALARY_M = 'staffsalary';
export const EMPLOYEE_CATEGORY_M = 'staffcategory';
export const REPORT_M = 'custompermission';
export const CASH_TRANSACTION_M = 'cashflow';
export const JOURNAL_M = 'cashfin';
export const BACKUP_M = 'backup';
export const BACKUP_SETTINGS_M = 'backupsettings';
export const USERS_M = 'systemuser';
export const BRANCH_M = 'systemuser';
export const USER_ROLE_M = 'group';
export const CUSTOM_FORM_STYLE_M = 'posinvoicesetting';
export const CHART_OF_ACCOUNT_M = 'chartofaccount';
export const OPINING_ACCOUNT_M = 'openaccount';
export const FISCAL_YEAR_M = 'financialperiod';
export const CRUD_AUDIT_M = 'crudevent';
export const LOGIN_AUDIT_M = 'loginevent';
export const COMPANY_INFO_M = 'companyinfo';

//report permissions
export const DEBIT_CREDIT_P = 'view_DebitCreditReport';
export const BALANCE_SHEET_P = 'view_CustomerAccountReport';
export const ACCOUNT_STATISTIC_P = 'view_CustomerAccountReport';
export const EXPIRE_PRODUCTS_P = 'view_ProductExpirationReport';
export const INVOICE_BY_PRODUCT_P = 'view_InvoiceByProductReport';
export const INVOICE_BY_PERSON_P = 'view_InvoiceByPersonReport';
export const PRODUCT_STATISTIC_P = 'view_ProductStatisticReport';
export const WAREHOUSE_STATISTIC_P = 'view_WarehouseStatisticReport';
export const WAREHOUSE_CARDX_P = 'view_WarehouseCardexReport';
export const INVOICES_P = 'view_InvoicesReport';
export const PRODUCT_PROFIT_P = 'view_ProfitReport';

//report sections
export const WAREHOUSE_REPORT_P = [
  EXPIRE_PRODUCTS_P,
  INVOICE_BY_PERSON_P,
  INVOICE_BY_PRODUCT_P,
  PRODUCT_STATISTIC_P,
  WAREHOUSE_CARDX_P,
  WAREHOUSE_STATISTIC_P,
  INVOICES_P,
  PRODUCT_PROFIT_P,
  `view_${SALES_INVOICE_M}`,
];
export const FINANCIAL_REPORT_P = [
  DEBIT_CREDIT_P,
  ACCOUNT_STATISTIC_P,
  BALANCE_SHEET_P,
  `view_${JOURNAL_M}`,
  `view_${CURRENCY_EXCHANGE_M}`,
  `view_${CURRENCY_RATE_M}`,
  `view_${EXPENSE_M}`,
  `view_${INCOME_M}`,
  `view_${CASH_TRANSACTION_M}`,
  `view_${MONEY_TRANSFER_M}`,
];

export const REPORT_P = [...FINANCIAL_REPORT_P, ...WAREHOUSE_REPORT_P];
