# esprima-ast-utils [![Build Status](https://secure.travis-ci.org/llafuente/esprima-ast-utils.png?branch=master)](http://travis-ci.org/llafuente/esprima-ast-utils)

Node module to manipulate, transform, query and debug [esprima](https://github.com/ariya/esprima) ASTs.

## Objective

When you edit esprima AST and go back to code with escodegen you lose too much information because primary you don't keep track of ranges, tokens, comments etc.
esprima-ast-utils do this for you, so no escodegen is needed, you can edit the AST directly and code everything is in sync.

## walk

Functions that walk thought the AST

* traverse(node, callback, depth, recursive)

  `Object:node`

  `Function:callback` function(node, parent, property, index, depth)

  You can return `false` to stop traverse

  `Number:depth`

  `Boolean:recursive` do recursion (true by default)

* parentize(node, debug)

    traverse the AST and add $parent to each node

    `Boolean:debug` to do $parent enumerable (visible to console.log)

* idze(node, debug)

    traverse the AST and add $id (unique id) to each node

    `Boolean:debug` to do $id enumerable (visible to console.log)

* attachComments(root)

    Traverse the AST and add comments as nodes, so you can query them.

    **Node** Some comment cannot be attached to the tree, a warning will be displayed

* filter(node, callback, traverse_fn)

    traverse and filter the AST based on given callback

    `Function:callback` (current_node): Boolean

    `Function:traverse_fn` By default traverse, you can use your own

* getParent(node, callback): node|null

    Get parent node based on given callback, stops on `true`

    `callback` function(current_node): Boolean

* getRoot(node): root

    get the root of the AST

## Tokens

* getToken
* pushTokens
* growTokens
* tokenAt
* addTokens
* replaceCodeRange
* removeTokens

## IO

* parse(str, debug)

  Parse String into AST, parentize, idze, attachComments and add $code to the root

  `String:filename`

  `Boolean:debug` expose $code, $parent and $id

* parseFile(filename, debug)

  Get file contents (sync) and parse

  `String:filename`

  `Boolean:debug` expose $code, $parent and $id

* encode

  Return $code (not really needed, just to keep sane)

## Query

* getFunction
* getFunctionBlock
* isFunctionDeclared
* isComment
* hasVarDeclaration
* isVarDeclared
* contains

  Does a node contains this node ?

* hasBody
* getComment
* getCode

## Manipulation

Attach, detach and replace.

**Note**: It's recommended to send the code as string or at least use `parse`, plain AST could be invalid to attach

**Note**: Allways attach to Program/BlockStatement you can attach almost everywhere if you know what you are doing, but use with caution, there is no AST validation method.

* attach(node, property, position, str)

  `Object:node`

  `String:property` should be body (it's recommend to only attach to Program and BlockStatement)

  `position:position`

  `String|Object:str`

* detach(node): String

  detach node from it's parent, and reset $parent (remember to save it before if needed)

  `Object:node`

  Return detached code as String

* attachBefore(node, str): Boolean

  Attach in it's parent before node.

  `Object:node`

  `String|Object:str`

* attachAfterComment(node, comment, str): Boolean
* replace(node, str): Boolean
* replaceComment(node, comment, str): Boolean

## Transformation

Modify AST properties

* setIdentifier(node, new_name)
* renameProperty(node, replacements)
* renameVariable(node, replacements)
* renameFunction(node, replacements)

## debug

* debug_tree(node)

  Display in console a lot of information to debug your tree, remember to use `less` if your tree is big :)

## License
MIT
