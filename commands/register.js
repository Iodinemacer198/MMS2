const Database = require("better-sqlite3");

// Open (or create) the database
const db = new Database("users.db");

// Ensure the table exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT,
    balance INTEGER,
    last_bailout INTEGER
  )
`).run();

module.exports = {
    name: "register",
    description: "Registers a user and gives them a starting balance of $100",
    execute(message, args) {
        const userId = message.author.id;
        const username = message.author.username;

        // Check if user is already registered
        const existingUser = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
        if (existingUser) {
            return message.reply("You are already registered!");
        }

        // Insert new user
        db.prepare("INSERT INTO users (id, username, balance) VALUES (?, ?, ?)").run(userId, username, 500);
        message.reply(`✅ **${username}**, you have been registered with a starting balance of **$500**!`);
    },
};
