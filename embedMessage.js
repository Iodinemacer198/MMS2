const { EmbedBuilder } = require("discord.js");
const accessDenied = ('U+26E4')

module.exports = async function sendEmbedMessage(channel, title, description, color = 0xFF00CC) {
    const embed = new EmbedBuilder() 
      .setTitle(title)
      .setDescription(description)
      .setColor(color);
  
    try {
      await channel.send({ embeds: [embed] }); // Send the embed message
      console.log(`Sent embed message to channel: ${channel.name}`);
    } catch (error) {
      console.error('Error sending embed message:', error);
    }
  }