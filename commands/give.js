const Database = require("better-sqlite3");

// Open the database
const db = new Database("users.db");

// Cooldowns Map
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
    name: "give",
    description: "Plays a watered-down slots game with betting.",
    async execute(message, args) {
        const userId = message.author.id;
        if (userId != '1140696859107659937') {
            return message.reply('You do not have permission to use this command!')
        }
        else {
            const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);

            const betAmount = parseInt(args[0]);

            const added = user.balance + betAmount

            db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(added, userId);

            await message.reply(`You added money to your balance`);
        }
    },
};
