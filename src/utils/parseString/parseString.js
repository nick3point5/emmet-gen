export function parseString(string) {
	const regexArray = []
	const regexOptions = {
		idRegex: `\\#`,
		classRegex: `\\.`,
		siblingRegex: `\\+`,
		childRegex: `\\>`,
		upRegex: `\\^`,
		emptyRegex: `(\\\\|\\/)`,
		multiplyRegex: `\\*\\d+`,
		multiplyStartRegex: `\\@\\d+`,
		openGroupRegex: `\\(`,
		closeGroupRegex: `\\)`,
		attrRegex: `\\[.*\\]`,
		nameRegex: '(\\w+|\\$+)+',
	}

	for (const regex in regexOptions) {
		const regexString = regexOptions[regex];
		regexArray.push(regexString)
	}

	const emmetRegex = new RegExp(`(${regexArray.join('|')})`,'g')

	const emmetStrings = string.match(emmetRegex)
	return emmetStrings
}