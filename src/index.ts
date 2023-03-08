import { Command } from 'commander'
import pjson from '../package.json' assert {type: 'json'}

const { version, description } = pjson
const program = new Command()

program
	.version(version)
	.description(description)
	.command('init')
	.action(() => {
		console.log('init 23')
	})
	.parse(process.argv)
