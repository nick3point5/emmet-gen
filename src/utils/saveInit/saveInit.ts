import { InitTemplate } from "../InitTemplate/InitTemplate.js";
import type ConfigType from '../../data/emmet-gen-templates.json'
import fs from "fs";

export async function saveInit(settings: typeof ConfigType, name?: string) {
	const template = InitTemplate.encodeInit(settings.baseUrl,settings.templatesSource)

	if(!name) {
		fs.writeFileSync(settings.baseUrl+'/emmet-save.json', template!, 'utf8')
	}else {
		try {
			await fetch(`https://nick3point5-emmet-gen-api.deno.dev/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name,
					data: template,
				})
			})
			console.log('uploaded!')
		} catch (error) {
			console.log('something went wrong')
		}

	}
}

