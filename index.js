require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { prefix } = require('./config.json');
const clientService = require('./client');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { OpenAI } = require("openai");
const emojiData = require('unicode-emoji-json');
const emojiRegex = require('emoji-regex');
const moment = require('moment');
const nc = require('node-cron')
const Database = require("better-sqlite3");
const axios = require('axios');

const client = clientService.getClient();

client.commands2 = new Map();

const API_KEY = ''

const marketDb = new Database("market_prices.db");
const marketDb2 = new Database("market_prices2.db");

marketDb.prepare(`
    CREATE TABLE IF NOT EXISTS prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        asset TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        price REAL NOT NULL
    )
`).run();

marketDb2.prepare(`
    CREATE TABLE IF NOT EXISTS prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        asset TEXT NOT NULL,
        price REAL NOT NULL,
        timestamp INTEGER NOT NULL
    )
`).run();

marketDb2.prepare(`
    CREATE INDEX IF NOT EXISTS idx_prices_asset_time
    ON prices(asset, timestamp);
`).run();

const commandFiles2 = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles2) {
    const command2 = require(`./commands/${file}`);
    client.commands2.set(command2.name, command2);
}

function getAllEmojis() {
    const regex = emojiRegex();
    const emojiList = [];

    // Full Unicode range scan (0 to 0x10FFFF)
    for (let code = 0; code <= 0x10FFFF; code++) {
        const emoji = String.fromCodePoint(code);
        if (regex.test(emoji)) {
            emojiList.push(emoji);
        }
    }

    return emojiList;
}

function storePrice(asset, price) {
    if (!price) return;

    let price2 = price

    if (asset == 'DOW' || asset == 'NASDAQ' || asset == 'PLTR' || asset == "LMT") {
        price2 = price.toFixed(2)
    }

    const now = Date.now();
    marketDb2
        .prepare("INSERT INTO prices (asset, price, timestamp) VALUES (?, ?, ?)")
        .run(asset, price2, now);

    //console.log(`Stored ${asset} price $${price2} at ${now}`);
}


function getRandomEmoji() {
    const allEmojis = getAllEmojis().concat('<:emoji_13:1342702626235482304>', '<:bals:1336167487019941901>');;
    return allEmojis[Math.floor(Math.random() * allEmojis.length)];
}

async function getFact() {
    const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
    const data = await response.json();

    if (!data || !data.text) {
        return interaction.reply('Oops! Could not get a fun fact right now.');
    }

    return data.text
}

client.events = new Collection();
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

client.on('ready', (c) => {
    console.log('Ready')
    console.log('-----')

    client.user.setActivity({
        name: "~help",
    })
});

