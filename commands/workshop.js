const Database = require("better-sqlite3");

// Open the database
const db = new Database("users.db");

// Ensure cooldown table exists
db.prepare("CREATE TABLE IF NOT EXISTS cooldowns (id TEXT PRIMARY KEY, farm_start INTEGER)").run();

module.exports = {
    name: "workshop",
    description: "Start farming to produce food over 2 hours.",
    async execute(message, args) {
        const userId = message.author.id;
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);

        if (!user) {
            return message.reply("You are not registered! Use `~register` to use the economics feature.");
        }

        // Check cooldowns
        let cooldown = db.prepare("SELECT * FROM cooldowns WHERE id = ?").get(userId);
        const currentTime = Date.now();
        const farmDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

        if (args[0] === "collect") {
            if (!cooldown || !cooldown.farm_start) {
                return message.reply("You haven't started tooling! Use `~workshop` to begin.");
            }

            if (currentTime < cooldown.farm_start + farmDuration) {
                const timeLeft = ((cooldown.farm_start + farmDuration - currentTime) / 60000).toFixed(1);
                return message.reply(`Your workshop is still running! You can collect in **${timeLeft} minutes**.`);
            }

            // Grant 200 food and remove cooldown
            let inventory = user.inventory ? user.inventory.split(",") : [];
            for (let i = 0; i < 100; i++) inventory.push("tools");
            db.prepare("UPDATE users SET inventory = ? WHERE id = ?").run(inventory.join(","), userId);
            db.prepare("DELETE FROM cooldowns WHERE id = ?").run(userId);

            return message.reply("You have successfully collected **100 tools** from your workshop! ✅");
        }

        // Check if user has the $farm item
        let inventory = user.inventory ? user.inventory.split(",") : [];
        if (!inventory.includes("~workshop")) {
            return message.reply("You need a **~workshop** to start tooling! Purchase one from the upgrades market.");
        }

        // Check if farming is already running
        if (cooldown && cooldown.farm_start && currentTime < cooldown.farm_start + farmDuration) {
            const timeLeft = ((cooldown.farm_start + farmDuration - currentTime) / 60000).toFixed(1);
            return message.reply(`You are already tooling! You can collect tools in **${timeLeft} minutes**.`);
        }

        // Check if user has the required materials
        const requiredItems = { food: 5, metal: 5 };

        for (const [item, amount] of Object.entries(requiredItems)) {
            const itemCount = inventory.filter(i => i === item).length;
            if (itemCount < amount) {
                return message.reply(`You need at least **${amount} ${item}** to start tooling!`);
            }
        }

        // Remove required materials from inventory
        for (const [item, amount] of Object.entries(requiredItems)) {
            let count = 0;
            inventory = inventory.filter(i => {
                if (i === item && count < amount) {
                    count++;
                    return false;
                }
                return true;
            });
        }

        // Update inventory
        db.prepare("UPDATE users SET inventory = ? WHERE id = ?").run(inventory.join(","), userId);

        // Start farming
        db.prepare("INSERT INTO cooldowns (id, farm_start) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET farm_start = ?")
            .run(userId, currentTime, currentTime);

        return message.reply("You have started tooling! In **2 hours**, use `~workshop collect` to gather **100 tools**.");
    }
};
