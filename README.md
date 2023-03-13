# `emmet-gen`

An un-opinionated file template CLI system that works with syntax inspired by [emmet](https://emmet.io/).

---

# Getting started
## Installation
* Before emmet-gen can be used it should be initialized with the command <code>npx emmet-gen init</code>emmet-gen can be used in any sub-directory. emmet-gen will search up the file tree for emmet-gen-template.json.

# Usage
## Templates
* Emmet-gen will use the templates in the emmet-gen-template directory.
* Every directory at the top of `emmet-gen-template` is a template route.
* The name of the template will be the name used as a class or id.
* Any name or text within a file with `__TemplateName_`_` will be replaced by the tag of the template.
* Each template must contain exactly 1 directory or file at the top. The top directory can have any amount of files and subdirectories.

## Commands
* Here are the following syntax supported by emmet-gen
  * Child: > 
  makes the following tag a child 
  <code>npx emmet-gen hello>world</code>
  * Sibling: + 
  add the following tag as a sibling
  <code>npx emmet-gen hello+world</code>
  * Climb-up: ^ 
  directs the following tag up the tree
  <code>npx emmet-gen hello>to+the^world</code>
  * Item numbering: \$
  * Multiplication: * 
  multiplies a tag <b>NOTE: top item multiplied must have \$ numbering</b>
  <code>npx emmet-gen hello>world$*5</code>
  * ID: # 
  sets the template of the preceding tag
  <code>npx emmet-gen hello#file>world</code>
  * CLASS: . 
  sets the template of the preceding tag and its children.
  <code>npx` emmet-gen hello.file>world</code>
  * Custom Replace: [target="substitute"] 
  replaces target text within a file with the substitute text NOTE: substitute must be wrapped in double quotes</b>
  <code>npx emmet-gen hello.file>world[log="error"]</code>
  * empty: / 
  mark the following tag as an empty directory. If following a tag will make the directory a child.
  <code>npx emmet-gen /hello/world</code>
  * Grouping: ()  wraps tags. Can be used with multiply.
  <code>npx emmet-gen hello>(to+the+world$)*5</code>
<br/>
* emmet commands will by default create templates in the terminal's working directory. This can be changed in the emmet-gen-template.json and the default directory will be absolutely bound to the directory which contains the emmet-gen-template.json.