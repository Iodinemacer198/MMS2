const Database = require("better-sqlite3");
const { EmbedBuilder } = require("discord.js");

const db = new Database("users.db");

const upgradePool = [
    { car: "a4", name: "K04 Turbo Kit", price: 8500, multiplier: 1.25 },
    { car: "a4", name: "Front Mount Intercooler", price: 3200, multiplier: 1.06 },
    { car: "a4", name: "Meth Injection", price: 6000, multiplier: 1.18 },
    { car: "a4", name: "Forged Internals", price: 14000, multiplier: 1.35 },

    { car: "golf", name: "IS38 Turbo Swap", price: 9200, multiplier: 1.30 },
    { car: "golf", name: "Upgraded HPFP", price: 4100, multiplier: 1.07 },
    { car: "golf", name: "DSG Tune", price: 4500, multiplier: 1.09 },
    { car: "golf", name: "Big Brake Kit", price: 5000, multiplier: 1.05 },

    { car: "911", name: "Performance Headers", price: 15000, multiplier: 1.20 },
    { car: "911", name: "GT3 Throttle Body", price: 11000, multiplier: 1.15 },
    { car: "911", name: "Track Aero Kit", price: 18000, multiplier: 1.25 },

    { car: "challenger", name: "Supercharger Kit", price: 12000, multiplier: 1.35 },
    { car: "challenger", name: "Long Tube Headers", price: 6000, multiplier: 1.10 },
    { car: "challenger", name: "E85 Conversion", price: 7000, multiplier: 1.18 },

    { car: "metro", name: "Weight Reduction", price: 1200, multiplier: 1.15 },
    { car: "metro", name: "Turbo Retrofit", price: 4000, multiplier: 1.30 },
    { car: "metro", name: "Nitrous Shot", price: 3500, multiplier: 1.22 },

    { car: "accord", name: "Sport Exhaust", price: 3200, multiplier: 1.07 },
    { car: "accord", name: "Big Turbo Kit", price: 10000, multiplier: 1.28 },

    { car: "crv", name: "ECU Remap", price: 4000, multiplier: 1.08 },
    { car: "crv", name: "Turbo Retrofit", price: 11000, multiplier: 1.28 },

    { car: "jetta", name: "TDI Tune", price: 2800, multiplier: 1.09 },
    { car: "jetta", name: "Hybrid Turbo", price: 7500, multiplier: 1.24 },

    { car: "nz", name: "Twin Turbo Kit", price: 14000, multiplier: 1.40 },
    { car: "nz", name: "Race Fuel Tune", price: 6500, multiplier: 1.17 },

    { car: "rc", name: "Racing Supercharger Kit", price: 16000, multiplier: 1.38 },
    { car: "rc", name: "Cat-Back Exhaust System", price: 4200, multiplier: 1.08 },
    { car: "rc", name: "Carbon Fiber Intake", price: 2800, multiplier: 1.05 },
    //{ car: "rc", name: "ECU Performance Tune", price: 3500, multiplier: 1.10 },

    //{ car: "4s", name: "Stage 2 N55 Tune", price: 4500, multiplier: 1.18 },
    { car: "4s", name: "Stage 2 Turbo", price: 9800, multiplier: 1.32 },
    { car: "4s", name: "Charge Pipe Upgrade", price: 1800, multiplier: 1.06 },
    { car: "4s", name: "M Performance LSD", price: 3200, multiplier: 1.07 },

    { car: "elantra", name: "Cold Air Intake", price: 1200, multiplier: 1.04 },
    { car: "elantra", name: "Turbo Kit Conversion", price: 8500, multiplier: 1.30 },
    { car: "elantra", name: "Lowering Springs", price: 1500, multiplier: 1.03 },
    { car: "elantra", name: "ECU Flash Tune", price: 2200, multiplier: 1.09 },

    { car: "fit", name: "K20 Engine Swap", price: 12000, multiplier: 1.45 },
    { car: "fit", name: "Bolt-On Turbo Kit", price: 7800, multiplier: 1.28 },
    { car: "fit", name: "Weight Reduction Package", price: 2000, multiplier: 1.12 },
    { car: "fit", name: "Short Ratio Gear Set", price: 3500, multiplier: 1.10 },

    { car: "z4", name: "Upgraded Twin Turbos", price: 14000, multiplier: 1.36 },
    //{ car: "z4", name: "Meth Injection System", price: 6000, multiplier: 1.14 },
    { car: "z4", name: "High-Flow Downpipes", price: 3800, multiplier: 1.09 },
    { car: "z4", name: "Custom ECU Tune", price: 5000, multiplier: 1.17 },

    { car: "wrx", name: "STI Turbo Upgrade", price: 9000, multiplier: 1.30 },
    { car: "wrx", name: "Front Mount Intercooler", price: 3500, multiplier: 1.08 },
    { car: "wrx", name: "E85 Flex Fuel Kit", price: 4200, multiplier: 1.15 },
    //{ car: "wrx", name: "Built Short Block", price: 13000, multiplier: 1.40 },
];

