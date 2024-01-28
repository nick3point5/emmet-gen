import { InitTemplate } from '../InitTemplate/InitTemplate.js'
import fs from 'fs'
import { Settings } from '../Settings/Settings.js'

export async function saveInit(name?: string) {
	const template = InitTemplate.encodeInit(Settings.baseUrl, Settings.templatesSource)

	if (!name) {
		fs.writeFileSync(Settings.baseUrl + '/emmet-save.json', template!, 'utf8')
	} else {
		try {
			await fetch('https://nick3point5-emmet-gen-api.deno.dev/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name,
					data: template,
				}),
			})
			console.log('uploaded!')
		} catch (error) {
			console.log('something went wrong')
		}
	}
}
