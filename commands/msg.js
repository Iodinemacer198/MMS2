module.exports = {
    name: 'msg',
    description: 'Test the bot',
    async execute(message, args) {
        if (!message.author.id === '1140696859107659937') {
            return message.reply(`You do not have permission to use this command!`)
        }
        const userId = args[0];
        const dmessage = args.slice(1).join(" ");

        if (!dmessage) return message.reply("Please provide a message to send.");
        message.client.users.fetch(userId)
            .then(user => {
                user.send(`**${message.author} has sent the following message** - ${dmessage}`)
                    .then(() => message.reply(`Message sent successfully!`))
                    .catch(() => message.reply("Message could not be sent."));
            })
            .catch(() => message.reply("Invalid user ID or user not found."));
    },
};