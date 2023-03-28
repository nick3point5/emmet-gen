import fs from 'fs'
import path from 'path'
import type ConfigType from '../../data/emmet-gen-templates.json'
import { getReplacementMap } from '../getReplacementMap.js'

type TemplateInput = {
	name: string
	location: string
	type?: string
	nextSibling?: Template | null
	child?: Template | null
	operation?: string
	previous?: Template | null
	settings: typeof ConfigType
}

export class Template {
	name: any
	type: string
	templateSrc: string
	location: string
	child: Template | null
	nextSibling: Template | null
	replacements: Map<string, string> | null
	constructor({
		name,
		location,
		type = 'default',
		nextSibling = null,
		child = null,
		operation = '',
		previous = null,
		settings,
	}: TemplateInput) {
		this.name = name
		this.type = type
		this.templateSrc = this.getMatchingTemplate(type, settings)
		this.location = path.resolve(location)
		this.child = child
		this.nextSibling = nextSibling
		this.replacements = null
		this.operate(operation, previous, settings)
	}

	operate(operation: string, previous: Template | null, settings: typeof ConfigType) {
		switch (operation) {
			case 'sibling':
				if (!previous) break
				previous.nextSibling = this
				this.location = previous.location
				break
			case 'child':
				if (!previous) break
				previous.child = this

				this.location = previous.getChildLocation()
				break
			case 'up':
				if (!previous) break
				this.location = previous.location
				previous.nextSibling = this
				break
			case 'empty':
				this.type = 'empty'
				this.templateSrc = this.getMatchingTemplate('empty', settings)

				if (!previous) break

				if (this.location !== previous.location) {
					previous.child = this
					this.location = previous.getChildLocation()
				} else {
					previous.nextSibling = this
				}
				break

			default:
				break
		}
	}

	getMatchingTemplate(type: string, settings: typeof ConfigType) {
		const templatePath = settings.templatesSource
		const templates = fs.readdirSync(templatePath)

		if (!templates.includes(type)) {
			console.error(`no template ${type} found in the emmet-gen-templates`)
			process.exit(1)
		}

		const templateSrc = path.resolve(`${templatePath}/${type}`)
		const srcDir = fs.readdirSync(templateSrc)

		for (let i = 0; i < srcDir.length; i++) {
			const template = srcDir[i]
			if (!/__TemplateName__/g.test(template) || srcDir.length > 1) {
				console.error(
					`there must be exactly 1 file or directory with a name containing "__TemplateName__" in the template: ${type}`,
				)
				process.exit(1)
			}
		}

		return templateSrc
	}

	getChildLocation() {
		const templates = fs.readdirSync(this.templateSrc)

		templates[0] = templates[0].replace(/__TemplateName__/g, this.name)
		return path.resolve(`${this.location}/${templates[0]}`)
	}

	setClass(type: string, settings: typeof ConfigType) {
		this.templateSrc = this.getMatchingTemplate(type, settings)
		this.type = type
	}

	setId(type: string, settings: typeof ConfigType) {
		this.templateSrc = this.getMatchingTemplate(type, settings)
	}

	setReplacements(attr: string) {
		this.replacements = getReplacementMap(attr)
	}
}