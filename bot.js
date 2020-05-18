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
  let user_id = message.author.id;

  let username = message.author.username;

  let channel = message.channel;

  let data = message.content.substring(1).split(' '); 
  let command = data[0];
  let parameters = data.slice(1);

  if (command == "aktivitet" || command == "a"){

    let aktivitet_name = parameters[0];

    if (message.channel.name != "text"){
      channel.send("Aktivitetskommandot kan bara användas i kanalen 'text'");
      return;
    }

    let category = channel.parent;
    let category_name = category.name;

    let voice_channel = category.children.find(channel => channel.type == "voice" );
    if (voice_channel != null){
      if (!voice_channel.members.has(user_id)){
        channel.send("Du måste vara i röstkanalen för att använda detta kommando");
        return;
      }
    }

    let true_name = get_true_name(category_name);

    if (aktivitet_name == null){
      category.setName(true_name);
    }
    else{
      category.setName(true_name + " (" +parameters.join(' ') + ")");
    }

  }
  else if (command == "hjälp" || command == "h"){
    channel.send("Följnde kommandon går att använda: " + "\n\n" +
      "'/aktivitet <namn>' eller '/a <namn>': Den överliggande kategorin att lägga till '(<namn>)' i titeln, t.ex. 'Spelrum 1 (Dominion)'. Titeln kommer automatiskt att återställas när alla har lämnat röstkanalen eller om du använde kommandot utan <namn>, alltså bara '/aktivitet' eller '/a'. Kommandot går bara att använda när du är i en röstkanal." + "\n" +
      "'/hjälp' eller '/h': Visar detta meddelande.");
}
  else{
    channel.send(command + "är inte ett kommando jag känner igen");
  }
});

client.on('voiceStateUpdate', function(oldState, newState){
  let channel = oldState.channel;
  if (channel == null) {
    return;
  }

  if (channel.members.array().length == 0){
    channel.parent.setName(get_true_name(channel.parent.name));
  }
});

function get_true_name(category_name){
  let true_name = category_name;
  if (category_name.indexOf(" (") != -1) {
    true_name = category_name.substring(0, category_name.indexOf(" ("));
  }
  return true_name
}

client.login(auth.token);