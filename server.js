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

var availableEvents = [
{name: "shopping", description : "let her go wild", url : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/9.3.07GardenStatePlazaMallbyLuigiNovi.JPG/700px-9.3.07GardenStatePlazaMallbyLuigiNovi.JPG"},
{name: "Book-Restaurant", description : "good food good love", url : "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Inside_Le_Procope.jpg/440px-Inside_Le_Procope.jpg"},
{name: "Movie", description : "Nothings in this world can be better", url : "https://upload.wikimedia.org/wikipedia/commons/c/c4/Fox_movietone_2.jpg"},
{name: "Temple", description : "Eat pray love", url : "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Hampi_virupaksha_temple.jpg/440px-Hampi_virupaksha_temple.jpg"}
];


    var schedule = {10:"NA",
                11:"NA",
                12:"NA",
                13:"NA",
                14:"NA",
                15:"NA",
                16:"NA",
                17:"NA",
                18:"NA"
            }
    
function updateSchedule(start, end, event){
    for(var i = start; i < end ;i++){
        schedule[i] = event ;
    }
}
var indexEvents = {
    "shopping":0,
    "Book-Restaurant":1,
    "Movie":2,
    "Temple":3
}
function updateAvailableEvents(event){
    availableEvents.splice(indexEvents[event],1) ;
}
// Setup bot and define root waterfall
var bot = new builder.UniversalBot(connector);

var shoppingRecognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v2.0/apps/c79111c3-cf0c-4dfd-9cd5-248c2d2d9719?subscription-key=b299e17e8e1a4be28390a2c2c54c4325')  ;
var restaurantRecognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v2.0/apps/ac6eafce-72ed-4856-b49f-f914ba2ef755?subscription-key=b299e17e8e1a4be28390a2c2c54c4325')  ;
var movieRecognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v2.0/apps/bd80b48f-e2e1-481b-982e-f63c5b97f8e2?subscription-key=b299e17e8e1a4be28390a2c2c54c4325') ;
var templeRecognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v2.0/apps/12f2b3db-03ea-4a92-a11f-cf082c64257f?subscription-key=b299e17e8e1a4be28390a2c2c54c4325') ;
var beachRecongnizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v2.0/apps/85838748-b41f-4a35-81d4-684de5205b7f?subscription-key=b299e17e8e1a4be28390a2c2c54c4325') ;
var bestPlaceRecognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v2.0/apps/05dbcc8b-9dd9-46f5-9c5e-f1afde50b07e?subscription-key=b299e17e8e1a4be28390a2c2c54c4325') ;
var dateIntentRecognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v2.0/apps/b6b2b894-8119-41f5-a2c4-6149b5ed97b5?subscription-key=b299e17e8e1a4be28390a2c2c54c4325') ;
var intents = new builder.IntentDialog({recognizers:[shoppingRecognizer,restaurantRecognizer,movieRecognizer,templeRecognizer,beachRecongnizer,dateIntentRecognizer]}) ;
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
intents.matches("DateIntent",'/DateIntent') ;
bot.dialog('/DateIntent', [
      function(session){
        session.send("so lets begin!!!");
        session.beginDialog('planEnquiry');
      }
  ]);

  intents.matches(/^can do^/i, [
      function(session){
        session.send("I can help you in planning your Date");
        builder.Prompts.confirm(session, "would you like to plan a date ? say yes please!!! I love that");
      },function(session,results){
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

intents.matches('Book-Restaurant','/Book-Restaurant') ;
intents.matches('shopping','/shopping') ;
intents.matches('Movie','/Movie') ;
intents.matches('Temple','/Temple') ;
intents.matches('Beach','/Beach') ;
intents.matches('Best spots in the city','/BestPlaces') ;
bot.dialog('/Book-Restaurant',[
    function(session){
        session.send("Let's  schedule your restaurant") ;
        builder.Prompts.choice(session,'Do you want to go for ','lunch|dinner') ;
        session.send('Your Restaurant has booked') ;
        session.endDialog() ;
    },
    function(session,results){
        if(results.response == 0){
            updateSchedule("12PM","1PM","Lunch");
            builder.Prompts.choice(session,'What kind of cuisines you like ','Indian|Chinese|International') ;
        }else if(results.response == 1){
            updateSchedule("5PM","6PM","Dinner");
            builder.Prompts.choice(session,'What kind of cuisines you like ','Indian|Chinese|International') ;
        }else {
            builder.Prompts.choice(session,'Do you want to go for ','lunch|dinner') ;
            updateAvailableEvents("Book-Restaurant") ;
            session.send('Your restaurant has scheduled') ;
            bot.beginDialog("/"+availableEvents[0].name) ;
        }
    },
    function(session,results){
        session.userData.restaurant = results.response ;
    }
]) ;
bot.dialog('/shopping',[
    
    function(session){
        session.send("Let's  schedule your shopping") ;
        builder.Prompts.choice(session,'What do you want to shop','Clothes|Jewellery|Apparels') ;
    },
    function(session,results){
        if(results.response == 0){
            //updateSchedule("12PM","1PM","Lunch");
            session.userData.shopping = "Clothes" ;
            updateAvailableEvents("shopping") ;
            session.send('Your shopping has scheduled') ;
            bot.beginDialog("/"+availableEvents[0]) ;
          //  builder.Prompts.choice(session,'What kind of cuisines you like ','Indian|Chinese|International') ;
        }else if(results.response == 1){
           // updateSchedule("5PM","6PM","Dinner");
            session.userData.shopping = "Jewellery" ;
             updateAvailableEvents("shopping") ;
            session.send('Your shopping has scheduled') ;
            bot.beginDialog("/"+availableEvents[0]) ;
           // builder.Prompts.choice(session,'What kind of cuisines you like ','Indian|Chinese|International') ;
        }else if(results.response == 2){
           // updateSchedule("5PM","6PM","Dinner");
            session.userData.shopping = "Apparels" ;
            updateAvailableEvents("shopping") ;
            session.send('Your shopping has scheduled') ;
            bot.beginDialog("/"+availableEvents[0]) ;
        }
           // builder.Prompts.choice(session,'What kind of cuisines you like ','Indian|Chinese|International') ;
        // }else {
        //     builder.Prompts.choice(session,'Do you want to go for ','lunch|dinner') ;
        //     updateAvailableEvents() ;
        //     bot.beginDialog(availableEvents[0]) ;
        // }
    }
]) ;

bot.dialog('/Movie',[
    function(session){
        session.send("Let's  plan your Movie") ;
        builder.Prompts.choice(session,'What Genre do you want to watch?','Romance|Comedy|Acion') ;
    },
    function(session,results){
        session.userData.movieGenre = results.response ;
        builder.Prompts.choice(session,'Which show is good for ?','Morning|Afternoon') ;
    },
    function(session,results){
        if(results.response == 0){
            //updateSchedule("12PM","1PM","Lunch");
            updateSchedule("10PM","12PM","Movie");
            updateAvailableEvents("shopping") ;
            session.send('Your Movie has booked through go-jek') ;
            bot.beginDialog("/"+availableEvents[0]) ;
          //  builder.Prompts.choice(session,'What kind of cuisines you like ','Indian|Chinese|International') ;
        }else if(results.response == 1){
           // updateSchedule("5PM","6PM","Dinner");
            updateSchedule("2PM","4PM","Movie");
            updateAvailableEvents("movie") ;
            session.send('Your Movie has booked through Go-Tix and cab has scheduled through Go-Cab') ;
            bot.beginDialog("/"+availableEvents[0]) ;
           // builder.Prompts.choice(session,'What kind of cuisines you like ','Indian|Chinese|International') ;
        }
    }
]) ;

bot.dialog('/Temple',[
    function(session){
        session.send('Your Temple has booked') ;
        session.endDialog() ;
    }
]) ;

bot.dialog('/BestPlaces',[
    function(session){
        session.send('Your BestPlaces has booked') ;
        session.endDialog() ;
    }
]) ;

bot.dialog('/Beach',[
    function(session){
        session.send('Your Beach has booked') ;
        session.endDialog() ;
    }
]) ;