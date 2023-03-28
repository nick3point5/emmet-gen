import { InitTemplate } from '../InitTemplate/InitTemplate.js'
import path from 'path'
import fs from 'fs'

export async function loadInit(name: string) {
	try {
		const result = await fetch(`https://nick3point5-emmet-gen-api.deno.dev/${name}`)
		const json = await result.json()
		const template = json.data
		InitTemplate.createInit(process.cwd(), template)
		console.clear()
	} catch (error) {
		console.log('something went wrong')
	}
}
