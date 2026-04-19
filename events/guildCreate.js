const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildCreate',
    execute: async (guild) => {
        // Search for a channel that contains 'general' in its name
        const general = guild.channels.cache
            .filter(channel => channel.name.toLowerCase().includes('general') && channel.type === 0) // 0 is for text channels
            .sort((a, b) => a.position - b.position)
            .first();

        const land = new EmbedBuilder()
            .setTitle('Hello!')
            .setColor('#B300FF')
            .setThumbnail('https://media.discordapp.net/attachments/1192347994784268389/1285038948359344148/mms2.jpg?ex=66ec1d08&is=66eacb88&hm=e2177a9cb54f85884d2eb8f2a6932084e4935f2b2b90be9771943d571b0fb516&=&format=webp&width=662&height=662')
            .setDescription(`Thank you for inviting Molecular Multiverse Services 2! This bot contain a whole host of fun and potentially useful commands for your server. To get started, use __~commands__ for a list of commands and features the bot offers. 

Please note that this bot is new and features are still getting added, which can lead to potential downtimes. Bugs or obvious mistakes should be reported to developers as well, in order for us to make the bot even better.

*This bot was made by therealiodinemacer. Feel free to contact if problems arise. Thank you for supporting this project! 
Support server [here](https://discord.gg/YkEtPw9mwK)*`)

        // If the 'general' channel exists and the bot has permission to send messages
        if (0 === 0) {
            try {
                // Send a welcome message
                await general.send({embeds: [land]});
            } catch (error) {
                console.error(`Failed to send message to the general channel in ${guild.name}:`, error);
            }
        } else {
            console.log(`No general channel found or insufficient permissions in ${guild.name}.`);
        }
    }
};
