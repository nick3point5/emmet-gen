import fs from 'fs'
import path from 'path'
import { Template } from '../Template/Template'

export function generateTemplate(root: Template) {
	const queue = [root]
	let nextLevel = []

	while (queue.length > 0) {
		const template = queue.shift()
		if(!template) break

		const { templateSrc, location, child, nextSibling } = template

		if (child) {
			nextLevel.push(child)
		}

		createTemplate(templateSrc, location, template)

		if (nextSibling) {
			queue.push(nextSibling)
		}

		if (queue.length === 0) {
			queue.push(...nextLevel)
			nextLevel = []
		}
	}
}

function createTemplate(source:string, destination:string, template: Template) {
	const items = fs.readdirSync(source)

	const files = []
	const directories = []

	for (let i = 0; i < items.length; i++) {
		const item = items[i]
		const itemStat = fs.statSync(`${source}/${item}`)

		if (itemStat.isFile()) {
			files.push(item)
		} else if (itemStat.isDirectory()) {
			directories.push(item)
		}
	}

	for (let i = 0; i < directories.length; i++) {
		const srcDir = path.resolve(`${source}/${directories[i]}`)
		let destDir = path
			.resolve(`${destination}/${directories[i]}`)
			.replace(/__TemplateName__/g, template.name)

		fs.mkdirSync(destDir, { recursive: true })

		createTemplate(srcDir, destDir, template)
	}

	for (let i = 0; i < files.length; i++) {
		const srcFile = path.resolve(`${source}/${files[i]}`)
		const destFile = path
			.resolve(`${destination}/${files[i]}`)
			.replace(/__TemplateName__/g, template.name)

		let fileContent = fs.readFileSync(srcFile, 'utf8')

		template.replacements?.forEach((value, key) => {
			fileContent = fileContent.replaceAll(key, value)
		})

		fileContent = fileContent.replace(/__TemplateName__/g, template.name)

		fs.writeFileSync(destFile, fileContent)
	}
}
