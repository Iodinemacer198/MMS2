const clientService = require('../../client');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription("Replies with the bot's latency")
    .setIntegrationTypes(0,1)
    .setContexts(0,1,2),
	async execute(interaction) {
        const startTime = Date.now();
        const client = clientService.getClient();
    
        try {
          const pong = await interaction.reply('Pinging...');
    
          const endTime = Date.now();
          const latency = endTime - startTime;
    
          await pong.edit(`Pong! ${latency}ms`);
  
        } catch (error) {
          console.error(error);
          message.channel.send('Error: Could not send ping message.');
        }
    }
};