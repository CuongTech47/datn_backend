'use strict'


const express = require('express')

const uploadController = require('../../controllers/upload.controller')

const router = express.Router()

const asyncHandler = require("../../helpers/asyncHandler")

const { authenticationV2 } = require('../../auth/authUtils')

const { uploadDisk } = require('../../configs/conf.multer')

// router.use(authenticationV2)


router.post('/product',asyncHandler(uploadController.uploadFile))
router.post('/product/thumb',uploadDisk.single('file'),asyncHandler(uploadController.uploadFileThumb))



module.exports = router