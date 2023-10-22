'use strict'

const { connectToRabbitMQ, connectToRabbitMQForTest } = require('../dbs/init_rabbit')


describe('RabbitMQ Connection', ()=>{
    it('Should connect to successfull RabbitMQ', async () => {
        const result = await connectToRabbitMQForTest()
        expect(result).toBeUndefined()
    })
})