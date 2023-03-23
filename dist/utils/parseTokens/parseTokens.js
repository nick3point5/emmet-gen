import { Template } from '../Template/Template.js'
export function parseTokens(emmetTokens, settings, rootSrc = '', groupCountLength = 0, groupCount = 0) {
	var _a, _b
	let location = rootSrc || settings.baseUrl
	let previousTemplate = null
	let previousOperation = ''
	let parentStack = []
	let parentTypeStack = ['default']
	let root = null
	let operation = ''
	let parentType = 'default'
	let multiplyStart = 1
	let layer = 1
	const groupLayer = []
	const groupTokens = []
	const groupLinks = []
	let groupLink = {
		template: null,
		type: null,
	}
	for (let i = 0; i < emmetTokens.length; i++) {
		const token = emmetTokens[i]
		if (groupTokens.length > 0) {
			groupTokens.push(token)
		}
		if (token.type === 'name') {
			if (operation === 'class') {
				if (!previousTemplate) {
					parentType = token.value
					parentTypeStack[0] = token.value
					continue
				}
				if (previousOperation === 'empty') {
					previousTemplate.type = token.value
					continue
				}
				previousTemplate.setClass(token.value, settings)
				operation = ''
				continue
			}
			if (operation === 'id') {
				previousTemplate === null || previousTemplate === void 0 ? void 0 : previousTemplate.setId(token.value, settings)
				operation = ''
				continue
			}
			if (groupCountLength) {
				const match = token.value.match(/\$+/g)
				if (match !== null) {
					groupCountLength = match[0].length
				}
			}
			const type = parentType
			const name = !groupCount
				? token.value
				: replaceCountMarker(token.value, groupCount, groupCountLength)
			let template = new Template({
				name,
				location,
				operation,
				previous: previousTemplate,
				type,
				settings,
			})
			operation = ''
			location = template.location
			if (!root) {
				root = template
			}
			previousTemplate = template
		}
		else {
			operation = token.type
			if (token.type === 'sibling') {
				location = (previousTemplate === null || previousTemplate === void 0 ? void 0 : previousTemplate.location) || location
			}
			if (token.type === 'child') {
				if (previousTemplate) {
					parentStack.push(previousTemplate)
					parentTypeStack.push(parentType)
					if (previousTemplate.type !== 'empty') {
						parentType = previousTemplate.type
					}
					layer++
				}
			}
			if (token.type === 'up') {
				previousTemplate = parentStack.pop()
				parentType = parentTypeStack.pop() || 'default'
				location = (previousTemplate === null || previousTemplate === void 0 ? void 0 : previousTemplate.location) || location
				layer--
			}
			if (token.type === 'multiply') {
				const match = previousTemplate === null || previousTemplate === void 0 ? void 0 : previousTemplate.name.match(/\$+/g)
				if (!match) {
					console.error('root template must have "$" in name')
				}
				const countLength = match[0].length
				if (previousOperation === 'closeGroup') {
					groupTokens.pop()
					groupTokens.pop()
					const captureTokens = []
					let groupToken
					while ((groupToken === null || groupToken === void 0 ? void 0 : groupToken.type) !== 'openGroup') {
						groupToken = groupTokens.pop()
						if (!groupToken) {
							console.error('grouping parentheses unmatched')
							process.exit(1)
						}
						captureTokens.unshift(groupToken)
					}
					captureTokens.shift()
					const n = Number(token.value)
					let groupTemplate
					let groupSrc = ((_a = groupLink.template) === null || _a === void 0 ? void 0 : _a.location) || location
					if (groupLink.type === 'child') {
						groupSrc = ((_b = groupLink.template) === null || _b === void 0 ? void 0 : _b.getChildLocation()) || location
					}
					if (!root) {
						console.log('invalid emmet')
						process.exit(1)
					}
					for (let i = multiplyStart - 1; i < n; i++) {
						groupTemplate = parseTokens(captureTokens, settings, groupSrc, 1, i + 1)
						root = linkGroup(root, groupLink, groupTemplate)
						groupLink.template = groupTemplate
						groupLink.type = 'sibling'
						previousTemplate = groupTemplate
					}
				}
				else if (previousTemplate) {
					let replacementMap = null
					if (previousOperation === 'attr') {
						replacementMap = previousTemplate.replacements
					}
					const countName = previousTemplate.name
					previousTemplate.name = replaceCountMarker(countName, multiplyStart, countLength)
					const n = Number(token.value)
					for (let i = multiplyStart; i < n; i++) {
						const name = replaceCountMarker(countName, i + 1, countLength)
						let template = new Template({
							name,
							location,
							operation: 'sibling',
							previous: previousTemplate,
							type: previousTemplate.type,
							settings,
						})
						template.replacements = replacementMap
						previousTemplate = template
					}
				}
				multiplyStart = 1
			}
			if (token.type === 'multiplyStart') {
				multiplyStart = Number(token.value)
			}
			if (token.type === 'openGroup') {
				groupLayer.push(layer)
				groupTokens.push(token)
				groupLink = {
					template: previousTemplate || null,
					type: previousOperation,
				}
				groupLinks.push(groupLink)
			}
			if (token.type === 'closeGroup') {
				const openLayer = groupLayer.pop()
				while (openLayer !== layer) {
					previousTemplate = parentStack.pop()
					parentType = parentTypeStack.pop() || 'default'
					layer--
				}
				if (groupLinks.length === 0) {
					console.log('unmatched parentheses')
					process.exit(1)
				}
				groupLink = groupLinks.pop()
			}
			if (token.type === 'attr') {
				previousTemplate === null || previousTemplate === void 0 ? void 0 : previousTemplate.setReplacements(token.value)
			}
			if (previousOperation === 'empty' && previousTemplate) {
				parentStack.push(previousTemplate)
				parentTypeStack.push(parentType)
				location = previousTemplate.getChildLocation()
				layer++
			}
			previousOperation = token.type
		}
	}
	if (!root) {
		console.log('invalid emmet')
		process.exit(1)
	}
	return root
}
function replaceCountMarker(name, count, countLength) {
	let countName = String(count).padStart(countLength, '0')
	return name.replace(/\$+/g, countName)
}
function linkGroup(root, groupLink, groupTemplate) {
	if (groupLink.template === null || groupLink.type === null) {
		return groupTemplate
	}
	if (groupLink.type === 'sibling') {
		let next = groupLink.template
		while (next.nextSibling) {
			next = next.nextSibling
		}
		next.nextSibling = groupTemplate
	}
	if (groupLink.type === 'child') {
		groupLink.template.child = groupTemplate
	}
	return root
}
//# sourceMappingURL=parseTokens.js.map