'use strict';

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError, AuthFailureError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');


const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {

    static logout = async (keyStore) => {
      const delKey = await KeyTokenService.removeKeyById(keyStore._id)
      console.log(delKey)
      return delKey
    }


  /*
    1 - check email dbs 
    2 - match password
    3 - create AT VS RT and save 
    4 - genarate tokens 
    5 - get data and login
  */
  static login = async ({ email , password , refreshToken = null}) => {

    // 1
    const foundShop = await findByEmail({email})
    if(!foundShop) throw new BadRequestError('Shop not resgisted!')

    // 2
    const match = bcrypt.compare(password , foundShop.password)
    if(!match) throw new AuthFailureError('Authentication errors')

    //3
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    // 4 

    const { _id : userId } = foundShop
    const payload = {
        userId,
        email
    };
    const tokens = await createTokenPair(payload, publicKey, privateKey);
    await KeyTokenService.createKeyToken({
      userId,
      refreshToken : tokens.refreshToken,
      privateKey , publicKey
    })
    return {
      shop : getInfoData({fileds : ['_id','name','email'],obj:foundShop}),
      tokens
    }
  
  }
  static signUp = async ({ name, email, password }) => {
    // try {
      // Step 1: Kiểm tra xem email đã tồn tại chưa
      

      const existingShop = await shopModel.findOne({ email }).lean();

      if (existingShop) {
        throw new BadRequestError('Error : Shop already registered!')
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        // Tạo khóa riêng tư (privateKey) và khóa công khai (publicKey)su dung thuat toan rsa 
        // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem',
        //   },
        //   privateKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem',
        //   },
        // });


        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')


        console.log({privateKey , publicKey})

        // const publicKeyString = await KeyTokenService.createKeyToken({
        //   userId: newShop._id,
        //   publicKey,
        //   privateKey
          
        // });

        const keyStore = await KeyTokenService.createKeyToken({
            userId: newShop._id,
            publicKey,
            privateKey
            
          });

        // if (!publicKeyString) {
        //   return {
        //     code: 'xxxx',
        //     message: 'publicKeyString error',
        //   };
        // }

        if (!keyStore) {
          throw new BadRequestError('Error : Shop already registered!')
            // return {
            //   code: 'xxxx',
            //   message: 'keyStore error',
            // };
          }
          

        // console.log(`publicKeyString::`, publicKeyString);

        // const publicKeyObj = crypto.createPublicKey(publicKeyString);

        // console.log(`publicKeyObj::`, publicKeyObj);

        // Tạo cặp token
        const payload = {
          userId: newShop._id,
            email
        };
        // const tokens = await createTokenPair(payload, publicKeyString, privateKey);

        const tokens = await createTokenPair(payload, publicKey, privateKey);
        console.log(`Created Token Success::`, tokens);

        return {
          code: 201,
          metadata: {
            shop : getInfoData({fileds : ['_id','name','email'],obj:newShop}),
            tokens
          },
        };
      }

      return {
        code: 200,
        metadata: null,
      };
    // } catch (error) {
    //   throw new BadRequestError('Error : Shop already registered!')
    // }
  };
}

module.exports = AccessService;
