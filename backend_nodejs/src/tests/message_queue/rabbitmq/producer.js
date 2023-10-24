const amqp = require('amqplib')


const messages = 'Hello , RabbitMQ for cuong dep trai 20'

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqps://ejrnxxms:zmqTOa2T_rKdlWRnNfzp7RcGUkTDMR7L@octopus.rmq3.cloudamqp.com/ejrnxxms')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName , {
            durable: true
        })

        // send messages to consumer channel
        channel.sendToQueue(queueName, Buffer.from(messages)) 

        console.log(`messaeg send::`,messages);
    }catch(e) {
        console.error(e);
    }
}

runProducer().catch(console.error)