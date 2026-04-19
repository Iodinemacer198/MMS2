const fs = require('fs');
const { AttachmentBuilder } = require('discord.js');

const flags = [
    { nation: 'Afghanistan', imageFile: './flags/afghanistan.webp' },
    { nation: 'Albania', imageFile: './flags/albania.webp' },
    { nation: 'Algeria', imageFile: './flags/algeria.webp' },
    { nation: 'Andorra', imageFile: './flags/andorra.webp' },
    { nation: 'Angola', imageFile: './flags/angola.webp' },
    { nation: 'Antigua', imageFile: './flags/antigua.png' },
    { nation: 'Argentina', imageFile: './flags/argentina.webp' },
    { nation: 'Armenia', imageFile: './flags/armenia.png' },
    { nation: 'Australia', imageFile: './flags/australia.png' },
    { nation: 'Austria', imageFile: './flags/austria.png' },
    { nation: 'Azerbaijan', imageFile: './flags/azerbaijan.webp' },
    { nation: 'Bahamas', imageFile: './flags/bahamas.png' },
    { nation: 'Bahrain', imageFile: './flags/bahrain.webp' },
    { nation: 'Bangladesh', imageFile: './flags/bangladesh.webp' },
    { nation: 'Barbados', imageFile: './flags/barbados.webp' },
    { nation: 'Belarus', imageFile: './flags/belarus.png' },
    { nation: 'Belgium', imageFile: './flags/belgium.webp' },
    { nation: 'Belize', imageFile: './flags/belize.webp' },
    { nation: 'Benin', imageFile: './flags/benin.webp' },
    { nation: 'Bhutan', imageFile: './flags/bhutan.png' },
    { nation: 'Bolivia', imageFile: './flags/bolivia.webp' },
    { nation: 'Bosnia', imageFile: './flags/bosnia.png' },
    { nation: 'Botswana', imageFile: './flags/botswana.png' },
    { nation: 'Brazil', imageFile: './flags/brazil.webp' },
    { nation: 'Brunei', imageFile: './flags/brunei.webp' },
    { nation: 'Bulgaria', imageFile: './flags/bulgaria.png' },
    { nation: 'Burkina Faso', imageFile: './flags/burkina faso.webp' },
    { nation: 'Burundi', imageFile: './flags/burundi.webp' },
    { nation: 'Cabo Verde', imageFile: './flags/cabo verde.webp' },
    { nation: 'Cambodia', imageFile: './flags/cambodia.webp' },
    { nation: 'Cameroon', imageFile: './flags/cameroon.webp' },
    { nation: 'Canada', imageFile: './flags/canada.webp' },
    { nation: 'Central African Republic', imageFile: './flags/car.webp' },
    { nation: 'Chad', imageFile: './flags/chad.webp' },
    { nation: 'Chile', imageFile: './flags/chile.png' },
    { nation: 'China', imageFile: './flags/china.webp' },
    { nation: 'Colombia', imageFile: './flags/colombia.png' },
    { nation: 'Comoros', imageFile: './flags/comoros.webp' },
    { nation: 'Democratic Republic of the Congo', imageFile: './flags/drc.webp' },
    { nation: 'Republic of the Congo', imageFile: './flags/rc.png' },
    { nation: 'Costa Rica', imageFile: './flags/costarica.webp' },
    { nation: 'Ivory Coast', imageFile: './flags/ivorycoast.webp' },
    { nation: 'Croatia', imageFile: './flags/croatia.webp' },
    { nation: 'Cuba', imageFile: './flags/cuba.webp' },
    { nation: 'Cyprus', imageFile: './flags/cyprus.webp' },
    { nation: 'Czech Republic', imageFile: './flags/czechia.png' },
    { nation: 'Denmark', imageFile: './flags/denmark.png' },
    { nation: 'Djibouti', imageFile: './flags/djibouti.webp' },
    { nation: 'Dominica', imageFile: './flags/dominica.png' },
    { nation: 'Dominican Republic', imageFile: './flags/dominican republic.png' },
    { nation: 'East Timor', imageFile: './flags/east timor.webp' },
    { nation: 'Ecuador', imageFile: './flags/ecuador.webp' },
    { nation: 'Egypt', imageFile: './flags/egypt.webp' },
    { nation: 'El Salvador', imageFile: './flags/elsalvador.png' },
    { nation: 'Equatorial Guinea', imageFile: './flags/equatorial guinea.png' },
    { nation: 'Eritrea', imageFile: './flags/eritrea.webp' },
    { nation: 'Estonia', imageFile: './flags/estonia.webp' },
    { nation: 'Eswatini', imageFile: './flags/eswatini.png' },
    { nation: 'Ethiopia', imageFile: './flags/ethiopia.png' },
    { nation: 'Fiji', imageFile: './flags/fiji.webp' },
    { nation: 'Finland', imageFile: './flags/finland.png' },
    { nation: 'France', imageFile: './flags/france.png' },
    { nation: 'Gabon', imageFile: './flags/gabon.webp' },
    { nation: 'Gambia', imageFile: './flags/gambia.webp' },
    { nation: 'Georgia', imageFile: './flags/georgia.png' },
    { nation: 'Germany', imageFile: './flags/germany.webp' },
    { nation: 'Ghana', imageFile: './flags/ghana.png' },
    { nation: 'Greece', imageFile: './flags/greece.png' },
    { nation: 'Grenada', imageFile: './flags/grenada.png' },
    { nation: 'Guatemala', imageFile: './flags/guatemala.webp' },
    { nation: 'Guinea', imageFile: './flags/guinea.webp' },
    { nation: 'Guinea-Bissau', imageFile: './flags/guinea-bissau.webp' },
    { nation: 'Guyana', imageFile: './flags/guyana.png' },
    { nation: 'Haiti', imageFile: './flags/haiti.png' },
    { nation: 'Honduras', imageFile: './flags/honduras.webp' },
    { nation: 'Hungary', imageFile: './flags/hungary.webp' },
    { nation: 'Iceland', imageFile: './flags/iceland.webp' },
    { nation: 'India', imageFile: './flags/india.png' },
    { nation: 'Indonesia', imageFile: './flags/indonesia.webp' },
    { nation: 'Iran', imageFile: './flags/iran.png' },
    { nation: 'Iraq', imageFile: './flags/iraq.webp' },
    { nation: 'Ireland', imageFile: './flags/ireland.webp' },
    { nation: 'Israel', imageFile: './flags/israel.webp' },
    { nation: 'Italy', imageFile: './flags/italy.webp' },
    { nation: 'Jamaica', imageFile: './flags/jamaica.webp' },
    { nation: 'Japan', imageFile: './flags/japan.png' },
    { nation: 'Jordan', imageFile: './flags/jordan.webp' },
    { nation: 'Kazakhstan', imageFile: './flags/kazakhstan.png' },
    { nation: 'Kenya', imageFile: './flags/kenya.png' },
    { nation: 'Kiribati', imageFile: './flags/kiribati.webp' },
    { nation: 'North Korea', imageFile: './flags/northkorea.webp' },
    { nation: 'South Korea', imageFile: './flags/southkorea.webp' },
    { nation: 'Kosovo', imageFile: './flags/kosovo.webp' },
    { nation: 'Kuwait', imageFile: './flags/kuwait.webp' },
    { nation: 'Kyrgyzstan', imageFile: './flags/kyrgyzstan.png' },
    { nation: 'Laos', imageFile: './flags/laos.png' },
    { nation: 'Latvia', imageFile: './flags/latvia.webp' },
    { nation: 'Lebanon', imageFile: './flags/lebanon.png' },
    { nation: 'Lesotho', imageFile: './flags/lesotho.png' },
    { nation: 'Liberia', imageFile: './flags/liberia.webp' },
    { nation: 'Libya', imageFile: './flags/libya.webp' },
    { nation: 'Liechtenstein', imageFile: './flags/liechtenstein.webp' },
    { nation: 'Lithuania', imageFile: './flags/lithuania.png' },
    { nation: 'Luxembourg', imageFile: './flags/luxembourg.webp' },
    { nation: 'Madagascar', imageFile: './flags/madagascar.webp' },
    { nation: 'Malawi', imageFile: './flags/malawi.png' },
    { nation: 'Malaysia', imageFile: './flags/malaysia.webp' },
    { nation: 'Maldives', imageFile: './flags/maldives.png' },
    { nation: 'Mali', imageFile: './flags/mali.webp' },
    { nation: 'Malta', imageFile: './flags/malta.webp' },
    { nation: 'Marshall Islands', imageFile: './flags/marshall islands.webp' },
    { nation: 'Mauritania', imageFile: './flags/mauritania.webp' },
    { nation: 'Mauritius', imageFile: './flags/mauritius.png' },
    { nation: 'Mexico', imageFile: './flags/mexico.webp' },
    { nation: 'Micronesia', imageFile: './flags/fsm.png' },
    { nation: 'Moldova', imageFile: './flags/moldova.webp' },
    { nation: 'Monaco', imageFile: './flags/monaco.png' },
    { nation: 'Mongolia', imageFile: './flags/mongolia.webp' },
    { nation: 'Montenegro', imageFile: './flags/montenegro.webp' },
    { nation: 'Morroco', imageFile: './flags/morocco.webp' },
    { nation: 'Mozambique', imageFile: './flags/mozambique.webp' },
    { nation: 'Myanmar', imageFile: './flags/myanmar.webp' },
    { nation: 'Namibia', imageFile: './flags/namibia.png' },
    { nation: 'Nauru', imageFile: './flags/nauru.webp' },
    { nation: 'Nepal', imageFile: './flags/nepal.png' },
    { nation: 'Netherlands', imageFile: './flags/netherlands.png' },
    { nation: 'New Zealand', imageFile: './flags/new zealand.png' },
    { nation: 'Nicaragua', imageFile: './flags/nicaragua.webp' },
    { nation: 'Niger', imageFile: './flags/niger.webp' },
    { nation: 'Nigeria', imageFile: './flags/nigeria.webp' },
    { nation: 'North Macedonia', imageFile: './flags/northmacedonia.png' },
    { nation: 'Norway', imageFile: './flags/norway.png' },
    { nation: 'Oman', imageFile: './flags/oman.webp' },
    { nation: 'Pakistan', imageFile: './flags/pakistan.png' },
    { nation: 'Palau', imageFile: './flags/palau.webp' },
    { nation: 'Palestine', imageFile: './flags/palestine.png' },
    { nation: 'Panama', imageFile: './flags/panama.webp' },
    { nation: 'Papua New Guinea', imageFile: './flags/png.webp' },
    { nation: 'Paraguay', imageFile: './flags/paraguay.webp' },
    { nation: 'Peru', imageFile: './flags/peru.webp' },
    { nation: 'Philippines', imageFile: './flags/philippines.png' },
    { nation: 'Poland', imageFile: './flags/poland.png' },
    { nation: 'Portugal', imageFile: './flags/portugal.webp' },
    { nation: 'Qatar', imageFile: './flags/qatar.webp' },
    { nation: 'Romania', imageFile: './flags/romania.webp' },
    { nation: 'Russia', imageFile: './flags/russia.png' },
    { nation: 'Rwanda', imageFile: './flags/rwanda.webp' },
    { nation: 'Saint Kitts and Nevis', imageFile: './flags/skn.png' },
    { nation: 'Saint Lucia', imageFile: './flags/saint lucia.webp' },
    { nation: 'Saint Vincent and the Grenadines', imageFile: './flags/svg.png' },
    { nation: 'Samoa', imageFile: './flags/samoa.webp' },
    { nation: 'San Marino', imageFile: './flags/sanmarino.png' },
    { nation: 'Sao Tome and Principe', imageFile: './flags/stp.webp' },
    { nation: 'Saudi Arabia', imageFile: './flags/saudiarabia.webp' },
    { nation: 'Senegal', imageFile: './flags/senegal.webp' },
    { nation: 'Serbia', imageFile: './flags/serbia.webp' },
    { nation: 'Seychelles', imageFile: './flags/seychelles.webp' },
    { nation: 'Sierra Leone', imageFile: './flags/sierraleone.webp' },
    { nation: 'Singapore', imageFile: './flags/singapore.png' },
    { nation: 'Slovakia', imageFile: './flags/slovakia.webp' },
    { nation: 'Slovenia', imageFile: './flags/slovenia.webp' },
    { nation: 'Solomon Islands', imageFile: './flags/solomonislands.webp' },
    { nation: 'Somalia', imageFile: './flags/somalia.webp' },
    { nation: 'South Africa', imageFile: './flags/sa.webp' },
    { nation: 'Spain', imageFile: './flags/spain.webp' },
    { nation: 'Sri Lanka', imageFile: './flags/srilanka.webp' },
    { nation: 'Sudan', imageFile: './flags/sudan.webp' },
    { nation: 'South Sudan', imageFile: './flags/southsudan.webp' },
    { nation: 'Suriname', imageFile: './flags/suriname.webp' },
    { nation: 'Sweden', imageFile: './flags/sweden.webp' },
    { nation: 'Switzerland', imageFile: './flags/switzerland.webp' },
    { nation: 'Syria', imageFile: './flags/syria.webp' },
    { nation: 'Taiwan', imageFile: './flags/taiwan.webp' },
    { nation: 'Tajikistan', imageFile: './flags/tajikistan.webp' },
    { nation: 'Tanzania', imageFile: './flags/tanzinia.webp' },
    { nation: 'Thailand', imageFile: './flags/thailand.webp' },
    { nation: 'Togo', imageFile: './flags/togo.webp' },
    { nation: 'Tonga', imageFile: './flags/tonga.webp' },
    { nation: 'Trinidad and Tobago', imageFile: './flags/tnt.webp' },
    { nation: 'Tunisia', imageFile: './flags/tunisia.webp' },
    { nation: 'Turkey', imageFile: './flags/turkey.webp' },
    { nation: 'Turkmenistan', imageFile: './flags/turkmenistan.webp' },
    { nation: 'Tuvalu', imageFile: './flags/tuvalu.webp' },
    { nation: 'Uganda', imageFile: './flags/uganda.webp' },
    { nation: 'Ukraine', imageFile: './flags/ukraine.webp' },
    { nation: 'United Arab Emirates', imageFile: './flags/uae.webp' },
    { nation: 'United Kingdom', imageFile: './flags/uk.webp' },
    { nation: 'United States of America', imageFile: './flags/us.webp' },
    { nation: 'Uruguay', imageFile: './flags/uruguay.webp' },
    { nation: 'Uzbekistan', imageFile: './flags/uzbekistan.webp' },
    { nation: 'Vanuatu', imageFile: './flags/vanuatu.webp' },
    { nation: 'Vatican City', imageFile: './flags/vatican.webp' },
    { nation: 'Venezuela', imageFile: './flags/venezuela.png' },
    { nation: 'Vietnam', imageFile: './flags/vietnam.webp' },
    { nation: 'Yemen', imageFile: './flags/yemen.webp' },
    { nation: 'Zambia', imageFile: './flags/zambia.webp' },
    { nation: 'Zimbabwe', imageFile: './flags/zimbabwe.webp' },
]

