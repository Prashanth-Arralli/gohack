var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: 'd4336eca-ef3e-46b1-a172-e7050fe99f68',
    appPassword: 'WrYrQ9YhjKjeW0cVZoBH0Uh'
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());
server.get('/',respond);
//=========================================================
// Bots Dialogs
//=========================================================
var intents = new builder.IntentDialog() ;
bot.dialog('/',intents) ;

// bot.dialog('/', [ 
//   function (session,args,next){
//       if (!session.userData.name) {
//             session.beginDialog('/profile');
//         } else {
//             next();
//         }
//   },
//   function (session,results) {
//       session.send("Hello %s!",session.userData.name);
//   }
// ]);
intents.matches(/^change name/i, [
    function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.send('Ok... Changed your name to %s', session.userData.name);
    }
]);

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s!', session.userData.name);
    }
]);

intents.matches(/^emojis/, [
    function (session, results) {
          var emoji = "("+results.response+")" ;
          session.send({ "text": emoji});
    }
  ]);


bot.dialog('/profile',[
  function(session){
    builder.Prompts.text(session,'Hi! What is your name?') ;
  },
  function(session,results){
    session.userData.name = results.response ;
    session.endDialog() ;
  }
])

function respond(req, res, next) {
  res.send('Hi, I am Chitti the Robot. Speed 1 terahertz, memory 1 zigabyte.');
  next();
}