var tap = require("tap"),
    test = tap.test,
    utils = require("../index.js");

test("utils.attach 1", function(t) {
    console.log("***************************************");

    var tree = utils.parseFile(__dirname + "/fixture-remove.js");

    utils.attach(tree, "body", 0, "var x;\n\n");

    t.equal(tree.$code, 'var x;\n\nvar a;\n\nvar b;\nvar c;');
    t.equal(tree.tokens.length, 12);

    t.end();
});

test("utils.attach 2", function(t) {
    console.log("***************************************");

    var tree = utils.parseFile(__dirname + "/fixture-remove.js");

    //console.log(require("util").inspect(tree.body, {depth: null, colors: true}));
    utils.attach(tree, "body", 1, "var x;\n\n");
    //console.log(require("util").inspect(tree, {depth: null, colors: true}));


    t.deepEqual(tree.range, [0, 29]);
    t.equal(tree.$code, 'var a;\n\nvar x;\n\nvar b;\nvar c;');
    t.equal(tree.tokens.length, 12);

    t.end();
});


test("utils.attach 2", function(t) {
    console.log("***************************************");

    var tree = utils.parseFile(__dirname + "/fixture-remove.js");

    utils.attach(tree, "body", 1, "var x;\n\n");
    utils.attachPunctuator(tree, ";", tree.range[1]);
    //console.log(require("util").inspect(tree, {depth: null, colors: true}));


    t.deepEqual(tree.range, [0, 30]);
    t.equal(tree.$code, 'var a;\n\nvar x;\n\nvar b;\nvar c;;');
    t.equal(tree.tokens.length, 13);

    t.end();
});
