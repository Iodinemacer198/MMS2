const Database = require("better-sqlite3");

// Open the database
const db = new Database("users.db");

// Ensure the `inventory` column exists in the database
try {
    db.prepare("ALTER TABLE users ADD COLUMN inventory TEXT DEFAULT ''").run();
} catch (err) {
    // Column likely already exists, ignore the error
}

const shop = [
    { name: "gold_foil", price: 15000 },
    { name: "~farm", price: 1500 },
    { name: "~workshop", price: 1500 },
    { name: "~mine", price: 1500 },
];

module.exports = {
    name: "upgrades-destroy",
    description: "Destroy an item from your inventory.",
    async execute(message, args) {
        const userId = message.author.id;
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);

        // Ensure user is registered
        if (!user) {
            return message.reply("You are not registered! Use `~register` to use the bot.");
        }

        // Ensure inventory is initialized
        if (!user.inventory) {
            db.prepare("UPDATE users SET inventory = '' WHERE id = ?").run(userId);
            user.inventory = "";
        }

        // Validate input
        if (args.length < 1) {
            return message.reply("Usage: `~upgrades-destroy {item}` (Check `~upgrades` for available items)");
        }

        const itemName = args[0].toLowerCase();
        const item = shop.find(i => i.name.toLowerCase() === itemName);

        if (!item) {
            return message.reply("That item doesn't exist! Use `~upgrades` to see available items.");
        }

        let amount = 1;

        if (amount < 1) {
            return message.reply("You must destroy at least one item.");
        }

        let inventory = user.inventory.split(",").filter(Boolean);

        const ownedCount = inventory.filter(i => i === item.name).length;

        if (ownedCount < amount) {
            return message.reply(`You only own **${ownedCount} ${item.name}**.`);
        }

        // Remove the items
        let removed = 0;
        inventory = inventory.filter(i => {
            if (i === item.name && removed < amount) {
                removed++;
                return false;
            }
            return true;
        });

        const updatedInventory = inventory.join(",");

        db.prepare("UPDATE users SET inventory = ? WHERE id = ?")
          .run(updatedInventory, userId);

        message.reply(`You destroyed **${item.name}**.`);
    },
};
