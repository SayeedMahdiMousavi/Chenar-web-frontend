// import { appSchema, tableSchema } from "@nozbe/watermelondb";
// export default appSchema({
//   version: 1,
//   tables: [
//     tableSchema({
//       name: "groups",
//       columns: [
//         { name: "name", type: "string" },

//         { name: "description", type: "string" },
//         { name: "sub_group", type: "string" },
//       ],
//     }),
//     tableSchema({
//       name: "units",
//       columns: [
//         { name: "name", type: "string" },

//         { name: "symbol", type: "string" },
//       ],
//     }),
//     tableSchema({
//       name: "products",
//       columns: [
//         { name: "barcode", type: "string" },
//         { name: "name", type: "string" },
//         { name: "icon", type: "string" },
//         { name: "group", type: "string" },
//         { name: "sub_group", type: "string" },
//         { name: "description", type: "string" },
//         { name: "price", type: "number" },
//         { name: "group_id", type: "string" },
//         { name: "unit_id", type: "string" },
//         { name: "type", type: "string" },

//         { name: "status", type: "string" },
//         { name: "created_at", type: "number" },
//         { name: "updated_at", type: "number" },
//       ],
//     }),
//     tableSchema({
//       name: "customers",
//       columns: [
//         { name: "name", type: "string" },
//         { name: "last_name", type: "string" },
//         { name: "icon", type: "string" },
//         { name: "display_name", type: "string" },
//         { name: "company", type: "string" },
//         { name: "email", type: "string" },
//         { name: "phone", type: "string" },
//         { name: "mobile", type: "string" },
//         { name: "fax", type: "string" },
//         { name: "website", type: "string" },
//         { name: "attachments", type: "string" },
//         { name: "parent_customer", type: "string" },
//         { name: "bill_with", type: "string" },
//         { name: "notes", type: "string" },
//         { name: "open_balance", type: "string" },
//         { name: "status", type: "string" },
//         { name: "created_at", type: "number" },
//         { name: "updated_at", type: "number" },
//       ],
//     }),
//     tableSchema({
//       name: "addresses",
//       columns: [
//         { name: "street", type: "string" },
//         { name: "country", type: "string" },
//         { name: "province", type: "string" },
//         { name: "city", type: "string" },
//         { name: "postal_code", type: "string" },
//         { name: "type", type: "string" },
//         { name: "customer_id", type: "string", isIndexed: true },
//       ],
//     }),
//   ],
// });
