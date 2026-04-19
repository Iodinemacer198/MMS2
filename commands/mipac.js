const Database = require("better-sqlite3");

const clientService = require('../client');

// Open the database
const db = new Database("users.db");

// Cooldowns Map
const cooldowns = new Map();

function getRandomNumberBetween(x, y) {
    return Math.floor(Math.random() * (y - x + 1)) + x;
}

db.prepare(`
  CREATE TABLE IF NOT EXISTS mipac (
    id TEXT PRIMARY KEY,
    total INTEGER
  )
`).run();

module.exports = {
    name: "mipacnolonger",
    description: "Plays a watered-down slots game with betting.",
    async execute(message, args) {
        const client = clientService.getClient();
        const userId = message.author.id;
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
        const username = await client.users.fetch(userId);

        const mipac2 = db.prepare("SELECT * FROM mipac WHERE id = ?").get(userId);
        if (!mipac2) {
            db.prepare("INSERT INTO crime (id, total) VALUES (?, ?)").run(userId, 0);
        }
        const mipac = db.prepare("SELECT * FROM mipac WHERE id = ?").get(userId);

        const betAmount = getRandomNumberBetween(1000, 5000)

        const added = user.balance + betAmount
        const newTotal = mipac.total + betAmount

        db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(added, userId);
        db.prepare("UPDATE mipac SET total = ? WHERE id = ?").run(newTotal, userId);

        await message.reply(`You collected **$${betAmount}** from MIPAC!`);

        const chan = client.channels.cache.get('1467354631754747984');
        await chan.send(`@here ${username} just recieved **$${betAmount}** from MIPAC! They have now collected a total of **$${newTotal}**`)
    },
};
