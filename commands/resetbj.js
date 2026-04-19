const Database = require("better-sqlite3");
const db = new Database("users.db");

module.exports = {
    name: "resetbj",
    description: "Reset a user's blackjack status",
    async execute(interaction, args) {
        const userId = interaction.author.id;
        if (userId != '1140696859107659937') {
            return interaction.reply('You do not have permission to use this command!')
        }
        const target =
            interaction.mentions.users.first() ||
            (args[0] ? { id: args[0] } : null);

        if (!target) {
            return interaction.reply(
                "Please mention a user or provide their user ID."
            );
        }

        // Ensure row exists
        const row = db.prepare(
            "SELECT status FROM bjcooldown WHERE id = ?"
        ).get(target.id);

        if (!row) {
            db.prepare(
                "INSERT INTO bjcooldown (id, status) VALUES (?, 0)"
            ).run(target.id);
        } else {
            db.prepare(
                "UPDATE bjcooldown SET status = 0 WHERE id = ?"
            ).run(target.id);
        }

        return interaction.reply(
            `✅ Blackjack status for <@${target.id}> has been reset.`
        );
    }
};
