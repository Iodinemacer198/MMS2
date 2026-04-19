const { 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    EmbedBuilder 
} = require("discord.js");
const Database = require("better-sqlite3");

const db = new Database("users.db");

function getRandomNumberBetween(x, y) {
    return Math.floor(Math.random() * (y - x + 1)) + x;
}

async function runHeistQuiz(client, userIds, chanId) {
    return new Promise(async resolve => {
        const QUESTIONS = [
            { question: "If 4x + 8 = 56, what does x equal?", answer: "12" },
            { question: "What color do you get when you mix red, blue, and yellow paint?", answer: "brown" },
            { question: "How many sides does a hexagon have?", answer: "6" },
            { question: "What is 18 x 4?", answer: "72" },
            { question: "What layer of the Earth do humans live on?", answer: "crust" },
            { question: "What is the opposite of 'scarcity'?", answer: "abundance" },
            { question: "How many letters are in the word 'government'?", answer: "10" },
            { question: "What is 64 - 27?", answer: "37" },
            { question: "What color is chlorophyll?", answer: "green" },
            { question: "How many legs does an insect have?", answer: "6" },
            {
                question: "If 5x - 20 = 30, what does x equal?",
                answer: "10"
            },
            {
                question: "What is 144 ÷ 12?",
                answer: "12"
            },
            {
                question: "What is 8 x 9?",
                answer: "72"
            },
            {
                question: "What is 81 ÷ 9?",
                answer: "9"
            },
            {
                question: "What color do you get when you mix red and green light?",
                answer: "yellow"
            },
            {
                question: "How many chambers does the human heart have?",
                answer: "4"
            },
            {
                question: "What is the opposite of 'expand'?",
                answer: "contract"
            },
            {
                question: "Which planet has the most moons?",
                answer: "saturn"
            },
            {
                question: "What is the 5th letter of the alphabet?",
                answer: "e"
            },
            {
                question: "How many hours are in two days?",
                answer: "48"
            },
            {
                question: "What is 12²?",
                answer: "144"
            },
            {
                question: "What gas makes up most of Earth's atmosphere?",
                answer: "nitrogen"
            },
            {
                question: "How many bones are in the adult human body?",
                answer: "206"
            },
            {
                question: "What is 125 ÷ 5?",
                answer: "25"
            },
            {
                question: "What is 3³?",
                answer: "27"
            },
            {
                question: "What is the opposite of 'increase'?",
                answer: "decrease"
            },
            {
                question: "What is 7 x 8?",
                answer: "56"
            },
            {
                question: "How many minutes are in an hour and a half?",
                answer: "90"
            },
            {
                question: "What liquid molecule is represented by 'H2O'?",
                answer: "water"
            },
            {
                question: "How many planets are in the solar system?",
                answer: "8"
            },
            {
                question: "What day comes after Thursday?",
                answer: "friday"
            },
            {
                question: "What is 45 + 55?",
                answer: "100"
            },
            {
                question: "What color does sodium produce in a flame test?",
                answer: "yellow"
            },
            {
                question: "How many vertices does a cube have?",
                answer: "8"
            },
            {
                question: "What is 14 x 6?",
                answer: "84"
            },
            {
                question: "What is 19²?",
                answer: "361"
            },
            {
                question: "What is the opposite of 'transparent'?",
                answer: "opaque"
            },
            {
                question: "How many oceans are there on Earth?",
                answer: "5"
            },
            {
                question: "What is 48 ÷ 6?",
                answer: "8"
            },
            {
                question: "What color is copper sulfate?",
                answer: "blue"
            }


        ];

        // Shuffle questions so everyone gets a different one
        const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);

        if (userIds.size > shuffled.length) {
            return resolve({ success: false });
        }

        const TIME_LIMIT = 30_000;
        const answeredCorrectly = new Set();
        let finished = false;

        let index = 0;

        for (const id of userIds) {
            const question = shuffled[index++];
            try {
                const user = await client.users.fetch(id);

                const dm = await user.send(
                    `**Heist Quiz**\n\n${question.question}\n\nReply within **30 seconds**.`
                );

                const collector = dm.channel.createMessageCollector({
                    filter: msg => msg.author.id === id,
                    time: TIME_LIMIT,
                    max: 1
                });

                collector.on("collect", msg => {
                    if (
                        msg.content.trim().toLowerCase() ===
                        question.answer.toLowerCase()
                    ) {
                        answeredCorrectly.add(id);
                    } else if (!finished) {
                        finished = true;
                        return resolve({ success: false });
                    }

                    if (
                        answeredCorrectly.size === userIds.size &&
                        !finished
                    ) {
                        finished = true;
                        return resolve({ success: true });
                    }
                });

                collector.on("end", collected => {
                    if (collected.size === 0 && !finished) {
                        finished = true;
                        return resolve({ success: false });
                    }
                });
            } catch {
                if (!finished) {
                    finished = true;
                    return resolve({ success: false });
                }
            }
        }
    });
}

const REQUIRED_ITEMS = ["metal", "electronic", "explosive"];

