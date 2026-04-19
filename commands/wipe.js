const Database = require("better-sqlite3");

// Open the database
const db = new Database("users.db");

module.exports = {
    name: "wipe",
    description: "Wipes your monetary balance to $0.",
    async execute(message, args) {
        const targetUser = args[0]
        if (message.author.id != '1140696859107659937') {
            return message.reply('You do not have permission to use this command!')
        }
        const userId = message.author.id;
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(targetUser);

        // Ensure user is registered
        if (!user) {
            return message.reply("This user is not registered! Use `$register` to use the bot.");
        }

        // Set balance to zero
        db.prepare("UPDATE users SET balance = 0 WHERE id = ?").run(targetUser);
        //db.prepare("UPDATE users SET inventory = 0 WHERE id = ?").run(targetUser);

        return message.reply("This user's balance has been wiped to **$0**.");
    },
};
