import { promises as fs } from "node:fs";
import path from "node:path";
import { callLLM } from "../evals/llm-Evaluator"
import { getAllFiles } from "../file-management";

const conversationsDir  = path.join(__dirname, '../../', 'logs/conversations');

export async function countGood(){
    const allFiles = await getAllFiles(conversationsDir);
    
    if (allFiles.length === 0) {
        console.log('Nenhum arquivo encontrado em logs/output/.');
        return 0;
    }
    
    let goodConversations = 0;

    for (const f of allFiles) {
        const content = await fs.readFile(f, "utf-8")

        const response = await callLLM(content)
        if(response){
            goodConversations+=1;
        }
    }

    return goodConversations;
}
