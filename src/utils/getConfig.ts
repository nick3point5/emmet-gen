import fs from 'fs'
import path from 'path'
import type ConfigType from '../data/init/emmet-gen-templates.json'

export function getConfig(isAbsolute?: boolean) {
	let configLocation = `${process.cwd()}/emmet-gen-templates.json`
	let previous = null

	while(!fs.existsSync(configLocation)) {
		previous = configLocation
		configLocation = path.resolve(`${configLocation}/../../emmet-gen-templates.json`)


		if (previous === configLocation) {
			console.log(previous)
			console.log(configLocation)
			console.error('no emmet-gen-templates.json found')
			process.exit(1)
		}
	}

	const config:typeof ConfigType = JSON.parse(fs.readFileSync(configLocation).toString())

	const templatesSrc = path.resolve(configLocation, '..',config.templatesSource)

	if (!fs.existsSync(templatesSrc)) {
		console.error(`no emmet-gen-templates found at ${templatesSrc}`)
		process.exit(1)
	}

	if(isAbsolute) config.relative = false

	if (config.relative) {
		config.baseUrl = path.resolve(process.cwd(), config.baseUrl)
	}else {
		config.baseUrl = path.resolve(configLocation, '..', config.baseUrl)
	}

	config.templatesSource = templatesSrc

	return {settings: config, settingsLocation: configLocation}
}
