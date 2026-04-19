const { EmbedBuilder } = require("discord.js");
const Database = require("better-sqlite3");

// Open the database
const db = new Database("users.db");

db.prepare(`CREATE TABLE IF NOT EXISTS market (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_id TEXT NOT NULL,
    item_name TEXT NOT NULL,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL
)`).run();

// Helper to format IDs like 001, 002, etc
function formatId(id) {
    return id.toString().padStart(3, "0");
}

module.exports = {
    name: "market",
    description: "Player market commands.",
    async execute(message, args) {
        const userId = message.author.id;
        const subcommand = args[0];

        /* ===================== VIEW ===================== */
        if (!subcommand || subcommand === "view") {
            const marketListings = db.prepare("SELECT * FROM market").all();
            const userListings = marketListings.filter(i => i.seller_id === userId);

            const marketEmbed = new EmbedBuilder()
                .setTitle("Player Market")
                .setColor("#85BB65")
                .setDescription("Use `~market buy <id> <qty>`")
                .setTimestamp();

            marketEmbed.addFields({
                name: "Available Listings",
                value: marketListings.length
                    ? marketListings.map(item =>
                        `[#${formatId(item.id)}] **${item.item_name}** - $${item.price} (x${item.quantity}) | Seller: <@${item.seller_id}>`
                    ).join("\n")
                    : "No items listed."
            });

            marketEmbed.addFields({
                name: "Your Listings",
                value: userListings.length
                    ? userListings.map(item =>
                        `[#${formatId(item.id)}] **${item.item_name}** - $${item.price} (x${item.quantity})`
                    ).join("\n")
                    : "You have no active listings."
            });

            return message.reply({ embeds: [marketEmbed] });
        }

        /* ===================== LIST ===================== */
        if (subcommand === "list") {
            const itemName = args[1];
            const price = parseInt(args[2]);
            const quantity = parseInt(args[3]);

            if (!itemName || isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
                return message.reply("Usage: `~market list {item} {price} {quantity}`");
            }

            const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
            if (!user) return message.reply("You are not registered!");

            let inventory = user.inventory ? user.inventory.split(",") : [];
            const itemCount = inventory.filter(i => i === itemName).length;

            if (itemCount < quantity) {
                return message.reply(`You only have **${itemCount}x ${itemName}**.`);
            }

            let removed = 0;
            inventory = inventory.filter(i => {
                if (i === itemName && removed < quantity) {
                    removed++;
                    return false;
                }
                return true;
            });

            db.prepare("UPDATE users SET inventory = ? WHERE id = ?")
                .run(inventory.join(","), userId);

            const info = db.prepare(
                "INSERT INTO market (seller_id, item_name, price, quantity) VALUES (?, ?, ?, ?)"
            ).run(userId, itemName, price, quantity);

            return message.reply(
                `Listed **${quantity}x ${itemName}** for **$${price}** each as **[#${formatId(info.lastInsertRowid)}]**`
            );
        }

        /* ===================== DELIST ===================== */
        if (subcommand === "delist") {
            const id = parseInt(args[1]);
            if (isNaN(id)) return message.reply("Usage: `~market delist {id}`");

            const listing = db.prepare(
                "SELECT * FROM market WHERE id = ? AND seller_id = ?"
            ).get(id, userId);

            if (!listing) return message.reply("That listing does not belong to you!");

            const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
            let inventory = user.inventory ? user.inventory.split(",") : [];

            for (let i = 0; i < listing.quantity; i++) {
                inventory.push(listing.item_name);
            }

            db.prepare("UPDATE users SET inventory = ? WHERE id = ?")
                .run(inventory.join(","), userId);

            db.prepare("DELETE FROM market WHERE id = ?").run(id);

            return message.reply(
                `Delisted **[#${formatId(id)}] ${listing.item_name}** and returned **${listing.quantity}x** to your inventory.`
            );
        }

        /* ===================== BUY ===================== */
        if (subcommand === "buy") {
            const id = parseInt(args[1]);
            const quantity = parseInt(args[2]);

            if (isNaN(id) || isNaN(quantity) || quantity <= 0) {
                return message.reply("Usage: `~market buy {id} {quantity}`");
            }

            const listing = db.prepare("SELECT * FROM market WHERE id = ?").get(id);
            if (!listing) return message.reply("That listing does not exist!");

            if (quantity > listing.quantity) {
                return message.reply(`Only **${listing.quantity}x** available.`);
            }

            const buyer = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
            if (!buyer) return message.reply("You are not registered!");

            const totalPrice = listing.price * quantity;
            if (buyer.balance < totalPrice) {
                return message.reply("You don't have enough money!");
            }

            db.prepare("UPDATE users SET balance = ? WHERE id = ?")
                .run(buyer.balance - totalPrice, userId);

            db.prepare("UPDATE users SET balance = balance + ? WHERE id = ?")
                .run(totalPrice, listing.seller_id);

            let buyerInventory = buyer.inventory ? buyer.inventory.split(",") : [];
            for (let i = 0; i < quantity; i++) {
                buyerInventory.push(listing.item_name);
            }

            db.prepare("UPDATE users SET inventory = ? WHERE id = ?")
                .run(buyerInventory.join(","), userId);

            if (listing.quantity > quantity) {
                db.prepare("UPDATE market SET quantity = ? WHERE id = ?")
                    .run(listing.quantity - quantity, id);
            } else {
                db.prepare("DELETE FROM market WHERE id = ?").run(id);
            }

            return message.reply(
                `Bought **${quantity}x ${listing.item_name}** from **[#${formatId(id)}]** for **$${totalPrice}**`
            );
        }
    },
};
