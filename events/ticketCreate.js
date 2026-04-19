const { Events } = require('discord.js');

module.exports = {
    name: Events.ChannelCreate,
    async execute(channel) {
        const targetGuildId = '700100389575458897';
        if (channel.guild?.id === targetGuildId && channel.type === 0 && channel.name.startsWith('ticket')) {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await channel.send({
                    content:  `Hello, welcome to __Molecular's!__ For quick and efficient verification, __please run the slash command **/verify** from the bot "MMS ⚛ 2"__

In the required command fields, please enter your age and where you got your invite from. If you pass the basic requirements, you will be verified! If you have any issues, or cannot use the command for any reason, feel free to ping an online staff member.

**Abuse of this system can lead to punishment. Obviously fraudulent information will be investigated further.**`,
                });
            } catch (error) {
                console.error(`Failed to send a message in the ticket channel: ${error}`);
            }
        }
    },
};
