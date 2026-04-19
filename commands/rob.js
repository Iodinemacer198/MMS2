const Database = require("better-sqlite3");
const work = require("./work");

// Open the database
const db = new Database("users.db");

function getRandomNumberBetween(x, y) {
    return Math.floor(Math.random() * (y - x + 1)) + x;
}

const scavage = [
    'explosive',
    'metal',
    'electronic'
]

const workOptions = [
    "broke into the magic guild HQ and stole",
    "illegally entered the suspicious spheres research facility and robbed",
    "stole a border agent's bribe, worth",
    "broke into the copper factory and stole some wire, selling it for",
    "robbed the Molecular's HQ for",
    "mugged the owner of Molecular Utilities for",
    "broke into Hellbot's server room and stole some tech, worth",
    "stole some physics experiments for",
    "boosted an idol of the Cotylorhychus church, selling it for",
    "seized some money from Hut Game, with a final amount of",
    "stole... something... from Elemental Funerals. It's apparently worth",
    "smuggled prototype tech from Aperture Laboratories, selling it for",
    "sold stolen Black Mesa technology for",
    "stole a Bayerische Molecular Werke car, reselling it for",
    "stole an MD-80 from Bulgarian Air Charter, selling it to some shady men for",
    "robbed an offshore for"
];

const failWorkOptions = [
    "were caught breaking into the magic guild HQ",
    "triggered security at the suspicious spheres facility",
    "were arrested trying to steal a border agent's bribe",
    "set off alarms at the copper factory",
    "were intercepted during the Molecular HQ break-in",
    "failed to mug the owner of Molecular Utilities",
    "were traced stealing tech from Hellbot's server room",
    "were caught mishandling stolen physics experiments",
    "were identified stealing a Cotylorhynchus idol",
    "were audited after seizing Hut Game funds",
    "were reported for stealing from Elemental Funerals",
    "were caught smuggling Aperture prototype tech",
    "sold traced Black Mesa technology",
    "were caught reselling a stolen Bayerische Molecular Werke car",
    "were intercepted stealing a BAC MD-80",
    "triggered offshore fraud alerts"
];

