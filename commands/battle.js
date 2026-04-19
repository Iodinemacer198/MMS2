const { EmbedBuilder } = require('discord.js');

// Define the attack emojis and the corresponding damage values
const attacks = {
    '⚔️': { name: 'Sword Strike', damage: 30 },
    '🔥': { name: 'Fireball', damage: 50 },
    '💥': { name: 'Explosion', damage: 40 },
    '🛡️': { name: 'Shield Block', damage: 0 }, // No damage, defense move
    '❌': { name: 'Miss', damage: 0 }, // No damage, miss move
};

module.exports = {
    name: 'nobattle',
    description: 'Start a reaction-based battle! React with an emoji to deal damage to your opponent.',
    async execute(message) {
        // The two players (initiator and the first to react)
        const player1 = message.author;
        let player2 = null;
        
        // Initial health points
        let player1HP = 100;
        let player2HP = 100;
        
        // Create an embed for the battle
        const battleEmbed = new EmbedBuilder()
            .setColor('#B300FF')
            .setTitle('Reaction Battle!')
            .setDescription('React with an emoji to perform your attack:\n⚔️ Sword Strike (30 DMG)\n🔥 Fireball (50 DMG)\n💥 Explosion (40 DMG)\n🛡️ Shield Block (0 DMG, Defense)\n❌ Miss (No Attack)')
            .addFields(
                { name: `${player1.username}'s HP`, value: `${player1HP}`, inline: true },
                { name: `Opponent's HP`, value: `${player2HP}`, inline: true }
            )
            .setFooter({ text: 'React to start battling!' });

        // Send the battle message
        const battleMessage = await message.channel.send({ embeds: [battleEmbed] });

        // Add reactions for players to interact with
        for (let emoji in attacks) {
            await battleMessage.react(emoji);
        }

        // Create a reaction collector to handle the battle
        const filter = (reaction, user) => {
            return Object.keys(attacks).includes(reaction.emoji.name) && !user.bot; // Ignore bot reactions
        };

        const collector = battleMessage.createReactionCollector({ filter, time: 60000 });

        collector.on('collect', (reaction, user) => {
            // If player 2 hasn't been set yet, set the first reactor as player 2
            if (!player2 && user.id !== player1.id) {
                player2 = user;
            }

            if (user.id === player1.id || user.id === player2.id) {
                const attack = attacks[reaction.emoji.name];
                let damage;

                // Apply the attack's damage to the opposing player
                if (user.id === player1.id) {
                    damage = attack.damage;
                    player2HP -= damage;
                    message.channel.send(`${player1.username} used **${attack.name}** and dealt ${damage} damage to ${player2.username || 'Opponent'}!`);
                } else if (user.id === player2.id) {
                    damage = attack.damage;
                    player1HP -= damage;
                    message.channel.send(`${player2.username} used **${attack.name}** and dealt ${damage} damage to ${player1.username}!`);
                }

                // Update the battle embed with the new health points
                battleEmbed.setFields(
                    { name: `${player1.username}'s HP`, value: `${Math.max(player1HP, 0)}`, inline: true },
                    { name: `${player2.username ? player2.username + "'s HP" : 'Opponent\'s HP'}`, value: `${Math.max(player2HP, 0)}`, inline: true }
                );
                battleMessage.edit({ embeds: [battleEmbed] });

                // End the battle if either player's HP reaches 0
                if (player1HP <= 0 || player2HP <= 0) {
                    const winner = player1HP > 0 ? player1.username : player2.username;
                    message.channel.send(`🏆 **${winner}** wins the battle!`);
                    collector.stop();
                }
            }
        });

        collector.on('end', collected => {
            if (player1HP > 0 && player2HP > 0) {
                message.channel.send('⏰ Time\'s up! No winner this time.');
            }
        });
    },
};
