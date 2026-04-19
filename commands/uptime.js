const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'uptime',
    description: 'Displays the bot\'s uptime',
    execute(message) {
        // Convert the uptime from milliseconds to a human-readable format
        let totalSeconds = (message.client.uptime / 1000);
        const days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);

        // Build the uptime string
        let uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        const uptimeEmbed = new EmbedBuilder()
            .setColor(0xB300FF)
            .setTitle('Uptime')
            .setDescription(`The bot has been online for:
# ${days}d ${hours}h ${minutes}m ${seconds}s`)

        message.reply({embeds: [uptimeEmbed]});
    },
};
