const redisPubsubService = require('../../src/services/redisPubsub.service')

class ProductServiceTest {
    purchaseProduct(productId , quantity) {
       const order = {
              productId,
              quantity
       }

       redisPubsubService.publish('ORDER_EVENT' , JSON.stringify(order))
    }
}

module.exports = new ProductServiceTest()