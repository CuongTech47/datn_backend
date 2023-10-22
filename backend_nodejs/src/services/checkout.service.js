const { BadRequestError } = require("../core/error.response")
const { findCartById } = require("../models/repositories/cart.repository")
const { checkProductByServer } = require("../models/repositories/product.repository")
const { getDiscountAmount } = require("./discount.service")

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

        for ( let i =0 ; i < shop_order_ids.length ; i++) {
            const { shopId , shop_discount = [] , item_products = [] } = shop_order_ids[i]

            // check product ton tai tren server hay k 

            const checkProductServer = await checkProductByServer(item_products)

            console.log(`check product server::`,checkProductServer);


            if(!checkProductServer[0]) {
                throw new BadRequestError('Order wrong!!!')
            }

            // tinh tong tien don hang

            const checkoutPrice = checkProductServer.reduce((acc , product) => {
                return acc + ( product.quantity) * product.price
            },0)

            // tong tien truoc khi xu ly 

            checkout_order.totalPrice =+ checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discount,
                priceRaw : checkoutPrice,
                priceApplyDiscount : checkoutPrice,
                item_products : checkProductServer

            }

            // neu shop_discount ton tai > 0 , check xem co hop le hay khong?

            if(shop_discount.length > 0) {

                const {totalPrice = 0, discount = 0} = await getDiscountAmount({
                    codeId : shop_discount[0].codeId,
                    userId,
                    shopId,
                    products : checkProductServer
                })

                // tong tien discount tham gia

                checkout_order.totalCheckout += discount

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
}


module.exports = CheckoutService