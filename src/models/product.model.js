'use strict'



//!dmbg
const { Schema , model  } = require('mongoose');

const slugify = require('slugify')



const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

// Declare the Schema of the Mongo model
const productSchema = new Schema({
    product_name:{
        type:String,
        require : true
    },
    product_thumb :{
        type:String,
        required:true,
    },
    product_description:{
        type:String,
    },
    product_price:{
        type:Number,
        required:true,
    },
    product_quantity : {
        type : Number,
        require : true
       
    },
    product_type : {
        type : String,
        require : true,
        enum : ['Electronics','Clothing','Furniture']
    },
    product_attributes : {
        type : Schema.Types.Mixed , require : true
    },
    product_shop : {
        type : Schema.Types.ObjectId , ref : 'Shop'
    },
    product_slug : String,
    //move
    product_ratingsAverage : {
        type : Number,
        default : 4.5,
        min : [1 , 'Rating must be above 1.0'],
        max : [5 , 'Rating must be above 5.0'],
        //
        set : (val) => Math.round(val * 10)/10

    },
    product_variations : {type: Array , default: []},
    isDraft : {type : Boolean , default : true , index : true , select : false},
    isPublished : {type : Boolean , default : false , index : true , select : false}

},{
    timestamps : true,
    collection : COLLECTION_NAME
});




// define the product type = clothing 

const clothingSchema = new Schema({
    brand : { 
        type : String,
        require : true
    },
    size : String,
    material : String,
    product_shop : { type : Schema.Types.ObjectId , ref :'Shop'}
},{
    collection : 'clothes',
    timestamps : true
}) 


// create index for search

productSchema.index({product_name : 'text',product_description:'text'})


// document middleware : runs before .save() .and .create() ...

productSchema.pre('save' ,function(next) {
    this.product_slug = slugify(this.product_name , {lower : true})
    next()
})



// define the product type = electronic

const electronicSchema = new Schema({
    manufacturer : { 
        type : String,
        require : true
    },
    model : String,
    color : String,
    product_shop : { type : Schema.Types.ObjectId , ref :'Shop'}
},{
    collection : 'electronics',
    timestamps : true
}) 


// define the product type = furniture

const furnitureSchema = new Schema({
    brand : { 
        type : String,
        require : true
    },
    size : String,
    material : String,
    product_shop : { type : Schema.Types.ObjectId , ref :'Shop'}
},{
    collection : 'furnitures',
    timestamps : true
}) 


//Export the model

module.exports = {
    product : model(DOCUMENT_NAME, productSchema),
    clothing : model('Clothing', clothingSchema),
    electronic : model('Electronics',electronicSchema),
    furniture : model('Furniture',furnitureSchema)

}