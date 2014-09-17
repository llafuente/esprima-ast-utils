'use strict';

module.exports = {
    setIdentifier: setIdentifier,
    renameProperty: renameProperty,
    renameVariable: renameVariable,
    renameFunction: renameFunction
};

var traverse = require("./walk.js").traverse,
    getRoot = require("./walk.js").getRoot,
    getToken = require("./tokens.js").getToken,
    pushTokens = require("./tokens.js").pushTokens,
    growTokens = require("./tokens.js").growTokens,
    replaceCodeRange = require("./tokens.js").replaceCodeRange;

function setIdentifier(node, new_name) {
    if (node.type !== "Identifier") {
        throw new Error("node must be an Identifier");
    }
    var root = getRoot(node),
        diff = (new_name.length - node.name.length),
        token = getToken(root, node.range[0], node.range[1]);

    if (!token) {
        console.log(node);
        console.log(root.tokens);
        throw new Error("token cannot be found");
    }

    token.value = new_name;
    token.range[1] += diff;

    replaceCodeRange(root, node.range, new_name);

    pushTokens(root, node.range[1], diff);
    growTokens(root, node.range[0], node.range[1], diff);

    node.name = new_name;
}

/**
 * traverse and apply given replacements
 *
 * * require parentize
 * * require idze
 *
 * @param Object node
 * @param Object replacements
 * @example
 *   renameProperty(node, {"old_var": "new_var", "much_older": "shinnig_new"})
 */
function renameProperty(node, replacements) {
    if (node.$parent === undefined) {
        throw new Error("parentize is required");
    }

    if (node.$id === undefined) {
        throw new Error("idze is required");
    }


    traverse(node, function(node) {
        if (node.type == "Identifier" &&
            replacements[node.name] &&
            (
                "Property" === node.$parent.type ||
                (
                    "MemberExpression" === node.$parent.type &&
                    node.$parent.property === node
                )
            )
        ) {

            setIdentifier(node, replacements[node.name]);
        }
    });
}

/**
 * traverse and apply given replacements
 *
 * * require parentize
 * * require idze
 *
 * @param Object node
 * @param Object replacements
 * @example
 *   renameVariable(node, {"old_var": "new_var", "much_older": "shinnig_new"})
 */
function renameVariable(node, replacements) {
    if (node.$parent === undefined) {
        throw new Error("parentize is required");
    }

    if (node.$id === undefined) {
        throw new Error("idze is required");
    }

    var root = getRoot(node);

    traverse(node, function(node) {
        //if (node.type == "Identifier")
            //console.log("*", node.type, node.$parent.type, node.$parent);

        if (node.type == "Identifier" &&
            replacements[node.name] &&
            (
                ["VariableDeclarator", "AssignmentExpression", "ReturnStatement"]
                    .indexOf(node.$parent.type) !== -1 ||
                (
                    "Property" === node.$parent.type &&
                    node.$parent.value.$id === node.$id &&
                    isVarDefined(node, replacements[node.name])
                )
            )
        ) {
            setIdentifier(node, replacements[node.name]);
        }
    });
}

/**
 * traverse and apply given replacements
 *
 * * require parentize
 * * require idze
 *
 * @param Object node
 * @param Object replacements
 * @example
 *   renameFunction(node, {"old_var": "new_var", "much_older": "shinnig_new"})
 */
function renameFunction(node, replacements) {
    if (node.$parent === undefined) {
        throw new Error("parentize is required");
    }

    if (node.$id === undefined) {
        throw new Error("idze is required");
    }


    traverse(node, function(node) {
        if (node.type == "Identifier" && replacements[node.name]) {
            if (
                ["FunctionDeclaration", "CallExpression"].indexOf(node.$parent.type) !== -1 ||
                (
                    "Property" === node.$parent.type &&
                    node.$parent.value.$id === node.$id &&
                    !isVarDefined(node, replacements[node.name]) &&
                    (
                        isFunctionDefined(node, replacements[node.name]) ||
                        // could be below
                        isFunctionDefined(node, node.name)
                    )
                )
            ) {
                setIdentifier(node, replacements[node.name]);
            }
        }
    });
}
