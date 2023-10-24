const amqp = require('amqplib');

describe('RabbitMQ Connection', () => {
    let connection;

    beforeAll(async () => {
        connection = await amqp.connect('amqps://ejrnxxms:zmqTOa2T_rKdlWRnNfzp7RcGUkTDMR7L@octopus.rmq3.cloudamqp.com/ejrnxxms');
    });

    afterAll(async () => {
        await connection.close();
    });

    it('should connect to RabbitMQ', async () => {
        const channel = await connection.createChannel();
        expect(channel).toBeDefined();
    });
});