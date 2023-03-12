import fs from 'fs'
import path from 'path'

export function getConfig() {
	let configsLocation = `${process.cwd()}/em-gen-templates.json`
	let previous = null

	while(!fs.existsSync(configsLocation)) {
		previous = configsLocation
		configsLocation = path.resolve(`${configsLocation}/../../em-gen-templates.json`)

		if (previous === configsLocation) {
			console.error("no em-gen-templates.json found")
			process.exit(1)
		}
	}

	const config = JSON.parse(fs.readFileSync(configsLocation))

	const templatesSrc = path.resolve(configsLocation, '..',config.templatesSource)

	if (!fs.existsSync(templatesSrc)) {
		console.error(`no em-gen-templates found at ${templatesSrc}`)
		process.exit(1)
	}

	if(config.relative) {
		config.baseUrl = path.resolve(process.cwd(), config.baseUrl)
	}else {
		config.baseUrl = path.resolve(configsLocation, '..', config.baseUrl)
	}

	config.templatesSource = templatesSrc

	return config
}
