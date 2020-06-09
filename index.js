
const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', message => {
    if (message.author.id === client.user.id) {
        message.delete({timeout: 10000}).catch((error) => console.log(error));
        return;
    }
    const server = message.guild;

    // listen for webhook message from Mad Chad
    if (message.webhookID) {
        var finalA = '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
        server.roles.create({ data: {name: message.content, color: finalA, permissions: []}})
            .then((role) => {
                server.channels.create(message.content, { type: 'voice' })
                .then((chan) => {
                    const category = server.channels.cache.find(c => c.name === 'Voice' && c.type === 'category');
                    chan.setParent(category)
                        .then( (channel) => {
                            channel.overwritePermissions([
                                {
                                    id: server.roles.cache.find(role => role.name === '@everyone').id,
                                    deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'],
                                },
                                {
                                    id: role.id,
                                    allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'],
                                },
                            ]);
                            })
                        .catch((error) => {
                            console.log(error)
                        })
                    })
                .catch((error) => {
                    console.log(error);
                })
            })
            .catch((error) => {
                console.log(error);
            })
        message.delete().catch((error) => console.log(error));   
    }
    else { // if a user message, then the webhook has probably been sent, and the VC and role created
        const role = server.roles.cache.find(role => role.name === message.content)
        if (role) {
            message.member.roles.add(role);
            message.delete().catch((error) => console.log(error));
        }
        else {
            message.delete().catch((error) => console.log(error));
            message.channel.send('Room doesnt exist :(');
        }
    }
});

client.login(config.token);