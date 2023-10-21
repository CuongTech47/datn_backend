'user strict'


const { BadRequestError } = require('../core/error.response')
const { product , clothing ,electronic } = require('../models/product.model')


// define Factory class to create product 

class ProductFactory {
    /**
      type : 'Clothing',
      payload
     */

    static async createProduct(type , payload) {

        switch(type) {
            case 'Electronics':
                return new Electronics(payload).createProduct()
            case 'Clothing':
                return new  Clothing(payload).createProduct()
            default :
                throw new BadRequestError(`Invalid Product Types ${type}`)
        }

    }

}



class Product {
    constructor({
        product_name , product_thumb , product_description,product_shop,
        product_price , product_type , product_attributes, product_quantity
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_shop = product_shop
        this.product_price = product_price
        this.product_type = product_type
        this.product_attributes = product_attributes
        this.product_quantity = product_quantity
    }


    // create new Product
    async createProduct( product_id ) {
        return await product.create({...this, _id : product_id })
    }
}



// Define sub-class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClongthing = await clothing.create(this.product_attributes)
        if(!newClongthing) throw new BadRequestError('Create new Clothing error')

        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestError('Create new product error')


        return newProduct
    }
}




// Define sub-class for different product types Electronics
class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop : this.product_shop
        })
        if(!newElectronic) throw new BadRequestError('Create new Electronic error')

        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw new BadRequestError('Create new product error')


        return newProduct
    }
}

module.exports = ProductFactory