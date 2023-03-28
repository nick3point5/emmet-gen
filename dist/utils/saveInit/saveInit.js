import { InitTemplate } from "../InitTemplate/InitTemplate.js";
import fs from "fs";
export function saveInit(settings) {
    const template = InitTemplate.encodeInit(settings.baseUrl, settings.templatesSource);
    fs.writeFileSync(settings.baseUrl + '/save.json', template, 'utf8');
}
//# sourceMappingURL=saveInit.js.map