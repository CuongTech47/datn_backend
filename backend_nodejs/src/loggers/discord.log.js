'use strict';

const { Client, GatewayIntentBits } = require('discord.js');


const {
    CHANNELID_DISCORD,
    TOKEN_DISCORD
} = process.env;

class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        // Thêm sự kiện "ready" để xác nhận khi bot đã sẵn sàng
        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}!`);
        });

        this.client.login(TOKEN_DISCORD)
            .catch(error => {
                console.error(`Bot failed to log in: ${error}`);
            });
    }

    sendToFormatCode (logData) {
        const { code , message  = 'this is some additional infomation about the code .' , title = 'Code Example' } = logData

        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt('00ff00',16), // You can directly use the hexadecimal color value
                    title: title,
                    description: '```json\n' + JSON.stringify(code, null, 2) + '\n```',
                },
            ],
        }

       this.sendToMessage(codeMessage)

        
       
    }

    sendToMessage(message = 'message') {
        const channel = this.client.channels.cache.get(CHANNELID_DISCORD);
        if (!channel) {
            console.error(`Không tìm thấy channel...`, CHANNELID_DISCORD);
            return;
        }

        channel.send(message)
            .catch(error => {
                console.error(`Error sending message: ${error}`);
            });
    }
}

module.exports = new LoggerService();
