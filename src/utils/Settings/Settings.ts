import type ConfigType from '../../data/emmet-gen-templates.json'
import fs from 'fs'
import path from 'path'

export class Settings {
	public static auto_imports: boolean
	public static relative: boolean
	public static templatesSource: string
	public static baseUrl: string
	public static location: string
	private static self: Settings

	private constructor() {
		const { settings, settingsLocation } = Settings.getConfig()
		Settings.auto_imports = settings.auto_imports
		Settings.relative = settings.relative
		Settings.templatesSource = settings.templatesSource
		Settings.baseUrl = settings.baseUrl
		Settings.location = settingsLocation
	}

	public static init() {
		if(Settings.self) return Settings.self
		Settings.self = new Settings()
		return Settings.self
	}

	public static getConfig(isAbsolute?: boolean) {
		let configLocation = `${process.cwd()}/emmet-gen-templates.json`
		let previous = null

		while (!fs.existsSync(configLocation)) {
			previous = configLocation
			configLocation = path.resolve(`${configLocation}/../../emmet-gen-templates.json`)

			if (previous === configLocation) {
				console.error('no emmet-gen-templates.json found')
				process.exit(1)
			}
		}

		const config: typeof ConfigType = JSON.parse(fs.readFileSync(configLocation).toString())

		const templatesSrc = path.resolve(configLocation, '..', config.templatesSource)

		if (!fs.existsSync(templatesSrc)) {
			console.error(`no emmet-gen-templates found at ${templatesSrc}`)
			process.exit(1)
		}

		if (isAbsolute) config.relative = false

		if (config.relative) {
			config.baseUrl = path.resolve(process.cwd(), config.baseUrl)
		} else {
			config.baseUrl = path.resolve(configLocation, '..', config.baseUrl)
		}

		config.templatesSource = templatesSrc

		return { settings: config, settingsLocation: configLocation }
	}
}
