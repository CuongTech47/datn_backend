'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const router = express.Router()
const  asyncHandler  = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')


// search product 
router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))


// hien thi tat ca product
router.get('', asyncHandler(productController.findAllProducts))

// hien thi 1 product

router.get('/:product_id', asyncHandler(productController.findProduct))

// authentication
router.use(authenticationV2)

// create product
router.post('',asyncHandler(productController.createProduct))

//update product 
router.patch('/:productId',asyncHandler(productController.updateProduct))

// cho phep product hien thi hay khong hien thi publish vs unpublish //
router.post('/publish/:id',asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id',asyncHandler(productController.unPublishProductByShop))


// query hien thi cac product drafts vs published
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishForShop))


module.exports = router