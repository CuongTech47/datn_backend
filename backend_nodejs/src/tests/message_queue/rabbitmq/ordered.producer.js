'use strict'
const amqp = require('amqplib')
async function consumerOrderedMessage() {
    const connection = await amqp.connect('amqps://ejrnxxms:zmqTOa2T_rKdlWRnNfzp7RcGUkTDMR7L@octopus.rmq3.cloudamqp.com/ejrnxxms')
        const channel = await connection.createChannel()

        const queueName = 'ordered-queue-message'
        await channel.assertQueue(queueName , {
            durable: true
        })

        for (let i = 0 ; i < 10 ; i++) {
           const messaege = `ordered-queue-message-${i}`
           console.log(`message send::`,messaege);
           channel.sendToQueue(queueName, Buffer.from(messaege), {
               persistent: true
           })
        }

        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 1000);
}

consumerOrderedMessage().catch(err => console.error(err))