module.exports = {
    name: "robbery",
    description: "Work to earn money. Requires 3 food.",
    async execute(message) {
        const userId = message.author.id;

        // Check if the user is registered
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
        if (!user) {
            return message.reply("You are not registered! Use `~register` to use the economics feature.");
        }

        // Check if farming is active from cooldowns table
        const crime2 = db.prepare("SELECT * FROM crime WHERE id = ?").get(userId);
        if (!crime2) {
            db.prepare("INSERT INTO crime (id, xp, heat, heist_cooldown, robbery_cooldown, petty_cooldown, rob_work_count, heist_work_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(userId, 0, 0, 0, 0, 0, 15, 30);
        }
        const crime = db.prepare("SELECT * FROM crime WHERE id = ?").get(userId);
        const cooldown = db.prepare("SELECT * FROM cooldowns WHERE id = ?").get(userId);
        const crime_cooldown = crime?.robbery_cooldown ?? 0
        const currentTime = Date.now();
        const farmDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

        if (cooldown && cooldown.farm_start && currentTime < cooldown.farm_start + farmDuration) {
            const timeLeft = ((cooldown.farm_start + farmDuration - currentTime) / 60000).toFixed(1);
            return message.reply(`You cannot commit crime while using your factory! Your factory will be ready for collection in **${timeLeft} minutes**.`);
        }

        // Check cooldown for work
        const cooldownTime = 3600000; // 1 minute in milliseconds
        const lastUsed = crime_cooldown
        const now = Date.now();

        if (lastUsed && now - lastUsed < cooldownTime) {
            const remainingTime = ((cooldownTime - (now - lastUsed)) / 60000).toFixed(1);
            return message.reply(`You need to wait ${remainingTime} more minutes before commiting crime again!`);
        }

        // Update cooldown
        
        //setTimeout(() => crime.delete(userId), cooldownTime);

        // Process inventory and check for 5 food
        let inventoryItems = user.inventory ? user.inventory.split(",") : [];
        let foodCount = inventoryItems.filter(item => item === "food").length;
        let toolCount = inventoryItems.filter(item => item === "tools").length;
        let workC = db.prepare("SELECT rob_work_count FROM crime WHERE id = ?").get(userId);
        let workCooldown = workC.rob_work_count

        if (foodCount < 3) {
            return message.reply("You do not have enough food! You need at least **3x food** to rob.");
        }
        if (toolCount < 1) {
            return message.reply("You do not have enough tools! You need at least **1x tools** to rob.");
        }
        if (workCooldown < 15) {
            return message.reply(`You need to work 15 times in between robberies! You have worked **${workCooldown}** times since you last commited a robbery.`)
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

        const updatedInventory = inventoryItems.join(",");
        db.prepare("UPDATE users SET inventory = ? WHERE id = ?").run(updatedInventory, userId);

        let inventoryItems2 = user.inventory ? user.inventory.split(",") : [];

        let toolsRemoved = 0;
        inventoryItems2 = inventoryItems.filter(item => {
            if (item === "tools" && toolsRemoved < 1) {
                toolsRemoved++;
                return false;
            }
            return true;
        });

        let newWorkCooldown = 0

        const updatedInventory2 = inventoryItems2.join(",");
        db.prepare("UPDATE users SET inventory = ? WHERE id = ?").run(updatedInventory2, userId);

        db.prepare("UPDATE crime SET robbery_cooldown = ? WHERE id = ?").run(now, userId);

        db.prepare("UPDATE crime SET rob_work_count = ? WHERE id = ?").run(newWorkCooldown, userId);

        let heat = crime.heat
        let chance = 0
        let maxRew = 0

        if (heat <= 25) {
            chance = 10
            maxRew = 1250
        } else if (25 < heat <= 50) {
            chance = 8
            maxRew = 1500
        } else if (50 < heat <= 75) {
            chance = 6
            maxRew = 1750
        } else if (75 < heat) {
            chance = 5
            maxRew = 2000
        }

        const catchChance = getRandomNumberBetween(0, chance)

        let multiplier = 1
        const inventory = user.inventory?.split(",") ?? [];

        if (inventory.includes("gadolinium_crowbar")) {
            multiplier = 1.1
        }

        if (catchChance == 1) {
            let wage = getRandomNumberBetween(-500, -1250);
            const newXp = crime.xp + wage;
            db.prepare("UPDATE crime SET xp = ? WHERE id = ?").run(newXp, userId);
            let levelRow2 = db.prepare("SELECT xp FROM crime WHERE id = ?").get(userId);
            const work = failWorkOptions[Math.floor(Math.random() * workOptions.length)];
            const newBalance = user.balance + wage;
            db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, userId);
            await message.reply(`You ${work} and were fined **$${wage}**, placing your new balance at **$${newBalance}**. You consumed **3x food** and **1x tool** while attempting the crime. You now have **${levelRow2.xp}** crime XP.`);
        } else {
            let wage = parseInt(((getRandomNumberBetween(750, maxRew))*multiplier).toFixed(2));
            const newBalance = user.balance + wage;
            const newXp = crime.xp + wage;
            const newHeat = heat + 25;
            if (newHeat >= 100) {
                const work = workOptions[Math.floor(Math.random() * workOptions.length)];
                let fine = getRandomNumberBetween(5000, 10000);
                let finebalance = user.balance - fine
                db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(finebalance, userId);
                db.prepare("UPDATE crime SET heat = ? WHERE id = ?").run(0, userId);
                return message.reply(`You ${work} **$${wage}**, but since you have now accrued 100 or more heat the authorities raided your hideout and confiscated your loot, additionally forcing you to pay a fine of **$${fine}.**`)
            }
            const scavageChance = getRandomNumberBetween(1, 5)
            let scavagemessage = `You also didn't find any items.`
            if (scavageChance == 1) {
                const scavageitem = scavage[Math.floor(Math.random() * scavage.length)];
                let buyerInventory = user.inventory ? user.inventory.split(",") : [];
                for (let i = 0; i < 1; i++) {
                    buyerInventory.push(scavageitem);
                }
                db.prepare("UPDATE users SET inventory = ? WHERE id = ?").run(buyerInventory.join(","), userId);
                scavagemessage = `You also found 1 ${scavageitem}.`
            }
            db.prepare("UPDATE crime SET xp = ? WHERE id = ?").run(newXp, userId);
            db.prepare("UPDATE crime SET heat = ? WHERE id = ?").run(newHeat, userId);
            let levelRow2 = db.prepare("SELECT xp FROM crime WHERE id = ?").get(userId);
            let levelRow3 = db.prepare("SELECT heat FROM crime WHERE id = ?").get(userId);
            const work = workOptions[Math.floor(Math.random() * workOptions.length)];
            db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, userId);
            await message.reply(`You ${work} **$${wage}**, placing your new balance at **$${newBalance}**. You consumed **3x food** and **1x tool** while committing the crime. You now have **${levelRow2.xp}** crime XP and **${levelRow3.heat}** heat. ${scavagemessage}`);
        }

        
    },
};
