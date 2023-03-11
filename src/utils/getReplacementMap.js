export function getReplacementMap(string) {
	const replaceMap = new Map()

	string = string.replaceAll('&nbsp'," ")
	const keys = string.match(/\w+(?==)/g)
	string = string.replace(/\w+=/g,"")
	const values = string.match(/(?<=\").*?(?=\")/g)

	if(keys.length !== values.length) {
		console.log("The attr property is not properly formatted.")

		process.exit(1)
	}

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i]
		const value = values[i]

		replaceMap.set(key, value)
	}

	return replaceMap
}
