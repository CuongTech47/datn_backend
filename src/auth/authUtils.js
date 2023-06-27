'use strict'

const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')



// service 
const { findByUserId } = require('../services/keyToken.service')


const HEADER = {
    API_KEY : 'x-api-key',
    CLIENT_ID : 'x-client-id',
    AUTHORIZATION : 'athorization'
}



const createTokenPair = async ( payload , publicKey , privateKey ) => {
    try {
        // create accessToken 
        const accessToken = await JWT.sign( payload , publicKey , {
            // algorithm : 'RS256',
            expiresIn : '2 days'
        })


        //create refreshToken
        const refreshToken = await JWT.sign( payload , privateKey , {
            // algorithm : 'RS256',
            expiresIn : '7 days'
        })



        //


        JWT.verify( accessToken , publicKey , (err , decoded) => {
            if(err) {
                console.error(`Error verify ::`,err)
            }else {
                console.log(`decoded verify ::`,decoded)
            }
        })

        return { accessToken , refreshToken }
    } catch (error) {
        
    }
}

const authentication = asyncHandler(async (req , res ,next) => {
    /*

        1 - check userId missing??
        2 - get access token 
        3 - verifyToken
        4 - check user in bds 
        5 - check keystore with this userId 
        6 - ok all => return next()

    */

    // 01
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invalid Request')


    // 02 
    const keyStore = await findByUserId(userId)
    if(!keyStore) throw new NotFoundError('Not Found keyStore')

    // 03 

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request')


    try {
        const decodeUser = JWT.verify(accessToken,keyStore.publicKey)

        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})


const verifyJWT = async (token , keySecret) => {
    return await JWT.verify(token , keySecret)
}



module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}