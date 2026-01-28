import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname,"..");

// console.log("dir",__dirname)
// console.log("dir name ",rootDir);

export default rootDir;
