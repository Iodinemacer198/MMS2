const clientService = require('../client');

module.exports = {
    name: 'hellsend',
    description: 'Echos the argument',
    async execute(message, args) {

        //if (message.author.id !== '1140696859107659937') {
            //return
        //}

        if (message.content.includes('@everyone') || message.content.includes('@here')) {
            return message.channel.send('Error echoing: Mass pings are not allowed!');
        }

        const messageContent = message.content.replace(/\s+/g, ' ');
        const roleMentions = messageContent.match(/<@&(\d+)>/g);
        const client = clientService.getClient();

        if (roleMentions) {
            return message.channel.send('Error echoing: Pinging roles is not allowed!');
        }

        const echoMessage = args.join(' ');
        const chan = client.channels.cache.get('720011765672444007');
        chan.send(`${message.author.username}: ${echoMessage}`);

        
    }
}