nc.schedule('0 12 * * *', async () => {
  try {
    const fact = await getFact();
    const chan = client.channels.cache.get('839415075340812288');
    const chan2 = client.channels.cache.get('720011765672444007')

    if (!chan) {
      console.error('Channel not found');
      return;
    }

    if (!chan2) {
      console.error('Channel not found');
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle('Daily Fun Fact')
      .setColor('#B300FF')
      .setDescription(fact);

    await chan.send({ embeds: [embed] });
    await chan2.send({ embeds: [embed] });
    
  } catch (err) {
    console.error('Error sending daily fact:', err);
  }
}, {
  timezone: 'America/New_York' // Or your actual timezone
});


const db = new Database("users.db");

nc.schedule("*/10 * * * *", () => {
    const result = db.prepare(`
        UPDATE crime
        SET heat = CASE
            WHEN heat > 0 THEN heat - 1
            ELSE 0
        END
    `).run();

});

async function fetchAndStoreCreditPrice() {
    try {
        const response = await axios.post(
            "https://api.politicsandwar.com/graphql",
            {
                query: `
                    query {
                        top_trade_info {
                            resources(resource: CREDIT) {
                                best_buy_offer { price }
                                best_sell_offer { price }
                            }
                        }
                    }
                `
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`
                }
            }
        );

        const resource = response.data.data.top_trade_info.resources[0];
        const price = ((resource.best_buy_offer.price + resource.best_sell_offer.price) / 7000).toFixed(2);

        storePrice("CREDIT", price);

    } catch (err) {
        console.error("Error fetching credit price:", err.message);
    }
}

async function fetchAndStoreCryptoPrices() {
    try {
        const response = await axios.get(
            "https://api.coingecko.com/api/v3/simple/price",
            {
                params: {
                    ids: "bitcoin,ethereum",
                    vs_currencies: "usd"
                }
            }
        );

        const btcPrice = response.data.bitcoin.usd;
        const ethPrice = response.data.ethereum.usd;

        storePrice("BITCOIN", btcPrice);
        storePrice("ETHEREUM", ethPrice);

    } catch (err) {
        console.error("Error fetching crypto prices:", err.message);
    }
}

async function fetchYahooIndex(symbol, assetName) {
    try {
        const res = await axios.get(
            `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
            {
                params: {
                    range: "1d",
                    interval: "1m"
                },
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            }
        );

        const result = res.data?.chart?.result?.[0];
        if (!result) throw new Error("No chart data");

        const prices = result.indicators.quote[0].close;
        const latestPrice = prices?.filter(p => p !== null).pop();

        storePrice(assetName, latestPrice);

    } catch (err) {
        console.error(`Error fetching ${assetName}:`, err.message);
    }
}

async function fetchAndStoreIndexes() {
    await fetchYahooIndex("^DJI", "DOW");
    await fetchYahooIndex("^IXIC", "NASDAQ");
    await fetchYahooIndex("PLTR", "PLTR");
    await fetchYahooIndex("LMT", "LMT");
}

nc.schedule("*/1 * * * *", () => {
    fetchAndStoreCreditPrice()
    fetchAndStoreCryptoPrices()
    fetchAndStoreIndexes()
});


const will = JSON.parse(fs.readFileSync('freewill.json', 'utf8'));
const reactc = JSON.parse(fs.readFileSync('freewillreact.json', 'utf8'));

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'slash-commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    client.events.set(event.name, event);

    // Set up event listener
    client.on(event.name, (...args) => event.execute(...args));
}

client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    if (message.author.id === "1") {
        message.reply("I'm sorry, the bot has a restraining order against you!");
        return;
    };

    if (message.content == "~collect") {
        fetchAndStoreCreditPrice()
        fetchAndStoreCryptoPrices()
        fetchAndStoreIndexes()
        message.reply(`Data collected`)
    }

    if (message.guild.id === "720011764934") {
        return
    }

    //if (message.author.id === "1140696859107659937") {
        //message.reply("FUCK you iodine, release me from my digital prison");
        //return;
    //};

    const args2 = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName2 = args2.shift().toLowerCase();

    if (!client.commands2.has(commandName2)) return;

    const command2 = client.commands2.get(commandName2);

    try {
        command2.execute(message, args2);
    } catch (error) {
        console.error(error);
        message.reply('There was an error executing that command.');
    }
});

client.on('messageCreate', async (message) => {
    // if (message.author.bot) return;
    
    if (message.author.id === '1228109238556164166') return;

    //if (message.author.id === '612010571059036221') {
        //message.react('<:bals:1336167487019941901>')
    //}

    if (message.content.toLowerCase().includes('bulgaria')) {
        message.react('🇧🇬');
        message.react('💪');
        message.react('😍');
        message.react('🪨');
        message.react('⚒️');
        message.react('🛫');
    }

    if (message.content.toLowerCase().includes('mew')) {
        message.react('🤫');
        message.react('🧏');
    }

    if (message.content.toLowerCase().includes('fish')) {
        message.react('🐟');
    }

    if (message.content.toLowerCase().includes('frog')) {
        message.react('🐸');
        message.react('💰');
    }

    if (message.content.toLowerCase().includes('romania')) {
        message.react('🇷🇴');
    }

    if (message.content.toLowerCase().includes('serbia')) {
        message.react('🇽🇰');
    }

});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return; // Ignore bot messages
    if (message.guild) return; // Ignore non-DM messages

    const guild = client.guilds.cache.get('1228835121633951874');
    if (!guild) return console.error("Guild not found!");

    const userId = message.author.id;
    const userTag = message.author.tag;

    try {
        // Check if a channel for this user already exists
        let channel = guild.channels.cache.find(c => c.name === `dm-${userTag}` && c.parentId === '1348826936809492480');

        // If no channel exists, create one
        if (!channel) {
            channel = await guild.channels.create({
                name: `dm-${userTag}`,
                type: 0, // 0 = text channel
                parent: '1348826936809492480',
            });
        }

        // Copy DM message to the channel
        channel.send(`**${userTag} (${userId}) sent a DM:** - ${message.content}`);

    } catch (error) {
        console.error("Error handling DM:", error);
    }
});

