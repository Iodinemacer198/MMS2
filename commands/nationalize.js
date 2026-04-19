const axios = require('axios');

module.exports = {
    name: 'nationalize',
    description: 'Predicts the nationality based on a name',
    async execute(message, args) {
        if (args.length === 0) {
            return message.channel.send('Please provide a name.');
        }

        const name = args.join(' ');
        
        try {
            // Fetch data from the Nationalize.io API
            const response = await axios.get(`https://api.nationalize.io?name=${name}`);
            const data = response.data;

            if (data.country.length === 0) {
                return message.channel.send(`No nationalities found for the name: ${name}`);
            }

            // Prepare the response message
            let reply = `Predicted nationalities for the name **${name}**:\n`;
            data.country.forEach(country => {
                const probability = (country.probability * 100).toFixed(2);
                const flagtag = country.country_id.toLowerCase()
                reply += `- ${country.country_id} :flag_${flagtag}:- ${probability}% chance\n`;
            });

            message.channel.send(reply);

        } catch (error) {
            console.error(error);
            message.channel.send('An error occurred while fetching the nationality. Please try again later.');
        }
    }
};
