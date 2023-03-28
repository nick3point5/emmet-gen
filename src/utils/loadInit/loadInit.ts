import { InitTemplate } from "../InitTemplate/InitTemplate.js";
import path from "path";
import fs from "fs";

export function loadInit(savePath:string) {
	const saveLocation = path.resolve(savePath)
	const template = fs.readFileSync(saveLocation, 'utf8')

	InitTemplate.createInit(process.cwd(), template)
}
