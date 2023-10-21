'use strict'

//!dmbg
const { Schema , model , Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'


// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema({
    user:{
        type : Schema.Types.ObjectId,
        require : true,
        ref : 'Shop'
    },
    publicKey : {
        type:String,
        required:true,
    },
    privateKey : {
        type:String,
        required:true,
    },
    refreshTokensUsed : {
        type : Array,
        default : [] // nhung rf da dc su dung
    },
    refreshToken : {
        type : String, // nhung rf dang dc su dung
        required : true
    }
},{
  collection : COLLECTION_NAME ,
    timestamps : true
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);