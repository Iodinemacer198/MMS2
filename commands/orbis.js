const axios = require('axios'); // Axios for API requests
const { EmbedBuilder } = require('discord.js'); // Import EmbedBuilder


module.exports = {
    name: 'sex',
    description: 'Get information about a Politics and War nation by nation ID',
    async execute(message) {
        try {
            // Fetch nation data using Axios
            const response = await axios.post(
                'https://api.politicsandwar.com/graphql',
                {
                    query: `
                        query {
                            activity_stats {
                                data {
                                    nations_created
                                    active_1_day
                                }
                            }
                            game_info {
                                game_date
                            }
                        }

                    `,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer`,
                    },
                }
            );

            const data = response.data;

            if (data.errors) {
                return message.channel.send(`Error: ${data.errors[0].message}`);
            }

            const activityStats = data.data.activity_stats.data;
            const gameInfo = data.data.game_info;

            if (!activityStats || !gameInfo) {
                return message.channel.send('Unable to retrieve activity stats or game info.');
            }

            message.reply(`${gameInfo.game_date}
${activityStats.nations_created}
${activityStats.active_1_day}

originally supposed to be an "orbis overview" but it's useless so I just abandoned it. also the fuck you sending "~sex" for 🤨🤨🤨`)


        } catch (error) {
            console.error(error);
            message.channel.send('An error occurred while fetching the data. Please try again later.');
        }
    }
}