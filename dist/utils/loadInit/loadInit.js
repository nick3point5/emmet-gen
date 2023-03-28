import { InitTemplate } from "../InitTemplate/InitTemplate.js";
import path from "path";
import fs from "fs";
export function loadInit(savePath) {
    const saveLocation = path.resolve(savePath);
    const template = fs.readFileSync(saveLocation, 'utf8');
    InitTemplate.createInit(process.cwd(), template);
    // fs.writeFileSync(settings.baseUrl+'/save.json', template!, 'utf8')
}
//# sourceMappingURL=loadInit.js.map