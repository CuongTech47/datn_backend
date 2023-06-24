'use strict'

//!dmbg
const { Schema , model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'


// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema({
    user:{
        type : Schema.Types.ObjectId,
        ref : 'Shop'
    },
    email:{
        type:String,
        required:true,
        trim : true,
        unique:true,
    },

    publicKey : {
        type:String,
        required:true,
    },
    refreshToken : {
        type : Array,
        default : []
    }
},{
  collection : COLLECTION_NAME ,
    timestamps : true
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);