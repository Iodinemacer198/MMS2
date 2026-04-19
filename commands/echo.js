const clientService = require('../client');

module.exports = {
    name: 'echo',
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

        await message.delete().catch((error) => {
            console.error('Error deleting original message:', error);
            message.channel.send('Error');
        });

        const echoMessage = args.join(' ');

        message.channel.send(echoMessage);

        const chan = client.channels.cache.get('1229508268921978981');
        chan.send(`${message.author} echoed "${echoMessage}" in "${message.guild}"`);
    }
}