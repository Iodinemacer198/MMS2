const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const Database = require("better-sqlite3");
const { get } = require("systeminformation");

const db = new Database("market_prices2.db");
const userdb = new Database("investments.db")
const seconddb = new Database("users.db")

const ASSETS = [
    { name: "CREDIT", label: "Credit", color: 0x5abeb9 },
    { name: "BITCOIN", label: "Bitcoin", color: 0xf2a900 },
    { name: "ETHEREUM", label: "Ethereum", color: 0x627eea },
    { name: "DOW", label: "Dow Jones Industrial Average", color: 0xe80033 },
    { name: "NASDAQ", label: "Nasdaq Composite", color: 0x0092bc },
    { name: "PLTR", label: "Palantir", color: 0x337374 },
    { name: "LMT", label: "Lockheed Martin", color: 0x003478 }
];

userdb.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    crd_shares INTEGER,
    btc_shares INTEGER,
    eth_shares INTEGER,
    nas_shares INTEGER,
    dow_shares INTEGER,
    pltr_shares INTEGER,
    lmt_shares INTEGER,
    crd_buy_price REAL NOT NULL,
    btc_buy_price REAL NOT NULL,
    eth_buy_price REAL NOT NULL,
    nas_buy_price REAL NOT NULL,
    dow_buy_price REAL NOT NULL,
    pltr_buy_price REAL NOT NULL,
    lmt_buy_price REAL NOT NULL
  )
