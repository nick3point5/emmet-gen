#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

import { Command } from 'commander'
import { parseEmmet } from './utils/parseEmmet/parseEmmet.js'
import { generateInit } from './utils/generateInit.js'
import { getConfig } from './utils/getConfig.js'
import { parseString } from './utils/parseString/parseString.js'
import { parseTokens } from './utils/parseTokens/parseTokens.js'
import { generateTemplate } from './utils/generateTemplate/generateTemplate.js'
import { indexer } from './utils/indexer/indexer.js'

const pkgLocation = new URL('../package.json', import.meta.url)
const pkg = JSON.parse(fs.readFileSync(pkgLocation))

const { version, description } = pkg
const program = new Command()

process.on('warning', (e) => console.warn(e.stack))

program.version(version).description(description)

program
	.command('init')
	.description('Generate the initial files for emmet-gen')
	.argument('[type]')
	.action((type) => {
		generateInit(type)
	})

program.command('config').action(() => {
	console.log(getConfig())
})

program
	.command('index')
	.description('Generate index files using es6 named importing')
	.argument('[location]')
	.option('-r, --recursive', 'recursively generate index files')
	.action((location,option) => {
		const {settings, settingsLocation} = getConfig()
		if(settings.relative) {
			location = path.resolve(process.cwd(),settings.baseUrl,location)
		} else {
			location = path.resolve(settingsLocation,settings.baseUrl,location)
		}
		indexer(location, !!option.recursive)
	})

program
	.argument('[emmet]')
	.option('-i, --index', 'recursively generate index files')
	.option('-p, --path', 'sets the base url relative to the emmet-gen-template.json')
	.action((input,option) => {
		const {settings} = getConfig(!!option.path)
		const emmetStrings = parseString(input)
		const emmetTokens = parseEmmet(emmetStrings)
		const rootTemplate = parseTokens(emmetTokens, settings)
		generateTemplate(rootTemplate, settings)

		if(!!option.index || settings.auto_imports) {
			indexer(rootTemplate.getChildLocation(), true)
		}
	})

program.parse()
