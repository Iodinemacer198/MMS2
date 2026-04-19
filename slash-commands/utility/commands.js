const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('commands')
		.setDescription("Shows the commands and features page for MMS2")
        .setIntegrationTypes(0,1)
        .setContexts(0,1,2),
	async execute(interaction) {
        const page1 = new ButtonBuilder()
                    .setCustomId('page1')
                    .setLabel('Prefix Commands')
                    .setStyle(ButtonStyle.Primary)
        
                const page2 = new ButtonBuilder()
                    .setCustomId('page2')
                    .setLabel('Others')
                    .setStyle(ButtonStyle.Primary)
        
                const page3 = new ButtonBuilder()
                    .setCustomId('page3')
                    .setLabel('Slash Commands')
                    .setStyle(ButtonStyle.Primary)
        
                const gamble = new ButtonBuilder()
                    .setCustomId('gamble')
                    .setLabel('Gambling Commands')
                    .setStyle(ButtonStyle.Primary)
        
                const pmw = new ButtonBuilder()
                    .setCustomId('politics')
                    .setLabel('P&W Commands')
                    .setStyle(ButtonStyle.Primary)
        
                const row = new ActionRowBuilder()
                    .addComponents(page1, page3, gamble, pmw, page2)
        
                const commandsPage = new EmbedBuilder()
                    .setColor('#B300FF')
                    .setTitle('Prefix Commands')
                    .setDescription(`Prefix = ~ (tilde)
                        
**~help** - Shows the help and support page for MMS2
**~commands** - The page you are looking at now- shows the bot's commands    
**~test** - Test if the bot is working     
**~ping** - Test the current ping of the bot
**~ai {prompt}** - Ask an AI model a prompt. It's fairly bad, but fast and free so 🤷
**~flagguess** - Guess of the nation of a random national flag
**~planespotting {gamemode}** - Guess a plane from a given image with a 30 second time limit (Gamemodes: 'normal'/none, 'hard', 'crazy', 'military')
**~suggest {arg}** - Send a suggestion to the developers
**~echo {arg}** - Send a message as the bot (contact devs for user logs if necessary)
**~rps** - Play a game of rock/paper/scissors against the bot
**~system** - Shows some basic information about the host system for the bot
**~cat** - Random cat image
**~element** - Generates info for a random element on the periodic table
**~song {name}** - Search a song from Spotify
**~wyr** - Presents two options for your servers members to choose between
**~urban {word}** - Search for the Urban Dictionary definition of a word
**~fakeuser** - Fetch a random user from randomuser.me API
**~uptime** - Displays the bot's uptime
**~8ball** - Simulates an 8-ball shake
**~ship {arg1} {arg2}** - Ships two arguments`);
        
                const scommandsPage = new EmbedBuilder()
                    .setColor('#B300FF')
                    .setTitle('Slash Commands')
                    .setDescription(`**/help** - A slash version of the help command
**/ping** - A slash version of the ping command
**/bidenblast [user]** - Ban command, for moderators
**/ai [question] [role (optional)]** - Slash command version of ~ai, now with a role feature! You can now also reply to keep the conversation going!`);
        
                const gambling = new EmbedBuilder()
                    .setColor('#B300FF')
                    .setTitle('Gambling Commands')
                    .setDescription(`**~blackjack / ~bj** - Play a watered-down game of blackjack (does break if the game goes on too long)
**~russianroulette / ~rr** - Play a simple game of Russian roulette against a friend
**~slots** - Play a simple game of slots
**~drawcard** - Draws a random card from a standard deck of cards
**~dice** - Rolls a 6 sided dice
**~coinflip** - Flips a two-sided coin`);
        
                const pnw = new EmbedBuilder()
                    .setColor('#B300FF')
                    .setTitle('Politics & War Commands')
                    .setDescription(`**~nation {id}** - Show information for the given nation ID
**~alliance {id}** - Show information for the given alliance ID
**~trade** - Show current market information in Orbis
**~targets {id}** - Show raid targets for the given nation ID
**~citycost {id}** - Calculates the next city cost for the given nation ID
**~obl {id}** - Shows an overview of the given nation ID's OBL team
**~colorinfo** - Gives the names and revenue bonuses for the trade blocs`);
        
                const othersPage = new EmbedBuilder()
                    .setColor('#B300FF')
                    .setTitle('Other Features')
                    .setDescription(`**Bulgaria** - Automatically reacts several emojis to messages containing "Bulgaria"
**Mew** - Automatically reacts '🤫' and '🧏' to messages containing "mew"
**Fish** - Automatically reacts '🐟' to messages containing "fish"
**Frog** - Automatically reacts '🐸' and '💰' to messages containing "frog"
**Romania** - Automatically reacts '🇷🇴' to messages containing "Romania"
        
*You can request to have these features ommitted from your server if you would like`);
        
                await interaction.reply({ embeds: [commandsPage], components: [row], });
        
                const collector = interaction.channel.createMessageComponentCollector({ time: 6000000 });
        
                collector.on('collect', async i => {
                    if (!i.isButton()) {
                        return;
                    };
        
                    if (i.customId === 'page1') {
                        await i.update({ embeds: [commandsPage], });
                    } else if (i.customId === 'page2') {
                        await i.update({ embeds: [othersPage], });
                    } else if (i.customId === 'page3') {
                        await i.update({ embeds: [scommandsPage], });
                    } else if (i.customId === 'gamble') {
                        await i.update({ embeds: [gambling], });
                    } else if (i.customId === 'politics') {
                        await i.update({ embeds: [pnw] });
                    }
                });
        
                collector.on('end', collected => {
                    console.log(`Collected ${collected.size} interactions.`);
                });
    }
}