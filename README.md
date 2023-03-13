# `emmet-gen`

An un-opinionated file template CLI system that works with syntax inspired by [emmet](https://emmet.io/).

---

# Getting started
## Installation
* Before emmet-gen can be used it should be initialized with the command ```npx emmet-gen init`emmet-gen can be used in any sub-directory. emmet-gen will search up the file tree for emmet-gen-template.json.

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
  ```npx emmet-gen hello>world```
  * Sibling: + 
  add the following tag as a sibling
  ```npx emmet-gen hello+world```
  * Climb-up: ^ 
  directs the following tag up the tree
  ```npx emmet-gen hello>to+the^world```
  * Item numbering: \$
  * Multiplication: * 
  multiplies a tag <b>NOTE: top item multiplied must have \$ numbering</b>
  ```npx emmet-gen hello>world$*5```
  * ID: # 
  sets the template of the preceding tag
  ```npx emmet-gen hello#file>world```
  * CLASS: . 
  sets the template of the preceding tag and its children.
  ```npx` emmet-gen hello.file>world```
  * Custom Replace: [target="substitute"] 
  replaces target text within a file with the substitute text NOTE: substitute must be wrapped in double quotes</b>
  ```npx emmet-gen hello.file>world[log="error"]```
  * empty: / 
  mark the following tag as an empty directory. If following a tag will make the directory a child.
  ```npx emmet-gen /hello/world```
  * Grouping: ()  wraps tags. Can be used with multiply.
   ```npx emmet-gen hello>(to+the+world$)*5```
<br/>
* emmet commands will by default create templates in the terminal's working directory. This can be changed in the emmet-gen-template.json and the default directory will be absolutely bound to the directory which contains the emmet-gen-template.json.