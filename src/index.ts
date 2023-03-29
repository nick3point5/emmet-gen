#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

import { Command } from 'commander'
import { parseEmmet } from './utils/parseEmmet/parseEmmet.js'
import { generateInit } from './utils/generateInit/generateInit.js'
import { getConfig } from './utils/getConfig.js'
import { parseString } from './utils/parseString/parseString.js'
import { parseTokens } from './utils/parseTokens/parseTokens.js'
import { generateTemplate } from './utils/generateTemplate/generateTemplate.js'
import { indexer } from './utils/indexer/indexer.js'
import { saveInit } from './utils/saveInit/saveInit.js'
import { loadInit } from './utils/loadInit/loadInit.js'

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
	.action((input, option) => {
		if (option.save) {
			const { settings } = getConfig(true)
			saveInit(settings, input)
		} else if (option.load) {
			loadInit(input)
		} else {
			generateInit(input)
		}
	})

program.command('config').action(() => {
	console.log(getConfig())
})

program
	.command('index')
	.description('Generate index files using es6 named importing')
	.argument('<location...>')
	.option('-r, --recursive', 'recursively generate index files')
	.option('-a, --absolute', 'sets the base url relative to the emmet-gen-template.json')
	.action((locations: string[], option) => {
		const { settings, settingsLocation } = getConfig()
		locations.forEach((location) => {
			if (settings.relative && !option.absolute) {
				location = path.resolve(process.cwd(), settings.baseUrl, location)
			} else {
				location = path.resolve(settingsLocation, '..', location)
			}
			indexer(location, !!option.recursive)
		})
	})

program
	.argument('[emmet]')
	.option('-i, --index', 'recursively generate index files')
	.option('-a, --absolute', 'sets the base url relative to the emmet-gen-template.json')
	.action((input, option) => {
		const { settings } = getConfig(!!option.absolute)
		const emmetStrings = parseString(input)
		const emmetTokens = parseEmmet(emmetStrings)
		const rootTemplate = parseTokens(emmetTokens, settings)
		generateTemplate(rootTemplate)

		if (!!option.index || !!settings.auto_imports) {
			indexer(rootTemplate.getChildLocation(), true)
		}

		console.log('Done 📂')
	})

program.parse()