async function buildUserList(guild, userIds) {
    const names = [];

    for (const id of userIds) {
        try {
            const member = await guild.members.fetch(id);
            names.push(member.user.username);
        } catch {
            names.push("Unknown User");
        }
    }

    return names.join(",");
}

async function dmUsers(client, userIds, content) {
    for (const id of userIds) {
        try {
            const user = await client.users.fetch(id);
            await user.send(content);
        } catch {
            // User has DMs closed or blocked the bot — ignore
        }
    }
}

function hasRequiredCombinedInventory(db, userIds) {
    const required = ["metal", "electronic", "explosive"];

    // Track who can provide what
    const providers = {
        metal: null,
        electronic: null,
        explosive: null
    };

    // Cache inventories so we don't re-query
    const inventories = new Map();

    // First pass: find providers
    for (const userId of userIds) {
        const user = db
            .prepare("SELECT inventory FROM users WHERE id = ?")
            .get(userId);

        if (!user || !user.inventory) continue;

        const items = user.inventory.split(",");
        inventories.set(userId, items);

        for (const item of required) {
            if (!providers[item] && items.includes(item)) {
                providers[item] = userId;
            }
        }
    }

    // Check if all requirements are met
    for (const item of required) {
        if (!providers[item]) {
            return {
                success: false,
                missing: item
            };
        }
    }

    // Second pass: remove one item from each provider
    for (const item of required) {
        const userId = providers[item];
        const items = inventories.get(userId);

        const index = items.indexOf(item);
        if (index !== -1) {
            items.splice(index, 1);
        }

        const newInventory = items.join(",");

        db.prepare("UPDATE users SET inventory = ? WHERE id = ?")
            .run(newInventory, userId);
    }

    return { success: true };
}

