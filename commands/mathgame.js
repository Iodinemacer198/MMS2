const fs = require('fs');
const { AttachmentBuilder } = require('discord.js');
const { randomBytes } = require('crypto');

module.exports = {
    name: 'mathgame',
    description: '-',
    async execute(message, args) {
        if (!args.length) {
            let num1 = Math.floor(Math.random()*9)+1;
            let num2 = Math.floor(Math.random()*9)+1;

            const msg1 = await message.reply(`${num1} x ${num2} = ?`);

            const filter = (response) => {
                return response.author.id === message.author.id;
            };

            const timeLimit = 30000; 
            message.channel.awaitMessages({ filter, max: 1, time: timeLimit, errors: ['time'] })
                .then((collected) => {
                    const guess = collected.first().content.trim().toLowerCase();
                    const correctAnswer = (num1)*(num2)

                    if (guess.includes(correctAnswer)) {
                        msg1.reply(`Correct! The answer is ${correctAnswer}.`);
                    } 
                    else {
                        msg1.reply(`Incorrect. The answer is ${correctAnswer}.`);
                    }
                })
                .catch(() => {
                    msg1.reply('Time\'s up! No guess was given.');
            }); 
        }
    }
}