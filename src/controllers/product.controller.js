"use strict";

const {  SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");


// v2 

const ProductServiceV2 = require("../services/product.service.V2");

class ProductController {

  // v1
  // createProduct = async (req , res , next) => {
  //   new SuccessResponse ({
  //     message : 'Create Product Success',
  //     metadata : await ProductService.createProduct(
  //       req.body.product_type,
  //       {
  //         ...req.body,
  //         product_shop : req.user.userId
  //       }
  //     )
  //   }).send(res)
  // }


  //v2 
  createProduct = async (req , res , next) => {
    new SuccessResponse ({
      message : 'Create Product Success',
      metadata : await ProductServiceV2.createProduct(
        req.body.product_type,
        {
          ...req.body,
          product_shop : req.user.userId
        }
      )
    }).send(res)
  }


  // query 

  /**
   * @desc get all Drafts for shop
   * @param {Number} limit 
   * @param {Number} skip 
   * @return {Json}
   
   */
  getAllDraftsForShop = async (req , res , next) => {
    new SuccessResponse({
      message : 'Get list draft success',
      metadata : await ProductServiceV2.findAllDraftsForShop({
        product_shop : req.user.userId
      })
    }).send(res)
  }

  getAllPublishForShop = async (req , res , next) => {
    new SuccessResponse({
      message : 'Get list PublishForShop success',
      metadata : await ProductServiceV2.findAllPublishForShop({
        product_shop : req.user.userId
      })
    }).send(res)
  }


  publishProductByShop = async (req , res , next) => {
    new SuccessResponse({
      message : 'publishProductByShop  success',
      metadata : await ProductServiceV2.publishProductByShop({
        product_id : req.params.id,
        product_shop : req.user.userId
      })
    }).send(res)
  }

  unPublishProductByShop = async (req , res , next) => {
    new SuccessResponse({
      message : ' unPublishProductByShop  success',
      metadata : await ProductServiceV2.unPublishProductByShop({
        product_id : req.params.id,
        product_shop : req.user.userId
      })
    }).send(res)
  }


  getListSearchProduct = async (req , res , next) => {
    new SuccessResponse({
      message : ' unPublishProductByShop  success',
      metadata : await ProductServiceV2.getListSearchProduct(req.params)
    }).send(res)
  }




  // end query


  

 

}

module.exports = new ProductController()
