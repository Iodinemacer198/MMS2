module.exports = {
    name: 'ship',
    description: 'Ship two arguments',
    async execute(message, args) {
        function getRandomIntInclusive(min, max) {
            min = Math.ceil(0);
            max = Math.floor(100);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        const arg1 = args[0];
        const arg2 = args[1];
        let roll = getRandomIntInclusive(5, 10);
        await message.reply(`${arg1} and ${arg2} are ${roll}% compatible!`)
    }
}