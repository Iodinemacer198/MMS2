const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'drawcard',
    description: 'Picks a random card from a deck and shows the card with an image',
    async execute(message) {
        try {
            // Fetch a random card from the Deck of Cards API
            const response = await axios.get('https://deckofcardsapi.com/api/deck/new/draw/?count=1');
            const card = response.data.cards[0];

            // Create an embed with card details and image
            const cardEmbed = new EmbedBuilder()
                .setColor('#B300FF')
                .setTitle(`${card.value} of ${card.suit}`)
                .setImage(card.image)
                .setFooter({ text: 'Deck of Cards API', iconURL: 'https://deckofcardsapi.com/static/img/spade.png' });

            // Send the embed to the channel
            message.channel.send({ embeds: [cardEmbed] });

        } catch (error) {
            console.error('Error fetching card:', error);
            message.channel.send('Sorry, something went wrong. Please try again!');
        }
    },
};
