export function parseString(string: string) {
	const regexArray: string[] = []

	const regexMatches = new Map<string, string>([
		['id', '\\#'],
		['class', '\\.'],
		['sibling', '\\+'],
		['child', '\\>'],
		['up', '\\^'],
		['empty', '(\\\\|\\/)'],
		['multiply', '\\*\\d+'],
		['multiplyStart', '\\@\\d+'],
		['openGroup', '\\('],
		['closeGroup', '\\)'],
		['attr', '\\[.*\\]'],
		['name', '(\\w+|\\$+)+'],
	])

	regexMatches.forEach((value) => {
		regexArray.push(value)
	})

	const emmetRegex = new RegExp(`(${regexArray.join('|')})`, 'g')

	const emmetStrings = string.match(emmetRegex)
	return emmetStrings || []
}
