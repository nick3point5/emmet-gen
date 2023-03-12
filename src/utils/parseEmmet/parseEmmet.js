

export function parseEmmet(string, settings) {
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
	const emmetTokens = []


	for (let i = 0; i < emmetStrings.length; i++) {
		const tokenString = emmetStrings[i];

		emmetTokens.push(new EmmetToken(tokenString))
	}

	return emmetTokens
}

class EmmetToken {
	constructor(tokenString) {
		const firstChar = tokenString[0]
		let type
		let value

		switch (firstChar) {
			case '.':
				type = 'class'
				value = tokenString.substring(1)
				break;

			case '#':
				type = 'id'
				value = tokenString.substring(1)
				break;

			case '+':
				type = 'sibling'
				value = tokenString.substring(1)
				break;

			case '>':
				type = 'child'
				value = tokenString.substring(1)
				break;

			case '^':
				type = 'up'
				value = tokenString.substring(1)
				break;

			case '\\':
				type = 'empty'
				value = tokenString.substring(1)
				break;

			case '/':
				type = 'empty'
				value = tokenString.substring(1)
				break;

			case '*':
				type = 'multiply'
				value = tokenString.substring(1)
				break;

			case '@':
				type = 'multiplyStart'
				value = tokenString.substring(1)
				break;

			case '(':
				type = 'openGroup'
				value = tokenString.substring(1)
				break;

			case ')':
				type = 'closeGroup'
				value = tokenString.substring(1)
				break;

			case '[':
				type = 'attr'
				value = tokenString.substring(1, tokenString.length-1)
				break;

		
			default:
				type = 'name'
				value = tokenString
				break;
		}

		this.type = type
		this.value = value
	}
}