module.exports = {
    name: 'flagguess',
    description: '-',
    async execute(message, args) {
        if (!args.length) {
            const randomFlag = flags[Math.floor(Math.random() * flags.length)];

            const attachment = new AttachmentBuilder(randomFlag.imageFile);

            const msg1 = await message.reply({ content: 'Guess the flag!', files: [attachment] });

            const filter = (response) => {
                return response.author.id === message.author.id;
            };

            const timeLimit = 30000; 
            message.channel.awaitMessages({ filter, max: 1, time: timeLimit, errors: ['time'] })
                .then((collected) => {
                    const syRT = /[- ]/g;
                    const guess1 = collected.first().content.trim().toLowerCase();
                    const correctAnswer1 = randomFlag.nation.toLowerCase();
                    const guess = guess1.replace(syRT, '');
                    const correctAnswer = correctAnswer1.replace(syRT, '');
                    const correctUCAnswer = randomFlag.nation

                    if (guess.includes('|||')) {
                        msg1.reply(`Nice try...`)
                        return
                    }

                    if (guess.includes('http')) {
                        msg1.reply(`Nice try...`)
                        return
                    }

                    if (guess.includes(correctAnswer)) {
                        msg1.reply(`Correct! That is the flag of ${correctUCAnswer}.`);
                    } 
                    else {
                        msg1.reply(`Incorrect. That flag is the flag of ${correctUCAnswer}.`);
                    }
                })
                .catch(() => {
                    msg1.reply('Time\'s up! No guess was given.');
            }); 
        }
    }
}