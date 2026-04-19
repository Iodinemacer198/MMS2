const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const shop = new EmbedBuilder()
            .setColor('#85BB65')
            .setTitle('Upgrade Market')
            .setDescription(`To purchase, use **~upgrades-buy {item}**
To destroy an item, use **~upgrades-destroy {item}**
             
**__Luxury Goods__**
**gold_foil** ($15000) - Increases gambling winnings by 5% (excluding Russian roulette)
**elemental_fund** ($25000) - Increases work revenue by 10%
**gadolinium_crowbar** ($30000) - Increases crime loot by 10% (excluding heists)

**__Factories__**
*Note: you can only have one type of factory at a time - while your factory is running, you cannot use other money-making commands*
**~farm** ($1500) - Allows you to produce 200 food in 2 hours, at the cost of 7 tools and metal, and 5 food
**~workshop** ($1500) - Allows you to produce 100 tools in 2 hours, at the cost of 5 metal and food
**~mine** ($1500) - Allows you to produce 50 metal in 2 hours, at the cost of 5 tools and food`);
module.exports = {
    name: 'upgrades',
    description: 'Test the bot',
    async execute(message) {
        await message.reply({ embeds: [shop] });
    }
}