const fs = require('fs');
const { SlashCommandBuilder } = require('discord.js');

const allowedID = '1140696859107659937'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('freewill-messages')
        .setDescription('Add or remove this channel from allowed channels')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('add or remove')
                .setRequired(true)
                .addChoices(
                    { name: 'Add', value: 'add' },
                    { name: 'Remove', value: 'remove' }
                )
        )
        .addIntegerOption(option =>
            option.setName('min_threshold')
                .setDescription('Minimum message threshold')
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName('max_threshold')
                .setDescription('Maximum message threshold')
                .setRequired(false)
        ),

    async execute(interaction) {
        if (!interaction.member.permissions.has('ManageGuild') && interaction.user.id !== allowedID) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const config = JSON.parse(fs.readFileSync('./freewill.json', 'utf8'));

        const action = interaction.options.getString('action');
        const minThreshold = interaction.options.getInteger('min_threshold') || config.defaultMinThreshold;
        const maxThreshold = interaction.options.getInteger('max_threshold') || config.defaultMaxThreshold;
        const channelId = interaction.channel.id;

        if (action === 'add') {
            if (!config.allowedChannels.includes(channelId)) {
                config.allowedChannels.push(channelId);
                config.channelThresholds[channelId] = { minThreshold, maxThreshold };
                await interaction.reply(`Enabled free will messaging in this channel, with threshold ${minThreshold}-${maxThreshold}.`);
                fs.writeFileSync('./freewill.json', JSON.stringify(config, null, 4));
                return
            } else {
                return interaction.reply('This channel already has free will messaging enabled.');
            }
        }

        if (action === 'remove') {
            config.allowedChannels = config.allowedChannels.filter(id => id !== channelId);
            delete config.channelThresholds[channelId];
            await interaction.reply('Disabled free will messaging in this channel.');
            fs.writeFileSync('./freewill.json', JSON.stringify(config, null, 4));
            return
        }
    }
};
