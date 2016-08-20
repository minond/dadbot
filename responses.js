'use strict';

var REGEX_I_AM_NAME_EXTRACT = /(^|\W)i[\'m|\s{0,}am]{0,}(.+)/i;

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
        name = matches ? matches[2] : '';

    return name ? 'Hi ' + name + ', I\'m dad.' : false;
}

module.exports = {
    hi_i_am_dad: hi_i_am_dad,
};
