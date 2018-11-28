const Discord = require('discord.js');
const client = new Discord.Client();
const db = require('quick.db');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus('online');
    client.user.setActivity('with YouTube');
});

client.on('guildMemberAdd', async (member) => {
    const autoRole = await db.fetch(`autorole_${member.guild.id}`).catch(err => console.log(err));
    const autorole = member.guild.roles.find('name', autoRole);\
    const joinchannel = member.guild.channels.find('name', 'bot-spam');
    member.addRole(autorole);
    joinchannel.send(`Welcome to ${member.guild.name}, ${member.user.tag}!`);
});

client.on('guildMemberRemove', (member) => {
    const channel = member.guild.channels.find('name', 'bot-spam');
    channel.send(`${member.user.tag} has left ${member.guild.name}.`); 
});

client.on('message', async (message) => {
    var prefix = '!';
    var fetchedPrefix = await db.fetch(`serverPrefix_${message.guild.id}`);
    if (fetchedPrefix === null) fetchedPrefix = prefix;
    else prefix = fetchedPrefix;

    if (message.author.bot) return undefined;
    if (!message.content.startsWith(prefix)) return undefined;
    var args = message.content.slice(prefix.length).trim().split(' ');
    var command = args.shift().toLowerCase();
    try {
        if (command === 'echo') command = 'say';
        if (command === 'sayhitoyt') command = 'youtube';
        if (command === 'ui') command = 'userinfo';
        if (command === 'asciify') command = 'ascii';
        if (command === 'clear') command = 'purge';
        if (command === 'yt') command = 'youtube';
        let commands = require(`./commands/${command}.js`);
        commands.run(client, message, args);
    } catch (e) {
        console.log(e.stack);
    } finally {
        console.log(`${message.author.tag} used ${command} command`);
    }
});

client.login(process.env.TOKEN);
