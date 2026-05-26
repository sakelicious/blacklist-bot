const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Adaugă un jucător pe lista neagră.')
        .addStringOption(option => 
            option.setName('nume')
                .setDescription('Numele caracterului')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('level')
                .setDescription('Nivelul jucătorului')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('regat')
                .setDescription('Regatul (Roșu, Galben, Albastru)')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('motiv')
                .setDescription('Motivul adăugării pe blacklist')
                .setRequired(true)),

    async execute(interaction) {
        // Preluăm datele introduse de utilizator în comandă
        const nume = interaction.options.getString('nume');
        const level = interaction.options.getInteger('level');
        const regat = interaction.options.getString('regat');
        const motiv = interaction.options.getString('motiv');

        // Construim design-ul grafic (Embed-ul) exact ca în poza ta
        const blacklistEmbed = new EmbedBuilder()
            .setColor('#FF0000') // Linia roșie din stânga
            .setTitle('🚫 BLACKLIST')
            .setDescription('⚠️ Player blacklistat.')
            .addFields(
                { name: '👤 Nume', value: `\`${nume}\``, inline: true },
                { name: '⭐ Level', value: `\`${level}\``, inline: true },
                { name: '🏴 Regat', value: `\`${regat}\``, inline: true },
                { name: '📝 Motiv', value: `\`${motiv}\``, inline: false }
            )
            .setFooter({ text: 'Blacklist System' })
            .setTimestamp(); // Adaugă ora curentă jos

        // Trimitem Embed-ul pe canal
        await interaction.reply({ embeds: [blacklistEmbed] });
    },
};
