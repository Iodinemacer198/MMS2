const Database = require("better-sqlite3");

// Open the database
const db = new Database("users.db");

module.exports = {
    name: "send",
    description: "Send money to another user.",
    async execute(message, args) {
        const senderId = message.author.id;
        const senderUser = db.prepare("SELECT * FROM users WHERE id = ?").get(senderId);

        // Validate sender
        if (!senderUser) {
            return message.reply("You are not registered! Use `~register` to use the economics feature.");
        }

        // Validate input (should mention a user and provide an amount)
        if (args.length < 2) {
            return message.reply("Usage: `~send @user amount`");
        }

        // Extract the recipient from the message mention
        const recipient = message.mentions.users.first();
        if (!recipient) {
            return message.reply("You must mention a user to send money to!");
        }
        const recipientId = recipient.id;

        // Prevent self-transfers
        if (senderId === recipientId) {
            return message.reply("You can't send money to yourself!");
        }

        // Validate recipient
        const recipientUser = db.prepare("SELECT * FROM users WHERE id = ?").get(recipientId);
        if (!recipientUser) {
            return message.reply("That user is not registered!");
        }

        // Validate amount
        const amount = parseInt(args[1], 10);
        if (isNaN(amount) || amount <= 0) {
            return message.reply("Please enter a valid amount to send!");
        }

        if (senderUser.balance < amount) {
            return message.reply("You don't have enough money to send that amount!");
        }

        // Perform the transfer
        const newSenderBalance = senderUser.balance - amount;
        const newRecipientBalance = recipientUser.balance + amount;

        db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newSenderBalance, senderId);
        db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newRecipientBalance, recipientId);

        // Confirmation message
        message.reply(`You sent **$${amount}** to ${recipient.username}. Your new balance is **$${newSenderBalance}**.`);
    },
};
