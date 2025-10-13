import { promises as fs } from "node:fs";
import path from "node:path";
import { getAllFiles } from "../file-management";
import { removeContent } from "./remove-content";

const logsDir = path.resolve(__dirname, "../../", "logs/input");
const outDir  = path.join(__dirname, '../../', 'logs/output');

async function convertToJSON(srcPath: string) {
  const content = await fs.readFile(srcPath, 'utf8');
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);

  const parsedLines = lines.map((line) => {
    try {
      return JSON.parse(line);
    } catch {
      return { raw: line };
    }
  });

  const base = path.basename(srcPath).replace(/\.[^/.]+$/g, '');
  const outPath = path.join(outDir, `${base}.json`);

  if(removeContent(parsedLines)){
    return;
  }

  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(parsedLines, null, 2), "utf8");
}

export async function logToJson() {
    const allFiles = await getAllFiles(logsDir);
    
    if (allFiles.length === 0) {
        console.log('Nenhum arquivo encontrado em logs/input/.');
        return;
    }
        
    for (const f of allFiles) {
        await convertToJSON(f);
    }
}
