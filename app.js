var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector();
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());
server.get('/',respond);
//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {
	
    session.send("Hello World");
});

function respond(req, res, next) {
  res.send('Hi, I am Chitti the Robot. Speed 1 terahertz, memory 1 zigabyte.');
  next();
}