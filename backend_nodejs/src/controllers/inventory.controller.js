'use strict'


const InventoryService = require('../services/inventory.service')


const {SuccessResponse} = require('../core/success.response')


class InventoryController {
   
    addStockInventory = async ( req , res , next)=> {
        new SuccessResponse({
            message : 'Create new add stock inventory Success!',
            metadata : await InventoryService.addStockInventory(req.body)
        }).send(res)
    }
    
}


module.exports = new InventoryController()