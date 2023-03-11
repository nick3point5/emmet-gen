import {parseTokens} from './parseTokens.js'
import {generateTemplate} from './generateTemplate.js'

export function parseEmmet(string) {
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
	const rootTemplate = parseTokens(emmetTokens, process.cwd())
	generateTemplate(rootTemplate)

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

			case '\\':
				type = 'empty'
				name = tokenString.substring(1)
				break;

			case '/':
				type = 'empty'
				name = tokenString.substring(1)
				break;

			case '*':
				type = 'multiply'
				name = tokenString.substring(1)
				break;

			case '@':
				type = 'multiplyStart'
				name = tokenString.substring(1)
				break;

			case '(':
				type = 'openGroup'
				name = tokenString.substring(1)
				break;

			case ')':
				type = 'closeGroup'
				name = tokenString.substring(1)
				break;

		
			default:
				type = 'name'
				name = tokenString
				break;
		}

		this.type = type
		this.name = name
	}
}

