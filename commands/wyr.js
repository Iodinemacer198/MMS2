const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'wyr',
    description: '-',
    async execute(message) {
        try {
            // Fetch song data from the iTunes API using PopCat
            const response = await axios.get(`https://api.popcat.xyz/wyr`);

            const options = response.data

            await message.reply(`Would you rather ${options.ops1} or ${options.ops2}`)

        } catch (error) {
            console.error(error);
            await message.reply({ content: 'There was an error fetching the question!', ephemeral: true });
        }
    }
}