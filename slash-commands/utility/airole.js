const { SlashCommandBuilder, Events } = require('discord.js');
const clientService = require('../../client');
const { OpenAI } = require("openai");
require('dotenv').config();

const conversationHistory = {}; // Stores conversation history per role
const messageRoleMap = {}; // Stores role per message ID

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ai')
        .setDescription("Ask AI questions!")
        .addStringOption(option =>
            option.setName('question')
                .setDescription('What question should be asked')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('role')
                .setDescription('What role the AI should play')
                .setRequired(false))
        .setIntegrationTypes(0, 1)
        .setContexts(0, 1, 2),

    async execute(interaction) {
        await interaction.deferReply(); // Prevents timeout

        const role = interaction.options.getString('role') || 'a friendly AI assistant'; // Now required
        const question = interaction.options.getString('question');

        try {
            const openai = new OpenAI({
                baseURL: "https://openrouter.ai/api/v1",
                apiKey: process.env.OPENROUTER_API_KEY,
            });

            // Initialize conversation history for this role
            if (!conversationHistory[role]) {
                conversationHistory[role] = [
                    { role: "system", content: `Act like ${role}.` }
                ];
            }

            // Add user's question to history for this role
            conversationHistory[role].push({ role: "user", content: question });

            // Get AI response
            const completion = await openai.chat.completions.create({
                model: process.env.AIMODEL,
                messages: conversationHistory[role],
            });

            const responseMessage = completion.choices[0].message.content;

            // Save AI response to history for this role
            conversationHistory[role].push({ role: "assistant", content: responseMessage });

            // Split long messages and send
            const chunks = splitMessage(responseMessage);
            const sentMessage = await interaction.editReply(chunks[0]);

            for (let i = 1; i < chunks.length; i++) {
                await interaction.followUp(chunks[i]);
            }

            // Store role for this message ID
            messageRoleMap[sentMessage.id] = role;

        } catch (error) {
            console.error("Error with OpenAI API:", error);
            await interaction.editReply("There was an error. Please try again later.");
        }
    }
};

// Listen for message replies to continue the conversation in the same role
const client = clientService.getClient();
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot || !message.reference) return; // Ignore bot messages & non-replies

    try {
        const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
        if (!repliedMessage.author.bot) return; // Ensure user is replying to the bot

        // Get the role used for the replied message
        const role = messageRoleMap[repliedMessage.id];
        if (!role) return; // Ignore if role isn't tracked

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
        });

        // Ensure conversation history exists for this role
        if (!conversationHistory[role]) return;

        // Add user reply to correct conversation history
        conversationHistory[role].push({ role: "user", content: message.content });

        // Get AI response
        const completion = await openai.chat.completions.create({
            model: process.env.AIMODEL,
            messages: conversationHistory[role],
        });

        const responseMessage = completion.choices[0].message.content;

        // Add AI response to correct history
        conversationHistory[role].push({ role: "assistant", content: responseMessage });

        // Split long messages and send
        const chunks = splitMessage(responseMessage);
        const sentMessage = await message.reply(chunks[0]);

        for (let i = 1; i < chunks.length; i++) {
            await message.channel.send(chunks[i]);
        }

        // Store role for the new bot response
        messageRoleMap[sentMessage.id] = role;

    } catch (error) {
        console.error("Error in conversation reply:", error);
        console.log(".")
    }
});

// Function to split long messages into 2000-character chunks
function splitMessage(message, maxLength = 2000) {
    if (message.length <= maxLength) {
        return [message];
    }

    const paragraphs = message.split('\n');
    const chunks = [];
    let currentChunk = "";

    for (const paragraph of paragraphs) {
        if (currentChunk.length + paragraph.length + 1 > maxLength) {
            chunks.push(currentChunk);
            currentChunk = paragraph;
        } else {
            currentChunk += (currentChunk ? "\n" : "") + paragraph;
        }
    }

    if (currentChunk) {
        chunks.push(currentChunk);
    }

    return chunks;
}
