const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Verifică sau adaugă un utilizator pe blacklist.'),
    async execute(interaction) {
        // Răspundem imediat ca Discord să nu mai dea eroarea cu "did not respond"
        await interaction.reply({ 
            content: '✅ Comanda /blacklist funcționează corect pe server!', 
            ephemeral: false 
        });
    },
};
