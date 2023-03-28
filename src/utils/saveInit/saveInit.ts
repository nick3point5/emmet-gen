import { InitTemplate } from "../InitTemplate/InitTemplate.js";
import type ConfigType from '../../data/emmet-gen-templates.json'
import path from "path";
import fs from "fs";

export function saveInit(settings: typeof ConfigType) {
	const template = InitTemplate.encodeInit(settings.baseUrl,settings.templatesSource)
	// fs.writeFileSync(settings.baseUrl+'/save.json', template!, 'utf8')

	
}

