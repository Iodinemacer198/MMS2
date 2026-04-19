const clientService = require('../client');

module.exports = {
    name: 'suggest',
    description: 'Sends suggestions to the owner',
    async execute(message, args) {
        const client = clientService.getClient();
        await message.reply("Suggestion sent! Thank you!")
        const finalMessage = args.join(' ');
        const chan = client.channels.cache.get('1229508803632824350');
        chan.send(`<@1140696859107659937>, ${message.author} suggested "${finalMessage}"`);
    }
}