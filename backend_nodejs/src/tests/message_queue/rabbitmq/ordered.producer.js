'use strict';
const amqp = require('amqplib');

async function producerOrderedMessage() {
  const connection = await amqp.connect('amqps://ejrnxxms:zmqTOa2T_rKdlWRnNfzp7RcGUkTDMR7L@octopus.rmq3.cloudamqp.com/ejrnxxms');
  const channel = await connection.createChannel();

  const queueName = 'ordered-queue-message';
  await channel.assertQueue(queueName, {
    durable: true
  });

  for (let i = 0; i < 10; i++) {
    const message = {
      email: `ngoccuong824${i}@gmail.com`,
      name: `message ${i}`
    };
    const messageJSON = JSON.stringify(message); // Chuyển đổi thành chuỗi JSON
    console.log(`Message sent::`, message);
    channel.sendToQueue(queueName, Buffer.from(messageJSON), {
      persistent: true
    });
  }

  setTimeout(() => {
    connection.close();
  }, 1000);
}

producerOrderedMessage().catch(err => console.error(err));
