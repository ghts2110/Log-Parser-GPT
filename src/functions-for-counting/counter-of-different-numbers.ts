import { promises as fs } from "node:fs";
import path from "node:path";
import { getAllFiles } from "../file-management";
import { collectData } from "./collectData"
import type { LogEntry } from "./logEntry";

const outDir  = path.join(__dirname, '../../', 'logs/output');
const conversationsDir  = path.join(__dirname, '../../', 'logs/conversations');

const visitedChats = new Set<string>();

async function filter(content: LogEntry[]){
    const { context, question, answer } = await collectData(content);
    const text = `Pergunta: { ${question} }\nResposta: { ${answer} }\n\n`;

    for (const entry of content) {
        if (!entry.message?._data?.id?.remote) continue;
        
        const num = entry.message._data.id.remote.trim();
        const filePath = path.join(conversationsDir, `${num}.txt`);

        const isNew = !visitedChats.has(num);

        if(isNew){
            visitedChats.add(num)
            
            await fs.writeFile(filePath, text, "utf8");
        }else{
            await fs.appendFile(filePath, text, "utf8");
        }
    }
}

export async function countDifferentNumbers(){
    const allFiles = await getAllFiles(outDir);
    
    if (allFiles.length === 0) {
        console.log('Nenhum arquivo encontrado em logs/output/.');
        return 0;
    }

    for (const f of allFiles) {
        const content = JSON.parse(await fs.readFile(f, 'utf8'))

        filter(content)
    }

    return visitedChats.size
}
