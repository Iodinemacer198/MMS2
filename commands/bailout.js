const Database = require("better-sqlite3");

const db = new Database("users.db");

module.exports = {
    name: "bailout",
    description: "Gives you a $100 bailout if you're completely broke (once per day).",
    async execute(message) {
        const userId = message.author.id;

        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
        if (!user) {
            return message.reply("You are not registered! Use `~register` to use the economics feature.");
        }

        if (user.balance > 0) {
            return message.reply("You can only use `~bailout` if your balance is **$0**.");
        }

        if (user.last_bailout === undefined) {
            db.prepare("UPDATE users SET last_bailout = 0 WHERE id = ?").run(userId);
            user.last_bailout = 0;
        }

        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000; 

        if (user.last_bailout && now - user.last_bailout < oneDay) {
            const remainingTime = ((oneDay - (now - user.last_bailout)) / (60 * 60 * 1000)).toFixed(1);
            return message.reply(`You have already used your bailout today! Try again in **${remainingTime}** hours.`);
        }

        const bailoutAmount = 100;

        db.prepare("UPDATE users SET balance = ?, last_bailout = ? WHERE id = ?")
          .run(bailoutAmount, now, userId);

        message.reply(`You have been bailed out with **$${bailoutAmount}**! Use it wisely.`);
    },
};
