import fs from 'fs'
import { getReplacementMap } from '../getReplacementMap.js'

export function parseTokens( 
	emmetTokens, 
	settings, 
	rootSrc=null, 
	groupCountLength = null, 
	groupCount = null	
	) {
	let location = rootSrc || settings.baseUrl
	let previousTemplate = null
	let previousOperation = null
	let parentStack = []
	let parentTypeStack = ['default']
	let root = null
	let operation = null
	let parentType = 'default'
	let multiplyStart = 1
	let layer = 1
	const groupLayer = []
	const groupTokens = []
	const groupLinks = []
	let groupLink = {
		template: null,
		type: null
	}

	for (let i = 0; i < emmetTokens.length; i++) {
		const token = emmetTokens[i]

		if(groupTokens.length > 0) {
			groupTokens.push(token)
		}

		if(token.type === 'name') {
			if(operation === 'class') {
				previousTemplate.setClass(token.value, settings)
				operation = null
				continue
			}

			if(operation === 'id') {
				previousTemplate.setId(token.value, settings)
				operation = null
				continue
			}

			if(groupCountLength) {
				const match = token.value.match(/\$+/g)
				if(match) {
					groupCountLength = match[0].length
				}
			}

			const type = parentType
			const name = (!groupCount) 
				? token.value 
				: replaceCountMarker(token.value, groupCount, groupCountLength)

			let template = new Template({name, location, operation, previous: previousTemplate, type, settings})

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
				layer++
			}
			if(token.type === 'up') {
				previousTemplate = parentStack.pop()
				parentType = parentTypeStack.pop()
				location = previousTemplate.location
				layer--
			}
			if(previousOperation === 'empty') {
				parentStack.push(previousTemplate)
				parentTypeStack.push(parentType)
				location = previousTemplate.getChildLocation()
				layer++
			}
			if(token.type === 'multiply') {
				const match = previousTemplate.name.match(/\$+/g)
				if(!match) {
					console.error('root template must have "$" in name')
				}

				const countLength = match[0].length

				if(previousOperation === 'closeGroup') {
					groupTokens.pop()
					groupTokens.pop()
					const captureTokens = []
					let groupToken
					while (groupToken?.type !== 'openGroup') {
						groupToken = groupTokens.pop()
						captureTokens.unshift(groupToken)
					}

					captureTokens.shift()

					const n = Number(token.value)

					let groupTemplate

					function linkGroup(groupLink, groupTemplate) {
						if(groupLink.type === 'sibling') {
							let next = groupLink.template
							while(next.nextSibling) {
								next = next.nextSibling
							}
							next.nextSibling = groupTemplate
						}
						if(groupLink.type === 'child') {
							groupLink.template.child = groupTemplate
						}
						if(groupLink.type === null) {
							root = groupTemplate
						}
					}

					let groupSrc = groupLink.template?.location || location

					if(groupLink.type === 'child') {
						groupSrc = groupLink.template.getChildLocation()
					}

					for (let i = multiplyStart-1; i < n; i++) {
						groupTemplate = parseTokens(captureTokens, settings, groupSrc, 1, i+1)
						linkGroup(groupLink, groupTemplate)
						groupLink.template = groupTemplate
						groupLink.type = 'sibling'
						previousTemplate = groupTemplate
					}

				}else {
					let replacementMap = null
					if(previousOperation === 'attr') {
						replacementMap = previousTemplate.replacements
					}
					const countName = previousTemplate.name

					previousTemplate.name = replaceCountMarker(countName, multiplyStart, countLength)
					
					const n = Number(token.value)
					for (let i = multiplyStart; i < n; i++) {
						const name = replaceCountMarker(countName, i+1, countLength)
	
						let template = new Template({name, location, operation:'sibling', previous: previousTemplate, type: previousTemplate.type, settings})

						template.replacements = replacementMap
	
						previousTemplate = template
					}
				}

				multiplyStart = 1
			}
			if(token.type === 'multiplyStart') {
				multiplyStart = Number(token.value)
			}
			if(token.type === 'openGroup') {
				groupLayer.push(layer)
				groupTokens.push(token)
				groupLink = {
					template: previousTemplate,
					type: previousOperation
				}
				groupLinks.push(groupLink)

			}
			if(token.type === 'closeGroup') {
				const openLayer = groupLayer.pop(layer)
				while(openLayer !== layer) {
					previousTemplate = parentStack.pop()
					parentType = parentTypeStack.pop()
					layer--
				}
				groupLink = groupLinks.pop()
			}
			if(token.type === 'attr') {
				previousTemplate.setReplacements(token.value)
			}

			previousOperation = token.type
		}

	}

	return root
}

export class Template {
	constructor({name, location, type="default", nextSibling=null, child=null, operation=null, previous=null,settings=null}) {
		this.name = name
		this.type = type
		this.templateSrc = this.getMatchingTemplate(type, settings)
		this.location = location
		this.child = child
		this.nextSibling = nextSibling
		this.replacements = null
		this.operate(operation, previous, settings)
	}

	operate(operation, previous, settings) {
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
				this.templateSrc = this.getMatchingTemplate('empty', settings)
				break

			default:
				break
		}
	}

	getMatchingTemplate(type, settings) {
		const templatePath = settings.templatesSource
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
				console.error(`there must be exactly 1 file or directory with a name containing "__TemplateName__" in the template: ${type}`)
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

	setClass(type, settings) {
		this.type = type
		this.templateSrc = this.getMatchingTemplate(type, settings)
	}

	setId(type, settings) {
		this.templateSrc = this.getMatchingTemplate(type, settings)
	}

	setReplacements(attr) {
		this.replacements = getReplacementMap(attr)
	}
}

function replaceCountMarker(name, count,countLength) {
	let countName = String(count).padStart(countLength,'0')
	return name.replace(/\$+/g, countName)
}
