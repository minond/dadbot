'use strict';

var REGEX_I_AM_NAME_EXTRACT = /(^|\W)i[\'m|\s{0,}am]{0,}(.+)/i;

/**
 * @minond: @dadbot I'm hungry
 * @dadbot: Hi hungry, I'm dad
 */
function hi_i_am_dad(str) {
    var matches = str.match(REGEX_I_AM_NAME_EXTRACT),
        name = matches ? matches[2] : '';

    return name ? 'Hi ' + name + ', I\'m dad.' : false;
}

module.exports = {
    hi_i_am_dad: hi_i_am_dad,
};
