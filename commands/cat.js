const axios = require('axios');

module.exports = {
    name: 'cat',
    description: 'Random cat images!',
    async execute(message) {
        try {
            const response = await axios.get('https://api.thecatapi.com/v1/images/search');
            const catImageUrl = response.data[0].url;
            message.channel.send(catImageUrl);
        } catch (error) {
            console.error('Error fetching cat image:', error);
            message.channel.send('Could not fetch a cat image at the moment. Please try again later.');
        }
    }
}