'use strict';

if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Rita = require('rita');
var Botkit = require('botkit');
var responses = require('./responses');
var request = require('request');

var chattiness_index = 1;

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

controller.hears(['really (.*)', 'real (.*)', 'kindof (.*)', 'completely (.*)', 'totally (.*)', 'majorly (.*)', 'utterly (.*)', 'wholly (.*)', 'absolutely (.*)', 'pretty (.*)', 'fuckin (.*)', 'fucking (.*)'], 'direct_message,direct_mention,mention,ambient', function(bot, message) {
    var phrase = new Rita.RiString(message.match[0]);
    var word = message.match[1];
    var rhymes = lexicon.rhymes(word);
    if( rhymes.length > 0){
        var random_id = Math.random()*rhymes.length|0
        phrase.replaceFirst(message.match[1], rhymes[random_id]);
        return bot.reply(message, "More like " + phrase.text());
    }
});

controller.hears('', 'direct_message,direct_mention,mention,ambient', function(bot, message) {
    if (Math.random() < chattiness_index) {
        var nouns = responses.find_nouns(message.text);

        if(nouns.length > 0){
            post_a_gif(nouns, message);
        }
    }
});

function post_a_gif (keywords, message) {
    console.log("Searching keywords: " + keywords.join(","));
    var url = 'http://api.giphy.com/v1/gifs/search?q=' + keywords.join('+') + '&api_key=dc6zaTOxFJmzC&rating=pg-13';
    request.get(url, function (err, res, body) {
        var data = JSON.parse(body)['data'];
        if(data.length > 0){
            var random_id = Math.random() * data.length | 0;
            return bot.reply(message, data[random_id].bitly_url);
        }
    })
}
