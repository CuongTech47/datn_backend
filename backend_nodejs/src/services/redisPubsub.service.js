
const Redis = require('redis')


class RedisPubsubService {
    constructor() {
        this.subscriber = Redis.createClient()
        this.publisher = Redis.createClient()
    }

    publish(channel , message) {
        return new Promise ( (resovel , reject) => {
            this.publisher.publish(channel , message , (error , reply) => {
                if(error) {
                    reject(error)
                }
                resovel(reply)
            })
        })
    }

    subscribe(channel , callback) {
        this.subscriber.subscribe(channel)
        this.subscriber.on('message' , (subscriberChannel , message) => {
            if(channel === subscriberChannel) {
                callback(channel ,message)
            }
        })
    }


}

module.exports = new RedisPubsubService()