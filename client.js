const { Client, IntentsBitField, ActivityType, Partials } = require('discord.js');

const client = new Client({
  intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent,
      IntentsBitField.Flags.GuildVoiceStates,
      IntentsBitField.Flags.GuildMessageTyping,
      IntentsBitField.Flags.DirectMessages,
  ],
  partials: [Partials.Channel] // Corrected way to handle partial DMs
});

module.exports = {
  getClient: () => client,
};