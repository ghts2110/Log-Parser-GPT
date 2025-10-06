import { promises as fs } from "node:fs";
import path from "node:path";

const logsDir = path.resolve(__dirname, "..", "logs/input");
const outDir  = path.join(__dirname, '..', 'logs/output');

type Dirent = import("fs").Dirent;

async function getAllLogFiles(dir: string): Promise<string[]> {
	const entries: Dirent[] = await fs.readdir(dir, { withFileTypes: true });

	const files = await Promise.all(
        entries
        .filter((entry) => !entry.name.startsWith('.')) 
        .map(async (entry) => {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) return getAllLogFiles(fullPath);
            
            return [fullPath];
        })
    );

	return files.flat();
}

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

  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(parsedLines, null, 2), "utf8");
  
  console.log(`- Copiado para JSON: ${path.relative(process.cwd(), outPath)}`);
}

(async () => {
	const allFiles = await getAllLogFiles(logsDir);
	
    if (allFiles.length === 0) {
        console.log('Nenhum arquivo encontrado em logs/input/.');
        return;
    }
        
    for (const f of allFiles) {
        await convertToJSON(f);
    }
    
})();
