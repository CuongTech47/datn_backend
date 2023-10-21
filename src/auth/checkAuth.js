'use strict'

const { findById } = require("../services/apiKey.service")

const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION : 'authorization'
}

const apiKey = async (req , res , next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()

        if(!key) {
            return res.status(403).json({
                message : 'Forbidden Error'
            })
        }

        // check objKey 

        const objKey = await findById(key)
        if(!objKey) {
            return res.status(403).json({
                message : 'Forbidden Error'
            })
        }
        req.objKey = objKey

        return next()
    } catch (error) {
        
    }
}


const permisstion = ( permission ) => {
    return (req , res , next) => {
        if(!req.objKey.permissions) {
            return res.status(403).json({
                message : 'Forbidden denied'
            })
        }
        console.log(`permission::`,req.objKey.permissions )

        const vilidPermission = req.objKey.permissions.includes(permission)

        if(!vilidPermission) {
            return res.status(403).json({
                message : 'Forbidden denied'
            })
        }
        return next()

    }
}



module.exports = {
    apiKey ,
    permisstion,
   
}