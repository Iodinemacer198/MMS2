const axios = require('axios'); // Axios for API requests
const { EmbedBuilder } = require('discord.js'); // Import EmbedBuilder

module.exports = {
    name: 'nationold',
    description: 'Get information about a Politics and War nation by nation ID',
    execute(message, args) {
        if (!args.length) {
            return message.channel.send('You need to provide a nation ID!');
        }

        const nationId = args[0];

        // API call to Politics and War nation data (replace with actual API endpoint and key if necessary)
        axios.get(`https://politicsandwar.com/api/nation/id=${nationId}&key=`)
            .then(response => {
                const nation = response.data;

                if (!nation || nation.error) {
                    return message.channel.send('Nation not found or there was an error with the request.');
                }

                // Create an embed using EmbedBuilder
                const nationEmbed = new EmbedBuilder()
                    .setColor(0xB300FF)
                    .setURL(`https://politicsandwar.com/nation/id=${nationId}`)
                    .setTitle(`${nation.prename} ${nation.name}`)
                    .setDescription(`Nation ID: ${nationId}
                        
${nation.prename} ${nation.name} is a(n) ${nation.government.toLowerCase()} in ${nation.continent}. It has ${nation.ecopolicy} economic policies and ${nation.socialpolicy} social policies. Currently, it is a member of (the) ${nation.alliance} alliance.
‎ `)
                    .addFields(
                        { name: 'Nation Name', value: `${nation.prename} ${nation.name}`, inline: true },
                        { name: 'Leader Name', value: `${nation.title} ${nation.leadername}`, inline: true },
                        { name: 'Population', value: nation.population.toLocaleString(), inline: true },
                        { name: 'Cities', value: nation.cities.toString(), inline: true },
                        { name: 'Soldiers', value: nation.soldiers.toString(), inline: true },
                        { name: 'Tanks', value: nation.tanks.toString(), inline: true },
                        { name: 'Aircraft', value: nation.aircraft.toString(), inline: true },
                        { name: 'Ships', value: nation.ships.toString(), inline: true },
                        { name: 'Total Infrastructure', value: nation.totalinfrastructure.toFixed(2), inline: true }
                    )
                    .setThumbnail(`${nation.flagurl}`)

                // Send the embed to the channel
                message.reply({ embeds: [nationEmbed] });
            })
            .catch(error => {
                console.error('Error fetching nation data:', error);
                message.reply('There was an error fetching the nation data.');
            });
    },
};
