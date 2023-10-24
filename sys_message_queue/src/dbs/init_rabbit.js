'use strict'

const amqp = require('amqplib')

const connectToRabbitMQ = async () =>{
    try {
        // const connection = await amqp.connect('amqp://localhost')
        const connection = await amqp.connect('amqps://ejrnxxms:zmqTOa2T_rKdlWRnNfzp7RcGUkTDMR7L@octopus.rmq3.cloudamqp.com/ejrnxxms')
        if(!connection) throw new Error('Connection RabbitMQ failed ')
        const channel = await connection.createChannel()
        return {channel , connection}
    } catch (error) {
        console.error(`Error connecting to RabbitMQ`,error)
    }
}


const connectToRabbitMQForTest = async () => {
    try {
       const { channel , connection} = await connectToRabbitMQ()

       //publish message to a queue
       const queue = 'test-queue'
       const message = 'Hello , Cuong dep trai '
       await channel.assertQueue(queue)
       await channel.sendToQueue(queue, Buffer.from(message))

       //close the connection

       await connection.close()
    } catch (error) {
        console.error(`Error connecting to RabbitMQ`,error)
    }
}
const consumerQueue = async (channel , queueName) => {
    try {
        await channel.assertQueue(queueName , { durable: true })
        await channel.consume(queueName, message => {
            console.log(`Received message:: ${queueName}::`, `${message.content.toString()}`)

            

            // 1 find user following 
            // 2 send message to user following
            // 3 yes.ok ===> success
            // 4. no ===> error. setup DLX ...
        },{
            noAck: true
        })
    } catch (error) {
        console.error(`Error publish message to RabbitMQ`,error)
        throw error
    }
}
module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest,
    consumerQueue
}