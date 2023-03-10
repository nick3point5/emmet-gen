import path from 'path'
import fs from 'fs'

export function parseTokens(emmetTokens) {
	let location = process.cwd()
	let previous = null
	let parents = []
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
			parents.push(previous)
			template = new Template({name: token.name, location})
			previous.child = template
		}

		if(token.type === 'up') {
			previous = parents.pop(previous)
			location = previous.location
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
		this.templateSrc = this.getMatchingTemplate(type)
		this.location = location
		this.child = child
		this.nextSibling = nextSibling
	}

	getMatchingTemplate(type) {
		const templatePath = path.resolve(`${process.cwd()}/em-gen-templates`)
		const templates = fs.readdirSync(templatePath)
	
		if(!templates.includes(type)) {
			console.log(`no template ${type} found in the em-gen-templates`)
			process.exit(1)
		}
		
		return `${templatePath}\\${type}`
	
	
	}
}
