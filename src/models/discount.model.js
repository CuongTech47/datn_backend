"use strict";

//!dmbg
const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

// Declare the Schema of the Mongo model
const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      require: true,
    },
    discount_description: {
      type: String,
      require: true,
    },
    discount_type: {
      type: String,
      default: ["fixed_amount"], // percentage
    },
    discount_value: {
      type: Number,
      require: true,
    },
    discount_code: {
      type: String,
      require: true,
    }, // ma giam gia
    discount_start_date: {
      type: Date,
      require: true,
    }, // ngay bat dau
    discount_end_date: {
      type: Date,
      require: true,
    }, // ngay ket thuc
    discount_max_uses: {
      type: Number,
      require: true,
    }, // so luong discout dc ap dung

    discount_uses_count: {
      type: Number,
      require: true,
    }, // so discount da su dung

    discount_users_used: {
        type: Array,
        default : []
      }, // user nao da su dung

      discount_max_uses_per_user: {
        type: Number,
        require : true
      }, // so luong cho phep toi da da duoc su dung

      discount_min_order_value : {
        type: Number,
        require : true
      }, //
      discount_max_order_value : {
        type: Number,
        require : true
      }, //

      discount_shopId : {
        type: Schema.Types.ObjectId ,
        ref : 'Shop'
      }, //
      discount_isActive : {
        type: Boolean ,
        default : true
      }, //
      discount_applies_to : {
        type: String ,
       require : true ,
       enum : ['all','specific']
      }, //
      discount_product_ids : {
        type: Array ,
        default : []
      }, // so luong san pham da duoc ap dung 

      // discount_is_deleted :{
      //   type : Boolean,
      //   default : false
      // }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
