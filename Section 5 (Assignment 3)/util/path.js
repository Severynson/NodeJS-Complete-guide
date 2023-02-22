import { dirname } from "path";
import { fileURLToPath } from "url";
const actualFolder = dirname(fileURLToPath(import.meta.url)).split("/");
actualFolder.pop();
const rootDir = actualFolder.join("/");
export default rootDir;
