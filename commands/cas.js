const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const shop = new EmbedBuilder()
            .setColor('#85BB65')
            .setTitle('Cars Market')
            .setDescription(`To purchase, use **~cars-buy [car]**
Cars are sorted by price, which generally corresponds with its base performance index (BPI). Prices are from the car's original base price.

**1989 Geo Metro Base [metro]** - $5,995 - BPI: 2.00
**2011 Honda Fit/Jazz [fit]** - $15,100 - BPI: 4.98
**2019 Hyundai Elantra SE [elantra]** - $17,100 - BPI: 6.88
**2000 VW Jetta GL TDi [jetta]** - $18,520 - BPI: 4.69
**2002 Subaru Impreza WRX Sedan [wrx]** - $24,520 - BPI: 15.97
**2017 Honda CR-V EX [crv]** - $26,795 - BPI: 9.79
**2021 Honda Accord Sport [accord]** - $27,430 - BPI: 11.49
**2019 VW Golf GTI S [golf]** - $28,490 - BPI: 19.21
**2007 Audi A4 2.0T [a4]** - $28,960 - BPI: 11.66
**2020 Dodge Challenger GT [challenger]** - $31,095 - BPI: 20.87
**2017 Nissan Z Sport [nz]** - $33,570 - BPI: 26.80
**2014 BMW 4 Series 435i [4s]** - $46,925 - BPI: 24.93
**2024 Lexus RC 300 3.5L [rc]** - $48,610 - BPI: 15.77
**2014 BMW Z4 35i [z4]** - $56,950 - BPI: 28.50
**2012 Porsche 911 (997) Carrera [911]** - $82,100 - BPI: 33.02`);
module.exports = {
    name: 'carsfweg',
    description: 'Test the bot',
    async execute(message) {
        await message.reply({ embeds: [shop] });
    }
}