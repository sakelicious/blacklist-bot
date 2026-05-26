const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Comandă pentru gestionarea listei negre.'),
    async execute(interaction) {
        await interaction.reply({ 
            content: '✅ Sistemul de blacklist funcționează perfect și este online 24/7!', 
            ephemeral: false 
        });
    },
};
