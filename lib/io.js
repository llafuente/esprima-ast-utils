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
    __debug = false,
    esprima_parse = require('esprima').parse;

/**
* Parse given str
* **Note** location it's not supported, and won't sync with changes, range/rokens do.
*
* @param {String} str
* @param {Boolean} [debug] display $id, $parent and $code in console.log (enumerable=true)
* @return {Object}
*/
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
    // this fix last comments :)
    //tree.range[1] = tree.tokens[tree.tokens.length - 1].range[1];
    tree.range[1] = str.length;

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

/**
* Parse given file
*
* **Note**: NodeJS only
*
* @param {String} file Path
* @param {Boolean} [debug] display $id, $parent and $code in console.log (enumerable=true)
* @return {Object}
*/
function parseFile(file, debug) {
    return parse(require("fs").readFileSync(file, {encoding: "UTF-8"}), debug);
}

/**
* Return tree.$code, just for API completeness.
*
* @param {Object} tree
* @return {String}
*/
function encode(tree) {
    return tree.$code;
}