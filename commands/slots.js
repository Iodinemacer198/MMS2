const Database = require("better-sqlite3");

// Open the database
const db = new Database("users.db");

module.exports = {
    name: "slots",
    description: "Plays a watered-down slots game with betting.",
    async execute(message, args) {
        const userId = message.author.id;
        const username = message.author.username;
        const betAmount = parseInt(args[0]);

        // Validate the bet
        if (isNaN(betAmount) || betAmount <= 0) {
            return message.reply("Please enter a valid bet amount (e.g., `$slots 50`).");
        }

        // Check if the user is registered
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
        if (!user) {
            return message.reply("You are not registered! Use `~register` to use the economics feature.");
        }

        // Check if the user has enough balance
        if (user.balance < betAmount) {
            return message.reply("You don't have enough money to place this bet!");
        }

        // Slot machine symbols
        const slots = [
            "<:watermelons:1240012501995749556>", "<:sevens:1240012424510439454>",
            "<:oranges:1240012630584852581>", "<:lemons:1240012599572041748>",
            "<:grape:1240012661639614524>", "<:cherry:1240012689904762940>",
            "<:bells:1240012538171752621>", "<:bars:1240012569532567705>",
            "<:bananas:1240012461642481685>"
        ];

        // Spin the slots
        const chosenItem1 = slots[Math.floor(Math.random() * slots.length)];
        const chosenItem2 = slots[Math.floor(Math.random() * slots.length)];
        const chosenItem3 = slots[Math.floor(Math.random() * slots.length)];

        let inventory = user.inventory ? user.inventory.split(",") : [];

        let resultMessage;
        let newBalance = user.balance - betAmount; // Deduct bet first

        if (chosenItem1 === chosenItem2 && chosenItem2 === chosenItem3) {
            // Jackpot win (3x payout)
            let winnings = 0;
            if (inventory.includes('gold_foil')) {
                winnings = (betAmount * 3) * 1.05
            } else {
                winnings = betAmount * 3
            }
            (newBalance += winnings).toFixed(2);
            resultMessage = `Jackpot! You won **$${winnings}**!\nNew Balance: **$${newBalance}**`;
        } else {
            resultMessage = `No jackpot! You lost **$${betAmount}**.\nNew Balance: **$${newBalance}**`;
        }

        // Update user balance in the database
        db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, userId);

        // Send the result message
        await message.reply(`# ${chosenItem1} | ${chosenItem2} | ${chosenItem3}\n${resultMessage}`);
    },
};
