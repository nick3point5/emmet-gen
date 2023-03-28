var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value) }) }
	return new (P || (P = Promise))(function (resolve, reject) {
		function fulfilled(value) { try { step(generator.next(value)) } catch (e) { reject(e) } }
		function rejected(value) { try { step(generator['throw'](value)) } catch (e) { reject(e) } }
		function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected) }
		step((generator = generator.apply(thisArg, _arguments || [])).next())
	})
}
import { InitTemplate } from '../InitTemplate/InitTemplate.js'
import fs from 'fs'
export function saveInit(settings, name) {
	return __awaiter(this, void 0, void 0, function* () {
		const template = InitTemplate.encodeInit(settings.baseUrl, settings.templatesSource)
		if (!name) {
			fs.writeFileSync(settings.baseUrl + '/emmet-save.json', template, 'utf8')
		}
		else {
			try {
				yield fetch('https://nick3point5-emmet-gen-api.deno.dev/', {
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
			}
			catch (error) {
				console.log('something went wrong')
			}
		}
	})
}
//# sourceMappingURL=saveInit.js.map