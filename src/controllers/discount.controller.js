'use strict'

const DiscountService = require('../services/discount.service')

const { SuccessResponse } = require('../core/success.response')

class DiscountController {
    createDiscountCode = async (req , res , next) => {
        new SuccessResponse({
            message : 'Successfull Code Generations',
            metadata : await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId 
            })
        }).send(res)
    }

    getAllDiscountCodes = async (req , res , next) => {
        new SuccessResponse({
            message : 'Successfull code Found',
            metadata : await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
               shopId : req.user.userId 
            })
        }).send(res)
    }

    getAllDiscountAmount = async (req , res , next) => {
        new SuccessResponse({
            message : 'Successfull code Found',
            metadata : await DiscountService.getDiscountAmount({
                ...req.body,
            })
        }).send(res)
    }

    getAllDiscountCodesWithProducts = async (req , res , next) => {
        new SuccessResponse({
            message : 'Successfull code Found',
            metadata : await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query,
            })
        }).send(res)
    }

    
}

module.exports = new DiscountController()