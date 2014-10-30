var tap = require("tap"),
    test = tap.test,
    utils = require("../index.js");

test("array initial file test", function(t) {
    console.log("***************************************");

    var tree = utils.parseFile(__dirname + "/fixture-arrays.js");

    console.log(require("util").inspect(tree, {depth: null, colors: true}));

    t.equal(tree.$code, 'var x = [\n    \"1st-lit\",\n    \"2nd-lit\",\n    \"3rd-lit\"\n];');
    t.equal(tree.tokens.length, 11);

    t.end();
});



test("utils.arrayPushLiteral no repeat", function(t) {
    console.log("***************************************");

    var tree = utils.parseFile(__dirname + "/fixture-arrays.js"),
        ar_exp = tree.body[0].declarations[0].init;

    utils.arrayPushLiteral(ar_exp, "1st-lit", true);
    utils.arrayPushLiteral(ar_exp, "2nd-lit", true);
    utils.arrayPushLiteral(ar_exp, "3rd-lit", true);

    t.equal(tree.$code, 'var x = [\n    \"1st-lit\",\n    \"2nd-lit\",\n    \"3rd-lit\"\n];');
    t.equal(tree.tokens.length, 11);

    t.end();
});

test("utils.arrayPushLiteral no repeat", function(t) {
    console.log("***************************************");

    var tree = utils.parseFile(__dirname + "/fixture-arrays.js"),
        ar_exp = tree.body[0].declarations[0].init;

    utils.arrayPushLiteral(ar_exp, "4st-lit", true);

    t.equal(tree.$code, 'var x = [\n    \"1st-lit\",\n    \"2nd-lit\",\n    \"3rd-lit\",\"4st-lit\"\n];');
    t.equal(tree.tokens.length, 13);

    t.end();
});


test("utils.arrayPush no repeat", function(t) {
    console.log("***************************************");

    var tree = utils.parseFile(__dirname + "/fixture-arrays.js"),
        ar_exp = tree.body[0].declarations[0].init;

    utils.arrayPush(ar_exp, "function xxx(){}");

    t.equal(tree.$code, 'var x = [\n    \"1st-lit\",\n    \"2nd-lit\",\n    \"3rd-lit\",function xxx(){}\n];');
    t.equal(tree.tokens.length, 18);

    t.end();
});


test("utils.arrayUnshift no repeat", function(t) {
    console.log("***************************************");

    var tree = utils.parseFile(__dirname + "/fixture-arrays.js"),
        ar_exp = tree.body[0].declarations[0].init;

    utils.arrayUnshift(ar_exp, "function xxx(){}");

    t.equal(tree.$code, 'var x = [\n    function xxx(){},\"1st-lit\",\n    \"2nd-lit\",\n    \"3rd-lit\"\n];');
    t.equal(tree.tokens.length, 18);

    t.end();
});
