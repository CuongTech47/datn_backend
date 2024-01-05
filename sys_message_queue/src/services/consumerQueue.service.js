'use strict'

const {consumerQueue , connectToRabbitMQ } = require('../dbs/init_rabbit')

const messageService = {
    consumerQueue: async(queueName) => {
        try {
            const { channel } = await connectToRabbitMQ()
            await consumerQueue(channel,queueName)
        }catch(error) {
            console.error(`Error consumer message from RabbitMQ`,error)
            
        }
    }
}

module.exports = messageService