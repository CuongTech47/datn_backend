const { BadRequestError } = require("../core/error.response")
const { findCartById } = require("../models/repositories/cart.repository")
const { checkProductByServer } = require("../models/repositories/product.repository")
const { getDiscountAmount } = require("./discount.service")
const { acquireLock , releaseLock } = require("./redis.service")

const { order } = require('../models/order.model')
class CheckoutService {

    static async checkoutReview ({
        cartId , userId , shop_order_ids
    }) {
        const foundCart = await findCartById(cartId)
        if(!foundCart) throw new BadRequestError('Cart does not exists!')

        const checkout_order = {
            totalPrice : 0, // tong tien hang,
            feeShip: 0,
            totalDiscount : 0,
            totalCheckout : 0 

        }, shop_order_ids_new = []

        // tinh tien bill 

        for ( let i = 0 ; i < shop_order_ids.length ; i++) {
            const { shopId , shop_discounts = [] , item_products = [] } = shop_order_ids[i]

            // check product ton tai tren server hay k 

            const checkProductServer = await checkProductByServer(item_products)

            console.log(`check product server::`,checkProductServer);


            if(!checkProductServer[0]) throw new BadRequestError('Order wrong!!!')
            

            // tinh tong tien don hang
            const checkoutPrice = checkProductServer.reduce((acc , product) => {
                return acc + ( product.quantity * product.price)
            },0)

            console.log(`checkoutPrice::`,checkoutPrice);

            // tong tien truoc khi xu ly 

            checkout_order.totalPrice =+ checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw : checkoutPrice,
                priceApplyDiscount : checkoutPrice,
                item_products : checkProductServer

            }

            // neu shop_discount ton tai > 0 , check xem co hop le hay khong?

            if(shop_discounts.length > 0) {

                const {totalPrice = 0, discount = 0} = await getDiscountAmount({
                    codeId : shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products : checkProductServer
                })

                // tong tien discount tham gia

                checkout_order.totalDiscount += discount

                if(discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }

                // tong thanh toan cuoi cung 

                checkout_order.totalCheckout += itemCheckout.priceApplyDiscount

                shop_order_ids_new.push(itemCheckout)
            }
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static async orderByUser ({
        shop_order_ids,
        cartId,
        user_address = {},
        user_payment = {},
    }) {
        const { shop_order_ids_new , checkout_order } = await this.checkoutReview({
            cartId,
            shop_order_ids,
            userId,
        })

        // check lai lan nua xem co vuot qua ton kho hay khong

        const products = shop_order_ids_new.flatMap(order => order.item_products)
        console.log(`[1]`,products);
        const acquireProduct = []
        for(let i = 0 ; i < products.length; i++) {
            const {productId , quantity} = products[i]
            const keyLock = await acquireLock(productId , quantity , cartId)
            acquireProduct.push(keyLock ? true : false)
            if(keyLock) {
                await releaseLock(keyLock)
            }
        }
        // check lai neu mot san pham nao do vuot qua ton kho

        if(acquireProduct.includes(false)) {
            throw new BadRequestError('Order wrong!!! , Mot so san pham da duoc cap nhat vui long quay lai gio hang de kiem tra lai')
        }

        const newOrder = await order.create({
            order_userId : userId,
            order_checkout : checkout_order,
            order_shipping : user_address,
            order_payment : user_payment,
            order_products : shop_order_ids_new
        })

        // truong hop neu order thanh cong thi xoa product trong gio hang

        if(newOrder) {
            // xoa product trong gio hang

        }

        return newOrder
    }

    /*
    1 - Query Order By User
    
    */ 
    static async getOrdersByUser () {

    }

    
     /*
    2 - Query Order Using Id User
    
    */ 
    static async getOneOrderByUser () {

    }

     /*
    3 - Cancel Order By User
    
    */ 
    static async cancelOrderByUser () {

    }

     /*
    4 - Update Order Status By Shop
    
    */ 
    static async updateOrderStatusByShop () {

    }
    
}


module.exports = CheckoutService