`).run();

try {
    userdb.prepare("ALTER TABLE users ADD COLUMN pltr_shares INTEGER DEFAULT 0").run();
} catch (err) {
    // Column likely already exists, ignore the error
}

try {
    userdb.prepare("ALTER TABLE users ADD COLUMN lmt_shares INTEGER DEFAULT 0").run();
} catch (err) {
    // Column likely already exists, ignore the error
}

try {
    userdb.prepare("ALTER TABLE users ADD COLUMN pltr_buy_price REAL NOT NULL DEFAULT 0").run();
} catch (err) {
    // Column likely already exists, ignore the error
}

try {
    userdb.prepare("ALTER TABLE users ADD COLUMN lmt_buy_price REAL NOT NULL DEFAULT 0").run();
} catch (err) {
    // Column likely already exists, ignore the error
}

function buildChartConfig(asset, days) {
    const INTERVAL_MS = 3 * 60 * 60 * 1000; // 6 hours
    const since = Date.now() - days * 24 * 60 * 60 * 1000;

    // 1️⃣ Fetch raw prices
    const rows = db.prepare(`
        SELECT price, timestamp
        FROM prices
        WHERE asset = ?
          AND timestamp >= ?
        ORDER BY timestamp ASC
    `).all(asset, since);

    // 2️⃣ Bucket prices into 6-hour intervals
    const buckets = new Map();

    for (const row of rows) {
        const intervalStart =
            Math.floor(row.timestamp / INTERVAL_MS) * INTERVAL_MS;

        if (!buckets.has(intervalStart)) {
            buckets.set(intervalStart, []);
        }

        buckets.get(intervalStart).push(row.price);
    }

    // 3️⃣ Build OHLC candles
    const candles = [];

    for (const [intervalStart, prices] of buckets.entries()) {
        if (!prices.length) continue;

        candles.push({
            x: intervalStart,          // ← interval start (date + time)
            o: prices[0],
            h: Math.max(...prices),
            l: Math.min(...prices),
            c: prices[prices.length - 1]
        });
    }

    // Ensure chronological order
    candles.sort((a, b) => a.x - b.x);

    // 4️⃣ Return full Chart.js candlestick config
    return {
        type: "candlestick",
        data: {
            datasets: [
                {
                    label: `${asset} Price`,
                    data: candles,
                    color: {
                        up: "#4caf50",
                        down: "#f44336",
                        unchanged: "#9e9e9e"
                    }
                }
            ]
        },
        options: {
            scales: {
                x: {
                    type: "time",
                    time: {
                        unit: "hour",
                        stepSize: 6,
                        displayFormats: {
                            hour: "MMM d, HH:mm"
                        }
                    },
                    title: {
                        display: true,
                        text: "Interval Start (UTC)"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Price"
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    };
}


function getCurrentPrice(asset) {
    return db.prepare(`
        SELECT price
        FROM prices
        WHERE asset = ?
        ORDER BY timestamp DESC
        LIMIT 1
    `).get(asset)?.price;
}

module.exports = {
    name: "invest",
    description: "Shows 14-day candlestick charts for Credit, Bitcoin, and Ethereum",

    async execute(message, args) {
        const subcommand = args[0];
        const userId = message.author.id;

        const userData = seconddb.prepare("SELECT * FROM users WHERE id = ?").get(userId);

        if (!userData) {
            return message.reply("You are not registered! Use `~register` to use the economics feature.");
        }

        if (!subcommand || subcommand === "view") {

            const embeds = [];

            const days = args[1]?? 1

            for (const asset of ASSETS) {
                const currentPrice = getCurrentPrice(asset.name);
                if (!currentPrice) continue;

                const chartConfig = buildChartConfig(asset.name, days);

                try {
                    const res = await axios.post(
                        "https://quickchart.io/chart/create",
                        {
                            chart: chartConfig,
                            format: "png",
                            version: "3"
                        }
                    );

                    const chartUrl = res.data?.url;
                    if (!chartUrl) continue;

                    const embed = new EmbedBuilder()
                        .setTitle(`${asset.label} Market Chart`)
                        .setDescription(`**Current Price:** $${currentPrice.toLocaleString()}`)
                        .setImage(chartUrl)
                        .setColor(asset.color);

                    embeds.push(embed);

                } catch (err) {
                    console.error(`Chart error for ${asset.name}:`, err.message);
                }
            }

            if (!embeds.length) {
                return message.channel.send("❌ No chart data available.");
            }

            await message.reply({ embeds });
        }
        if (subcommand === "portfolio") {
            const uI2 = userdb.prepare("SELECT * FROM users WHERE id = ?").get(userId);
            if (!uI2) {
                userdb.prepare("INSERT INTO users (id, crd_shares, btc_shares, eth_shares, nas_shares, dow_shares, pltr_shares, lmt_shares, crd_buy_price, btc_buy_price, eth_buy_price, nas_buy_price, dow_buy_price, pltr_buy_price, lmt_buy_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(userId, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
            }
            const uI = userdb.prepare("SELECT * FROM users WHERE id = ?").get(userId);
            const embed = new EmbedBuilder()
                .setTitle(`${message.author.username}'s Portfolio`)
                .addFields(
                    { name: "Credits", value: `# of shares: ${uI.crd_shares}\nBuy price: $${uI.crd_buy_price}\nCurrent estimated profit: $${(((getCurrentPrice('CREDIT'))*uI.crd_shares) - (uI.crd_buy_price * uI.crd_shares)).toFixed(2)}`, inline: true },
                    { name: "Bitcoin", value: `# of shares: ${uI.btc_shares}\nBuy price: $${uI.btc_buy_price}\nCurrent estimated profit: $${(((getCurrentPrice('BITCOIN'))*uI.btc_shares) - (uI.btc_buy_price * uI.btc_shares)).toFixed(2)}`, inline: false },
                    { name: "Ethereum", value: `# of shares: ${uI.eth_shares}\nBuy price: $${uI.eth_buy_price}\nCurrent estimated profit: $${(((getCurrentPrice('ETHEREUM'))*uI.eth_shares) - (uI.eth_buy_price * uI.eth_shares)).toFixed(2)}`, inline: false },
                    { name: "NASDAQ", value: `# of shares: ${uI.nas_shares}\nBuy price: $${uI.nas_buy_price}\nCurrent estimated profit: $${(((getCurrentPrice('NASDAQ'))*uI.nas_shares) - (uI.nas_buy_price * uI.nas_shares)).toFixed(2)}`, inline: false },
                    { name: "DOW", value: `# of shares: ${uI.dow_shares}\nBuy price: $${uI.dow_buy_price}\nCurrent estimated profit: $${(((getCurrentPrice('DOW'))*uI.dow_shares) - (uI.dow_buy_price * uI.dow_shares)).toFixed(2)}`, inline: false },
                    { name: "Palantir", value: `# of shares: ${uI.pltr_shares}\nBuy price: $${uI.pltr_buy_price}\nCurrent estimated profit: $${(((getCurrentPrice('PLTR'))*uI.pltr_shares) - (uI.pltr_buy_price * uI.pltr_shares)).toFixed(2)}`, inline: false },
                    { name: "Lockheed Martin", value: `# of shares: ${uI.lmt_shares}\nBuy price: $${uI.lmt_buy_price}\nCurrent estimated profit: $${(((getCurrentPrice('LMT'))*uI.lmt_shares) - (uI.lmt_buy_price * uI.lmt_shares)).toFixed(2)}`, inline: false },
                )
                .setColor('#85BB65');

            await message.reply({ embeds: [embed] });
        }
        if (subcommand === "buy") {
            const target = (args[1]).toLowerCase();
            const amount = parseInt(args[2]);

            if (!target || !amount || amount <= 0 || isNaN(amount)) {
                return message.reply("Usage: `~invest buy {credits, bitcoin, ethereum, nasdaq, dow, pltr, lmt} {quantity}`");
            }

            if (target !== 'credits' && target !== 'bitcoin' && target !== 'ethereum' && target !== 'nasdaq' && target !== 'dow' && target !== 'pltr' && target !== 'lmt') {
                return message.reply("Usage: `~invest buy **{credits, bitcoin, ethereum, nasdaq, dow, pltr, lmt}** {quantity}`");
            }

            const uI2 = userdb.prepare("SELECT * FROM users WHERE id = ?").get(userId);
            if (!uI2) {
                userdb.prepare("INSERT INTO users (id, crd_shares, btc_shares, eth_shares, nas_shares, dow_shares, pltr_shares, lmt_shares, crd_buy_price, btc_buy_price, eth_buy_price, nas_buy_price, dow_buy_price, pltr_buy_price, lmt_buy_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(userId, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
            }
            const uI = userdb.prepare("SELECT * FROM users WHERE id = ?").get(userId);

            if (target == 'credits') {
                const user = seconddb.prepare("SELECT * FROM users WHERE id = ?").get(userId);
                if (uI.crd_shares > 0) {
                    return message.reply('You must sell all your current shares of credits to buy additional ones.')
                }
                const newShares = (uI.crd_shares + amount)
                const price = getCurrentPrice('CREDIT')
                const price2 = price * amount
                if (user.balance < price2) {
                    return message.reply(`You do not have enough money to make this purchase. You have **$${user.balance}**, and your requested purchase requires **$${price2}**.`)
                }
                const newBalance = (user.balance - price2).toFixed(2)
                userdb.prepare("UPDATE users SET crd_shares = ? WHERE id = ?").run(newShares, userId)
                userdb.prepare("UPDATE users SET crd_buy_price = ? WHERE id = ?").run(price, userId)
                seconddb.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, userId);
                await message.reply(`Successfully bought **${amount}** shares of credits at **$${price}**, at a total cost of **$${price2}**. Your balance is now **$${newBalance}**.`)
            }
            if (target == 'bitcoin') {
                const user = seconddb.prepare("SELECT * FROM users WHERE id = ?").get(userId);
                if (uI.btc_shares > 0) {
                    return message.reply('You must sell all your current shares of bitcoin to buy additional ones.')
                }
                const newShares = (uI.btc_shares + amount)
                const price = getCurrentPrice('BITCOIN')
                const price2 = price * amount
                if (user.balance < price2) {
                    return message.reply(`You do not have enough money to make this purchase. You have **$${user.balance}**, and your requested purchase requires **$${price2}**.`)
                }
                const newBalance = (user.balance - price2).toFixed(2)
                userdb.prepare("UPDATE users SET btc_shares = ? WHERE id = ?").run(newShares, userId)
                userdb.prepare("UPDATE users SET btc_buy_price = ? WHERE id = ?").run(price, userId)
                seconddb.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, userId);
                await message.reply(`Successfully bought **${amount}** shares of bitcoin at **$${price}**, at a total cost of **$${price2}**. Your balance is now **$${newBalance}**.`)
            }
            if (target == 'ethereum') {
                const user = seconddb.prepare("SELECT * FROM users WHERE id = ?").get(userId);
                if (uI.eth_shares > 0) {
                    return message.reply('You must sell all your current shares of ethereum to buy additional ones.')
                }
                const newShares = (uI.eth_shares + amount)
                const price = getCurrentPrice('ETHEREUM')
                const price2 = price * amount
                if (user.balance < price2) {
                    return message.reply(`You do not have enough money to make this purchase. You have **$${user.balance}**, and your requested purchase requires **$${price2}**.`)
                }
                const newBalance = (user.balance - price2).toFixed(2)
                userdb.prepare("UPDATE users SET eth_shares = ? WHERE id = ?").run(newShares, userId)
                userdb.prepare("UPDATE users SET eth_buy_price = ? WHERE id = ?").run(price, userId)
                seconddb.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, userId);
                await message.reply(`Successfully bought **${amount}** shares of ethereum at **$${price}**, at a total cost of **$${price2}**. Your balance is now **$${newBalance}**.`)
            }
            if (target == 'nasdaq') {
                const user = seconddb.prepare("SELECT * FROM users WHERE id = ?").get(userId);
                if (uI.nas_shares > 0) {
                    return message.reply('You must sell all your current shares of NASDAQ to buy additional ones.')
                }
                const newShares = (uI.nas_shares + amount)
                const price = getCurrentPrice('NASDAQ')
                const price2 = price * amount
                if (user.balance < price2) {
                    return message.reply(`You do not have enough money to make this purchase. You have **$${user.balance}**, and your requested purchase requires **$${price2}**.`)
                }
                const newBalance = (user.balance - price2).toFixed(2)
                userdb.prepare("UPDATE users SET nas_shares = ? WHERE id = ?").run(newShares, userId)
                userdb.prepare("UPDATE users SET nas_buy_price = ? WHERE id = ?").run(price, userId)
                seconddb.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, userId);
                await message.reply(`Successfully bought **${amount}** shares of NASDAQ at **$${price}**, at a total cost of **$${price2}**. Your balance is now **$${newBalance}**.`)
            }
            if (target == 'dow') {
                const user = seconddb.prepare("SELECT * FROM users WHERE id = ?").get(userId);
                if (uI.dow_shares > 0) {
                    return message.reply('You must sell all your current shares of DOW to buy additional ones.')
                }
                const newShares = (uI.nas_shares + amount)
                const price = getCurrentPrice('DOW')
                const price2 = price * amount
                if (user.balance < price2) {
                    return message.reply(`You do not have enough money to make this purchase. You have **$${user.balance}**, and your requested purchase requires **$${price2}**.`)
                }
                const newBalance = (user.balance - price2).toFixed(2)
                userdb.prepare("UPDATE users SET dow_shares = ? WHERE id = ?").run(newShares, userId)
                userdb.prepare("UPDATE users SET dow_buy_price = ? WHERE id = ?").run(price, userId)
                seconddb.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, userId);
                await message.reply(`Successfully bought **${amount}** shares of DOW at **$${price}**, at a total cost of **$${price2}**. Your balance is now **$${newBalance}**.`)
            }
            if (target == 'pltr') {
                const user = seconddb.prepare("SELECT * FROM users WHERE id = ?").get(userId);
                if (uI.pltr_shares > 0) {
                    return message.reply('You must sell all your current shares of PLTR to buy additional ones.')
                }
                const newShares = (uI.pltr_shares + amount)
                const price = getCurrentPrice('PLTR')
                const price2 = price * amount
                if (user.balance < price2) {
                    return message.reply(`You do not have enough money to make this purchase. You have **$${user.balance}**, and your requested purchase requires **$${price2}**.`)
                }
                const newBalance = (user.balance - price2).toFixed(2)
                userdb.prepare("UPDATE users SET pltr_shares = ? WHERE id = ?").run(newShares, userId)
                userdb.prepare("UPDATE users SET pltr_buy_price = ? WHERE id = ?").run(price, userId)
                seconddb.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, userId);
                await message.reply(`Successfully bought **${amount}** shares of PLTR at **$${price}**, at a total cost of **$${price2}**. Your balance is now **$${newBalance}**.`)
            }
            if (target == 'lmt') {
                const user = seconddb.prepare("SELECT * FROM users WHERE id = ?").get(userId);
                if (uI.lmt_shares > 0) {
                    return message.reply('You must sell all your current shares of LMT to buy additional ones.')
                }
                const newShares = (uI.lmt_shares + amount)
                const price = getCurrentPrice('LMT')
                const price2 = price * amount
                if (user.balance < price2) {
                    return message.reply(`You do not have enough money to make this purchase. You have **$${user.balance}**, and your requested purchase requires **$${price2}**.`)
                }
                const newBalance = (user.balance - price2).toFixed(2)
                userdb.prepare("UPDATE users SET lmt_shares = ? WHERE id = ?").run(newShares, userId)
                userdb.prepare("UPDATE users SET lmt_buy_price = ? WHERE id = ?").run(price, userId)
                seconddb.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, userId);
                await message.reply(`Successfully bought **${amount}** shares of LMT at **$${price}**, at a total cost of **$${price2}**. Your balance is now **$${newBalance}**.`)
            }
        }
        if (subcommand === "sell") {
            const target = (args[1]).toLowerCase();
            const amount = parseInt(args[2]);

            if (!target || !amount || amount <= 0 || isNaN(amount)) {
                return message.reply("Usage: `~invest sell {credits, bitcoin, ethereum, nasdaq, dow, pltr, lmt} {quantity}`");
            }

            if (target !== 'credits' && target !== 'bitcoin' && target !== 'ethereum' && target !== 'nasdaq' && target !== 'dow' && target !== 'pltr' && target !== 'lmt') {
                return message.reply("Usage: `~invest sell **{credits, bitcoin, ethereum, nasdaq, dow, pltr, lmt}** {quantity}`");
            }

            const uI = userdb.prepare("SELECT * FROM users WHERE id = ?").get(userId);
            const user = seconddb.prepare("SELECT * FROM users WHERE id = ?").get(userId);

            if (!uI || !user) {
                return message.reply("You do not have an investment account yet. Please run **~invest portfolio** and try again.");
            }

            // ---- CREDITS ----
            if (target === 'credits') {
                if (uI.crd_shares < amount) {
                    return message.reply(`You do not own enough credits shares to sell. You currently have **${uI.crd_shares}**.`);
                }

                const price = getCurrentPrice('CREDIT');
                const total = price * amount;

                const newShares = uI.crd_shares - amount;
                const newBalance = (user.balance + total).toFixed(2);

                userdb.prepare("UPDATE users SET crd_shares = ?, crd_buy_price = ? WHERE id = ?")
                    .run(newShares, newShares === 0 ? 0 : uI.crd_buy_price, userId);

                seconddb.prepare("UPDATE users SET balance = ? WHERE id = ?")
                    .run(newBalance, userId);

                return message.reply(
                    `Successfully sold **${amount}** shares of credits at **$${price}**, for a total of **$${total}**. Your balance is now **$${(newBalance)}**.`
                );
            }

            // ---- BITCOIN ----
            if (target === 'bitcoin') {
                if (uI.btc_shares < amount) {
                    return message.reply(`You do not own enough bitcoin shares to sell. You currently have **${uI.btc_shares}**.`);
                }

                const price = getCurrentPrice('BITCOIN');
                const total = price * amount;

                const newShares = uI.btc_shares - amount;
                const newBalance = (user.balance + total).toFixed(2);

                userdb.prepare("UPDATE users SET btc_shares = ?, btc_buy_price = ? WHERE id = ?")
                    .run(newShares, newShares === 0 ? 0 : uI.btc_buy_price, userId);

                seconddb.prepare("UPDATE users SET balance = ? WHERE id = ?")
                    .run(newBalance, userId);

                return message.reply(
                    `Successfully sold **${amount}** shares of bitcoin at **$${price}**, for a total of **$${total}**. Your balance is now **$${(newBalance)}**.`
                );
            }

            // ---- ETHEREUM ----
            if (target === 'ethereum') {
                if (uI.eth_shares < amount) {
                    return message.reply(`You do not own enough ethereum shares to sell. You currently have **${uI.eth_shares}**.`);
                }

                const price = getCurrentPrice('ETHEREUM');
                const total = price * amount;

                const newShares = uI.eth_shares - amount;
                const newBalance = (user.balance + total).toFixed(2);

                userdb.prepare("UPDATE users SET eth_shares = ?, eth_buy_price = ? WHERE id = ?")
                    .run(newShares, newShares === 0 ? 0 : uI.eth_buy_price, userId);

                seconddb.prepare("UPDATE users SET balance = ? WHERE id = ?")
                    .run(newBalance, userId);

                return message.reply(
                    `Successfully sold **${amount}** shares of ethereum at **$${price}**, for a total of **$${total}**. Your balance is now **$${(newBalance)}**.`
                );
            }

            // ---- NASDAQ ----
            if (target === 'nasdaq') {
                if (uI.nas_shares < amount) {
                    return message.reply(`You do not own enough NASDAQ shares to sell. You currently have **${uI.nas_shares}**.`);
                }

                const price = getCurrentPrice('NASDAQ');
                const total = price * amount;

                const newShares = uI.nas_shares - amount;
                const newBalance = (user.balance + total).toFixed(2);

                userdb.prepare("UPDATE users SET nas_shares = ?, nas_buy_price = ? WHERE id = ?")
                    .run(newShares, newShares === 0 ? 0 : uI.nas_buy_price, userId);

                seconddb.prepare("UPDATE users SET balance = ? WHERE id = ?")
                    .run(newBalance, userId);

                return message.reply(
                    `Successfully sold **${amount}** shares of NASDAQ at **$${price}**, for a total of **$${total}**. Your balance is now **$${(newBalance)}**.`
                );
            }

            // ---- DOW ----
            if (target === 'dow') {
                if (uI.nas_shares < amount) {
                    return message.reply(`You do not own enough DOW shares to sell. You currently have **${uI.dow_shares}**.`);
                }

                const price = getCurrentPrice('DOW');
                const total = price * amount;

                const newShares = uI.dow_shares - amount;
                const newBalance = (user.balance + total).toFixed(2);

                userdb.prepare("UPDATE users SET dow_shares = ?, dow_buy_price = ? WHERE id = ?")
                    .run(newShares, newShares === 0 ? 0 : uI.dow_buy_price, userId);

                seconddb.prepare("UPDATE users SET balance = ? WHERE id = ?")
                    .run(newBalance, userId);

                return message.reply(
                    `Successfully sold **${amount}** shares of DOW at **$${price}**, for a total of **$${total}**. Your balance is now **$${(newBalance)}**.`
                );
            }

            // ---- pltr ----
            if (target === 'pltr') {
                if (uI.pltr_shares < amount) {
                    return message.reply(`You do not own enough PLTR shares to sell. You currently have **${uI.dow_shares}**.`);
                }

                const price = getCurrentPrice('PLTR');
                const total = price * amount;

                const newShares = uI.pltr_shares - amount;
                const newBalance = (user.balance + total).toFixed(2);

                userdb.prepare("UPDATE users SET pltr_shares = ?, pltr_buy_price = ? WHERE id = ?")
                    .run(newShares, newShares === 0 ? 0 : uI.pltr_buy_price, userId);

                seconddb.prepare("UPDATE users SET balance = ? WHERE id = ?")
                    .run(newBalance, userId);

                return message.reply(
                    `Successfully sold **${amount}** shares of PLTR at **$${price}**, for a total of **$${total}**. Your balance is now **$${(newBalance)}**.`
                );
            }

            // ---- lmt ----
            if (target === 'lmt') {
                if (uI.lmt_shares < amount) {
                    return message.reply(`You do not own enough LMT shares to sell. You currently have **${uI.dow_shares}**.`);
                }

                const price = getCurrentPrice('LMT');
                const total = price * amount;

                const newShares = uI.lmt_shares - amount;
                const newBalance = (user.balance + total).toFixed(2);

                userdb.prepare("UPDATE users SET lmt_shares = ?, lmt_buy_price = ? WHERE id = ?")
                    .run(newShares, newShares === 0 ? 0 : uI.lmt_buy_price, userId);

                seconddb.prepare("UPDATE users SET balance = ? WHERE id = ?")
                    .run(newBalance, userId);

                return message.reply(
                    `Successfully sold **${amount}** shares of LMT at **$${price}**, for a total of **$${total}**. Your balance is now **$${(newBalance)}**.`
                );
            }
        }
    }
};
