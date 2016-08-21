'use strict';

var REGEX_I_AM_NAME_EXTRACT = /(^|\W)i(m|\'m|\s{0,}am)\s{0,}(.+)/i;

var fs = require('fs');
var Rita = require('rita');
var test = require('./utils').test;

test(hi_i_am_dad('junk') === false);
test(hi_i_am_dad('im hungry') === 'Hi hungry, I\'m dad.');
test(hi_i_am_dad('i\'m hungry') === 'Hi hungry, I\'m dad.');
test(hi_i_am_dad('i am hungry') === 'Hi hungry, I\'m dad.');
test(hi_i_am_dad('and i am hungry') === 'Hi hungry, I\'m dad.');
test(hi_i_am_dad('   and    i am hungry') === 'Hi hungry, I\'m dad.');
test(hi_i_am_dad('i  am  hungry') === 'Hi hungry, I\'m dad.');
function hi_i_am_dad(str) {
    var matches = str.match(REGEX_I_AM_NAME_EXTRACT),
        name = matches ? matches[3] : '';

    return name ? 'Hi ' + name + ', I\'m dad.' : false;
}

test(find_noun('where is the') === false);
test(find_noun('where is the beef') === 'beef');
test(find_noun('where are the beef stores') === 'beef');
test(find_noun('where are the stores') === 'stores');
function find_noun(str) {
    var ristr = Rita.RiString(str),
        pos1 = ristr.pos().indexOf('nn'),
        pos2 = ristr.pos().indexOf('nns');

    return ristr.wordAt(pos1) || ristr.wordAt(pos2) || false;
}

test(best_joke_comeback('cheese'), 'What cheese can never be yours? Nacho cheese.');
test(best_joke_comeback('fish'), 'What did the fish say when it swam into a wall? Damn!');
test(best_joke_comeback('zoo'), 'I went to the zoo the other day, there was only one dog in it. It was a shitzu.');
function best_joke_comeback(str) {
    if (!best_joke_comeback.jokes) {
        best_joke_comeback.jokes = fs.readFileSync('./jokes.txt').toString().split('\n');
        best_joke_comeback.jdict = best_joke_comeback.jokes.reduce(function (store, joke) {
            try {
                store[find_noun(joke)] = joke;
            } catch (ignore) {}
            return store;
        }, {});
    }

    return best_joke_comeback.jokes[3];
}

module.exports = {
    hi_i_am_dad: hi_i_am_dad,
    best_joke_comeback: best_joke_comeback,
};
