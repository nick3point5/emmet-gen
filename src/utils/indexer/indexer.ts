import fs from 'fs'

type Result = {
	text: string
	isTypeScript: boolean
}

const exportableExtensions = ['.tsx', '.ts', '.jsx', '.js']
const regexExtensionsString = `(\\${exportableExtensions.join('|\\')})$`
const regexExtensions = new RegExp(`${regexExtensionsString}`, 'g')
const isIndex = new RegExp(`(index)${regexExtensionsString}`, 'g')

export function indexer(source: fs.PathLike, recursive = false, isTypeScript = false) {
	const collator = new Intl.Collator(undefined, {
		numeric: true,
		sensitivity: 'base',
	})

	let result: Result = { text: '', isTypeScript }
	let items = fs.readdirSync(source)

	items = items.sort(collator.compare).filter((name) => !isIndex.test(name))

	const [files, directories] = getFilesDirectories(items, source)

	result = makeIndexFile(result, files)

	if (files.length > 0 && directories.length > 0) {
		result.text += '\n'
	}

	result = searchNextDirectory(result, directories, source, recursive)

	if (!result.text) return result.isTypeScript

	if (result.isTypeScript) {
		fs.writeFileSync(`${source}/index.ts`, result.text)
	} else {
		fs.writeFileSync(`${source}/index.js`, result.text)
	}

	return result.isTypeScript
}

function getFilesDirectories(items: string[], source: fs.PathLike) {
	const files: string[] = []
	const directories: string[] = []
	for (let i = 0; i < items.length; i++) {
		const item = items[i]
		const itemStat = fs.statSync(`${source}/${item}`)

		if (itemStat.isFile() && regexExtensions.test(item)) {
			files.push(item)
		} else if (itemStat.isDirectory()) {
			directories.push(item)
		}
	}
	return [files, directories]
}

function makeIndexFile(result: Result, files: string[]) {
	for (let i = 0; i < files.length; i++) {
		const filename = files[i]
		const nameNoExtension = filename.replace(regexExtensions, '')
		if (nameNoExtension === 'index') {
			continue
		}
		result.text += `export { ${nameNoExtension} } from './${nameNoExtension}'\n`

		if (/(\.tsx|\.ts)$/m.test(filename)) {
			result.isTypeScript = true
		}
	}
	return result
}

function searchNextDirectory(
	result: Result,
	directories: string[],
	source: fs.PathLike,
	recursive = false,
) {
	for (let i = 0; i < directories.length; i++) {
		const directory = directories[i]

		result.text += `export * from './${directory}'\n`

		if (recursive) {
			const path = `${source}/${directory}`
			result.isTypeScript = indexer(path, true, result.isTypeScript)
		}
	}

	return result
}
