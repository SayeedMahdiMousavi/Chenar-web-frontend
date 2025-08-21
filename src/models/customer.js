// import { Model } from "@nozbe/watermelondb";
// import {
//   field,
//   relation,
//   children,
//   action,
//   lazy,
//   readonly,
//   date,
// } from "@nozbe/watermelondb/decorators";
// export default class Customers extends Model {
//   static table = "customers";
//   static associations = {
//     addresses: { type: "has_many", foreignKey: "address_id" },
//     //   groups: { type: "belongs_to", key: "group_id" },
//   };

//   @field("name") name;
//   @field("last_name") last_name;
//   @field("icon") icon;
//   @field("display_name") display_name;
//   @field("company") company;
//   @field("email") email;
//   @field("phone") phone;
//   @field("mobile") mobile;
//   @field("fax") fax;
//   @field("website") website;
//   @field("parent_customer") parent_customer;
//   @field("bill_with") bill_with;
//   @field("notes") notes;
//   @field("open_balance") open_balance;
//   @field("attachments") attachments;
//   @field("status") status;

//   @readonly @date("created_at") createdAt;
//   @readonly @date("updated_at") updatedAt;
//   // @children("addresses") addresses;
//   // @relation("groups", "group_id") group;
//   //   @relation("units", "unit_id") unit;

//   // @lazy verifiedAwesomeComments = this.verifiedComments.extend(
//   //   Q.where("status", active)
//   // );
// }
