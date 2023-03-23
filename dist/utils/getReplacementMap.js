export function getReplacementMap(string) {
	const replaceMap = new Map()
	string = string.replace(/&nbsp/g, ' ')
	const keys = string.match(/\w+(?==)/g)
	string = string.replace(/\w+=/g, '')
	const values = string.match(/(?<=").*?(?=")/g)
	if (!keys || !values || keys.length !== values.length) {
		console.log('The attr property is not properly formatted.')
		process.exit(1)
	}
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i]
		const value = values[i]
		replaceMap.set(key, value)
	}
	return replaceMap
}
//# sourceMappingURL=getReplacementMap.js.map