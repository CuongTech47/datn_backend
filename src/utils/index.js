'use strict'

const _ = require('lodash')
const { Types } = require('mongoose')

const getInfoData = ( { fileds = [] , obj = {} } ) =>{
    return _.pick(obj , fileds)
} 


const getSelectData = ( select= [] ) => {
    return Object.fromEntries(select.map(el => [el , 1]))
}


const unGetSelectData = ( select= [] ) => {
    return Object.fromEntries(select.map(el => [el , 0]))
}

const removeUndefineObj = obj => {
    Object.keys(obj).forEach(k => {
        if(obj[k] == null) {
            delete obj[k]
        }
    })
    return obj
}

const convertToObjIdMongodb = id => Types.ObjectId(id) 

const updateNestedObjParser = obj => {
    console.log(`[1]::`,obj)
    const final = {}
    Object.keys(obj).forEach(k =>{
        if(typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
           const response = updateNestedObjParser(obj[k])
           Object.keys(response).forEach(a =>{
                final[`${k}.${a}`] = response[a]
            })
        }else {
            final[k] = obj[k]
        }
    })
    console.log(`[2]::`,obj)
    return final
}

module.exports = {
    getInfoData ,
    getSelectData,
    unGetSelectData,
    removeUndefineObj,
    // updateNestedObj,
    updateNestedObjParser,
    convertToObjIdMongodb
}