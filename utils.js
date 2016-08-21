'use strict';

var assert = require('assert');

function test(check, msg) {
    if (!process.env.DEBUG && !process.env.debug) {
        return;
    }

    try {
        assert(check);
    } catch (err) {
        console.error('ERROR: %s', msg || 'failed assertion');
        console.error(err);
    }
}

module.exports = {
    test: test,
};
