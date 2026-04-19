module.exports = {
    name: 'secret',
    description: 'Test the bot',
    async execute(message, args) {
        const uid = message.author.id
        if (uid == '1140696859107659937') {
            message.channel.send(':3');
        } else {
            return
        }
    },
};