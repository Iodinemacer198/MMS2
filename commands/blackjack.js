const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Database = require("better-sqlite3");

const db = new Database("users.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS bjcooldown (
    id TEXT PRIMARY KEY,
    status INTEGER
  )
`).run();

const cards = [
    { value: 2, icon: "[2]" }, { value: 3, icon: "[3]" }, { value: 4, icon: "[4]" },
    { value: 5, icon: "[5]" }, { value: 6, icon: "[6]" }, { value: 7, icon: "[7]" },
    { value: 8, icon: "[8]" }, { value: 9, icon: "[9]" },
    { value: 10, icon: "[10]" }, { value: 10, icon: "[J]" },
    { value: 10, icon: "[Q]" }, { value: 10, icon: "[K]" }, { value: 11, icon: "[A]" }
];

const drawCard = () => cards[Math.floor(Math.random() * cards.length)];

function handValue(hand) {
    let total = 0;
    let aces = 0;

    for (const card of hand) {
        total += card.value;
        if (card.icon === "[A]") aces++;
    }

    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }

    return total;
}

const handIcons = hand => hand.map(c => c.icon).join(" ");

function buttonRow(active = true, allowDouble = false) {
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("hit")
            .setLabel("Hit")
            .setStyle(ButtonStyle.Success)
            .setEmoji("<:hit:1262471801879920781>")
            .setDisabled(!active),
        new ButtonBuilder()
            .setCustomId("stand")
            .setLabel("Stand")
            .setStyle(ButtonStyle.Danger)
            .setEmoji("<:stand:1262471832779489411>")
            .setDisabled(!active)
    );

    if (allowDouble) {
        row.addComponents(
            new ButtonBuilder()
                .setCustomId("double")
                .setLabel("Double Down")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("<:doubledown:1466190162768957501>")
        );
    }

    return row;
}

// 🔒 ONLY place that unlocks a user
function endGame(userId) {
    db.prepare(
        "UPDATE bjcooldown SET status = ? WHERE id = ?"
    ).run(0, userId);
}

module.exports = {
    name: "blackjack",
    description: "gambling 🤑",
    async execute(interaction, args) {
        const userId = interaction.author.id;

        let row = db.prepare(
            "SELECT status FROM bjcooldown WHERE id = ?"
        ).get(userId);

        if (!row) {
            db.prepare(
                "INSERT INTO bjcooldown (id, status) VALUES (?, 0)"
            ).run(userId);
            row = { status: 0 };
        }

        if (row.status === 1) {
            return interaction.reply({
                content: "You already have a blackjack game running. Finish it before starting another. If you previously deleted a game and need this status reset, contact therealiodinemacer."
            });
        }

        // 🔒 lock player
        db.prepare(
            "UPDATE bjcooldown SET status = ? WHERE id = ?"
        ).run(1, userId);

        const bet = parseInt(args[0]);
        if (!bet || bet <= 0) {
            endGame(userId);
            return interaction.reply("Please enter a valid bet amount (e.g., `~blackjack 50`).");
        }

        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
        if (!user) {
            endGame(userId);
            return interaction.reply("You are not registered! Use `~register` to use the economics feature.");
        }

        if (user.balance < bet) {
            endGame(userId);
            return interaction.reply("You don't have enough money to place this bet!");
        }

        const inventory = user.inventory?.split(",") ?? [];
        const winnings = inventory.includes("gold_foil") ? bet * 1.05 : bet;

        const winBal = Math.floor(user.balance + winnings);
        const loseBal = user.balance - bet;

        const doubleBet = bet * 2;
        const winBalDouble = Math.floor(user.balance + (winnings * 2));
        const loseBalDouble = user.balance - doubleBet;

        let dealer = [drawCard(), drawCard()];
        let player = [drawCard(), drawCard()];

        const canDouble = user.balance >= doubleBet;

        let msg = await interaction.reply({
            content:
                `Dealer: ${dealer[0].icon} [#]\n` +
                `----------------------------\n` +
                `Player: ${handIcons(player)} | (${handValue(player)})`,
            components: [buttonRow(true, canDouble)]
        });

        if (player.length === 2) {
            const values = player.map(c => c.value);
            if (values.includes(11) && values.includes(10)) {
                const payout = Math.floor(bet * 1.5);
                db.prepare("UPDATE users SET balance = ? WHERE id = ?")
                  .run((user.balance + payout), userId);

                endGame(userId);
                return msg.edit({
                    content:
                        `Dealer: ${handIcons(dealer)} | (${handValue(dealer)})\n` +
                        `----------------------------\n` +
                        `Player: ${handIcons(player)} | (21)\n` +
                        `**Blackjack** Your new balance is $${user.balance + payout}`,
                    components: [buttonRow(false)]
                });
            }
        }

        while (true) {
            let interactionBtn;
            try {
                interactionBtn = await msg.awaitMessageComponent({
                    filter: i => i.user.id === userId
                });
            } catch {
                // message deleted / timeout → user stays locked
                return;
            }

            if (interactionBtn.customId === "hit") {
                player.push(drawCard());
                const total = handValue(player);

                if (total > 21) {
                    db.prepare("UPDATE users SET balance = ? WHERE id = ?")
                      .run(loseBal, userId);

                    endGame(userId);
                    return interactionBtn.update({
                        content:
                            `Dealer: ${handIcons(dealer)} | (${handValue(dealer)})\n` +
                            `----------------------------\n` +
                            `Player: ${handIcons(player)} | (${total})\n` +
                            `**You lose!** Your new balance is $${loseBal}`,
                        components: [buttonRow(false)]
                    });
                }

                if (total === 21) {
                    db.prepare("UPDATE users SET balance = ? WHERE id = ?")
                      .run(winBal, userId);

                    endGame(userId);
                    return interactionBtn.update({
                        content:
                            `Dealer: ${handIcons(dealer)} | (${handValue(dealer)})\n` +
                            `----------------------------\n` +
                            `Player: ${handIcons(player)} | (21)\n` +
                            `**You win!** Your new balance is $${winBal}`,
                        components: [buttonRow(false)]
                    });
                }

                await interactionBtn.update({
                    content:
                        `Dealer: ${dealer[0].icon} [#]\n` +
                        `----------------------------\n` +
                        `Player: ${handIcons(player)} | (${total})`,
                    components: [buttonRow(true, false)]
                });

            } else if (interactionBtn.customId === "stand") {
                while (handValue(dealer) <= 16) dealer.push(drawCard());

                const p = handValue(player);
                const d = handValue(dealer);

                let result;
                if (d > 21 || p > d) {
                    db.prepare("UPDATE users SET balance = ? WHERE id = ?")
                      .run(winBal, userId);
                    result = `**You win!** Your new balance is $${winBal}`;
                } else if (p < d) {
                    db.prepare("UPDATE users SET balance = ? WHERE id = ?")
                      .run(loseBal, userId);
                    result = `**You lose!** Your new balance is $${loseBal}`;
                } else {
                    result = "**Draw!** Your money has been returned";
                }

                endGame(userId);
                return interactionBtn.update({
                    content:
                        `Dealer: ${handIcons(dealer)} | (${d})\n` +
                        `----------------------------\n` +
                        `Player: ${handIcons(player)} | (${p})\n` +
                        result,
                    components: [buttonRow(false)]
                });
            } else if (interactionBtn.customId === "double") {
                // Draw exactly ONE card
                player.push(drawCard());

                const p = handValue(player);

                // Dealer plays immediately
                while (handValue(dealer) <= 16) dealer.push(drawCard());
                const d = handValue(dealer);

                let result;
                if (p > 21) {
                    db.prepare("UPDATE users SET balance = ? WHERE id = ?")
                    .run(loseBalDouble, userId);
                    result = `**You lose!** Your new balance is $${loseBalDouble}`;
                } else if (d > 21 || p > d) {
                    db.prepare("UPDATE users SET balance = ? WHERE id = ?")
                    .run(winBalDouble, userId);
                    result = `**You win!** Your new balance is $${winBalDouble}`;
                } else if (p < d) {
                    db.prepare("UPDATE users SET balance = ? WHERE id = ?")
                    .run(loseBalDouble, userId);
                    result = `**You lose!** Your new balance is $${loseBalDouble}`;
                } else {
                    result = "**Draw!** Your money has been returned";
                }

                endGame(userId);
                return interactionBtn.update({
                    content:
                        `Dealer: ${handIcons(dealer)} | (${d})\n` +
                        `----------------------------\n` +
                        `Player: ${handIcons(player)} | (${p})\n` +
                        `**(Double Down)**\n` +
                        result,
                    components: [buttonRow(false)]
                });
            }
        }
    }
};
