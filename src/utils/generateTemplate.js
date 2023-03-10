import fs from 'fs'

export function generateTemplate(root) {
	const queue = [root]
	let nextLevel = []

	while (queue.length > 0) {
		const template = queue.shift()
		const {templateSrc, location, name, child, nextSibling} = template

		if(child) {
			nextLevel.push(child)
		}

		createTemplate(templateSrc, location, name)

		if(nextSibling) {
			queue.push(nextSibling)
		}

		if(queue.length === 0) {
			queue.push(...nextLevel)
			nextLevel = []
		}
	}
}

function createTemplate(source, destination, name) {
	const items = fs.readdirSync(source)

	const files = []
	const directories = []

	for (let i = 0; i < items.length; i++) {
		const item = items[i]
		const itemStat = fs.statSync(`${source}\\${item}`)

		if (itemStat.isFile()) {
			files.push(item);
		} else if (itemStat.isDirectory()) {
			directories.push(item);
		}
	}

	for (let i = 0; i < directories.length; i++) {
		const srcDir = `${source}\\${directories[i]}`
		let destDir = `${destination}\\${directories[i]}`
			.replace(/__TemplateName__/g, name)

		fs.mkdirSync(destDir, { recursive: true})
		createTemplate(srcDir, destDir, name)
	}

	for (let i = 0; i < files.length; i++) {
		const srcFile = `${source}\\${files[i]}`
		const destFile = `${destination}\\${files[i]}`
			.replace(/__TemplateName__/g, name)

		let fileContent = fs.readFileSync(srcFile,"utf8")
			.replace(/__TemplateName__/g, name)

		fs.writeFileSync(destFile, fileContent)
	}
}