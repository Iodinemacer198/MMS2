const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const clientId = '';
const token = '';

// Function to recursively get all command files from subdirectories
function getCommandFiles(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getCommandFiles(fullPath)); // Recurse into subdirectory
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(fullPath); // Add .js files
    }
  }
  return files;
}

const globalCommands = [];
const guildCommands = [];
const commandsPath = path.join(__dirname, 'slash-commands');
const commandFiles = getCommandFiles(commandsPath);

for (const filePath of commandFiles) {
  const command = require(filePath);

  // Check if the command file has a valid structure
  if (!command || !command.data || !command.data.name) {
    console.warn(`Skipping invalid command file: ${filePath}`);
    continue; // Skip this file if it's not properly structured
  }

  // Separate the "verify" command for guild-specific deployment
  if (command.data.name === 'verify') {
    guildCommands.push(command.data.toJSON());
  } else {
    globalCommands.push(command.data.toJSON());
  }
}

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    // Deploy global commands
    if (globalCommands.length > 0) {
      await rest.put(Routes.applicationCommands(clientId), { body: globalCommands });
      console.log(`Successfully registered ${globalCommands.length} global application (/) commands.`);
    }

    // Deploy guild-specific commands
    const guildId = '700100389575458897'; // Replace with your specific server ID
    if (guildCommands.length > 0) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: guildCommands });
      console.log(`Successfully registered ${guildCommands.length} guild-specific application (/) commands.`);
    }

    const total = guildCommands.length + globalCommands.length;
    console.log(`Finished refreshing ${total} application (/) commands.`);
  } catch (error) {
    console.error('Error deploying commands:', error);
  }
})();
