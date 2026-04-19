const Database = require("better-sqlite3");

// Open the database
const db = new Database("users.db");

const cooldowns = new Map();

function getRandomNumberBetween(x, y) {
    return Math.floor(Math.random() * (y - x + 1)) + x;
}

const workOptions = [
    "worked a shift at the Direcția Generală Anticorupție",
    "spent a day coming up with gimmick ideas",
    "investigated the suspicious spheres",
    "sweeped a wizard tower",
    "worked on MMS",
    "worked on Molecular Utilities",
    "worked on Hellbot",
    "learned about the periodic table",
    "praised the Cotylorhynchus",
    "setup a round of Hut Game",
    "worked a shift at Elemental Funerals",
    "worked a shift at Aperture Laboratories",
    "worked a shift at Black Mesa",
    "worked on a car at Bayerische Molecular Werke",
    "flew for Bulgarian Air Charter",
    "sold some P&W credits",
];

module.exports = {
    name: "work",
    description: "Work to earn money. Requires 3 food.",
    async execute(message) {
        const userId = message.author.id;

        // Check if the user is registered
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
        if (!user) {
            return message.reply("You are not registered! Use `~register` to use the economics feature.");
        }

        // Check if farming is active from cooldowns table
        const cooldown = db.prepare("SELECT * FROM cooldowns WHERE id = ?").get(userId);
        const currentTime = Date.now();
        const farmDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

        if (cooldown && cooldown.farm_start && currentTime < cooldown.farm_start + farmDuration) {
            const timeLeft = ((cooldown.farm_start + farmDuration - currentTime) / 60000).toFixed(1);
            return message.reply(`You cannot work while using your factory! Your factory will be ready for collection in **${timeLeft} minutes**.`);
        }

        // Check cooldown for work
        const cooldownTime = 60 * 1000; // 1 minute in milliseconds
        const lastUsed = cooldowns.get(userId);
        const now = Date.now();

        if (lastUsed && now - lastUsed < cooldownTime) {
            const remainingTime = ((cooldownTime - (now - lastUsed)) / 1000).toFixed(1);
            return message.reply(`You need to wait ${remainingTime} more seconds before working again!`);
        }

        // Update cooldown
        

        // Process inventory and check for 5 food
        let inventoryItems = user.inventory ? user.inventory.split(",") : [];
        let foodCount = inventoryItems.filter(item => item === "food").length;

        if (foodCount < 3) {
            return message.reply("You do not have enough food! You need at least **3x food** to work.");
        }

        // Remove 5 food items
        let foodRemoved = 0;
        inventoryItems = inventoryItems.filter(item => {
            if (item === "food" && foodRemoved < 3) {
                foodRemoved++;
                return false;
            }
            return true;
        });

        let wage = 0

        const updatedInventory = inventoryItems.join(",");
        db.prepare("UPDATE users SET inventory = ? WHERE id = ?").run(updatedInventory, userId);

        cooldowns.set(userId, now);
        setTimeout(() => cooldowns.delete(userId), cooldownTime);

        let currentWork = db.prepare("SELECT rob_work_count FROM crime WHERE id = ?").get(userId);
        let newWork = (currentWork?.rob_work_count ?? 0) + 1

        let currentWork2 = db.prepare("SELECT heist_work_count FROM crime WHERE id = ?").get(userId);
        let newWork2 = (currentWork2?.heist_work_count ?? 0) + 1

        let levelRow = db.prepare("SELECT xp FROM level WHERE id = ?").get(userId);

        let multiplier = 1
        const inventory = user.inventory?.split(",") ?? [];

        if (inventory.includes("elemental_fund")) {
            multiplier = 1.1
        }

        //console.log(multiplier)
        //console.log(levelRow.xp)

        const checkXp = parseInt(levelRow.xp) ?? 0

        if (!levelRow || !levelRow.xp) {
            let wage = parseInt(((getRandomNumberBetween(75, 300))*multiplier).toFixed(2));
            db.prepare("INSERT INTO level (id, xp) VALUES (?, ?)").run(userId, wage);
            let levelRow2 = db.prepare("SELECT xp FROM level WHERE id = ?").get(userId);
            const work = workOptions[Math.floor(Math.random() * workOptions.length)];
            const newBalance = user.balance + wage;
            db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, userId);
            db.prepare("UPDATE crime SET rob_work_count = ? WHERE id = ?").run(newWork, userId);
            db.prepare("UPDATE crime SET heist_work_count = ? WHERE id = ?").run(newWork2, userId);
            await message.reply(`You ${work} and earned **$${wage}**, placing your new balance at **$${newBalance}**. You consumed **3x food** while working. You now have **${levelRow2.xp}** work XP.`);
        } else if (checkXp <= 20000) {
            let wage = parseInt(((getRandomNumberBetween(75, 300))*multiplier).toFixed(2));
            const newXp = levelRow.xp + wage;
            db.prepare("UPDATE level SET xp = ? WHERE id = ?").run(newXp, userId);
            let levelRow2 = db.prepare("SELECT xp FROM level WHERE id = ?").get(userId);
            const work = workOptions[Math.floor(Math.random() * workOptions.length)];
            const newBalance = user.balance + wage;
            db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, userId);
            db.prepare("UPDATE crime SET rob_work_count = ? WHERE id = ?").run(newWork, userId);
            db.prepare("UPDATE crime SET heist_work_count = ? WHERE id = ?").run(newWork2, userId);
            await message.reply(`You ${work} and earned **$${wage}**, placing your new balance at **$${newBalance}**. You consumed **3x food** while working. You now have **${levelRow2.xp}** work XP.`);
        } else if (checkXp > 20000 && checkXp <= 100000) {
            //console.log('yay')
            let wage = parseInt(((getRandomNumberBetween(125, 350))*multiplier).toFixed(2));
            //console.log(wage)
            const newXp = levelRow.xp + wage;
            //console.log(newXp)
            db.prepare("UPDATE level SET xp = ? WHERE id = ?").run(newXp, userId);
            //console.log(`XP added`)
            let levelRow2 = db.prepare("SELECT xp FROM level WHERE id = ?").get(userId);
            const work = workOptions[Math.floor(Math.random() * workOptions.length)];
            const newBalance = user.balance + wage;
            //console.log(work)
            //console.log(newBalance)
            db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, userId);
            //console.log(`Balance added`)
            db.prepare("UPDATE crime SET rob_work_count = ? WHERE id = ?").run(newWork, userId);
            //console.log(`rob count added`)
            db.prepare("UPDATE crime SET heist_work_count = ? WHERE id = ?").run(newWork2, userId);
            //console.log(`heist added`)
            await message.reply(`You ${work} and earned **$${wage}**, placing your new balance at **$${newBalance}**. You consumed **3x food** while working. You now have **${levelRow2.xp}** work XP.`);
        } else if (checkXp > 100000 && checkXp <= 250000) {
            let wage = parseInt((((getRandomNumberBetween(200, 425)))*multiplier).toFixed(2));
            const newXp = levelRow.xp + wage;
            db.prepare("UPDATE level SET xp = ? WHERE id = ?").run(newXp, userId);
            let levelRow2 = db.prepare("SELECT xp FROM level WHERE id = ?").get(userId);
            const work = workOptions[Math.floor(Math.random() * workOptions.length)];
            const newBalance = user.balance + wage;
            db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, userId);
            db.prepare("UPDATE crime SET rob_work_count = ? WHERE id = ?").run(newWork, userId);
            db.prepare("UPDATE crime SET heist_work_count = ? WHERE id = ?").run(newWork2, userId);
            await message.reply(`You ${work} and earned **$${wage}**, placing your new balance at **$${newBalance}**. You consumed **3x food** while working. You now have **${levelRow2.xp}** work XP.`);
        } else if (checkXp >= 250000) {
            let wage = parseInt((((getRandomNumberBetween(275, 500)))*multiplier).toFixed(2));
            const newXp = levelRow.xp + wage;
            db.prepare("UPDATE level SET xp = ? WHERE id = ?").run(newXp, userId);
            let levelRow2 = db.prepare("SELECT xp FROM level WHERE id = ?").get(userId);
            const work = workOptions[Math.floor(Math.random() * workOptions.length)];
            const newBalance = user.balance + wage;
            db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, userId);
            db.prepare("UPDATE crime SET rob_work_count = ? WHERE id = ?").run(newWork, userId);
            db.prepare("UPDATE crime SET heist_work_count = ? WHERE id = ?").run(newWork2, userId);
            await message.reply(`You ${work} and earned **$${wage}**, placing your new balance at **$${newBalance}**. You consumed **3x food** while working. You now have **${levelRow2.xp}** work XP.`);
        } else {
            await message.reply(`Error: XP range not found, Iodine can't code shit. Your current XP is (probably) ${checkXp} but apparently this shit can't fucking decide if that's a real fucking number or not or how it compares to other normal fucking integers. If you can't tell I'm pissed off.`)
        }
    },
};
