var restify = require('restify');
var builder = require('botbuilder');
//var moviebooking = require('luis/moviebooking.json') ;
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
var restaurantRecognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v2.0/apps/ac6eafce-72ed-4856-b49f-f914ba2ef755?subscription-key=b299e17e8e1a4be28390a2c2c54c4325')  ;
var shoppingRecognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v2.0/apps/c79111c3-cf0c-4dfd-9cd5-248c2d2d9719?subscription-key=b299e17e8e1a4be28390a2c2c54c4325')  ;
var mixedRecognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v2.0/apps/084d13b5-bcef-4c84-a6de-c4d0e3a2f5de?subscription-key=b299e17e8e1a4be28390a2c2c54c4325')  ;

//var restaurantIntents = new builder.IntentDialog({recognizers:[recognizer]}) ;
var intents = new builder.IntentDialog({recognizers:[restaurantRecognizer,shoppingRecognizer]}) ;

//var movieIntents = new builder.IntentDialog({recognizers:[recognizer]})
;
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
        session.endDialog() ;
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

intents.matches('Book-Restaurant','/Book-Restaurant') ;
intents.matches('shopping','/shopping') ;


bot.dialog('/Book-Restaurant',[
    function(session){
        session.send('Your Restaurant has booked') ;
        session.endDialog() ;
    }
]) ;
bot.dialog('/shopping',[
    function(session){
        session.send('Your are ready for shopping') ;
        session.endDialog() ;
    }
]) ;
// / restaurantIntents.matches('Book-Restaurant',[
//      function(session){
//          session.send('Your movie has booked') ;
//      }
//  ]) ;