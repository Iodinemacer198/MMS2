module.exports = {
    name: 'fakeuser', // Command name
    description: 'Fetch a random user from randomuser.me API',
    execute: async (message, args) => {
        const fetch = (await import('node-fetch')).default;
        try {
            // Fetch the random user data
            const response = await fetch('https://randomuser.me/api/');
            const data = await response.json();
            const user = data.results[0];

            // Extract user info
            const { title, first, last } = user.name;
            const { country, city } = user.location;
            const email = user.email;
            const profilePicture = user.picture.large;

            // Send the embedded message
            await message.reply({
                embeds: [{
                    title: `${title} ${first} ${last}`,
                    description: `Age: ${user.dob.age}\nFrom: ${city}, ${country}\nEmail: ${email}`,
                    color: 0xB300FF,
                    thumbnail: {
                        url: profilePicture
                    }
                }]
            });

        } catch (error) {
            console.error('Error fetching random user:', error);
            message.reply('There was an error fetching the random user. Please try again later.');
        }
    }
};
