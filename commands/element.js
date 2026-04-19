const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'element',
    description: 'Get a random chemical element from the periodic table',
    async execute(message) {
        try {
            // Fetch a random chemical element from the API
            const response = await axios.get('https://api.popcat.xyz/periodic-table/random');
            const element = response.data;

            // Create an embed with the element's information
            const embed = new EmbedBuilder()
                .setColor('#B300FF')
                .setTitle(`Element: ${element.name}`)
                .setDescription(`Symbol: **${element.symbol}**`)
                .addFields(
                    { name: 'Atomic Number', value: `${element.atomic_number}`, inline: true },
                    { name: 'Atomic Mass', value: `${element.atomic_mass}`, inline: true },
                    { name: 'Phase', value: `${element.phase}`, inline: true },
                    { name: 'Description', value: `${element.summary}`}
                )
                .setThumbnail(element.image)
                .setFooter({ text: `Discovered by: ${element.discovered_by || 'Unknown'}` });

            // Send the embed as a reply
            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await message.reply('An error occurred while fetching the element data. Please try again later.');
        }
    }
};