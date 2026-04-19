const axios = require('axios');

module.exports = {
    name: 'predict',
    description: 'Predicts the nationality, age, and gender based on a name',
    async execute(message, args) {
        if (args.length === 0) {
            return message.channel.send('Please provide a name.');
        }

        const name = args.join(' ');

        try {
            // Make concurrent API requests to all three services
            const [nationalizeRes, agifyRes, genderizeRes] = await Promise.all([
                axios.get(`https://api.nationalize.io?name=${name}`),
                axios.get(`https://api.agify.io?name=${name}`),
                axios.get(`https://api.genderize.io?name=${name}`)
            ]);

            const nationalizeData = nationalizeRes.data;
            const agifyData = agifyRes.data;
            const genderizeData = genderizeRes.data;

            // Check for Nationalize.io data
            let nationalityText = '';
            if (nationalizeData.country.length === 0) {
                nationalityText = 'No nationalities found.';
            } else {
                nationalityText = 'Predicted nationalities:\n';
                nationalizeData.country.forEach(country => {
                    const probability = (country.probability * 100).toFixed(2);
                    const flagtag = country.country_id.toLowerCase()
                    nationalityText += `- ${country.country_id} :flag_${flagtag}:- ${probability}% chance\n`;
                });
            }

            // Check for Agify.io data
            const ageText = agifyData.age ? `Predicted age: ${agifyData.age}` : 'Age prediction not found.';

            // Check for Genderize.io data
            let genderText = '';
            if (genderizeData.gender) {
                const genderProbability = (genderizeData.probability * 100).toFixed(2);
                genderText = `Predicted gender: ${genderizeData.gender} (${genderProbability}% confidence)`;
            } else {
                genderText = 'Gender prediction not found.';
            }

            // Send the response message
            const response = `**Predictions for the name "${name}":**\n\n${nationalityText}\n${ageText}\n\n${genderText}`;
            message.channel.send(response);

        } catch (error) {
            console.error(error);
            message.channel.send('An error occurred while fetching the predictions. Please try again later.');
        }
    }
};
