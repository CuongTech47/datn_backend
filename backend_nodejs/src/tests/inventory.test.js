const redisPubsubService = require('../../src/services/redisPubsub.service')

class InventoryServiceTest {
    constructor () {
       redisPubsubService.subscribe('ORDER_EVENT' , (channel , message) => {
           InventoryServiceTest.updateInventory(message)
       })
    }

    static updateInventory(productId , quantity) {
        console.log(`updateInventory:: `,productId , quantity)
    }
}

module.exports = new InventoryServiceTest()