const { SlashCommandBuilder, AttachmentBuilder, PermissionFlagsBits } = require('discord.js');

const allowedID = '974805584845099028'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bidenblast')
        .setDescription('Use BIDEN BLAST バイデンブラスト on a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to ban.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');

        // Check if the command executor has the required permission
        if (!interaction.member.permissions.has('BanMembers') && interaction.user.id !== allowedID) {
            return interaction.reply({ content: 'You do not have permission to BIDEN BLAST バイデンブラスト other members of this server' });
        }


        // Attempt to ban the user
        const member = interaction.guild.members.cache.get(user.id);
        if (!member) {
            return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
        }

        if (member.permissions.has('BanMembers')) {
            return interaction.reply({ content: 'You cannot BIDEN BLAST バイデンブラスト this user as they are a mod' });
        }

        //if (user.id == '1140696859107659937') {
            //return interaction.reply({ content: 'You cannot BIDEN BLAST バイデンブラスト this user' });
        //}

        try {
            const banImage = new AttachmentBuilder('./bidenblast.jpg', { name: 'bidenblast.jpg' });

            try {
                await user.send({
                    content: `You have been BIDEN BLASTED バイデンブラスト from **${interaction.guild.name}**`,
                    files: [banImage],
                });
            } catch (dmError) {
                console.warn(`Failed to send DM to ${user.tag}:`, dmError);
            }

            await member.ban();
            return interaction.reply({ content: `${user.tag} has been BIDEN BLASTED バイデンブラスト`, files: [banImage] });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'There was an error trying to BIDEN BLAST バイデンブラスト this user, make sure I have the proper permissions to do so!', ephemeral: true });
        }
    },
};