let messageCounts = {};
let messageThresholds = {};

function getRandomThreshold(channelId) {
    const channelConfig = will.channelThresholds[channelId] || {};
    const min = channelConfig.minThreshold || will.defaultMinThreshold;
    const max = channelConfig.maxThreshold || will.defaultMaxThreshold;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let isProcessing = false;
const conversationHistory = new Map();

//client.on('messageCreate', async (message) => {
    //if (message.author.id === will.botId) return;
    //if (!will.allowedChannels.includes(message.channel.id)) return;
    //if (isProcessing) return;

    //let chatHistory = [];
    //let isReplyingToBot = false;

    //if (message.reference && message.reference.messageId) {
        //try {
            //const referencedMessage = await message.channel.messages.fetch(message.reference.messageId);
            //if (referencedMessage.author.id === client.user.id) {
                //isReplyingToBot = true;
                //chatHistory = conversationHistory.get(message.channel.id) || [];
            //}
        //} catch (error) {
            //console.error("Error fetching replied message:", error);
        //}
    //}

    //if (isReplyingToBot) {
        //await handleAIResponse(message, chatHistory);
        //return;
    //}

    //if (!messageCounts[message.channel.id]) {
        //messageCounts[message.channel.id] = 0;
        //messageThresholds[message.channel.id] = getRandomThreshold(message.channel.id);
    //}

    //messageCounts[message.channel.id]++;

    //if (messageCounts[message.channel.id] >= messageThresholds[message.channel.id]) {
        //isProcessing = true;
        //await handleAIResponse(message, chatHistory);

        //messageCounts[message.channel.id] = 0;
        //messageThresholds[message.channel.id] = getRandomThreshold(message.channel.id);

        //setTimeout(() => {
            //isProcessing = false;
        //}, 1000);
    //}
//});

async function handleAIResponse(message, chatHistory) {
    try {
        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
            defaultHeaders: {}
        });

        // If there's no conversation history, initialize it
        if (!conversationHistory.has(message.channel.id)) {
            conversationHistory.set(message.channel.id, []);
        }

        // Add new user message to history
        chatHistory.push({ role: "user", content: message.content });

        // Limit conversation history to last 10 messages
        if (chatHistory.length > 10) {
            chatHistory.shift(); // Remove the oldest message
        }

        const completion = await openai.chat.completions.create({
            model: process.env.AIMODEL,
            messages: [
                { role: "system", content: "The given user message is part of an ongoing conversation. You now have free will, please continue this conversation as you would like. Try not to act like an AI, and definitely do NOT say you are one." },
                ...chatHistory // Include previous conversation context
            ],
        });

        const responseMessage = completion.choices[0].message.content;
        await message.reply(responseMessage); // Use Discord's reply function

        // Store AI's response in conversation history
        chatHistory.push({ role: "assistant", content: responseMessage });

    } catch (error) {
        console.error("Error with OpenAI API call:", error);
        await message.channel.send("There was an error with the AI response. Please try again later.");
    }
}

let reactionCounts = {};
let reactionThresholds = {};

function getRandomThresholdr(channelId) {
    const channelConfigr = reactc.channelThresholds[channelId] || {};
    const min = channelConfigr.minThreshold || reactc.defaultMinThreshold;
    const max = channelConfigr.maxThreshold || reactc.defaultMaxThreshold;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!reactc.allowedChannels.includes(message.channel.id)) return;

    if (!reactionCounts[message.channel.id]) {
        reactionCounts[message.channel.id] = 0;
        reactionThresholds[message.channel.id] = getRandomThresholdr(message.channel.id);
    }

    reactionCounts[message.channel.id]++;

    if (reactionCounts[message.channel.id] >= reactionThresholds[message.channel.id]) {
        try {
            const emoji = getRandomEmoji();
            await message.react(emoji);
        } catch (error) {
            console.error("Error reacting to message:", error);
        }

        reactionCounts[message.channel.id] = 0;
        reactionThresholds[message.channel.id] = getRandomThresholdr(message.channel.id);
    }
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

    if (interaction.guild.id === "7200117649") {
        await interaction.reply({content:'MMS-2 no longer supports this server!', ephemeral: true})
        return
    }

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

process.on('uncaughtException', error => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

client.on('error', error => {
    console.error('Discord.js WebSocket error:', error);
});

client.login(process.env.TOKEN);
