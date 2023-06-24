'use strict'

const JWT = require('jsonwebtoken')

const createTokenPair = async ( payload , publicKey , privateKey ) => {
    try {
        // create accessToken 
        const accessToken = await JWT.sign( payload , privateKey , {
            algorithm : 'RS256',
            expiresIn : '2 days'
        })


        //create refreshToken
        const refreshToken = await JWT.sign( payload , privateKey , {
            algorithm : 'RS256',
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



module.exports = {
    createTokenPair
}