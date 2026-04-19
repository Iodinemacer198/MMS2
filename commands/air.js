const { OpenAI } = require("openai");
require('dotenv').config();

module.exports = {
    name: 'airole',
    description: 'Asks an AI chatbot a prompt',
    async execute(message, args) {
        try {
            const openai = new OpenAI({
                baseURL: "https://openrouter.ai/api/v1",
                apiKey: process.env.OPENROUTER_API_KEY,
                defaultHeaders: {}
            });

            const role = args[0]

            async function main() {
                try {
                    const completion = await openai.chat.completions.create({
                        model: process.env.AIMODEL,
                        messages: [
                            { role: "system", content: `act like a ${role}`},
                            { role: "user", content: `${args}` }
                        ],
                    });

                    const responseMessage = completion.choices[0].message.content;

                    const chunks = splitMessage(responseMessage);

                    // Send the first chunk as a reply
                    if (chunks.length > 0) {
                        await message.reply(chunks[0]);
                    }

                    // Send the remaining chunks as regular messages
                    for (let i = 1; i < chunks.length; i++) {
                        await message.channel.send(chunks[i]);
                    }
                } catch (error) {
                    console.error("Error with OpenAI API call:", error);
                    await message.channel.send("There was an error with the AI response. Please try again later.");
                }
            }

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

            await main();
        } catch (error) {
            console.error("Error executing command:", error);
            await message.channel.send("There was an error executing the command. Please try again later.");
        }
    }
};
