import { Command } from 'commander'
import pjson from '../package.json' assert {type: 'json'}
import { generateTemplate } from './utils/generateTemplate.js'

const { version, description } = pjson
const program = new Command()

program
	.version(version)
	.description(description)
	.command('init')
	.action(() => {
		generateTemplate('init')
	})
	.parse(process.argv)
