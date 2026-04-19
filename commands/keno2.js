const { Client, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
    name: 'keno',
    description: 'Play a game of Keno! Pick numbers and see if you win.',
    async execute(message) {
        const embed = new EmbedBuilder()
            .setTitle('Keno Game 💸💸')
            .setDescription('Click the button below to start and pick your numbers!')
            .setColor('#B300FF');
        
        const startButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('start_keno')
                .setLabel('Start Keno')
                .setStyle(ButtonStyle.Primary)
        );
        
        const sentMessage = await message.channel.send({ embeds: [embed], components: [startButton] });
        
        const filter = i => i.user.id === message.author.id;
        const collector = sentMessage.createMessageComponentCollector({ filter, time: 30000 });
        
        collector.on('collect', async interaction => {
            if (interaction.customId === 'start_keno') {
                await interaction.deferUpdate();
                
                const numberOptions = Array.from({ length: 80 }, (_, i) => (
                    new StringSelectMenuOptionBuilder()
                        .setLabel((i + 1).toString())
                        .setValue((i + 1).toString())
                ));
                
                const pages = [
                    numberOptions.slice(0, 20),
                    numberOptions.slice(20, 40),
                    numberOptions.slice(40, 60),
                    numberOptions.slice(60, 80)
                ];
                
                const selectMenus = pages.map((options, index) => (
                    new ActionRowBuilder().addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId(`keno_select_${index}`)
                            .setPlaceholder(`Pick numbers (${index + 1}/4) - Select up to 10`)
                            .setMinValues(1)
                            .setMaxValues(10)
                            .addOptions(options)
                    )
                ));
                
                const selectionMessage = await message.channel.send({
                    content: 'Please select a total of 10 numbers from the dropdowns below.',
                    components: selectMenus
                });
                
                const userNumbers = new Set();
                const menuCollector = selectionMessage.createMessageComponentCollector({ filter, time: 60000 });
                
                menuCollector.on('collect', async menuInteraction => {
                    if (menuInteraction.customId.startsWith('keno_select')) {
                        menuInteraction.values.forEach(num => userNumbers.add(parseInt(num, 10)));
                        await menuInteraction.deferUpdate();
                        //await menuInteraction.reply({ content: `You selected: ${menuInteraction.values.join(', ')}`, ephemeral: true });
                        
                        if (userNumbers.size >= 10) {
                            menuCollector.stop();
                        }
                    }
                });
                
                menuCollector.on('end', async () => {
                    if (userNumbers.size !== 10) {
                        return message.channel.send('You must select exactly 10 numbers! Try again.');
                    }
                    
                    const drawNumbers = new Set();
                    while (drawNumbers.size < 20) {
                        drawNumbers.add(Math.floor(Math.random() * 80) + 1);
                    }
                    
                    const matchedNumbers = [...userNumbers].filter(num => drawNumbers.has(num));
                    const winnings = [0, 0, 2, 5, 15, 50, 150, 500, 1000, 5000, 10000]; // Example payout structure
                    
                    const payout = winnings[matchedNumbers.length] || 0;
                    
                    const resultEmbed = new EmbedBuilder()
                        .setTitle('Keno Results 🤑🤑')
                        .setDescription(`Your numbers: ${[...userNumbers].join(', ')}\nDrawn numbers: ${[...drawNumbers].join(', ')}\nMatched: ${matchedNumbers.length} (${matchedNumbers.join(', ')})\nYou won **$${payout}**!`)
                        .setColor('#B300FF');
                    
                    await message.channel.send({ embeds: [resultEmbed] });
                });
            }
        });
    },
};
