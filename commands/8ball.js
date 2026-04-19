module.exports = {
    name: '8ball',
    description: 'Roll a magic 8-ball',
    async execute(message) {
        function sleep(ms) {
            return new Promise(resolve => {
              let timeoutId = setTimeout(() => {
                clearTimeout(timeoutId);
                resolve();
              }, ms);
            });
        }
        const ball = [ "It is certain.", 
            "It is decidedly so.",
            "Without a doubt.",
            "Yes, definitely.",
            "You may rely on it.",
            "As I see it, yes.",
            "Most likely.",
            "Outlook good.",
            "Yes.",
            "Signs point to yes.",
            "Reply hazy, try again.",
            "Ask again later.",
            "Better not tell you now.",
            "Cannot predict now.",
            "Concentrate and ask again.",
            "Don't count on it.",
            "My reply is no.",
            "My sources say no.",
            "Outlook not so good.",
            "Very doubtful."
        ]
        const ballRoll = Math.floor(Math.random() * ball.length);
        const ballResult = ball[ballRoll];
        const msg1 = await message.reply('Shaking...');
        await sleep(1000);
        await msg1.edit(`${ballResult}`);
    }
}