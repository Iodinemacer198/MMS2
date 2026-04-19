const axios = require('axios');

module.exports = {
    name: 'urban',
    description: '-',
    async execute(message, args) {
        const term = args.join(' ');

        // Check if a term was provided
        if (!term) {
            message.channel.send('Please provide a word to define.');
            return;
        }

        try {
            // Make a GET request to the Urban Dictionary API
            const response = await axios.get(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`);

            const data = response.data.list;

            // Check if there are any definitions
            if (data.length === 0) {
                message.reply(`No definition found for **${term}**.`);
                return;
            }

            // Get the first definition from the list
            let definition = data[0].definition;
            let example = data[0].example;

            // Remove brackets only, keeping the words inside
            definition = definition.replace(/\[|\]/g, '');
            example = example.replace(/\[|\]/g, '');

            // Send the definition and example
            message.reply(`**__${term}__**\n\n**Definition:** ${definition}\n\n**Example:** ${example}`);
        } catch (error) {
            console.error(error);
            message.reply('There was an error fetching the definition. Please try again later.');
        }
    }
}