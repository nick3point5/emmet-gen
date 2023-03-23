import fs from 'fs'
export function copyDirectoryContents(source, destination) {
	const items = fs.readdirSync(source)
	const files = []
	const directories = []
	for (let i = 0; i < items.length; i++) {
		const item = items[i]
		const itemStat = fs.statSync(`${source}/${item}`)
		if (itemStat.isFile()) {
			files.push(item)
		}
		else if (itemStat.isDirectory()) {
			directories.push(item)
		}
	}
	for (let i = 0; i < directories.length; i++) {
		const srcDir = `${source}/${directories[i]}`
		const destDir = `${destination}/${directories[i]}`
		fs.mkdirSync(destDir, { recursive: true })
		copyDirectoryContents(srcDir, destDir)
	}
	for (let i = 0; i < files.length; i++) {
		const srcFile = `${source}/${files[i]}`
		const destFile = `${destination}/${files[i]}`
		fs.copyFileSync(srcFile, destFile)
	}
}
//# sourceMappingURL=copyDirectoryContents.js.map