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
    name: "lb",
    description: "View the top 10 richest users.",
    async execute(message) {
        // Get top 10 users by balance
        const topUsers = db
            .prepare("SELECT id, balance FROM users ORDER BY balance DESC LIMIT 10")
            .all();

        if (!topUsers.length) {
            return message.reply("No users found in the database.");
        }

        // Build leaderboard text
        let leaderboardText = "";
        let rank = 1;

        for (const user of topUsers) {
            let member;
            try {
                member = await message.client.users.fetch(user.id);
            } catch {
                member = { username: "Unknown User" };
            }

            leaderboardText += `**${rank}.** ${member.username} — $${addCommas((user.balance).toFixed(2))}\n`;
            rank++;
        }

        const topUsers2 = db
            .prepare("SELECT CAST(id AS TEXT) AS id, xp FROM level ORDER BY xp DESC LIMIT 10")
            .all();


        if (!topUsers2.length) {
            return message.reply("No users found in the database.");
        }

        // Build leaderboard text
        let leaderboardText2 = "";
        let rank2 = 1;

        for (const user3 of topUsers2) {
            let member2;
            try {
                member2 = await message.client.users.fetch(user3.id);
            } catch {
                member2 = { username: "Unknown User" };
            }

            leaderboardText2 += `**${rank2}.** ${member2.username} — ${addCommas(user3.xp)} work XP\n`;
            rank2++;
        }

        const topUsers3 = db
            .prepare("SELECT CAST(id AS TEXT) AS id, xp FROM crime ORDER BY xp DESC LIMIT 10")
            .all();


        if (!topUsers3.length) {
            return message.reply("No users found in the database.");
        }

        // Build leaderboard text
        let leaderboardText3 = "";
        let rank3 = 1;

        for (const user2 of topUsers3) {
            let member3;
            try {
                member3 = await message.client.users.fetch(user2.id);
            } catch {
                member3 = { username: "Unknown User" };
            }

            leaderboardText3 += `**${rank3}.** ${member3.username} — ${addCommas(user2.xp)} crime XP\n`;
            rank3++;
        }

        // Create embed
        const embed = new EmbedBuilder()
            .setColor("#85BB65")
            .setTitle("Balance Leaderboard")
            .setDescription(leaderboardText)
            .setTimestamp();

        const embed2 = new EmbedBuilder()
            .setColor("#85BB65")
            .setTitle("Work XP Leaderboard")
            .setDescription(leaderboardText2)
            .setTimestamp();

        const embed3 = new EmbedBuilder()
            .setColor("#85BB65")
            .setTitle("Crime XP Leaderboard")
            .setDescription(leaderboardText3)
            .setTimestamp();

        message.reply({ embeds: [embed, embed2, embed3] });
        //message.channel.send({ embeds: [embed2] })
        //message.channel.send({ embeds: [embed3] })
    },
};
