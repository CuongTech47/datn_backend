'use strict'

const { consumerQueue } = require('./src/services/consumerQueue.service')

const queueName = 'test-topic'

consumerQueue(queueName).then(() => {
    console.log(`Message consumer started on queue ${queueName}`)
}).catch(error => {
    console.log(`Message consumer failed on queue ${error.message}`);
})