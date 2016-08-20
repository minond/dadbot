'use strict';

if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Rita = require('rita');
var Botkit = require('botkit');
var responses = require('./responses');

var controller = Botkit.slackbot({
    debug: process.env.DEBUG || process.env.debug
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

var lexicon = new Rita.RiLexicon();

controller.hears('can i', 'direct_message,direct_mention,mention', function (bot, message) {
    bot.reply(message, 'I don\'t know can you?');
});

controller.hears('(^|\W)i[\'m|\s{0,}am]{0,}(.+)', 'direct_message,direct_mention,mention', function (bot, message) {
    var res = responses.hi_i_am_dad(message.text);

    if (res) {
        bot.reply(message, res);
    }
});

controller.hears('', 'direct_message,direct_mention,mention,ambient', function(bot, message) {
    var words = message.text.split(/\s*\b\s*/);
    for (var i = 0; i < words.length-1; i++) {
        if( lexicon.isAdjective(words[i]) == true && words.length > 1){
            var rhymes = lexicon.rhymes(words[i+1]);
            if(rhymes.length > 0){
                var random_id = Math.random()*rhymes.length|0
                return bot.reply(message, "More like " + words[i] + " " + rhymes[random_id]);
            }
        }
    }
});
