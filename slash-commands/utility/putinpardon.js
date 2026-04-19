const { SlashCommandBuilder, PermissionFlagsBits, AttachmentBuilder, } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('putinpardon')
        .setDescription('Use the PUTIN PARDON プーチン恩赦 on a user')
        .addStringOption(option => 
            option.setName('userid')
                .setDescription('The ID of the user to unban')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    
    async execute(interaction) {
        const userId = interaction.options.getString('userid');

        try {
            const banImage = new AttachmentBuilder('./putinpardon.jpg', { name: 'putinpardon.jpg' });
            const bannedUsers = await interaction.guild.bans.fetch();
            if (!bannedUsers.has(userId)) {
                return interaction.reply({ content: 'That user has not been previously BIDEN BLASTED バイデンブラスト', ephemeral: true });
            }

            const user = await interaction.client.users.fetch(userId);

            try {
                await user.send({
                    content: `You have been PUTIN PARDONED プーチン恩赦 from **${interaction.guild.name}**`,
                    files: [banImage],
                });
            } catch (dmError) {
                console.warn(`Failed to send DM to ${user.tag}:`, dmError);
            }

            await interaction.guild.bans.remove(userId);
            return interaction.reply({ content: `Successfully PUTIN PARDONED プーチン恩赦 ${user.tag}!`, ephemeral: false, files: [banImage] });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'An error occurred while trying to PUTIN PARDON プーチン恩赦 that user.', ephemeral: true });
        }
    }
};
