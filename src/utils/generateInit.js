import path from 'path'
import { copyDirectoryContents } from './copyDirectoryContents.js'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function generateInit(type) {
	let sourcePath
	if(type === 'test') {
		sourcePath = path.resolve(`${__dirname}/../data/initTest`)
	}else {
		sourcePath = path.resolve(`${__dirname}/../data/init`)
	}

	const destPath = path.resolve(process.cwd())

	copyDirectoryContents(sourcePath, destPath)

	fs.unlinkSync(
		path.resolve(`${process.cwd()}/emmet-gen-templates/empty/__TemplateName__/.gitignore`),
	)
}
