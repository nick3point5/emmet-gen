#!/usr/bin/env node --experimental-json-modules
import { Command } from 'commander'
import pkg from '../package.json' assert {type: 'json'}
import { parseEmmet } from './utils/parseEmmet/parseEmmet.js'
import { generateInit } from './utils/generateInit.js'
import { getConfig } from './utils/getConfig.js'
import { parseString } from './utils/parseString/parseString.js'
import { parseTokens } from './utils/parseTokens/parseTokens.js'
import { generateTemplate } from './utils/generateTemplate/generateTemplate.js'

const { version, description } = pkg
const program = new Command()

process.on('warning', e => console.warn(e.stack))

program
	.version(version)
	.description(description)

program
	.command('init')
	.description('Generate the initial files for emmet-gen')
	.argument('[type]')
	.action((type) => {
		generateInit(type)
	})

program
	.command('config')
	.action(() => {
		console.log(getConfig())
	})


program
	.argument('[emmet]')
	.action((input) => {
		const settings = getConfig()
		const emmetStrings = parseString(input)
		const emmetTokens = parseEmmet(emmetStrings)
		const rootTemplate = parseTokens(emmetTokens, settings)
		generateTemplate(rootTemplate, settings)
	})

program.parse();