require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

// Reconstituim calea absolută către folderul 'commands' pentru a evita erorile pe hosting (Linux)
const commandsPath = path.join(__dirname, 'commands');

// Verificăm dacă folderul există. Dacă NU există, îl creăm automat.
if (!fs.existsSync(commandsPath)) {
    fs.mkdirSync(commandsPath);
}

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[⚠️ ATENȚIE] Fișierul ${file} lipsește de proprietățile "data" sau "execute".`);
    }
}

client.once('ready', () => {
    console.log(`✅ Bot online: ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: '❌ A apărut o eroare la executarea acestei comenzi.',
            ephemeral: true
        });
    }
});

client.login(process.env.TOKEN);
