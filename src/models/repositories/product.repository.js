'use strict'

const {product , electronic , clothing , furniture} = require('../product.model')

const {Types } = require('mongoose') 



const findAllDraftsForShop = async({ query , limit , skip }) => {

    return await queryProduct({ query , limit , skip})
}

const findAllPublishForShop = async ({ query , limit , skip}) =>{
    return await queryProduct({ query , limit , skip})
}


const publishProductByShop = async({ product_shop , product_id}) => {
    const existShop = await product.findOne({
        product_shop : new Types.ObjectId(product_shop),
        _id : new Types.ObjectId(product_id)
    }) 

    if(!existShop) return null 

    existShop.isDraft = false
    existShop.isPublished = true

    const { modifiedCount } =  await existShop.updateOne(existShop)

    return modifiedCount
}


const unPublishProductByShop = async ({product_shop , product_id}) =>{
    const existShop = await product.findOne({
        product_shop : new Types.ObjectId(product_shop),
        _id : new Types.ObjectId(product_id)
    }) 

    if(!existShop) return null 

    existShop.isDraft = true
    existShop.isPublished = false

    const { modifiedCount } =  await existShop.updateOne(existShop)

    return modifiedCount
}


const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const result = await product.find(
        {
            isPublished : true,
            $text: { $search: regexSearch }
        },
        { score: { $meta: 'textScore' } })
        .sort( {score: { $meta: 'textScore' }})
        .lean()


    return result

    // Return or process the 'result' as needed
};





const queryProduct = async ({ query , limit , skip}) => {
    return await product.find( query ).
    populate('product_shop' , 'name email -_id')
    .sort({updateAt : -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()

}
module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser
}