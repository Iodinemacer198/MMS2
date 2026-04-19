const Database = require("better-sqlite3");
const { EmbedBuilder } = require("discord.js");

// Open the database
const db = new Database("users.db");

function addCommas(num) {
    let [integer, decimal] = num.toString().split(".");
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimal ? integer + "." + decimal : integer;
}

module.exports = {
    name: "balance",
    description: "Check your own balance.",
    async execute(message) {
        const userId = message.author.id;
        const userData = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);

        if (!userData) {
            return message.reply("You are not registered! Use `~register` to use the economics feature.");
        }

        let levelRow = db.prepare("SELECT xp FROM level WHERE id = ?").get(userId);
        let crimexp = db.prepare("SELECT xp FROM crime WHERE id = ?").get(userId);

        let crimeinfo = db.prepare("SELECT * FROM crime WHERE id = ?").get(userId);
        let heat = crimeinfo?.heat ?? 0;

        let heatMessage = ''
        if (heat >= 75) {
            heatMessage = '(Be wary that having 100+ heat can incure severe penalties...)'
        }

        let formattedXP = levelRow?.xp ?? 0;
        let formattedcrime = crimexp?.xp ?? 0;

        let rank = ''
        let crimerank = ''

        if (formattedXP <= 20000) {
            rank = 'Copper'
        } else if (formattedXP > 20000 && formattedXP <= 100000) {
            rank  = 'Silver'
        } else if (formattedXP > 100000 && formattedXP <= 250000) {
            rank  = 'Gold'
        } else if (formattedXP >= 250000) {
            rank  = 'Platinum'
        }

        if (formattedcrime <= 40000) {
            crimerank = 'Pickpocket'
        } else if (40000 <= formattedcrime && formattedXP <= 200000) {
            crimerank  = 'Thug'
        } else if (200000 <= formattedcrime && formattedXP <= 500000) {
            crimerank  = 'Criminal'
        } else if (formattedcrime >= 500000) {
            crimerank  = 'Boss'
        }

        //const usergar = db.prepare("SELECT * FROM garage WHERE id = ?").get(userId);

        // Process inventory to show item counts
        let inventoryItems = userData.inventory ? userData.inventory.split(",") : [];
        //let garage = usergar.cars ? usergar.cars.split(",") : [];
        let itemCounts = {};
        let upgrades = [];
        //let cars = [];

        inventoryItems.forEach(item => {
            itemCounts[item] = (itemCounts[item] || 0) + 1;
            if (["~farm", "~mine", "~workshop", "gold_foil", "elemental_fund", "gadolinium_crowbar"].includes(item)) {
                upgrades.push(item);
            }
        });

        const usergar = db.prepare("SELECT * FROM garage WHERE id = ?").get(userId);

        let carKeys = usergar?.cars ? usergar.cars.split(",") : [];
        let fullNames = usergar?.fn ? usergar.fn.split(",") : [];
        let baseBpiEntries = usergar?.cars_bpi ? usergar.cars_bpi.split(",") : [];
        let upgradeEntries = usergar?.upgrades_list ? usergar.upgrades_list.split(",") : [];

        let cars = [];

        carKeys.forEach((carKey, index) => {
            const fullName = fullNames[index] || carKey;

            // Get base BPI
            let baseBpi = 0;
            if (baseBpiEntries[index] && baseBpiEntries[index].includes("|")) {
                baseBpi = parseFloat(baseBpiEntries[index].split("|")[1]);
            }

            // Find upgrades that belong to this car
            let carUpgrades = upgradeEntries.filter(entry =>
                entry.startsWith(carKey + "|")
            );

            let totalMultiplier = 1;
            let upgradeText = [];

            carUpgrades.forEach(entry => {
                let parts = entry.split("|");
                if (parts.length === 3) {
                    let upgradeName = parts[1];
                    let multiplier = parseFloat(parts[2]);

                    totalMultiplier *= multiplier;
                    upgradeText.push(`${upgradeName} (x${multiplier.toFixed(2)})`);
                }
            });

            let finalBpi = baseBpi * totalMultiplier;

            let upgradesDisplay = upgradeText.length > 0
                ? " | " + upgradeText.join(" | ")
                : " | No Upgrades";

            cars.push(
                `${fullName} | BPI: ${finalBpi.toFixed(2)}${upgradesDisplay}`
            );
        });

        let formattedCars = cars.length > 0 ? cars.join("\n") : "None";


        let formattedInventory = Object.entries(itemCounts)
            .filter(([item]) => !["~farm", "~mine", "~workshop", "gold_foil", "elemental_fund", "gadolinium_crowbar"].includes(item)) // Exclude upgrades from inventory
            .map(([item, count]) => `${count}x ${item}`)
            .join(", ") || "Empty";

        let formattedUpgrades = upgrades.length > 0 ? upgrades.join(", ") : "None";

        //let formattedCars = cars.length > 0 ? cars.join("\n") : "None";

        // Create an embed message
        const embed = new EmbedBuilder()
            .setColor("#85BB65")
            .setTitle(`${message.author.username}'s Balance`)
            .addFields(
                { name: "💰 Balance", value: `$${(addCommas((userData.balance).toFixed(2)))}`, inline: true },
                { name: "📦 Inventory", value: formattedInventory, inline: false },
                { name: "🛠️ Upgrades", value: formattedUpgrades, inline: false },
                { name: "🚗 Garage", value: formattedCars, inline: false },
                { name: "✨ Experience", value: `Work: ${rank} rank - ${addCommas(formattedXP)} work XP\nCrime: ${crimerank} rank - ${addCommas(formattedcrime)} crime XP`, inline: false },
                { name: "🔥 Heat", value: `${heat} heat ${heatMessage}`, inline: false}
            )
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
