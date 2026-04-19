const Database = require("better-sqlite3");
const { EmbedBuilder } = require("discord.js");

// Open the database
const db = new Database("users.db");

db.prepare(`
    CREATE TABLE IF NOT EXISTS garage (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cars TEXT NOT NULL,
        fn TEXT NOT NULL,
        cars_bpi TEXT NOT NULL,
        upgrades_boost INTEGER NOT NULL,
        upgrades_list TEXT NOT NULL
    )
`).run();

function addCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const shop = [
    { name: "a4", price: 28960, fn: "2007 Audi A4 2.0T", bpi: 11.66 },
    { name: "crv", price: 26795, fn: "2017 Honda CR-V EX", bpi: 9.79 },
    { name: "accord", price: 27430, fn: "2021 Honda Accord Sport", bpi: 11.49 },
    { name: "golf", price: 28490, fn: "2019 VW Golf GTI S", bpi: 19.21 },
    { name: "911", price: 82100, fn: "2012 Porsche 911 (997) Carrera", bpi: 33.02 },
    { name: "challenger", price: 31095, fn: "2020 Dodge Challenger GT", bpi: 20.87 },
    { name: "jetta", price: 18520, fn: "2000 VW Jetta GL TDi", bpi: 4.69 },
    { name: "nz", price: 33570, fn: "2017 Nissan Z Sport", bpi: 26.8 },
    { name: "metro", price: 5995, fn: "1989 Geo Metro Base", bpi: 2 },
    { name: "rc", price: 48610, fn: "2024 Lexus RC 300 3.5L", bpi: 15.77 },
    { name: "4s", price: 46925, fn: "2014 BMW 4 Series 435i", bpi: 24.93 },
    { name: "elantra", price: 17100, fn: "2019 Hyundai Elantra SE", bpi: 6.88 },
    { name: "fit", price: 15100, fn: "2011 Honda Fit/Jazz", bpi: 4.98 },
    { name: "z4", price: 56950, fn: "2014 BMW Z4 35i", bpi: 28.50 },
    { name: "wrx", price: 24520, fn: "2002 Subaru Impreza WRX Sedan", bpi: 15.97 },
];

function getHourlyUpgrades() {
    const hourSeed = Math.floor(Date.now() / (1000 * 60 * 60));
    const shuffled = [...shop];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = (hourSeed + i * 31) % shuffled.length;
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, 10);
}

module.exports = {
    name: "car-buy",
    description: "Purchase an item from the shop.",
    async execute(message, args) {
        const userId = message.author.id;
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
        const usergar1 = db.prepare("SELECT * FROM garage WHERE id = ?").get(userId);

        // Ensure user is registered
        if (!user) {
            return message.reply("You are not registered! Use `~register` to use the bot.");
        }

        // Ensure inventory is initialized for the user
        if (!usergar1) {
            db.prepare("INSERT INTO garage (id, cars, fn, cars_bpi, upgrades_boost, upgrades_list) VALUES (?, ?, ?, ?, ?, ?)").run(userId, "", "", "", 1, "");
        }

        const usergar = db.prepare("SELECT * FROM garage WHERE id = ?").get(userId);

        const hourlyUpgrades = getHourlyUpgrades();

        if (!args.length) {
            const formatted = hourlyUpgrades.map(u => {
                return `**${u.fn} [${u.name}]**\n$${addCommas(u.price)} | BPI: ${u.bpi}`;
            }).join("\n\n");
        
            const embed = new EmbedBuilder()
                .setColor("#85BB65")
                .setTitle("Molecular Automotives")
                .setDescription("Use `~car-buy <car>` to buy\nCars refresh every hour.\n\n" + formatted)
                .setTimestamp();
        
            return message.reply({ embeds: [embed] });
        }

        const itemName = args[0].toLowerCase();
        const item = hourlyUpgrades.find(u =>
            u.name === itemName
        );

        if (!item) {
            return message.reply("That car is not available this hour.");
        }

        let amount = 1

        if (amount < 1) {
            return message.reply("You must buy at least one item.");
        }

        let newgarage = usergar.cars ? usergar.cars.split(",") : [];
        let newfn = usergar.fn ? usergar.fn.split(",") : [];
        let newbpi = usergar.cars_bpi ? usergar.cars_bpi.split(",") : [];

        const totalPrice = item.price * amount;

        // Check if the user has enough money
        if (user.balance < totalPrice) {
            return message.reply(`You don't have enough money! A **${item.fn}** costs **$${totalPrice}**.`);
        }

        // Deduct the price from the user's balance
        const newBalance = user.balance - totalPrice;

        // Update inventory
        for (let i = 0; i < amount; i++) {
            newfn.push(item.fn);
        }
        const updatedFn = newfn.filter(Boolean).join(","); 
        
        for (let i = 0; i < amount; i++) {
            newgarage.push(item.name);
        }
        const updatedGarage = newgarage.filter(Boolean).join(",");

        for (let i = 0; i < amount; i++) {
            let formattedbpi = `${item.name}` + `|` + `${item.bpi}`
            newbpi.push(formattedbpi);
        }
        const updatedBpi = newbpi.filter(Boolean).join(",");

        db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, userId);

        db.prepare("UPDATE garage SET cars = ?, fn = ?, cars_bpi = ? WHERE id = ?").run(updatedGarage, updatedFn, updatedBpi, userId);

        message.reply(`You purchased a **${item.fn}** for **$${totalPrice}**! Your new balance is **$${newBalance}**.`);
    },
};