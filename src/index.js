import { Command } from 'commander'
import pkg from '../package.json' assert {type: 'json'}
import { parseEmmet } from './utils/parseEmmet.js'
import  { generateInit } from './utils/generateInit.js'
import { getConfig } from './utils/getConfig.js'

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
		parseEmmet(emmet, settings)
	})

program.parse();