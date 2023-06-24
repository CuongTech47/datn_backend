'use strict'

//!dmbg
const { Schema , model } = require('mongoose');
// const mongoose = require("mongoose"); // Erase if already required


const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'

// Declare the Schema of the Mongo model
const shopSchema = new Schema({
    name:{
        type:String,
        trim : true,
        maxLength : 150
        // required:true,
        // unique:true,
        // index:true,
    },
    email:{
        type:String,
        required:true,
        trim : true,
        unique:true,
    },
    // mobile:{
    //     type:String,
    //     required:true,
    //     unique:true,
    // },
    password:{
        type:String,
        required:true,
    },
    status : {
        type : String,
        enum : ['active','inactive'],
        default : 'inactive'
    },
    verfify : {
        type : Schema.Types.Boolean,
        default : false
    },
    role : {
        type : Array,
        default : []
    }
},{
    timestamps : true,
    collection : COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);