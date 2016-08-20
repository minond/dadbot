'use strict';

if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Rita = require('rita');
var Botkit = require('botkit');

var controller = Botkit.slackbot({
    debug: true
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

var lexicon = new Rita.RiLexicon();

controller.hears('i[\'m|\s{0,}am]{0,}(.+)', 'direct_message,direct_mention,mention', function (bot, message) {
    var matches = message.text.match(/i[\'m|\s{0,}am]{0,}(.+)/i),
        name = matches ? matches[1] : '';

    if (name) {
        bot.reply(message, 'Hi ' + name + ', I\'m dad.');
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
