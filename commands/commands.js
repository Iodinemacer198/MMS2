const sendEmbedMessage = require('../embedMessage');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'commands',
    description: "Shows the bot's commands",
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
            .setLabel('Economic Commands')
            .setStyle(ButtonStyle.Success)

        const pmw = new ButtonBuilder()
            .setCustomId('politics')
            .setLabel('P&W Commands')
            .setStyle(ButtonStyle.Primary)

        const row = new ActionRowBuilder()
            .addComponents(page1, page3, gamble, page2)

        const commandsPage = new EmbedBuilder()
            .setColor('#B300FF')
            .setTitle('Prefix Commands')
            .setDescription(`Prefix = ~ (tilde)
                
**~help** - Shows the help and support page for MMS2
**~commands** - The page you are looking at now- shows the bot's commands    
**~test** - Test if the bot is working     
**~ping** - Test the current ping of the bot
~~**~ai {prompt}** - Ask an AI model a prompt. It's fairly bad, but fast and free so 🤷~~
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
**/putinpardon [user]** - Unban command, for moderators
**~~/ai [question] [role (optional)]~~** - Slash command version of ~ai, now with a role feature! You can now also reply to keep the conversation going!`);

        const gambling = new EmbedBuilder()
            .setColor('#85BB65')
            .setTitle('Economic Commands')
            .setDescription(`**~register** - Register your account to use the economic commands, and set up your bank account.          
**~balance / ~bal** - Check your current game balance.
**~work** - Work for money- requires 3 food.
**~send {user} {money}** - Transfers money from your bank to another users.
**~upgrades** - Shows the upgrades market.
**~upgrades-buy {item}** - Buy an item off the upgrades market.
**~upgrades-destroy {item}** - Destroy an upgrade from your inventory.
**~market view/list/delist/buy** - Interact with the player market.
**~leaderboard / ~lb** - Shows the top 10 richest users.
**~levels** - Level information board.

**~blackjack / ~bj {bet}** - Play a game of blackjack.
**~russianroulette {opponent} / ~rr {opponent}** - Play a simple game of Russian roulette against a friend. WARNING: This is an all or nothing game. **The loser loses all their bank except 10 dollars, and the winner recieves the loser's bank.**
**~slots {bet}** - Play a simple game of slots.
**~dice** - Rolls a 6 sided dice.
**~coinflip** - Flips a two-sided coin.

**~invest view** - View the current state of credits, bitcoin, and ethereum.
**~invest portfolio** - View your current investment portfolio.
**~invest buy {credits, bitcoin, ethereum} {amount}** - Buy shares in an investment.
**~invest sell {credits, bitcoin, ethereum} {amount}** - Sells shares in an investment.

**~car-buy (nothing / {car})** - Displays the current car market / Buys the selected car
**~car-upgrade (nothing / {upgrade})** - Displays the current upgrade market / Buys the selected upgrade

**~crime** - Commit petty crime for little reward, with some risk. Requires 3 food. Has a chance to drop either 1 metal, 1 electronic, or 1 explosive. Adds 1 heat to your user.
**~robbery** - Commit a high stakes robbery. Rewards and risk are based on your current heat. Requires 3 food and 1 tool. Has a chance to drop either 1 metal, 1 electronic, or 1 explosive. Adds 25 heat to your user.
**~heist** - A multiplayer crime system requiring 2+ players. The combined party must have at leats 1 metal, 1 electronic, and 1 explosive. Sets your heat to 99.

**~bailout** - Get a $100 bailout if you go broke, can only be used once a day`);

        const pnw = new EmbedBuilder()
            .setColor('#B300FF')
            .setTitle('Politics & War Commands')
            .setDescription(`**~nation {id}** - Show information for the given nation ID
**~alliance {id}** - Show information for the given alliance ID
**~trade** - Show current market information in Orbis
**~targets {id}** - Show raid targets for the given nation ID
**~obl {id}** - Shows an overview of the given nation ID's OBL team
**~colorinfo** - Gives the names and revenue bonuses for the trade blocs
**~citycost {id} {max city}** - Calculates the city cost to build to the given max city from your current city count, now updated for the new formula (if no max city is given, automatically calculates the next city)`);

        const othersPage = new EmbedBuilder()
            .setColor('#B300FF')
            .setTitle('Other Features')
            .setDescription(`**Bulgaria** - Automatically reacts several emojis to messages containing "Bulgaria"
**Mew** - Automatically reacts '🤫' and '🧏' to messages containing "mew"
**Fish** - Automatically reacts '🐟' to messages containing "fish"
**Frog** - Automatically reacts '🐸' and '💰' to messages containing "frog"
**Romania** - Automatically reacts '🇷🇴' to messages containing "Romania"

*You can request to have these features ommitted from your server if you would like

**Now including "Free Will"!**
~~• Use /freewill-messages to add random instances of the AI getting involved in your conversations. Thresholds are customizable.~~
• Use /freewill-reactions to add random instances of the bot reacting random emojis to messages. Thresholds are customizable.`);

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
            }
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} interactions.`);
        });

        //collector.on('collect', async i => {
        //    if (i.customId = 'page1') {
        //        await i.update({ content: 'This should be displaying the commands page'});
        //    }
        //    else if (i.customId = 'page2') {
        //        await i.update({ content: 'the mms2 secret command list is ~lacreatura'});
        //    }
        //});

        //collector.on('end', collected => {
        //    interaction.editReply({ content: "ChatGPT added this expiration thing, ion think its needed but whatever", components: [] });
        //});
    }
}