function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    name: 'delete',
    async execute(message) {
        if (message.author.id === '1140696859107659937') {
            await message.reply('Deleting files...')
            await sleep(3000);
            await message.channel.send('Process complete. Goodbye, world!')
            process.exit()
        } else {
            await message.reply('You do not have permission to use this command!')
        }
    }
}