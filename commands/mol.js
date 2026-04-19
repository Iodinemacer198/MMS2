const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'nomol',
    description: "-",
    async execute(message, args) {
        if (!args.length) {
            message.reply("Please use a valid argument! A list can be found at https://pastebin.com/xChJn3rC")
        }
        const call1 = args[0]
        const call = call1.toLowerCase();

        if (call === 'nh4o3') {
            const embed = new EmbedBuilder()
                .setTitle("Ammonium Nitrate")
                .setDescription("__Formula:__ NH₄NO₃\n__Molar Mass:__ 80.043\n__Use:__ High-nitrogen fertilizer")
                .setColor("#FFFFFF")
                .setImage("https://media.discordapp.net/attachments/1186079899530825794/1228508614935842846/220px-Ammonium_Nitrate.png?ex=662c4cce&is=6619d7ce&hm=b0a60f38ce49a3c58e77384038304a619b2c5a13225da5954c7af06208d139f4&=&format=webp&quality=lossless")
                .setURL("https://en.wikipedia.org/wiki/Ammonium_nitrate")
            message.reply({embeds:[embed]})
        }
        if (call === 'mgso4') {
            const embed = new EmbedBuilder()
                .setTitle("Magnesium Sulfate")
                .setDescription("__Formula:__ NH₄NO₃\n__Molar Mass:__ 80.043\n__Use:__ High-nitrogen fertilizer")
                .setColor("#FFFFFF")
                .setImage("https://media.discordapp.net/attachments/1186079899530825794/1228508614935842846/220px-Ammonium_Nitrate.png?ex=662c4cce&is=6619d7ce&hm=b0a60f38ce49a3c58e77384038304a619b2c5a13225da5954c7af06208d139f4&=&format=webp&quality=lossless")
                .setURL("https://en.wikipedia.org/wiki/Ammonium_nitrate")
            message.reply({embeds:[embed]})
        }
        if (call === 'bicl3') {
            const embed = new EmbedBuilder()
                .setTitle("Bismuth Chloride")
                .setDescription("__Formula:__ BiCl₃\n__Molar Mass:__ 315.33\n__Use:__ Catalyst in organic synthesis")
                .setColor("#FFFFFF")
                .setImage("https://media.discordapp.net/attachments/1186079899530825794/1228659787852415107/images.png?ex=662cd998&is=661a6498&hm=b58df6e283cb5c3590b80d823f32e7c3d8f1d81d7d6be5b458b1c1eb7ef0b6a4&=&format=webp&quality=lossless&width=281&height=281")
                .setURL("https://en.wikipedia.org/wiki/Bismuth_chloride")
            message.reply({embeds:[embed]})
        }
        if (call === 'koh') {
            const embed = new EmbedBuilder()
                .setTitle("Potassium Hydroxide")
                .setDescription("__Formula:__ KOH\n__Molar Mass:__ 56\n__Use:__ Several niche industrial applications")
                .setColor("#FFFFFF")
                .setImage("https://media.discordapp.net/attachments/1186079899530825794/1228664715492851732/220px-Potassium_hydroxide.png?ex=662cde2f&is=661a692f&hm=fd8ee6c15cc19c49c21184354eb74a83eab6594557145557cf043600e70f48a0&=&format=webp&quality=lossless&width=275&height=272")
                .setURL("https://en.wikipedia.org/wiki/Potassium_hydroxide")
            message.reply({embeds:[embed]})
        }
        if (call === 'n2h4') {
            const embed = new EmbedBuilder()
                .setTitle("Hydrazine")
                .setDescription("__Formula:__ N₂H₄\n__Molar Mass:__ 32.046\n__Use:__ Rocket propellant")
                .setColor("#FFFFFF")
                .setImage("https://media.discordapp.net/attachments/1227785251053502465/1228711179514413209/220px-Sample_of_hydrazine_hydrate.png?ex=662d0975&is=661a9475&hm=1648a959d4a46db3a268f408a975467b012338eccc69d1cdfaea250b64be231a&=&format=webp&quality=lossless&width=275&height=410")
                .setURL("https://en.wikipedia.org/wiki/Hydrazine")
            message.reply({embeds:[embed]})
        }
        if (call === 'h2so4') {
            const embed = new EmbedBuilder()
                .setTitle("Sulfuric Acid")
                .setDescription("__Formula:__ H₂SO₄\n__Molar Mass:__ 98\n__Use:__ Production of phosphate fertilizers")
                .setColor("#FFFFFF")
                .setImage("https://media.discordapp.net/attachments/1227785251053502465/1228712897333432340/220px-Sulphuric_acid_on_a_piece_of_towel.png?ex=662d0b0f&is=661a960f&hm=a64f8be0c5ca199337c81c2736fc151ca7fa5f241cc60bfbbae56ef2cb7142bd&=&format=webp&quality=lossless&width=275&height=206")
                .setURL("https://en.wikipedia.org/wiki/Sulfuric_acid")
            message.reply({embeds:[embed]})
        }
        if (call === 'nacl') {
            const embed = new EmbedBuilder()
                .setTitle()
                .setDescription()
                .setColor()
                .setImage()
                .setURL()
            message.reply({embeds:[embed]})
        }
        if (call === 'nioh2') {
            const embed = new EmbedBuilder()
                .setTitle()
                .setDescription()
                .setColor()
                .setImage()
                .setURL()
            message.reply({embeds:[embed]})
        }
        if (call === 'h2s') {
            const embed = new EmbedBuilder()
                .setTitle()
                .setDescription()
                .setColor()
                .setImage()
                .setURL()
            message.reply({embeds:[embed]})
        }
        if (call === 'c6h5i') {
            const embed = new EmbedBuilder()
                .setTitle()
                .setDescription()
                .setColor()
                .setImage()
                .setURL()
            message.reply({embeds:[embed]})
        }
        if (call === 'gd2o3') {
            const embed = new EmbedBuilder()
                .setTitle()
                .setDescription()
                .setColor()
                .setImage()
                .setURL()
            message.reply({embeds:[embed]})
        }
        if (call === 'bacl2') {
            const embed = new EmbedBuilder()
                .setTitle()
                .setDescription()
                .setColor()
                .setImage()
                .setURL()
            message.reply({embeds:[embed]})
        }
        if (call === 'caco3') {
            const embed = new EmbedBuilder()
                .setTitle()
                .setDescription()
                .setColor()
                .setImage()
                .setURL()
            message.reply({embeds:[embed]})
        }
        if (call === 'h3bo3') {
            const embed = new EmbedBuilder()
                .setTitle()
                .setDescription()
                .setColor()
                .setImage()
                .setURL()
            message.reply({embeds:[embed]})
        }
        if (call === 'mgcl2') {
            const embed = new EmbedBuilder()
                .setTitle()
                .setDescription()
                .setColor()
                .setImage()
                .setURL()
            message.reply({embeds:[embed]})
        }
        if (call === 'nacn') {
            const embed = new EmbedBuilder()
                .setTitle()
                .setDescription()
                .setColor()
                .setImage()
                .setURL()
            message.reply({embeds:[embed]})
        }
        if (call === 'haucl4') {
            const embed = new EmbedBuilder()
                .setTitle()
                .setDescription()
                .setColor()
                .setImage()
                .setURL()
            message.reply({embeds:[embed]})
        }
        if (call === 'na2so4') {
            const embed = new EmbedBuilder()
                .setTitle()
                .setDescription()
                .setColor()
                .setImage()
                .setURL()
            message.reply({embeds:[embed]})
        }
        if (call === 'o3') {
            const embed = new EmbedBuilder()
                .setTitle()
                .setDescription()
                .setColor()
                .setImage()
                .setURL()
            message.reply({embeds:[embed]})
        }
    }
}