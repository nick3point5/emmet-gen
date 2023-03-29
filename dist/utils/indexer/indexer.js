import fs from 'fs'
const exportableExtensions = ['.tsx', '.ts', '.jsx', '.js']
const regexExtensionsString = `(\\${exportableExtensions.join('|\\')})$`
const regexExtensions = new RegExp(`${regexExtensionsString}`, 'g')
const isIndex = new RegExp(`(index)${regexExtensionsString}`, 'g')
export function indexer(source, recursive = false, isTypeScript = false) {
	const collator = new Intl.Collator(undefined, {
		numeric: true,
		sensitivity: 'base',
	})
	let text = ''
	let items = fs.readdirSync(source)
	items = items.sort(collator.compare).filter((name) => !isIndex.test(name))
	const files = []
	const directories = []
	for (let i = 0; i < items.length; i++) {
		const item = items[i]
		const itemStat = fs.statSync(`${source}/${item}`)
		if (itemStat.isFile() && regexExtensions.test(item)) {
			files.push(item)
		}
		else if (itemStat.isDirectory()) {
			directories.push(item)
		}
	}
	for (let i = 0; i < files.length; i++) {
		const filename = files[i]
		const nameNoExtension = filename.replace(regexExtensions, '')
		text += `export { ${nameNoExtension} } from './${nameNoExtension}'\n`
		if (/(\.tsx|\.ts)$/m.test(filename)) {
			isTypeScript = true
		}
	}
	if (files.length > 0) {
		text += '\n'
	}
	for (let i = 0; i < directories.length; i++) {
		const directory = directories[i]
		text += `export * from './${directory}'\n`
		if (recursive) {
			const path = `${source}/${directory}`
			isTypeScript = indexer(path, true, isTypeScript)
		}
	}
	if (!text)
		return isTypeScript
	let indexName = `${source}/index.js`
	if (isTypeScript) {
		indexName = `${source}/index.ts`
	}
	fs.writeFileSync(indexName, text)
	return isTypeScript
}
//# sourceMappingURL=indexer.js.map