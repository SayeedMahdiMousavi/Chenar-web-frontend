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
// export default class Products extends Model {
//   static table = "products";
//   static associations = {
//     units: { type: "belongs_to", key: "unit_id" },
//     groups: { type: "belongs_to", key: "group_id" },
//   };
//   @field("barcode") barcode;
//   @field("name") name;
//   @field("icon") icon;
//   @field("group") group;
//   @field("sub_group") sub_group;
//   @field("description") description;
//   @field("price") price;
//   @field("type") type;
//   @field("status") status;
//   @readonly @date("created_at") createdAt;
//   @readonly @date("updated_at") updatedAt;
//   // @relation("groups", "group_id") group;
//   @relation("units", "unit_id") unit;

//   // @lazy verifiedAwesomeComments = this.verifiedComments.extend(
//   //   Q.where("status", active)
//   // );
// }
