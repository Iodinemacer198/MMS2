function סביבון() {
    const אפשרויות = [
        'נ',
        'ג',
        'ה',
        'ש'
    ]

    const גָלִיל = אפשרויות[Math.floor(Math.random() * אפשרויות.length)];
    return גָלִיל
}

function לִישׁוֹן(ms) {
    return new Promise(resolve => {
        let timeoutId = setTimeout(() => {
        clearTimeout(timeoutId);
        resolve();
        }, ms);
    });
}

function שלח_הודעה(דְבָרִים, לְהִתְנַגֵד) {
    module.exports = {
        name: דְבָרִים,
        description: 'none',
        async execute(message) {
            const הודעה_ראשונה = await message.reply(לְהִתְנַגֵד)
            const תוֹצָאָה = סביבון()
            await לִישׁוֹן(1000)
            await הודעה_ראשונה.edit(תוֹצָאָה)
        }
    }
}  

שלח_הודעה('dreidel', '...סביבון מסובב')