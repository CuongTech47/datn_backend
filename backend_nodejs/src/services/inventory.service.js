'use strict'

const { BadRequestError } = require('../core/error.response')
const {inventory} = require('../models/inventory.model')
const { getProductById } = require('../models/repositories/product.repository')


class InventoryService {
    static async addStockInventory({
        stock,
        productId,
        shopId,
        location = 'Eahleo city'
    }) {
        const product = await getProductById(productId)

        if (!product) {
            throw new BadRequestError('Product does not exists!')
        }

        const query = {
            inven_shopId: shopId,
            inven_productId: productId
        },updateSet = {
            $inc: { inven_stock: stock },
            $set: { inven_location: location }
        },options = {
            upsert: true,
            new: true
        }

        return await inventory.findOneAndUpdate(query,updateSet,options)
       
        
    }
}

module.exports = InventoryService