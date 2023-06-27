'use strict'

const keyTokenModel = require('../models/keyToken.model')


const { Types } = require('mongoose')

class KeyTokenService {
    static createKeyToken = async ({ userId , publicKey , privateKey , refreshToken}) => {
        try {
            // const publicKeyString = publicKey.toString()
            // const tokens = await keyTokenModel.create({
            //     user : userId,
            //     publicKey : publicKeyString
            // })

        //   level 0
            // const tokens = await keyTokenModel.create({
            //     user : userId,
            //     publicKey,
            //     privateKey
            // })

            // return tokens ? tokens.publicKey : null

            // level xxx 
            const filter = { user : userId }
            const update = {
                publicKey , privateKey , refreshTokensUsed : [] , refreshToken
            }  
            const options = { upsert : true , new : true}

            const tokens = await keyTokenModel.findOneAndUpdate(filter,update,options)

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async ( userId ) => {
        return await keyTokenModel.findOne({ user : new Types.ObjectId(userId)}).lean()
    }

    static removeKeyById = async (id) =>{
        return await keyTokenModel.deleteOne(id)
    }

}


module.exports = KeyTokenService