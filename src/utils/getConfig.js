import fs from 'fs'
import path from 'path'

export function getConfig() {
	let configLocation = `${process.cwd()}/emmet-gen-templates.json`
	let previous = null

	while(!fs.existsSync(configLocation)) {
		previous = configLocation
		configLocation = path.resolve(`${configLocation}/../../emmet-gen-templates.json`)

		if (previous === configLocation) {
			console.error('no emmet-gen-templates.json found')
			process.exit(1)
		}
	}

	const config = JSON.parse(fs.readFileSync(configLocation))

	const templatesSrc = path.resolve(configLocation, '..',config.templatesSource)

	if (!fs.existsSync(templatesSrc)) {
		console.error(`no emmet-gen-templates found at ${templatesSrc}`)
		process.exit(1)
	}

	if (config.relative) {
		config.baseUrl = path.resolve(process.cwd(), config.baseUrl)
	}else {
		config.baseUrl = path.resolve(configLocation, '..', config.baseUrl)
	}

	config.templatesSource = templatesSrc

	return {settings: config, settingsLocation: configLocation}
}
