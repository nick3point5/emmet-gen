import type ConfigType from '../../../data/emmet-gen-templates.json'
import fs from 'fs'
import path from 'path'

export class Settings {
	public static auto_imports: boolean
	public static relative: boolean
	public static templatesSource: string
	public static baseUrl: string
	public static location: string
	public static configLocation: string
	private static self: Settings

	private constructor(isAbsolute?: boolean) {
		const { settings, settingsLocation } = Settings.getConfig(isAbsolute)
		Settings.auto_imports = settings.auto_imports
		Settings.relative = settings.relative
		Settings.templatesSource = settings.templatesSource
		Settings.baseUrl = settings.baseUrl
		Settings.location = settingsLocation
	}

	public static init(isAbsolute?: boolean) {
		if (Settings.self) return Settings.self
		Settings.self = new Settings(isAbsolute)
		return Settings.self
	}

	public static reset() {
		Settings.self =  new Settings()
	}

	public static getConfig(isAbsolute?: boolean) {
		Settings.configLocation ??= `${process.cwd()}/emmet-gen-templates.json`
		let previous = null

		while (!fs.existsSync(Settings.configLocation)) {
			previous = Settings.configLocation
			Settings.configLocation = path.resolve(`${Settings.configLocation}/../../emmet-gen-templates.json`)

			if (previous === Settings.configLocation) {
				console.error('no emmet-gen-templates.json found')
				process.exit(1)
			}
		}

		const config: typeof ConfigType = JSON.parse(fs.readFileSync(Settings.configLocation).toString())

		const templatesSrc = path.resolve(Settings.configLocation, '..', config.templatesSource)

		if (!fs.existsSync(templatesSrc)) {
			console.error(`no emmet-gen-templates found at ${templatesSrc}`)
			process.exit(1)
		}

		if (isAbsolute) config.relative = false

		if (config.relative) {
			config.baseUrl = path.resolve(process.cwd(), config.baseUrl)
		} else {
			config.baseUrl = path.resolve(Settings.configLocation, '..', config.baseUrl)
		}

		config.templatesSource = templatesSrc

		return { settings: config, settingsLocation: Settings.configLocation }
	}
}
