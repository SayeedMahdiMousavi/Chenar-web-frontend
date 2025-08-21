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
// export default class Addresses extends Model {
//   static table = "addresses";
//   static associations = {
//     customers: { type: "belongs_to", key: "customer_id" },
//     //   groups: { type: "belongs_to", key: "group_id" },
//   };

//   @field("street") street;
//   @field("country") country;
//   @field("province") province;
//   @field("city") city;
//   @field("postal_code") postal_code;
//   @field("type") type;
//   @readonly @date("created_at") createdAt;
//   @readonly @date("updated_at") updatedAt;
//   // @relation("groups", "group_id") group;
//   // @relation("customers", "customer_id") customer;

//   // @lazy verifiedAwesomeComments = this.verifiedComments.extend(
//   //   Q.where("status", active)
//   // );
// }
