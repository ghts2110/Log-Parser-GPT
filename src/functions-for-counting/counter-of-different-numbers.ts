import { promises as fs } from "node:fs";
import path from "node:path";
import { getAllFiles } from "../file-management";

interface LogEntry {
  chat?: string;
  raw?: string;
}

const outDir  = path.join(__dirname, '../../', 'logs/output');
const visitedChats = new Set<string>();

function filter(parsedLines: LogEntry[]){
    for (const entry of parsedLines) {
        if (!entry.raw) continue;

        const match = entry.raw.match(/"chat"\s*:\s*"([^"]+)"/);
        if (match) {
            const chat = match[1].trim();
            console.log(chat);
            visitedChats.add(chat); 
        }
    }
}

export async function countDifferentNumbers(){
    const allFiles = await getAllFiles(outDir);
    
    if (allFiles.length === 0) {
        console.log('Nenhum arquivo encontrado em logs/input/.');
        return;
    }
    
    for (const f of allFiles) {
        const content = await fs.readFile(f, 'utf8');
        const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);

        const parsedLines = lines.map((line) => {
            try {
                return JSON.parse(line);
            } catch {
                return { raw: line };
            }
        });

        filter(parsedLines)
    }

    console.log(visitedChats.size);
}

countDifferentNumbers().catch((err) => {
  console.error("Erro no main:", err);
  process.exit(1);
});
