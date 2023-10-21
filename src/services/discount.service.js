"use strict";

const { BadRequestError , NotFoundError } = require("../core/error.response");

const discount = require("../models/discount.model");
const { findAllDiscountCodesUnSelect, checkDiscountExists } = require("../models/repositories/discount.repository");
const { findAllProducts } = require("../models/repositories/product.repository");
const { convertToObjIdMongodb } = require("../utils");


/**
 * Discont Services
 * 1 - Generator Discount Code shop [shop | admin]
 * 2 - get discount amount
 * 3 - get all discount codes [User | Shop]
 * 4 - Verify discount code [user]
 * 5 - delete discount Code [Amin | shop]
 * 6 - cancel discount code
 *
 */

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
      users_used,
    } = payload;

    // kiem tra
    // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
    //   throw new BadRequestError("Discount code has expried!");
    // }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Start Date must be before end_date");
    }

    // create index for discount code

    const existDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjIdMongodb(shopId),
      })
      .lean();

      

    if (existDiscount && existDiscount.discount_isActive) {
      throw new BadRequestError("Discount exists!");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shopId: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static async getAllDiscountCodesWithProduct({ code, shopId, userId, limit , page }) {
    const existDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjIdMongodb(shopId),
      })
      .lean();

      if(!existDiscount || !existDiscount.discount_is_active) {
        throw new NotFoundError('Discount is not exists!')
      } 

      const { discount_applies_to , discount_product_ids } = existDiscount

      let products

      if(discount_applies_to === 'all') {
        products = await findAllProducts({
            filter : {
                product_shop : convertToObjIdMongodb(shopId),
                isPublished : true
            },
            limit : +limit,
            page : +page,
            sort : 'ctime',
            select : ['product_name']
        })
      }

      if(discount_applies_to === 'specific') {
        products = await findAllProducts({
            filter : {
                _id : {$in : discount_product_ids},
                isPublished : true
            },
            limit : +limit,
            page : +page,
            sort : 'ctime',
            select : ['product_name']
        })
      }
      return products
  }



  static async getAllDiscountCodesByShop({limit , page ,shopId }) {
   
    const discounts = await findAllDiscountCodesUnSelect({
        // limit : +limit,
        limit : +limit,
        page : +page,
        filter : {
            discount_shopId : convertToObjIdMongodb(shopId),
            discount_is_active : true
        },
        
        unSelect : ['__v','discount_shopId'],
        model : discount
    })

    return discounts
  }



  static async getDiscountAmount({ codeId , userId, shopId , products}) {
    const existsDiscount = await checkDiscountExists({
        model : discount,
        filter : {
            discount_code: codeId,
            discount_shopId : convertToObjIdMongodb(shopId)
        }
    })


   
    if(!existsDiscount) {
        throw new NotFoundError('discount doesn`t exists')
    }

    const {discount_is_active , discount_max_uses ,discount_min_order_value, discount_start_date , discount_end_date , discount_type , discount_value , discount_max_uses_per_user  , discount_users_used} = existsDiscount

    if(!discount_is_active) throw new NotFoundError(`discount expried!`)
    if(!discount_max_uses) throw new NotFoundError(`discount are out`)

    // if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
    //     throw new NotFoundError('Discount ecode has expried!')
    // }

    // check xem co ton tai gia tri toi thieu hay khong
    let totalOrder = 0
    if(discount_min_order_value > 0) {
        totalOrder = products.reduce((acc , product)=>{
          return acc + ( product.quantity * product.price)
        },0)

        if(totalOrder < discount_min_order_value) {
          throw new NotFoundError(`Discount requires a minium order value of ${discount_min_order_value}!`)
        }
    }

    if(discount_max_uses > 0) {
      const userDiscount = discount_users_used.find(user => user.userId === userId)

      if(userDiscount) {

      }
    }


    // check xem discount nay la fixed_amount 

    const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

    return {
      totalOrder,
      discount : amount,
      totalPrice  : totalOrder - amount
    }

  }

  static async deleteDiscountCode({shopId , codeId ,}) {
    const deleted = await discount.findOneAndDelete({
      discount_code : codeId,
      discount_shopId : convertToObjIdMongodb(shopId)
    })


    return deleted
  }


}

module.exports = DiscountService
