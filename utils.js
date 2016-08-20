'use strict';

var assert = require('assert');

function test(res, val, msg) {
    if (!process.env.DEBUG || !process.env.debug) {
        return;
    }

    try {
        assert(res === val);
    } catch (err) {
        console.error('ERROR: %s', msg || 'failed assertion');
        console.error('expected "%s" but got "%s"', val, res);
        console.error(err);
    }
}

module.exports = {
    test: test,
};
