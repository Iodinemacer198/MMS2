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
    //{ name: "food", price: 15 },
    //{ name: "tools", price: 15 },
    //{ name: "metal", price: 15 },
    { name: "~farm", price: 1500 },
    { name: "~workshop", price: 1500 },
    { name: "~mine", price: 1500 },
    { name: "elemental_fund", price: 25000 },
    { name: "gadolinium_crowbar", price: 30000 },
];

module.exports = {
    name: "upgrades-buy",
    description: "Purchase an item from the shop.",
    async execute(message, args) {
        const userId = message.author.id;
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);

        // Ensure user is registered
        if (!user) {
            return message.reply("You are not registered! Use `~register` to use the bot.");
        }

        // Ensure inventory is initialized for the user
        if (!user.inventory) {
            db.prepare("UPDATE users SET inventory = '' WHERE id = ?").run(userId);
            user.inventory = "";
        }

        // Validate input
        if (args.length < 1) {
            return message.reply("Usage: `~upgrades-buy {item}` (Check `~upgrades` for available items)");
        }

        const itemName = args[0].toLowerCase();
        const item = shop.find(i => i.name.toLowerCase() === itemName);

        if (!item) {
            return message.reply("That item doesn't exist! Use `~upgrades` to see available items.");
        }

        let amount = 1

        if (amount < 1) {
            return message.reply("You must buy at least one item.");
        }

        let inventory = user.inventory ? user.inventory.split(",") : [];

        // Ensure gold_foil can only be purchased once
        if (item.name === "gold_foil" && inventory.includes("gold_foil")) {
            return message.reply("You already own a **gold_foil**! It can only be purchased once.");
        }

        if (item.name === "gold_foil" && amount > 1) {
            return message.reply("You can only purchase **one** gold_foil.");
        }

        if (item.name === "elemental_fund" && inventory.includes("elemental_fund")) {
            return message.reply("You already own an **elemental_fund**! It can only be purchased once.");
        }

        if (item.name === "gadolinium_crowbar" && inventory.includes("gadolinium_crowbar")) {
            return message.reply("You already own a **gadolinium_crowbar**! It can only be purchased once.");
        }

        // Ensure only one of $farm, $workshop, or $mine can be owned
        const exclusiveItems = ["~farm", "~workshop", "~mine"];
        if (exclusiveItems.includes(item.name)) {
            if (inventory.some(i => exclusiveItems.includes(i))) {
                return message.reply(`You can only own **one** of **~farm, ~workshop, or ~mine**.`);
            }
            amount = 1; // Force amount to 1 to prevent multiple purchases
        }

        const totalPrice = item.price * amount;

        // Check if the user has enough money
        if (user.balance < totalPrice) {
            return message.reply(`You don't have enough money! **${item.name}** costs **$${totalPrice}**.`);
        }

        // Deduct the price from the user's balance
        const newBalance = user.balance - totalPrice;

        // Update inventory
        for (let i = 0; i < amount; i++) {
            inventory.push(item.name);
        }
        const updatedInventory = inventory.filter(Boolean).join(","); // Ensure no empty values

        db.prepare("UPDATE users SET balance = ?, inventory = ? WHERE id = ?")
          .run(newBalance, updatedInventory, userId);

        message.reply(`You purchased **${item.name}** for **$${totalPrice}**! Your new balance is **$${newBalance}**.`);
    },
};