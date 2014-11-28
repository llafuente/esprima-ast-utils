# esprima-ast-utils [![Build Status](https://secure.travis-ci.org/llafuente/esprima-ast-utils.png?branch=master)](http://travis-ci.org/llafuente/esprima-ast-utils)

Node module to manipulate, transform, query and debug [esprima](https://github.com/ariya/esprima) ASTs.

## Objective

When you edit esprima AST and go back to code with escodegen you lose too much information because primary you don't keep track of ranges, tokens, comments etc.
esprima-ast-utils do this for you, so no escodegen is needed, you can edit the AST directly and code everything is in sync.

## API

#### io


##### `parse` (String:str [, Boolean:debug]) -> Object

Parse given str

*Parameters:*

* `str`

* `debug`: display $id, $parent and $code in console.log (enumerable=true)


*Returns:*

* `Object`

*Note*: location it's not supported, and won't sync with changes, range/rokens do.


<br /><br />

##### `parseWrap` (String:str [, Boolean:debug]) -> Object

Wrap your code into a function and parse given str.
Needed if your code contains a `ReturnStatement` at Program level.

*Parameters:*

* `str`

* `debug`: display $id, $parent and $code in console.log (enumerable=true)


*Returns:*

* `Object`

*Note*: location it's not supported, and won't sync with changes, range/rokens do.


<br /><br />

##### `parseFile` (String:file [, Boolean:debug]) -> Object

Parse given file

*Parameters:*

* `file`: Path

* `debug`: display $id, $parent and $code in console.log (enumerable=true)


*Returns:*

* `Object`

*Note*: : NodeJS only


<br /><br />

##### `encode` (Object:tree) -> String

Return tree.$code, just for API completeness.

*Parameters:*

* `tree`


*Returns:*

* `String`


<br /><br />

#### walk


##### `traverse` (Object:node, Function:callback [, Number:depth] [, Boolean:recursive])

traverse AST

*Parameters:*

* `node`

* `callback`: function(node, parent, property, index, depth)
  You can return `false` to stop traverse

* `depth`: (0) current depth

* `recursive`: (true) recursively traverse



<br /><br />

##### `parentize` (Object:root [, Boolean:debug])

`traverse` AST and set $parent node

*Parameters:*

* `root`

* `debug`: display $parent in console.log (enumerable=true)



<br /><br />

##### `idze` (Object:node [, Boolean:debug])

`traverse` AST and set an unique `$id` to every node

*Parameters:*

* `node`

* `debug`: display $id in console.log (enumerable=true)



<br /><br />

##### `attachComments` (Object:root)

Traverse the AST and add comments as nodes, so you can query them.
Loop thought comments and find a proper place to inject (BlockStament or alike)
* attach the comment to the before nearest children
* if a children contains the comment it's considered invalid
* push otherwise

*Parameters:*

* `root`



<br /><br />

##### `filter` (Object:node, Function:callback [, Function:traverse_fn]) -> Array

`traverse` and `filter` given AST based on given `callback`

*Parameters:*

* `node`

* `callback`

* `traverse_fn`


*Returns:*

* `Array`: Every match of the `callback`


<br /><br />

##### `getParent` (Object:node, Function:callback) -> Object|NULL

Get parent node based on given callback, stops on `true`

*Parameters:*

* `node`

* `callback`


*Returns:*

* `Object|NULL`


<br /><br />

##### `getRoot` (Object:node) -> Object

get the root of the AST

*Parameters:*

* `node`


*Returns:*

* `Object`


<br /><br />

##### `clone` (Object:node) -> Object

Recursive clone a node. Do no include "$" properties like $parent or $id
If you want those, call `parentize` - `idze` after cloning

*Parameters:*

* `node`


*Returns:*

* `Object`


<br /><br />

#### debug


##### `debug_tree` (Object:tree [, Number:max_width] [, Boolean:display_code_in_tree])

Show your tree in various ways to easy debug
Big trees will be always a pain, so keep it small if possible

*Parameters:*

* `tree`: Any node, if root tokens & source will be displayed

* `max_width`: max tokens per line

* `display_code_in_tree`: when display the tree attach the code on the right



<br /><br />

#### query


##### `getFunction` (Object:node, String:fn_name) -> Object|NULL

`filter` the AST and return the function with given name, null otherwise.

*Parameters:*

* `node`

* `fn_name`


*Returns:*

* `Object|NULL`


<br /><br />

##### `getFunctionBlock` (Object:node, String:fn_name) -> Object|NULL

`filter` the AST and return the function > block with given name, null otherwise.

*Parameters:*

* `node`

* `fn_name`


*Returns:*

* `Object|NULL`


<br /><br />

##### `isFunctionDeclared` (Object:node, String:fn_name) -> Boolean

shortcut

*Parameters:*

* `node`

* `fn_name`


*Returns:*

* `Boolean`


<br /><br />

##### `hasVarDeclaration` (Object:node, String:var_name) -> Boolean

shortcut

*Parameters:*

* `node`

* `var_name`


*Returns:*

* `Boolean`


<br /><br />

##### `isVarDeclared` (Object:node, String:var_name) -> Boolean

reverse from node to root and look for a Variable declaration

*Parameters:*

* `node`

* `var_name`


*Returns:*

* `Boolean`

*Note*: It's not perfect because `VariableDeclaration` it's not hoisted


<br /><br />

##### `contains` (Object:node, Object:subnode) -> Boolean

`node` constains `subnode`

*Parameters:*

* `node`

* `subnode`


*Returns:*

* `Boolean`


<br /><br />

##### `hasBody` (Object:node) -> Boolean

Has a body property, use to freely attach/detach

*Parameters:*

* `node`


*Returns:*

* `Boolean`


<br /><br />

##### `isComment` (Object:node) -> Boolean

shortcut: Is a comment (Line or Block) and has text

*Parameters:*

* `node`


*Returns:*

* `Boolean`


<br /><br />

##### `getComment` (Object:node, String:comment) -> Object

shortcut: search for a comment (trim it's content for maximum compatibility)

*Parameters:*

* `node`

* `comment`


*Returns:*

* `Object`


<br /><br />

##### `getCode` (Object:node) -> String

shortcut: Return node code

*Parameters:*

* `node`


*Returns:*

* `String`


<br /><br />

##### `getArgumentList` (Object:node) -> Array

Return `FunctionDeclaration` arguments name as a list

*Parameters:*

* `node`


*Returns:*

* `Array`


<br /><br />

##### `getDefaultProperty` (Object:node)


*Parameters:*

* `node`



<br /><br />

#### manipulations


##### `attach` (Object:node, String:property, Number|NULL:position, String|Object:str)

Attach Code/Program to given node.

*Parameters:*

* `node`: node to attach

* `property`: Where attach, could be an array or an object

* `position`: index if an array is used as target property

* `str`: String is preferred if not possible remember that only Program can be attached, you may consider using `toProgram`


*Note*: tokens are updated

*Note*: range is updated

*Note*: comments are not attached to root.comments (invalid-comments)


<br /><br />

##### `attachPunctuator` (Object:tree, String:punctuator, Number:position) -> String

Attach a punctuator and keep the tree ranges sane.
The Punctuator can be anything... be careful!

*Parameters:*

* `tree`

* `punctuator`

* `position`


*Returns:*

* `String`: detached code string

*Note*: The Punctuator is not parsed and could be assigned to nearest literal or alike.


<br /><br />

##### `detach` (Object:node, String:property) -> String

Detach given node from it's parent

*Parameters:*

* `node`

* `property`


*Returns:*

* `String`: detached code string

*Note*: `node.$parent` is set to `null`, remember to save it first if you need it.


<br /><br />

##### `attachAfter` (Object:node, String|Object:str [, String:property])

Attach after node, that means `node.$parent.type` is a `BockStament`

*Parameters:*

* `node`

* `str`: String is preferred if not possible remember that only Program can be attached, you may consider using `toProgram`

* `property`: where to search node in the parent



<br /><br />

##### `attachBefore` (Object:node, String|Object:str)

Attach before node, that means `node.$parent.type` is a `BockStament`

*Parameters:*

* `node`

* `str`: String is preferred if not possible remember that only Program can be attached, you may consider using `toProgram`



<br /><br />

##### `attachAfterComment` (Object:node, String:comment, String|Object:str) -> Boolean

Shortcut: Search for given comment, and attachAfter

*Parameters:*

* `node`

* `comment`

* `str`: String is preferred if not possible remember that only Program can be attached, you may consider using `toProgram`


*Returns:*

* `Boolean`: success


<br /><br />

##### `replace` (Object:node, String|Object:str)

Shortcut: detach/attach

*Parameters:*

* `node`

* `str`: String is preferred if not possible remember that only Program can be attached, you may consider using `toProgram`



<br /><br />

##### `replaceComment` (Object:node, String:comment, String|Object:str)

Shortcut: Search for a comment and replace

*Parameters:*

* `node`

* `comment`

* `str`: String is preferred if not possible remember that only Program can be attached, you may consider using `toProgram`



<br /><br />

##### `injectCode` (Object:tree, Array:range, String|Object:str, Boolean:debug)

Inject code directly intro the given range.
After the injection the code will be parsed again so original `$id` will be lost

*Parameters:*

* `tree`

* `range`

* `str`: String is preferred if not possible remember that only Program can be attached, you may consider using `toProgram`

* `debug`: display $id, $parent and $code in console.log (enumerable=true)


*Note*: this is dangerous and powerful


<br /><br />

#### transformations


##### `setIdentifier` (Object:node, String:new_name)

rename `Identifier`

*Parameters:*

* `node`

* `new_name`



<br /><br />

##### `renameProperty` (Object:node, Object:replacements)

`traverse` and apply given `replacements`

*Parameters:*

* `node`

* `replacements`


*Example*:
```js
renameProperty(node, {"old_var": "new_var", "much_older": "shinnig_new"})
```


<br /><br />

##### `renameVariable` (Object:node, Object:replacements)

`traverse` and apply given `replacements`

*Parameters:*

* `node`

* `replacements`


*Example*:
```js
renameVariable(node, {"old_var": "new_var", "much_older": "shinnig_new"})
```


<br /><br />

##### `renameFunction` (Object:node, Object:replacements)

traverse and apply given `replacements`

*Parameters:*

* `node`

* `replacements`


*Example*:
```js
renameFunction(node, {"old_var": "new_var", "much_older": "shinnig_new"})
```


<br /><br />

##### `toProgram` (Object|Array:node)

Clone given node(s) and extract tokens & code from root to given you a Program-like attachable node

*Parameters:*

* `node`: if array is provided will add all nodes to program.body



<br /><br />

#### tokens


##### `getToken` (Object:tree, Number:start, Number:end) -> Object|NULL

Get token based on given range

*Parameters:*

* `tree`

* `start`

* `end`


*Returns:*

* `Object|NULL`


<br /><br />

##### `getTokens` (Object:tree, Number:start, Number:end) -> Array|NULL

Get tokens in range

*Parameters:*

* `tree`

* `start`

* `end`


*Returns:*

* `Array|NULL`


<br /><br />

##### `pushTokens` (Object:tree, Number:start, Number:amount)

Push tokens range from start

*Parameters:*

* `tree`

* `start`

* `amount`


*Note*: Update nodes range


<br /><br />

##### `growTokens` (Object:tree, Number:start, Number:end, Number:amount)

Grow tokens in given range

*Parameters:*

* `tree`

* `start`

* `end`

* `amount`


*Note*: Update nodes range


<br /><br />

##### `tokenAt` (Object:tree, Number:start) -> Object

Get the first token

*Parameters:*

* `tree`

* `start`


*Returns:*

* `Object`


<br /><br />

##### `addTokens` (Object:dst_tree, Object|Array:src, Number:start)

Add `src` tokens to `dst` since `start` (so keep the order)

*Parameters:*

* `dst_tree`

* `src`

* `start`


*Note*: Remember to push `src` tokens before `addTokens` otherwise won't be synced


<br /><br />

##### `replaceCodeRange` (Object:tree, Array:range, String:new_text)

Replace code range with given text.

*Parameters:*

* `tree`

* `range`

* `new_text`



<br /><br />

##### `removeTokens` (Object:tree, Number:start, Number:end)

Remove tokens in range and update ranges

*Parameters:*

* `tree`

* `start`

* `end`


*Note*: Do not remove nodes.


<br /><br />

# LICENSE

(The MIT License)

Copyright (c) 2014 Luis Lafuente <llafuente@noboxout.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

