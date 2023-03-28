import fs from 'fs'
import path from 'path'
export class InitTemplate {
	constructor(name, content, location, type) {
		this.name = name
		this.content = content
		this.location = location
		this.type = type
		this.children = []
	}
	static encodeInit(basePath, sourceLocation, parent) {
		if (!fs.existsSync(sourceLocation)) {
			throw new Error(`${sourceLocation} does not exist`)
		}
		if (!parent) {
			console.log(sourceLocation)
			const parentPath = `./${path.relative(basePath, sourceLocation)}`.replace(/\\/g, '/')
			parent = new InitTemplate('root', null, parentPath, 'directory')
			const jsonLocation = path.resolve(basePath, 'emmet-gen-templates.json')
			const jsonPath = `./${path.relative(basePath, jsonLocation)}`.replace(/\\/g, '/')
			const jsonContent = fs.readFileSync(jsonLocation, 'utf8')
			const jsonTemplate = new InitTemplate('emmet-gen-templates.json', jsonContent, jsonPath, 'file')
			parent.children.push(jsonTemplate)
		}
		const items = fs.readdirSync(path.resolve(sourceLocation), 'utf8')
		if (items.length === 0)
			return
		let template
		for (let i = 0; i < items.length; i++) {
			const item = items[i]
			const itemLocation = `${sourceLocation}/${item}`
			const itemPath = `./${path.relative(basePath, itemLocation)}`.replace(/\\/g, '/')
			const itemStat = fs.statSync(itemPath)
			if (itemStat.isFile()) {
				const content = fs.readFileSync(itemLocation, 'utf8')
				template = new InitTemplate(item, content, itemPath, 'file')
			}
			else {
				template = new InitTemplate(item, null, itemPath, 'directory')
				InitTemplate.encodeInit(basePath, itemLocation, template)
			}
			if (parent) {
				parent.children.push(template)
			}
		}
		return JSON.stringify(parent)
	}
	static createInit(destPath, json) {
		var _a
		const initTemplate = JSON.parse(json)
		const queue = [initTemplate]
		while (queue.length > 0) {
			const current = queue.shift()
			const location = path.resolve(destPath, (_a = current.location) !== null && _a !== void 0 ? _a : '')
			const content = current.content
			if (current.type === 'directory') {
				if (!fs.existsSync(location)) {
					fs.mkdirSync(location, { recursive: true })
				}
				for (let i = 0; i < current.children.length; i++) {
					queue.push(current.children[i])
				}
			}
			else {
				fs.writeFileSync(location, content)
			}
		}
	}
}
//# sourceMappingURL=InitTemplate.js.map