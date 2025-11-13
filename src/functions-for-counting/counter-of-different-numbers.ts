import { promises as fs } from "node:fs";
import path from "node:path";
import { getAllFiles } from "../file-management";
import { collectMessage } from "./collectData"
import type { LogEntry } from "./logEntry";

const outDir  = path.join(__dirname, '../../', 'logs/output');
const conversationsDir  = path.join(__dirname, '../../', 'logs/conversations');

const visitedChats = new Set<string>();

function extractChatName(zipContent: LogEntry[]): string {
	for (const data of zipContent) {
		if (!data) continue;

		const chatName = data.message?._data?.id?.remote;
		if (chatName) {
			return chatName;
		}
	}

	return 'XXXX-XXXX';
}

async function filter(content: LogEntry[]){
    const { userQuestion, assistantAnswer } = await collectMessage(content);
    const text = `Pergunta: { ${userQuestion} }\nResposta: { ${assistantAnswer} }\n\n`;

    const chatName = extractChatName(content);
    const filePath = path.join(conversationsDir, `${chatName}.txt`);
    const isNew = !visitedChats.has(chatName);
    
    if(isNew){
        visitedChats.add(chatName)
        
        await fs.writeFile(filePath, text, "utf8");
    }else{
        await fs.appendFile(filePath, text, "utf8");
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
