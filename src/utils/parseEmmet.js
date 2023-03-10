import {parseTokens} from './parseToken.js'

export function parseEmmet(string) {
	const regexArray = []
	const regexOptions = {
		nameRegex: '\\w+',
		idRegex: `\\#\\w+`,
		classRegex: `\\.\\w+`,
		siblingRegex: `\\+\\w+`,
		childRegex: `\\>\\w+`,
		upRegex: `\\^\\w+`,
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
	console.log(parseTokens(emmetTokens))
}

class EmmetToken {
	constructor(tokenString) {
		const firstChar = tokenString[0]
		let type
		let name

		switch (firstChar) {
			case '.':
				type = 'class'
				name = tokenString.substring(1)
				break;

			case '#':
				type = 'id'
				name = tokenString.substring(1)
				break;

			case '+':
				type = 'sibling'
				name = tokenString.substring(1)
				break;

			case '>':
				type = 'child'
				name = tokenString.substring(1)
				break;

			case '^':
				type = 'up'
				name = tokenString.substring(1)
				break;
		
			default:
				type = 'root'
				name = tokenString
				break;
		}

		this.type = type
		this.name = name
	}
}

