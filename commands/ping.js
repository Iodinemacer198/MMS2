const clientService = require('../client');

module.exports = {
    name: 'ping',
    description: 'Checks the bot\'s latency.',
    async execute(message) {
      const startTime = Date.now();
      const client = clientService.getClient();
  
      try {
        const pong = await message.channel.send('Pinging...');
  
        const endTime = Date.now();
        const latency = endTime - startTime;
  
        await pong.edit(`Pong! ${latency}ms`);

      } catch (error) {
        console.error(error);
        message.channel.send('Error: Could not send ping message.');

        
      }
    },
  };