require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const cors = require('cors')
const app = express()



// test pub sub redis service
// require('./tests/inventory.test')
// const productTest = require('./tests/product.test')

// productTest.purchaseProduct('product0011' , 10)



// init middleware 
app.use(cors())
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended : true,
    
}))



// init database
require('./dbs/init.mongodb')

// const { checkOverload } = require('./helpers/check.connect')

// checkOverload()


// const { countConnect  } = require('./helpers/check.connect')

// countConnect()


// init routes 


app.use('',require('./routes'))



// handle error
app.use((req , res , next)=> {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})
app.use((error,req , res , next)=> {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status : 'error',
        code : statusCode,
        stack : error.stack,
        message : error.message || 'Internal Server Error'
    })
})





module.exports = app