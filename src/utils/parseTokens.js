import path from 'path'
import fs from 'fs'

export function parseTokens(emmetTokens) {
	let location = process.cwd()
	let previousTemplate = null
	let previousOperation = null
	let parentStack = []
	let parentTypeStack = ['default']
	let root = null
	let operation = null
	let parentType = 'default'

	for (let i = 0; i < emmetTokens.length; i++) {
		const token = emmetTokens[i]

		if(token.type === 'name') {
			if(operation === 'class') {
				previousTemplate.setClass(token.name)
				operation = null
				continue
			}

			if(operation === 'id') {
				previousTemplate.setId(token.name)
				operation = null
				continue
			}

			let type = parentType

			let template = new Template({name: token.name, location, operation, previous: previousTemplate, type})

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
				parentTypeStack.push(parentType)
				parentType = previousTemplate.type
			}
			if(token.type === 'up') {
				previousTemplate = parentStack.pop()
				parentType = parentTypeStack.pop()
				location = previousTemplate.location
			}
			if(previousOperation === 'empty') {
				parentStack.push(previousTemplate)
				parentTypeStack.push(parentType)
				location = previousTemplate.getChildLocation()
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

				this.location = previous.getChildLocation()
				break
			case 'up':
				this.location = previous.location
				previous.nextSibling = this
				break
			case 'empty':
				if(previous && this.location !== previous.location) {
					previous.child = this
					this.location = previous.getChildLocation()
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
			console.error(`no template ${type} found in the em-gen-templates`)
			process.exit(1)
		}

		const templateSrc = `${templatePath}\\${type}`
		const srcDir = fs.readdirSync(templateSrc)

		for (let i = 0; i < srcDir.length; i++) {
			const template = srcDir[i];
			if(!(/__TemplateName__/g).test(template) || srcDir.length > 1) {
				console.error(`there must be exactly 1 directory with a name containing "__TemplateName__" in the template: ${type}`)
				process.exit(1)
			}
			
		}

		return templateSrc
	}

	getChildLocation() {
		const templates = fs.readdirSync(this.templateSrc)

		templates[0] = templates[0].replace(/__TemplateName__/g, this.name)
		return `${this.location}/${templates[0]}`
	}

	setClass(type) {
		this.type = type
		this.templateSrc = this.getMatchingTemplate(type)
	}

	setId(type) {
		this.templateSrc = this.getMatchingTemplate(type)

	}
}
