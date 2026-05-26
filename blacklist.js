const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Verifică sau adaugă un utilizator pe blacklist.'),
    async execute(interaction) {
        // Trimitem un răspuns imediat ca Discord să vadă că botul e activ
        await interaction.reply({ 
            content: '✅ Comanda /blacklist funcționează perfect!', 
            ephemeral: false 
        });
    },
};
