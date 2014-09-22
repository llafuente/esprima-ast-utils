'use strict';

module.exports = {
    getFunction: getFunction,
    getFunctionBlock: getFunctionBlock,
    isFunctionDeclared: isFunctionDeclared,
    isComment: isComment,
    hasVarDeclaration: hasVarDeclaration,
    isVarDeclared: isVarDeclared,
    contains: contains,
    hasBody: hasBody,
    getComment: getComment,
    getCode: getCode
};

var filter = require("./walk.js").filter,
    traverse = require("./walk.js").traverse,
    getRoot = require("./walk.js").getRoot,
    is_function = function (node) {
        return node.type === "FunctionDeclaration" || node.type === "FunctionExpression";
    };

/**
 * filter the AST and return the function with given name, null otherwise.
 *
 * @param Object node
 * @param String name
 * @return Object|null
 */
function getFunction(node, fn_name) {
    // search nearest function
    var fn = filter(node, function(node) {
        return is_function(node) && node.id && node.id.name == fn_name;
    });

    if (fn && fn.length) {
        return fn[0];
    }

    return null;
}

function getFunctionBlock(root,fn_name ) {
    var ret = null;
    traverse(root, function(node) {
        if (
            node.type === "BlockStatement" &&
            node.$parent.type === "FunctionExpression" &&
            node.$parent.id && node.$parent.id.name === fn_name
        ) {
            ret = node;
            return false;
        }
    });

    return ret;
}

function isFunctionDeclared(node, fn_name) {
    return getFunction(node, fn_name) !== null;
}

function hasVarDeclaration(node, var_name) {
    var found = false;
    traverse(node, function(n) {
        if (n.$parent.type === "VariableDeclarator" &&
            n.type === "Identifier" &&
            n.name === var_name
        ) {
            found = true;
        }
    });

    return found;
}

function isVarDeclared(node, var_name) {
    var found = false;

    getParent(node, function(n) {
        var i,
            j;

        //console.log(n.type, n.body && n.body.length);

        if (n.body && n.body.length) {
            for (i = 0; i < n.body.length; ++i) {
                if (n.body[i].type === "VariableDeclaration") {
                    if (hasVarDeclaration(n.body[i], var_name)) {
                        found = true;
                    }

                }
            }
        }
    });

    //console.log("isVarDeclared", var_name, found);

    return found;
}

function contains(node, subnode) {
    return node.range[0] <= subnode.range[0] && node.range[1] >= subnode.range[1];
}

function hasBody(node) {
    return [
        "Program",
        "BlockStatement",
    ].indexOf(node.type) !== -1;
}

function isComment(n) {
    return ((n.type === "Line" && n.value && n.value.length) || (n.type === "Block" && n.value.length)) > 0;
}

function getComment(node, comment) {
    var output = null;
    traverse(node, function(n, parent, property, index, depth) {
        if(isComment(n) && n.value.trim() === comment) {
            output = n;
            return false;
        }
    });

    return output;
}

function getCode(node) {
    var root = getRoot(node);

    return root.$code.substring(node.range[0], node.range[1]);
}