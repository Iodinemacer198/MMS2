const { AttachmentBuilder, EmbedBuilder } = require('discord.js');

async function getFact() {
    const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');
    const data = await response.json();

    if (!data || !data.text) {
        return 'Oops! Could not get a fun fact right now.';
    }

    return data.text;
}

module.exports = {
    name: 'fact',
    description: 'Sends a random fun fact',
    async execute(message, args) {
        const fact = await getFact(); // ✅ Await the function

        const embed = new EmbedBuilder()
            .setTitle('Daily Fun Fact')
            .setColor('#B300FF')
            .setDescription(fact);

        message.reply({ embeds: [embed] });
    },
};