function getHourlyUpgrades() {
    const hourSeed = Math.floor(Date.now() / (1000 * 60 * 60));
    const shuffled = [...upgradePool];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = (hourSeed + i * 31) % shuffled.length;
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, 10);
}

function addCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {
    name: "car-upgrade",
    description: "View or buy car upgrades.",
    async execute(message, args) {
        const userId = message.author.id;
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);

        if (!user) {
            return message.reply("You are not registered! Use `~register` first.");
        }

        const garage = db.prepare("SELECT * FROM garage WHERE id = ?").get(userId);
        if (!garage) {
            return message.reply("You don't own any cars yet.");
        }

        const hourlyUpgrades = getHourlyUpgrades();

        // ==============================
        // SHOW SHOP
        // ==============================
        if (!args.length) {
            const formatted = hourlyUpgrades.map(u => {
                return `**${u.name}** (${u.car.toUpperCase()})\n$${addCommas(u.price)} | x${u.multiplier.toFixed(2)} BPI`;
            }).join("\n\n");

            const embed = new EmbedBuilder()
                .setColor("#85BB65")
                .setTitle("Elemental Tuning")
                .setDescription("Use `~car-upgrade <upgrade name>` to buy\nUpgrades refresh every hour.\n\n" + formatted)
                .setTimestamp();

            return message.reply({ embeds: [embed] });
        }

        // ==============================
        // BUY UPGRADE
        // ==============================
        const upgradeNameInput = args.join(" ").toLowerCase();
        const selectedUpgrade = hourlyUpgrades.find(u =>
            u.name.toLowerCase() === upgradeNameInput
        );

        if (!selectedUpgrade) {
            return message.reply("That upgrade is not available this hour.");
        }

        const ownedCars = garage.cars ? garage.cars.split(",") : [];

        if (!ownedCars.includes(selectedUpgrade.car)) {
            return message.reply(`You do not own a ${selectedUpgrade.car.toUpperCase()} to install this upgrade.`);
        }

        let currentUpgrades = garage.upgrades_list
            ? garage.upgrades_list.split(",")
            : [];

        // Prevent duplicate upgrade for same car
        const duplicate = currentUpgrades.find(entry => {
            const parts = entry.split("|");
            return parts[0] === selectedUpgrade.car &&
                   parts[1].toLowerCase() === selectedUpgrade.name.toLowerCase();
        });

        if (duplicate) {
            return message.reply("You have already installed this upgrade on that car.");
        }

        if (user.balance < selectedUpgrade.price) {
            return message.reply("You don't have enough money for this upgrade.");
        }

        // Deduct balance
        const newBalance = user.balance - selectedUpgrade.price;
        db.prepare("UPDATE users SET balance = ? WHERE id = ?")
            .run(newBalance, userId);

        // Add upgrade
        const formattedUpgrade = `${selectedUpgrade.car}|${selectedUpgrade.name}|${selectedUpgrade.multiplier}`;
        currentUpgrades.push(formattedUpgrade);

        const updatedUpgradeString = currentUpgrades.filter(Boolean).join(",");

        db.prepare("UPDATE garage SET upgrades_list = ? WHERE id = ?")
            .run(updatedUpgradeString, userId);

        message.reply(
            `Successfully installed **${selectedUpgrade.name}** on your ${selectedUpgrade.car.toUpperCase()}!\n` +
            `New balance: **$${addCommas(newBalance)}**`
        );
    },
};
