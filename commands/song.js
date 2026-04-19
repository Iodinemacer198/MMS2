const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

// Your Spotify API credentials (client_id and client_secret from Spotify Developer Dashboard)
const client_id = '';
const client_secret = '';

// Function to get access token from Spotify API
async function getSpotifyToken() {
    const response = await axios.post('https://accounts.spotify.com/api/token', 
    new URLSearchParams({
        'grant_type': 'client_credentials'
    }), {
        headers: {
            'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    return response.data.access_token;
}

module.exports = {
    name: 'song',
    description: 'Search for a song on Spotify',
    async execute(message, args) {
        // Get the query from the command arguments
        const query = args.join(' ');

        if (!query) {
            return message.reply('Please provide a song or artist to search for.');
        }

        try {
            // Get Spotify API access token
            const token = await getSpotifyToken();

            // Fetch song data from Spotify API
            const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const song = response.data.tracks.items[0];

            const artistId = song.artists[0].id;
            const artistResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!song) {
                return message.reply(`No results found for "${query}".`);
            }

            const artist = artistResponse.data;
            const genres = artist.genres.length > 0 ? artist.genres.join(', ') : 'N/A'; // Join genres into a string

            // Convert track length from milliseconds to minutes:seconds
            const trackLengthMillis = song.duration_ms;
            const minutes = Math.floor(trackLengthMillis / 60000);
            const seconds = Math.floor((trackLengthMillis % 60000) / 1000);
            const trackLengthFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            // Create an embed with the song's information
            const embed = new EmbedBuilder()
                .setColor('#B300FF') // iTunes/Apple Music color
                .setTitle(song.name)
                .setURL(song.external_urls.spotify)
                .setAuthor({ name: song.artists[0].name })
                .addFields(
                    { name: 'Album', value: song.album.name, inline: true },
                    { name: 'Release Date', value: song.album.release_date, inline: true },
                    { name: 'Length', value: `${minutes}m ${seconds}s`, inline: true },
                    { name: 'Genre', value: genres, inline: true },
                )
                .setThumbnail(song.album.images[0].url)
                .setFooter({ text: 'Powered by Spotify' });

            // Send the embed as a reply
            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('API Error: ', error);
            await message.reply('An error occurred while searching for the song on Spotify. Please try again later.');
        }
    },
};
