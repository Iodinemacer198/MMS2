module.exports = {
    name: 'coinflip',
    description: 'Flips a coin',
    async execute(message) {
        function sleep(ms) {
            return new Promise(resolve => {
              let timeoutId = setTimeout(() => {
                clearTimeout(timeoutId);
                resolve();
              }, ms);
            });
        }
        const diceRoll = Math.floor(Math.random() * 2) + 1;
        const msg1 = await message.reply("Flipping...");
        await sleep(1000);
        if (diceRoll === 1) {
            await msg1.edit(`Heads!`);
        }
        if (diceRoll === 2) {
            await msg1.edit(`Tails!`);
        }
    }
}