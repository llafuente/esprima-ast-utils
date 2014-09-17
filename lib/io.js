'use strict';

module.exports = {
    parse: parse,
    parseFile: parseFile,
    encode: encode
};

var walk = require("./walk.js"),
    idze = walk.idze,
    attachComments = walk.attachComments,
    parentize = walk.parentize,
    __debug = false;

var esprima_parse = require('esprima').parse;
function parse(str, debug) {
    var tree = esprima_parse(str, {
        comment: true,
        range: true,
        //loc: true, // this make no sense right now, escodegen will have problems but not my problem :D
        tokens: true,
        raw: false,
        //attachComment: true this is shitty
    });

    // this fix first comments :)
    tree.range[0] = 0;

    attachComments(tree, debug);
    parentize(tree, debug);
    idze(tree, debug);

    if (debug || __debug) {
        tree.$code = str;
    } else {
        Object.defineProperty(tree, "$code", {enumerable: false, value: str, writable: true});
    }

    return tree;
}

function parseFile(file, debug) {
    return parse(require("fs").readFileSync(file, {encoding: "UTF-8"}), debug);
}

function encode(tree) {
    return tree.$code;
}