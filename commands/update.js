const clientService = require('../client');

module.exports = {
    name: 'update',
    description: 'Echos the argument',
    async execute(message, args) {

        if (message.content.includes('@everyone') || message.content.includes('@here')) {
            return message.channel.send('Error echoing: Mass pings are not allowed!');
        }

        const messageContent = message.content.replace(/\s+/g, ' ');
        const roleMentions = messageContent.match(/<@&(\d+)>/g);
        const client = clientService.getClient();

        if (roleMentions) {
            return message.channel.send('Error echoing: Pinging roles is not allowed!');
        }

        const chan2 = client.channels.cache.get('839415075340812288');
        const chan = client.channels.cache.get('720011765672444007');

        const echoMessage = args.join(' ');

        await chan2.send(`**MMS ⚛ 2 has been updated!** - ${echoMessage}`);
        await chan.send(`**MMS ⚛ 2 has been updated!** - ${echoMessage}`);

    }
}