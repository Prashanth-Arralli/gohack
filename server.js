var restify = require('restify');
var builder = require('botbuilder');
var startedPlanning = false;

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
server.post('/api/messages', connector.listen());
server.get('/',respond);


// Setup bot and define root waterfall
var bot = new builder.UniversalBot(connector);

var intents = new builder.IntentDialog() ;
bot.dialog('/',intents) ;
intents.matches(/Hello/i,[
    function(session) {
      session.beginDialog("intro");
      session.endDialog();
    }
  ]);



bot.dialog('intro', [
      function(session){
              session.send("wassup bro");
              session.send("how can i help you today");
              session.endDialog();
      }
  ]);

intents.matches(/DateIntent/, [
      function(session){
        session.send("so lets begin!!!");
        session.beginDialog('planEnquiry');
      }
  ]);

bot.dialog('planEnquiry', [
      function(session){
        session.send("so do you have something in mind ?");
        builder.Prompts.number(session, "let me make it easy for you on a scale of 1 to 5 how much did you plan?");
      },
      function(session, results){
        if(results.response> 5 || results.response < 1){
          session.send("are you dumb?");
          session.beginDialog('planEnquiry');
        }
        else if(results.response <=4 && results.response >1){
          session.send("ok lets listen what you got...we can work on it...");
          session.beginDialog('mediumPlan');
        }
        else if(results.response <= 1){
          session.send("dont worry we will get there...me and 'gojek' are here to help you after all");
          session.beginDialog('noPlan');
        }
        else{
          session.send("ahhh...you took all the fun away from me. anyways tell me the plan ill take care of the rest!!!");
          session.send("ofcourse gojek is ther to help!!!");
          session.beginDialog('fullPlan');
        }
        startedPlanning = true;
      }
  ])
var arr = [];
var url = "https://www.google.co.in/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwj6gbjhgcPRAhVFqY8KHRQyC4cQjRwIBw&url=https%3A%2F%2Ftheculturetrip.com%2Feurope%2Funited-kingdom%2Fengland%2Farticles%2Fliverpool-s-10-best-cultural-restaurants-fine-dining-and-local-eats-1%2F&psig=AFQjCNFC0CKM_2DZ4n7C9F5_LUgexL4MfA&ust=1484530645258447";
bot.dialog('noPlan',[

    function (session) {
         // Ask the user to select an item from a carousel.
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                new builder.HeroCard(session)
                    .title("Space Needle")
                    .text("The <b>Space Needle</b> is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
                    .images([
                        builder.CardImage.create(session, url)
                            .tap(builder.CardAction.showImage(session, url)),
                    ])
                    .buttons([
                        builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle", "Wikipedia"),
                        builder.CardAction.imBack(session, "select:100", "Select")
                    ]),
                new builder.HeroCard(session)
                    .title("Pikes Place Market")
                    .text("<b>Pike Place Market</b> is a public market overlooking the Elliott Bay waterfront in Seattle, Washington, United States.")
                    .images([
                        builder.CardImage.create(session, url)
                            .tap(builder.CardAction.showImage(session, url)),
                    ])
                    .buttons([
                        builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Pike_Place_Market", "Wikipedia"),
                        builder.CardAction.imBack(session, "select:101", "Select")
                    ]),
                new builder.HeroCard(session)
                    .title("EMP Museum")
                    .text("<b>EMP Musem</b> is a leading-edge nonprofit museum, dedicated to the ideas and risk-taking that fuel contemporary popular culture.")
                    .images([
                        builder.CardImage.create(session, url)
                            .tap(builder.CardAction.showImage(session, url))
                    ])
                    .buttons([
                        builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/EMP_Museum", "Wikipedia"),
                        builder.CardAction.imBack(session, "select:102", "Select")
                    ])
            ]);
        builder.Prompts.choice(session, msg, "select:100|select:101|select:102");
        session.send("choose one event");
        },
        function (session, results) {
            if (results.response) {
              session.endDialog();
            } else {
                session.endDialog("Nothing selected");
            }
        }
  ]);

bot.dialog('mediumPlan',[
    function(session){
      session.send("not implemented yet");
      session.endDialog();
    }
  ]);

bot.dialog('fullPlan',[
    function(session){
      session.send("not implemented");
      session.endDialog();
    }
  ]);

intents.onDefault([
      function(session){
        if(!startedPlanning){
          session.send("ahhhh...not sure but, I am guta. I can help you plan a memorable date for you");
          builder.Prompts.confirm(session, "would you like to plan a date ? say yes please!!! I love that");

        }
        else{
            session.send("didnt quiet get that but lets get back to the planning...where did we leave it by the way?");
            session.endDialog();
        }
      },
      function(session, results){
        if(results.response){
          session.send("so lets begin!!!");
          session.beginDialog("planEnquiry");
        }
        else{
          session.send("I would have loved that but any ways catch you later");
          session.endDialog();
        }
      }
  ]);

// Create prompts
/*
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
])*/

function respond(req, res, next) {
  res.send('Hi, I am Chitti the Robot. Speed 1 terahertz, memory 1 zigabyte.');
  next();
}