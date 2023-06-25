'use strict'

const _ = require('lodash')

const getInfoData = ( { fileds = [] , obj = {} } ) =>{
    return _.pick(obj , fileds)
} 


module.exports = {
    getInfoData
}