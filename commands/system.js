const { EmbedBuilder } = require('discord.js');
const { makeParseableResponseFormat } = require('openai/lib/parser.mjs');
const si = require('systeminformation');

module.exports = {
    name: 'system',
    description: "Shows the bot's commands",
    async execute(message) {
        const memoryData = await si.mem();
    
        const totalMem = (memoryData.total / (1024 ** 3)).toFixed(2);
        const freeMem = (memoryData.free / (1024 ** 3)).toFixed(2);
        const usedMem = (memoryData.used / (1024 ** 3)).toFixed(2);
    
        const cpuLoad = await si.currentLoad();
        const cpuTemp = await si.cpuTemperature();

        const temp = cpuTemp.main
  
        const overallLoad = cpuLoad.currentLoad.toFixed(2);
        const coresLoad = cpuLoad.cpus.map((core, index) => `Core ${index + 1}: ${core.load.toFixed(2)}%`).join('\n');

        const osInfo = await si.osInfo();

        const mo = await si.diskLayout();

        const size = (mo.size)/1e-9

        const system = new EmbedBuilder()
            .setColor('#B300FF')
            .setTitle('System Information')
            .setThumbnail('https://media.discordapp.net/attachments/1229940782669107271/1285252534729969695/raspberry-pi-removebg-preview.png?ex=66e99833&is=66e846b3&hm=bfae8ff9b2ffcb81f06ca32c867f28b38d70810708b2fe3871474631ca2244a9&=&format=webp&quality=lossless&width=518&height=662')
            .setDescription(`The bot is currently being hosted on a Raspberry Pi 4b
              
__**Memory Information:**__
Used memory: **${usedMem} GB**
Free memory: **${freeMem} GB**
Total memory: **${totalMem} GB**
                    
__**CPU Information:**__
Current temperature: **${temp}℃**
Overall load: **${overallLoad}%**

__**Other**__
OS: **${osInfo.distro} ${osInfo.release} (Raspberry Pi OS 12 x64)**
Model: **Raspberry Pi 4 Model B Rev 1.2**`)
        
        message.reply({embeds:[system]})
    }
}