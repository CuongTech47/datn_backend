'use strict'
const amqp = require('amqplib')
async function consumerOrderedMessage() {
    const connection = await amqp.connect('amqps://ejrnxxms:zmqTOa2T_rKdlWRnNfzp7RcGUkTDMR7L@octopus.rmq3.cloudamqp.com/ejrnxxms')
        const channel = await connection.createChannel()

        const queueName = 'ordered-queue-message'
        await channel.assertQueue(queueName , {
            durable: true
        })

        // set prefect to 1 to ensure that only one message is sent to the consumer at a time
        // 1 nguoi dung chi nhan 1 message trong 1 thoi diem
        // channel.prefetch(1)

        channel.consume(queueName, message => {
            const msg = message.content.toString()

            setTimeout(() => {
                console.log(`Received message::${msg}`)
                channel.ack(message)
            }, Math.random() * 1000);
        })

        
}

consumerOrderedMessage().catch(err => console.error(err))