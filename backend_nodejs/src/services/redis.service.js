"use strict";

const redis = require("redis");
const { promisify } = require("util");
const redisClient = redis.createClient();

const { reservationInventory } = require('../models/repositories/inventory.repository');

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`;

    const retryTimes = 10;
    const expireTime = 3000;

    for (let index = 0; index < retryTimes; index++) {
        const result = await setnxAsync(key, expireTime);
        if (result === 1) {
            const isReservation = await reservationInventory({
                productId,
                quantity,
                cartId
            });

            if (isReservation.modifiedCount === 1) {
                await pexpire(key, expireTime);
                return key;
            }
            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }
};

const releaseLock = async (keyLock) => {
    const delAsyncKey = promisify(client.del).bind(client);
    return await delAsyncKey(keyLock);
};

module.exports = {
    acquireLock,
    releaseLock
};
