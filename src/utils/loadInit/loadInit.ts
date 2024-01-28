import { InitTemplate } from '../InitTemplate/InitTemplate.js'
import path from 'path'
import fs from 'fs'

export async function loadInit(name: string) {
	try {
		let template
		if (!name) {
			const saveLocation = path.resolve(process.cwd(), 'emmet-save.json')
			template = fs.readFileSync(saveLocation, 'utf8')
		} else {
			const result = await fetch(`https://nick3point5-emmet-gen-api.deno.dev/${name}`)
			const json = await result.json()
			template = json.data
		}

		if (typeof template !== 'string') {
			throw new Error('template is not a string')
		}

		InitTemplate.createInit(process.cwd(), template)
	} catch (error) {
		console.log('something went wrong')
	}
}
