const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Database = require("better-sqlite3");

// Open the database
const db = new Database("users.db");

module.exports = {
    name: "rr",
    description: "Challenge someone to a game of Russian roulette where the loser loses everything except $10, and the winner takes it all!",
    async execute(message, args) {
        // Validate input
        if (!args[0] || !message.mentions.users.size) {
            return message.channel.send("You need to mention someone to challenge them!");
        }

        const challenger = message.author;
        const opponent = message.mentions.users.first();

        // Prevent challenging a bot or oneself
        if (opponent.bot) {
            return message.channel.send("You cannot challenge a bot!");
        }
        if (opponent.id === challenger.id) {
            return message.channel.send("You cannot challenge yourself!");
        }

        // Check if both players are registered
        const challengerData = db.prepare("SELECT * FROM users WHERE id = ?").get(challenger.id);
        const opponentData = db.prepare("SELECT * FROM users WHERE id = ?").get(opponent.id);

        if (!challengerData || !opponentData) {
            return message.channel.send("Both players must be registered! Use `~register` to use the economics feature.");
        }

        // Check if both players have enough money
        if (challengerData.balance <= 10) {
            return message.channel.send(`${challenger}, you don't have enough money to play! (Minimum >$10)`);
        }
        if (opponentData.balance <= 10) {
            return message.channel.send(`${opponent}, you don't have enough money to play! (Minimum >$10)`);
        }

        // Create action buttons for accept/decline
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("accept").setLabel("Accept").setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId("decline").setLabel("Decline").setStyle(ButtonStyle.Danger)
        );

        // Send challenge message with buttons
        const messagePrompt = await message.channel.send({
            content: `${opponent}, ${challenger} has challenged you to a game of Russian roulette. Click "Accept" to play or "Decline" to refuse.`,
            components: [row],
        });

        // Filter for button interaction from the opponent only
        const filter = (interaction) => interaction.user.id === opponent.id;

        try {
            const interaction = await messagePrompt.awaitMessageComponent({
                filter,
                time: 30000, // 30 seconds to respond
            });

            // Handle decline
            if (interaction.customId === "decline") {
                return interaction.update({
                    content: `❌ ${opponent} has declined the challenge.`,
                    components: [],
                });
            }

            // Handle acceptance
            await interaction.update({
                content: `🔫 ${opponent} has accepted the challenge! The game begins...`,
                components: [],
            });

            // Start the game
            const players = [challenger, opponent];
            let currentPlayerIndex = 0;

            while (true) {
                const currentPlayer = players[currentPlayerIndex];
                const bulletPosition = Math.floor(Math.random() * 6); // Random bullet chamber
                const shot = Math.floor(Math.random() * 6); // Random trigger pull

                await message.channel.send(`🎯 ${currentPlayer}, it's your turn. Spinning the barrel...`);

                await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate suspense

                if (shot === bulletPosition) {
                    // Player lost
                    const winner = players[1 - currentPlayerIndex];
                    const loser = currentPlayer;

                    // Get loser & winner balances
                    const loserData = db.prepare("SELECT * FROM users WHERE id = ?").get(loser.id);
                    const winnerData = db.prepare("SELECT * FROM users WHERE id = ?").get(winner.id);

                    // Calculate transfer of money
                    const loserRemaining = 10; // Loser keeps $10
                    const amountLost = loserData.balance - loserRemaining; // Amount to transfer
                    const winnerNewBalance = winnerData.balance + amountLost;

                    // Update balances in database
                    db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(loserRemaining, loser.id);
                    db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(winnerNewBalance, winner.id);

                    await message.channel.send(`💥 *Bang!* - ${loser} has lost!\n💰 **${winner} wins and takes $${amountLost}!**\n🏳️ ${loser} now has $${loserRemaining}.`);

                    break;
                } else {
                    await message.channel.send(`🔫 *Click!* - ${currentPlayer} is safe.`);
                    currentPlayerIndex = 1 - currentPlayerIndex; // Switch to the other player
                }

                await new Promise((resolve) => setTimeout(resolve, 1000)); // Short delay before the next round
            }
        } catch (e) {
            // Handle timeout or other errors
            console.error(e);
            await messagePrompt.edit({
                content: `⏳ ${opponent} did not respond in time. Challenge canceled.`,
                components: [],
            });
        }
    },
};
