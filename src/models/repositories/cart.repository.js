'use strict'

const { convertToObjIdMongodb } = require('../../utils')
const { cart } = require('../cart.model')

const findCartById = async (cartId) => {
    return await cart.findOne({
        _id : convertToObjIdMongodb(cartId) , cart_state: 'active' 
    }).lean()
}


module.exports = {
    findCartById
}