"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const orderSchema = new Schema({
  order_userId: { type: Number, required: true },
  order_checkout: {
    type: Object,
    default: {},
  },

  /**
   * order_checkout: {
   * totalPrice,
   * totalApplyDiscount,
   * feeship
   * }
   */

  order_shipping: {
    type: Object,
    default: {},
  },
  /**
   * order_shipping: {
   * street,
   * city,
   * state,
   * country,
   * }
   */

  order_payment: {
    type: Object,
    default: {},
  },

  order_products: {
    type: Array,
    required: true,
    default: [],
  },
  order_trackingNumber: {
    type: String,
    default:'#0000118052022'
  },
  order_status: {
    type: String,
    enum: ["active", "complated", "failed", "pending" , 'shipping','cancelled','delivered'],
    default: "pending",
  }
});

module.exports = {
  cart: model(DOCUMENT_NAME, orderSchema),
};
