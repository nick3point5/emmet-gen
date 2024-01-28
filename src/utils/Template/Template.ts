export type TemplateProps = {
	name: string
	location: string
	type: string
	className: string
	next?: Template
	previous?: Template
	replacements?: Map<string, string>
}

export class Template {
	name: string
	location: string
	type: string
	next?: Template
	previous?: Template
	replacements: Map<string, string>
	className: string
	constructor({
		name,
		location,
		type = 'default',
		className = 'default',
		next,
		previous,
		replacements,
	}: TemplateProps) {
		this.name = name
		this.location = location
		this.type = type
		this.className = className
		this.next ??= next
		this.previous ??= previous
		this.replacements = replacements || new Map<string, string>()
	}
}