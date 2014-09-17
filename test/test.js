var tap = require("tap"),
    test = tap.test,
    utils = require("../index.js"),
    esprima = require('esprima'),
    parse_ast = esprima.parse,
    debug_tree = require("../lib/debug.js").debug_tree;

//setup
test("Generate file", function(t) {
    var tree = utils.parseFile(__dirname + "/fixture-test.js");
    var tree = utils.parseFile(__dirname + "/../lib/walk.js");

    debug_tree(tree);

    t.end();
});