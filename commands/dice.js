module.exports = {
    name: 'dice',
    description: 'Rolls a six-sided dice',
    async execute(message) {
        function sleep(ms) {
            return new Promise(resolve => {
              let timeoutId = setTimeout(() => {
                clearTimeout(timeoutId);
                resolve();
              }, ms);
            });
        }
        const diceRoll = Math.floor(Math.random() * 6) + 1;
        const msg1 = await message.reply("Rolling...");
        await sleep(1000);
        await msg1.edit(`${diceRoll}`);
    }
}