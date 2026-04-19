module.exports = {
    name: 'píng',
    async execute(message) {

        setTimeout(async () => {
            const sentMessage = await message.channel.send("Pong!");

            setTimeout(async () => {
                const num = Math.floor(Math.random() * (16999 - 14000 + 1)) + 14000;
                await sentMessage.edit(`Pong! ${num}ms`);
            }, 8000);
        }, 15000);
    },
};