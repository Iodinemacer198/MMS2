module.exports = {
    name: 'kenoold',
    description: 'Play a game of Keno! Pick numbers and see if you win.',
    execute(message, args) {
        if (!args.length) {
            return message.reply('You must pick exactly 10 numbers between 1 and 80, separated by commas.');
        }
        
        const userNumbers = args.join(' ')
            .split(',')
            .map(num => parseInt(num.trim(), 10))
            .filter(num => !isNaN(num) && num >= 1 && num <= 80);
        
        if (userNumbers.length !== 10) {
            return message.reply('You must pick exactly 10 numbers between 1 and 80, seperated by commas!');
        }
        
        const drawNumbers = new Set();
        while (drawNumbers.size < 20) {
            drawNumbers.add(Math.floor(Math.random() * 80) + 1);
        }
        
        const matchedNumbers = userNumbers.filter(num => drawNumbers.has(num));
        const winnings = [0, 0, 2, 5, 15, 50, 150, 500, 1000, 5000, 10000]; // Example payout structure
        
        const payout = winnings[matchedNumbers.length] || 0;
        
        message.channel.send(`**Keno Results**\nYour numbers: ${userNumbers.join(', ')}\nDrawn numbers: ${[...drawNumbers].join(', ')}\nMatched: ${matchedNumbers.length} (${matchedNumbers.join(', ')})\nYou won **$${payout}**!`);
    },
};
