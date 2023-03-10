import path from 'path'
import fs from 'fs'

export function parseTokens(emmetTokens) {
	let location = process.cwd()
	let previousTemplate = null
	let previousOperation = null
	let parentStack = []
	let root = null
	let operation = null

	for (let i = 0; i < emmetTokens.length; i++) {
		const token = emmetTokens[i]

		if(token.type === 'name') {
			let template = new Template({name: token.name, location, operation, previous: previousTemplate})

			operation = null
			location = template.location

			if(!root) {
				root = template
			}

			previousTemplate = template

		} else {
			operation = token.type
			if(token.type === 'sibling') {
				location = previousTemplate.location
			}
			if(token.type === 'child') {
				parentStack.push(previousTemplate)
			}
			if(token.type === 'up') {
				previousTemplate = parentStack.pop()
			}
			if(previousOperation === 'empty') {
				parentStack.push(previousTemplate)
			}

			previousOperation = token.type
		}

	}

	return root
}

class Template {
	constructor({name, location, type="default", nextSibling=null, child=null, operation=null, previous=null,}) {
		this.name = name
		this.type = type
		this.templateSrc = this.getMatchingTemplate(type)
		this.location = location
		this.child = child
		this.nextSibling = nextSibling
		this.operate(operation, previous)
	}

	operate(operation, previous) {
		switch (operation) {
			case 'sibling':
				previous.nextSibling = this
				this.location = previous.location
				break
			case 'child':
				previous.child = this
				this.location += `\\${previous.name}`
				break
			case 'up':
				this.location = previous.location
				previous.nextSibling = this
				break
			case 'empty':
				if(previous && this.location !== previous.location) {
					previous.child = this
					this.location += `\\${previous.name}`
				} else if(previous) {
					previous.nextSibling = this
				}

				this.type = 'empty'
				this.templateSrc = this.getMatchingTemplate('empty')
				break

			default:
				break
		}
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