module.exports = {
    name: "heist",
    async execute(message) {

        const userId = message.author.id
        
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
        if (!user) {
            return message.reply("You are not registered! Use `~register` to use the economics feature.");
        }

        const crime2 = db.prepare("SELECT * FROM crime WHERE id = ?").get(userId);
        if (!crime2) {
            db.prepare("INSERT INTO crime (id, xp, heat, heist_cooldown, robbery_cooldown, petty_cooldown, rob_work_count, heist_work_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(userId, 0, 0, 0, 0, 0, 15, 30);
        }

        const crime = db.prepare("SELECT * FROM crime WHERE id = ?").get(userId);

        if (crime.heist_work_count < 30) {
            return message.reply(`You need to work 30 times in between heists! You have worked **${crime.heist_work_count}** times since you last commited a heist.`)
        }

        const cooldown = db.prepare("SELECT * FROM cooldowns WHERE id = ?").get(userId);
        const currentTime = Date.now();
        const farmDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

        if (cooldown && cooldown.farm_start && currentTime < cooldown.farm_start + farmDuration) {
            const timeLeft = ((cooldown.farm_start + farmDuration - currentTime) / 60000).toFixed(1);
            return message.reply(`You cannot commit crime while using your factory! Your factory will be ready for collection in **${timeLeft} minutes**.`);
        }

        const cooldownTime = 86400000; // 1 minute in milliseconds
        const lastUsed = crime.heist_cooldown
        const now = Date.now();

        if (lastUsed && now - lastUsed < cooldownTime) {
            const remainingTime = ((cooldownTime - (now - lastUsed)) / 3600000).toFixed(1);
            return message.reply(`You need to wait ${remainingTime} more hours before attempting a heist again!`);
        }

        const joinedUserIds = new Set();
        joinedUserIds.add(message.author.id);

        const embed = new EmbedBuilder()
            .setTitle("Join Heist")
            .setDescription(
                await buildUserList(message.guild, joinedUserIds)
            )
            .setColor("#85BB65")
            .setFooter({text: "PARTICIPATING USERS **MUST** BE ABLE TO RECIEVE DMS FROM THE BOT!!"});

        const joinButton = new ButtonBuilder()
            .setCustomId("join_list")
            .setLabel("Join")
            .setEmoji("💰")
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(joinButton);

        const sentMessage = await message.channel.send({
            embeds: [embed],
            components: [row]
        });

        const collector = sentMessage.createMessageComponentCollector({
            time: 30_000
        });

        collector.on("collect", async interaction => {

            const joinId = interaction.user.id
            const crime2 = db.prepare("SELECT * FROM crime WHERE id = ?").get(joinId);
            if (!crime2) {
                db.prepare("INSERT INTO crime (id, xp, heat, heist_cooldown, robbery_cooldown, petty_cooldown, rob_work_count, heist_work_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(joinId, 0, 0, 0, 0, 0, 15, 30);
            }
            if (crime2.heist_work_count < 30) {
                return interaction.reply({
                    content: `You cannot join this heist, as you have not worked at least 30 times since your last heist. You have worked ${crime2.heist_work_count} times since your last heist.`,
                    ephemeral: true
                });
            }

            const cooldown = db.prepare("SELECT * FROM cooldowns WHERE id = ?").get(userId);
            const currentTime = Date.now();
            const farmDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

            if (cooldown && cooldown.farm_start && currentTime < cooldown.farm_start + farmDuration) {
                const timeLeft = ((cooldown.farm_start + farmDuration - currentTime) / 60000).toFixed(1);
                return message.reply(`You cannot commit crime while using your factory! Your factory will be ready for collection in **${timeLeft} minutes**.`);
            }

            const cooldownTime = 86400000; // 1 minute in milliseconds
            const lastUsed = crime.heist_cooldown
            const now = Date.now();

            if (lastUsed && now - lastUsed < cooldownTime) {
                const remainingTime = ((cooldownTime - (now - lastUsed)) / 3600000).toFixed(1);
                return message.reply(`You need to wait ${remainingTime} more hours before attempting a heist again!`);
            }

            if (joinedUserIds.has(interaction.user.id)) {
                return interaction.reply({
                    content: "You have already joined this heist!",
                    ephemeral: true
                });
            }

            joinedUserIds.add(interaction.user.id);

            embed.setDescription(
                await buildUserList(interaction.guild, joinedUserIds)
            );

            await interaction.update({
                embeds: [embed]
            });
        });

        collector.on("end", async () => {
            joinButton.setDisabled(true);

            await sentMessage.edit({
                components: [
                    new ActionRowBuilder().addComponents(joinButton)
                ]
            });

            const result = hasRequiredCombinedInventory(db, joinedUserIds);

            if (joinedUserIds.size < 2) {
                await sentMessage.reply({
                    content: "Not enough people joined this heist. At least **2** are required."
                });
            } else if (!result.success) {
                return sentMessage.reply(
                    `Missing required items! The combined party must have at least one metal (${result.counts.metal} present), at least one electronic (${result.counts.electronic} present), and at least one explosive (${result.counts.explosive} present)`
                );
            } else {
                await sentMessage.reply({
                content:
                    `**Final Heist List:** ${await buildUserList(message.guild, joinedUserIds)}. A bomb has been crafted using one metal, one electronic, and one explosive. Further instructions will be sent to particpating users through DMs soon.`
                });

                const resetCooldown = db.prepare("UPDATE crime SET robbery_cooldown = ? WHERE id = ?");
                const resetStmt = db.prepare("UPDATE crime SET heist_work_count = 0 WHERE id = ?");
                const newHeat = db.prepare("UPDATE crime SET heat = 99 WHERE id = ?");
                for (const userId of joinedUserIds) {
                    resetStmt.run(userId);
                    newHeat.run(userId);
                    resetCooldown.run(now, userId);
                }

                const quiz = await runHeistQuiz(message.client, joinedUserIds, message.channel.id);
                if (quiz.success === true) {
                    const placeholders = [...joinedUserIds].map(() => "?").join(",");
                    const totalXP = db
                        .prepare(`SELECT SUM(xp) as total FROM crime WHERE id IN (${placeholders})`)
                        .get(...joinedUserIds).total;
                    
                    if (totalXP <= (40000*joinedUserIds.size)) {
                        chance = 4
                        maxRew = 7500
                    } else if ((40000*joinedUserIds.size) < totalXP <= (200000*joinedUserIds.size)) {
                        chance = 5
                        maxRew = 10000
                    } else if ((200000*joinedUserIds.size) < totalXP <= (500000*joinedUserIds.size)) {
                        chance = 6
                        maxRew = 12500
                    } else if ((500000*joinedUserIds.size) < totalXP) {
                        chance = 7
                        maxRew = 15000
                    }

                    const newMessage = await sentMessage.reply("**Success!** Everyone answered correctly. The heist continues.");

                    const catchChance = getRandomNumberBetween(0, chance)

                    if (catchChance == 1) {
                        let wage = getRandomNumberBetween(-2500, -7500);
                        for (const userId of joinedUserIds) {
                            const crime2 = db.prepare("SELECT * FROM crime WHERE id = ?").get(userId);
                            const user2 = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
                            const newXp = crime2.xp + wage;
                            const newBal = user2.balance + wage
                            db.prepare("UPDATE crime SET xp = ? WHERE id = ?").run(newXp, userId)
                            db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBal, userId)
                        }
                        await newMessage.reply(`The heist gang successfully broke into Molecular Multiverse Systems, but were discovered by security and were each fined **$${wage}**!`);
                    } else {
                        let wage = getRandomNumberBetween(5000, maxRew);
                        for (const userId of joinedUserIds) {
                            const crime2 = db.prepare("SELECT * FROM crime WHERE id = ?").get(userId);
                            const user2 = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
                            const newXp = crime2.xp + wage;
                            const newBal = user2.balance + wage
                            db.prepare("UPDATE crime SET xp = ? WHERE id = ?").run(newXp, userId)
                            db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBal, userId)
                        }
                        await newMessage.reply(`The heist gang successfully broke into Molecular Multiverse Systems and made out with **$${wage}** each!`);
                    }
                    
                } else if (quiz.success === false) {
                    const newMessage = await sentMessage.reply("**Heist Failed!** Someone answered incorrectly or ran out of time.");
                } else {
                    return sentMessage.reply("Something went wrong with the heist planning and it will not be continued (error)")
                }
            }
        });
    }
};
