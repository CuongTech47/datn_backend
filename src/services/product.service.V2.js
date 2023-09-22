'user strict'



const { BadRequestError } = require('../core/error.response')
const { product , clothing ,electronic , furniture } = require('../models/product.model')
const { insertInventory } = require('../models/repositories/inventory.repository')


// repository
const { findAllDraftsForShop , publishProductByShop ,findAllPublishForShop , unPublishProductByShop , searchProductByUser , findAllProducts , findProduct, updateProductById } = require('../models/repositories/product.repository')
const { removeUndefineObj, updateNestedObjParser } = require('../utils')


// define Factory class to create product 

class ProductFactory {
    /**
      type : 'Clothing',
      payload
     */

    static productRegistry = {} // key- class


    static registerProductType (type , classRef ) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type , payload) {

        const productClass = ProductFactory.productRegistry[type]

        if(!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)

        return new productClass(payload).createProduct()

      

    }

    // Put //

    static async publishProductByShop ({product_shop, product_id}) {
        return await publishProductByShop({product_shop , product_id})
    }
    //end put 

    //query 
    static async findAllDraftsForShop({ product_shop , limit = 50 , skip = 0 }) {
        const query = { product_shop , isDraft : true}
        return await findAllDraftsForShop({ query , limit , skip })
    }


    static async findAllPublishForShop({ product_shop , limit = 50 , skip = 0 }) {
        const query = { product_shop , isPublished : true}
        return await findAllPublishForShop({ query , limit , skip })
    }
   

    static async unPublishProductByShop ({product_shop, product_id}) {
        return await unPublishProductByShop({product_shop , product_id})
    }


    static async getListSearchProduct ({keySearch}) {
        return await searchProductByUser({ keySearch })
    }


    static async findAllProducts ({limit = 50 , sort = 'ctime' ,page = 1 , filter = {isPublished: true}}) {
        return await findAllProducts({ limit , sort , filter , page ,
            select : ['product_name' , 'product_price' , 'product_thumb' , 'product_shop']
        })
    }

    static async findProduct ({product_id}) {
        return await findProduct({ product_id , unSelect : ['__v' , 'product_variations'] })
    }

     //end query




    // update product 
    static async updateProduct(type , productId , payload) {

        const productClass = ProductFactory.productRegistry[type]

        if(!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)

        return new productClass(payload).updateProduct(productId)

    
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
        const newProduct = await product.create({...this, _id : product_id })
        if(newProduct) {
            //add product_stock in inventory collection
            await insertInventory({
                productId : newProduct._id,
                shopId : this.product_shop,
                stock : this.product_quantity
            })
        }

        return newProduct
    }

    // update Product 
    async updateProduct(productId , bodyUpdate) {
        return await updateProductById({productId , bodyUpdate , model : product})
    }
}



// Define sub-class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop : this.product_shop
        })
        if(!newClothing) throw new BadRequestError('Create new Clothing error')

        const newProduct = await super.createProduct(newClothing._id)
        if(!newProduct) throw new BadRequestError('Create new product error')


        return newProduct
    }

    async updateProduct( productId ) {
        const objParams = removeUndefineObj(this)

        if(objParams.product_attributes) {
            // console.log(objParams.product_attributes)
            // update chill
            await updateProductById({productId ,
                 bodyUpdate : updateNestedObjParser(objParams.product_attributes),
                 model : clothing
            })
        }
        const updateProduct = await super.updateProduct(productId,updateNestedObjParser(objParams))
        return updateProduct
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


// Define sub-class for different product types Furniture
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop : this.product_shop
        })
        if(!newFurniture) throw new BadRequestError('Create new Furniture error')

        const newProduct = await super.createProduct(newFurniture._id)
        if(!newProduct) throw new BadRequestError('Create new product error')


        return newProduct
    }
}


// register product types 
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Furniture', Furniture)
ProductFactory.registerProductType('Clothing', Clothing)

module.exports = ProductFactory