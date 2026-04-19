const Database = require("better-sqlite3");

// Open the database
const db = new Database("users.db");



const cooldowns = new Map();

function getRandomNumberBetween(x, y) {
    return Math.floor(Math.random() * (y - x + 1)) + x;
}

const workOptions = [
    "broke into the magic guild HQ and stole",
    "stole MMS secrets and sold it for",
    "boosted loose change from the suspicious spheres, yielding",
    "scrapped copper wiring from a wizard tower, selling it for",
    "skimmed funds from Molecular operations, yielding",
    "sold pirated Molecular Utilities software keys for",
    "ran data theft jobs through Hellbot, yielding",
    "sold fake periodic table certifications for",
    "sold illegal merch of Cotylorhynchus, selling them for",
    "rigged bets in a Hut Game round, taking",
    "embezzled tips from Elemental Funerals, yielding",
    "smuggled prototype tech from Aperture Laboratories, selling it for",
    "sold Black Mesa access badges for",
    "chopped parts from a Bayerische Molecular Werke car, reselling them for",
    "ran cargo scams through Bulgarian Air Charter, yielding",
    "laundered stolen P&W credits, yielding"
];

const scavage = [
    'explosive',
    'metal',
    'electronic'
]

const failWorkOptions = [
    "were caught shaking down the suspicious spheres",
    "triggered an alarm in the wizard tower",
    "got audited during the MMS skim",
    "sold a fake Molecular Utilities key to an undercover agent",
    "had scummy Hellbot logs traced back to you",
    "got exposed selling fake periodic table certifications",
    "were sued for unlicensed Cotylorhynchus merchandise",
    "were caught rigging Hut Game bets",
    "got reported skimming tips at Elemental Funerals",
    "were caught smuggling Aperture tech",
    "used a stolen Black Mesa badge that got flagged",
    "got caught stripping parts from a BMW",
    "were detained running cargo scams",
    "got flagged laundering P&W credits"
];

module.exports = {
    name: "crime",
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
        const crime_cooldown = crime?.petty_cooldown ?? 0
        const currentTime = Date.now();
        const farmDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

        if (cooldown && cooldown.farm_start && currentTime < cooldown.farm_start + farmDuration) {
            const timeLeft = ((cooldown.farm_start + farmDuration - currentTime) / 60000).toFixed(1);
            return message.reply(`You cannot commit crime while using your factory! Your factory will be ready for collection in **${timeLeft} minutes**.`);
        }

        // Check cooldown for work
        const cooldownTime = 300 * 1000; // 1 minute in milliseconds
        const lastUsed = crime_cooldown
        const now = Date.now();

        if (lastUsed && now - lastUsed < cooldownTime) {
            const remainingTime = ((cooldownTime - (now - lastUsed)) / 1000).toFixed(1);
            return message.reply(`You need to wait ${remainingTime} more seconds before commiting crime again!`);
        }

        // Update cooldown
        
        //setTimeout(() => crime.delete(userId), cooldownTime);

        // Process inventory and check for 5 food
        let inventoryItems = user.inventory ? user.inventory.split(",") : [];
        let foodCount = inventoryItems.filter(item => item === "food").length;

        if (foodCount < 3) {
            return message.reply("You do not have enough food! You need at least **3x food** to commit crime.");
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

        db.prepare("UPDATE crime SET petty_cooldown = ? WHERE id = ?").run(now, userId);

        const catchChance = getRandomNumberBetween(0, 20)

        let multiplier = 1
        const inventory = user.inventory?.split(",") ?? [];

        if (inventory.includes("gadolinium_crowbar")) {
            multiplier = 1.1
        }

        if (catchChance == 1) {
            let wage = getRandomNumberBetween(-50, -300);
            const newXp = crime.xp + wage;
            db.prepare("UPDATE crime SET xp = ? WHERE id = ?").run(newXp, userId);
            let levelRow2 = db.prepare("SELECT xp FROM crime WHERE id = ?").get(userId);
            const work = failWorkOptions[Math.floor(Math.random() * workOptions.length)];
            const newBalance = user.balance + wage;
            db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, userId);
            await message.reply(`You ${work} and were fined **$${wage}**, placing your new balance at **$${newBalance}**. You consumed **3x food** while attempting the crime. You now have **${levelRow2.xp}** crime XP.`);
        } else {
            let heat = crime.heat
            let wage = parseInt(((getRandomNumberBetween(100, 500))*multiplier).toFixed(2));
            const newBalance = user.balance + wage;
            const work = workOptions[Math.floor(Math.random() * workOptions.length)];
            const newHeat = heat + 1;
            if (newHeat >= 100) {
                let fine = getRandomNumberBetween(5000, 10000);
                let finebalance = user.balance - fine
                db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(finebalance, userId);
                db.prepare("UPDATE crime SET heat = ? WHERE id = ?").run(0, userId);
                return message.reply(`You ${work} **$${wage}**, but since you have now accrued 100 or more heat the authorities raided your hideout and confiscated your loot, additionally forcing you to pay a fine of ${fine}.`)
            }
            const scavageChance = getRandomNumberBetween(1, 10)
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
            const newXp = crime.xp + wage;
            db.prepare("UPDATE crime SET xp = ? WHERE id = ?").run(newXp, userId);
            db.prepare("UPDATE crime SET heat = ? WHERE id = ?").run(newHeat, userId);
            let levelRow2 = db.prepare("SELECT xp FROM crime WHERE id = ?").get(userId);
            let levelRow3 = db.prepare("SELECT heat FROM crime WHERE id = ?").get(userId);
            db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, userId);
            await message.reply(`You ${work} **$${wage}**, placing your new balance at **$${newBalance}**. You consumed **3x food** while committing the crime. You now have **${levelRow2.xp}** crime XP and **${levelRow3.heat}** heat. ${scavagemessage}`);
        }

        
    },
};
