var restify = require('restify');
var builder = require('botbuilder');
var startedPlanning = false;

var schedule = {10:"NA",
                11:"NA",
                12:"NA",
                13:"NA",
                14:"NA",
                15:"NA",
                16:"NA",
                17:"NA",
                18:"NA"};
var movieDb = [
{name: "GodFather", description : "the best movie", theatersShowing : ["PVR", "INOX"], timings : ["11:30", "2:30", "6:30", "9:30"], url : "https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg"},
{name: "GodFather2", description : "the bestest movie", theatersShowing : ["PVR", "INOX"], timings : ["11:30", "2:30", "6:30", "9:30"], url : "https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg"},
{name: "GodFather3", description : "not so good movie", theatersShowing : ["PVR", "INOX"], timings : ["11:30", "2:30", "6:30", "9:30"], url : "https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg"},

];

var resDb = [
{name: "sri sagar", description : "great food", rating : 4, url : "https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/MTR_Coffee.jpg/300px-MTR_Coffee.jpg"},
{name: "sri sagar1", description : "great food", rating : 4, url : "https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/MTR_Coffee.jpg/300px-MTR_Coffee.jpg"},
{name: "sri sagar2", description : "great food", rating : 4, url : "https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/MTR_Coffee.jpg/300px-MTR_Coffee.jpg"},
];

var availableEvents = [
{name: "Shopping", description : "let her go wild", url : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/9.3.07GardenStatePlazaMallbyLuigiNovi.JPG/700px-9.3.07GardenStatePlazaMallbyLuigiNovi.JPG"},
{name: "Restraunt", description : "good food good love", url : "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Inside_Le_Procope.jpg/440px-Inside_Le_Procope.jpg"},
{name: "Movie", description : "Nothings in this world can be better", url : "https://upload.wikimedia.org/wikipedia/commons/c/c4/Fox_movietone_2.jpg"},
{name: "Temple", description : "Eat pray love", url : "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Hampi_virupaksha_temple.jpg/440px-Hampi_virupaksha_temple.jpg"}
];


var moviesDB = [  ]
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

var shoppingRecognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v2.0/apps/c79111c3-cf0c-4dfd-9cd5-248c2d2d9719?subscription-key=b299e17e8e1a4be28390a2c2c54c4325')  ;
var restaurantRecognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v2.0/apps/ac6eafce-72ed-4856-b49f-f914ba2ef755?subscription-key=b299e17e8e1a4be28390a2c2c54c4325')  ;
var movieRecognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v2.0/apps/bd80b48f-e2e1-481b-982e-f63c5b97f8e2?subscription-key=b299e17e8e1a4be28390a2c2c54c4325') ;
var templeRecognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v2.0/apps/12f2b3db-03ea-4a92-a11f-cf082c64257f?subscription-key=b299e17e8e1a4be28390a2c2c54c4325') ;
var beachRecongnizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v2.0/apps/85838748-b41f-4a35-81d4-684de5205b7f?subscription-key=b299e17e8e1a4be28390a2c2c54c4325') ;
var bestPlaceRecognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v2.0/apps/05dbcc8b-9dd9-46f5-9c5e-f1afde50b07e?subscription-key=b299e17e8e1a4be28390a2c2c54c4325') ;
var intents = new builder.IntentDialog({recognizers:[shoppingRecognizer,restaurantRecognizer,movieRecognizer,templeRecognizer,beachRecongnizer]}) ;
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
        session.send("When are you planning the date?");
        session.beginDialog('planEnquiry');
      }
  ]);

bot.dialog('planEnquiry', [
      function(session){
        builder.Prompts.number(session, "");
      },
      function(session, results){
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
var shoppingUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/9.3.07GardenStatePlazaMallbyLuigiNovi.JPG/700px-9.3.07GardenStatePlazaMallbyLuigiNovi.JPG";
var restrauntUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Inside_Le_Procope.jpg/440px-Inside_Le_Procope.jpg";
var movieUrl = "https://upload.wikimedia.org/wikipedia/commons/c/c4/Fox_movietone_2.jpg";
var templeUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Hampi_virupaksha_temple.jpg/440px-Hampi_virupaksha_temple.jpg";
bot.dialog('noPlan',[

    function (session) {
         // Ask the user to select an item from a carousel.
        var arr = [];
        for(var i = 0; i < availableEvents.length; i++){
            arr.push(new builder.HeroCard(session)
                    .title(availableEvents[i].name)
                    .text(availableEvents[i].description)
                    .images([
                        builder.CardImage.create(session, availableEvents[i].url)
                            .tap(builder.CardAction.showImage(session, availableEvents[i].url)),
                    ]));
        };
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(arr);
        builder.Prompts.choice(session, msg, "select:100|select:101|select:102");
        session.send("Do you see something you like?");
        session.send("Or something she likes maybe romeo");
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
          session.send("When are you planning the date?");
          session.beginDialog("planEnquiry");
        }
        else{
          session.send("I would have loved that but any ways catch you later");
          session.endDialog();
        }
      }
  ]);



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
        session.send('Your Restaurant has booked') ;

        var nameArray = [];
        var arr = [];
        for(var i = 0; i < resDb.length; i++){
            nameArray.push(resDb[i].name);
            arr.push(new builder.HeroCard(session)
                    .title(resDb[i].name)
                    .text(resDb[i].description)
                    .images([
                        builder.CardImage.create(session, resDb[i].url)
                            .tap(builder.CardAction.showImage(session, resDb[i].url)),
                    ]).buttons([builder.CardAction.imBack(session, resDb[i].name,"Book" )])
                    )
        };
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(arr);
        builder.Prompts.choice(session, msg, nameArray);

        session.endDialog() ;
    },
    function(session, results){
      if(results.response){
        session.send("Booked");
        session.endDialog();
      }
    }
]) ;
bot.dialog('/shopping',[
    function(session){
        session.send('Your are ready for shopping') ;
        session.endDialog() ;
    }
]) ;

bot.dialog('/Movie',[
    function(session){
        session.send('Your Movie has booked') ;
        var sessionArray = [];
        var arr = [];
        for(var i = 0; i < movieDb.length; i++){
            
          buttonsArray = [];

            for(var j = 0; j < movieDb[i].theatersShowing.length; j++){
              for (var k = 0;k < movieDb[i].timings.length; k++) {
                  
                  sessionArray.push(movieDb[i].name + ":" + movieDb[i].theatersShowing[j] + ":" + movieDb[i].timings[k]);
                  buttonsArray.push( builder.CardAction.imBack(session, 
                    movieDb[i].name + ":" + movieDb[i].theatersShowing[j] + ":" + movieDb[i].timings[k]
                    , movieDb[i].name + ":" + movieDb[i].theatersShowing[j] + ":" + movieDb[i].timings[k]) );
 
              };
            };
           
            console.log(movieDb[i].name);
            arr.push(new builder.HeroCard(session)
                    .title(movieDb[i].name)
                    .text(movieDb[i].description)
                    .images([
                        builder.CardImage.create(session, movieDb[i].url)
                            .tap(builder.CardAction.showImage(session, movieDb[i].url)),
                    ]).buttons(buttonsArray)
                    )
        };
        console.log(arr.length);
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(arr);
        builder.Prompts.choice(session, msg, sessionArray);

        session.endDialog() ;
    },
    function(session, results){
      if(results.response){
        session.send("Booked");
        session.endDialog();
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




