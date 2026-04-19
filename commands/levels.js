const sendEmbedMessage = require('../embedMessage');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'levels',
    description: "Shows the bot's commands",
    async execute(interaction) {

        const info = new EmbedBuilder()
            .setColor('#85BB65')
            .setTitle('Levels')
            .setDescription(`**__WORK:__**
**Copper** - 0 to 20000 work xp - earns $75 to $300 per work
**Silver** - 20000 to 100000 work xp - earns $125 to $350 per work
**Gold** - 100000 to 250000 work xp - earns $175 to $400 per work
**Platinum** - 250000+ work xp - earns $225 to $450 per work

**__CRIME:__**
**Pickpocket** - 0 to 40000 crime xp
**Thug** - 40000 to 200000 crime xp
**Criminal** - 200000 to 500000 crime xp
**Boss** - 500000+ crime xp`);

        await interaction.reply({ embeds: [info]});

    }
}