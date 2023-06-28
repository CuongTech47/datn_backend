'use strict'

const express = require('express')
const { apiKey, permisstion } = require('../auth/checkAuth')


const router = express.Router()


// check apiKey 

router.use(apiKey)

// check permission
router.use(permisstion('0000'))



router.use('/v1/api/product',require('./product'))
router.use('/v1/api',require('./access'))





// router.get('/', (req , res , next)=> {
//     return res.status(200).json({
//         message : 'Hello Ngoc Cuong'
//     })
// })


module.exports = router