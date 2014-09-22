'use strict';

module.exports = {
    attach: attach,
    detach: detach,
    attachBefore: attachBefore,
    attachAfterComment: attachAfterComment,
    attachAfter: attachAfter,
    replace: replace,
    replaceComment: replaceComment
};

var traverse = require("./walk.js").traverse,
    getRoot = require("./walk.js").getRoot,
    parentize = require("./walk.js").parentize,
    idze = require("./walk.js").idze,
    removeTokens = require("./tokens.js").removeTokens,
    replaceCodeRange = require("./tokens.js").replaceCodeRange,
    pushTokens = require("./tokens.js").pushTokens,
    tokenAt = require("./tokens.js").tokenAt,
    addTokens = require("./tokens.js").addTokens,
    getCode = require("./query.js").getCode,
    getComment = require("./query.js").getComment,
    parse = require("./io.js").parse;

/**
 * @param Object node
 * @param String property
 * @param position position
 * @param String|Object str
 */
function attach(node, property, position, str) {
    var root = getRoot(node);

    if (!node[property] && Array.isArray(node[property])) {
        throw new Error("invalid attach point");
    }

    // parse str to ast
    var tree;
    if ("string" === typeof str) {
        tree = parse(str);
    } else {
        tree = str;

        if (tree.type !== "Program") {
            throw new Error("only Program can be attached");
        }
    }

    // search the entry where we attach new code
    var entry,
        push_range_start,
        push_range_amount = tree.range[1];

    if (node.body.length === 0) {
        // empty program/block
        push_range_start = node.range[0];

        // move until any text
        while(root.$code[push_range_start] === " " || root.$code[push_range_start] === "\n") {
            ++push_range_start;
        }

        if (root.$code[push_range_start] === "{") {
            ++push_range_start;
        }

    } else {
        if (position == -1) { // last
            entry = node[property][node[property].length -1];
            push_range_start = entry.range[1];
        } else {
            entry = node[property][position];

            if (entry) {
                push_range_start = entry.range[0];
            } else {
                entry = node[property][position - 1];
                if (!entry) {
                    throw new Error("cannot determine entry range");
                }

                push_range_start = entry.range[0];
            }
        }
    }

    var clean_str = tree.$code.substr(tree.range[0], tree.range[1]),
        i,
        j;

    // push new tokens
    pushTokens(tree, 0, push_range_start);
    // push old tokens
    pushTokens(root, push_range_start, push_range_amount);

    if (root.tokens.length === 0) {
        i = 0;
    } else {
        i = tokenAt(root.tokens, push_range_start);

        if (i === -1) {
            throw new Error("Cannot determine token entry?");
        }
    }

    addTokens(root.tokens, tree.tokens, i);

    replaceCodeRange(root, [push_range_start, push_range_start], clean_str);

    for (i = 0; i < tree.body.length; ++i) {
        if (position == -1) {
            node[property].push(tree.body[i]);
        } else {
            node[property].splice(position + i, 0, tree.body[i]);
        }
    }

    // rebuild parents
    parentize(root);
    idze(root);
    // should we re-attach comments ?
}
/**
 * @param Object node
 */
function detach(node, property) {
    var parent = node.$parent,
        root = getRoot(node);

        console.log("root", root);

    if (!parent) {
        throw new Error("node cannot be detached, no parent.");
    }

    //var root.$code.substr(node.range[0], node.range[1]).match(/\\n/)
    property = property || "body";

    if (!parent[property]) {
        throw new Error("cannot detach from " + property);
    }

    if (Array.isArray(parent[property])) {
        if (!parent[property].length) {
            throw new Error("cannot detach from " + property);
        }

        var idx = parent[property].indexOf(node);
        if (idx !== -1) {
            parent[property].splice(idx, 1);

            removeTokens(root, node.range[0], node.range[1]);

            var text = root.$code.substr(node.range[0], node.range[1]);

            replaceCodeRange(root, node.range, "");

            //root.$code = root.$code.substr(0, node.range[0]) + root.$code.substr(node.range[1] + 1, root.$code.length);

            node.$parent = null;

            return text;
        }
    } else {
        throw new Error("OBJECT!!!");

    }

    throw new Error("cannot find node in parent body");
}
/**
 * @param Object node
 * @param Object|String str
 */
function attachAfter(node, str) {
    if (node.$parent) {
        var idx = node.$parent.body.indexOf(node);

        //require("./debug.js").debug_tree(getRoot(node));
        attach(node.$parent, "body", idx + 1, str);
        //require("./debug.js").debug_tree(node);

        return true;
    }

    return false;
}

/**
 * @param Object node
 * @param Object|String str
 */
function attachBefore(node, str) {
    if (node.$parent) {
        var idx = node.$parent.body.indexOf(node);

        //require("./debug.js").debug_tree(getRoot(node));
        attach(node.$parent, "body", idx, str);
        //require("./debug.js").debug_tree(node);

        return true;
    }

    return false;
}

/**
 * @param Object node
 * @param String comment
 * @param Object|String str
 */
function attachAfterComment(node, comment, str) {
    var n = getComment(node, comment);

    if (n) {
        attachAfter(n, str);

        return true;
    }

    return false;
}

/**
 * @param Object node
 * @param Object|String str
 */
function replace(node, str) {
    console.log(str);

    if (node.$parent) {
        var idx = node.$parent.body.indexOf(node),
            parent = node.$parent,
            prev_code = detach(node);

        attach(parent, "body", idx, str);

        return prev_code;
    }

    return false;
}

/**
 * @param Object node
 * @param String comment
 * @param Object|String str
 */
function replaceComment(node, comment, str) {
    var n = getComment(node, comment);

    if (n) {
        replace(n, str);

        return true;
    }

    return false;
}