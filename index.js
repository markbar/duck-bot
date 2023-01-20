//Node Server that will run twitter bot and reply to tweets with direct messages when they are mentioned

//Required Modules
var Twit = require('twit');
var config = require('./config');
var request = require('request');
var signature = config.DuckSignature;
//Twit object
var T = new Twit(config);

//Set up a user stream
var stream = T.stream('user');

//Anytime someone tweets me
stream.on('tweet', tweetEvent);

//Tweet event callback
function tweetEvent(eventMsg) {
  //Who sent the tweet?
  var name = eventMsg.source.name;
  var screenName = eventMsg.source.screen_name;
  //What is the text?
  var txt = eventMsg.text;
    //pasrse the text to find a URL if it exists
    var url = txt.match(/(https?:\/\/[^\s]+)/g);
    //if there is a url call the yourls api at duck.rip to shorten url
    if (url) {
        var url = url[0];
        var shorenedUrl = 'https://duck.rip/api.php?action=shorturl&format=json&url=' + url + '&signature=' + signature;
        //send a get request to the yourls api
        request(shorenedUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //parse the response to get the short url
                var shortUrl = JSON.parse(body).shorturl;
                //construct the reply text
                var replyText = screenName + ' Here is the shortened URL your looking for ' + shortUrl;
            }
            else {
                //if there is an error construct the reply text
                var replyText = screenName + ' Sorry there was an error shortening your URL';
            }
            // send the DM to the user
        });
    }
    else {
        //if there is no url construct the reply text
        var replyText = screenName + ' Sorry there was no URL in your tweet';
    }
    if (txt.includes('dm')) {
      //Reply to the user with a direct message
      T.post('direct_messages/new', { screen_name: screenName, text: replyText }, tweeted);
    }
  }

  /* //The status update or tweet ID in which we will reply
  var inReplyToStatusId = eventMsg.in_reply_to_status_id_str;
  //The screen name of the user who we will reply to
  var inReplyToScreenName = eventMsg.in_reply_to_screen_name;
  //The tweet ID of the tweet that we will reply to
  var tweetId = eventMsg.id_str;
  //If we want to reply to the tweet
  var reply = false;
  //If we want to send a direct message
  var dm = true;
  //If we want to favorite the tweet
  var favorite = false;
  //If we want to retweet
  var retweet = false;

  //If the tweet is a reply to me
  if (inReplyToScreenName === 'chaotic_twit') {
    //Construct our reply
    var replyText = '@' + screenName + ' Thank you for the tweet!';
    //Set reply to true
    reply = true;
  }

  //If the tweet contains the word 'follow'
  if (txt.includes('follow')) {
    //Construct our reply
    var replyText = '@' + screenName + ' Thank you for the tweet!';
    //Set reply to true
    reply = true;
  }

  //If the tweet contains the word 'dm'
 */