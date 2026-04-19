const {  ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const options = [
    'rock',
    'paper',
    'scissors'
]

module.exports = {
    name: 'rps',
    description: 'rps',
    async execute(interaction) {
        const botPick = options[Math.floor(Math.random() * options.length)];
        const rock = new ButtonBuilder()
            .setCustomId('rock')
            .setLabel('Rock')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🪨')

        const gun = new ButtonBuilder()
            .setCustomId('gun')
            .setLabel('Gun')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🔫')

        const paper = new ButtonBuilder()
            .setCustomId('paper')
            .setLabel('Paper')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('📄')

        const scissors = new ButtonBuilder()
            .setCustomId('scissors')
            .setLabel('Scissors')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('✂️')

        const rock2 = new ButtonBuilder()
            .setCustomId('rock2')
            .setLabel('Rock')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🪨')
            .setDisabled(true)

        const gun2 = new ButtonBuilder()
            .setCustomId('gun2')
            .setLabel('Gun')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🔫')
            .setDisabled(true)

        const paper2 = new ButtonBuilder()
            .setCustomId('paper2')
            .setLabel('Paper')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('📄')
            .setDisabled(true)

        const scissors2 = new ButtonBuilder()
            .setCustomId('scissors2')
            .setLabel('Scissors')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('✂️')
            .setDisabled(true)

        const rock3 = new ButtonBuilder()
            .setCustomId('rock3')
            .setLabel('Rock')
            .setStyle(ButtonStyle.Success)
            .setEmoji('🪨')
            .setDisabled(true)

        const gun3 = new ButtonBuilder()
            .setCustomId('gun3')
            .setLabel('Gun')
            .setStyle(ButtonStyle.Success)
            .setEmoji('🔫')
            .setDisabled(true)

        const paper3 = new ButtonBuilder()
            .setCustomId('paper3')
            .setLabel('Paper')
            .setStyle(ButtonStyle.Success)
            .setEmoji('📄')
            .setDisabled(true)

        const scissors3 = new ButtonBuilder()
            .setCustomId('scissors3')
            .setLabel('Scissors')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✂️')
            .setDisabled(true)
        
        const row = new ActionRowBuilder()
            .addComponents(rock, paper, scissors)

        const rowRock = new ActionRowBuilder()
            .addComponents(rock3, paper2, scissors2)

        const rowPaper = new ActionRowBuilder()
            .addComponents(rock2, paper3, scissors2)

        const rowScissors = new ActionRowBuilder()
            .addComponents(rock2, paper2, scissors3)

        //const rowGun = new ActionRowBuilder()
            //.addComponents(rock2, paper2, scissors2, gun3)

        const msg1 = await interaction.reply({ content: 'Choose your move!', components: [row], })

        const collectorFilter = interaction.user;

        const confirmation = await msg1.awaitMessageComponent({ filter: collectorFilter });

        if (confirmation.customId === 'rock') {
            await confirmation.update({components: [rowRock] })
            if (botPick === 'rock') {
                await msg1.reply("I also chose rock, so it is a tie!")
            } else if (botPick === 'paper') {
                await msg1.reply("I chose paper, so I win!")
            } else if (botPick === 'scissors') {
                await msg1.reply("I chose scissors, so you win!")
            }
        } else if (confirmation.customId === 'paper') {
            await confirmation.update({components: [rowPaper] })
            if (botPick === 'paper') {
                await msg1.reply("I also chose paper, so it is a tie!")
            } else if (botPick === 'scissors') {
                await msg1.reply("I chose scissors, so I win!")
            } else if (botPick === 'rock') {
                await msg1.reply("I chose rock, so you win!")
            }
        } else if (confirmation.customId === 'scissors') {
            await confirmation.update({components: [rowScissors] })
            if (botPick === 'scissors') {
                await msg1.reply("I also chose scissors, so it is a tie!")
            } else if (botPick === 'rock') {
                await msg1.reply("I chose rock, so I win!")
            } else if (botPick === 'paper') {
                await msg1.reply("I chose paper, so you win!")
            }
        } //else if (confirmation.customId === 'gun') {
            //await confirmation.update({components: [rowGun] })
            //if (botPick === 'scissors') {
                //await msg1.reply("*bam* I... chose scissors..., you win...")
            //} else if (botPick === 'rock') {
                //await msg1.reply("*bam* I... chose rock..., you win...")
            //} else if (botPick === 'paper') {
                //await msg1.reply("*bam* I... chose paper..., you win...")
            //}
        //}
    }
}