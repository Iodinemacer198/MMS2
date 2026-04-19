module.exports = {
    name: 'sb',
    description: 'gambling 🤑',
    async execute(message, args) {
        const bet = args[0]
        const result = playSweetBonanza(bet);
        await message.reply(result);
        function playSweetBonanza(bet) {
            const fruits = ['🍇', '🍉', '🍌', '🍎', '🍒', '🍍'];
            let slots = [];
            for (let i = 0; i < 6; i++) {
                slots.push(fruits[Math.floor(Math.random() * fruits.length)]);
            }
            const winnings = calculateWinnings(slots, bet);
            return `**Sweet Bonanza**\n${slots.join(' ')}\n\nYou bet: ${bet}\nYou won: ${winnings}`;
        }

        function calculateWinnings(slots, bet) {
            const fruitCounts = slots.reduce((counts, fruit) => {
                counts[fruit] = (counts[fruit] || 0) + 1;
                return counts;
            }, {});

            let multiplier = 0;
            for (const count of Object.values(fruitCounts)) {
                if (count >= 3) {
                    multiplier += count;
                }
            }

            return bet * multiplier;
        }
    }
}
