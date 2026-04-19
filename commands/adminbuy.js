const Database = require("better-sqlite3");

const db = new Database("users.db");

try {
    db.prepare("ALTER TABLE users ADD COLUMN inventory TEXT DEFAULT ''").run();
} catch (err) {
    // fuh nah
}

const shop = [
    { name: "gold_foil", price: 1 },
    { name: "food", price: 1 },
    { name: "tools", price: 1 },
    { name: "metal", price: 1 },
    { name: "~farm", price: 1 },
    { name: "~workshop", price: 1 },
    { name: "~mine", price: 1 },
    { name: "explosive", price: 1 },
    { name: "electronic", price: 1 },
];

module.exports = {
    name: "adminbuy",
    description: "Purchase an item from the shop.",
    async execute(message, args) {
        const userId = message.author.id;
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
        
        if (message.author.id != '1140696859107659937') {
            return message.reply('You do not have permission to use this command!')
        }

        if (!user) {
            return message.reply("You are not registered! Use `~register` to use the bot.");
        }

        if (!user.inventory) {
            db.prepare("UPDATE users SET inventory = '' WHERE id = ?").run(userId);
            user.inventory = "";
        }

        if (args.length < 1) {
            return message.reply("Usage: `$buy {item} {amount}` (Check `~upgrades` for available items)");
        }

        const itemName = args[0].toLowerCase();
        const item = shop.find(i => i.name.toLowerCase() === itemName);

        if (!item) {
            return message.reply("That item doesn't exist! Use `~upgrades` to see available items.");
        }

        let amount = parseInt(args[1]) || 1; 

        if (amount < 1) {
            return message.reply("You must buy at least one item.");
        }

        let inventory = user.inventory ? user.inventory.split(",") : [];

        if (item.name === "gold_foil" && inventory.includes("gold_foil")) {
            return message.reply("You already own a **gold_foil**! It can only be purchased once.");
        }

        if (item.name === "gold_foil" && amount > 1) {
            return message.reply("You can only purchase **one** gold_foil.");
        }

        const exclusiveItems = ["~farm", "~workshop", "~mine"];
        if (exclusiveItems.includes(item.name)) {
            if (inventory.some(i => exclusiveItems.includes(i))) {
                return message.reply(`You can only own **one** of **~farm, ~workshop, or ~mine**.`);
            }
            amount = 1; 
        }

        const totalPrice = item.price * amount;

        if (user.balance < totalPrice) {
            return message.reply(`You don't have enough money! **${amount} ${item.name}** costs **$${totalPrice}**.`);
        }

        const newBalance = user.balance - totalPrice;

        for (let i = 0; i < amount; i++) {
            inventory.push(item.name);
        }
        const updatedInventory = inventory.filter(Boolean).join(",");

        db.prepare("UPDATE users SET balance = ?, inventory = ? WHERE id = ?")
          .run(newBalance, updatedInventory, userId);

        message.reply(`You purchased **${amount} ${item.name}** for **$${totalPrice}**! Your new balance is **$${newBalance}**.`);
    },
};