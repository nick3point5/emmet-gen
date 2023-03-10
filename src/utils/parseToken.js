export function parseTokens(emmetTokens) {
	let location = process.cwd()
	let previous = null
	let parent = null
	let root = null

	for (let i = 0; i < emmetTokens.length; i++) {
		const token = emmetTokens[i]
		let template

		if(token.type === 'root') {
			template = new Template({name: token.name, location})
			root = template
		}

		if(token.type === 'sibling') {
			template = new Template({name: token.name, location})
			previous.nextSibling = template
		}

		if(token.type === 'child') {
			location += `\\${previous.name}`
			parent = previous
			template = new Template({name: token.name, location})
			previous.child = template
		}

		if(token.type === 'up') {
			previous = parent
			location = location.replace(/\\\\\w+$/g,"")
			template = new Template({name: token.name, location})
			previous.nextSibling = template
		}

		previous = template
	}

	return root
}

class Template {
	constructor({name, location, type="default", nextSibling=null, child=null}) {
		this.name = name
		this.type = type
		this.location = location
		this.child = child
		this.nextSibling = nextSibling
	}
}