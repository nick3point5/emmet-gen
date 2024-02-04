#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

import { Command } from 'commander'
import { parseEmmet } from './utils/parseEmmet/parseEmmet.js'
import { generateInit } from './utils/generateInit/generateInit.js'
import { emmetLexer } from './utils/emmetLexer/emmetLexer.js'
import { parseTokens } from './utils/parseTokens/parseTokens.js'
import { generateTemplate } from './utils/generateTemplate/generateTemplate.js'
import { indexer } from './utils/indexer/indexer.js'
import { saveInit } from './utils/saveInit/saveInit.js'
import { loadInit } from './utils/loadInit/loadInit.js'
import { Settings } from './utils/Settings/Settings.js'
import { undoTemplates } from './utils/undoTemplates/undoTemplates.js'

const pkgLocation = new URL('../package.json', import.meta.url)
const pkg = JSON.parse(fs.readFileSync(pkgLocation).toString())

const { version, description } = pkg
const program = new Command()

process.on('warning', (e) => console.warn(e.stack))

program.version(version).description(description)

program
	.command('init')
	.option('-s, --save', 'save emmet templates and json')
	.option('-l, --load', 'loads from json')
	.description('Generate the initial files for emmet-gen')
	.argument('[input]')
	.action((input: string, option: { save: boolean; load: boolean }) => {
		if (option.save) {
			Settings.init()
			saveInit(input)
		} else if (option.load) {
			loadInit(input)
		} else {
			generateInit(input)
		}
	})

program
	.command('config')
	.action(() => {
		Settings.init()
		console.log(Settings)
	})

program
	.command('index')
	.description('Generate index files using es6 named importing')
	.argument('<location...>')
	.option('-r, --recursive', 'recursively generate index files')
	.option('-a, --absolute', 'sets the base url relative to the emmet-gen-template.json')
	.action((locations: string[], option: { absolute: boolean; recursive: boolean }) => {
		Settings.init()
		locations.forEach((location) => {
			if (Settings.relative && !option.absolute) {
				location = path.resolve(process.cwd(), Settings.baseUrl, location)
			} else {
				location = path.resolve(Settings.location, '..', location)
			}
			indexer(location, !!option.recursive)
		})
	})

program
	.argument('[emmet]')
	.option('-i, --index', 'recursively generate index files for JavaScript or TypeScript files using es6 named importing')
	.option('-a, --absolute', 'sets the base url relative to the emmet-gen-template.json')
	.action((input: string, option: { absolute: boolean; index: boolean }) => {
		Settings.init(option.absolute)
		const emmetStrings = emmetLexer(input)
		const emmetTokens = parseEmmet(emmetStrings)
		const rootTemplate = parseTokens(emmetTokens)
		generateTemplate(rootTemplate)

		if (option.index || Settings.auto_imports) {
			indexer(rootTemplate.location, true)
		}

		console.log('Done 📂')
	})

program
	.command('undo')
	.action(() => {
		Settings.init()
		undoTemplates()
	})

program.parse()
