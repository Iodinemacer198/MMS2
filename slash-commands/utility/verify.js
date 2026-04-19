const { SlashCommandBuilder } = require('discord.js');
const clientService = require('../../client');
const fs = require('fs');
const path = require('path');

// Path to the JSON file where verifications are logged
const verifiedUsersPath = path.resolve(__dirname, '../../verifiedUsers.json');

// Ensure the file exists and has an initial empty array if it doesn't exist
if (!fs.existsSync(verifiedUsersPath)) {
    fs.writeFileSync(verifiedUsersPath, JSON.stringify([]));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription("Verification command for Molecular's")
        .addStringOption(option =>
            option.setName('age')
                .setDescription('Your age')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('invitesource')
                .setDescription('Where you joined from')
                .setRequired(true)),
    async execute(interaction) {
        const role = '1225878681197609000';
        const member = interaction.member;
        const client = clientService.getClient();
        const age = interaction.options.getString('age');
        const check = interaction.options.getString('invitesource');
        const chan = client.channels.cache.get('1464089695234293884');
        const targetRole = interaction.guild.roles.cache.get(role);

        // Load the verified users from the JSON file
        const verifiedUsers = JSON.parse(fs.readFileSync(verifiedUsersPath, 'utf-8'));

        // Check if the user is already verified
        if (verifiedUsers.includes(interaction.user.id)) {
            return await interaction.reply({
                content: "You have already been verified!",
                ephemeral: true // Makes the reply visible only to the user
            });
        }

        if (age < 13) {
            await interaction.reply(`I'm sorry, but in accordance with Discord TOS we cannot allow anyone under the age of 13 into the server.`);
            await chan.send(`${interaction.user} has failed verification - Age: ${age}, from ${check}`);
            verifiedUsers.push(interaction.user.id);
            fs.writeFileSync(verifiedUsersPath, JSON.stringify(verifiedUsers, null, 4));
        } else if (age > 50) {
            await interaction.reply({
                content: `To check for abuses of the automatic verification system, age will have to be manually verified if it is over the average age of other users. Please be patient, a <@&1225794841439506604> is on their way. We apologize for any inconviences.`,
                allowedMentions: { roles: ['1225794841439506604'] }
            });
            await chan.send(`${interaction.user} has been suspected of fraudulent verification - Age: ${age}, from ${check}`);
            verifiedUsers.push(interaction.user.id);
            fs.writeFileSync(verifiedUsersPath, JSON.stringify(verifiedUsers, null, 4));
        } else {
            await interaction.reply(`Thank you! You have passed the verification check and will be verified shortly. Welcome to Molecular's!`);
            await interaction.channel.send('https://tenor.com/view/welcome-welcome-home-come-over-on-my-way-visiting-gif-7644194120675883352')
            await chan.send(`${interaction.user} has passed verification - Age: ${age}, from ${check}`);
            await member.roles.remove(targetRole);
            verifiedUsers.push(interaction.user.id);
            fs.writeFileSync(verifiedUsersPath, JSON.stringify(verifiedUsers, null, 4));
        }
    }
};
