'use strict';

var REGEX_I_AM_NAME_EXTRACT = /(^|\W)i(m|\'m|\s{0,}am)\s{0,}(.+)/i;

var fs = require('fs');
var Rita = require('rita');
var test = require('./utils').test;
var JSTR = JSON.stringify;

var JOKES = fs.readFileSync('./jokes.txt').toString().split('\n');
var JOKES_BY_NOUN = JOKES.reduce(function (store, joke) {
    var noun;

    try {
        noun = find_noun(joke);

        if (noun && noun.indexOf('\'') === -1) {
            store[noun] = joke;
        }
    } catch (ignore) {}
    return store;
}, {});

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

test(find_noun() === false);
test(find_noun('') === false);
test(find_noun(false) === false);
test(find_noun('where is the') === false);
test(find_noun('where is the beef') === 'beef');
test(find_noun('where are the beef stores') === 'beef');
test(find_noun('where are the stores') === 'stores');
function find_noun(str) {
    var ristr, pos1, pos2;

    try {
        ristr = Rita.RiString(str);
        pos1 = ristr.pos().indexOf('nn');
        pos2 = ristr.pos().indexOf('nns');
        return ristr.wordAt(pos1) || ristr.wordAt(pos2) || false;
    } catch (ignore) {
        return false;
    }
}

test(JSTR(find_nouns(false)) === JSTR([]));
test(JSTR(find_nouns('')) === JSTR([]));
test(JSTR(find_nouns('the new beef store')) === JSTR(['beef', 'store']));
function find_nouns(str) {
    var ristr, pos, nn, nns;

    ristr = Rita.RiString(str);

    try {
        pos = ristr.pos();
    } catch (ignore) {
        pos = [];
    }

    nn = find_indexes_of('nn', pos);
    nns = find_indexes_of('nns', pos);

    return [].concat(nn, nns).sort().reduce(function (nouns, index) {
        var word;

        try {
            word = ristr.wordAt(index);
            if (nouns.indexOf(word) === -1) {
                nouns.push(word);
            }
        } catch (ignore) {}

        return nouns;
    }, []);
}

test(JSTR(find_indexes_of(1, [3, 2, 1])) === JSTR([2]));
test(JSTR(find_indexes_of(1, [3, 1, 1])) === JSTR([1, 2]));
function find_indexes_of(search, arr) {
    return arr.reduce(function (store, val, index) {
        if (val === search) {
            store.push(index);
        }

        return store;
    }, []);
}

test(best_joke_comeback() === false);
test(best_joke_comeback('') === false);
test(best_joke_comeback('cheese'), 'What cheese can never be yours? Nacho cheese.');
test(best_joke_comeback('fish'), 'What did the fish say when it swam into a wall? Damn!');
test(best_joke_comeback('zoo'), 'I went to the zoo the other day, there was only one dog in it. It was a shitzu.');
function best_joke_comeback(str) {
    var noun = find_noun(str);
    return noun ? JOKES_BY_NOUN[find_noun(str)] : false;
}

module.exports = {
    JOKES: JOKES,
    JOKES_BY_NOUN: JOKES_BY_NOUN,
    find_noun: find_noun,
    find_nouns: find_nouns,
    hi_i_am_dad: hi_i_am_dad,
    best_joke_comeback: best_joke_comeback,
};
