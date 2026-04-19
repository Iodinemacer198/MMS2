module.exports = {
    name: 'nsfw',
    description: 'Test the bot',
    async execute(message, args) {
        message.channel.send('https://tenor.com/btLNc.gif');
    },
};