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

const pkgLocation = path.resolve(`./package.json`)
const pkg = JSON.parse(fs.readFileSync(pkgLocation))

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
	.command('params')
	.argument('[emmet]')
	.action((emmet) => {
		console.log("emmet", emmet)
		console.log("------")
		console.log(process.argv)
		process.exit(1)
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