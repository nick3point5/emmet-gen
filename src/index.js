import { Command } from 'commander'
import pkg from '../package.json' assert {type: 'json'}
import { parseEmmet } from './utils/parseEmmet/parseEmmet.js'
import  { generateInit } from './utils/generateInit.js'
import { getConfig } from './utils/getConfig.js'
import {parseTokens} from './utils/parseTokens.js'
import {generateTemplate} from './utils/generateTemplate.js'

const { version, description } = pkg
const program = new Command()

program
	.version(version)
	.description(description)

program
	.command('init')
	.description(description)
	.argument('[type]')
	.action((type) => {
		generateInit(type)
		}
	)

program
	.command('config')
	.action(() => {
		getConfig()
	})


program
	.argument('[emmet]')
	.action((emmet) => {
		const settings = getConfig()
		const emmetTokens = parseEmmet(emmet, settings)
		const rootTemplate = parseTokens(emmetTokens, settings)
		generateTemplate(rootTemplate, settings)
	})

program.parse();