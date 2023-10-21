'use strict'

const express = require('express')
const { apiKey, permisstion } = require('../auth/checkAuth')

const {pushToLogDiscord} = require('../middlewares')

const router = express.Router()

//add log to discord

router.use(pushToLogDiscord)
// check apiKey 

router.use(apiKey)

// check permission
router.use(permisstion('0000'))

router.use('/v1/api/checkout',require('./checkout'))
router.use('/v1/api/discount',require('./discount'))
router.use('/v1/api/cart',require('./cart'))
router.use('/v1/api/product',require('./product'))
router.use('/v1/api/comment',require('./comment'))
router.use('/v1/api',require('./access'))





// router.get('/', (req , res , next)=> {
//     return res.status(200).json({
//         message : 'Hello Ngoc Cuong'
//     })
// })


module.exports = router