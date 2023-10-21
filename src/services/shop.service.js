'use strict'

const shopModel = require("../models/shop.model")

// const select = {
//     email : 1 ,
//     password : 2,
//     name : 1,
//     status : 1 ,
//     role : 1
// }

const findByEmail = async ({ email , select = {
    email : 1 ,
    password : 2,
    name : 1,
    status : 1 ,
    roles : 1
}}) => {
    return await shopModel.findOne({email}).select(select).lean()
}



module.exports = {
    findByEmail
}