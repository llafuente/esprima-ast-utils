'use strict';

module.exports = {
    getToken: getToken,
    getTokens: getTokens,
    pushTokens: pushTokens,
    growTokens: growTokens,
    tokenAt: tokenAt,
    addTokens: addTokens,
    replaceCodeRange: replaceCodeRange,
    removeTokens: removeTokens
};

var traverse = require("./walk.js").traverse;

function getToken(root, start, end) {
    var i,
        token_list = root.tokens,
        max = token_list.length;

    for (i = 0; i < max; ++i) {
        if (token_list[i].range[0] === start && token_list[i].range[1] === end) {
            return token_list[i];
        }
    }

    return null;
}

function getTokens(root, start, end) {
    var i,
        token_list = root.tokens,
        max = token_list.length,
        list = [];

    for (i = 0; i < max; ++i) {
        if (token_list[i].range[0] >= start && token_list[i].range[1] <= end) {
            list.push(token_list[i]);
        }
    }

    return list;
}

function pushTokens(root, start, amount) {
    var i,
        token_list = root.tokens,
        max = token_list.length;

    for (i = 0; i < max; ++i) {
        if (start <= token_list[i].range[0]) {
            token_list[i].range[0] += amount;
            token_list[i].range[1] += amount;
        }
    }

    traverse(root, function(n) {
        if (n.range && start <= n.range[0]) {
            n.range[0] += amount;
            n.range[1] += amount;
        }
    });
}

function growTokens(root, start, end, amount) {
    var i,
        token_list = root.tokens,
        max = token_list.length;

    for (i = 0; i < max; ++i) {
        if (start >= token_list[i].range[0] && end <= token_list[i].range[0]) {
            token_list[i].range[1] += amount;
        }
    }

    traverse(root, function(n) {
        if (n.range && start >= n.range[0] && max <= n.range[1]) {
            n.range[1] += amount;
        }
    });
}

function tokenAt(token_list, start) {
    // add new tokens
    var i = 0,
        max = token_list.length;

    while (i < max && token_list[i].range[0] < start) {
        ++i;
    }

    return i === max ? -1 : i;
}

function addTokens(dst, src, start) {
    var i,
        max = src.length;

    for (i = 0; i < max; ++i) {
        dst.splice(start + i, 0, src[i]);
    }
}

function replaceCodeRange(root, range, new_text) {
    root.$code =
        root.$code.substr(0, range[0]) +
        new_text +
        root.$code.substr(range[1], root.$code.length);
}

function removeTokens(tree, min, max) {
    //console.log(require("util").inspect(tree.tokens, {depth: null, colors: true}));

    var diff = (max - min);
    tree.tokens = tree.tokens.filter(function(n) {
        return n.range[1] < min || n.range[0] > max;
    }).map(function(n) {
        if (n.range[0] > max) { // right
            n.range[0] -= diff;
            n.range[1] -= diff;
        }

        return n;
    });
console.log("tree", tree);
    traverse(tree, function(n) {
console.log("n", n);
        if (n.range[0] > node.range[1]) { // right
            n.range[0] -= diff;
            n.range[1] -= diff;
        } else if (n.range[0] < node.range[0] && n.range[1] > node.range[1]) { // inside
            n.range[1] -= diff;
        }
    });

    //console.log(require("util").inspect(tree.tokens, {depth: null, colors: true}));
}
