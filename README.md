<h1 align="center" style="border-bottom: none;">emmet-gen</h1>
<h3 align="center">
An un-opinionated file template CLI system that works with syntax inspired by a <a href="https://emmet.io/">
Emmet
</a>
</h3>
<p align="center">
<a href="https://www.npmjs.com/package/emmet-gen">
	<img src="https://img.shields.io/npm/v/emmet-gen">
</a>
<a href="https://github.com/nick3point5/emmet-gen/tree/main">
	<img alt="Build states" src="https://img.shields.io/github/actions/workflow/status/nick3point5/emmet-gen/release.yml">
</a>
  <a href="https://github.com/semantic-release/semantic-release/actions?query=workflow%3ATest+branch%3Amaster">
    <img alt="Build states" src="https://github.com/semantic-release/semantic-release/workflows/Test/badge.svg">
  </a>
</p>
---

# Getting started
## Installation
* Before emmet-gen can be used it should be initialized with the command 
```shell
npx emmet-gen init
```
* emmet-gen can be used in any sub-directory. emmet-gen will search up the file tree for emmet-gen-template.json.

# Usage
## Templates
* Emmet-gen will use the templates in the emmet-gen-template directory.
* Every directory at the top of `emmet-gen-template` is a template route.
* The name of the template will be the name used as a class or id.
* Any name or text within a file with `__TemplateName__` will be replaced by the tag of the template.
* Each template must contain exactly 1 directory or file at the top. The top directory can have any amount of files and subdirectories.

## Commands
### Emmet
* Emmet-gen with parse a string argument with emmet-like syntax.
* It should be noted depending on your terminal shell you will have to escape some special characters.
* Here are the following syntax supported by emmet-gen using bash.

#### Child: > 
  makes the following tag a child 
```shell
npx emmet-gen hello\>world
```

#### Sibling: + 
  add the following tag as a sibling
```shell
npx emmet-gen hello+world
```
#### Climb-up: ^ 
  directs the following tag up the tree
```shell
npx emmet-gen hello\>to+the^world
```
#### Item numbering: $
#### Multiplication: * 
  multiplies a tag 
<b>NOTE: items multiplied must have \$ numbering to prevent overwriting each other</b>
```shell
npx emmet-gen hello\>world\$\*5
```
#### ID: \# 
  sets the template of the preceding tag
```shell
npx emmet-gen hello#file\>world
```
#### CLASS: . 
  sets the template inheritance of the preceding tag and its children.
```shell
npx emmet-gen hello.file
```
#### Custom Replace: [target="substitute"] 
  replaces target text within a file with the substitute text
<b>NOTE: substitute must be wrapped in double quotes</b>
```shell
npx npx emmet-gen hello.file[log=\"error\"]
```
#### empty: / 
  mark the following tag as an empty directory. If chained a tag will make the directory a child. Empty tags will not influence the template inheritance.
```shell
npx emmet-gen /hello/world
```
#### Grouping: ()  
wraps tags. Can be used with multiply.
```shell
npx emmet-gen hello\>\(to\$+the\$+world\$\)\*5
```
<br/>

* emmet commands will by default create templates relative terminal's working directory. 
* This can be changed in the emmet-gen-template.json by ```"relative": false,``` and the default directory will be absolutely bound to the directory which contains the emmet-gen-template.json
---
### Index
* emmet-gen also can be used to generate index files using es6 importing syntax for JavaScript/Typescript files.
* If a path isn't specified, emmet-gen will use the current working directory. 
```shell
npx emmet-gen index ./hello
```
* The --recursive or -r flag can be used to recursively generate index files.
```shell
npx emmet-gen index ./hello -r
```
* For emmet commands, the --index or -i flag can be used to recursively generate index files for templates.
```shell
npx emmet-gen hello\>\(to\$+the\$+world\$\)\*5 -i
```
* Index files with be generated without the flag by changing in the emmet-gen-template.json by ```"auto_imports": true,```.