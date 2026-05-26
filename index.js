const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Botul este online!');
});

app.listen(port, () => {
  console.log(`Serverul web rulează pe portul ${port}`);
});

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, REST, Routes, ActivityType } = require('discord.js');

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

client.once('ready', async () => {
    console.log(`✅ Bot online: ${client.user.tag}`);

    // --- SISTEM DE STATUS DINAMIC (ALTERNEAZĂ PROPOZIȚIILE) ---
    const statuses = [
        '/blacklist',
    ];
    
    let index = 0;
    
    // Setează primul status imediat ce pornește botul
    client.user.setActivity(statuses[index], { type: ActivityType.Playing });
    
    // Schimbă statusul automat la fiecare 10 secunde
    setInterval(() => {
        index = (index + 1) % statuses.length;
        client.user.setActivity(statuses[index], { type: ActivityType.Playing });
    }, 10000); // 10000 milisecunde = 10 secunde
    // ---------------------------------------------------------

    // Înregistrare automată a comenzilor de tip Slash în Discord API
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    const commandsData = [];
    
    client.commands.forEach(command => {
        commandsData.push(command.data.toJSON());
    });

    try {
        console.log('🔄 Se încarcă comenzile de tip Slash în Discord...');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commandsData }
        );
        console.log('🚀 Toate comenzile au fost înregistrate cu succes în Discord!');
    } catch (error) {
        console.error('❌ Eroare la înregistrarea comenzilor:', error);
    }
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
