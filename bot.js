// Libraries
const Discord = require('discord.js');

const auth = require('./auth.json');

// Create client
const client = new Discord.Client();

// Constants
client.PREFIX = '/';

// Client is ready!
client.on('ready', function() {
  console.log('Logged in as %s - %s\n', client.user.username, client.user.id);
 /* client.user.setPresence({ 
    'game': { 
      'name': client.PREFIX + "help" 
    } 
  });*/
});

client.on('disconnect', function(event){
  console.log('Disconnected with code ' + event.code);
  client.login(auth.token);
  console.log('Reconnecting...');

});

// Message received
client.on('message', function(message) {
  // Ignore if the message doesn't start with the prefix
  if (message.content.substring(0, 1) != client.PREFIX) {
    return;
  }
});


client.login(auth.token);