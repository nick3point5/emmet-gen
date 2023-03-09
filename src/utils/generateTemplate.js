import fs from 'fs'
import path from 'path';
import { copyDirectoryContents } from './copyDirectoryContents.js';
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function generateTemplate(option) {
	switch (option) {
		case 'init':
			generateInit()
			break;

		default:
			console.log('no option found')
			break;
	}
}

function generateInit() {
	const defaultPath = path.resolve(`${__dirname}/../data/init`)
	const destPath = path.resolve(process.cwd())

	copyDirectoryContents(defaultPath, destPath)
}