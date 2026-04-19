const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription("Shows the landing page for MMS2")
        .setIntegrationTypes(0,1)
        .setContexts(0,1,2),
	async execute(interaction) {
        const help = new EmbedBuilder()
            .setColor('#B300FF')
            .setTitle('Help & Support')
            .setDescription(`Thank you for inviting Molecular Multiverse Services 2, your one-stop-shop for some simple, yet fun commands!
    
To get started, use __~commands__ for a list of commands and features included in the bot
    
*This bot was made by therealiodinemacer. Feel free to contact if problems arise. Thank you for supporting this project! 
Support server [here](https://discord.gg/YkEtPw9mwK)*`)
            .setThumbnail('https://media.discordapp.net/attachments/1192347994784268389/1285038948359344148/mms2.jpg?ex=66e8d148&is=66e77fc8&hm=e690912b55d7fcdf93b76d3f7f39e8eef8568832b34d83dcecda0e34a128e19b&=&format=webp&width=760&height=760');
        
        interaction.reply({ embeds: [help] })
    }
}