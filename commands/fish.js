const { Client, GatewayIntentBits } = require('discord.js');
const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource, 
    NoSubscriberBehavior, 
    AudioPlayerStatus, 
    VoiceConnectionStatus
} = require('@discordjs/voice');
const path = require('path');

module.exports = {
    name: 'fish',
    description: 'Finds an active VC, joins, plays a sound, and leaves.',
    async execute(message, args) {
        const guild = message.guild;
        if (!guild) return message.reply('This command must be used in a server.');

        // Find an active voice channel
        const voiceChannel = guild.channels.cache.find(channel => 
            channel.type === 2 && channel.members.size > 0
        );

        if (!voiceChannel) return message.reply('No active voice channels found.');

        message.delete()

        // Join the voice channel
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        const resource = createAudioResource(path.join(__dirname, '../fish.mp3'));

        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
            connection.destroy();
        });

        player.on('error', error => {
            console.error(`Error: ${error.message}`);
            connection.destroy();
        });
    }
};
